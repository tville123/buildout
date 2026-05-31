import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { QuoteStackParamList, WorkspaceSection } from '../../App';
import { useWorkspace } from '../../context/WorkspaceContext';
import { C } from '../../theme';
import { money0 } from '../../utils/format';
import HeroCard from '../../components/HeroCard';
import StatCard from '../../components/StatCard';
import QuickCreateCard from '../../components/QuickCreateCard';
import ActivityRow from '../../components/ActivityRow';

type Nav = NativeStackNavigationProp<QuoteStackParamList, 'Workspace'>;

function currentGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardSection({ navigation, goToSection }: { navigation: Nav; goToSection: (s: WorkspaceSection) => void }) {
  const { dashboardStats: stats, recentActivity, clientName, createQuote } = useWorkspace();
  const greetingDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
      <View style={styles.greet}>
        <Text style={styles.greetEyebrow}>{greetingDate.toUpperCase()}</Text>
        <Text style={styles.greetTitle}>{currentGreeting()}<Text style={styles.dot}>.</Text></Text>
      </View>

      <HeroCard stats={stats} />

      <View style={styles.statRow}>
        <StatCard icon="alert-circle-outline" color="#e05c3a" num={stats.overdueCount} label="Overdue" sub={money0(stats.overdueAmount)} onPress={() => goToSection('invoices')} />
        <StatCard icon="time-outline" color="#f5a623" num={stats.pendingCount} label="Pending" sub={money0(stats.pendingAmount)} onPress={() => goToSection('invoices')} />
        <StatCard icon="checkmark-circle-outline" color="#4caf7d" num={stats.readyCount} label="To bill" sub={money0(stats.readyAmount)} onPress={() => goToSection('quotes')} />
      </View>

      <View style={styles.quickRow}>
        <QuickCreateCard title="New Quote" sub="Estimate" onPress={() => navigation.push('QuoteForm', { quoteId: createQuote().id })} />
        <QuickCreateCard title="New Invoice" sub="Bill a job" onPress={() => navigation.push('NewInvoice')} />
      </View>

      <View style={styles.feedHead}>
        <Text style={styles.feedLabel}>Recent activity</Text>
        <TouchableOpacity onPress={() => goToSection('quotes')} activeOpacity={0.7}>
          <Text style={styles.feedAll}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {recentActivity.length > 0 ? (
        <View style={styles.feed}>
          {recentActivity.map((a, i) => (
            <ActivityRow
              key={a.kind + a.id}
              item={a}
              clientName={clientName(a.clientId)}
              isLast={i === recentActivity.length - 1}
              onPress={() => {
                if (a.kind === 'invoice') navigation.push('InvoiceDetail', { invoiceId: a.id });
                else navigation.push('QuoteForm', { quoteId: a.id });
              }}
            />
          ))}
        </View>
      ) : (
        <View style={styles.feedEmpty}>
          <Text style={styles.feedEmptyText}>No recent activity. Create a quote to get started.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  greet: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 4 },
  greetEyebrow: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, letterSpacing: 1.2, color: C.textDim, marginBottom: 4 },
  greetTitle: { fontFamily: 'BebasNeue_400Regular', fontSize: 34, lineHeight: 36, letterSpacing: 1, color: C.text },
  dot: { color: C.yellow },
  statRow: { flexDirection: 'row', gap: 8, marginHorizontal: 24, marginTop: 8 },
  quickRow: { flexDirection: 'row', gap: 8, marginHorizontal: 24, marginTop: 14 },
  feedHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 10 },
  feedLabel: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 2.5, textTransform: 'uppercase', color: C.yellow },
  feedAll: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, letterSpacing: 0.6, color: C.textDim },
  feed: { marginHorizontal: 24, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, overflow: 'hidden' },
  feedEmpty: { marginHorizontal: 24, paddingVertical: 24, alignItems: 'center' },
  feedEmptyText: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textDim, textAlign: 'center' },
});
