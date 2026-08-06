import { v } from "convex/values";
import { mutation, query, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

// ─── Helper to sync parent paid amount ──────────────────────────────────────

async function syncParentPaidAmount(ctx: MutationCtx, parentId: string, parentType: string) {
    const allPayments = await ctx.db
        .query("payments")
        .withIndex("by_parent", (q) => q.eq("parentId", parentId))
        .collect();

    if (parentType === "assignment") {
        const totalPaid = allPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        try {
            await ctx.db.patch(parentId as Id<"assignments">, { paidAmount: totalPaid.toString() });
        } catch (e) {
            console.error("Failed to sync assignment payment", e);
        }
    } else if (parentType === "freelance") {
        const photoPaid = allPayments
            .filter(p => !p.category || p.category === "photography")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const videoPaid = allPayments
            .filter(p => p.category === "videography")
            .reduce((sum, p) => sum + Number(p.amount || 0), 0);

        try {
            await ctx.db.patch(parentId as Id<"freelanceAssignments">, { 
                photographyReceived: photoPaid.toString(),
                videographyReceived: videoPaid.toString()
            });
        } catch (e) {
            console.error("Failed to sync freelance payment", e);
        }
    }
}

// ─── Create a payment entry ──────────────────────────────────────────────────

export const create = mutation({
    args: {
        parentId: v.string(),
        parentType: v.string(),
        photographerId: v.id("users"),
        amount: v.string(),
        date: v.string(),
        note: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("payments", args);
        await syncParentPaidAmount(ctx, args.parentId, args.parentType);
        return id;
    },
});

// ─── List payments for a given parent (assignment or freelance job) ───────────

export const listByParent = query({
    args: { parentId: v.string() },
    handler: async (ctx, args) => {
        const payments = await ctx.db
            .query("payments")
            .withIndex("by_parent", (q) => q.eq("parentId", args.parentId))
            .collect();
        // Sort newest first
        return payments.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateB !== dateA) return dateB - dateA;
            return b._creationTime - a._creationTime;
        });
    },
});

// ─── Authenticated: earnings history for the dashboard ─────────────────────

export const listMine = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        return await ctx.db
            .query("payments")
            .withIndex("by_photographer", (q) =>
                q.eq("photographerId", userId.toString())
            )
            .collect();
    },
});

// ─── Delete a single payment entry ───────────────────────────────────────────

export const remove = mutation({
    args: { id: v.id("payments") },
    handler: async (ctx, args) => {
        const payment = await ctx.db.get(args.id);
        if (payment) {
            const { parentId, parentType } = payment;
            await ctx.db.delete(args.id);
            await syncParentPaidAmount(ctx, parentId, parentType);
        }
    },
});
// ─── Record payment from public client portal ───────────────────────────────

export const recordPublicPayment = mutation({
    args: {
        parentId: v.string(),
        parentType: v.string(),
        amount: v.string(),
        note: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let photographerId;
        if (args.parentType === "assignment") {
            const assignment = await ctx.db.get(args.parentId as Id<"assignments">);
            if (!assignment) throw new Error("Assignment not found");
            photographerId = assignment.photographerId;
        } else {
            const job = await ctx.db.get(args.parentId as Id<"freelanceAssignments">);
            if (!job) throw new Error("Freelance job not found");
            photographerId = job.photographerId;
        }

        const id = await ctx.db.insert("payments", {
            parentId: args.parentId,
            parentType: args.parentType,
            photographerId: photographerId,
            amount: args.amount,
            date: new Date().toISOString(),
            note: args.note || "Online payment via client portal",
            category: "photography",
        });

        await syncParentPaidAmount(ctx, args.parentId, args.parentType);
        return id;
    },
});

// ─── Data Migration: Reconcile legacy fields and create payments ────────────

export const migrateLegacyPayments = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        const photographerId = userId.toString();

        const assignments = await ctx.db
            .query("assignments")
            .withIndex("by_photographer", (q) =>
                q.eq("photographerId", photographerId)
            )
            .collect();
        const freelanceJobs = await ctx.db
            .query("freelanceAssignments")
            .withIndex("by_photographer", (q) =>
                q.eq("photographerId", photographerId)
            )
            .collect();

        // 1. Assignments migration
        for (const a of assignments) {
            const existingPayments = await ctx.db
                .query("payments")
                .withIndex("by_parent", (q) => q.eq("parentId", a._id))
                .collect();
            
            if (existingPayments.length === 0 && a.paidAmount && parseFloat(a.paidAmount) > 0) {
                await ctx.db.insert("payments", {
                    parentId: a._id,
                    parentType: "assignment",
                    photographerId: a.photographerId,
                    amount: a.paidAmount,
                    date: a.eventStartDate || new Date(a._creationTime).toISOString(),
                    note: "Migrated from legacy balance",
                    category: "photography",
                });
                // Sync to ensure fields are perfectly aligned
                await syncParentPaidAmount(ctx, a._id, "assignment");
            }
        }

        // 2. Freelance migration
        for (const j of freelanceJobs) {
            // First, migrate legacy TOTAL fields to new ones if needed
            const updates: any = {};
            if (!j.photographyAmount && (j as any).photographerAmount) {
                updates.photographyAmount = (j as any).photographerAmount;
            }
            if (!j.videographyAmount && (j as any).videographerAmount) {
                updates.videographyAmount = (j as any).videographerAmount;
            }
            
            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(j._id, updates);
            }

            // Then check for payments
            const existingPayments = await ctx.db
                .query("payments")
                .withIndex("by_parent", (q) => q.eq("parentId", j._id))
                .collect();
            
            if (existingPayments.length === 0) {
                const photoRec = j.photographyReceived || "0";
                const videoRec = j.videographyReceived || "0";

                let didMigrate = false;
                if (parseFloat(photoRec) > 0) {
                    await ctx.db.insert("payments", {
                        parentId: j._id,
                        parentType: "freelance",
                        photographerId: j.photographerId,
                        amount: photoRec,
                        date: j.dates?.[0] || new Date(j._creationTime).toISOString(),
                        note: "Migrated photography balance",
                        category: "photography",
                    });
                    didMigrate = true;
                }
                if (parseFloat(videoRec) > 0) {
                    await ctx.db.insert("payments", {
                        parentId: j._id,
                        parentType: "freelance",
                        photographerId: j.photographerId,
                        amount: videoRec,
                        date: j.dates?.[0] || new Date(j._creationTime).toISOString(),
                        note: "Migrated videography balance",
                        category: "videography",
                    });
                    didMigrate = true;
                }
                if (didMigrate) {
                    await syncParentPaidAmount(ctx, j._id, "freelance");
                }
            }
        }
        
        return { status: "success", assignments: assignments.length, jobs: freelanceJobs.length };
    },
});
