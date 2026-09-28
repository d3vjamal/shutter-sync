import { CalendarPlus, Plus } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useGradients, useTheme } from '@/hooks/use-theme';

/** Square gradient "+" button that sits beside a text input. */
export function AddButton({ onPress }: { onPress: () => void }) {
  const gradients = useGradients();
  return (
    <PressableScale onPress={onPress} scaleTo={0.9} style={styles.add} contentStyle={styles.addInner}>
      <Gradient colors={gradients.primary} radius={14} style={StyleSheet.absoluteFill} />
      <Plus size={20} color="#fff" strokeWidth={3} />
    </PressableScale>
  );
}

/** Dashed tile for adding a date. */
export function AddDateButton({ onPress, label = 'Add a date' }: { onPress: () => void; label?: string }) {
  const theme = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.98}
      style={[styles.date, { borderColor: theme.primary + '77', backgroundColor: theme.primary + '0D' }]}
      contentStyle={styles.dateInner}>
      <CalendarPlus size={18} color={theme.primary} />
      <ThemedText type="smallBold" themeColor="primary">
        {label}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  add: { width: 48, height: 48, borderRadius: 14 },
  addInner: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  date: { borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed' },
  dateInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
});
