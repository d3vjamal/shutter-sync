import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { Email } from "@convex-dev/auth/providers/Email";
import { internal } from "./_generated/api";

// 8-digit one-time code, works the same on web and mobile (no deep link needed).
const ResetEmail = Email({
    id: "password-reset",
    maxAge: 60 * 20,
    async generateVerificationToken() {
        const bytes = new Uint32Array(1);
        crypto.getRandomValues(bytes);
        return String(bytes[0] % 100_000_000).padStart(8, "0");
    },
    async sendVerificationRequest({ identifier: email, token }) {
        const res = await fetch(`${process.env.CONVEX_SITE_URL}/internal/send-reset-email`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-relay-secret": process.env.EMAIL_RELAY_SECRET ?? "",
            },
            body: JSON.stringify({ to: email, code: token }),
        });
        if (!res.ok) throw new Error("Could not send password reset email");
    },
});

const providers = [
    Password({
        reset: ResetEmail,
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
        async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
            if (existingUserId) return;
            const user = await ctx.db.get(userId);
            if (!user?.email) return;
            await ctx.scheduler.runAfter(0, internal.emailNode.sendEmail, {
                to: user.email as string,
                kind: "welcome",
                name: user.name as string | undefined,
            });
        },
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

