import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { C } from '../theme';
import TopBar from '../components/TopBar';
import { usePaid } from '../context/PaidContext';
import type { RootStackParamList } from '../navigationRef';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const isPaid = usePaid();
  const [autoSave, setAutoSave] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <View style={styles.container}>
      <TopBar
        tag="Settings"
        onBack={() => navigation.goBack()}
        actions={['more']}
        onActionPress={() => {}}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isPaid ? (
          <View style={styles.proCard}>
            <View style={styles.proMark}>
              <Ionicons name="lock-closed-outline" size={20} color={C.textMid} />
            </View>
            <View style={styles.proBody}>
              <Text style={styles.proEyebrow}>Buildout Pro</Text>
              <Text style={styles.proTitle}>$2.99 — one time</Text>
              <Text style={styles.proDesc}>Removes ads and unlocks PDF export. No subscription.</Text>
            </View>
            <TouchableOpacity style={styles.proBtn} activeOpacity={0.8}>
              <Text style={styles.proBtnText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.paidCard}>
            <Ionicons name="checkmark-circle" size={18} color={C.yellow} />
            <View>
              <Text style={styles.paidTitle}>Buildout Pro · active</Text>
              <Text style={styles.paidSub}>Lifetime</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>01 — Quote Defaults</Text>
          <SettingRow label="Default tax rate" value="8.25%" />
          <SettingRow label="Default waste buffer" value="10%" />
          <SettingRow label="Default valid for" value="30 days" />
          <SettingRow label="Company name" value="Drafthouse Trade Co." />
          <SettingRow label="Phone" value="(415) 555-0188" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>02 — Calculator Defaults</Text>
          <SettingRow label="Length / area units" value="Imperial (ft, in)" />
          <ToggleRow label="Always include ceiling" value={false} />
          <ToggleRow label="Auto-save calculations" value={autoSave} onToggle={setAutoSave} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>03 — Display</Text>
          <ToggleRow label="Compact mode" value={false} />
          <ToggleRow label="Haptics on input" value={haptics} onToggle={setHaptics} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>04 — About</Text>
          <SettingRow label="Send feedback" chevron />
          <SettingRow label="Privacy policy" chevron />
          <SettingRow label="Terms of service" chevron />
          <SettingRow label="Restore purchases" chevron />
          <Text style={styles.version}>BUILDOUT<Text style={{ color: C.yellow }}>.</Text> · v1.0 (b. 117)</Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function SettingRow({ label, value, chevron }: { label: string; value?: string; chevron?: boolean }) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={chevron ? 0.7 : 1}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value ? <Text style={styles.rowValue}>{value}</Text> : null}
        {(chevron || value) ? <Ionicons name="chevron-forward-outline" size={14} color={C.textDim} /> : null}
      </View>
    </TouchableOpacity>
  );
}

function ToggleRow({ label, value, onToggle }: { label: string; value: boolean; onToggle?: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        thumbColor={value ? C.yellow : C.textDim}
        trackColor={{ false: C.border, true: 'rgba(245,200,66,0.3)' }}
        ios_backgroundColor={C.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  proCard: {
    margin: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  proMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proBody: {
    flex: 1,
    gap: 3,
  },
  proEyebrow: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 9.6,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: C.yellow,
  },
  proTitle: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: C.text,
  },
  proDesc: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 11.5,
    color: C.textMid,
    lineHeight: 17,
  },
  proBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  proBtnText: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 12,
    color: C.yellow,
  },
  paidCard: {
    margin: 16,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paidTitle: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 13,
    color: C.text,
  },
  paidSub: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 11,
    color: C.textMid,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  sectionLabel: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 9.6,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: C.yellow,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLabel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13.5,
    color: C.text,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowValue: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12.5,
    color: C.textMid,
  },
  version: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: '#444',
    textAlign: 'center',
    paddingVertical: 20,
    letterSpacing: 0.4,
  },
});
