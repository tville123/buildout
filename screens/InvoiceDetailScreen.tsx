import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { C } from '../theme';
import { formatMoney as money, daysOverdue, daysUntilDue, dueDateLabel } from '../utils/format';
import { invoiceView, invoiceTotals } from '../utils/workspace';
import TopBar from '../components/TopBar';
import StatusPill from '../components/StatusPill';

type Props = NativeStackScreenProps<QuoteStackParamList, 'InvoiceDetail'>;

export default function InvoiceDetailScreen({ navigation, route }: Props) {
  const { invoiceId } = route.params;
  const { getInvoice, getQuote, clientName, markInvoicePaid } = useWorkspace();
  const { showToast } = useToast();

  const invoice = getInvoice(invoiceId);
  if (!invoice) {
    return (
      <View style={styles.container}>
        <TopBar tag="Invoice" onBack={() => navigation.goBack()} actions={[]} />
      </View>
    );
  }

  const view = invoiceView(invoice);
  const { subtotal, tax, total } = invoiceTotals(invoice);
  const sourceQuote = invoice.quoteId ? getQuote(invoice.quoteId) : undefined;

  let dueLine: React.ReactNode;
  if (view === 'overdue') dueLine = <Text style={styles.dueText}><Text style={{ color: C.red }}>{daysOverdue(invoice.dueAt)} days overdue</Text> · was due {dueDateLabel(invoice.dueAt)}</Text>;
  else if (view === 'pending') dueLine = <Text style={styles.dueText}><Text style={{ color: '#f5a623' }}>Due in {daysUntilDue(invoice.dueAt)} days</Text> · {dueDateLabel(invoice.dueAt)}</Text>;
  else dueLine = <Text style={styles.dueText}>Paid {invoice.paidAt ? dueDateLabel(invoice.paidAt) : ''}</Text>;

  return (
    <View style={styles.container}>
      <TopBar
        tag={`Invoice #${invoice.number}`}
        onBack={() => navigation.goBack()}
        actions={['share', 'more']}
        onActionPress={(a) => { if (a === 'share') navigation.push('PDFPreview', { invoiceId }); }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <TouchableOpacity
            onPress={() => invoice.clientId && navigation.push('ClientDetail', { clientId: invoice.clientId })}
            activeOpacity={0.7}
          >
            <Text style={styles.client}>{clientName(invoice.clientId)}<Text style={styles.arrow}> ›</Text></Text>
          </TouchableOpacity>
          <Text style={styles.job}>{invoice.job}</Text>
          <View style={styles.tags}>
            <StatusPill status={view} />
            <Text style={styles.meta}>#{invoice.number}</Text>
            {sourceQuote && <Text style={styles.meta}>· from quote #{sourceQuote.number}</Text>}
          </View>
        </View>

        <View style={styles.break}>
          <Text style={styles.breakCap}>Billed</Text>
          {invoice.lineItems.map(item => (
            <View key={item.id} style={styles.breakRow}>
              <View style={styles.breakDesc}>
                <Text style={styles.breakD}>{item.description}</Text>
                <Text style={styles.breakQ}>{item.quantity} × {money(item.unitPrice)}</Text>
              </View>
              <Text style={styles.breakAmt}>{money(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
          <View style={styles.breakTotals}>
            <View style={styles.trow}><Text style={styles.trowK}>Subtotal</Text><Text style={styles.trowV}>{money(subtotal)}</Text></View>
            {invoice.taxRate > 0 && (
              <View style={styles.trow}><Text style={styles.trowK}>Tax ({invoice.taxRate}%)</Text><Text style={styles.trowV}>{money(tax)}</Text></View>
            )}
            <View style={[styles.trow, styles.grand]}>
              <Text style={styles.grandK}>Total</Text>
              <Text style={styles.grandV}>{money(total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.due}>{dueLine}</View>

        {view === 'paid' ? (
          <View style={styles.settled}>
            <Ionicons name="checkmark-circle-outline" size={15} color="#4caf7d" />
            <Text style={styles.settledText}>Paid in full</Text>
          </View>
        ) : (
          <View style={styles.ctaWrap}>
            <TouchableOpacity
              style={styles.cta}
              onPress={() => { markInvoicePaid(invoice.id); showToast('Marked as paid'); }}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color="#4caf7d" />
              <Text style={styles.ctaText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  head: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 2 },
  client: { fontFamily: 'BebasNeue_400Regular', fontSize: 28, letterSpacing: 1, color: C.text },
  arrow: { color: C.textDim, fontSize: 18 },
  job: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textMid, marginTop: 5 },
  tags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 11 },
  meta: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textDim, letterSpacing: 0.4 },
  break: { marginHorizontal: 24, marginTop: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, overflow: 'hidden' },
  breakCap: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 8.8, letterSpacing: 2, textTransform: 'uppercase', color: C.textDim, padding: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border },
  breakRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: C.border },
  breakDesc: { flex: 1, minWidth: 0 },
  breakD: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.text, lineHeight: 18 },
  breakQ: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textDim, marginTop: 3 },
  breakAmt: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 13, color: C.text },
  breakTotals: { padding: 16, paddingVertical: 12, backgroundColor: C.bg },
  trow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  trowK: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 12, color: C.textMid },
  trowV: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 12, color: C.text },
  grand: { marginTop: 9, paddingTop: 11, borderTopWidth: 1, borderTopColor: C.border, alignItems: 'baseline' },
  grandK: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.yellow },
  grandV: { fontFamily: 'BebasNeue_400Regular', fontSize: 26, letterSpacing: 1, color: C.yellow },
  due: { marginHorizontal: 24, marginTop: 14 },
  dueText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, color: C.textDim, letterSpacing: 0.4 },
  ctaWrap: { paddingHorizontal: 24, paddingTop: 18 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 12, backgroundColor: 'rgba(76,175,125,0.12)', borderWidth: 1, borderColor: 'rgba(76,175,125,0.5)' },
  ctaText: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 12.5, letterSpacing: 1.8, textTransform: 'uppercase', color: '#4caf7d' },
  settled: { marginHorizontal: 24, marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 14, borderWidth: 1, borderColor: 'rgba(76,175,125,0.4)', borderRadius: 12 },
  settledText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: '#4caf7d' },
});
