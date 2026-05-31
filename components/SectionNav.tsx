import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import type { WorkspaceSection } from '../App';

const SECTIONS: { id: WorkspaceSection; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'clients', label: 'Clients' },
];

interface Props {
  active: WorkspaceSection;
  onSelect: (section: WorkspaceSection) => void;
}

// Segmented section nav (default variant) — fixed between TopBar and scroll area.
export default function SectionNav({ active, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {SECTIONS.map(s => {
        const isActive = s.id === active;
        return (
          <TouchableOpacity
            key={s.id}
            style={[styles.btn, isActive && styles.btnActive]}
            onPress={() => onSelect(s.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{s.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: C.yellow,
    borderColor: C.yellow,
  },
  label: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 11,
    letterSpacing: 0.4,
    color: C.textMid,
  },
  labelActive: {
    color: '#000',
  },
});
