
import { query, mutation, action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { retrieveAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

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
            brandLogoUrl: (user.brandLogoUrl && !user.brandLogoUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(user.brandLogoUrl)) ?? user.brandLogoUrl
                : user.brandLogoUrl,
            coverImageUrl: (user.coverImageUrl && !user.coverImageUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(user.coverImageUrl)) ?? user.coverImageUrl
                : user.coverImageUrl,
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
        brandLogoUrl: v.optional(v.string()),
        coverImageUrl: v.optional(v.string()),
        username: v.optional(v.string()),
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
        if (args.brandLogoUrl !== undefined) updates.brandLogoUrl = args.brandLogoUrl;
        if (args.coverImageUrl !== undefined) updates.coverImageUrl = args.coverImageUrl;
        if (args.username !== undefined) updates.username = args.username || undefined;

        if (Object.keys(updates).length > 0) {
            await ctx.db.patch(userId, updates);
        }

        return await ctx.db.get(userId);
    },
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const checkUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        if (!args.username) return { available: false };
        const existing = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .unique();
        const currentUserId = await auth.getUserId(ctx);
        // Available if nobody has it, or it belongs to the current user
        const available = !existing || existing._id === currentUserId;
        return { available };
    },
});

export const emailExists = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .unique();
        return !!user;
    },
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

// Internal — used only by the updatePassword action below
export const getViewerEmail = internalQuery({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        return (user as any)?.email ?? null;
    },
});

export const updatePassword = action({
    args: {
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        if (args.newPassword.length < 8) {
            throw new Error("New password must be at least 8 characters");
        }

        const email = await ctx.runQuery(internal.users.getViewerEmail);
        if (!email) throw new Error("Could not resolve account email");

        // Verifies current password — throws on wrong password or rate limit
        await retrieveAccount(ctx, {
            provider: "password",
            account: { id: email, secret: args.currentPassword },
        });

        // Update to new password (hashed internally by convex-auth)
        await modifyAccountCredentials(ctx, {
            provider: "password",
            account: { id: email, secret: args.newPassword },
        });
    },
});
