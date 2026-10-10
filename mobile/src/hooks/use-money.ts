import { useSyncExternalStore } from 'react';

let hidden = false;
const listeners = new Set<() => void>();

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

/** Shared "hide amounts" privacy toggle: every screen using it hides/shows money together. */
export function useMoney() {
  const isHidden = useSyncExternalStore(subscribe, () => hidden);
  const toggle = () => {
    hidden = !hidden;
    listeners.forEach((fn) => fn());
  };
  const money = (n: number) => (isHidden ? '₹ ••••' : `₹${n.toLocaleString()}`);
  return { hidden: isHidden, toggle, money };
}
