/* Cornerstone — Read tab: the confession itself, chapter-layered, with
   sticky chapter headers that double as a chapter navigator. Tapping a
   pinned chapter opens a jump-to-chapter sheet. Plus reading QoL:
   adjustable text size, a progress bar, back-to-top, and a remembered
   scroll position. */

const READ_FS_KEY = 'cornerstone_read_fs_v1';
const READ_POS_KEY = 'cornerstone_read_pos_v1';
const FS_STEPS = [14.5, 16.5, 18.5, 20.5];

// ── Live ESV passage lookup (via the built-in Claude helper), cached ──
const ESV_CACHE_KEY = 'cornerstone_esv_v1';
function esvCacheGet(ref) {
  try { return (JSON.parse(localStorage.getItem(ESV_CACHE_KEY)) || {})[ref] || null; } catch (e) { return null; }
}
function esvCacheSet(ref, data) {
  try {
    const c = JSON.parse(localStorage.getItem(ESV_CACHE_KEY)) || {};
    c[ref] = data;
    localStorage.setItem(ESV_CACHE_KEY, JSON.stringify(c));
  } catch (e) {}
}
// ── ESV source: ESV text via Cloudflare Worker proxy (keeps token secret) ──
// The Worker holds the ESV API token as a secret env var; the client never sees it.
// Deploy the Worker (see project README), then set this to your Worker URL:
const ESV_PROXY_BASE = 'https://catchechism-esv.adriancalem.workers.dev';

async function bibleFetchPassage(ref) {
  // Worker accepts ?q=<reference> and proxies to the ESV API with the secret token.
  const url = ESV_PROXY_BASE + '/?q=' + encodeURIComponent(ref);
  let res; try { res = await fetch(url, { cache: 'no-store' }); } catch (e) { throw new Error('cors'); }
  if (!res.ok) throw new Error('http_' + res.status);
  let j; try { j = await res.json(); } catch (e) { throw new Error('parse'); }
  if (!j || j.error || !j.passages || !Array.isArray(j.passages) || !j.passages.length) throw new Error('shape');
  // Parse the passage text: split by verse numbers and extract each verse
  const passageText = j.passages[0] || '';
  const verses = [];
  // ESV API returns text with verse numbers inline (e.g., "19 So then...")
  // Split on verse number patterns and collect verse/text pairs
  const versePattern = /(\d+)\s+([^\d]*?)(?=\d+\s+|$)/g;
  let match;
  while ((match = versePattern.exec(passageText)) !== null) {
    const n = parseInt(match[1]);
    const t = match[2].trim();
    if (t) verses.push({ n, t });
  }
  if (!verses.length) throw new Error('novs');
  return { verses, source: 'esv' };
}

async function fetchAiEsv(ref) {
  if (!(window.claude && window.claude.complete)) throw new Error('offline');
  const prompt = [
    'You are a Scripture text service. Return the English Standard Version (ESV) text for the reference below.',
    'Reference: ' + ref,
    'Respond with ONLY valid minified JSON — no markdown, no prose — shaped exactly:',
    '{"verses":[{"n":<verse number as integer>,"t":"<verse text>"}]}',
    'Expand verse ranges (e.g. 3:15-17) and comma lists (e.g. 16:29, 31) into one object per verse.',
    'Keep the original ESV wording and punctuation. Do not include commentary, headings, or cross-reference letters.',
  ].join('\n');
  const raw = await window.claude.complete(prompt);
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a < 0 || b < 0) throw new Error('parse');
  const data = JSON.parse(raw.slice(a, b + 1));
  if (!data || !Array.isArray(data.verses) || !data.verses.length) throw new Error('shape');
  return { verses: data.verses, source: 'ai' };
}

// Normalize a citation for lookup (collapse whitespace, trim).
function esvKey(ref) {
  return String(ref || '').replace(/\s+/g, ' ').trim();
}

