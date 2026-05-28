import { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CalculateStackParamList } from '../App';
import type { ToolName } from '../types';
import { useQuote } from '../context/QuoteContext';
import { navigateToSettings } from '../navigationRef';
import TopBar from '../components/TopBar';
import ToolSwitcherSheet from '../components/ToolSwitcherSheet';

import PaintScreen from './PaintScreen';
import TileScreen from './TileScreen';
import GroutScreen from './GroutScreen';
import LVPScreen from './LVPScreen';
import CarpetScreen from './CarpetScreen';
import StairsScreen from './StairsScreen';
import DrywallScreen from './DrywallScreen';

type Props = NativeStackScreenProps<CalculateStackParamList, 'Calculator'>;

const SCREENS: Record<ToolName, React.ComponentType<CalcScreenProps>> = {
  Paint: PaintScreen,
  Tile: TileScreen,
  Grout: GroutScreen,
  LVP: LVPScreen,
  Carpet: CarpetScreen,
  Stairs: StairsScreen,
  Drywall: DrywallScreen,
};

export interface CalcScreenProps {
  onAddToQuote?: (payload: { source: string; items: Array<{ description: string; quantity: number; unitPrice: number; source?: string }> }) => void;
}

export default function CalculatorScreen({ route }: Props) {
  const [tool, setTool] = useState<ToolName>(route.params?.tool ?? 'Paint');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const { addToQuote } = useQuote();

  const handleAddToQuote = useCallback((payload: { source: string; items: Array<{ description: string; quantity: number; unitPrice: number; source?: string }> }) => {
    addToQuote(payload);
  }, [addToQuote]);

  const CalcComponent = SCREENS[tool];

  return (
    <View style={styles.container}>
      <TopBar
        tag={tool}
        onTagPress={() => setShowSwitcher(true)}
        actions={['share', 'settings']}
        onActionPress={(action) => {
          if (action === 'settings') navigateToSettings();
        }}
      />
      <CalcComponent onAddToQuote={handleAddToQuote} />
      <ToolSwitcherSheet
        visible={showSwitcher}
        active={tool}
        onSelect={(t) => { setTool(t); setShowSwitcher(false); }}
        onClose={() => setShowSwitcher(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});
