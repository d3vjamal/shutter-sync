import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AtSign,
  Camera,
  ChevronRight,
  ExternalLink,
  Globe,
  ImageIcon,
  Layers2,
  Link2,
  LogOut,
  Lock,
  Palette,
  Share2,
  User as UserIcon,
} from 'lucide-react-native';
import type { ComponentType } from 'react';
import { Image, Linking, Platform, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useProfileImageUpload } from '@/hooks/use-profile-image-upload';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { publicPackagesUrl, publicProfileUrl } from '@/lib/public-links';
import type { AppStackParamList } from '@/navigation/types';

type IconType = ComponentType<{ size?: number; color?: string }>;
type SettingsRoute = 'PersonalInfo' | 'SocialHandles' | 'Brand' | 'Appearance' | 'Security';

/** Profile hub: identity header, shareable public links, and a menu into one screen per settings area. */
export function ProfileScreen() {
  const theme = useTheme();
  const gradients = useGradients();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { user, signOut } = useAuth();
  const { uploading, pickAndUpload } = useProfileImageUpload();

  if (!user) return null;

  const initial = (user.name || user.email || 'U')[0].toUpperCase();
  const profileUrl = publicProfileUrl(user);
  const packagesUrl = publicPackagesUrl(user);
  const socialCount = [user.instagram, user.facebook, user.twitter, user.youtube, user.linkedin, user.website].filter(
    Boolean,
  ).length;

  const menu: { route: SettingsRoute; icon: IconType; title: string; subtitle: string; tint: string }[] = [
    {
      route: 'PersonalInfo',
      icon: UserIcon,
      title: 'Personal info',
      subtitle: 'Name, bio, contact, UPI, username',
      tint: theme.primary,
    },
    {
      route: 'SocialHandles',
      icon: AtSign,
      title: 'Social handles',
      subtitle: socialCount ? `${socialCount} linked` : 'Instagram, YouTube, website & more',
      tint: theme.primary,
    },
    { route: 'Brand', icon: ImageIcon, title: 'Brand & images', subtitle: 'Logo and profile cover', tint: theme.accent },
    { route: 'Appearance', icon: Palette, title: 'Appearance', subtitle: 'Light / dark mode, colours', tint: theme.accent },
    { route: 'Security', icon: Lock, title: 'Security', subtitle: 'Change password', tint: theme.destructive },
  ];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Gradient colors={gradients.primary} style={[styles.hero, { paddingTop: insets.top + Spacing.four }]}>
          <View style={styles.blobA} />
          <View style={styles.blobB} />
          <Pressable onPress={() => pickAndUpload('avatar')} style={styles.avatarWrap}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <ThemedText style={styles.avatarInitial}>{initial}</ThemedText>
              </View>
            )}
            <View style={[styles.avatarBadge, { backgroundColor: theme.card }]}>
              <Camera size={13} color={theme.primary} />
            </View>
          </Pressable>
          <ThemedText type="subtitle" style={styles.heroName} numberOfLines={1}>
            {uploading === 'avatar' ? 'Uploading…' : user.name || 'Photographer'}
          </ThemedText>
          <ThemedText type="small" style={styles.heroEmail}>
            {user.email}
          </ThemedText>
          {!!user.username && (
            <View style={styles.handle}>
              <AtSign size={12} color="#fff" />
              <ThemedText type="smallBold" style={{ color: '#fff', fontSize: 12 }}>
                {user.username}
              </ThemedText>
            </View>
          )}
        </Gradient>

        <View style={styles.body}>
          <FadeIn index={0}>
            <View style={[styles.card, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.cardHead}>
                <Globe size={16} color={theme.primary} />
                <ThemedText type="smallBold" style={{ fontSize: 16 }}>
                  Your public links
                </ThemedText>
              </View>
              {profileUrl && packagesUrl ? (
                <>
                  <LinkRow
                    icon={Link2}
                    label="Profile link"
                    url={profileUrl}
                    message={`View ${user.name || 'my'} photography portfolio and services.`}
                  />
                  <LinkRow
                    icon={Layers2}
                    label="Packages link"
                    url={packagesUrl}
                    message={`Explore ${user.name ? user.name + "'s" : 'my'} service packages.`}
                  />
                  {!user.username && (
                    <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }}>
                      Tip: set a username in Personal info for a shorter, friendlier link.
                    </ThemedText>
                  )}
                </>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  Set WEB_URL in mobile/.env to your web app's address to get shareable profile and packages links.
                </ThemedText>
              )}
            </View>
          </FadeIn>

          <FadeIn index={1}>
            <View style={[styles.card, Shadow.soft, styles.menu, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {menu.map((item, i) => (
                <Pressable
                  key={item.route}
                  onPress={() => navigation.navigate(item.route)}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.menuRow,
                    i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.border },
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <View style={[styles.menuIcon, { backgroundColor: item.tint + '1F' }]}>
                    <item.icon size={18} color={item.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{item.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={{ fontSize: 12 }} numberOfLines={1}>
                      {item.subtitle}
                    </ThemedText>
                  </View>
                  <ChevronRight size={16} color={theme.textSecondary} />
                </Pressable>
              ))}
            </View>
          </FadeIn>

          <Pressable
            onPress={() => signOut()}
            style={[styles.logout, { borderColor: theme.destructive + '55', backgroundColor: theme.destructive + '12' }]}>
            <View style={styles.logoutLeft}>
              <LogOut size={16} color={theme.destructive} />
              <ThemedText type="smallBold" style={{ color: theme.destructive }}>
                Log out
              </ThemedText>
            </View>
            <ChevronRight size={16} color={theme.destructive} />
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

function LinkRow({ icon: Icon, label, url, message }: { icon: IconType; label: string; url: string; message: string }) {
  const theme = useTheme();

  // The system share sheet doubles as "copy link" on both platforms, so no clipboard native module is needed.
  const display = url.replace(/^https?:\/\//, '');
  const share = () => Share.share({ message: `${message}\n${url}`, url, title: label }).catch(() => {});
  const open = () => Linking.openURL(url).catch(() => Toast.show({ type: 'error', text1: "Couldn't open link" }));

  return (
    <View style={[styles.linkRow, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.menuIcon, { backgroundColor: theme.primary + '1F' }]}>
        <Icon size={16} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="smallBold" style={{ fontSize: 13 }}>
          {label}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.mono} numberOfLines={1}>
          {display.slice(0, display.indexOf('/photographer/') + 14)}
          <ThemedText type="small" style={[styles.mono, { color: theme.primary, fontWeight: '700' }]}>
            {display.slice(display.indexOf('/photographer/') + 14)}
          </ThemedText>
        </ThemedText>
      </View>
      <PressableScale
        onPress={share}
        accessibilityLabel={`Share ${label}`}
        style={[styles.iconBtn, { backgroundColor: theme.primary }]}
        contentStyle={styles.iconBtnInner}>
        <Share2 size={15} color={theme.onPrimary} />
      </PressableScale>
      <PressableScale
        onPress={open}
        accessibilityLabel={`Open ${label}`}
        style={[styles.iconBtn, { borderColor: theme.border, borderWidth: 1, backgroundColor: theme.card }]}
        contentStyle={styles.iconBtnInner}>
        <ExternalLink size={15} color={theme.text} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: Spacing.four },
  hero: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: Spacing.five,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blobA: { position: 'absolute', right: -50, top: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.12)' },
  blobB: { position: 'absolute', left: -70, bottom: -80, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,140,90,0.18)' },
  avatarWrap: { marginBottom: Spacing.two },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
  avatarFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.22)' },
  avatarInitial: { color: '#fff', fontSize: 38, fontWeight: '800', lineHeight: 46 },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.soft,
  },
  heroName: { color: '#fff', fontSize: 24, lineHeight: 30, paddingHorizontal: Spacing.four },
  heroEmail: { color: 'rgba(255,255,255,0.8)' },
  handle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  body: { padding: Spacing.three, gap: Spacing.three },
  card: { borderRadius: 22, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: Spacing.two + 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius,
    borderWidth: StyleSheet.hairlineWidth,
  },
  mono: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  iconBtn: { width: 36, height: 36, borderRadius: 12 },
  iconBtnInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  menu: { padding: 0, gap: 0, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three, paddingHorizontal: Spacing.three, paddingVertical: 14 },
  menuIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    minHeight: 50,
    borderRadius: Radius,
    borderWidth: 1,
  },
  logoutLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