async function fetchEsv(ref) {
  // 1) Local baked-in store (window.VERSES from app/verses.js) — instant, offline, no API.
  const store = window.VERSES || {};
  const local = store[esvKey(ref)] || store[ref];
  if (local && local.verses && local.verses.length) {
    return { verses: local.verses, source: 'local' };
  }
  // 2) localStorage cache from a prior live fetch.
  const cached = esvCacheGet(ref);
  if (cached && cached.source === 'esv') return cached;
  if (cached && !cached.source) return cached;
  // 3) Live Worker proxy (only works on the deployed origin).
  try {
    const d = await bibleFetchPassage(ref);
    esvCacheSet(ref, d);
    return d;
  } catch (e) {
    if (cached) return cached;
    const d = await fetchAiEsv(ref);
    esvCacheSet(ref, d);
    return d;
  }
}
Object.assign(window, { bibleFetchPassage, esvKey });

// ── A pinned chapter header that you can tap to open the chapter list ──
function ChapterStickyHeader({ chapter, title, theme, onOpen }) {
  const tc = themeColors(theme);
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 5, background: C.bg, padding: '9px 16px 9px' }}>
      <Press onClick={onOpen} style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff', borderRadius: 13, padding: '11px 14px',
        borderLeft: `5px solid ${tc.main}`,
        boxShadow: '0 3px 10px rgba(31,42,63,0.08), 0 0 0 1px rgba(31,42,63,0.04)',
      }}>
        <span style={{
          flexShrink: 0, background: tc.wash, color: tc.deep,
          fontWeight: 800, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase',
          padding: '5px 9px', borderRadius: 8,
        }}>Ch {chapter}</span>
        <span style={{ flex: 1, fontFamily: FSERIF, fontWeight: 600, fontSize: 16.5, color: C.navyDeep, lineHeight: 1.25 }}>{title}</span>
        <span style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
          color: tc.main, fontWeight: 800, fontSize: 11.5, letterSpacing: 0.4, textTransform: 'uppercase',
          background: tc.wash, borderRadius: 8, padding: '5px 8px',
        }}>
          <Icon name="list" size={15} color={tc.main} stroke={2.4} />
          Jump
        </span>
      </Press>
    </div>
  );
}

function Paragraph({ n, text, theme, fontSize }) {
  const tc = themeColors(theme);
  return (
    <div style={{ display: 'flex', gap: 13, marginBottom: 18 }}>
      <span style={{
        flexShrink: 0, width: 26, textAlign: 'right',
        fontFamily: FUI, fontWeight: 800, fontSize: 14, color: tc.main, paddingTop: 4,
      }}>{n}</span>
      <p style={{
        margin: 0, fontFamily: FSERIF, fontSize: fontSize, lineHeight: 1.72,
        color: '#33302a', textWrap: 'pretty',
      }}>{text}</p>
    </div>
  );
}

// is this body line a short ALL-CAPS heading (e.g. "THE OLD TESTAMENT")?
function isLabelLine(line) {
  const t = line.trim();
  return t.length > 0 && t.length < 34 && /[A-Z]/.test(t) && !/[a-z]/.test(t);
}

// Render a section's body: handles \n lines, ALL-CAPS labels, and footnote
// markers (^), each rendered as a tappable superscript that opens the passage
// popup for that footnote.
function renderSectionBody(body, tc, fontSize, footnotes, onOpenRef) {
  const lines = body.split('\n');
  const markerTotal = (body.match(/\^/g) || []).length;
  const inline = markerTotal > 0 && footnotes.length > 0 && markerTotal === footnotes.length;
  const supStyle = { color: tc.main, fontWeight: 800, fontSize: '0.72em', padding: '0 1px 0 2px', cursor: 'pointer', textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '2px' };
  const supFor = (idx) => {
    const fn = footnotes[idx];
    return (
      <sup key={'s' + idx} onClick={(e) => { e.stopPropagation(); if (onOpenRef && fn) onOpenRef(fn); }} style={supStyle}>
        {fn ? fn.num : ''}
      </sup>
    );
  };
  let local = 0;
  const blocks = [];
  lines.forEach((line, idx) => {
    if (line.trim() === '') return;
    if (isLabelLine(line)) {
      blocks.push(
        <div key={'l' + idx} style={{
          fontFamily: FUI, fontWeight: 800, fontSize: 12, letterSpacing: 1.2,
          textTransform: 'uppercase', color: tc.deep, margin: '14px 0 8px',
        }}>{line.trim()}</div>
      );
      return;
    }
    const parts = inline ? line.split('^') : [line.replace(/\^/g, '')];
    const nodes = [];
    parts.forEach((seg, pi) => {
      if (seg) nodes.push(<React.Fragment key={'t' + pi}>{seg}</React.Fragment>);
      if (inline && pi < parts.length - 1) { nodes.push(supFor(local)); local++; }
    });
    blocks.push(
      <p key={'p' + idx} style={{
        margin: '0 0 9px', fontFamily: FSERIF, fontSize: fontSize, lineHeight: 1.72,
        color: '#33302a', textWrap: 'pretty',
      }}>{nodes}</p>
    );
  });
  // clustered footnotes when no inline markers
  if (footnotes.length > 0 && !inline && blocks.length) {
    blocks.push(
      <span key="cluster" style={{ display: 'inline-flex', gap: 3, marginTop: -2 }}>
        {footnotes.map((fn, i) => (
          <sup key={'c' + i} onClick={(e) => { e.stopPropagation(); if (onOpenRef) onOpenRef(fn); }} style={supStyle}>{fn.num}</sup>
        ))}
      </span>
    );
  }
  return blocks;
}

