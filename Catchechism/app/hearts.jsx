/* Cornerstone — hearts economy: time-based refill + the hearts sheet.
   Hearts are spent on wrong answers in real lessons (never in practice),
   refill one every REFILL_MS, and can be restored with gems or by practicing. */

const HEART_REFILL_MS = 30 * 60 * 1000; // one heart every 30 minutes
const HEART_GEM_COST = 30;              // gems for a full refill

// compute current hearts given the stored refill anchor; returns {hearts, heartsAt}
function refillHearts(u, now) {
  now = now || Date.now();
  const max = u.maxHearts || 5;
  let hearts = u.hearts == null ? max : Math.max(0, u.hearts);
  let heartsAt = u.heartsAt || null;
  if (hearts >= max) return { hearts: max, heartsAt: null };
  if (!heartsAt) return { hearts, heartsAt: now };
  const gained = Math.floor((now - heartsAt) / HEART_REFILL_MS);
  if (gained <= 0) return { hearts, heartsAt };
  hearts = Math.min(max, hearts + gained);
  heartsAt = hearts >= max ? null : heartsAt + gained * HEART_REFILL_MS;
  return { hearts, heartsAt };
}
// ms until the next heart arrives (0 if full)
function msToNextHeart(u, now) {
  now = now || Date.now();
  const max = u.maxHearts || 5;
  if ((u.hearts == null ? max : u.hearts) >= max) return 0;
  const anchor = u.heartsAt || now;
  return Math.max(0, anchor + HEART_REFILL_MS - now);
}
function fmtClock(ms) {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60), ss = s % 60;
  return m + ':' + String(ss).padStart(2, '0');
}
function fmtUntilFull(u, now) {
  const max = u.maxHearts || 5;
  const cur = u.hearts == null ? max : u.hearts;
  if (cur >= max) return '';
  const total = (max - cur - 1) * HEART_REFILL_MS + msToNextHeart(u, now);
  const mins = Math.round(total / 60000);
  if (mins < 60) return '~' + mins + ' min';
  const h = Math.floor(mins / 60), m = mins % 60;
  return '~' + h + 'h' + (m ? ' ' + m + 'm' : '');
}
Object.assign(window, { refillHearts, msToNextHeart, HEART_REFILL_MS, HEART_GEM_COST });

function HeartsSheet({ open, user, onClose, onRefillGems, onPractice, onTick }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [open]);
  // when the countdown elapses, ask the app to apply a refill
  React.useEffect(() => {
    if (!open) return;
    const max = user.maxHearts || 5;
    if (user.hearts < max && msToNextHeart(user, now) <= 0) onTick && onTick();
  }, [now, open]);

  if (!open) return null;
  const max = user.maxHearts || 5;
  const full = user.hearts >= max;
  const next = msToNextHeart(user, now);
  const canGems = !full && (user.gems || 0) >= HEART_GEM_COST;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 94, background: 'rgba(20,25,35,.5)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.bg, borderRadius: '26px 26px 0 0', padding: '10px 22px 34px',
        animation: 'sheetup .28s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9, background: C.line, margin: '0 auto 18px' }} />

        {/* heart row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
          {Array.from({ length: max }).map((_, i) => (
            <Icon key={i} name={i < user.hearts ? 'heart' : 'heartline'} size={34}
              color={i < user.hearts ? C.red : '#d9d3c8'} fill={i < user.hearts ? C.red : 'none'} stroke={2.2} />
          ))}
        </div>

        <h2 style={{ margin: '0 0 5px', fontSize: 23, fontWeight: 900, color: C.navyDeep, textAlign: 'center', letterSpacing: -.3 }}>
          {full ? 'Hearts full' : user.hearts === 0 ? 'Out of hearts' : user.hearts + ' of ' + max + ' hearts'}
        </h2>
        <p style={{ margin: '0 auto 20px', fontSize: 14.5, fontWeight: 600, color: C.sub, textAlign: 'center', lineHeight: 1.5, maxWidth: 320 }}>
          {full
            ? 'You’re ready to learn. A heart is spent each time you miss in a lesson — practice never costs one.'
            : (
              <>Next heart in <span style={{ fontWeight: 900, color: C.red, fontVariantNumeric: 'tabular-nums' }}>{fmtClock(next)}</span>{user.hearts < max - 1 ? ' · full in ' + fmtUntilFull(user, now) : ''}.</>
            )}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {/* practice — free */}
          <Press onClick={onPractice} style={{
            display: 'flex', alignItems: 'center', gap: 13, background: '#fff',
            ...bd3(C.line, '#e3ddd0', 2, 4), borderRadius: 16, padding: '14px 15px', width: '100%', textAlign: 'left',
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: C.navyWash, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="dumbbell" size={23} color={C.navy} stroke={2.3} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15.5, color: C.ink }}>Practice to earn a heart</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.mute, marginTop: 1 }}>Finish any practice — free, +1 heart</div>
            </div>
            <Icon name="chevron" size={18} color={C.mute} />
          </Press>

          {/* gems refill */}
          <Press onClick={() => canGems && onRefillGems()} disabled={!canGems} style={{
            display: 'flex', alignItems: 'center', gap: 13,
            background: canGems ? C.gold : '#efe9df',
            borderRadius: 16, padding: '14px 15px', width: '100%', textAlign: 'left',
            boxShadow: canGems ? `0 4px 0 ${C.goldDeep}` : 'none', opacity: full ? .6 : 1,
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: canGems ? 'rgba(255,255,255,.2)' : C.lineSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="heart" size={23} color={canGems ? '#fff' : C.mute} fill={canGems ? '#fff' : 'none'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15.5, color: canGems ? '#fff' : C.mute }}>Refill all hearts</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: canGems ? 'rgba(255,255,255,.85)' : C.mute, marginTop: 1 }}>
                {full ? 'Already full' : (user.gems || 0) >= HEART_GEM_COST ? 'Back to ' + max + ' right now' : 'Not enough gems'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <Icon name="gem" size={18} color={canGems ? '#fff' : C.mute} />
              <span style={{ fontWeight: 900, fontSize: 16, color: canGems ? '#fff' : C.mute }}>{HEART_GEM_COST}</span>
            </div>
          </Press>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HeartsSheet });
