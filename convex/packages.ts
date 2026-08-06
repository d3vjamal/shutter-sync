import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// ─── Public query — used by PublicPhotographerPage ────────────────────────────

export const listByPhotographer = query({
    args: { photographerId: v.string() },
    handler: async (ctx, args) => {
        const packages = await ctx.db
            .query("packages")
            .withIndex("by_photographer", (q) =>
                q.eq("photographerId", args.photographerId)
            )
            .collect();
        return packages.filter((pkg) => pkg.visible !== false);
    },
});

// ─── Authenticated: list my own packages ─────────────────────────────────────

export const listMine = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];
        return await ctx.db
            .query("packages")
            .withIndex("by_photographer", (q) =>
                q.eq("photographerId", userId.toString())
            )
            .collect();
    },
});

// ─── Create ───────────────────────────────────────────────────────────────────

export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        services: v.array(v.string()),
        price: v.optional(v.string()),
        popular: v.optional(v.boolean()),
        visible: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        await ctx.db.insert("packages", {
            ...args,
            visible: args.visible ?? true,
            photographerId: userId.toString(),
        });
    },
});

// ─── Update ───────────────────────────────────────────────────────────────────

export const update = mutation({
    args: {
        id: v.id("packages"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        services: v.optional(v.array(v.string())),
        price: v.optional(v.string()),
        popular: v.optional(v.boolean()),
        visible: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        const { id, ...fields } = args;
        const pkg = await ctx.db.get(id);
        if (!pkg || pkg.photographerId !== userId.toString()) {
            throw new Error("Package not found");
        }
        await ctx.db.patch(id, fields);
    },
});

// ─── Remove ───────────────────────────────────────────────────────────────────

export const remove = mutation({
    args: { id: v.id("packages") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        const pkg = await ctx.db.get(args.id);
        if (!pkg || pkg.photographerId !== userId.toString()) {
            throw new Error("Package not found");
        }
        await ctx.db.delete(args.id);
    },
});
