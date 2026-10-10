import { internalMutation, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Removes every Convex Auth record that belongs to a user (login accounts,
 * sessions, refresh tokens, verification codes). Deleting only the `users`
 * row leaves an orphaned account behind, and the next sign-in with that
 * Google/password account then fails with "Could not update user document".
 */
export async function deleteAuthDataForUser(ctx: MutationCtx, userId: Id<"users">) {
    const accounts = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
        .collect();
    for (const account of accounts) {
        const codes = await ctx.db
            .query("authVerificationCodes")
            .withIndex("accountId", (q) => q.eq("accountId", account._id))
            .collect();
        for (const code of codes) await ctx.db.delete(code._id);
        await ctx.db.delete(account._id);
    }

    const sessions = await ctx.db
        .query("authSessions")
        .withIndex("userId", (q) => q.eq("userId", userId))
        .collect();
    for (const session of sessions) {
        const tokens = await ctx.db
            .query("authRefreshTokens")
            .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
            .collect();
        for (const token of tokens) await ctx.db.delete(token._id);
        await ctx.db.delete(session._id);
    }
}

/** One-off repair: run with `npx convex run authCleanup:removeOrphanedAuthAccounts`. */
export const removeOrphanedAuthAccounts = internalMutation({
    args: {},
    handler: async (ctx) => {
        const accounts = await ctx.db.query("authAccounts").collect();
        const orphanedUserIds = new Set<Id<"users">>();
        for (const account of accounts) {
            if (!(await ctx.db.get(account.userId))) orphanedUserIds.add(account.userId);
        }
        for (const userId of orphanedUserIds) {
            await deleteAuthDataForUser(ctx, userId);
        }
        return { removedUsers: orphanedUserIds.size };
    },
});
