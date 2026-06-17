/* Cornerstone — shared UI: palette, icons, small primitives */

const C = {
  bg: '#f0f2f5', card: '#ffffff', ink: '#1a1a1a', sub: '#555555', mute: '#888888',
  line: '#dee2e6', lineSoft: '#e9ecef',
  navy: '#1e3a5f', navyDeep: '#0f2844', navySoft: '#4a6fa5', navyWash: '#e8f0f7',
  gold: '#d63031', goldDeep: '#a01e26', goldSoft: '#ff6b6b', goldWash: '#ffe0e0',
  green: '#4f8a4d', greenDeep: '#3c6d3b', greenWash: '#eaf3e7',
  red: '#d63031', redDeep: '#a01e26', redWash: '#ffe0e0',
  locked: '#d0d0d0', lockedBg: '#e8e8e8',
};
window.C = C;

const FUI = "'Nunito', system-ui, sans-serif";
const FSERIF = "'Lora', Georgia, serif";
window.FUI = FUI; window.FSERIF = FSERIF;

// ── Icon set — simple geometric line glyphs ───────────────────────────
function Icon({ name, size = 24, color = 'currentColor', stroke = 2.2, fill = 'none', style }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    book: <><path {...p} d="M4 5.5C4 4.7 4.7 4 5.5 4H11v15H5.5C4.7 19 4 18.3 4 17.5V5.5Z"/><path {...p} d="M20 5.5C20 4.7 19.3 4 18.5 4H13v15h5.5c.8 0 1.5-.7 1.5-1.5V5.5Z"/></>,
    scroll: <><path {...p} d="M6 4h11a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H8"/><path {...p} d="M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/><path {...p} d="M8.5 11.5h6M8.5 15h4"/></>,
    star: <path {...p} d="M12 3.5l2.5 5.3 5.5.7-4 3.9 1 5.6-5-2.8-5 2.8 1-5.6-4-3.9 5.5-.7z"/>,
    flame: <path {...p} d="M12 3.5c2.5 3 4.5 5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-1.4.5-2.5 1.5-3.5.3 1 1 1.7 2 2 0-2.5-1.5-4-1-7 .8.3 1.5.8 2 .9z"/>,
    triangle: <path {...p} d="M12 4l8 15H4z"/>,
    compass: <><circle {...p} cx="12" cy="12" r="8.5"/><path {...p} d="M15.5 8.5l-1.7 4.3-4.3 1.7 1.7-4.3z"/></>,
    seal: <><circle {...p} cx="12" cy="10" r="5.5"/><path {...p} d="M9 14.5L8 21l4-2 4 2-1-6.5"/></>,
    sun: <><circle {...p} cx="12" cy="12" r="4"/><path {...p} d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/></>,
    shield: <path {...p} d="M12 3.5l7 2.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>,
    crown: <><path {...p} d="M4 8l3 3 5-6 5 6 3-3-1.5 10.5h-13z"/><path {...p} d="M5.5 19.5h13"/></>,
    check: <path {...p} strokeWidth="3" d="M5 12.5l4.5 4.5L19 7"/>,
    x: <path {...p} strokeWidth="3" d="M6 6l12 12M18 6L6 18"/>,
    heart: <path d="M12 20S4 14.5 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2C20 14.5 12 20 12 20z" fill={fill === 'none' ? color : fill} stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>,
    heartline: <path {...p} d="M12 20S4 14.5 4 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8 2.2C20 14.5 12 20 12 20z"/>,
    lock: <><rect {...p} x="5" y="11" width="14" height="9" rx="2.2"/><path {...p} d="M8 11V8a4 4 0 0 1 8 0v3"/></>,
    gem: <><path {...p} d="M6 4h12l3 5-9 11L3 9z"/><path {...p} d="M3 9h18M9 4l-3 5 6 11 6-11-3-5"/></>,
    home: <><path {...p} d="M4 11l8-7 8 7"/><path {...p} d="M6 10v9h12v-9"/></>,
    user: <><circle {...p} cx="12" cy="8.5" r="3.5"/><path {...p} d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/></>,
    dumbbell: <><path {...p} d="M6.5 9v6M9 7.5v9M15 7.5v9M17.5 9v6M9 12h6"/></>,
    chevron: <path {...p} d="M9 5l7 7-7 7"/>,
    chevronUp: <path {...p} d="M5 15l7-7 7 7"/>,
    arrowLeft: <path {...p} d="M19 12H5M11 6l-6 6 6 6"/>,
    bolt: <path {...p} d="M13 3l-8 10h6l-1 8 8-10h-6z"/>,
    target: <><circle {...p} cx="12" cy="12" r="8.5"/><circle {...p} cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.6" fill={color}/></>,
    sparkle: <path {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>,
    quote: <><path {...p} d="M9 7c-2.5 1-4 3-4 6h3.5v4H4v-4M20 7c-2.5 1-4 3-4 6h3.5v4H15v-4"/></>,
    list: <><path {...p} d="M9 6h11M9 12h11M9 18h11"/><path {...p} d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth="2.6"/></>,
    logout: <><path {...p} d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path {...p} d="M10 8l-4 4 4 4M6 12h9"/></>,
    settings: <><circle {...p} cx="12" cy="12" r="3"/><path {...p} d="M12 3v2.5M12 18.5V21M4.2 7l2.2 1.3M17.6 15.7l2.2 1.3M4.2 17l2.2-1.3M17.6 8.3l2.2-1.3"/></>,
    chevronDown: <path {...p} d="M5 9l7 7 7-7"/>,
    bell: <><path {...p} d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z"/><path {...p} d="M10 19a2 2 0 0 0 4 0"/></>,
    timer: <><circle {...p} cx="12" cy="13" r="8"/><path {...p} d="M12 13V9M9 2h6M18.5 6.5l1.5-1.5"/></>,
    bolt2: <path d="M13 3l-8 10h6l-1 8 8-10h-6z" fill={color} stroke={color} strokeWidth={stroke} strokeLinejoin="round"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {paths[name] || null}
    </svg>
  );
}
window.Icon = Icon;

