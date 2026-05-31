import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../../App';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../../context/ToastContext';
import { C } from '../../theme';
import type { Quote, QuoteStatus } from '../../types';
import QuoteCard from '../../components/QuoteCard';
import ConvertSheet from '../../components/ConvertSheet';

type Nav = NativeStackNavigationProp<QuoteStackParamList, 'Workspace'>;
type Filter = 'all' | QuoteStatus;

const TABS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'approved', label: 'Approved' },
];

export default function QuotesSection({ navigation, goToSection }: { navigation: Nav; goToSection: (s: 'invoices') => void }) {
  const { quotes, invoicedIds, clientName, createQuote, convertQuoteToInvoice, nextInvoiceNumber } = useWorkspace();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('all');
  const [converting, setConverting] = useState<Quote | null>(null);

  const counts: Record<Filter, number> = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    sent: quotes.filter(q => q.status === 'sent').length,
    approved: quotes.filter(q => q.status === 'approved').length,
  };
  const shown = filter === 'all' ? quotes : quotes.filter(q => q.status === filter);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabs}>
        {TABS.map(t => {
          const active = filter === t.id;
          return (
            <TouchableOpacity key={t.id} style={styles.tab} onPress={() => setFilter(t.id)} activeOpacity={0.7}>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
              <View style={[styles.count, active && styles.countActive]}>
                <Text style={[styles.countText, active && styles.countTextActive]}>{counts[t.id]}</Text>
              </View>
              {active && <View style={styles.underline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.push('QuoteForm', { quoteId: createQuote().id })} activeOpacity={0.7}>
          <Ionicons name="add" size={16} color={C.textMid} />
          <Text style={styles.newBtnText}>New Quote</Text>
        </TouchableOpacity>

        {shown.length > 0 ? shown.map(q => (
          <QuoteCard
            key={q.id}
            quote={q}
            clientName={clientName(q.clientId)}
            invoiced={invoicedIds.has(q.id)}
            onPress={() => navigation.push('QuoteForm', { quoteId: q.id })}
            onConvert={(quote) => setConverting(quote)}
          />
        )) : (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={26} color={C.textDim} />
            <Text style={styles.emptyText}>No {filter === 'all' ? '' : filter + ' '}quotes right now.</Text>
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {converting && (
        <ConvertSheet
          quote={converting}
          clientName={clientName(converting.clientId)}
          invoiceNumber={nextInvoiceNumber}
          onClose={() => setConverting(null)}
          onCreate={({ termDays, deposit }) => {
            const inv = convertQuoteToInvoice(converting.id, { termDays, deposit });
            setConverting(null);
            if (inv) {
              goToSection('invoices');
              showToast(`Invoice #${inv.number} created`);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 18, paddingHorizontal: 24, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 10 },
  tabLabel: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 12.5, color: C.textMid },
  tabLabelActive: { color: C.yellow },
  count: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 6, paddingVertical: 1 },
  countActive: { borderColor: 'rgba(245,200,66,0.4)' },
  countText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 9.5, color: C.textDim },
  countTextActive: { color: C.yellow },
  underline: { position: 'absolute', left: 0, right: 0, bottom: -1, height: 2, backgroundColor: C.yellow },
  list: { padding: 24, paddingTop: 14, gap: 8 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10, paddingVertical: 14, marginBottom: 6 },
  newBtnText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  empty: { marginTop: 30, alignItems: 'center', gap: 12, padding: 30, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 14 },
  emptyText: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textDim },
});
