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
        roleCode: v.optional(v.string()), // machine code, e.g. "photographer"
        active: v.optional(v.boolean()),
    })
        .index("email", ["email"])
        .index("by_role", ["role"]) // legacy
        .index("by_roleCode", ["roleCode"]),

    packages: defineTable({
        photographerId: v.string(), // TODO: migrate to v.id("users")
        name: v.string(),
        description: v.string(),
        amount: v.string(),
        services: v.array(v.string()),
        clientName: v.optional(v.string()),
        clientContact: v.optional(v.string()),
        eventStartDate: v.optional(v.string()),
        eventDuration: v.optional(v.number()),
        photographerDays: v.optional(v.array(v.string())),
        location: v.optional(v.string()),
        venue: v.optional(v.string()),
        active: v.boolean(),
    }).index("by_photographer", ["photographerId"]),

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
    }).index("by_photographer", ["photographerId"]),
});
