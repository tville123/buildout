import { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../../App';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../../context/ToastContext';
import { C, STATUS_META } from '../../theme';
import type { Invoice } from '../../types';
import { invoiceView } from '../../utils/workspace';
import InvoiceCard from '../../components/InvoiceCard';
import InvoiceBucket from '../../components/InvoiceBucket';

type Nav = NativeStackNavigationProp<QuoteStackParamList, 'Workspace'>;

export default function InvoicesSection({ navigation }: { navigation: Nav }) {
  const { invoices, clientName, markInvoicePaid } = useWorkspace();
  const { showToast } = useToast();

  // Single pass: each invoice is visited once and invoiceView is called once per invoice.
  const { overdue, pending, paid } = useMemo(() => {
    const result = { overdue: [] as Invoice[], pending: [] as Invoice[], paid: [] as Invoice[] };
    for (const inv of invoices) result[invoiceView(inv)].push(inv);
    return result;
  }, [invoices]);

  const sum = (arr: Invoice[]) => arr.reduce((s, i) => s + i.amount, 0);

  const handlePaid = (id: string) => { markInvoicePaid(id); showToast('Marked as paid'); };

  const renderCards = (arr: typeof invoices) => arr.map(inv => (
    <InvoiceCard
      key={inv.id}
      invoice={inv}
      clientName={clientName(inv.clientId)}
      onPress={() => navigation.push('InvoiceDetail', { invoiceId: inv.id })}
      onMarkPaid={() => handlePaid(inv.id)}
    />
  ));

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View style={styles.newWrap}>
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.push('NewInvoice')} activeOpacity={0.7}>
          <Ionicons name="add" size={16} color={C.textMid} />
          <Text style={styles.newBtnText}>New Invoice</Text>
        </TouchableOpacity>
      </View>

      {invoices.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={26} color={C.textDim} />
          <Text style={styles.emptyText}>No invoices yet.{'\n'}Convert an approved quote or bill a job.</Text>
        </View>
      ) : (
        <>
          <InvoiceBucket title="Overdue" color={STATUS_META.overdue.color} count={overdue.length} sum={sum(overdue)} defaultOpen>
            {renderCards(overdue)}
          </InvoiceBucket>
          <InvoiceBucket title="Pending" color={STATUS_META.pending.color} count={pending.length} sum={sum(pending)} defaultOpen>
            {renderCards(pending)}
          </InvoiceBucket>
          <InvoiceBucket title="Paid" color={STATUS_META.paid.color} count={paid.length} sum={sum(paid)} defaultOpen={false}>
            {renderCards(paid)}
          </InvoiceBucket>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  newWrap: { paddingHorizontal: 24, paddingTop: 16 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10, paddingVertical: 14 },
  newBtnText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  empty: { marginHorizontal: 24, marginTop: 40, alignItems: 'center', gap: 12, padding: 40, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 14 },
  emptyText: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textDim, textAlign: 'center', lineHeight: 19 },
});
