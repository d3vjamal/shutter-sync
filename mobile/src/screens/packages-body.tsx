import { CheckCircle2, Eye, EyeOff, Layers, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { SkeletonCard, SkeletonStat } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { usePackages } from '@/hooks/use-packages';
import { useGradients, useTheme } from '@/hooks/use-theme';
import { isNonEmpty, isValidAmount } from '@/lib/validation';
import type { Doc, Id } from '@convex/_generated/dataModel';

const EMPTY_FORM = { name: '', description: '', price: '', services: [] as string[], popular: false };

/** Service package catalog CRUD, embedded in the Packages tab. */
export function PackagesBody({
  refreshing,
  onRefresh,
}: {
  refreshing?: boolean;
  onRefresh?: () => void;
} = {}) {
  const theme = useTheme();
  const gradients = useGradients();
  const { packages, isLoading, createPackage, updatePackage, removePackage } = usePackages();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Doc<'packages'> | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [serviceInput, setServiceInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [visibilitySavingId, setVisibilitySavingId] = useState<Id<'packages'> | null>(null);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setServiceInput('');
    setSubmitAttempted(false);
    setDialogOpen(true);
  };

  const openEdit = (pkg: Doc<'packages'>) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price || '',
      services: pkg.services || [],
      popular: pkg.popular || false,
    });
    setServiceInput('');
    setSubmitAttempted(false);
    setDialogOpen(true);
  };

  const addService = () => {
    const s = serviceInput.trim();
    if (s && !form.services.includes(s)) {
      setForm((f) => ({ ...f, services: [...f.services, s] }));
    }
    setServiceInput('');
  };

  const removeServiceAt = (idx: number) => {
    setForm((f) => ({ ...f, services: f.services.filter((_, i) => i !== idx) }));
  };

  const formErrors = useMemo(() => {
    const e: Partial<Record<'name' | 'price', string>> = {};
    if (!isNonEmpty(form.name)) e.name = 'Package name is required';
    if (isNonEmpty(form.price) && !isValidAmount(form.price.replace(/,/g, ''))) e.price = 'Enter a valid price';
    return e;
  }, [form.name, form.price]);

  const handleSave = async () => {
    if (Object.keys(formErrors).length > 0) {
      setSubmitAttempted(true);
      Toast.show({ type: 'error', text1: Object.values(formErrors)[0]! });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: form.price.trim() || undefined,
        services: form.services,
        popular: form.popular,
      };
      if (editing) {
        await updatePackage({ id: editing._id, ...payload } as any);
      } else {
        await createPackage(payload as any);
      }
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: Id<'packages'>) => {
    Alert.alert('Delete package?', 'This package will be removed from your public profile.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removePackage({ id }) },
    ]);
  };

  const toggleVisibility = async (pkg: Doc<'packages'>) => {
    setVisibilitySavingId(pkg._id);
    try {
      await updatePackage({ id: pkg._id, visible: pkg.visible === false } as any);
    } finally {
      setVisibilitySavingId(null);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.list}>
        <View style={[styles.statsRow, { marginBottom: Spacing.three }]}>
          <SkeletonStat />
          <SkeletonStat />
        </View>
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
          ) : undefined
        }
        ListHeaderComponent={
          <View style={{ gap: Spacing.three, marginBottom: Spacing.three }}>
            <View style={styles.statsRow}>
              <View style={[styles.statCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ThemedText type="small" themeColor="textSecondary">Total</ThemedText>
                <ThemedText type="subtitle">{packages.length}</ThemedText>
              </View>
              <View style={[styles.statCard, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <ThemedText type="small" themeColor="textSecondary">Visible on profile</ThemedText>
                <ThemedText type="subtitle">{packages.filter((p) => p.visible !== false).length}</ThemedText>
              </View>
            </View>
            <Pressable onPress={openAdd} style={styles.addButton}>
              <Gradient colors={gradients.primary} style={StyleSheet.absoluteFill} radius={Radius} />
              <Plus size={18} color="#fff" strokeWidth={3} />
              <ThemedText type="smallBold" style={{ color: '#fff' }}>Add Package</ThemedText>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => {
          const isVisible = item.visible !== false;
          return (
            <FadeIn index={index}>
              <View
                style={[
                  styles.card,
                  Shadow.soft,
                  {
                    backgroundColor: theme.card,
                    borderColor: item.popular ? theme.primary : theme.border,
                    borderWidth: item.popular ? 1.5 : StyleSheet.hairlineWidth,
                    opacity: isVisible ? 1 : 0.7,
                  },
                ]}>
                {item.popular && (
                  <Gradient colors={gradients.accent} style={styles.ribbon}>
                    <ThemedText type="smallBold" style={styles.ribbonText}>★ MOST POPULAR</ThemedText>
                  </Gradient>
                )}
                <View style={styles.nameRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText type="smallBold" style={styles.name} numberOfLines={2}>
                      {item.name}
                    </ThemedText>
                    <Badge label={isVisible ? 'Shown on profile' : 'Hidden'} color={isVisible ? 'success' : 'textSecondary'} />
                  </View>
                  {!!item.price && (
                    <View style={{ alignItems: 'flex-end' }}>
                      <ThemedText style={[styles.price, { color: theme.primary }]}>₹{item.price}</ThemedText>
                    </View>
                  )}
                </View>
                {!!item.description && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.description}
                  </ThemedText>
                )}
                {!!item.services?.length && (
                  <View style={[styles.features, { backgroundColor: theme.backgroundElement }]}>
                    {item.services.map((sv, i) => (
                      <View key={i} style={styles.serviceRow}>
                        <CheckCircle2 size={14} color={theme.success} />
                        <ThemedText type="small" style={{ flex: 1 }}>{sv}</ThemedText>
                      </View>
                    ))}
                  </View>
                )}
                <View style={styles.cardActions}>
                  <Pressable
                    onPress={() => toggleVisibility(item)}
                    disabled={visibilitySavingId === item._id}
                    style={[styles.outlineButton, { borderColor: theme.border }]}>
                    {isVisible ? <EyeOff size={15} color={theme.textSecondary} /> : <Eye size={15} color={theme.primary} />}
                  </Pressable>
                  <Pressable
                    onPress={() => openEdit(item)}
                    style={[styles.outlineButton, { flex: 1, borderColor: theme.primary + '55', backgroundColor: theme.primary + '12' }]}>
                    <Pencil size={14} color={theme.primary} />
                    <ThemedText type="smallBold" themeColor="primary">Edit</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => confirmDelete(item._id)}
                    style={[styles.outlineButton, { borderColor: theme.destructive + '55' }]}>
                    <Trash2 size={15} color={theme.destructive} />
                  </Pressable>
                </View>
              </View>
            </FadeIn>
          );
        }}
        ListEmptyComponent={
          (
            <FadeIn style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.primary + '1A' }]}>
                <Layers size={30} color={theme.primary} />
              </View>
              <ThemedText type="smallBold">No packages yet</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Add packages so clients can see your pricing.
              </ThemedText>
              <Button title="Create your first package" onPress={openAdd} />
            </FadeIn>
          )
        }
      />

      <Modal visible={dialogOpen} animationType="slide" onRequestClose={() => setDialogOpen(false)}>
        <ThemedView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.modalHeader}>
              <ThemedText type="smallBold" style={{ flex: 1 }}>
                {editing ? 'Edit Package' : 'New Service Package'}
              </ThemedText>
              <Pressable onPress={() => setDialogOpen(false)}>
                <X size={20} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              <Field label="Package Name *" error={submitAttempted ? formErrors.name : undefined}>
                <Input
                  value={form.name}
                  onChangeText={(name) => setForm((f) => ({ ...f, name }))}
                  placeholder="e.g. Wedding Standard"
                  error={submitAttempted && !!formErrors.name}
                />
              </Field>
              <Field label="Price (₹)" error={submitAttempted ? formErrors.price : undefined}>
                <Input
                  value={form.price}
                  onChangeText={(price) => setForm((f) => ({ ...f, price }))}
                  placeholder="e.g. 45,000"
                  keyboardType="numbers-and-punctuation"
                  error={submitAttempted && !!formErrors.price}
                />
              </Field>
              <View style={styles.field}>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChangeText={(description) => setForm((f) => ({ ...f, description }))}
                  placeholder="Short description of this package..."
                />
              </View>
              <View style={styles.field}>
                <Label>Services / Features Included</Label>
                <View style={styles.serviceInputRow}>
                  <Input
                    style={{ flex: 1 }}
                    value={serviceInput}
                    onChangeText={setServiceInput}
                    placeholder="e.g. 6 Hours Coverage"
                    onSubmitEditing={addService}
                  />
                  <Button title="Add" variant="outline" onPress={addService} />
                </View>
                <View style={styles.tagWrap}>
                  {form.services.map((s, i) => (
                    <View key={i} style={[styles.tag, { backgroundColor: theme.primary + '1A' }]}>
                      <ThemedText type="small" themeColor="primary">
                        {s}
                      </ThemedText>
                      <Pressable onPress={() => removeServiceAt(i)}>
                        <X size={12} color={theme.primary} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
              <Pressable
                style={styles.popularRow}
                onPress={() => setForm((f) => ({ ...f, popular: !f.popular }))}>
                <Checkbox checked={form.popular} onChange={(popular) => setForm((f) => ({ ...f, popular }))} />
                <ThemedText type="small">Mark as "Most Popular"</ThemedText>
              </Pressable>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Button title="Cancel" variant="outline" onPress={() => setDialogOpen(false)} />
              <View style={{ flex: 1 }}>
                <Button
                  title={editing ? 'Save Changes' : 'Create Package'}
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                />
              </View>
            </View>
          </SafeAreaView>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.three, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: { flex: 1, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: Spacing.three, gap: 4 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  card: { borderRadius: 22, padding: Spacing.three, gap: Spacing.three, marginBottom: Spacing.three, overflow: 'hidden' },
  ribbon: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  ribbonText: { color: '#fff', fontSize: 10, letterSpacing: 0.8 },
  name: { fontSize: 18, lineHeight: 24 },
  price: { fontSize: 22, fontWeight: '800', lineHeight: 28 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  features: { borderRadius: 14, padding: Spacing.three, gap: Spacing.two },
  serviceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  cardActions: { flexDirection: 'row', gap: Spacing.two },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
  },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.six, paddingHorizontal: Spacing.three },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalBody: { padding: Spacing.three, gap: Spacing.three },
  field: { gap: Spacing.one },
  serviceInputRow: { flexDirection: 'row', gap: Spacing.two },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, marginTop: Spacing.one },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
  },
  popularRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginTop: Spacing.one },
  modalFooter: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
