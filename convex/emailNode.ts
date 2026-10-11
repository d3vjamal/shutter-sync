"use node";

import { v } from "convex/values";
import nodemailer from "nodemailer";
import { internalAction } from "./_generated/server";

const APP_NAME = "ShutterSync";

const shell = (title: string, body: string) => `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="margin:0 0 16px">${title}</h2>
  ${body}
  <p style="color:#888;font-size:12px;margin-top:32px">${APP_NAME}</p>
</div>`;

const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(kind: "welcome" | "reset", name: string | undefined, code: string | undefined) {
    if (kind === "reset") {
        return {
            subject: `${APP_NAME} password reset code`,
            html: shell(
                "Reset your password",
                `<p>Use this code to reset your password. It expires in 20 minutes.</p>
                 <p style="font-size:32px;letter-spacing:6px;font-weight:bold">${escapeHtml(code ?? "")}</p>
                 <p>If you didn't request this, you can ignore this email.</p>`,
            ),
        };
    }
    return {
        subject: `Welcome to ${APP_NAME}`,
        html: shell(
            `Welcome${name ? `, ${escapeHtml(name)}` : ""}!`,
            `<p>Your ${APP_NAME} account is ready. You can now manage your assignments, packages and payments.</p>`,
        ),
    };
}

export const sendEmail = internalAction({
    args: {
        to: v.string(),
        kind: v.union(v.literal("welcome"), v.literal("reset")),
        name: v.optional(v.string()),
        code: v.optional(v.string()),
    },
    handler: async (_ctx, { to, kind, name, code }) => {
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;
        if (!user || !pass) {
            throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set in the Convex environment");
        }
        const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
        const { subject, html } = render(kind, name, code);
        await transporter.sendMail({ from: `${APP_NAME} <${user}>`, to, subject, html });
    },
});
