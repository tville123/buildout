// PaintScreen — mirrors screens/PaintScreen.tsx (Full Room mode).
// Calculator math is intentionally faithful to utils/calculator.ts.

const toShoppingList = (gallonsRaw) => {
  const totalQuarts = Math.ceil(gallonsRaw * 4);
  const gallons = Math.floor(totalQuarts / 4);
  const quarts = totalQuarts % 4;
  return { gallons, quarts };
};
const descBuy = ({ gallons, quarts }) => {
  const parts = [];
  if (gallons) parts.push(`${gallons} gal`);
  if (quarts) parts.push(`${quarts} qt`);
  return parts.join(' + ') || '0';
};

function PaintScreen() {
  const [mode, setMode] = React.useState('room');
  const [length, setLength] = React.useState('12');
  const [width, setWidth] = React.useState('10');
  const [height, setHeight] = React.useState('9');
  const [hasDoor, setHasDoor] = React.useState(true);
  const [hasWindow, setHasWindow] = React.useState(true);
  const [hasCeiling, setHasCeiling] = React.useState(false);
  const [coverage, setCoverage] = React.useState(400);
  const [coats, setCoats] = React.useState(2);
  const [price, setPrice] = React.useState('');

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  let result = null;
  if (l && w && h) {
    let wallArea = 2 * (l + w) * h;
    if (hasDoor) wallArea -= 21;
    if (hasWindow) wallArea -= 12;
    wallArea = Math.max(wallArea, 0);
    const ceilingArea = hasCeiling ? l * w : 0;
    const totalArea = wallArea + ceilingArea;
    const totalGallons = (totalArea * coats) / coverage;
    const wallBuy = toShoppingList((wallArea * coats) / coverage);
    const ceilBuy = ceilingArea ? toShoppingList((ceilingArea * coats) / coverage) : null;
    const p = parseFloat(price) || 0;
    const totalCost = p ? ((wallBuy.gallons + wallBuy.quarts * 0.25) +
        (ceilBuy ? ceilBuy.gallons + ceilBuy.quarts * 0.25 : 0)) * p : null;
    result = { wallArea, ceilingArea, totalArea, totalGallons, wallBuy, ceilBuy, totalCost };
  }

  return (
    <>
    <TopBar tag="Paint" showUpgrade={true} />
    <div className="bo-scroll">
      <div className="bo-section">
        <SectionLabel text="01 — Mode" />
        <SegControl
          options={[{value:'room',label:'Full Room'},{value:'manual',label:'Manual Walls'}]}
          active={mode}
          onSelect={setMode}
        />
      </div>

      <div className="bo-section">
        <SectionLabel text="02 — Room Dimensions" />
        <div className="bo-grid-3">
          <InputBlock label="Length" value={length} onChange={setLength} unit="ft" />
          <InputBlock label="Width" value={width} onChange={setWidth} unit="ft" />
          <InputBlock label="Height" value={height} onChange={setHeight} unit="ft" />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="03 — Subtract Openings" />
        <div className="bo-toggle-row">
          <ToggleChip label="Door" sub="~21 sq ft" active={hasDoor} onPress={() => setHasDoor(v => !v)} />
          <ToggleChip label="Window" sub="~12 sq ft each" active={hasWindow} onPress={() => setHasWindow(v => !v)} />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="04 — Include Ceiling?" />
        <div className="bo-toggle-row">
          <ToggleChip label="Paint ceiling too" sub="adds L × W sq ft" active={hasCeiling} onPress={() => setHasCeiling(v => !v)} />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="05 — Surface Type" />
        <SegControl
          options={[{value:400,label:'Smooth'},{value:350,label:'Semi-rough'},{value:300,label:'Textured'}]}
          active={coverage}
          onSelect={setCoverage}
        />
      </div>

      <div className="bo-section">
        <SectionLabel text="06 — Number of Coats" />
        <SegControl
          options={[{value:1,label:'1 Coat'},{value:2,label:'2 Coats'},{value:3,label:'3 Coats'}]}
          active={coats}
          onSelect={setCoats}
        />
      </div>

      <div className="bo-section">
        <SectionLabel text="07 — Price Per Gallon (optional)" />
        <div className="bo-grid-2">
          <InputBlock label="Walls / Gallon" value={price} onChange={setPrice} placeholder="35" unit="USD" />
        </div>
      </div>

      {result ? (
        <>
          <ResultCard
            tag="Total Paint Needed"
            mainValue={result.totalGallons.toFixed(1)}
            unit="gallons"
            breakdownItems={[
              { value: result.totalArea.toFixed(0), label: 'Sq Ft' },
              { value: String(coats), label: coats > 1 ? 'Coats' : 'Coat' },
              ...(result.totalCost !== null ? [{ value: `$${result.totalCost.toFixed(0)}`, label: 'Est. Cost' }] : []),
            ]}
          />
          <ShoppingList items={[
            { name: 'Wall Paint', sub: `${result.wallArea.toFixed(0)} sq ft · ${coats} coat${coats>1?'s':''} · ${coverage} sq ft/gal`, qty: descBuy(result.wallBuy) },
            ...(result.ceilBuy ? [{ name: 'Ceiling Paint', sub: `${result.ceilingArea.toFixed(0)} sq ft · ${coats} coat${coats>1?'s':''}`, qty: descBuy(result.ceilBuy) }] : []),
          ]}/>
          <TipBar>
            Always grab 10% extra for touch-ups. {result.wallBuy.quarts > 0
              ? 'A quart is perfect for small walls or accent coverage.'
              : 'Full gallons are the best value at this size.'}
          </TipBar>
        </>
      ) : (
        <EmptyState icon="🪣">Enter your room dimensions to get started.</EmptyState>
      )}

      <div style={{ height: 40 }}></div>
    </div>
    </>
  );
}

window.PaintScreen = PaintScreen;
