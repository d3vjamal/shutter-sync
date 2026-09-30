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

// The mobile app finishes OAuth via this deep link; without allowing it here
// Convex Auth only accepts SITE_URL-relative redirects and sends users to the web app.
const MOBILE_REDIRECT_PREFIX = "shuttersync://auth-callback";

export const { auth, signIn, signOut, store } = convexAuth({
    providers,
    callbacks: {
        async redirect({ redirectTo }) {
            if (redirectTo.startsWith(MOBILE_REDIRECT_PREFIX)) {
                return redirectTo;
            }
            const baseUrl = (process.env.SITE_URL ?? "").replace(/\/$/, "");
            if (redirectTo.startsWith("?") || redirectTo.startsWith("/")) {
                return `${baseUrl}${redirectTo}`;
            }
            if (redirectTo.startsWith(baseUrl)) {
                const after = redirectTo[baseUrl.length];
                if (after === undefined || after === "?" || after === "/") {
                    return redirectTo;
                }
            }
            throw new Error(`Invalid \`redirectTo\` ${redirectTo} for configured SITE_URL: ${baseUrl}`);
        },
    },
});

