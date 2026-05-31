import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import type { Quote, PaymentTerm } from '../types';
import { money0, splitMoney, dueDateLabel } from '../utils/format';
import SegControl from './SegControl';
import ToggleChip from './ToggleChip';

interface Props {
  quote: Quote;
  clientName: string;
  invoiceNumber: number;
  onClose: () => void;
  onCreate: (opts: { termDays: PaymentTerm; deposit: boolean }) => void;
}

export default function ConvertSheet({ quote, clientName, invoiceNumber, onClose, onCreate }: Props) {
  const [term, setTerm] = useState<PaymentTerm>(15);
  const [deposit, setDeposit] = useState(false);

  const [now] = useState(() => Date.now());
  const depositAmount = Math.round(quote.total / 2);
  const amount = deposit ? depositAmount : quote.total;
  const { whole, cents } = splitMoney(amount);
  const dueLabel = dueDateLabel(new Date(now + term * 86400000).toISOString());

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.head}>
          <Text style={styles.title}>Convert to Invoice</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <View style={styles.src}>
            <Text style={styles.srcClient}>{clientName}</Text>
            <Text style={styles.srcJob}>{quote.job}</Text>
            <Text style={styles.srcMeta}>From quote #{quote.number} · {money0(quote.total)}</Text>
          </View>

          <View>
            <Text style={styles.label}>Payment terms</Text>
            <SegControl
              active={term}
              onSelect={setTerm}
              options={[
                { value: 7, label: 'Net 7' },
                { value: 15, label: 'Net 15' },
                { value: 30, label: 'Net 30' },
              ]}
            />
          </View>

          <ToggleChip
            label="Bill 50% deposit now"
            sub={`Invoice ${money0(depositAmount)} now, rest on completion`}
            active={deposit}
            onPress={() => setDeposit(d => !d)}
          />
        </View>

        <View style={styles.preview}>
          <View>
            <Text style={styles.previewLabel}>Amount due</Text>
            <Text style={styles.previewDue}>Net {term} · due {dueLabel}</Text>
          </View>
          <Text style={styles.previewVal}>{whole}<Text style={styles.previewCents}>.{cents}</Text></Text>
        </View>

        <View style={styles.ctaWrap}>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => onCreate({ termDays: term, deposit })}
            activeOpacity={0.85}
          >
            <Ionicons name="receipt-outline" size={17} color="#000" />
            <Text style={styles.ctaText}>Create Invoice #{invoiceNumber}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: C.border,
    paddingBottom: 28,
  },
  handle: {
    width: 36, height: 4, backgroundColor: C.border, borderRadius: 2,
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  head: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 22, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  title: {
    fontFamily: 'IBMPlexSans_500Medium', fontSize: 11, letterSpacing: 2.4,
    textTransform: 'uppercase', color: C.yellow,
  },
  cancel: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  body: { padding: 22, gap: 18 },
  src: {
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, padding: 14,
  },
  srcClient: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 14, color: C.text },
  srcJob: { fontFamily: 'IBMPlexSans_300Light', fontSize: 11.5, color: C.textMid, marginTop: 3, lineHeight: 16 },
  srcMeta: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textDim, marginTop: 7, letterSpacing: 0.4 },
  label: {
    fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 1.9,
    textTransform: 'uppercase', color: C.textDim, marginBottom: 8,
  },
  preview: {
    marginHorizontal: 22, backgroundColor: C.yellow, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  previewLabel: {
    fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 2.3,
    textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
  },
  previewDue: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: 'rgba(0,0,0,0.5)', marginTop: 3 },
  previewVal: { fontFamily: 'BebasNeue_400Regular', fontSize: 34, color: '#000', letterSpacing: 0.5 },
  previewCents: { fontSize: 18 },
  ctaWrap: { paddingHorizontal: 22, paddingTop: 14 },
  cta: {
    backgroundColor: C.yellow, borderRadius: 12, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  ctaText: {
    fontFamily: 'IBMPlexSans_500Medium', fontSize: 13, letterSpacing: 1.8,
    textTransform: 'uppercase', color: '#000',
  },
});
