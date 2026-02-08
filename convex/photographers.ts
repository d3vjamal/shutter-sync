import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        contact: v.string(),
        upiId: v.string(),
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("photographers")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
        if (existing) throw new Error("Photographer with this email already exists");

        const id = await ctx.db.insert("photographers", {
            ...args,
            active: true,
        });
        return id;
    },
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query("photographers").collect();
    },
});

export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("photographers")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

export const update = mutation({
    args: {
        id: v.id("photographers"),
        name: v.optional(v.string()),
        contact: v.optional(v.string()),
        upiId: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("photographers") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
