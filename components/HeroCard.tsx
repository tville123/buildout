import { View, Text, StyleSheet } from 'react-native';
import { money0, splitMoney } from '../utils/format';
import type { DashboardStats } from '../utils/workspace';

export default function HeroCard({ stats }: { stats: DashboardStats }) {
  const { whole, cents } = splitMoney(stats.outstanding);
  const invCount = stats.overdueCount + stats.pendingCount;
  return (
    <View style={styles.card}>
      <View style={styles.tagRow}>
        <Text style={styles.tag}>Total Outstanding</Text>
        <Text style={styles.meta}>{invCount} INVOICE{invCount === 1 ? '' : 'S'}</Text>
      </View>
      <Text style={styles.main}>
        {whole}<Text style={styles.cents}>.{cents}</Text>
      </Text>
      <View style={styles.foot}>
        <View style={styles.pair}>
          <Text style={styles.pairV}>{money0(stats.overdueAmount)}</Text>
          <Text style={styles.pairK}>Overdue</Text>
        </View>
        <View style={styles.pair}>
          <Text style={styles.pairV}>{money0(stats.pendingAmount)}</Text>
          <Text style={styles.pairK}>Pending</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#f5c842',
    borderRadius: 16,
    padding: 22,
    paddingVertical: 18,
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 9.6,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.45)',
  },
  meta: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9.6,
    letterSpacing: 0.6,
    color: 'rgba(0,0,0,0.45)',
  },
  main: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 58,
    lineHeight: 58,
    letterSpacing: 1,
    color: '#000',
  },
  cents: {
    fontSize: 26,
    lineHeight: 26,
  },
  foot: {
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.12)',
    flexDirection: 'row',
    gap: 28,
  },
  pair: {
    gap: 1,
  },
  pairV: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13,
    color: '#000',
  },
  pairK: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.45)',
    marginTop: 2,
  },
});