// One numbered section: heading + body + tappable scripture references.
function Section({ index, body, meta, theme, fontSize, startNum, onOpenRef }) {
  const tc = themeColors(theme);
  const refs = (meta && meta.r) || [];
  const title = meta && meta.t;
  const markerTotal = (body.match(/\^/g) || []).length;
  const inline = markerTotal > 0 && refs.length > 0 && markerTotal === refs.length;
  const clean = (s) => (s || '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  const fullText = clean(body.replace(/\^/g, ''));
  const segments = inline ? body.split('^') : null;
  const footnotes = refs.map((citation, i) => ({
    num: startNum + i,
    label: citation,
    clause: inline ? clean(segments[i]) : fullText,
    citations: citation.split(';').map(c => c.trim()).filter(Boolean),
    theme,
  }));
  const blocks = renderSectionBody(body, tc, fontSize, footnotes, onOpenRef);
  return (
    <div style={{ marginBottom: 22 }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9 }}>
          <Icon name="chevronUp" size={17} color={tc.main} stroke={2.6} style={{ marginTop: 4, flexShrink: 0 }} />
          <h3 style={{
            margin: 0, fontFamily: FUI, fontWeight: 900, fontSize: 17.5, color: C.navyDeep,
            letterSpacing: -0.2, lineHeight: 1.3,
          }}><span style={{ color: tc.main }}>{index}.</span> {title}</h3>
        </div>
      )}
      <div style={{ paddingLeft: title ? 26 : 0 }}>
        {blocks}
        {footnotes.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {footnotes.map((fn, i) => (
              <Press key={i} onClick={() => onOpenRef && onOpenRef(fn)} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 8,
                background: 'transparent', borderRadius: 8, padding: '4px 6px', margin: '0 -6px',
              }}>
                <Icon name="book" size={14} color={tc.main} stroke={2.2} style={{ marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontFamily: FUI, fontSize: 13, fontWeight: 700, color: tc.deep, lineHeight: 1.45 }}>
                  <span style={{ opacity: 0.65 }}>{fn.num}.</span> {fn.label}
                </span>
              </Press>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Passage popup: the confession clause + each cited ESV passage ─────
function VerseSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '2px 0' }}>
      {[92, 100, 64].map((w, i) => (
        <div key={i} style={{ height: 11, width: w + '%', borderRadius: 6, background: C.lineSoft, animation: 'pulse 1.1s ease-in-out infinite', animationDelay: (i * 0.12) + 's' }} />
      ))}
    </div>
  );
}

