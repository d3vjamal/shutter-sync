import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      style={[
        styles.base,
        {
          backgroundColor: checked ? theme.primary : 'transparent',
          borderColor: checked ? theme.primary : theme.border,
        },
      ]}>
      {checked && <Check size={14} color={theme.onPrimary} strokeWidth={3} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 22,
    height: 22,
    borderRadius: Radius / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
