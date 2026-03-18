import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        photographerId:          v.id("users"),
        studioName:              v.string(),
        studioOwnerName:         v.string(),
        studioMobile:            v.string(),
        studioEmail:             v.optional(v.string()),
        studioArea:              v.optional(v.string()),
        venue:                   v.string(),
        location:                v.optional(v.string()),
        dates:                   v.array(v.string()),
        // Photography
        photographerName:        v.string(),
        photographerMobile:      v.optional(v.string()),
        photographerEmail:       v.optional(v.string()),
        photographyAmount:       v.optional(v.string()),
        photographyReceived:     v.optional(v.string()),
        photographyFootageTypes: v.optional(v.array(v.string())),
        // Videography
        hasVideography:          v.optional(v.boolean()),
        videographerName:        v.optional(v.string()),
        videographerMobile:      v.optional(v.string()),
        videographerEmail:       v.optional(v.string()),
        videographyAmount:       v.optional(v.string()),
        videographyReceived:     v.optional(v.string()),
        videographyFootageTypes: v.optional(v.array(v.string())),
        // Equipment & Terms
        gadgets:                 v.optional(v.array(v.string())),
        conditions:              v.optional(v.array(v.string())),
        status:                  v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("freelanceAssignments", args);
    },
});

export const update = mutation({
    args: {
        id:                      v.id("freelanceAssignments"),
        studioName:              v.optional(v.string()),
        studioOwnerName:         v.optional(v.string()),
        studioMobile:            v.optional(v.string()),
        studioEmail:             v.optional(v.string()),
        studioArea:              v.optional(v.string()),
        venue:                   v.optional(v.string()),
        location:                v.optional(v.string()),
        dates:                   v.optional(v.array(v.string())),
        // Photography
        photographerName:        v.optional(v.string()),
        photographerMobile:      v.optional(v.string()),
        photographerEmail:       v.optional(v.string()),
        photographyAmount:       v.optional(v.string()),
        photographyReceived:     v.optional(v.string()),
        photographyFootageTypes: v.optional(v.array(v.string())),
        // Videography
        hasVideography:          v.optional(v.boolean()),
        videographerName:        v.optional(v.string()),
        videographerMobile:      v.optional(v.string()),
        videographerEmail:       v.optional(v.string()),
        videographyAmount:       v.optional(v.string()),
        videographyReceived:     v.optional(v.string()),
        videographyFootageTypes: v.optional(v.array(v.string())),
        // Equipment & Terms
        gadgets:                 v.optional(v.array(v.string())),
        conditions:              v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    },
});

export const updateStatus = mutation({
    args: { id: v.id("freelanceAssignments"), status: v.string() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

export const remove = mutation({
    args: { id: v.id("freelanceAssignments") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const listByPhotographer = query({
    args: { photographerId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("freelanceAssignments")
            .withIndex("by_photographer", (q) => q.eq("photographerId", args.photographerId))
            .collect();
    },
});

export const get = query({
    args: { id: v.id("freelanceAssignments") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);
        if (!job) return null;
        const photographer = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), job.photographerId))
            .first();
        return {
            ...job,
            creatorName:    photographer?.name || "Photographer",
            creatorContact: photographer?.contact || "",
        };
    },
});
