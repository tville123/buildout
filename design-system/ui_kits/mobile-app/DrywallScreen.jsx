// DrywallScreen — mirrors screens/DrywallScreen.tsx + utils/calculator.ts calcDrywall

function DrywallScreen() {
  const [roomL, setRoomL] = React.useState('12');
  const [roomW, setRoomW] = React.useState('10');
  const [roomH, setRoomH] = React.useState('9');
  const [doorCount, setDoorCount] = React.useState('1');
  const [windowCount, setWindowCount] = React.useState('2');

  const l = parseFloat(roomL) || 0;
  const w = parseFloat(roomW) || 0;
  const h = parseFloat(roomH) || 0;
  const dc = parseInt(doorCount) || 0;
  const wc = parseInt(windowCount) || 0;
  let result = null;
  if (l && w && h) {
    const wallArea = Math.max(2 * (l + w) * h - dc * 20 - wc * 15, 0);
    const sheetsNeeded = Math.ceil((wallArea * 1.10) / 32);
    const compoundBuckets = Math.ceil(wallArea / 500);
    const tapeRolls = Math.ceil(wallArea / 500);
    const screwPounds = Math.ceil(wallArea / 500);
    result = { wallArea, sheetsNeeded, compoundBuckets, tapeRolls, screwPounds };
  }

  return (
    <>
    <TopBar tag="Drywall" showUpgrade={true} />
    <div className="bo-scroll">
      <div className="bo-section">
        <SectionLabel text="01 — Room Dimensions" />
        <div className="bo-grid-3">
          <InputBlock label="Length" value={roomL} onChange={setRoomL} unit="ft" />
          <InputBlock label="Width" value={roomW} onChange={setRoomW} unit="ft" />
          <InputBlock label="Height" value={roomH} onChange={setRoomH} unit="ft" />
        </div>
      </div>

      <div className="bo-section">
        <SectionLabel text="02 — Openings" />
        <div className="bo-grid-2">
          <InputBlock label="Doors" value={doorCount} onChange={setDoorCount} unit="doors" />
          <InputBlock label="Windows" value={windowCount} onChange={setWindowCount} unit="windows" />
        </div>
      </div>

      {result ? (
        <>
          <ResultCard
            tag="Drywall Sheets Needed"
            mainValue={String(result.sheetsNeeded)}
            unit="sheets (4×8)"
            breakdownItems={[
              { value: result.wallArea.toFixed(0), label: 'Sq Ft' },
              { value: String(result.compoundBuckets), label: 'Compound' },
              { value: String(result.tapeRolls), label: 'Tape Rolls' },
            ]}
          />
          <ShoppingList items={[
            { name: 'Drywall Sheets (4×8)', sub: `${result.wallArea.toFixed(0)} sq ft · 10% waste`, qty: `${result.sheetsNeeded} sheet${result.sheetsNeeded!==1?'s':''}` },
            { name: 'Joint Compound', sub: '~1 bucket per 500 sq ft', qty: `${result.compoundBuckets} bucket${result.compoundBuckets!==1?'s':''}` },
            { name: 'Drywall Tape', sub: '~1 roll per 500 sq ft', qty: `${result.tapeRolls} roll${result.tapeRolls!==1?'s':''}` },
            { name: 'Drywall Screws', sub: '~1 lb per 500 sq ft', qty: `${result.screwPounds} lb${result.screwPounds!==1?'s':''}` },
          ]}/>
          <TipBar>
            Hang sheets perpendicular to studs and stagger seams. Butt joints (short edges) are harder to finish — minimize them.
          </TipBar>
        </>
      ) : (
        <EmptyState icon="🧱">Enter your room dimensions to calculate drywall materials.</EmptyState>
      )}

      <div style={{ height: 40 }}></div>
    </div>
    </>
  );
}

window.DrywallScreen = DrywallScreen;
