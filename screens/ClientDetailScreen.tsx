import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { C } from '../theme';
import { money0 } from '../utils/format';
import TopBar from '../components/TopBar';
import Avatar from '../components/Avatar';
import SegControl from '../components/SegControl';
import QuoteCard from '../components/QuoteCard';
import InvoiceCard from '../components/InvoiceCard';

type Props = NativeStackScreenProps<QuoteStackParamList, 'ClientDetail'>;

export default function ClientDetailScreen({ navigation, route }: Props) {
  const { clientId } = route.params;
  const { getClient, clientTotals, invoicedIds, markInvoicePaid } = useWorkspace();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'quotes' | 'invoices'>('quotes');

  const client = getClient(clientId);
  if (!client) {
    return (
      <View style={styles.container}>
        <TopBar tag="Client" onBack={() => navigation.goBack()} actions={[]} />
      </View>
    );
  }
  const t = clientTotals(clientId);

  return (
    <View style={styles.container}>
      <TopBar tag={client.name} onBack={() => navigation.goBack()} actions={['more']} />
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <Avatar initials={client.initials} size={52} fontSize={22} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{client.name}</Text>
            {!!client.phone && (
              <View style={styles.contact}>
                <Ionicons name="call-outline" size={12} color={C.textDim} />
                <Text style={styles.contactText}>{client.phone}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.summary}>
          <SumCol label="Quoted" value={money0(t.quoted)} color={C.text} />
          <SumCol label="Invoiced" value={money0(t.invoiced)} color={C.yellow} divider />
          <SumCol label="Paid" value={money0(t.paid)} color="#4caf7d" divider />
        </View>

        <View style={styles.tabs}>
          <SegControl
            active={tab}
            onSelect={setTab}
            options={[
              { value: 'quotes', label: 'Quotes', badge: t.quotes.length },
              { value: 'invoices', label: 'Invoices', badge: t.invoices.length },
            ]}
          />
        </View>

        <View style={styles.list}>
          {tab === 'quotes' ? (
            t.quotes.length ? t.quotes.map(q => (
              <QuoteCard
                key={q.id}
                quote={q}
                clientName={client.name}
                invoiced={invoicedIds.has(q.id)}
                onPress={() => navigation.push('QuoteForm', { quoteId: q.id })}
              />
            )) : <Text style={styles.empty}>No quotes for this client yet.</Text>
          ) : (
            t.invoices.length ? t.invoices.map(inv => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                clientName={client.name}
                onPress={() => navigation.push('InvoiceDetail', { invoiceId: inv.id })}
                onMarkPaid={() => { markInvoicePaid(inv.id); showToast('Marked as paid'); }}
              />
            )) : <Text style={styles.empty}>No invoices for this client yet.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SumCol({ label, value, color, divider }: { label: string; value: string; color: string; divider?: boolean }) {
  return (
    <View style={[styles.sumCol, divider && styles.sumColDivider]}>
      <Text style={[styles.sumValue, { color }]}>{value}</Text>
      <Text style={styles.sumLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 4 },
  name: { fontFamily: 'BebasNeue_400Regular', fontSize: 26, letterSpacing: 1, color: C.text },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  contactText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textMid },
  summary: { flexDirection: 'row', marginHorizontal: 24, marginTop: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 16, paddingHorizontal: 18 },
  sumCol: { flex: 1, gap: 3 },
  sumColDivider: { borderLeftWidth: 1, borderLeftColor: C.border, paddingLeft: 16 },
  sumValue: { fontFamily: 'BebasNeue_400Regular', fontSize: 28, letterSpacing: 1 },
  sumLabel: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 8.8, letterSpacing: 1.1, textTransform: 'uppercase', color: C.textMid, marginTop: 3 },
  tabs: { marginHorizontal: 24, marginTop: 18 },
  list: { paddingHorizontal: 24, paddingTop: 14, gap: 8 },
  empty: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textDim, textAlign: 'center', paddingVertical: 24 },
});