// border helper: full longhand (avoids React shorthand/longhand mix warnings)
function bd3(c, bc, w = 2, bw = 4) {
  return {
    borderStyle: 'solid',
    borderTopWidth: w, borderRightWidth: w, borderLeftWidth: w, borderBottomWidth: bw,
    borderTopColor: c, borderRightColor: c, borderLeftColor: c, borderBottomColor: bc == null ? c : bc,
  };
}
window.bd3 = bd3;

// theme color helpers
function themeColors(theme) {
  return theme === 'navy'
    ? { main: C.navy, deep: C.navyDeep, soft: C.navySoft, wash: C.navyWash, on: '#fff' }
    : theme === 'red'
    ? { main: C.red, deep: C.redDeep, soft: C.goldSoft, wash: C.redWash, on: '#fff' }
    : { main: C.red, deep: C.redDeep, soft: C.goldSoft, wash: C.redWash, on: '#fff' };
}
window.themeColors = themeColors;

// haptic-ish micro press button
function Press({ children, onClick, style, disabled, as = 'button' }) {
  const [down, setDown] = React.useState(false);
  const El = as;
  return (
    <El
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      disabled={as === 'button' ? disabled : undefined}
      style={{
        cursor: disabled ? 'default' : 'pointer', border: 'none', font: 'inherit',
        transform: down ? 'translateY(2px)' : 'translateY(0)',
        transition: 'transform .06s ease', WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >{children}</El>
  );
}
window.Press = Press;

// chunky 3D button (Duolingo-style with bottom shadow rim)
function Chunky({ children, onClick, color = C.green, rim, text = '#fff', disabled, style, full }) {
  const [down, setDown] = React.useState(false);
  const rimC = rim || (disabled ? '#cfc8bb' : `color-mix(in srgb, ${color} 72%, #000)`);
  const face = disabled ? '#e7e1d6' : color;
  const txt = disabled ? '#b3ab9c' : text;
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerDown={() => !disabled && setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      disabled={disabled}
      style={{
        position: 'relative', border: 'none', borderRadius: 16, cursor: disabled ? 'default' : 'pointer',
        background: rimC, padding: 0, width: full ? '100%' : undefined,
        font: 'inherit', WebkitTapHighlightColor: 'transparent', ...style,
      }}
    >
      <div style={{
        background: face, color: txt, borderRadius: 16,
        padding: '15px 22px', transform: `translateY(${down || disabled ? -2 : -5}px)`,
        transition: 'transform .06s ease', fontWeight: 800, fontSize: 16,
        letterSpacing: 0.4, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>{children}</div>
    </button>
  );
}
window.Chunky = Chunky;

Object.assign(window, { Icon, Press, Chunky, themeColors, bd3 });
