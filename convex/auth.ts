
import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store } = convexAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Password({
            profile(params) {
                return {
                    email: params.email as string,
                    name: params.name as string,
                    contact: params.contact as string,
                    upiId: params.upiId as string,
                };
            },
        }),
    ],
});

import { mutation } from "./_generated/server";

export const seedAdmin = mutation({
    args: {},
    handler: async (ctx) => {
        // Implementation for seeding admin, currently empty to satisfy the call
    },
});