function PassageModal({ open, clause, citations, theme, onClose }) {
  const tc = themeColors(theme || 'gold');
  const [res, setRes] = React.useState({});

  const load = React.useCallback(async (cit) => {
    setRes(r => ({ ...r, [cit]: { loading: true } }));
    try { const d = await fetchEsv(cit); setRes(r => ({ ...r, [cit]: { verses: d.verses } })); }
    catch (e) { setRes(r => ({ ...r, [cit]: { error: e && e.message === 'offline' ? 'offline' : 'error' } })); }
  }, []);

  React.useEffect(() => {
    if (!open || !citations) return;
    let dead = false;
    setRes({});
    (async () => {
      for (const cit of citations) {
        if (dead) break;
        setRes(r => ({ ...r, [cit]: { loading: true } }));
        let out;
        try { const d = await fetchEsv(cit); out = { verses: d.verses }; }
        catch (e) { out = { error: e && e.message === 'offline' ? 'offline' : 'error' }; }
        if (dead) break;
        setRes(r => ({ ...r, [cit]: out }));
      }
    })();
    return () => { dead = true; };
  }, [open, citations ? citations.join('|') : '']);

  if (!open) return null;
  const muted = { fontFamily: FUI, fontSize: 12.5, fontWeight: 700, color: C.mute, lineHeight: 1.5 };
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 97, background: 'rgba(20,25,35,.52)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', width: '100%', maxWidth: 560, maxHeight: '84%', background: '#fff',
        borderRadius: 16, boxShadow: '0 24px 60px rgba(15,20,30,.45)', display: 'flex', flexDirection: 'column',
        animation: 'popin .22s cubic-bezier(.2,.8,.2,1)', overflow: 'hidden',
      }}>
        <Press onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, zIndex: 3, width: 30, height: 30, borderRadius: 999,
          background: C.lineSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="x" size={16} color={C.sub} stroke={3} />
        </Press>
        <div style={{ overflowY: 'auto', padding: '22px 24px 26px' }}>
          {clause && (
            <div style={{ marginBottom: 22, paddingRight: 30 }}>
              <div style={{ fontFamily: FUI, fontWeight: 800, fontSize: 13.5, color: C.navyDeep, marginBottom: 5 }}>Text</div>
              <div style={{ fontFamily: FSERIF, fontSize: 15, lineHeight: 1.6, color: '#55504a' }}>{clause}</div>
            </div>
          )}
          {(citations || []).map((cit, i) => {
            const r = res[cit] || {};
            return (
              <div key={i} style={{ marginBottom: i === citations.length - 1 ? 2 : 20 }}>
                <div style={{ fontFamily: FUI, fontWeight: 800, fontSize: 15, color: tc.deep, marginBottom: 7 }}>{cit}</div>
                {r.loading && <VerseSkeleton />}
                {r.verses && (
                  <>
                    <p style={{ margin: 0, fontFamily: FSERIF, fontSize: 15, lineHeight: 1.62, color: '#3c3a36', textWrap: 'pretty' }}>
                      {r.verses.map((v, k) => (
                        <React.Fragment key={k}>
                          <sup style={{ fontWeight: 800, fontSize: '0.72em', color: C.navyDeep, marginRight: 2 }}>{v.n}</sup>
                          {v.t}{k < r.verses.length - 1 ? ' ' : ''}
                        </React.Fragment>
                      ))}
                    </p>
                    {r.source === 'ai' && (
                      <div style={{ ...muted, marginTop: 6, fontSize: 11.5, color: C.mute, fontStyle: 'italic' }}>
                        (AI-generated ESV text — ESV API unavailable)
                      </div>
                    )}
                  </>
                )}
                {r.error === 'offline' && <div style={muted}>Open this in the Cornerstone app to load the ESV text.</div>}
                {r.error === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={muted}>Couldn't load this passage.</span>
                    <Press onClick={() => load(cit)} style={{ background: tc.wash, color: tc.deep, fontWeight: 800, fontSize: 12, borderRadius: 8, padding: '5px 10px' }}>Retry</Press>
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${C.lineSoft}`, ...muted, color: C.mute }}>
            Scripture quotations from the English Standard Version (ESV) Bible.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Jump-to-chapter sheet ─────────────────────────────────────────────
function ChapterNavSheet({ open, units, activeChapter, onPick, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 95, background: 'rgba(20,25,35,.45)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.bg, borderRadius: '26px 26px 0 0',
        maxHeight: '78%', display: 'flex', flexDirection: 'column',
        animation: 'sheetup .28s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ padding: '10px 22px 4px', flexShrink: 0 }}>
          <div style={{ width: 40, height: 5, borderRadius: 9, background: C.line, margin: '0 auto 14px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 21, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>Jump to chapter</h2>
            <Press onClick={onClose} style={{ background: C.line, borderRadius: 999, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="x" size={16} color={C.sub} stroke={3} />
            </Press>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: C.mute }}>{units.length} of 32 chapters available</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '2px 16px 28px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {units.map(u => {
              const tc = themeColors(u.theme);
              const active = u.chapter === activeChapter;
              return (
                <Press key={u.chapter} onClick={() => onPick(u.chapter)} style={{
                  width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 13,
                  background: active ? tc.wash : '#fff',
                  border: `2px solid ${active ? tc.main : C.line}`, borderRadius: 14, padding: '11px 13px',
                }}>
                  <span style={{
                    flexShrink: 0, width: 38, height: 38, borderRadius: 11,
                    background: tc.main, color: '#fff', fontWeight: 900, fontSize: 15,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 2px 0 ${tc.deep}`,
                  }}>{u.chapter}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FSERIF, fontWeight: 600, fontSize: 15.5, color: C.navyDeep, lineHeight: 1.25 }}>{u.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.mute, marginTop: 2 }}>{u.short}</div>
                  </div>
                  {active
                    ? <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 800, letterSpacing: .5, textTransform: 'uppercase', color: tc.main }}>Reading</span>
                    : <Icon name="chevron" size={18} color={C.mute} />}
                </Press>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small A−/A+ text-size stepper ─────────────────────────────────────
