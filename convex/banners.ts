import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { requireAdmin } from "./admin";

const platformValidator = v.union(v.literal("all"), v.literal("web"), v.literal("mobile"));

/** Visible banners for the given platform, in display order. Any signed-in user may read. */
export const listActive = query({
    args: { platform: v.union(v.literal("web"), v.literal("mobile")) },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];
        const rows = await ctx.db.query("banners").withIndex("by_order").collect();
        const active = rows.filter(
            (b) => b.visible && (b.platform === "all" || b.platform === args.platform),
        );
        return await Promise.all(
            active.map(async (b) => ({
                _id: b._id,
                title: b.title,
                subtitle: b.subtitle,
                linkUrl: b.linkUrl,
                imageUrl: await ctx.storage.getUrl(b.imageId),
            })),
        );
    },
});

/** Every banner (including hidden) for the admin panel. */
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        const rows = await ctx.db.query("banners").withIndex("by_order").collect();
        return await Promise.all(
            rows.map(async (b) => ({ ...b, imageUrl: await ctx.storage.getUrl(b.imageId) })),
        );
    },
});

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.storage.generateUploadUrl();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        subtitle: v.optional(v.string()),
        imageId: v.string(),
        linkUrl: v.optional(v.string()),
        platform: platformValidator,
        visible: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const last = (await ctx.db.query("banners").withIndex("by_order").order("desc").first())?.order ?? 0;
        return await ctx.db.insert("banners", {
            ...args,
            visible: args.visible ?? true,
            order: last + 1,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("banners"),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        imageId: v.optional(v.string()),
        linkUrl: v.optional(v.string()),
        platform: v.optional(platformValidator),
        visible: v.optional(v.boolean()),
        order: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const { id, ...fields } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error("Banner not found");
        if (fields.imageId && fields.imageId !== existing.imageId) {
            await ctx.storage.delete(existing.imageId);
        }
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("banners") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const existing = await ctx.db.get(args.id);
        if (!existing) return;
        await ctx.storage.delete(existing.imageId);
        await ctx.db.delete(args.id);
    },
});
