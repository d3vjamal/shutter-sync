import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';

import { api } from '@convex/_generated/api';

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);

  return { user, signIn, signOut };
}
