import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        photographerId: v.id("users"),
        title: v.string(),
        description: v.optional(v.string()),
        services: v.array(v.string()),
        amount: v.string(),
        clientName: v.string(),
        clientContact: v.string(),
        eventStartDate: v.optional(v.string()),
        eventDuration: v.optional(v.number()),
        photographerDays: v.optional(v.array(v.string())),
        location: v.optional(v.string()),
        venue: v.optional(v.string()),
        status: v.string(),
        captureDate: v.optional(v.string()),
        paidAmount: v.string(),
        conditions: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("assignments", args);
    },
});

export const listByPhotographer = query({
    args: { photographerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("assignments")
            .withIndex("by_photographer", (q) => q.eq("photographerId", args.photographerId))
            .collect();
    },
});

export const get = query({
    args: { id: v.id("assignments") },
    handler: async (ctx, args) => {
        const assignment = await ctx.db.get(args.id);
        if (!assignment) return null;

        const photographer = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), assignment.photographerId))
            .first();

        return {
            ...assignment,
            photographerName: photographer?.name || "Photographer",
            photographerContact: photographer?.contact || "",
            photographerUPI: photographer?.upiId || "", // Provide fallback if needed, or handle in UI
        };
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("assignments"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const updateCaptureDate = mutation({
    args: {
        id: v.id("assignments"),
        captureDate: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { captureDate: args.captureDate });
    },
});

export const update = mutation({
    args: {
        id: v.id("assignments"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        amount: v.optional(v.string()),
        clientName: v.optional(v.string()),
        clientContact: v.optional(v.string()),
        paidAmount: v.optional(v.string()),
        eventStartDate: v.optional(v.string()),
        eventDuration: v.optional(v.number()),
        location: v.optional(v.string()),
        venue: v.optional(v.string()),
        services: v.optional(v.array(v.string())),
        photographerDays: v.optional(v.array(v.string())),
        conditions: v.optional(v.array(v.string())),
        // Add other fields as necessary
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("assignments").collect();
    },
});

export const calculateTotalRevenue = query({
    args: {},
    handler: async (ctx) => {
        const completedAssignments = await ctx.db
            .query("assignments")
            .withIndex("by_status", (q) => q.eq("status", "Completed"))
            .collect();

        return completedAssignments.reduce((total, assignment) => {
            return total + parseFloat(assignment.paidAmount || "0");
        }, 0);
    },
});
