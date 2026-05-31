import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { C } from '../theme';
import type { LineItem, PaymentTerm } from '../types';
import { formatMoney as money, splitMoney } from '../utils/format';
import { quoteTotals } from '../utils/workspace';
import { uuid } from '../utils/uuid';
import TopBar from '../components/TopBar';
import SectionLabel from '../components/SectionLabel';
import SegControl from '../components/SegControl';
import ClientSelect from '../components/ClientSelect';
import LineItemEditor from '../components/LineItemEditor';

type Props = NativeStackScreenProps<QuoteStackParamList, 'NewInvoice'>;

export default function NewInvoiceScreen({ navigation, route }: Props) {
  const { quotes, invoicedIds, clientName, createInvoice } = useWorkspace();
  const { showToast } = useToast();

  const eligible = quotes.filter(q => q.status === 'approved' && !invoicedIds.has(q.id));

  const seed = route.params?.fromQuoteId ? quotes.find(q => q.id === route.params!.fromQuoteId) : undefined;
  const [fromQuoteId, setFromQuoteId] = useState<string | null>(seed?.id ?? null);
  const [clientId, setClientId] = useState<string | null>(seed?.clientId ?? null);
  const [job, setJob] = useState(seed?.job ?? '');
  const [lineItems, setLineItems] = useState<LineItem[]>(seed ? seed.lineItems.map(li => ({ ...li, id: uuid() })) : []);
  const [taxRate, setTaxRate] = useState(String(seed?.taxRate ?? 0));
  const [term, setTerm] = useState<PaymentTerm>(15);
  const [pickerOpen, setPickerOpen] = useState(false);

  const { total } = quoteTotals({ lineItems, taxRate: parseFloat(taxRate) || 0 });
  const { whole, cents } = splitMoney(total);
  const canSave = !!clientId && job.trim().length > 0 && lineItems.length > 0 && total >= 0;

  const applyQuote = (id: string) => {
    const q = quotes.find(x => x.id === id);
    setPickerOpen(false);
    if (!q) return;
    setFromQuoteId(q.id);
    setClientId(q.clientId);
    setJob(q.job);
    setLineItems(q.lineItems.map(li => ({ ...li, id: uuid() })));
    setTaxRate(String(q.taxRate));
  };

  const handleCreate = () => {
    if (!canSave) return;
    const inv = createInvoice({
      clientId,
      quoteId: fromQuoteId ?? undefined,
      job: job.trim(),
      amount: total,
      lineItems,
      taxRate: parseFloat(taxRate) || 0,
      status: 'pending',
      dueAt: new Date(Date.now() + term * 86400000).toISOString(),
    });
    showToast(`Invoice #${inv.number} created`);
    navigation.navigate('Workspace', { section: 'invoices' });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar tag="New Invoice" onBack={() => navigation.goBack()} actions={[]} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {eligible.length > 0 && (
          <View style={styles.section}>
            <SectionLabel text="Bill from approved quote" />
            <TouchableOpacity style={styles.select} onPress={() => setPickerOpen(true)} activeOpacity={0.7}>
              <Text style={[styles.selectText, !fromQuoteId && styles.placeholder]}>
                {fromQuoteId ? `#${quotes.find(q => q.id === fromQuoteId)?.number} · ${clientName(clientId)}` : 'Start from scratch'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={C.textMid} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <SectionLabel text="Client" />
          <ClientSelect value={clientId} onChange={setClientId} />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Job" />
          <TextInput style={styles.jobInput} value={job} onChangeText={setJob} placeholder="Describe the job" placeholderTextColor={C.textDim} multiline />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Line Items" />
          <LineItemEditor items={lineItems} onChange={setLineItems} />
        </View>

        <View style={styles.section}>
          <SectionLabel text="Tax Rate" />
          <View style={styles.taxBlock}>
            <TextInput style={styles.taxInput} value={taxRate} onChangeText={setTaxRate} keyboardType="decimal-pad" />
            <Text style={styles.taxPct}>%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <SectionLabel text="Payment Terms" />
          <SegControl
            active={term}
            onSelect={setTerm}
            options={[{ value: 7, label: 'Net 7' }, { value: 15, label: 'Net 15' }, { value: 30, label: 'Net 30' }]}
          />
        </View>

        <View style={styles.totalStrip}>
          <Text style={styles.totalK}>Amount Due</Text>
          <Text style={styles.totalV}>{whole}<Text style={styles.totalCents}>.{cents}</Text></Text>
        </View>
      </ScrollView>

      <View style={styles.foot}>
        <TouchableOpacity style={[styles.save, !canSave && styles.saveDisabled]} onPress={handleCreate} disabled={!canSave} activeOpacity={0.85}>
          <Ionicons name="receipt-outline" size={16} color="#000" />
          <Text style={styles.saveText}>Create Invoice</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={() => setPickerOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Approved Quotes</Text>
          <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
            {eligible.map(q => (
              <TouchableOpacity key={q.id} style={styles.quoteRow} onPress={() => applyQuote(q.id)} activeOpacity={0.7}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quoteClient}>{clientName(q.clientId)}</Text>
                  <Text style={styles.quoteJob} numberOfLines={1}>#{q.number} · {q.job}</Text>
                </View>
                <Text style={styles.quoteTotal}>{money(q.total)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  section: { paddingHorizontal: 24, paddingTop: 18 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 13 },
  selectText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: C.text },
  placeholder: { color: C.textDim },
  jobInput: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: C.text, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12, minHeight: 56, textAlignVertical: 'top' },
  taxBlock: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12 },
  taxInput: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 16, color: C.text, padding: 0, minWidth: 60 },
  taxPct: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 13, color: C.textDim },
  totalStrip: { marginHorizontal: 24, marginTop: 18, backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalK: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 2.3, textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)' },
  totalV: { fontFamily: 'BebasNeue_400Regular', fontSize: 34, color: '#000', letterSpacing: 0.5 },
  totalCents: { fontSize: 18 },
  foot: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 28, backgroundColor: C.bg },
  save: { backgroundColor: C.yellow, borderRadius: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  saveDisabled: { opacity: 0.4 },
  saveText: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', color: '#000' },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: C.border, maxHeight: '70%', paddingBottom: 20 },
  handle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 8 },
  sheetTitle: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 11, letterSpacing: 2.4, textTransform: 'uppercase', color: C.yellow, paddingHorizontal: 20, paddingBottom: 8 },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12 },
  quoteClient: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 14, color: C.text },
  quoteJob: { fontFamily: 'IBMPlexSans_300Light', fontSize: 11.5, color: C.textMid, marginTop: 2 },
  quoteTotal: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 13, color: C.yellow },
});
