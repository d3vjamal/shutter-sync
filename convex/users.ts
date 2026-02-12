
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            return null;
        }
        const user = await ctx.db.get(userId);
        return user;
    },
});

export const updateUserProfile = mutation({
    args: {
        name: v.optional(v.string()),
        contact: v.optional(v.string()),
        upiId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await ctx.db.get(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Update user profile with provided fields
        const updates: any = {};
        if (args.name !== undefined) updates.name = args.name;
        if (args.contact !== undefined) updates.contact = args.contact;
        if (args.upiId !== undefined) updates.upiId = args.upiId;

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(userId, updates);
        }

        return await ctx.db.get(userId);
    },
});

export const listPhotographers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("users")
            .withIndex("by_roleCode", (q) => q.eq("roleCode", "photographer"))
            .collect();
    },
});
