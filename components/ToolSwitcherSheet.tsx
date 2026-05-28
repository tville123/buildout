import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import type { ToolName } from '../types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TOOLS: Array<{ name: ToolName; sub: string; icon: IoniconsName }> = [
  { name: 'Paint',   sub: 'gallons & quarts',     icon: 'brush-outline' },
  { name: 'Tile',    sub: 'tiles & boxes',         icon: 'grid-outline' },
  { name: 'Grout',   sub: 'lbs & bags',            icon: 'apps-outline' },
  { name: 'LVP',     sub: 'sq ft & boxes',         icon: 'layers-outline' },
  { name: 'Carpet',  sub: 'sq yards',              icon: 'albums-outline' },
  { name: 'Stairs',  sub: 'tread + riser',         icon: 'trending-up' },
  { name: 'Drywall', sub: 'sheets, mud, tape',     icon: 'hammer-outline' },
];

interface ToolSwitcherSheetProps {
  visible: boolean;
  active: ToolName;
  onSelect: (tool: ToolName) => void;
  onClose: () => void;
}

export default function ToolSwitcherSheet({ visible, active, onSelect, onClose }: ToolSwitcherSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.titleRow}>
          <Text style={styles.title}>Choose Calculator</Text>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.done}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {TOOLS.map(tool => {
            const isActive = active === tool.name;
            return (
              <TouchableOpacity
                key={tool.name}
                style={[styles.cell, isActive && styles.cellActive]}
                onPress={() => onSelect(tool.name)}
                activeOpacity={0.7}
              >
                <Ionicons name={tool.icon} size={22} color={isActive ? C.yellow : C.textMid} />
                <Text style={[styles.cellName, isActive && styles.cellNameActive]}>{tool.name}</Text>
                <Text style={styles.cellSub}>{tool.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: C.border,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  title: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: C.text,
  },
  done: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  cell: {
    width: '47%',
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  cellActive: {
    borderColor: C.yellow,
    backgroundColor: 'rgba(245,200,66,0.06)',
  },
  cellName: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: C.text,
  },
  cellNameActive: {
    color: C.yellow,
  },
  cellSub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: C.textDim,
  },
});
