import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

const providers = [
    Password({
        profile(params) {
            return {
                email: params.email as string,
                name: params.name as string,
                role: "photographer",
            };
        },
    }),
];

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    name: profile.name,
                    image: profile.picture,
                    role: "photographer",
                };
            },
        }),
    );
}

export const { auth, signIn, signOut, store } = convexAuth({
    providers,
});

import { mutation } from "./_generated/server";

export const seedAdmin = mutation({
    args: {},
    handler: async (ctx) => {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            console.error("ADMIN_EMAIL environment variable not set.");
            return;
        }

        // Check if an admin user already exists
        const existingAdmin = await ctx.db
            .query("users")
            .withIndex("by_roleCode", (q) => q.eq("roleCode", 0))
            .first();

        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        // Create the admin user
        await ctx.db.insert("users", {
            email: adminEmail,
            name: "Admin",
            roleCode: 0, // 0 = admin
            roleName: "Administrator",
            active: true,
        });
        console.log("Admin user created successfully.");
    },
});
