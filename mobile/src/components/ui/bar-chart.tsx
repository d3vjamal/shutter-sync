import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

/** Simple monthly bar chart built on react-native-svg (no chart library dependency). */
export function BarChart({
  data,
  colors,
  height = 140,
}: {
  data: { label: string; collected: number }[];
  colors: readonly string[];
  height?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.collected));
  const barWidth = 100 / data.length;

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
            {colors.map((c, i) => (
              <Stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const barHeight = (d.collected / max) * (height - 4);
          const x = i * barWidth + barWidth * 0.2;
          return (
            <Rect
              key={i}
              x={x}
              y={height - barHeight}
              width={barWidth * 0.6}
              height={Math.max(barHeight, 2)}
              rx={2}
              fill="url(#barFill)"
            />
          );
        })}
      </Svg>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <ThemedText key={i} type="small" themeColor="textSecondary" style={styles.label}>
            {d.label}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', marginTop: Spacing.one },
  label: { flex: 1, textAlign: 'center', fontSize: 11 },
});
