import { useMemo } from 'react';

import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { groupByStatusAndMonth, type SectionKey } from '@/lib/dashboard-grouping';
import { toAssignmentCard, toFreelanceCard } from '@/lib/revenue';

/** Ongoing / upcoming / done counts across both assignments and freelance jobs. */
export function useWorkCounts(): Record<SectionKey, number> {
  const { user } = useAuth();
  const { assignments } = useAssignments(user);
  const { freelanceJobs } = useFreelanceAssignments(user);

  return useMemo(() => {
    const cards = [...assignments.map(toAssignmentCard), ...freelanceJobs.map(toFreelanceCard)];
    const grouped = groupByStatusAndMonth(cards, (c) => c.date);
    const count = (key: SectionKey) => Object.values(grouped[key]).flat().length;
    return { ongoing: count('ongoing'), upcoming: count('upcoming'), past: count('past') };
  }, [assignments, freelanceJobs]);
}
