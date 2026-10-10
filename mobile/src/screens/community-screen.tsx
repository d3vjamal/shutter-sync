import { Globe, MapPin, Phone, Users } from 'lucide-react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { RefreshIndicator } from '@/components/ui/refresh-indicator';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { usePhotographers } from '@/hooks/use-photographers';
import { usePullRefresh } from '@/hooks/use-pull-refresh';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { publicProfileUrl } from '@/lib/public-links';
import { socialUrl } from '@/lib/social-links';

/** Paginated two-column directory of registered photographers: photo, name, address and a call action. */
export function CommunityScreen() {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const { refreshing, onRefresh } = usePullRefresh();
  const { photographers, isLoading, isLoadingMore, canLoadMore, loadMore } =
    usePhotographers();

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <ScreenHeader
          eyebrow="Photographers"
          title="Community"
          colors={gradients.primary}
          right={<RefreshIndicator active={refreshing} />}
          paddingTop={insets.top + Spacing.two}
        />

        {isLoading ? (
          <View style={[styles.list, styles.skeletonGrid]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} style={styles.skeletonCard} />
            ))}
          </View>
        ) : (
          <FlatList
            data={photographers}
            keyExtractor={p => p._id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.list}
            onEndReached={() => canLoadMore && loadMore()}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primary}
              />
            }
            ListFooterComponent={
              isLoadingMore ? (
                <ActivityIndicator
                  color={theme.primary}
                  style={styles.footer}
                />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Users size={36} color={theme.textSecondary} />
                <ThemedText themeColor="textSecondary">
                  No photographers registered yet.
                </ThemedText>
              </View>
            }
            renderItem={({ item, index }) => (
              <FadeIn delay={(index % 20) * 30} style={styles.cell}>
                <View
                  style={[
                    styles.card,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    Shadow.soft,
                  ]}
                >
                  {item.avatarUrl ? (
                    <Image
                      source={{ uri: item.avatarUrl }}
                      style={styles.avatar}
                    />
                  ) : (
                    <Gradient
                      colors={gradients.primary}
                      radius={36}
                      style={styles.avatar}
                    >
                      <ThemedText type="subtitle" style={styles.initial}>
                        {(item.name.trim()[0] ?? '?').toUpperCase()}
                      </ThemedText>
                    </Gradient>
                  )}
                  <ThemedText
                    type="smallBold"
                    numberOfLines={1}
                    style={styles.name}
                  >
                    {item.name || 'Unnamed photographer'}
                  </ThemedText>
                  <View style={styles.addressRow}>
                    <MapPin size={12} color={theme.textSecondary} />
                    <ThemedText
                      type="small"
                      themeColor="textSecondary"
                      numberOfLines={2}
                      style={styles.address}
                    >
                      {item.address || 'Address not added'}
                    </ThemedText>
                  </View>
                  <View style={styles.socials}>
                    {[
                      {
                        key: 'instagram',
                        label: 'Instagram',
                        color: '#E1306C',
                        glyph: 'IG',
                        url: socialUrl('instagram', item.instagram),
                      },
                      {
                        key: 'facebook',
                        label: 'Facebook',
                        color: '#1877F2',
                        glyph: 'f',
                        url: socialUrl('facebook', item.facebook),
                      },
                      {
                        key: 'profile',
                        label: 'ShutterSync profile',
                        color: theme.primary,
                        glyph: undefined,
                        url: publicProfileUrl(item),
                      },
                    ].map(p => {
                      const enabled = !!p.url;
                      const tint = enabled ? p.color : theme.textSecondary;
                      return (
                        <Pressable
                          key={p.key}
                          disabled={!enabled}
                          onPress={() => p.url && Linking.openURL(p.url)}
                          accessibilityRole="link"
                          accessibilityLabel={
                            enabled
                              ? `${item.name} on ${p.label}`
                              : `${p.label} not added`
                          }
                          accessibilityState={{ disabled: !enabled }}
                          style={[
                            styles.social,
                            { backgroundColor: tint + (enabled ? '1F' : '14') },
                            !enabled && styles.socialOff,
                          ]}
                        >
                          {p.glyph ? (
                            <ThemedText style={[styles.glyph, { color: tint }]}>
                              {p.glyph}
                            </ThemedText>
                          ) : (
                            <Globe size={14} color={tint} />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                  {!!item.contact && (
                    <PressableScale
                      scaleTo={0.95}
                      onPress={() => Linking.openURL(`tel:${item.contact}`)}
                      style={[
                        styles.call,
                        { backgroundColor: theme.primary + '1A' },
                      ]}
                      accessibilityLabel={`Call ${item.name}`}
                    >
                      <Phone size={14} color={theme.primary} />
                      <ThemedText
                        type="smallBold"
                        style={{ color: theme.primary }}
                      >
                        Call
                      </ThemedText>
                    </PressableScale>
                  )}
                </View>
              </FadeIn>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  row: { gap: Spacing.three },
  cell: { flex: 1 },
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skeletonCard: { width: '47.5%', height: 200, borderRadius: Radius },
  card: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: { color: '#fff', fontSize: 28, lineHeight: 34 },
  name: { textAlign: 'center', alignSelf: 'stretch' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    alignSelf: 'stretch',
    minHeight: 32,
  },
  address: { flex: 1, fontSize: 12, lineHeight: 16 },
  call: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'stretch',
    paddingVertical: Spacing.two,
    borderRadius: 10,
  },
  socials: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  social: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialOff: { opacity: 0.4 },
  glyph: { fontSize: 11, fontWeight: '800', lineHeight: 14 },
  footer: { paddingVertical: Spacing.three },
  empty: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.six },
});
