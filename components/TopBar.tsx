import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { usePaid } from '../context/PaidContext';

type ActionName = 'share' | 'settings' | 'more';

interface TopBarProps {
  tag: string;
  onBack?: () => void;
  onTagPress?: () => void;
  actions?: ReadonlyArray<ActionName>;
  onActionPress?: (action: ActionName) => void;
}

const ICON_NAME: Record<ActionName, React.ComponentProps<typeof Ionicons>['name']> = {
  share: 'share-outline',
  settings: 'settings-outline',
  more: 'ellipsis-horizontal-outline',
};

export default function TopBar({ tag, onBack, onTagPress, actions = ['share', 'settings'], onActionPress }: TopBarProps) {
  const isPaid = usePaid();
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back-outline" size={19} color={C.textMid} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onTagPress} activeOpacity={onTagPress ? 0.7 : 1} style={styles.tagRow}>
          <Text style={styles.tag}>{tag}</Text>
          {onTagPress ? (
            <Ionicons name="chevron-down-outline" size={12} color={C.yellow} style={{ marginLeft: 3 }} />
          ) : null}
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        {!isPaid && (
          <View style={styles.upgradePill}>
            <Text style={styles.upgradePillText}>UPGRADE</Text>
          </View>
        )}
        {actions.map(name => (
          <TouchableOpacity key={name} style={styles.iconBtn} activeOpacity={0.7} onPress={() => onActionPress?.(name)}>
            <Ionicons name={ICON_NAME[name]} size={19} color={C.textMid} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 68 : 44,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 10,
    letterSpacing: 2.8,
    textTransform: 'uppercase',
    color: C.yellow,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  upgradePill: {
    borderWidth: 1,
    borderColor: C.yellow,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 4,
  },
  upgradePillText: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 9,
    letterSpacing: 2.2,
    color: C.yellow,
  },
});
