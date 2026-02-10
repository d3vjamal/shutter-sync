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
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .unique();
        if (existing) throw new Error("Photographer with this email already exists");

        // Note: Password handling should be done via Convex Auth signUp,
        // but for manual onboarding by admin, we create the user metadata here.
        // They will likely need to reset password or be invited.
        const { password, ...userData } = args;
        const id = await ctx.db.insert("users", {
            ...userData,
            // new structured role fields
            role: "photographer",
            roleName: "Photographer",
            roleCode: "photographer",
            active: true,
        });
        return id;
    },
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("users")
            .withIndex("by_roleCode", (q) => q.eq("roleCode", "photographer"))
            .collect();
    },
});

export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .unique();
    },
});

export const update = mutation({
    args: {
        id: v.id("users"),
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
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
