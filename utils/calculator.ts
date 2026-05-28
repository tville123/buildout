import type { ShoppingListBuy } from '../types';

export function toShoppingList(gallonsRaw: number): ShoppingListBuy {
  const gallons = Math.floor(gallonsRaw);
  const quarts = Math.ceil((gallonsRaw - gallons) * 4);
  if (quarts >= 4) return { gallons: gallons + 1, quarts: 0 };
  return { gallons, quarts };
}

export function descBuy(buy: ShoppingListBuy): string {
  const parts: string[] = [];
  if (buy.gallons > 0) parts.push(`${buy.gallons} gal`);
  if (buy.quarts > 0) parts.push(`${buy.quarts} qt`);
  return parts.join(' + ') || '< 1 qt';
}

export interface TileResult {
  roomArea: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  boxesNeeded: number;
}

export function calcTile(params: {
  roomL: number; roomW: number; tileW: number; tileH: number; tilesPerBox: number;
}): TileResult {
  const { roomL, roomW, tileW, tileH, tilesPerBox } = params;
  const roomArea = roomL * roomW;
  const tileArea = (tileW * tileH) / 144;
  const tilesNeeded = Math.ceil(roomArea / tileArea);
  const tilesWithWaste = Math.ceil(tilesNeeded * 1.10);
  const boxesNeeded = Math.ceil(tilesWithWaste / tilesPerBox);
  return { roomArea, tilesNeeded, tilesWithWaste, boxesNeeded };
}

export interface GroutResult {
  roomArea: number;
  lbsNeeded: number;
  bagsNeeded: number;
}

// k=18 derived from: 12×12 tile, 1/8" joint → ~0.375 lbs/sq ft (≈1.5 bags/100 sq ft)
export function calcGrout(params: {
  roomL: number; roomW: number; tileW: number; tileH: number; jointWidth: number; bagWeight: number;
}): GroutResult {
  const { roomL, roomW, tileW, tileH, jointWidth, bagWeight } = params;
  const roomArea = roomL * roomW;
  const groutFactor = ((tileW + tileH) / (tileW * tileH)) * jointWidth * 18;
  const lbsNeeded = Math.ceil(roomArea * groutFactor * 1.10);
  const bagsNeeded = Math.ceil(lbsNeeded / bagWeight);
  return { roomArea, lbsNeeded, bagsNeeded };
}

export interface LVPResult {
  roomArea: number;
  areaWithWaste: number;
  boxesNeeded: number;
  totalCost: number | null;
}

export function calcLVP(params: {
  roomL: number; roomW: number; sqftPerBox: number; pricePerBox: number | null;
}): LVPResult {
  const { roomL, roomW, sqftPerBox, pricePerBox } = params;
  const roomArea = roomL * roomW;
  const areaWithWaste = roomArea * 1.10;
  const boxesNeeded = Math.ceil(areaWithWaste / sqftPerBox);
  const totalCost = pricePerBox ? boxesNeeded * pricePerBox : null;
  return { roomArea, areaWithWaste, boxesNeeded, totalCost };
}

export interface CarpetResult {
  roomSqFt: number;
  sqYards: number;
  sqYardsWithWaste: number;
  totalCost: number | null;
}

export function calcCarpet(params: {
  roomL: number; roomW: number; pricePerSqYard: number | null;
}): CarpetResult {
  const { roomL, roomW, pricePerSqYard } = params;
  const roomSqFt = roomL * roomW;
  const sqYards = roomSqFt / 9;
  const sqYardsWithWaste = sqYards * 1.10;
  const totalCost = pricePerSqYard ? sqYardsWithWaste * pricePerSqYard : null;
  return { roomSqFt, sqYards, sqYardsWithWaste, totalCost };
}

export interface StairsResult {
  treadArea: number;
  riserArea: number;
  totalArea: number;
  areaWithWaste: number;
}

export function calcStairs(params: {
  numStairs: number; treadDepth: number; riserHeight: number; stairWidth: number; carpetRisers: boolean;
}): StairsResult {
  const { numStairs, treadDepth, riserHeight, stairWidth, carpetRisers } = params;
  const treadArea = (treadDepth / 12) * (stairWidth / 12) * numStairs;
  const riserArea = carpetRisers ? (riserHeight / 12) * (stairWidth / 12) * numStairs : 0;
  const totalArea = treadArea + riserArea;
  const areaWithWaste = totalArea * 1.15;
  return { treadArea, riserArea, totalArea, areaWithWaste };
}

export interface DrywallResult {
  wallArea: number;
  sheetsNeeded: number;
  compoundBuckets: number;
  tapeRolls: number;
  screwPounds: number;
}

export function calcDrywall(params: {
  roomL: number; roomW: number; roomH: number; doorCount: number; windowCount: number;
}): DrywallResult {
  const { roomL, roomW, roomH, doorCount, windowCount } = params;
  const DOOR_AREA = 20;
  const WINDOW_AREA = 15;
  const SHEET_AREA = 32;
  let wallArea = 2 * (roomL + roomW) * roomH;
  wallArea -= doorCount * DOOR_AREA;
  wallArea -= windowCount * WINDOW_AREA;
  wallArea = Math.max(wallArea, 0);
  const sheetsNeeded = Math.ceil(wallArea * 1.10 / SHEET_AREA);
  const compoundBuckets = Math.ceil(wallArea / 500) || 1;
  const tapeRolls = Math.ceil(wallArea / 500) || 1;
  const screwPounds = Math.ceil(wallArea / 500) || 1;
  return { wallArea, sheetsNeeded, compoundBuckets, tapeRolls, screwPounds };
}
