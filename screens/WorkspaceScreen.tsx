import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList, WorkspaceSection } from '../App';
import { navigateToSettings } from '../navigationRef';
import { C } from '../theme';
import TopBar from '../components/TopBar';
import SectionNav from '../components/SectionNav';
import DashboardSection from './sections/DashboardSection';
import QuotesSection from './sections/QuotesSection';
import InvoicesSection from './sections/InvoicesSection';
import ClientsSection from './sections/ClientsSection';

type Props = NativeStackScreenProps<QuoteStackParamList, 'Workspace'>;

const TOPBAR_TAG: Record<WorkspaceSection, string> = {
  dashboard: 'Buildout',
  quotes: 'Quotes',
  invoices: 'Invoices',
  clients: 'Clients',
};

export default function WorkspaceScreen({ navigation, route }: Props) {
  const [section, setSection] = useState<WorkspaceSection>(route.params?.section ?? 'dashboard');

  // Jump to a section when navigated with a section param (e.g. after Convert).
  useEffect(() => {
    if (route.params?.section) setSection(route.params.section);
  }, [route.params?.section]);

  return (
    <View style={styles.container}>
      <TopBar
        tag={TOPBAR_TAG[section]}
        actions={['settings', 'more']}
        onActionPress={(a) => { if (a === 'settings') navigateToSettings(); }}
      />
      <SectionNav active={section} onSelect={setSection} />

      <View style={styles.body}>
        {section === 'dashboard' && <DashboardSection navigation={navigation} goToSection={setSection} />}
        {section === 'quotes' && <QuotesSection navigation={navigation} goToSection={setSection} />}
        {section === 'invoices' && <InvoicesSection navigation={navigation} />}
        {section === 'clients' && <ClientsSection navigation={navigation} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  body: { flex: 1 },
});
