import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { requireAdmin } from "./admin";
import { auth } from "./auth";
import { deleteAuthDataForUser } from "./authCleanup";
import { paginationOptsValidator } from "convex/server";

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
            roleName: "Photographer",
            roleCode: 1,
            active: true,
        });
        return id;
    },
});

export const list = query({
    handler: async (ctx) => {
        // Return all non-admin users (supports both legacy string roleCode and new numeric 1)
        const all = await ctx.db.query("users").collect();
        return all.filter((u) => u.roleCode !== 0);
    },
});

// Community directory for signed-in photographers, newest first and paginated
// so it scales. Exposes only public-facing fields (no email / UPI id), unlike
// `list` which returns whole user docs.
export const directory = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return { page: [], isDone: true, continueCursor: "" };

        const result = await ctx.db
            .query("users")
            .filter((q) => q.and(q.neq(q.field("roleCode"), 0), q.neq(q.field("active"), false)))
            .order("desc")
            .paginate(args.paginationOpts);

        const page = await Promise.all(
            result.page.map(async (u) => ({
                _id: u._id,
                name: u.name ?? "",
                contact: u.contact ?? "",
                address: u.address ?? "",
                instagram: u.instagram ?? "",
                facebook: u.facebook ?? "",
                twitter: u.twitter ?? "",
                youtube: u.youtube ?? "",
                linkedin: u.linkedin ?? "",
                website: u.website ?? "",
                username: u.username,
                avatarUrl:
                    u.avatarUrl && !u.avatarUrl.startsWith("http")
                        ? (await ctx.storage.getUrl(u.avatarUrl)) ?? undefined
                        : u.avatarUrl,
            })),
        );
        return { ...result, page };
    },
});

export const get = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const photographer = await ctx.db.get(args.id);
        if (!photographer) return null;

        return {
            ...photographer,
            avatarUrl: (photographer.avatarUrl && !photographer.avatarUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(photographer.avatarUrl)) ?? photographer.avatarUrl
                : photographer.avatarUrl,
            coverImageUrl: (photographer.coverImageUrl && !photographer.coverImageUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(photographer.coverImageUrl)) ?? photographer.coverImageUrl
                : photographer.coverImageUrl,
            photos: photographer.photos
                ? await Promise.all(photographer.photos.map(async (id) =>
                    (id && !id.startsWith("http")) ? (await ctx.storage.getUrl(id)) ?? id : id
                ))
                : [],
        };
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        // 1. Try username lookup first
        let photographer = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.slug))
            .unique();

        // 2. Fall back to raw document ID
        if (!photographer) {
            try {
                photographer = await ctx.db.get(args.slug as Id<"users">);
            } catch {
                return null;
            }
        }

        if (!photographer) return null;

        return {
            ...photographer,
            avatarUrl: (photographer.avatarUrl && !photographer.avatarUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(photographer.avatarUrl)) ?? photographer.avatarUrl
                : photographer.avatarUrl,
            brandLogoUrl: (photographer.brandLogoUrl && !photographer.brandLogoUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(photographer.brandLogoUrl)) ?? photographer.brandLogoUrl
                : photographer.brandLogoUrl,
            coverImageUrl: (photographer.coverImageUrl && !photographer.coverImageUrl.startsWith("http"))
                ? (await ctx.storage.getUrl(photographer.coverImageUrl)) ?? photographer.coverImageUrl
                : photographer.coverImageUrl,
            photos: photographer.photos
                ? await Promise.all(photographer.photos.map(async (photoId) =>
                    (photoId && !photoId.startsWith("http")) ? (await ctx.storage.getUrl(photoId)) ?? photoId : photoId
                ))
                : [],
        };
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
        await requireAdmin(ctx);
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const remove = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        // Also drop the user's login records, or they can never sign in again.
        await deleteAuthDataForUser(ctx, args.id);
        await ctx.db.delete(args.id);
    },
});

export const toggleActive = mutation({
    args: { id: v.id("users"), active: v.boolean() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, { active: args.active });
    },
});

export const setPdfAccess = mutation({
    args: { id: v.id("users"), canExportPdf: v.boolean() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, { canExportPdf: args.canExportPdf });
    },
});
