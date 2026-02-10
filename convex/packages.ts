import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        photographerId: v.id("users"),
        name: v.string(),
        description: v.string(),
        amount: v.string(),
        services: v.array(v.string()),
        clientName: v.optional(v.string()),
        clientContact: v.optional(v.string()),
        eventStartDate: v.optional(v.string()),
        eventDuration: v.optional(v.number()),
        photographerDays: v.optional(v.array(v.string())),
        location: v.optional(v.string()),
        venue: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("packages", {
            ...args,
            active: true,
        });
    },
});

export const listByPhotographer = query({
    args: { photographerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("packages")
            .withIndex("by_photographer", (q) => q.eq("photographerId", args.photographerId))
            .filter((q) => q.eq(q.field("active"), true))
            .collect();
    },
});

export const getById = query({
    args: { id: v.id("packages") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getWithPhotographer = query({
    args: { id: v.id("packages") },
    handler: async (ctx, args) => {
        const pkg = await ctx.db.get(args.id);
        if (!pkg) return null;
        const photographer = await ctx.db.get(pkg.photographerId);
        return { ...pkg, photographerName: photographer?.name, photographerContact: photographer?.contact, photographerUPI: photographer?.upiId };
    },
});

export const remove = mutation({
    args: { id: v.id("packages") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { active: false });
    },
});
