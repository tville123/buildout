// TileScreen — mirrors screens/TileScreen.tsx + utils/calculator.ts calcTile

function TileScreen() {
  const [roomL, setRoomL] = React.useState('12');
  const [roomW, setRoomW] = React.useState('10');
  const [tileW, setTileW] = React.useState('12');
  const [tileH, setTileH] = React.useState('12');
  const [tilesPerBox, setTilesPerBox] = React.useState('10');

  const l = parseFloat(roomL) || 0;
  const w = parseFloat(roomW) || 0;
  const tw = parseFloat(tileW) || 0;
  const th = parseFloat(tileH) || 0;
  const tpb = parseFloat(tilesPerBox) || 0;
  let result = null;
  if (l && w && tw && th && tpb) {
    const roomArea = l * w;
    const tileArea = (tw * th) / 144;
    const tilesNeeded = Math.ceil(roomArea / tileArea);
    const tilesWithWaste = Math.ceil(tilesNeeded * 1.10);
    const boxesNeeded = Math.ceil(tilesWithWaste / tpb);
    result = { roomArea, tilesNeeded, tilesWithWaste, boxesNeeded };
  }

  return (
    <>
    <TopBar tag="Tile" showUpgrade={true} />
    <div className="bo-scroll">
      <div className="bo-section">
        <SectionLabel text="01 — Room Size" />
        <div className="bo-grid-2">
          <InputBlock label="Length" value={roomL} onChange={setRoomL} unit="ft" />
          <InputBlock label="Width" value={roomW} onChange={setRoomW} unit="ft" />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="02 — Tile Size" />
        <div className="bo-grid-2">
          <InputBlock label="Tile Width" value={tileW} onChange={setTileW} unit="in" />
          <InputBlock label="Tile Height" value={tileH} onChange={setTileH} unit="in" />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="03 — Box Coverage" />
        <div style={{ maxWidth: 180 }}>
          <InputBlock label="Tiles Per Box" value={tilesPerBox} onChange={setTilesPerBox} unit="tiles" />
        </div>
      </div>

      {result ? (
        <>
          <ResultCard
            tag="Boxes Needed"
            mainValue={String(result.boxesNeeded)}
            unit="boxes"
            breakdownItems={[
              { value: result.roomArea.toFixed(0), label: 'Sq Ft' },
              { value: String(result.tilesNeeded), label: 'Tiles' },
              { value: String(result.tilesWithWaste), label: 'With Waste' },
            ]}
          />
          <ShoppingList items={[{
            name: 'Floor Tile',
            sub: `${result.roomArea.toFixed(0)} sq ft room · 10% waste included`,
            qty: `${result.boxesNeeded} box${result.boxesNeeded !== 1 ? 'es' : ''}`,
          }]}/>
          <TipBar>
            Always buy 10% extra — tile dye lots vary between batches and replacements may not match.
          </TipBar>
        </>
      ) : (
        <EmptyState icon="🗂">Enter your room size, tile dimensions, and tiles per box to get started.</EmptyState>
      )}

      <div style={{ height: 40 }}></div>
    </div>
    </>
  );
}

window.TileScreen = TileScreen;
