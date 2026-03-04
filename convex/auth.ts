import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

const providers = [
    Password({
        profile(params) {
            return {
                email: params.email as string,
                name: params.name as string,
                roleCode: 1,
                roleName: "Photographer",
                active: true,
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
                    roleCode: 1,
                    roleName: "Photographer",
                    active: true,
                };
            },
        }),
    );
}

export const { auth, signIn, signOut, store } = convexAuth({
    providers,
});

