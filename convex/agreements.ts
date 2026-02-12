import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncFilter } from "convex-helpers/server/filter";

export const get = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        return await ctx.db
            .query("agreements")
            .withIndex("by_photographer", (q) => q.eq("photographerId", identity.subject))
            .collect();
    },
});

export const create = mutation({
    args: {
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const agreementId = await ctx.db.insert("agreements", {
            ...args,
            photographerId: identity.subject,
        });
        return agreementId;
    },
});

export const update = mutation({
    args: {
        id: v.id("agreements"),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("agreements") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        await ctx.db.delete(args.id);
    },
});
