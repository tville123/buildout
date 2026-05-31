import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import type { Quote } from '../types';
import { money0, relDate } from '../utils/format';
import StatusPill from './StatusPill';

interface QuoteCardProps {
  quote: Quote;
  clientName: string;
  invoiced: boolean;
  onPress: () => void;
  onConvert?: (quote: Quote) => void;
}

export default function QuoteCard({ quote, clientName, invoiced, onPress, onConvert }: QuoteCardProps) {
  const ready = quote.status === 'approved' && !invoiced;
  const showInvoiced = quote.status === 'approved' && invoiced;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.head}>
        <Text style={styles.client} numberOfLines={1}>{clientName}</Text>
        <Text style={styles.total}>{money0(quote.total)}</Text>
      </View>
      <Text style={styles.job} numberOfLines={1}>{quote.job || 'No description'}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>#{quote.number}</Text>
        <View style={styles.metaSep} />
        <Text style={styles.metaText}>{relDate(quote.createdAt)}</Text>
        <View style={{ flex: 1 }} />
        <StatusPill status={quote.status} size={8.5} />
      </View>

      {ready && (
        <View style={styles.convertRow}>
          <TouchableOpacity
            style={styles.convertBtn}
            onPress={() => onConvert?.(quote)}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-forward" size={13} color={C.yellow} />
            <Text style={styles.convertText}>Convert to Invoice</Text>
          </TouchableOpacity>
        </View>
      )}
      {showInvoiced && (
        <View style={styles.invoicedNote}>
          <Ionicons name="checkmark-circle-outline" size={12} color="#4caf7d" />
          <Text style={styles.invoicedText}>Invoiced</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
    paddingHorizontal: 16,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  client: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 15,
    color: C.text,
    flex: 1,
  },
  total: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 24,
    color: C.yellow,
    letterSpacing: 0.5,
  },
  job: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 12,
    color: C.textMid,
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  metaText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: C.textDim,
  },
  metaSep: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: C.textDim,
  },
  convertRow: {
    marginTop: 11,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
  },
  convertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.4)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 13,
  },
  convertText: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 10.5,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: C.yellow,
  },
  invoicedNote: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invoicedText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    letterSpacing: 0.4,
    color: '#4caf7d',
  },
});
