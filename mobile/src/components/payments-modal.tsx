import { format } from 'date-fns';
import { FileText, IndianRupee, Loader2, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { usePayments } from '@/hooks/use-payments';
import { useTheme } from '@/hooks/use-theme';
import { generateAndSharePdf } from '@/lib/pdf';
import { buildReceiptHtml } from '@/lib/pdf-templates';
import type { Doc } from '@convex/_generated/dataModel';

export function PaymentsModal({
  visible,
  onClose,
  parentId,
  parentType,
  title,
  totalAmount,
}: {
  visible: boolean;
  onClose: () => void;
  parentId: string;
  parentType: 'assignment' | 'freelance';
  title: string;
  totalAmount: number;
}) {
  const theme = useTheme();
  const { user } = useAuth();
  const { payments, isLoading, addPayment, removePayment } = usePayments(parentId);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'photography' | 'videography'>('photography');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
  const total = Number(totalAmount || 0);
  const balance = Math.max(0, total - totalPaid);
  const pct = total > 0 ? Math.min(100, Math.round((totalPaid / total) * 100)) : 0;

  const handleDownloadReceipt = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const html = buildReceiptHtml({
        payments,
        title,
        clientName: title,
        totalAmount: total,
        totalPaid,
        balance,
        photographer: user,
      });
      await generateAndSharePdf(html, `Receipt-${title}`);
    } catch (err) {
      Alert.alert('PDF failed', err instanceof Error ? err.message : 'Could not generate the receipt PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0 || !user) return;
    setSaving(true);
    await addPayment({
      parentId,
      parentType,
      photographerId: user._id,
      amount,
      date: format(date, 'yyyy-MM-dd'),
      note: note.trim() || undefined,
      category: parentType === 'freelance' ? category : undefined,
    });
    setAmount('');
    setNote('');
    setDate(new Date());
    setSaving(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <ThemedText type="smallBold" style={{ flex: 1 }} numberOfLines={1}>
              Payments — {title}
            </ThemedText>
            {payments.length > 0 && (
              <Pressable onPress={handleDownloadReceipt} disabled={pdfLoading} style={styles.receiptButton} hitSlop={8}>
                {pdfLoading ? (
                  <Loader2 size={16} color={theme.primary} />
                ) : (
                  <FileText size={16} color={theme.primary} />
                )}
              </Pressable>
            )}
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color={theme.text} />
            </Pressable>
          </View>

          <FlatList
            data={payments}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={{ gap: Spacing.three }}>
                <View style={[styles.summary, { backgroundColor: theme.backgroundElement }]}>
                  <View style={styles.summaryTopRow}>
                    <ThemedText type="small" themeColor="textSecondary">
                      Payment Progress
                    </ThemedText>
                    <ThemedText type="smallBold">{pct}%</ThemedText>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                    <View
                      style={[styles.progressFill, { width: `${pct}%`, backgroundColor: theme.primary }]}
                    />
                  </View>
                  <View style={styles.summaryBottomRow}>
                    <ThemedText type="small" style={{ color: theme.success }}>
                      ₹{totalPaid.toLocaleString()} paid
                    </ThemedText>
                    {balance > 0 && (
                      <ThemedText type="small" themeColor="accent">
                        ₹{balance.toLocaleString()} due
                      </ThemedText>
                    )}
                  </View>
                </View>

                <View style={{ gap: Spacing.two }}>
                  <ThemedText type="small" themeColor="textSecondary">
                    Add Payment
                  </ThemedText>
                  {parentType === 'freelance' && (
                    <View style={[styles.categoryRow, { backgroundColor: theme.backgroundElement }]}>
                      {(['photography', 'videography'] as const).map((c) => (
                        <Pressable
                          key={c}
                          onPress={() => setCategory(c)}
                          style={[styles.categoryTab, category === c && { backgroundColor: theme.primary }]}>
                          <ThemedText
                            type="small"
                            style={{ color: category === c ? theme.onPrimary : theme.text }}>
                            {c === 'photography' ? 'Photography' : 'Videography'}
                          </ThemedText>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  <View style={styles.row}>
                    <View style={{ flex: 1, gap: Spacing.one }}>
                      <Label>Amount (₹)</Label>
                      <Input value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0" />
                    </View>
                    <View style={{ flex: 1, gap: Spacing.one }}>
                      <Label>Date</Label>
                      <Pressable onPress={() => setShowDatePicker(true)}>
                        <View pointerEvents="none">
                          <Input value={format(date, 'dd MMM yyyy')} editable={false} />
                        </View>
                      </Pressable>
                    </View>
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      maximumDate={new Date()}
                      onChange={(_, selected) => {
                        setShowDatePicker(false);
                        if (selected) setDate(selected);
                      }}
                    />
                  )}
                  <Label>Note</Label>
                  <Input value={note} onChangeText={setNote} placeholder="PhonePe, GPay, Cash, UPI..." />
                  <Button
                    title="Add Payment"
                    onPress={handleAdd}
                    loading={saving}
                    disabled={!amount || Number(amount) <= 0}
                  />
                </View>

                <ThemedText type="small" themeColor="textSecondary">
                  Payment History
                </ThemedText>
              </View>
            }
            renderItem={({ item }: { item: Doc<'payments'> }) => (
              <View style={[styles.historyRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={{ flex: 1 }}>
                  <View style={styles.row}>
                    <ThemedText type="smallBold">₹{Number(item.amount).toLocaleString()}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {format(new Date(item.date), 'dd MMM yyyy')}
                    </ThemedText>
                  </View>
                  {!!item.note && (
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.note}
                    </ThemedText>
                  )}
                </View>
                <Pressable onPress={() => removePayment(item._id)} style={{ padding: Spacing.one }}>
                  <Trash2 size={14} color={theme.destructive} />
                </Pressable>
              </View>
            )}
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.empty}>
                  <IndianRupee size={22} color={theme.textSecondary} />
                  <ThemedText type="small" themeColor="textSecondary">
                    No payments recorded yet
                  </ThemedText>
                </View>
              ) : null
            }
          />
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  receiptButton: { padding: 2 },
  list: { padding: Spacing.three, gap: Spacing.two },
  summary: { borderRadius: Radius, padding: Spacing.three, gap: Spacing.two },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  categoryRow: { flexDirection: 'row', borderRadius: Radius, padding: 4, gap: 4 },
  categoryTab: { flex: 1, paddingVertical: Spacing.two, borderRadius: Radius - 4, alignItems: 'center' },
  row: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center', justifyContent: 'space-between' },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius,
  },
  empty: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.four },
});
