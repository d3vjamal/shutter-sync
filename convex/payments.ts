import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ─── Create a payment entry ──────────────────────────────────────────────────

export const create = mutation({
    args: {
        parentId: v.string(),
        parentType: v.string(),
        photographerId: v.id("users"),
        amount: v.string(),
        date: v.string(),
        note: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("payments", args);
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

// ─── Delete a single payment entry ───────────────────────────────────────────

export const remove = mutation({
    args: { id: v.id("payments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
