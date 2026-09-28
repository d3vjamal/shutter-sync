import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Building2, Camera, CalendarDays, Clapperboard, ScrollText, Video, Wrench, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useQuery } from 'convex/react';
import Toast from 'react-native-toast-message';

import { Button } from '@/components/ui/button';
import { AddButton, AddDateButton } from '@/components/ui/add-controls';
import { Field } from '@/components/ui/field';
import { FormScreen } from '@/components/ui/form-screen';
import { FormSection } from '@/components/ui/form-section';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useFreelanceAssignments } from '@/hooks/use-freelance-assignments';
import { useTheme } from '@/hooks/use-theme';
import { isNonEmpty, isValidAmount, isValidEmail, isValidPhone } from '@/lib/validation';
import type { AppStackParamList } from '@/navigation/types';
import { api } from '@convex/_generated/api';

type Route = RouteProp<AppStackParamList, 'CreateFreelance'>;

const EMPTY_FORM = {
  studioName: '',
  studioOwnerName: '',
  studioMobile: '',
  studioEmail: '',
  studioArea: '',
  brideName: '',
  groomName: '',
  venue: '',
  location: '',
  dates: [] as string[],
  photographerName: '',
  photographerMobile: '',
  photographerEmail: '',
  photographyAmount: '',
  photographyReceived: '',
  photographyFootageTypes: [] as string[],
  hasVideography: false,
  videographerName: '',
  videographerMobile: '',
  videographerEmail: '',
  videographyAmount: '',
  videographyReceived: '',
  videographyFootageTypes: [] as string[],
  gadgets: [] as string[],
  conditions: [] as string[],
};

