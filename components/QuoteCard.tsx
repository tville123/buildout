import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import type { Quote } from '../types';

function formatMoney(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface QuoteCardProps {
  quote: Quote;
  onPress: () => void;
}

export default function QuoteCard({ quote, onPress }: QuoteCardProps) {
  const subtotal = quote.lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = subtotal + subtotal * (quote.taxRate / 100);
  const isSent = quote.status === 'sent';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.spine, isSent ? styles.spineSent : styles.spineDraft]} />
      <View style={styles.body}>
        <View style={styles.row1}>
          <Text style={styles.client} numberOfLines={1}>{quote.clientName || 'Untitled Quote'}</Text>
          <Text style={styles.total}>{formatMoney(total)}</Text>
        </View>
        <Text style={styles.job} numberOfLines={1}>{quote.jobDescription || 'No description'}</Text>
        <View style={styles.meta}>
          <View style={[styles.tag, isSent ? styles.tagSent : styles.tagDraft]}>
            <Text style={[styles.tagText, isSent ? styles.tagTextSent : styles.tagTextDraft]}>
              {isSent ? 'Sent' : 'Draft'}
            </Text>
          </View>
          <Text style={styles.metaText}>{quote.lineItems.length} item{quote.lineItems.length !== 1 ? 's' : ''}</Text>
          <View style={styles.metaSep} />
          <Text style={styles.metaText}>{formatDate(quote.updatedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  spine: {
    width: 3,
  },
  spineSent: {
    backgroundColor: C.yellow,
  },
  spineDraft: {
    backgroundColor: C.textDim,
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  client: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 15.5,
    color: C.text,
    flex: 1,
  },
  total: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 22,
    color: C.yellow,
    letterSpacing: 0.5,
    marginLeft: 12,
  },
  job: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 12,
    color: C.textMid,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  tagSent: {
    borderColor: C.yellow,
    backgroundColor: 'rgba(245,200,66,0.08)',
  },
  tagDraft: {
    borderColor: C.border,
    backgroundColor: 'transparent',
  },
  tagText: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagTextSent: {
    color: C.yellow,
  },
  tagTextDraft: {
    color: C.textMid,
  },
  metaText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 11,
    color: C.textDim,
  },
  metaSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.textDim,
  },
});
