import type { Doc } from '@convex/_generated/dataModel';

export type AppStackParamList = {
  Tabs: undefined;
  CreateAssignment: { assignment?: Doc<'assignments'> } | undefined;
  CreateFreelance: { job?: Doc<'freelanceAssignments'> } | undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  AdminBlocked: undefined;
  App: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Packages: undefined;
  CreateAction: undefined;
  Business: undefined;
  Profile: undefined;
};
