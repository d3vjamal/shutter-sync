import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { CreditCard, Heart, ScrollText, Sparkles, User, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from 'convex/react';
import Toast from 'react-native-toast-message';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AddButton, AddDateButton } from '@/components/ui/add-controls';
import { Field } from '@/components/ui/field';
import { FormScreen } from '@/components/ui/form-screen';
import { FormSection } from '@/components/ui/form-section';
import { Input, Textarea } from '@/components/ui/input';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAssignments } from '@/hooks/use-assignments';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { isNonEmpty, isValidAmount, isValidPhone } from '@/lib/validation';
import type { AppStackParamList } from '@/navigation/types';
import { api } from '@convex/_generated/api';

type Route = RouteProp<AppStackParamList, 'CreateAssignment'>;

const EMPTY_FORM = {
  title: '',
  description: '',
  services: [] as string[],
  amount: '',
  paidAmount: '0',
  clientName: '',
  clientContact: '',
  eventStartDate: '',
  eventDuration: 0,
  location: '',
  venue: '',
  photographerDays: [] as string[],
  conditions: [] as string[],
  brideName: '',
  groomName: '',
  isBothSides: false,
  brideLocation: '',
  brideVenue: '',
  groomLocation: '',
  groomVenue: '',
};

export function CreateAssignmentScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Route>();
  const editing = route.params?.assignment;
  const { user } = useAuth();
  const { createAssignment, updateAssignment } = useAssignments(user);
  const agreements = useQuery(api.agreements.get) ?? [];

  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(editing as object) }));
  const [serviceInput, setServiceInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const set = <K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addService = () => {
    if (!serviceInput.trim()) return;
    set('services', [...form.services, serviceInput.trim()]);
    setServiceInput('');
  };

  const removeService = (i: number) =>
    set(
      'services',
      form.services.filter((_, idx) => idx !== i),
    );

  const addDate = (date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    if (form.photographerDays.includes(iso)) return;
    const days = [...form.photographerDays, iso].sort();
    setForm((f) => ({
      ...f,
      photographerDays: days,
      eventDuration: days.length,
      eventStartDate: days[0] || '',
    }));
  };

  const removeDate = (d: string) => {
    const days = form.photographerDays.filter((x) => x !== d);
    setForm((f) => ({
      ...f,
      photographerDays: days,
      eventDuration: days.length,
      eventStartDate: days[0] || '',
    }));
  };

  const toggleCondition = (text: string) => {
    set(
      'conditions',
      form.conditions.includes(text)
        ? form.conditions.filter((c) => c !== text)
        : [...form.conditions, text],
    );
  };

  const errors = useMemo(() => {
    const e: Partial<Record<'clientName' | 'clientContact' | 'title' | 'amount' | 'paidAmount', string>> = {};
    if (!isNonEmpty(form.clientName)) e.clientName = 'Client name is required';
    if (!isValidPhone(form.clientContact)) e.clientContact = 'Enter a valid phone number (10-13 digits)';
    if (!isNonEmpty(form.title)) e.title = 'Title is required';
    if (!isValidAmount(form.amount)) e.amount = 'Enter a valid amount';
    else if (isNonEmpty(form.paidAmount) && isValidAmount(form.paidAmount) && Number(form.paidAmount) > Number(form.amount)) {
      e.paidAmount = "Paid amount can't exceed total amount";
    }
    return e;
  }, [form.clientName, form.clientContact, form.title, form.amount, form.paidAmount]);

  const isValid = Object.keys(errors).length === 0;

  const handleSave = async () => {
    if (!isValid) {
      setSubmitAttempted(true);
      Toast.show({ type: 'error', text1: Object.values(errors)[0] ?? 'Please fix the highlighted fields' });
      return;
    }
    setSaving(true);
    const ok = editing
      ? await updateAssignment(editing._id, form)
      : await createAssignment(form);
    setSaving(false);
    if (ok) navigation.goBack();
  };

  return (
    <FormScreen
      eyebrow={editing ? 'Editing' : 'New booking'}
      title={editing ? 'Edit Assignment' : 'New Assignment'}
      onClose={() => navigation.goBack()}
      submitTitle={editing ? 'Save Changes' : 'Create Assignment'}
      onSubmit={handleSave}
      loading={saving}
      disabled={saving}
      hint={submitAttempted && !isValid ? 'Please fix the highlighted fields' : undefined}>
      <FormSection icon={User} title="Client Details" tint={theme.primary} index={0}>
        <Field label="Client Name *" error={submitAttempted ? errors.clientName : undefined}>
          <Input
            value={form.clientName}
            onChangeText={(v) =>
              setForm((f) => ({
                ...f,
                clientName: v,
                title: f.title.includes('Wedding') || !f.title ? `Wedding - ${v}` : f.title,
              }))
            }
            placeholder="Rahul Sharma"
            error={submitAttempted && !!errors.clientName}
          />
        </Field>
        <Field label="Contact *" error={submitAttempted ? errors.clientContact : undefined}>
          <Input
            value={form.clientContact}
            onChangeText={(v) => set('clientContact', v.replace(/[^\d+]/g, '').slice(0, 13))}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            error={submitAttempted && !!errors.clientContact}
          />
        </Field>
      </FormSection>

      <FormSection icon={Heart} title="Event Logistics" tint={theme.accent} index={1}>
        <Field label="Bride Name (optional)">
          <Input value={form.brideName} onChangeText={(v) => set('brideName', v)} />
        </Field>
        <Field label="Groom Name (optional)">
          <Input value={form.groomName} onChangeText={(v) => set('groomName', v)} />
        </Field>

        <Field label="Event Dates">
          <AddDateButton onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(_, selected) => {
                setShowDatePicker(false);
                if (selected) addDate(selected);
              }}
            />
          )}
          <View style={styles.tagWrap}>
            {form.photographerDays.map((d) => (
              <View key={d} style={[styles.tag, { backgroundColor: theme.primary + '1A' }]}>
                <ThemedText type="small" themeColor="primary">
                  {format(new Date(d), 'dd MMM yyyy')}
                </ThemedText>
                <Pressable onPress={() => removeDate(d)}>
                  <X size={12} color={theme.primary} />
                </Pressable>
              </View>
            ))}
          </View>
        </Field>

        <Pressable
          style={[styles.toggleRow, { backgroundColor: theme.backgroundElement }]}
          onPress={() => set('isBothSides', !form.isBothSides)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flex: 1 }}>
            <Sparkles size={16} color={form.isBothSides ? theme.accent : theme.textSecondary} />
            <View>
              <ThemedText type="small">Both Side Coverage</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Separate Bride & Groom venues
              </ThemedText>
            </View>
          </View>
          <Checkbox checked={form.isBothSides} onChange={(v) => set('isBothSides', v)} />
        </Pressable>

        {form.isBothSides ? (
          <>
            <Field label="Bride Location">
              <Input value={form.brideLocation} onChangeText={(v) => set('brideLocation', v)} />
            </Field>
            <Field label="Bride Venue">
              <Input value={form.brideVenue} onChangeText={(v) => set('brideVenue', v)} />
            </Field>
            <Field label="Groom Location">
              <Input value={form.groomLocation} onChangeText={(v) => set('groomLocation', v)} />
            </Field>
            <Field label="Groom Venue">
              <Input value={form.groomVenue} onChangeText={(v) => set('groomVenue', v)} />
            </Field>
          </>
        ) : (
          <>
            <Field label="Location">
              <Input value={form.location} onChangeText={(v) => set('location', v)} />
            </Field>
            <Field label="Venue">
              <Input value={form.venue} onChangeText={(v) => set('venue', v)} />
            </Field>
          </>
        )}
      </FormSection>

      <FormSection icon={CreditCard} title="Package & Payment" tint={theme.primary} index={2}>
        <Field label="Title *" error={submitAttempted ? errors.title : undefined}>
          <Input
            value={form.title}
            onChangeText={(v) => set('title', v)}
            placeholder="Wedding Package"
            error={submitAttempted && !!errors.title}
          />
        </Field>
        <Field label="Total Amount (₹) *" error={submitAttempted ? errors.amount : undefined}>
          <Input
            value={form.amount}
            onChangeText={(v) => set('amount', v.replace(/[^\d.]/g, ''))}
            keyboardType="numeric"
            error={submitAttempted && !!errors.amount}
          />
        </Field>
        <Field label="Paid Amount (₹)" error={submitAttempted ? errors.paidAmount : undefined}>
          <Input
            value={form.paidAmount}
            onChangeText={(v) => set('paidAmount', v.replace(/[^\d.]/g, ''))}
            keyboardType="numeric"
            error={submitAttempted && !!errors.paidAmount}
          />
        </Field>
        <Field label="Description">
          <Textarea value={form.description} onChangeText={(v) => set('description', v)} />
        </Field>
        <Field label="Deliverables">
          <View style={styles.serviceInputRow}>
            <Input style={{ flex: 1 }} value={serviceInput} onChangeText={setServiceInput} onSubmitEditing={addService} placeholder="e.g. 500 edited photos" />
            <AddButton onPress={addService} />
          </View>
          <View style={styles.tagWrap}>
            {form.services.map((s, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: theme.primary + '1A' }]}>
                <ThemedText type="small" themeColor="primary">
                  {s}
                </ThemedText>
                <Pressable onPress={() => removeService(i)}>
                  <X size={12} color={theme.primary} />
                </Pressable>
              </View>
            ))}
          </View>
        </Field>
      </FormSection>

      {agreements.length > 0 && (
        <FormSection icon={ScrollText} title="Terms & Conditions" tint={theme.primary} index={9}>
          {agreements.map((agreement) => (
            <Pressable
              key={agreement._id}
              style={styles.conditionRow}
              onPress={() => toggleCondition(agreement.description)}>
              <Checkbox
                checked={form.conditions.includes(agreement.description)}
                onChange={() => toggleCondition(agreement.description)}
              />
              <ThemedText type="small" style={{ flex: 1 }}>
                {agreement.description}
              </ThemedText>
            </Pressable>
          ))}
        </FormSection>
      )}

    </FormScreen>
  );
}

const styles = StyleSheet.create({
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one, marginTop: Spacing.one },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  serviceInputRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.two,
    borderRadius: Radius,
  },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