export function CreateFreelanceScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const route = useRoute<Route>();
  const editing = route.params?.job;
  const { user } = useAuth();
  const { createJob, updateJob } = useFreelanceAssignments(user);
  const agreements = useQuery(api.agreements.get) ?? [];

  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...(editing as object) }));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gadgetInput, setGadgetInput] = useState('');
  const [footageInput, setFootageInput] = useState('');
  const [videoFootageInput, setVideoFootageInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const set = <K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addToList = (field: 'gadgets' | 'photographyFootageTypes' | 'videographyFootageTypes', value: string) => {
    const v = value.trim();
    if (!v || form[field].includes(v)) return;
    set(field, [...form[field], v]);
  };
  const removeFromList = (
    field: 'gadgets' | 'photographyFootageTypes' | 'videographyFootageTypes',
    idx: number,
  ) => set(field, form[field].filter((_, i) => i !== idx));

  const addDate = (date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    if (form.dates.includes(iso)) return;
    set('dates', [...form.dates, iso].sort());
  };
  const removeDate = (d: string) => set('dates', form.dates.filter((x) => x !== d));

  const toggleCondition = (text: string) =>
    set(
      'conditions',
      form.conditions.includes(text)
        ? form.conditions.filter((c) => c !== text)
        : [...form.conditions, text],
    );

  const errors = useMemo(() => {
    const e: Partial<
      Record<
        | 'studioName'
        | 'studioOwnerName'
        | 'studioMobile'
        | 'studioEmail'
        | 'venue'
        | 'photographerMobile'
        | 'photographyAmount'
        | 'photographyReceived'
        | 'videographerMobile'
        | 'videographyAmount'
        | 'videographyReceived',
        string
      >
    > = {};
    if (!isNonEmpty(form.studioName)) e.studioName = 'Studio name is required';
    if (!isNonEmpty(form.studioOwnerName)) e.studioOwnerName = 'Studio owner name is required';
    if (!isValidPhone(form.studioMobile)) e.studioMobile = 'Enter a valid phone number (10-13 digits)';
    if (isNonEmpty(form.studioEmail) && !isValidEmail(form.studioEmail)) e.studioEmail = 'Enter a valid email address';
    if (!isNonEmpty(form.venue)) e.venue = 'Venue is required';
    if (isNonEmpty(form.photographerMobile) && !isValidPhone(form.photographerMobile)) {
      e.photographerMobile = 'Enter a valid phone number (10-13 digits)';
    }
    if (isNonEmpty(form.photographyAmount) && !isValidAmount(form.photographyAmount)) e.photographyAmount = 'Enter a valid amount';
    if (isNonEmpty(form.photographyReceived)) {
      if (!isValidAmount(form.photographyReceived)) e.photographyReceived = 'Enter a valid amount';
      else if (isValidAmount(form.photographyAmount) && Number(form.photographyReceived) > Number(form.photographyAmount)) {
        e.photographyReceived = "Received amount can't exceed total amount";
      }
    }
    if (form.hasVideography) {
      if (isNonEmpty(form.videographerMobile) && !isValidPhone(form.videographerMobile)) {
        e.videographerMobile = 'Enter a valid phone number (10-13 digits)';
      }
      if (isNonEmpty(form.videographyAmount) && !isValidAmount(form.videographyAmount)) e.videographyAmount = 'Enter a valid amount';
      if (isNonEmpty(form.videographyReceived)) {
        if (!isValidAmount(form.videographyReceived)) e.videographyReceived = 'Enter a valid amount';
        else if (isValidAmount(form.videographyAmount) && Number(form.videographyReceived) > Number(form.videographyAmount)) {
          e.videographyReceived = "Received amount can't exceed total amount";
        }
      }
    }
    return e;
  }, [
    form.studioName,
    form.studioOwnerName,
    form.studioMobile,
    form.studioEmail,
    form.venue,
    form.photographerMobile,
    form.photographyAmount,
    form.photographyReceived,
    form.hasVideography,
    form.videographerMobile,
    form.videographyAmount,
    form.videographyReceived,
  ]);

  const isValid = Object.keys(errors).length === 0;

  const handleSave = async () => {
    if (!isValid) {
      setSubmitAttempted(true);
      Toast.show({ type: 'error', text1: Object.values(errors)[0] ?? 'Please fix the highlighted fields' });
      return;
    }
    setSaving(true);
    const ok = editing ? await updateJob(editing._id, form) : await createJob(form);
    setSaving(false);
    if (ok) navigation.goBack();
  };

  const renderTagList = (
    field: 'gadgets' | 'photographyFootageTypes' | 'videographyFootageTypes',
  ) => (
    <View style={styles.tagWrap}>
      {form[field].map((s, i) => (
        <View key={i} style={[styles.tag, { backgroundColor: theme.primary + '1A' }]}>
          <ThemedText type="small" themeColor="primary">
            {s}
          </ThemedText>
          <Pressable onPress={() => removeFromList(field, i)}>
            <X size={12} color={theme.primary} />
          </Pressable>
        </View>
      ))}
    </View>
  );

  return (
    <FormScreen
      eyebrow={editing ? 'Editing' : 'B2B / studio work'}
      title={editing ? 'Edit Freelance Job' : 'New Freelance Job'}
      onClose={() => navigation.goBack()}
      submitTitle={editing ? 'Save Changes' : 'Create Freelance Job'}
      onSubmit={handleSave}
      loading={saving}
      disabled={saving}
      hint={submitAttempted && !isValid ? 'Please fix the highlighted fields' : undefined}>
      <FormSection icon={Building2} title="Studio Info" tint={theme.primary} index={0}>
        <Field label="Studio Name *" error={submitAttempted ? errors.studioName : undefined}>
          <Input value={form.studioName} onChangeText={(v) => set('studioName', v)} error={submitAttempted && !!errors.studioName} />
        </Field>
        <Field label="Studio Owner Name *" error={submitAttempted ? errors.studioOwnerName : undefined}>
          <Input value={form.studioOwnerName} onChangeText={(v) => set('studioOwnerName', v)} error={submitAttempted && !!errors.studioOwnerName} />
        </Field>
        <Field label="Studio Mobile *" error={submitAttempted ? errors.studioMobile : undefined}>
          <Input
            value={form.studioMobile}
            onChangeText={(v) => set('studioMobile', v.replace(/[^\d+]/g, ''))}
            keyboardType="phone-pad"
            error={submitAttempted && !!errors.studioMobile}
          />
        </Field>
        <Field label="Studio Email" error={submitAttempted ? errors.studioEmail : undefined}>
          <Input
            value={form.studioEmail}
            onChangeText={(v) => set('studioEmail', v)}
            autoCapitalize="none"
            keyboardType="email-address"
            error={submitAttempted && !!errors.studioEmail}
          />
        </Field>
        <Field label="Studio Area">
          <Input value={form.studioArea} onChangeText={(v) => set('studioArea', v)} />
        </Field>
      </FormSection>

      <FormSection icon={CalendarDays} title="Work Details" tint={theme.accent} index={1}>
        <Field label="Bride Name (optional)">
          <Input value={form.brideName} onChangeText={(v) => set('brideName', v)} />
        </Field>
        <Field label="Groom Name (optional)">
          <Input value={form.groomName} onChangeText={(v) => set('groomName', v)} />
        </Field>
        <Field label="Venue *" error={submitAttempted ? errors.venue : undefined}>
          <Input value={form.venue} onChangeText={(v) => set('venue', v)} error={submitAttempted && !!errors.venue} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChangeText={(v) => set('location', v)} />
        </Field>
        <Field label="Dates">
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
            {form.dates.map((d) => (
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
      </FormSection>

      <FormSection icon={Camera} title="Photography" tint={theme.primary} index={2}>
        <Field label="Photographer Name *">
          <Input value={form.photographerName} onChangeText={(v) => set('photographerName', v)} />
        </Field>
        <Field label="Photographer Mobile" error={submitAttempted ? errors.photographerMobile : undefined}>
          <Input
            value={form.photographerMobile}
            onChangeText={(v) => set('photographerMobile', v.replace(/[^\d+]/g, ''))}
            keyboardType="phone-pad"
            error={submitAttempted && !!errors.photographerMobile}
          />
        </Field>
        <Field label="Amount (₹)" error={submitAttempted ? errors.photographyAmount : undefined}>
          <Input
            value={form.photographyAmount}
            onChangeText={(v) => set('photographyAmount', v.replace(/[^\d.]/g, ''))}
            keyboardType="numeric"
            error={submitAttempted && !!errors.photographyAmount}
          />
        </Field>
        <Field label="Received (₹)" error={submitAttempted ? errors.photographyReceived : undefined}>
          <Input
            value={form.photographyReceived}
            onChangeText={(v) => set('photographyReceived', v.replace(/[^\d.]/g, ''))}
            keyboardType="numeric"
            error={submitAttempted && !!errors.photographyReceived}
          />
        </Field>
        <Field label="Footage Types">
          <View style={styles.serviceInputRow}>
            <Input style={{ flex: 1 }} value={footageInput} onChangeText={setFootageInput} placeholder="e.g. RAW" onSubmitEditing={() => { addToList('photographyFootageTypes', footageInput); setFootageInput(''); }} />
            <AddButton onPress={() => { addToList('photographyFootageTypes', footageInput); setFootageInput(''); }} />
          </View>
          {renderTagList('photographyFootageTypes')}
        </Field>
      </FormSection>

      <FormSection icon={Clapperboard} title="Videography" tint={theme.accent} index={3}>
        <Pressable style={[styles.toggleRow, { backgroundColor: theme.backgroundElement }]} onPress={() => set('hasVideography', !form.hasVideography)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two, flex: 1 }}>
            <Video size={16} color={form.hasVideography ? theme.accent : theme.textSecondary} />
            <ThemedText type="small">Include videography</ThemedText>
          </View>
          <Checkbox checked={form.hasVideography} onChange={(v) => set('hasVideography', v)} />
        </Pressable>
        {form.hasVideography && (
          <>
            <Field label="Videographer Name">
              <Input value={form.videographerName} onChangeText={(v) => set('videographerName', v)} />
            </Field>
            <Field label="Videographer Mobile" error={submitAttempted ? errors.videographerMobile : undefined}>
              <Input
                value={form.videographerMobile}
                onChangeText={(v) => set('videographerMobile', v.replace(/[^\d+]/g, ''))}
                keyboardType="phone-pad"
                error={submitAttempted && !!errors.videographerMobile}
              />
            </Field>
            <Field label="Amount (₹)" error={submitAttempted ? errors.videographyAmount : undefined}>
              <Input
                value={form.videographyAmount}
                onChangeText={(v) => set('videographyAmount', v.replace(/[^\d.]/g, ''))}
                keyboardType="numeric"
                error={submitAttempted && !!errors.videographyAmount}
              />
            </Field>
            <Field label="Received (₹)" error={submitAttempted ? errors.videographyReceived : undefined}>
              <Input
                value={form.videographyReceived}
                onChangeText={(v) => set('videographyReceived', v.replace(/[^\d.]/g, ''))}
                keyboardType="numeric"
                error={submitAttempted && !!errors.videographyReceived}
              />
            </Field>
            <Field label="Footage Types">
              <View style={styles.serviceInputRow}>
                <Input style={{ flex: 1 }} value={videoFootageInput} onChangeText={setVideoFootageInput} placeholder="e.g. Cinematic" onSubmitEditing={() => { addToList('videographyFootageTypes', videoFootageInput); setVideoFootageInput(''); }} />
                <AddButton onPress={() => { addToList('videographyFootageTypes', videoFootageInput); setVideoFootageInput(''); }} />
              </View>
              {renderTagList('videographyFootageTypes')}
            </Field>
          </>
        )}
      </FormSection>

      <FormSection icon={Wrench} title="Equipment" tint={theme.accent} index={3}>
        <View style={styles.serviceInputRow}>
          <Input style={{ flex: 1 }} value={gadgetInput} onChangeText={setGadgetInput} placeholder="e.g. Drone" onSubmitEditing={() => { addToList('gadgets', gadgetInput); setGadgetInput(''); }} />
          <AddButton onPress={() => { addToList('gadgets', gadgetInput); setGadgetInput(''); }} />
        </View>
        {renderTagList('gadgets')}
      </FormSection>

      {agreements.length > 0 && (
        <FormSection icon={ScrollText} title="Terms & Conditions" tint={theme.primary} index={9}>
          {agreements.map((agreement) => (
            <Pressable key={agreement._id} style={styles.conditionRow} onPress={() => toggleCondition(agreement.description)}>
              <Checkbox checked={form.conditions.includes(agreement.description)} onChange={() => toggleCondition(agreement.description)} />
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
    borderRadius: 14,
  },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
