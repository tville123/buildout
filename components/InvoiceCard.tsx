import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, STATUS_META } from '../theme';
import type { Invoice } from '../types';
import { money0, daysOverdue, daysUntilDue, dueDateLabel } from '../utils/format';
import { invoiceView } from '../utils/workspace';

interface Props {
  invoice: Invoice;
  clientName: string;
  onPress: () => void;
  onMarkPaid: () => void;
}

export default function InvoiceCard({ invoice, clientName, onPress, onMarkPaid }: Props) {
  const view = invoiceView(invoice);
  const color = STATUS_META[view].color;

  let due: React.ReactNode;
  if (view === 'overdue') {
    due = <Text style={styles.due}><Text style={{ color: C.red }}>{daysOverdue(invoice.dueAt)} days overdue</Text> · #{invoice.number}</Text>;
  } else if (view === 'pending') {
    due = <Text style={styles.due}><Text style={{ color: '#f5a623' }}>Due in {daysUntilDue(invoice.dueAt)} days</Text> · #{invoice.number}</Text>;
  } else {
    due = <Text style={styles.due}>Paid {invoice.paidAt ? dueDateLabel(invoice.paidAt) : ''} · #{invoice.number}</Text>;
  }

  return (
    <View style={[styles.card, view === 'overdue' && styles.urgent]}>
      <TouchableOpacity style={styles.top} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.mid}>
          <Text style={styles.client} numberOfLines={1}>{clientName}</Text>
          <Text style={styles.job} numberOfLines={1}>{invoice.job}</Text>
        </View>
        <Text style={[styles.amt, { color }]}>{money0(invoice.amount)}</Text>
      </TouchableOpacity>
      <View style={styles.foot}>
        {due}
        {view === 'paid' ? (
          <View style={styles.settled}>
            <Ionicons name="checkmark-circle-outline" size={13} color="#4caf7d" />
            <Text style={styles.settledText}>Settled</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.markBtn} onPress={onMarkPaid} activeOpacity={0.7}>
            <Ionicons name="checkmark-circle-outline" size={13} color="#4caf7d" />
            <Text style={styles.markText}>Mark as Paid</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, paddingHorizontal: 15, marginBottom: 8 },
  urgent: { borderColor: 'rgba(224,92,58,0.35)' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  mid: { flex: 1, minWidth: 0 },
  client: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 14.5, color: C.text },
  job: { fontFamily: 'IBMPlexSans_300Light', fontSize: 11.5, color: C.textMid, marginTop: 3 },
  amt: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 19 },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 12 },
  due: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textDim, letterSpacing: 0.4, flex: 1 },
  markBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(76,175,125,0.1)', borderWidth: 1, borderColor: 'rgba(76,175,125,0.4)',
    borderRadius: 8, paddingVertical: 7, paddingHorizontal: 12,
  },
  markText: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 10.5, letterSpacing: 0.6, color: '#4caf7d' },
  settled: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  settledText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, letterSpacing: 0.4, color: '#4caf7d' },
});
