import {
  toShoppingList,
  descBuy,
  calcTile,
  calcGrout,
  calcLVP,
  calcCarpet,
  calcStairs,
  calcDrywall,
} from '../utils/calculator';

describe('toShoppingList', () => {
  it('returns 0 quarts for a whole number', () => {
    expect(toShoppingList(2)).toEqual({ gallons: 2, quarts: 0 });
  });

  it('converts fractional gallons to quarts', () => {
    expect(toShoppingList(1.75)).toEqual({ gallons: 1, quarts: 3 });
  });

  it('rolls over 4 quarts into an extra gallon', () => {
    // 0.99 gal → ceil(0.99 * 4) = ceil(3.96) = 4 → overflow to 1 gal 0 qt
    expect(toShoppingList(0.99)).toEqual({ gallons: 1, quarts: 0 });
  });

  it('returns zero gallons and zero quarts for 0 input', () => {
    expect(toShoppingList(0)).toEqual({ gallons: 0, quarts: 0 });
  });
});

describe('descBuy', () => {
  it('formats gallons only', () => {
    expect(descBuy({ gallons: 2, quarts: 0 })).toBe('2 gal');
  });

  it('formats quarts only', () => {
    expect(descBuy({ gallons: 0, quarts: 3 })).toBe('3 qt');
  });

  it('formats gallons and quarts together', () => {
    expect(descBuy({ gallons: 1, quarts: 2 })).toBe('1 gal + 2 qt');
  });

  it('returns fallback string when both are zero', () => {
    expect(descBuy({ gallons: 0, quarts: 0 })).toBe('< 1 qt');
  });
});

describe('calcTile', () => {
  it('calculates tiles, waste, and boxes for a standard room', () => {
    // 10×10 room, 12×12in tiles (1 sqft each), 20 per box
    const result = calcTile({ roomL: 10, roomW: 10, tileW: 12, tileH: 12, tilesPerBox: 20 });
    expect(result.roomArea).toBe(100);
    expect(result.tilesNeeded).toBe(100);
    expect(result.tilesWithWaste).toBe(111); // ceil(100 * 1.10) — JS float: 100*1.1 = 110.000...01
    expect(result.boxesNeeded).toBe(6);      // ceil(110 / 20) = ceil(5.5)
  });
});

describe('calcGrout', () => {
  it('calculates grout bags for 12×12 tile with 1/8" joint', () => {
    // groutFactor = (24/144) * 0.125 * 18 = 0.375 lbs/sqft
    const result = calcGrout({ roomL: 10, roomW: 10, tileW: 12, tileH: 12, jointWidth: 0.125, bagWeight: 25 });
    expect(result.roomArea).toBe(100);
    expect(result.lbsNeeded).toBe(42); // ceil(100 * 0.375 * 1.10) = ceil(41.25)
    expect(result.bagsNeeded).toBe(2); // ceil(42 / 25)
  });
});

describe('calcLVP', () => {
  it('calculates boxes and cost with a price per box', () => {
    // 12×10 room, 20 sqft/box, $45/box → 7 boxes (ceil(132/20))
    const result = calcLVP({ roomL: 12, roomW: 10, sqftPerBox: 20, pricePerBox: 45 });
    expect(result.roomArea).toBe(120);
    expect(result.areaWithWaste).toBe(132); // 120 * 1.10
    expect(result.boxesNeeded).toBe(7);     // ceil(132 / 20) = ceil(6.6)
    expect(result.totalCost).toBe(315);     // 7 * 45
  });

  it('returns null totalCost when no price is provided', () => {
    const result = calcLVP({ roomL: 12, roomW: 10, sqftPerBox: 20, pricePerBox: null });
    expect(result.totalCost).toBeNull();
  });
});

describe('calcCarpet', () => {
  it('converts sqft to sqyards and applies waste factor', () => {
    // 9×9 room → 81 sqft → 9 sqyds → 9.9 with waste
    const result = calcCarpet({ roomL: 9, roomW: 9, pricePerSqYard: 5 });
    expect(result.roomSqFt).toBe(81);
    expect(result.sqYards).toBe(9);
    expect(result.sqYardsWithWaste).toBeCloseTo(9.9);
    expect(result.totalCost).toBeCloseTo(49.5); // 9.9 * 5
  });

  it('returns null totalCost when no price is provided', () => {
    const result = calcCarpet({ roomL: 9, roomW: 9, pricePerSqYard: null });
    expect(result.totalCost).toBeNull();
  });
});

describe('calcStairs', () => {
  it('includes riser area when carpetRisers is true', () => {
    // 5 stairs, 12in tread, 8in riser, 36in wide
    const result = calcStairs({ numStairs: 5, treadDepth: 12, riserHeight: 8, stairWidth: 36, carpetRisers: true });
    expect(result.treadArea).toBe(15);    // (12/12) * (36/12) * 5 = 1 * 3 * 5
    expect(result.riserArea).toBeCloseTo(10); // (8/12) * (36/12) * 5
    expect(result.totalArea).toBeCloseTo(25);
    expect(result.areaWithWaste).toBeCloseTo(28.75); // 25 * 1.15
  });

  it('sets riserArea to 0 when carpetRisers is false', () => {
    const result = calcStairs({ numStairs: 5, treadDepth: 12, riserHeight: 8, stairWidth: 36, carpetRisers: false });
    expect(result.riserArea).toBe(0);
    expect(result.totalArea).toBe(15);
    expect(result.areaWithWaste).toBeCloseTo(17.25); // 15 * 1.15
  });
});

describe('calcDrywall', () => {
  it('calculates sheets and accessories for a standard room', () => {
    // 10×12×9ft, 2 doors, 3 windows → wallArea = 2*(10+12)*9 - 40 - 45 = 311
    const result = calcDrywall({ roomL: 10, roomW: 12, roomH: 9, doorCount: 2, windowCount: 3 });
    expect(result.wallArea).toBe(311);
    expect(result.sheetsNeeded).toBe(11);    // ceil(311 * 1.10 / 32) = ceil(10.69)
    expect(result.compoundBuckets).toBe(1);
    expect(result.tapeRolls).toBe(1);
    expect(result.screwPounds).toBe(1);
  });

  it('scales accessories for large rooms', () => {
    // 20×20×10ft, no openings → wallArea = 800
    const result = calcDrywall({ roomL: 20, roomW: 20, roomH: 10, doorCount: 0, windowCount: 0 });
    expect(result.wallArea).toBe(800);
    expect(result.sheetsNeeded).toBe(28);    // ceil(880 / 32) = ceil(27.5)
    expect(result.compoundBuckets).toBe(2);  // ceil(800 / 500)
    expect(result.tapeRolls).toBe(2);
    expect(result.screwPounds).toBe(2);
  });

  it('clamps wallArea to 0 and defaults accessories to 1 when deductions exceed gross area', () => {
    // 3×3×8ft, 5 doors → gross=96, deductions=100 → wallArea clamped to 0
    const result = calcDrywall({ roomL: 3, roomW: 3, roomH: 8, doorCount: 5, windowCount: 0 });
    expect(result.wallArea).toBe(0);
    expect(result.sheetsNeeded).toBe(0);
    expect(result.compoundBuckets).toBe(1); // 0 || 1 fallback
    expect(result.tapeRolls).toBe(1);
    expect(result.screwPounds).toBe(1);
  });
});
