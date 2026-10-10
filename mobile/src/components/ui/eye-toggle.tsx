import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useMoney } from '@/hooks/use-money';

/** Eye button for a ScreenHeader's `right` slot that hides or reveals all amounts. */
export function EyeToggle() {
  const { hidden, toggle } = useMoney();
  const Icon = hidden ? EyeOff : Eye;
  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={hidden ? 'Show amounts' : 'Hide amounts'}>
      <Icon size={20} color="#fff" />
    </Pressable>
  );
}
