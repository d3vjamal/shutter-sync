import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

// Auth provider callbacks run in the default runtime (no nodemailer), so the
// reset-code email is relayed here and sent from the Node action.
http.route({
    path: "/internal/send-reset-email",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const secret = process.env.EMAIL_RELAY_SECRET;
        if (!secret || request.headers.get("x-relay-secret") !== secret) {
            return new Response("Forbidden", { status: 403 });
        }
        const { to, code } = await request.json();
        await ctx.runAction(internal.emailNode.sendEmail, { to, code, kind: "reset" });
        return new Response("ok");
    }),
});

export default http;
