import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, RotateCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FormScreen } from '@/components/ui/form-screen';
import { Input } from '@/components/ui/input';
import { Gradient } from '@/components/ui/gradient';
import { Radius, Spacing, ThemePresets } from '@/constants/theme';
import type { ThemePreference } from '@/hooks/use-theme';
import { resolveTheme, useTheme, useThemePreference } from '@/hooks/use-theme';
import { normalizeHex } from '@/lib/color';
import { SettingsCard } from '@/screens/profile/profile-parts';

const MODES: { key: ThemePreference; label: string; hint: string }[] = [
  { key: 'light', label: 'Light', hint: 'Bright & clean' },
  { key: 'dark', label: 'Dark', hint: 'Easy on the eyes' },
  { key: 'system', label: 'System', hint: 'Match device' },
];

const sameColor = (a: string | null, b: string | null) => (a ?? '').toUpperCase() === (b ?? '').toUpperCase();

export function AppearanceScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { preference, setPreference, primaryColor, secondaryColor, setBrandColors } = useThemePreference();

  const [primaryText, setPrimaryText] = useState(primaryColor ?? '');
  const [secondaryText, setSecondaryText] = useState(secondaryColor ?? '');

  // Keep the hex boxes in sync when a preset (or reset) changes the colours.
  useEffect(() => {
    setPrimaryText(primaryColor ?? '');
    setSecondaryText(secondaryColor ?? '');
  }, [primaryColor, secondaryColor]);

  const onHexChange = (which: 'primary' | 'secondary', text: string) => {
    const cleaned = text.replace(/[^#0-9a-fA-F]/g, '').slice(0, 7);
    which === 'primary' ? setPrimaryText(cleaned) : setSecondaryText(cleaned);
    const hex = normalizeHex(cleaned);
    if (hex) {
      setBrandColors({
        primary: which === 'primary' ? hex : primaryColor,
        secondary: which === 'secondary' ? hex : secondaryColor,
      });
    } else if (cleaned === '') {
      setBrandColors({
        primary: which === 'primary' ? null : primaryColor,
        secondary: which === 'secondary' ? null : secondaryColor,
      });
    }
  };

  const isCustom = primaryColor !== null || secondaryColor !== null;

  return (
    <FormScreen eyebrow="Profile" title="Appearance" onClose={() => navigation.goBack()}>
      <SettingsCard title="Mode" hint="Applies instantly, everywhere in the app.">
        <View style={styles.row}>
          {MODES.map(({ key, label, hint }) => (
            <ModeOption
              key={key}
              mode={key}
              label={label}
              hint={hint}
              active={preference === key}
              onPress={() => setPreference(key)}
            />
          ))}
        </View>
      </SettingsCard>

      <SettingsCard title="Colour theme" hint="Primary colours buttons and headers; secondary is the accent.">
        <View style={styles.presets}>
          {ThemePresets.map((p) => {
            const active = sameColor(p.primary, primaryColor) && sameColor(p.secondary, secondaryColor);
            const preview = resolveTheme('light', p.primary, p.secondary).palette;
            return (
              <Pressable
                key={p.key}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => setBrandColors({ primary: p.primary, secondary: p.secondary })}
                style={[
                  styles.preset,
                  {
                    borderColor: active ? theme.primary : theme.border,
                    backgroundColor: active ? theme.primary + '14' : theme.backgroundElement,
                  },
                ]}>
                <View style={styles.swatches}>
                  <View style={[styles.swatch, { backgroundColor: preview.primary }]} />
                  <View style={[styles.swatch, { backgroundColor: preview.accent, marginLeft: -8 }]} />
                </View>
                <ThemedText type="small" style={{ fontWeight: active ? '700' : '600', fontSize: 13 }} numberOfLines={1}>
                  {p.name}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </SettingsCard>

      <SettingsCard title="Custom colours" hint="Enter a hex code such as #0F766E. Leave blank to use the default.">
        {(
          [
            ['primary', 'Primary', primaryText, primaryColor],
            ['secondary', 'Secondary', secondaryText, secondaryColor],
          ] as const
        ).map(([which, label, text, applied]) => (
          <View key={which} style={styles.hexRow}>
            <View
              style={[
                styles.hexSwatch,
                { borderColor: theme.border, backgroundColor: applied ?? (which === 'primary' ? theme.primary : theme.accent) },
              ]}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
                {label}
              </ThemedText>
              <Input
                value={text}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="#RRGGBB"
                error={text.length > 0 && !normalizeHex(text)}
                onChangeText={(v) => onHexChange(which, v)}
              />
            </View>
          </View>
        ))}
        {isCustom && (
          <Button
            title="Reset to default"
            variant="outline"
            icon={<RotateCcw size={14} color={theme.text} />}
            onPress={() => setBrandColors({ primary: null, secondary: null })}
          />
        )}
      </SettingsCard>

      <LivePreview />
    </FormScreen>
  );
}

function LivePreview() {
  const theme = useTheme();
  const { gradients } = useThemePreference();
  return (
    <SettingsCard title="Preview">
      <Gradient colors={gradients.primary} radius={Radius} style={styles.previewHero}>
        <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
          Priya & Arjun · Wedding
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.onPrimary, opacity: 0.8, fontSize: 12 }}>
          12 Dec · Jaipur
        </ThemedText>
      </Gradient>
      <View style={styles.row}>
        <View style={[styles.chip, { backgroundColor: theme.primary + '1F' }]}>
          <ThemedText type="smallBold" style={{ color: theme.primary, fontSize: 12 }}>
            Primary
          </ThemedText>
        </View>
        <View style={[styles.chip, { backgroundColor: theme.accent + '26' }]}>
          <ThemedText type="smallBold" style={{ color: theme.accent, fontSize: 12 }}>
            Secondary
          </ThemedText>
        </View>
      </View>
    </SettingsCard>
  );
}

/** A miniature app preview so the choice is visible, not just a label. */
function ModeOption({
  mode,
  label,
  hint,
  active,
  onPress,
}: {
  mode: ThemePreference;
  label: string;
  hint: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const { primaryColor, secondaryColor } = useThemePreference();
  const mini = (scheme: 'light' | 'dark') => {
    const c = resolveTheme(scheme, primaryColor, secondaryColor).palette;
    return (
      <View style={[styles.previewHalf, { backgroundColor: c.background }]}>
        <View style={[styles.previewBar, { backgroundColor: c.primary }]} />
        <View style={[styles.previewCard, { backgroundColor: c.card, borderColor: c.border }]} />
        <View style={[styles.previewCard, { backgroundColor: c.card, borderColor: c.border, width: '60%' }]} />
      </View>
    );
  };
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      style={[
        styles.modeCard,
        {
          borderColor: active ? theme.primary : theme.border,
          backgroundColor: active ? theme.primary + '14' : theme.backgroundElement,
        },
      ]}>
      <View style={[styles.previewFrame, { borderColor: theme.border }]}>
        {mode === 'system' ? (
          <View style={styles.previewSplit}>
            {mini('light')}
            {mini('dark')}
          </View>
        ) : (
          mini(mode)
        )}
        {active && (
          <View style={[styles.previewCheck, { backgroundColor: theme.primary }]}>
            <CheckCircle2 size={14} color={theme.onPrimary} />
          </View>
        )}
      </View>
      <ThemedText type="small" style={{ color: active ? theme.primary : theme.text, fontWeight: active ? '700' : '600' }}>
        {label}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 10 }} numberOfLines={1}>
        {hint}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  preset: {
    width: '31%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius,
    borderWidth: 1.5,
  },
  swatches: { flexDirection: 'row' },
  swatch: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff' },
  hexRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.two },
  hexSwatch: { width: 40, height: 40, borderRadius: 12, borderWidth: 1, marginBottom: 2 },
  previewHero: { padding: Spacing.three, gap: 2 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99 },
  previewFrame: { width: '100%', height: 64, borderRadius: 10, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  previewSplit: { flex: 1, flexDirection: 'row' },
  previewHalf: { flex: 1, padding: 6, gap: 4 },
  previewBar: { height: 6, width: '45%', borderRadius: 3 },
  previewCard: { height: 12, borderRadius: 4, borderWidth: StyleSheet.hairlineWidth },
  previewCheck: { position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  modeCard: { flex: 1, alignItems: 'center', gap: 4, padding: Spacing.two, borderRadius: Radius, borderWidth: 1.5 },
});