function TextSizeControl({ fsIndex, setFsIndex }) {
  const btn = (label, big, delta) => {
    const disabled = delta < 0 ? fsIndex === 0 : fsIndex === FS_STEPS.length - 1;
    return (
      <Press onClick={() => !disabled && setFsIndex(Math.max(0, Math.min(FS_STEPS.length - 1, fsIndex + delta)))}
        disabled={disabled}
        style={{
          width: 34, height: 34, borderRadius: 10, background: disabled ? C.lineSoft : '#fff',
          border: `1.5px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: disabled ? C.mute : C.navyDeep, fontWeight: 900, fontSize: big ? 17 : 12.5, opacity: disabled ? .5 : 1,
        }}>{label}</Press>
    );
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {btn('A', false, -1)}
      {btn('A', true, +1)}
    </div>
  );
}

function ReadScreen({ data }) {
  const reading = window.READING || {};
  const scrollRef = React.useRef(null);
  const secRefs = React.useRef({});
  const saveTimer = React.useRef(null);
  const restored = React.useRef(false);

  const [navOpen, setNavOpen] = React.useState(false);
  const [passage, setPassage] = React.useState(null); // {clause, citations, theme}
  const [activeChapter, setActiveChapter] = React.useState(data.units[0] ? data.units[0].chapter : 1);
  const [progress, setProgress] = React.useState(0);
  const [showTop, setShowTop] = React.useState(false);
  const [fsIndex, setFsIndex] = React.useState(() => {
    const v = parseInt(localStorage.getItem(READ_FS_KEY), 10);
    return Number.isFinite(v) && v >= 0 && v < FS_STEPS.length ? v : 1;
  });

  React.useEffect(() => { try { localStorage.setItem(READ_FS_KEY, String(fsIndex)); } catch (e) {} }, [fsIndex]);

  // scroll a chapter into view inside the reading pane
  function scrollToChapter(chapter, smooth = true) {
    const el = secRefs.current[chapter];
    const cont = scrollRef.current;
    if (!el || !cont) return;
    const top = el.getBoundingClientRect().top - cont.getBoundingClientRect().top + cont.scrollTop;
    cont.scrollTo({ top: Math.max(0, top - 4), behavior: smooth ? 'smooth' : 'auto' });
  }

  function pickChapter(chapter) {
    setNavOpen(false);
    setActiveChapter(chapter);
    // let the sheet begin closing, then scroll
    setTimeout(() => scrollToChapter(chapter, true), 60);
  }

  // restore last read position once content is laid out
  React.useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const cont = scrollRef.current;
    if (!cont) return;
    const saved = parseFloat(localStorage.getItem(READ_POS_KEY));
    if (Number.isFinite(saved) && saved > 0) {
      requestAnimationFrame(() => { cont.scrollTop = saved; updateOnScroll(); });
    }
  }, []);

  function updateOnScroll() {
    const cont = scrollRef.current;
    if (!cont) return;
    const max = cont.scrollHeight - cont.clientHeight;
    setProgress(max > 0 ? Math.min(1, cont.scrollTop / max) : 0);
    setShowTop(cont.scrollTop > 500);
    // active chapter = last header at/above the reading line
    const line = cont.getBoundingClientRect().top + 80;
    let act = data.units[0] ? data.units[0].chapter : 1;
    for (const u of data.units) {
      const el = secRefs.current[u.chapter];
      if (el && el.getBoundingClientRect().top <= line) act = u.chapter;
    }
    setActiveChapter(act);
  }

  function onScroll() {
    updateOnScroll();
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(READ_POS_KEY, String(scrollRef.current ? scrollRef.current.scrollTop : 0)); } catch (e) {}
    }, 250);
  }

  const activeTheme = (data.units.find(u => u.chapter === activeChapter) || data.units[0] || {}).theme;
  const barColor = themeColors(activeTheme).main;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      {/* app bar */}
      <div style={{ padding: '52px 22px 12px 22px', background: C.bg, borderBottom: `1px solid ${C.line}`, zIndex: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="book" size={26} color={C.gold} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 21, color: C.navyDeep, letterSpacing: -0.3, lineHeight: 1 }}>The Confession</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.mute, marginTop: 3 }}>1689 · Modern English · 32 chapters</div>
          </div>
          <TextSizeControl fsIndex={fsIndex} setFsIndex={setFsIndex} />
        </div>
      </div>

      {/* reading progress bar */}
      <div style={{ height: 3, background: C.lineSoft, position: 'relative', zIndex: 8 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: barColor, transition: 'width .12s linear, background .3s ease' }} />
      </div>

      {/* scrolling, chapter-layered text */}
      <div ref={scrollRef} onScroll={onScroll} style={{ flex: 1, overflowY: 'auto', paddingBottom: 110, position: 'relative' }}>
        {data.units.map((u) => {
          const paras = reading[u.chapter] || [];
          const meta = (window.READING_META || {})[u.chapter] || [];
          let fn = 1; // running footnote number within this chapter
          return (
            <section key={u.chapter} ref={el => { secRefs.current[u.chapter] = el; }} data-screen-label={'Confession Ch ' + u.chapter}>
              <ChapterStickyHeader chapter={u.chapter} title={u.title} theme={u.theme} onOpen={() => setNavOpen(true)} />
              <div style={{ padding: '14px 22px 22px' }}>
                {paras.length === 0 && (
                  <p style={{ fontFamily: FSERIF, fontStyle: 'italic', color: C.mute }}>Text coming soon.</p>
                )}
                {paras.map((p, i) => {
                  const m = meta[i];
                  const start = fn;
                  fn += (m && m.r ? m.r.length : 0);
                  return <Section key={i} index={i + 1} body={p} meta={m} theme={u.theme} fontSize={FS_STEPS[fsIndex]} startNum={start} onOpenRef={setPassage} />;
                })}
              </div>
              <div style={{ height: 1, background: C.lineSoft, margin: '0 22px' }} />
            </section>
          );
        })}
        <div style={{ textAlign: 'center', color: C.mute, fontSize: 12.5, fontWeight: 700, padding: '22px 40px 30px', lineHeight: 1.6 }}>
          “To the praise of his glorious grace.”<br />The 1689 London Baptist Confession of Faith.
        </div>
      </div>

      {/* back-to-top */}
      <Press onClick={() => scrollRef.current && scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'absolute', right: 18, bottom: 104, zIndex: 30,
          width: 46, height: 46, borderRadius: 999, background: '#fff',
          border: `1.5px solid ${C.line}`, boxShadow: '0 6px 16px rgba(31,42,63,.18)',
          display: showTop ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center',
        }}>
        <Icon name="chevronUp" size={24} color={C.navy} stroke={2.6} />
      </Press>

      <ChapterNavSheet open={navOpen} units={data.units} activeChapter={activeChapter} onPick={pickChapter} onClose={() => setNavOpen(false)} />
      <PassageModal open={!!passage} clause={passage && passage.clause} citations={passage && passage.citations} theme={passage && passage.theme} onClose={() => setPassage(null)} />
    </div>
  );
}

Object.assign(window, { ReadScreen, ChapterStickyHeader, Paragraph, Section, PassageModal, ChapterNavSheet, TextSizeControl });
