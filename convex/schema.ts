import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerified: v.optional(v.boolean()),
        emailVerificationTime: v.optional(v.number()),
        contact: v.optional(v.string()),
        upiId: v.optional(v.string()),
        role: v.optional(v.string()),
    }).index("email", ["email"]),
    admins: defineTable({
        email: v.string(),
        password: v.string(), // In a real app, use proper auth like Clerk or Auth.js
        name: v.string(),
    }).index("by_email", ["email"]),

    photographers: defineTable({
        name: v.string(),
        email: v.string(),
        contact: v.string(),
        upiId: v.string(),
        password: v.string(),
        active: v.boolean(),
    }).index("by_email", ["email"]),

    assignments: defineTable({
        photographerId: v.id("photographers"),
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
