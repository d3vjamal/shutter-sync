import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,
    users: defineTable({
        ...authTables.users.validator.fields,
        contact: v.optional(v.string()),
        upiId: v.optional(v.string()),
        // Keep legacy `role` for compatibility, and add structured role fields
        role: v.optional(v.string()), // deprecated
        roleName: v.optional(v.string()), // human-friendly name, e.g. "Photographer"
        roleCode: v.optional(v.union(v.number(), v.string())), // 0=admin, 1=photographer, 2=users
        active: v.optional(v.boolean()),
        bio: v.optional(v.string()),
        instagram: v.optional(v.string()),
        facebook: v.optional(v.string()),
        twitter: v.optional(v.string()),
        photos: v.optional(v.array(v.string())),
        avatarUrl: v.optional(v.string()),
        brandLogoUrl: v.optional(v.string()),
        username: v.optional(v.string()),
    })
        .index("email", ["email"])
        .index("by_role", ["role"]) // legacy
        .index("by_roleCode", ["roleCode"])
        .index("by_username", ["username"]),

    assignments: defineTable({
        photographerId: v.string(), // TODO: migrate to v.id("users")
        // Event Details (formerly in Package)
        title: v.string(), // renamed from packageName/name
        description: v.optional(v.string()),
        services: v.array(v.string()),
        amount: v.string(), // Total value

        // Client Details
        clientName: v.string(),
        clientContact: v.string(),

        // New Wedding Details
        brideName: v.optional(v.string()),
        groomName: v.optional(v.string()),
        isBothSides: v.optional(v.boolean()),
        brideLocation: v.optional(v.string()),
        brideVenue: v.optional(v.string()),
        groomLocation: v.optional(v.string()),
        groomVenue: v.optional(v.string()),

        // Logistics
        eventStartDate: v.optional(v.string()),
        eventDuration: v.optional(v.number()),
        photographerDays: v.optional(v.array(v.string())),
        location: v.optional(v.string()),
        venue: v.optional(v.string()),
        // Status & Payment
        status: v.string(), // "Ongoing", "Completed"
        captureDate: v.optional(v.string()), // Main shoot date or next action
        paidAmount: v.string(),
        conditions: v.optional(v.array(v.string())),
    })
        .index("by_photographer", ["photographerId"])
        .index("by_status", ["status"]),

    agreements: defineTable({
        description: v.string(),
        photographerId: v.string(),
    }).index("by_photographer", ["photographerId"]),

    packages: defineTable({
        photographerId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        services: v.array(v.string()),
        price: v.optional(v.string()),
        popular: v.optional(v.boolean()),
    }).index("by_photographer", ["photographerId"]),

    freelanceAssignments: defineTable({
        photographerId: v.string(),

        // Studio Info
        studioName: v.string(),
        studioOwnerName: v.string(),
        studioMobile: v.string(),
        studioEmail: v.optional(v.string()),
        studioArea: v.optional(v.string()),

        // Wedding Details
        brideName: v.optional(v.string()),
        groomName: v.optional(v.string()),

        // Work Details
        venue: v.string(),
        location: v.optional(v.string()),
        dates: v.array(v.string()),

        // Photography
        photographerName: v.string(),
        photographerMobile: v.optional(v.string()),
        photographerEmail: v.optional(v.string()),
        photographyAmount: v.optional(v.string()),
        photographyReceived: v.optional(v.string()),
        photographyFootageTypes: v.optional(v.array(v.string())),

        // Videography (optional section)
        hasVideography: v.optional(v.boolean()),
        videographerName: v.optional(v.string()),
        videographerMobile: v.optional(v.string()),
        videographerEmail: v.optional(v.string()),
        videographyAmount: v.optional(v.string()),
        videographyReceived: v.optional(v.string()),
        videographyFootageTypes: v.optional(v.array(v.string())),

        // Legacy fields — kept optional so existing documents remain valid
        totalAmount: v.optional(v.string()),
        photographerAmount: v.optional(v.string()),
        videographerAmount: v.optional(v.string()),
        footageTypes: v.optional(v.array(v.string())),
        teamMobile: v.optional(v.string()),
        teamEmail: v.optional(v.string()),

        // Equipment
        gadgets: v.optional(v.array(v.string())),

        // Terms
        conditions: v.optional(v.array(v.string())),

        // Status
        status: v.string(),
    })
        .index("by_photographer", ["photographerId"])
        .index("by_status", ["status"]),

    payments: defineTable({
        parentId: v.string(),       // assignment or freelance job _id
        parentType: v.string(),     // "assignment" | "freelance"
        photographerId: v.string(),
        amount: v.string(),
        date: v.string(),           // ISO date string e.g. "2026-04-01"
        note: v.optional(v.string()),
    })
        .index("by_parent", ["parentId"])
        .index("by_photographer", ["photographerId"]),
});
