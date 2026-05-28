import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Platform, KeyboardAvoidingView,
} from 'react-native';

import { C, WALL_NAMES } from '../theme';
import { toShoppingList, descBuy } from '../utils/calculator';
import s from '../styles';
import type { Wall, PaintResult } from '../types';
import SectionLabel from '../components/SectionLabel';
import SegControl from '../components/SegControl';
import InputBlock from '../components/InputBlock';
import ToggleChip from '../components/ToggleChip';
import WallCard from '../components/WallCard';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import AddToQuoteCTA from '../components/AddToQuoteCTA';
import type { CalcScreenProps } from './CalculatorScreen';

export default function PaintScreen({ onAddToQuote }: CalcScreenProps) {
  const [mode, setMode] = useState<'room' | 'manual'>('room');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [hasDoor, setHasDoor] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);
  const [windowCount, setWindowCount] = useState('1');
  const [hasCeiling, setHasCeiling] = useState(false);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [, setWallCounter] = useState(0);
  const [coverageRate, setCoverageRate] = useState<number>(400);
  const [coats, setCoats] = useState<number>(2);
  const [priceWalls, setPriceWalls] = useState('');
  const [priceCeiling, setPriceCeiling] = useState('');
  const [doorW, setDoorW] = useState('');
  const [doorH, setDoorH] = useState('');
  const [windowW, setWindowW] = useState('');
  const [windowH, setWindowH] = useState('');

  const addWall = useCallback(() => {
    setWallCounter(prev => {
      const id = prev + 1;
      setWalls(ws => [...ws, { id, widthText: '', heightText: '', width: 0, height: 0, hasDoor: false, doorW: '', doorH: '', hasWindow: false, windowW: '', windowH: '' }]);
      return id;
    });
  }, []);

  const removeWall = useCallback((id: number) => {
    setWalls(prev => prev.filter(w => w.id !== id));
  }, []);

  const updateWall = useCallback((id: number, field: 'width' | 'height', val: string) => {
    setWalls(prev => prev.map(w => {
      if (w.id !== id) return w;
      const textField = field === 'width' ? 'widthText' : 'heightText';
      return { ...w, [textField]: val, [field]: parseFloat(val) || 0 };
    }));
  }, []);

  const toggleWallOpening = useCallback((id: number, type: 'door' | 'window') => {
    setWalls(prev => prev.map(w => {
      if (w.id !== id) return w;
      const field = type === 'door' ? 'hasDoor' : 'hasWindow';
      return { ...w, [field]: !w[field] };
    }));
  }, []);

  const updateWallOpening = useCallback((id: number, field: 'doorW' | 'doorH' | 'windowW' | 'windowH', val: string) => {
    setWalls(prev => prev.map(w => w.id !== id ? w : { ...w, [field]: val }));
  }, []);

  const result = ((): PaintResult | null => {
    const pwVal = parseFloat(priceWalls) || 0;
    const pcVal = parseFloat(priceCeiling) || 0;
    if (mode === 'room') {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const h = parseFloat(height) || 0;
      if (l <= 0 || w <= 0 || h <= 0) return null;
      let wallArea = 2 * (l + w) * h;
      const winCount = Math.max(1, parseInt(windowCount) || 1);
      const dW = parseFloat(doorW) || 3;
      const dH = parseFloat(doorH) || 7;
      const wW = parseFloat(windowW) || 3;
      const wH = parseFloat(windowH) || 4;
      if (hasDoor)   wallArea -= dW * dH;
      if (hasWindow) wallArea -= (wW * wH) * winCount;
      wallArea = Math.max(wallArea, 0);
      const ceilingArea = hasCeiling ? l * w : 0;
      const wallGallonsRaw = (wallArea * coats) / coverageRate;
      const ceilGallonsRaw = (ceilingArea * coats) / coverageRate;
      const totalGallons = wallGallonsRaw + ceilGallonsRaw;
      const wallBuy = toShoppingList(wallGallonsRaw);
      const ceilBuy = ceilingArea > 0 ? toShoppingList(ceilGallonsRaw) : null;
      const wallCost = pwVal ? (wallBuy.gallons + wallBuy.quarts * 0.25) * pwVal : null;
      const ceilCost = pcVal && ceilBuy ? (ceilBuy.gallons + ceilBuy.quarts * 0.25) * pcVal : null;
      const totalCost = wallCost !== null || ceilCost !== null ? (wallCost ?? 0) + (ceilCost ?? 0) : null;
      return { totalGallons, totalArea: wallArea + ceilingArea, coats, wallBuy, ceilBuy, wallArea, ceilingArea, totalCost, summaryRows: null, proTip: wallBuy.quarts > 0 ? 'A quart is perfect for small walls or accent coverage.' : 'Full gallons are the best value at this size.' };
    } else {
      const valid = walls.filter(w => w.width > 0 && w.height > 0 && isFinite(w.width) && isFinite(w.height));
      if (valid.length === 0) return null;
      let wallArea = 0;
      const summaryRows: Array<{ name: string; sqft: number }> = [];
      valid.forEach((w) => {
        const raw = w.width * w.height;
        const dW = parseFloat(w.doorW) || 3;
        const dH = parseFloat(w.doorH) || 7;
        const wW = parseFloat(w.windowW) || 3;
        const wH = parseFloat(w.windowH) || 4;
        const deduct = (w.hasDoor ? dW * dH : 0) + (w.hasWindow ? wW * wH : 0);
        const net = Math.max(raw - deduct, 0);
        wallArea += net;
        const idx = walls.indexOf(w);
        summaryRows.push({ name: (WALL_NAMES[idx] ?? `Wall ${idx + 1}`) + (deduct > 0 ? ` (−${deduct.toFixed(0)} sqft)` : ''), sqft: net });
      });
      const wallGallonsRaw = (wallArea * coats) / coverageRate;
      const wallBuy = toShoppingList(wallGallonsRaw);
      const wallCost = pwVal ? (wallBuy.gallons + wallBuy.quarts * 0.25) * pwVal : null;
      return { totalGallons: wallGallonsRaw, totalArea: wallArea, coats, wallBuy, ceilBuy: null, wallArea, ceilingArea: 0, totalCost: wallCost, summaryRows, proTip: wallBuy.quarts > 0 ? 'A quart is perfect for small walls or accent coverage.' : 'Full gallons are the best value at this size.' };
    }
  })();

  const labelNums = mode === 'room' ? { s: '05', c: '06', p: '07' } : { s: '03', c: '04', p: '05' };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <SectionLabel text="01 — Mode" />
          <SegControl
            options={[{ value: 'room' as const, label: 'Full Room' }, { value: 'manual' as const, label: 'Manual Walls' }]}
            active={mode}
            onSelect={(v) => { setMode(v); if (v === 'manual' && walls.length === 0) addWall(); }}
          />
        </View>

        {mode === 'room' && <>
          <View style={s.section}>
            <SectionLabel text="02 — Room Dimensions" />
            <View style={s.grid3}>
              <InputBlock label="Length" value={length} onChangeText={setLength} placeholder="12" unit="ft" />
              <InputBlock label="Width" value={width} onChangeText={setWidth} placeholder="10" unit="ft" />
              <InputBlock label="Height" value={height} onChangeText={setHeight} placeholder="9" unit="ft" />
            </View>
          </View>
          <View style={s.section}>
            <SectionLabel text="03 — Subtract Openings" />
            <View style={s.toggleRow}>
              <ToggleChip label="Door" sub={`~${((parseFloat(doorW) || 3) * (parseFloat(doorH) || 7)).toFixed(0)} sq ft`} active={hasDoor} onPress={() => setHasDoor(v => !v)} />
              <ToggleChip label="Window" sub={`~${((parseFloat(windowW) || 3) * (parseFloat(windowH) || 4)).toFixed(0)} sq ft each`} active={hasWindow} onPress={() => setHasWindow(v => !v)} />
            </View>
            {hasDoor && (
              <View style={s.openingDimRow}>
                <InputBlock label="Door W" value={doorW} onChangeText={setDoorW} placeholder="3" unit="ft" />
                <InputBlock label="Door H" value={doorH} onChangeText={setDoorH} placeholder="7" unit="ft" />
              </View>
            )}
            {hasWindow && (
              <View style={s.openingDimRow}>
                <InputBlock label="Window W" value={windowW} onChangeText={setWindowW} placeholder="3" unit="ft" />
                <InputBlock label="Window H" value={windowH} onChangeText={setWindowH} placeholder="4" unit="ft" />
              </View>
            )}
            {hasWindow && <View style={{ marginTop: 8, maxWidth: 160 }}>
              <InputBlock label="No. of Windows" value={windowCount} onChangeText={setWindowCount} placeholder="1" unit="windows" />
            </View>}
          </View>
          <View style={s.section}>
            <SectionLabel text="04 — Include Ceiling?" />
            <View style={s.toggleRow}>
              <ToggleChip label="Paint ceiling too" sub="adds L × W sq ft" active={hasCeiling} onPress={() => setHasCeiling(v => !v)} />
            </View>
          </View>
        </>}

        {mode === 'manual' && <View style={s.section}>
          <SectionLabel text="02 — Your Walls" />
          {walls.map((wall, i) => (
            <WallCard key={wall.id} wall={wall} index={i}
              onUpdate={(field, val) => updateWall(wall.id, field, val)}
              onRemove={() => removeWall(wall.id)}
              onToggleOpening={(type) => toggleWallOpening(wall.id, type)}
              onUpdateOpening={(field, val) => updateWallOpening(wall.id, field, val)}
            />
          ))}
          <TouchableOpacity style={s.addWallBtn} onPress={addWall} activeOpacity={0.7}>
            <Text style={s.addWallBtnText}>+ Add Another Wall</Text>
          </TouchableOpacity>
        </View>}

        <View style={s.section}>
          <SectionLabel text={`${labelNums.s} — Surface Type`} />
          <SegControl options={[{ value: 400, label: 'Smooth' }, { value: 350, label: 'Semi-rough' }, { value: 300, label: 'Textured' }]} active={coverageRate} onSelect={setCoverageRate} />
        </View>

        <View style={s.section}>
          <SectionLabel text={`${labelNums.c} — Number of Coats`} />
          <SegControl options={[{ value: 1, label: '1 Coat' }, { value: 2, label: '2 Coats' }, { value: 3, label: '3 Coats' }]} active={coats} onSelect={setCoats} />
        </View>

        <View style={s.section}>
          <SectionLabel text={`${labelNums.p} — Price Per Gallon (optional)`} />
          <View style={s.grid2}>
            <InputBlock label="Walls / Gallon" value={priceWalls} onChangeText={setPriceWalls} placeholder="35" unit="USD" />
            {mode === 'room' && <InputBlock label="Ceiling / Gallon" value={priceCeiling} onChangeText={setPriceCeiling} placeholder="28" unit="USD" />}
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Total Paint Needed"
            mainValue={result.totalGallons.toFixed(1)}
            unit="gallons"
            breakdownItems={[
              { value: result.totalArea.toFixed(0), label: 'Sq Ft' },
              { value: String(result.coats), label: `Coat${result.coats > 1 ? 's' : ''}` },
              ...(result.totalCost !== null ? [{ value: `$${result.totalCost.toFixed(0)}`, label: 'Est. Cost' }] : []),
            ]}
          />

          {result.summaryRows && result.summaryRows.length > 0 && <View style={s.wallSummary}>
            <Text style={s.wallSummaryTitle}>Wall Breakdown</Text>
            {result.summaryRows.map((row, i) => (
              <View key={i} style={[s.wallSummaryRow, i === result.summaryRows!.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={s.wallSummaryLeft}>{row.name}</Text>
                <Text style={s.wallSummaryRight}>{row.sqft.toFixed(1)} sq ft</Text>
              </View>
            ))}
          </View>}

          <ShoppingList
            items={[
              {
                name: 'Wall Paint',
                sub: `${result.wallArea.toFixed(1)} sq ft · ${result.coats} coat${result.coats > 1 ? 's' : ''} · ${coverageRate} sq ft/gal`,
                qty: descBuy(result.wallBuy),
              },
              ...(result.ceilBuy ? [{
                name: 'Ceiling Paint',
                sub: `${result.ceilingArea.toFixed(1)} sq ft · ${result.coats} coat${result.coats > 1 ? 's' : ''}`,
                qty: descBuy(result.ceilBuy),
              }] : []),
            ]}
          />

          {onAddToQuote && (
            <AddToQuoteCTA
              onPress={() => onAddToQuote({
                source: 'Paint Calc',
                items: [
                  { description: `Wall paint — ${result.wallArea.toFixed(0)} sq ft, ${coats} coat${coats > 1 ? 's' : ''}`, quantity: result.wallBuy.gallons || 1, unitPrice: 58, source: 'Paint Calc' },
                  ...(result.ceilBuy ? [{ description: `Ceiling paint — ${result.ceilingArea.toFixed(0)} sq ft`, quantity: result.ceilBuy.gallons || 1, unitPrice: 52, source: 'Paint Calc' }] : []),
                ],
              })}
            />
          )}

          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Always grab 10% extra for touch-ups. {result.proTip}</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🪣</Text>
          <Text style={s.noResultText}>{mode === 'room' ? 'Enter your room dimensions to get started.' : 'Add walls above and enter their dimensions.'}</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
