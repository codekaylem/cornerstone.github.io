/* Cornerstone — achievements: computed from real progress (no hardcoded tiers),
   plus the unlock celebration shown when a new one is earned. */

function _playableLessons(unit) { return (unit.lessons || []).filter(l => l.questions && l.questions.length); }
function _chapterFraction(user, chapterNum) {
  const units = (window.CORNERSTONE && window.CORNERSTONE.units) || [];
  const u = units.find(x => x.chapter === chapterNum);
  if (!u) return 0;
  const pl = _playableLessons(u);
  if (!pl.length) return 0;
  const done = new Set(user.done || []);
  return pl.filter(l => done.has(l.id)).length / pl.length;
}
function _chaptersComplete(user) {
  const units = (window.CORNERSTONE && window.CORNERSTONE.units) || [];
  const done = new Set(user.done || []);
  let n = 0;
  units.forEach(u => {
    const pl = _playableLessons(u);
    if (pl.length && pl.every(l => done.has(l.id))) n++;
  });
  return n;
}

// each achievement derives its progress (0..1) from live user state
const ACH_DEFS = [
  { id: 'first', name: 'First Light', desc: 'Finish your first lesson', icon: 'sun',
    prog: u => Math.min(1, (u.done || []).length / 1) },
  { id: 'streak3', name: 'Kindling', desc: 'Reach a 3-day streak', icon: 'flame',
    prog: u => Math.min(1, (u.streak || 0) / 3) },
  { id: 'perfect', name: 'Spotless', desc: 'Finish a lesson with no hearts lost', icon: 'shield',
    prog: u => Math.min(1, (u.perfectLessons || 0) / 1) },
  { id: 'scholar', name: 'Sola Scriptura', desc: 'Finish the chapter on Scripture', icon: 'book',
    prog: u => _chapterFraction(u, 1) },
  { id: 'streak7', name: 'Steady Flame', desc: 'Reach a 7-day streak', icon: 'flame',
    prog: u => Math.min(1, (u.streak || 0) / 7) },
  { id: 'devoted', name: 'Devoted', desc: 'Earn 1,000 XP', icon: 'bolt',
    prog: u => Math.min(1, (u.xp || 0) / 1000) },
  { id: 'confessor', name: 'Confessor', desc: 'Finish all 32 chapters', icon: 'crown',
    prog: u => _chaptersComplete(u) / 32 },
];

function computeAchievements(user) {
  return ACH_DEFS.map(d => {
    const p = Math.max(0, Math.min(1, d.prog(user)));
    return { id: d.id, name: d.name, desc: d.desc, icon: d.icon,
      tier: p >= 1 ? 'earned' : p > 0 ? 'progress' : 'locked', progress: p };
  });
}
function earnedIds(user) { return computeAchievements(user).filter(a => a.tier === 'earned').map(a => a.id); }
Object.assign(window, { computeAchievements, earnedIds, ACH_DEFS });

// celebratory modal when a new achievement is earned
function AchievementUnlock({ ach, onClose }) {
  if (!ach) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 98, background: 'rgba(20,25,35,.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 340, background: '#fff', borderRadius: 22, padding: '30px 26px 26px',
        textAlign: 'center', animation: 'popin .26s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 24px 60px rgba(15,20,30,.45)',
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>Achievement unlocked</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ position: 'relative', width: 104, height: 104 }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 999,
              background: `radial-gradient(circle at 50% 35%, ${C.goldSoft}, ${C.gold})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 12px 28px ${C.gold}55, inset 0 3px 0 rgba(255,255,255,.5)`,
            }}>
              <Icon name={ach.icon} size={52} color="#fff" stroke={2.2} />
            </div>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} style={{
                position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: 999,
                background: i % 2 ? C.gold : C.navySoft,
                transform: `rotate(${i * 45}deg) translateY(-66px)`, transformOrigin: '0 0',
              }} />
            ))}
          </div>
        </div>
        <h2 style={{ margin: '0 0 5px', fontSize: 24, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>{ach.name}</h2>
        <p style={{ margin: '0 0 22px', fontSize: 15, fontWeight: 600, color: C.sub, lineHeight: 1.5 }}>{ach.desc}</p>
        <Chunky full color={C.gold} onClick={onClose}>Glory to God</Chunky>
      </div>
    </div>
  );
}

Object.assign(window, { AchievementUnlock });
