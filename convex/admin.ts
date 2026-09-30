import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

/** Throws unless the caller is signed in as an admin (roleCode 0). Returns the admin's user id. */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user || user.roleCode !== 0) throw new Error("Admin access required");
    return userId;
}
