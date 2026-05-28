import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcGrout, type GroutResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import SegControl from '../components/SegControl';
import InputBlock from '../components/InputBlock';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import AddToQuoteCTA from '../components/AddToQuoteCTA';
import type { CalcScreenProps } from './CalculatorScreen';

const JOINT_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0.125, label: '1/8"' },
  { value: 0.1875, label: '3/16"' },
  { value: 0.25, label: '1/4"' },
];

export default function GroutScreen({ onAddToQuote }: CalcScreenProps) {
  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [tileW, setTileW] = useState('');
  const [tileH, setTileH] = useState('');
  const [jointWidth, setJointWidth] = useState(0.125);
  const [bagWeight, setBagWeight] = useState('25');

  const result = ((): GroutResult | null => {
    const l = parseFloat(roomL) || 0;
    const w = parseFloat(roomW) || 0;
    const tw = parseFloat(tileW) || 0;
    const th = parseFloat(tileH) || 0;
    const bw = Math.max(1, parseFloat(bagWeight) || 25);
    if (l <= 0 || w <= 0 || tw <= 0 || th <= 0) return null;
    return calcGrout({ roomL: l, roomW: w, tileW: tw, tileH: th, jointWidth, bagWeight: bw });
  })();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <SectionLabel text="01 — Room Size" />
          <View style={s.grid2}>
            <InputBlock label="Length" value={roomL} onChangeText={setRoomL} placeholder="12" unit="ft" />
            <InputBlock label="Width" value={roomW} onChangeText={setRoomW} placeholder="10" unit="ft" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="02 — Tile Size" />
          <View style={s.grid2}>
            <InputBlock label="Tile Width" value={tileW} onChangeText={setTileW} placeholder="12" unit="in" />
            <InputBlock label="Tile Height" value={tileH} onChangeText={setTileH} placeholder="12" unit="in" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="03 — Grout Joint Width" />
          <SegControl options={JOINT_OPTIONS} active={jointWidth} onSelect={setJointWidth} />
        </View>

        <View style={s.section}>
          <SectionLabel text="04 — Bag Weight" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Lbs Per Bag" value={bagWeight} onChangeText={setBagWeight} placeholder="25" unit="lbs" />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Bags Needed"
            mainValue={String(result.bagsNeeded)}
            unit={`bag${result.bagsNeeded !== 1 ? 's' : ''}`}
            breakdownItems={[
              { value: result.roomArea.toFixed(0), label: 'Sq Ft' },
              { value: `${result.lbsNeeded}`, label: 'Lbs Total' },
              { value: `${bagWeight || 25} lb`, label: 'Per Bag' },
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'Sanded Grout',
                sub: `${result.roomArea.toFixed(0)} sq ft · ${JOINT_OPTIONS.find(o => o.value === jointWidth)?.label} joints · 10% waste`,
                qty: `${result.bagsNeeded} bag${result.bagsNeeded !== 1 ? 's' : ''}`,
              },
            ]}
          />
          {onAddToQuote && (
            <AddToQuoteCTA
              onPress={() => onAddToQuote({
                source: 'Grout Calc',
                items: [{ description: `Sanded grout — ${JOINT_OPTIONS.find(o => o.value === jointWidth)?.label} joints`, quantity: result.bagsNeeded, unitPrice: 32, source: 'Grout Calc' }],
              })}
            />
          )}
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>{'Use sanded grout for joints wider than 1/8". Unsanded grout for 1/16"–1/8" joints or polished tile.'}</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🪨</Text>
          <Text style={s.noResultText}>Enter your room size and tile dimensions to calculate grout bags needed.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
