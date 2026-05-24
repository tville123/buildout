import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StatusBar, Platform, KeyboardAvoidingView,
} from 'react-native';
import {
  useFonts,
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  IBMPlexSans_300Light,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';

import { C, WALL_NAMES } from './theme';
import { toShoppingList, descBuy } from './utils/calculator';
import s from './styles';
import SectionLabel from './components/SectionLabel';
import SegControl from './components/SegControl';
import InputBlock from './components/InputBlock';
import ToggleChip from './components/ToggleChip';
import WallCard from './components/WallCard';

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  const [mode, setMode] = useState('room');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [hasDoor, setHasDoor] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);
  const [windowCount, setWindowCount] = useState('1');
  const [hasCeiling, setHasCeiling] = useState(false);
  const [walls, setWalls] = useState([]);
  const [wallCounter, setWallCounter] = useState(0);
  const [coverageRate, setCoverageRate] = useState(400);
  const [coats, setCoats] = useState(2);
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

  const removeWall = useCallback((id) => {
    setWalls(prev => prev.filter(w => w.id !== id));
  }, []);

  const updateWall = useCallback((id, field, val) => {
    setWalls(prev => prev.map(w => {
      if (w.id !== id) return w;
      const textField = field === 'width' ? 'widthText' : 'heightText';
      return { ...w, [textField]: val, [field]: parseFloat(val) || 0 };
    }));
  }, []);

  const toggleWallOpening = useCallback((id, type) => {
    setWalls(prev => prev.map(w => {
      if (w.id !== id) return w;
      const field = type === 'door' ? 'hasDoor' : 'hasWindow';
      return { ...w, [field]: !w[field] };
    }));
  }, []);

  const updateWallOpening = useCallback((id, field, val) => {
    setWalls(prev => prev.map(w => w.id !== id ? w : { ...w, [field]: val }));
  }, []);

  const result = (() => {
    const pwVal = parseFloat(priceWalls) || 0;
    const pcVal = parseFloat(priceCeiling) || 0;
    if (mode === 'room') {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const h = parseFloat(height) || 0;
      if (!l || !w || !h) return null;
      let wallArea = 2 * (l + w) * h;
      const winCount = parseInt(windowCount) || 1;
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
      const totalCost = wallCost !== null || ceilCost !== null ? (wallCost || 0) + (ceilCost || 0) : null;
      return { totalGallons, totalArea: wallArea + ceilingArea, coats, wallBuy, ceilBuy, wallArea, ceilingArea, totalCost, summaryRows: null, proTip: wallBuy.quarts > 0 ? 'A quart is perfect for small walls or accent coverage.' : 'Full gallons are the best value at this size.' };
    } else {
      const valid = walls.filter(w => w.width > 0 && w.height > 0);
      if (valid.length === 0) return null;
      let wallArea = 0;
      const summaryRows = [];
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
        summaryRows.push({ name: (WALL_NAMES[idx] || `Wall ${idx + 1}`) + (deduct > 0 ? ` (−${deduct.toFixed(0)} sqft)` : ''), sqft: net });
      });
      const wallGallonsRaw = (wallArea * coats) / coverageRate;
      const wallBuy = toShoppingList(wallGallonsRaw);
      const wallCost = pwVal ? (wallBuy.gallons + wallBuy.quarts * 0.25) * pwVal : null;
      return { totalGallons: wallGallonsRaw, totalArea: wallArea, coats, wallBuy, ceilBuy: null, wallArea, ceilingArea: 0, totalCost: wallCost, summaryRows, proTip: wallBuy.quarts > 0 ? 'A quart is perfect for small walls or accent coverage.' : 'Full gallons are the best value at this size.' };
    }
  })();

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  const labelNums = mode === 'room' ? { s: '05', c: '06', p: '07' } : { s: '03', c: '04', p: '05' };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.headerTag}>Paint Calculator</Text>
            <Text style={s.headerTitle}>COAT<Text style={{ color: C.yellow }}>.</Text></Text>
            <Text style={s.headerSub}>Get the exact paint you need — no guessing, no waste, no extra trips.</Text>
          </View>

          <View style={s.section}>
            <SectionLabel text="01 — Mode" />
            <SegControl
              options={[{ value: 'room', label: 'Full Room' }, { value: 'manual', label: 'Manual Walls' }]}
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
            <View style={s.resultCard}>
              <Text style={s.resultTag}>Total Paint Needed</Text>
              <Text style={s.resultMain}>{result.totalGallons.toFixed(1)} <Text style={s.resultUnit}>gallons</Text></Text>
              <View style={s.resultDivider} />
              <View style={s.resultBreakdown}>
                <View><Text style={s.breakdownVal}>{result.totalArea.toFixed(0)}</Text><Text style={s.breakdownLabel}>Sq Ft</Text></View>
                <View><Text style={s.breakdownVal}>{result.coats}</Text><Text style={s.breakdownLabel}>Coat{result.coats > 1 ? 's' : ''}</Text></View>
                {result.totalCost !== null && <View><Text style={s.breakdownVal}>${result.totalCost.toFixed(0)}</Text><Text style={s.breakdownLabel}>Est. Cost</Text></View>}
              </View>
            </View>

            {result.summaryRows && result.summaryRows.length > 0 && <View style={s.wallSummary}>
              <Text style={s.wallSummaryTitle}>Wall Breakdown</Text>
              {result.summaryRows.map((row, i) => (
                <View key={i} style={[s.wallSummaryRow, i === result.summaryRows.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={s.wallSummaryLeft}>{row.name}</Text>
                  <Text style={s.wallSummaryRight}>{row.sqft.toFixed(1)} sq ft</Text>
                </View>
              ))}
            </View>}

            <View style={s.shoppingCard}>
              <Text style={s.shoppingTitle}>🛒 Shopping List</Text>
              <View style={[s.shopItem, !result.ceilBuy && { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.shopName}>Wall Paint</Text>
                  <Text style={s.shopSub}>{result.wallArea.toFixed(1)} sq ft · {result.coats} coat{result.coats > 1 ? 's' : ''} · {coverageRate} sq ft/gal</Text>
                </View>
                <Text style={s.shopQty}>{descBuy(result.wallBuy)}</Text>
              </View>
              {result.ceilBuy && <View style={[s.shopItem, { borderBottomWidth: 0 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={s.shopName}>Ceiling Paint</Text>
                  <Text style={s.shopSub}>{result.ceilingArea.toFixed(1)} sq ft · {result.coats} coat{result.coats > 1 ? 's' : ''}</Text>
                </View>
                <Text style={s.shopQty}>{descBuy(result.ceilBuy)}</Text>
              </View>}
            </View>

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
    </View>
  );
}
