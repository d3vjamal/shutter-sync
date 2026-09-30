import { useQuery } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  FlatList,
  Image,
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  type StyleProp,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';

import { FadeIn } from '@/components/ui/fade-in';
import { ThemedText } from '@/components/themed-text';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@convex/_generated/api';

const INTERVAL_MS = 5000;
const ASPECT = 16 / 6;

/** Auto-rotating banner carousel driven by the admin's visible mobile banners. Renders nothing when there are none. */
export function BannerCarousel({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const banners = useQuery(api.banners.listActive, { platform: 'mobile' });
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = banners?.length ?? 0;
  const width = screenWidth - Spacing.three * 2;
  const height = Math.round(width / ASPECT);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
  }, []);

  // A banner hidden/deleted by the admin can shrink the list under the current index.
  useEffect(() => {
    if (count > 0 && index >= count) {
      setIndex(0);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
  }, [count, index]);

  useEffect(() => {
    if (count < 2 || dragging || reduceMotion) return undefined;
    const timer = setInterval(() => {
      const next = (index + 1) % count;
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
      setIndex(next);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, index, dragging, reduceMotion, width]);

  if (!banners || count === 0) return null;

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setDragging(false);
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <FadeIn distance={8}>
    <View style={[styles.shadow, Shadow.soft, { width, height }, style]}>
      <View style={styles.clip}>
      <FlatList
        ref={listRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(b) => b._id}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScrollBeginDrag={() => setDragging(true)}
        onMomentumScrollEnd={onEnd}
        renderItem={({ item }) => (
          <Pressable
            disabled={!item.linkUrl}
            onPress={() => item.linkUrl && Linking.openURL(item.linkUrl).catch(() => {})}
            accessibilityRole={item.linkUrl ? 'link' : 'image'}
            accessibilityLabel={item.title}
            style={{ width, height, backgroundColor: theme.backgroundElement }}>
            {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
            <View style={styles.caption}>
              <ThemedText type="smallBold" style={styles.title} numberOfLines={1}>
                {item.title}
              </ThemedText>
              {item.subtitle ? (
                <ThemedText type="small" style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </ThemedText>
              ) : null}
            </View>
          </Pressable>
        )}
      />
      {count > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {banners.map((b, i) => (
            <View key={b._id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
      </View>
    </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  shadow: { alignSelf: 'center', marginTop: Spacing.three, borderRadius: Radius },
  clip: { flex: 1, borderRadius: Radius, overflow: 'hidden' },
  caption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  title: { color: '#fff', fontSize: 15 },
  subtitle: { color: 'rgba(255,255,255,0.9)' },
  dots: { position: 'absolute', right: Spacing.three, bottom: Spacing.two, flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 16, backgroundColor: '#fff' },
});
