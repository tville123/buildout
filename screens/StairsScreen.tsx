import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcStairs, type StairsResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import InputBlock from '../components/InputBlock';
import ToggleChip from '../components/ToggleChip';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import TopBar from '../components/TopBar';

export default function StairsScreen() {
  const [numStairs, setNumStairs] = useState('');
  const [treadDepth, setTreadDepth] = useState('');
  const [riserHeight, setRiserHeight] = useState('');
  const [stairWidth, setStairWidth] = useState('');
  const [carpetRisers, setCarpetRisers] = useState(false);

  const result = ((): StairsResult | null => {
    const ns = parseFloat(numStairs) || 0;
    const td = parseFloat(treadDepth) || 0;
    const rh = parseFloat(riserHeight) || 0;
    const sw = parseFloat(stairWidth) || 0;
    if (!ns || !td || !sw) return null;
    if (carpetRisers && !rh) return null;
    return calcStairs({ numStairs: ns, treadDepth: td, riserHeight: rh, stairWidth: sw, carpetRisers });
  })();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar tag="Stairs" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <SectionLabel text="01 — Stair Count" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Number of Stairs" value={numStairs} onChangeText={setNumStairs} placeholder="13" unit="stairs" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="02 — Dimensions" />
          <View style={s.grid3}>
            <InputBlock label="Tread Depth" value={treadDepth} onChangeText={setTreadDepth} placeholder="10" unit="in" />
            <InputBlock label="Stair Width" value={stairWidth} onChangeText={setStairWidth} placeholder="36" unit="in" />
            {carpetRisers && <InputBlock label="Riser Height" value={riserHeight} onChangeText={setRiserHeight} placeholder="7.5" unit="in" />}
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="03 — Cover Risers?" />
          <View style={s.toggleRow}>
            <ToggleChip label="Carpet risers too" sub="adds riser area" active={carpetRisers} onPress={() => setCarpetRisers(v => !v)} />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Total Area Needed"
            mainValue={result.areaWithWaste.toFixed(1)}
            unit="sq ft"
            breakdownItems={[
              { value: result.treadArea.toFixed(1), label: 'Treads' },
              ...(carpetRisers ? [{ value: result.riserArea.toFixed(1), label: 'Risers' }] : []),
              { value: result.totalArea.toFixed(1), label: 'Subtotal' },
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'Stair Carpet / Flooring',
                sub: `${numStairs} stairs · 15% waste for cuts`,
                qty: `${result.areaWithWaste.toFixed(1)} sq ft`,
              },
            ]}
          />
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Stairs have more cuts and angles than flat floors. The 15% waste buffer covers typical pattern matching and angled cuts.</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🪜</Text>
          <Text style={s.noResultText}>Enter your stair count, tread depth, and width to get started.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
