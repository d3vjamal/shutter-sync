import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const isOwnedByUser = (photographerId: string, userId: string) =>
    photographerId === userId || photographerId.startsWith(`${userId}|`);

export const get = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const stableUserId = userId.toString();
        const currentAgreements = await ctx.db
            .query("agreements")
            .withIndex("by_photographer", (q) => q.eq("photographerId", stableUserId))
            .collect();

        // Older records used identity.subject, which includes a session ID
        // (`userId|sessionId`) and therefore changed after every login.
        const legacyAgreements = (await ctx.db.query("agreements").collect())
            .filter((agreement) =>
                agreement.photographerId.startsWith(`${stableUserId}|`),
            );

        return [...currentAgreements, ...legacyAgreements];
    },
});

export const create = mutation({
    args: {
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const agreementId = await ctx.db.insert("agreements", {
            ...args,
            photographerId: userId.toString(),
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
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const { id, ...fields } = args;
        const agreement = await ctx.db.get(id);
        if (!agreement || !isOwnedByUser(agreement.photographerId, userId.toString())) {
            throw new Error("Agreement not found");
        }
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("agreements") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }
        const agreement = await ctx.db.get(args.id);
        if (!agreement || !isOwnedByUser(agreement.photographerId, userId.toString())) {
            throw new Error("Agreement not found");
        }
        await ctx.db.delete(args.id);
    },
});
