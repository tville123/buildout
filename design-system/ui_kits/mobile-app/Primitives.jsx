// Buildout shared primitives — section labels, segmented control,
// input block, toggle chip, result card, shopping list, tip bar,
// screen header, empty state. Matches components/*.tsx in the repo.

const SectionLabel = ({ text }) => <div className="bo-section-label">{text}</div>;

const SegControl = ({ options, active, onSelect }) => (
  <div className="bo-seg">
    {options.map(opt => (
      <button
        key={String(opt.value)}
        type="button"
        className={"bo-seg-btn" + (active === opt.value ? " is-active" : "")}
        onClick={() => onSelect(opt.value)}
      >{opt.label}</button>
    ))}
  </div>
);

const InputBlock = ({ label, value, onChange, placeholder, unit }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className={"bo-input" + (focused ? " is-focused" : "")}>
      <div className="bo-input-label">{label}</div>
      <input
        className="bo-input-field"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="decimal"
      />
      {unit ? <div className="bo-input-unit">{unit}</div> : null}
    </div>
  );
};

const ToggleChip = ({ label, sub, active, onPress }) => (
  <button
    type="button"
    className={"bo-chip" + (active ? " is-active" : "")}
    onClick={onPress}
  >
    <div className={"bo-chip-check" + (active ? " is-active" : "")}>
      {active ? <span className="bo-chip-mark">✓</span> : null}
    </div>
    <div>
      <div className={"bo-chip-label" + (active ? " is-active" : "")}>{label}</div>
      {sub ? <div className="bo-chip-sub">{sub}</div> : null}
    </div>
  </button>
);

const ResultCard = ({ tag, mainValue, unit, breakdownItems }) => (
  <div className="bo-result">
    <div className="bo-result-tag">{tag}</div>
    <div className="bo-result-main">{mainValue} <span className="bo-result-unit">{unit}</span></div>
    <div className="bo-result-divider"></div>
    <div className="bo-result-breakdown">
      {breakdownItems.map((item, i) => (
        <div key={i}>
          <div className="bo-breakdown-val">{item.value}</div>
          <div className="bo-breakdown-label">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
);

const ShoppingList = ({ items }) => (
  <div className="bo-shopping">
    <div className="bo-shopping-title">Shopping List</div>
    {items.map((item, i) => (
      <div key={i} className="bo-shop-item">
        <div style={{ flex: 1 }}>
          <div className="bo-shop-name">{item.name}</div>
          {item.sub ? <div className="bo-shop-sub">{item.sub}</div> : null}
        </div>
        <div className="bo-shop-qty">{item.qty}</div>
      </div>
    ))}
  </div>
);

const TipBar = ({ children }) => (
  <div className="bo-tip">
    <div className="bo-tip-text">
      <span className="bo-tip-strong">Pro tip: </span>{children}
    </div>
  </div>
);

const EmptyState = ({ icon, children }) => (
  <div className="bo-empty">
    <div className="bo-empty-icon">{icon}</div>
    <div className="bo-empty-text">{children}</div>
  </div>
);

// Outline icons used in the top bar utility cluster.
const BarIcons = {
  share: <svg viewBox="0 0 24 24"><path d="M12 3v13"/><path d="m7 8 5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg>,
  settings: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M2 12h3M19 12h3M4.2 19.8 6.4 17.6M17.6 6.4 19.8 4.2"/></svg>,
  more: <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>,
  back: <svg viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>,
};

// Compact top bar — the canonical Buildout top-of-screen pattern.
// Replaces the legacy 52px-Bebas-title header. Left: screen tag (+ optional
// back arrow). Right: a freeform cluster of utility actions.
const TopBar = ({ tag, onBack, showUpgrade, actions }) => (
  <div className="bo-topbar">
    <div className="bo-topbar-left">
      {onBack ? (
        <button type="button" className="bo-topbar-back" onClick={onBack} aria-label="Back">
          {BarIcons.back}
        </button>
      ) : null}
      <div className="bo-topbar-tag">{tag}</div>
    </div>
    <div className="bo-topbar-right">
      {showUpgrade ? <button type="button" className="bo-pro-pill">UPGRADE</button> : null}
      {(actions || ['share', 'settings']).map(name => (
        <button key={name} type="button" className="bo-iconbtn" aria-label={name}>
          {BarIcons[name]}
        </button>
      ))}
    </div>
  </div>
);

// Outline-style SVG icons approximating Ionicons-outline for the 7 tabs.
const TabIcons = {
  Paint: <svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="6" rx="1"/><path d="M9 9v3a3 3 0 0 0 3 3v6"/></svg>,
  Tile: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  Grout: <svg viewBox="0 0 24 24"><circle cx="5" cy="5" r="1.4"/><circle cx="12" cy="5" r="1.4"/><circle cx="19" cy="5" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/><circle cx="5" cy="19" r="1.4"/><circle cx="12" cy="19" r="1.4"/><circle cx="19" cy="19" r="1.4"/></svg>,
  LVP: <svg viewBox="0 0 24 24"><path d="M12 3 3 7l9 4 9-4-9-4Z"/><path d="M3 12l9 4 9-4"/><path d="M3 17l9 4 9-4"/></svg>,
  Carpet: <svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M4 9h16M4 13h16M4 17h16"/></svg>,
  Stairs: <svg viewBox="0 0 24 24"><path d="M3 20h4v-4h4v-4h4V8h4V4"/></svg>,
  Drywall: <svg viewBox="0 0 24 24"><path d="m14 4 6 6-9 9-2 2-4-4 2-2 7-7Z"/><path d="m11 7 6 6"/></svg>,
};

const TabBar = ({ active, onSelect, tabs }) => (
  <div className="bo-tabbar">
    {tabs.map(t => (
      <button
        key={t}
        type="button"
        className={"bo-tab" + (active === t ? " is-active" : "")}
        onClick={() => onSelect(t)}
      >
        <div className="bo-tab-icon">{TabIcons[t]}</div>
        <div className="bo-tab-label">{t}</div>
      </button>
    ))}
  </div>
);

Object.assign(window, {
  SectionLabel, SegControl, InputBlock, ToggleChip, ResultCard,
  ShoppingList, TipBar, EmptyState, TopBar, TabBar, TabIcons, BarIcons,
});
