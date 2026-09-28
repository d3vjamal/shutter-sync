import { Check, FileText, Pencil, Plus, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/fade-in';
import { Gradient } from '@/components/ui/gradient';
import { Textarea } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useAgreements } from '@/hooks/use-agreements';
import { useGradients, useTheme } from '@/hooks/use-theme';
import type { Doc, Id } from '@convex/_generated/dataModel';

/** Reusable contract terms list + composer, embedded in the Business tab. */
export function AgreementsBody({
  refreshing,
  onRefresh,
}: {
  refreshing?: boolean;
  onRefresh?: () => void;
} = {}) {
  const theme = useTheme();
  const gradients = useGradients();
  const { agreements, isLoading, createAgreement, updateAgreement, deleteAgreement } = useAgreements();
  const [newText, setNewText] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<'agreements'> | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = async () => {
    const description = newText.trim();
    if (!description) return;
    setAdding(true);
    try {
      await createAgreement({ description });
      setNewText('');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (agreement: Doc<'agreements'>) => {
    setEditingId(agreement._id);
    setEditingText(agreement.description);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const description = editingText.trim();
    if (!description) return;
    await updateAgreement({ id: editingId, description });
    setEditingId(null);
  };

  const confirmDelete = (id: Id<'agreements'>) => {
    Alert.alert('Delete condition', 'This will remove this term from future assignments.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteAgreement({ id }) },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.list}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.card, { borderColor: theme.border, padding: Spacing.three }]}>
            <Skeleton style={{ width: '80%', marginBottom: Spacing.two }} />
            <Skeleton style={{ width: '50%' }} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <FlatList
      data={agreements}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={theme.primary} colors={[theme.primary]} />
        ) : undefined
      }
      ListHeaderComponent={
        <View
          style={[styles.composer, Shadow.soft, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.composerTitle}>
            <View style={[styles.dot, { backgroundColor: theme.primary + '1F' }]}>
              <Plus size={14} color={theme.primary} strokeWidth={3} />
            </View>
            <ThemedText type="smallBold">New condition</ThemedText>
          </View>
          <Textarea
            placeholder="e.g. 50% advance is non-refundable…"
            value={newText}
            onChangeText={setNewText}
            numberOfLines={3}
            style={{ minHeight: 84 }}
          />
          <Button title="Add condition" onPress={handleAdd} loading={adding} disabled={!newText.trim()} />
        </View>
      }
      renderItem={({ item, index }) => {
        const editing = editingId === item._id;
        return (
          <FadeIn index={index}>
            <View
              style={[
                styles.card,
                Shadow.soft,
                {
                  backgroundColor: theme.card,
                  borderColor: editing ? theme.primary : theme.border,
                },
              ]}>
              <Gradient colors={gradients.primary} style={styles.accentBar} />
              <View style={styles.cardBody}>
                {editing ? (
                  <>
                    <Textarea value={editingText} onChangeText={setEditingText} autoFocus />
                    <View style={styles.editActions}>
                      <Pressable
                        onPress={() => setEditingId(null)}
                        style={[styles.pill, { borderColor: theme.border }]}>
                        <X size={14} color={theme.textSecondary} />
                        <ThemedText type="smallBold" themeColor="textSecondary">Cancel</ThemedText>
                      </Pressable>
                      <Pressable
                        onPress={saveEdit}
                        disabled={!editingText.trim()}
                        style={[styles.pill, { backgroundColor: theme.primary, borderColor: theme.primary, opacity: editingText.trim() ? 1 : 0.5 }]}>
                        <Check size={14} color="#fff" />
                        <ThemedText type="smallBold" style={{ color: '#fff' }}>Save</ThemedText>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <View style={styles.viewRow}>
                    <View style={[styles.index, { backgroundColor: theme.primary + '1A' }]}>
                      <ThemedText type="smallBold" themeColor="primary" style={{ fontSize: 12 }}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <ThemedText type="default" style={styles.text}>
                      {item.description}
                    </ThemedText>
                    <View style={styles.iconCol}>
                      <Pressable
                        hitSlop={8}
                        onPress={() => startEdit(item)}
                        style={[styles.iconButton, { backgroundColor: theme.backgroundElement }]}>
                        <Pencil size={15} color={theme.textSecondary} />
                      </Pressable>
                      <Pressable
                        hitSlop={8}
                        onPress={() => confirmDelete(item._id)}
                        style={[styles.iconButton, { backgroundColor: theme.destructive + '14' }]}>
                        <Trash2 size={15} color={theme.destructive} />
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </FadeIn>
        );
      }}
      ListEmptyComponent={
        <FadeIn style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.primary + '1A' }]}>
            <FileText size={30} color={theme.primary} />
          </View>
          <ThemedText type="smallBold">No agreement terms yet</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center' }}>
            Add your first condition above and reuse it on every booking.
          </ThemedText>
        </FadeIn>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.three, paddingBottom: 120 },
  composer: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  composerTitle: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  dot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: Spacing.three,
    overflow: 'hidden',
  },
  accentBar: { width: 5 },
  cardBody: { flex: 1, padding: Spacing.three, gap: Spacing.two },
  viewRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  index: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  text: { flex: 1, fontSize: 15, lineHeight: 22 },
  iconCol: { gap: Spacing.two },
  iconButton: { width: 32, height: 32, borderRadius: Radius - 4, alignItems: 'center', justifyContent: 'center' },
  editActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.two },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.five, paddingHorizontal: Spacing.four },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
});
