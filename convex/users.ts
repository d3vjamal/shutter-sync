
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
        if (!user) return null;

        return {
            ...user,
            avatarUrl: (user.avatarUrl && !user.avatarUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(user.avatarUrl)) ?? user.avatarUrl
                : user.avatarUrl,
            photos: user.photos
                ? await Promise.all(user.photos.map(async (id) =>
                    (id && !id.startsWith("http")) ? (await ctx.storage.getUrl(id)) ?? id : id
                ))
                : [],
        };
    },
});

export const updateUserProfile = mutation({
    args: {
        name: v.optional(v.string()),
        contact: v.optional(v.string()),
        upiId: v.optional(v.string()),
        bio: v.optional(v.string()),
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        twitter: v.optional(v.string()),
        photos: v.optional(v.array(v.string())),
        avatarUrl: v.optional(v.string()),
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
        if (args.bio !== undefined) updates.bio = args.bio;
        if (args.instagram !== undefined) updates.instagram = args.instagram;
        if (args.facebook !== undefined) updates.facebook = args.facebook;
        if (args.twitter !== undefined) updates.twitter = args.twitter;
        if (args.photos !== undefined) updates.photos = args.photos;
        if (args.avatarUrl !== undefined) updates.avatarUrl = args.avatarUrl;

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(userId, updates);
        }

        return await ctx.db.get(userId);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const listPhotographers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("users")
            .withIndex("by_roleCode", (q) => q.eq("roleCode", 1))
            .collect();
    },
});
