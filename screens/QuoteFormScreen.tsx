import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useWorkspace } from '../context/WorkspaceContext';
import { usePaid, usePaidActions } from '../context/PaidContext';
import { useToast } from '../context/ToastContext';
import { navigateToSettings } from '../navigationRef';
import TopBar from '../components/TopBar';
import SectionLabel from '../components/SectionLabel';
import SegControl from '../components/SegControl';
import ClientSelect from '../components/ClientSelect';
import LineItemEditor from '../components/LineItemEditor';
import PaywallSheet from '../components/PaywallSheet';
import { C } from '../theme';
import type { LineItem, QuoteStatus } from '../types';
import { formatMoney as money, splitMoney } from '../utils/format';
import { quoteTotals } from '../utils/workspace';

type Props = NativeStackScreenProps<QuoteStackParamList, 'QuoteForm'>;

export default function QuoteFormScreen({ navigation, route }: Props) {
  const { getQuote, updateQuote, clientName } = useWorkspace();
  const isPaid = usePaid();
  const { purchase } = usePaidActions();
  const { showToast } = useToast();

  const quoteId = route.params?.quoteId ?? '';
  const quote = getQuote(quoteId);

  const [job, setJob] = useState(quote?.job ?? '');
  const [taxRate, setTaxRate] = useState(String(quote?.taxRate ?? 8.25));
  const [showPaywall, setShowPaywall] = useState(false);

  if (!quote) {
    return (
      <View style={styles.container}>
        <TopBar tag="Quote" onBack={() => navigation.goBack()} actions={[]} />
      </View>
    );
  }

  const lineItems = quote.lineItems;
  const { subtotal, tax, total } = quoteTotals({ lineItems, taxRate: parseFloat(taxRate) || 0 });
  const { whole, cents } = splitMoney(total);

  const saveJob = () => updateQuote(quoteId, { job });
  const saveTax = () => updateQuote(quoteId, { taxRate: parseFloat(taxRate) || 0 });

  const handleStatus = (status: QuoteStatus) => {
    if (status !== 'draft' && !quote.clientId) {
      showToast('Pick a client first');
      return;
    }
    updateQuote(quoteId, { status });
  };

  const handleItems = (items: LineItem[]) => updateQuote(quoteId, { lineItems: items });

  const handleExport = () => {
    saveJob(); saveTax();
    if (isPaid) navigation.push('PDFPreview', { quoteId });
    else setShowPaywall(true);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar
        tag={quote.clientId ? clientName(quote.clientId) : 'New Quote'}
        onBack={() => { saveJob(); saveTax(); navigation.goBack(); }}
        actions={['share', 'more']}
        onActionPress={(a) => { if (a === 'settings') navigateToSettings(); }}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <SectionLabel text="Client" />
          <ClientSelect value={quote.clientId} onChange={(id) => updateQuote(quoteId, { clientId: id })} />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Job" />
          <TextInput
            style={styles.jobInput}
            value={job}
            onChangeText={setJob}
            onBlur={saveJob}
            placeholder="Describe the job"
            placeholderTextColor={C.textDim}
            multiline
          />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Status" />
          <SegControl
            active={quote.status}
            onSelect={handleStatus}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'sent', label: 'Sent' },
              { value: 'approved', label: 'Approved' },
            ]}
          />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Line Items" />
          <LineItemEditor items={lineItems} onChange={handleItems} />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Tax + Total" />
          <View style={styles.totals}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsVal}>{money(subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax</Text>
              <View style={styles.taxRow}>
                <TextInput
                  style={styles.taxInput}
                  value={taxRate}
                  onChangeText={setTaxRate}
                  onBlur={saveTax}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.taxPct}>%</Text>
                <Text style={[styles.totalsVal, { marginLeft: 12 }]}>{money(tax)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.totalStrip}>
          <Text style={styles.totalStripK}>Quote Total</Text>
          <Text style={styles.totalStripV}>{whole}<Text style={styles.totalStripCents}>.{cents}</Text></Text>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.exportBtn, !isPaid && styles.exportBtnLocked]}
        onPress={handleExport}
        activeOpacity={0.85}
      >
        <View style={styles.exportLeft}>
          <Text style={[styles.exportEyebrow, !isPaid && styles.exportEyebrowLocked]}>{isPaid ? 'Generate' : 'Pro feature'}</Text>
          <Text style={[styles.exportLabel, !isPaid && styles.exportLabelLocked]}>{isPaid ? 'Export PDF & Send' : 'Export PDF — unlock'}</Text>
        </View>
        <Ionicons name={isPaid ? 'share-outline' : 'lock-closed-outline'} size={20} color={isPaid ? '#000' : C.textMid} />
      </TouchableOpacity>

      <PaywallSheet
        visible={showPaywall}
        onUnlock={async () => {
          const success = await purchase();
          if (success) { setShowPaywall(false); navigation.push('PDFPreview', { quoteId }); }
        }}
        onSkip={() => setShowPaywall(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  section: { paddingHorizontal: 24, paddingTop: 20 },
  jobInput: {
    fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: C.text,
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10,
    padding: 12, minHeight: 56, textAlignVertical: 'top',
  },
  totals: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, overflow: 'hidden' },
  totalsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  totalsLabel: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 12, color: C.textMid, textTransform: 'uppercase', letterSpacing: 1 },
  totalsVal: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: C.text },
  taxRow: { flexDirection: 'row', alignItems: 'center' },
  taxInput: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: C.text, borderBottomWidth: 1, borderBottomColor: C.border, padding: 0, minWidth: 36, textAlign: 'right' },
  taxPct: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: C.textDim, marginLeft: 2 },
  totalStrip: {
    marginHorizontal: 24, marginTop: 18, backgroundColor: C.yellow, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  totalStripK: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 2.3, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' },
  totalStripV: { fontFamily: 'BebasNeue_400Regular', fontSize: 34, color: '#000', letterSpacing: 0.5 },
  totalStripCents: { fontSize: 18 },
  exportBtn: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.yellow,
    paddingHorizontal: 20, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  exportBtnLocked: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  exportLeft: { gap: 2 },
  exportEyebrow: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 9.6, letterSpacing: 1.6, textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)' },
  exportEyebrowLocked: { color: C.textDim },
  exportLabel: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 15, color: '#000' },
  exportLabelLocked: { color: C.textMid },
});
