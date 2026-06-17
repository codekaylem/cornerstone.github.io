/* Cornerstone — Home / learning path (serpentine skill tree) */

function StatusStrip({ user, onHeartsClick }) {
  const item = (icon, val, color, fill, onClick) => (
    <Press onClick={onClick} disabled={!onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', padding: onClick ? '4px 8px' : 0, margin: onClick ? '-4px -8px' : 0, borderRadius: 10 }}>
      <Icon name={icon} size={24} color={color} fill={fill ? color : 'none'} />
      <span style={{ fontWeight: 800, fontSize: 17, color: C.ink }}>{val}</span>
    </Press>
  );
  return (
    <div style={{
      padding: '52px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: C.bg,
    }}>
      {item('flame', user.streak, C.gold, false)}
      {item('gem', user.gems, C.navySoft, false)}
      {item('heart', user.hearts, C.red, true, onHeartsClick)}
    </div>
  );
}

function UnitBanner({ unit, theme, onGuide }) {
  const tc = themeColors(theme);
  return (
    <div style={{
      margin: '4px 16px 0', background: tc.main, borderRadius: 18,
      padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      boxShadow: `0 4px 0 ${tc.deep}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: '#fff', opacity: .8 }}>Chapter {unit.chapter}</div>
        <div style={{ fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: -.2, marginTop: 1 }}>{unit.title}</div>
      </div>
      <Press onClick={onGuide} style={{
        background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '9px 11px',
        display: 'flex', alignItems: 'center', gap: 7, border: '1.5px solid rgba(255,255,255,.3)', flexShrink: 0,
      }}>
        <Icon name="book" size={20} color="#fff" />
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: .5 }}>Guide</span>
      </Press>
    </div>
  );
}

function Node({ lesson, status, theme, onClick, offset }) {
  const tc = themeColors(theme);
  const isCurrent = status === 'current';
  const isDone = status === 'done';
  const isLocked = status === 'locked';

  const faceBg = isDone ? tc.main : isCurrent ? tc.main : '#e6dfd3';
  const rim = isDone ? tc.deep : isCurrent ? tc.deep : '#cfc7b8';
  const iconColor = isLocked ? '#b3aa99' : '#fff';
  const size = 70;

  return (
    <div style={{ position: 'relative', transform: `translateX(${offset}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isCurrent && (
        <div style={{ position: 'absolute', top: -42, left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{
            position: 'relative', background: '#fff', borderRadius: 12,
            padding: '6px 14px', fontWeight: 900, fontSize: 13, letterSpacing: 1, color: tc.main,
            boxShadow: `0 3px 0 ${C.line}`, textTransform: 'uppercase', animation: 'bob2 1.4s ease-in-out infinite',
          }}>
            Start
            <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 12, height: 12, background: '#fff' }} />
          </div>
        </div>
      )}
      {isCurrent && (
        <div style={{
          position: 'absolute', top: 0, left: '50%', marginLeft: -(size + 16) / 2,
          width: size + 16, height: size + 16, borderRadius: 999,
          border: `4px solid ${tc.soft}`, opacity: .5, animation: 'pulsering 1.8s ease-out infinite',
        }} />
      )}
      <Press onClick={onClick} style={{ background: 'none' }}>
        <div style={{
          width: size, height: size, borderRadius: 999, background: rim, padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: size, height: size, borderRadius: 999, background: faceBg,
            transform: 'translateY(-5px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: isLocked ? `2px solid #d8d0c1` : 'none',
            boxShadow: isDone ? `inset 0 3px 0 rgba(255,255,255,.25)` : 'none',
          }}>
            <Icon name={isLocked ? 'lock' : isDone ? 'check' : lesson.icon} size={isDone ? 32 : 30}
              color={iconColor} stroke={isDone ? 3 : 2.2} />
          </div>
        </div>
      </Press>
    </div>
  );
}

function HomeScreen({ data, statusOf, onStart, onGuide, onToast, onHeartsClick }) {
  const offsets = [0, 38, 60, 38, 0, -38, -60, -38];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusStrip user={data.user} onHeartsClick={onHeartsClick} />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {data.units.map((unit, ui) => {
          const locked = !unit.lessons.some(l => l.questions.length);
          return (
            <div key={unit.id} style={{ marginBottom: 8 }}>
              <UnitBanner unit={unit} theme={unit.theme} onGuide={() => onGuide(unit)} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, padding: '34px 0 18px' }}>
                {unit.lessons.map((lesson, li) => {
                  const status = locked ? 'locked' : statusOf(lesson.id);
                  const off = offsets[li % offsets.length];
                  return (
                    <Node key={lesson.id} lesson={lesson} status={status} theme={unit.theme} offset={off}
                      onClick={() => {
                        if (status === 'locked') { onToast(locked ? 'This chapter unlocks soon — keep going!' : 'Finish the lesson before this one first.'); return; }
                        onStart(unit, lesson);
                      }} />
                  );
                })}
              </div>
              {ui < data.units.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 28px 14px' }}>
                  <div style={{ flex: 1, height: 1.5, background: C.line }} />
                  <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: C.mute }}>
                    Chapter {data.units[ui + 1].chapter}
                  </span>
                  <div style={{ flex: 1, height: 1.5, background: C.line }} />
                </div>
              )}
            </div>
          );
        })}
        <div style={{ textAlign: 'center', color: C.mute, fontSize: 13, fontWeight: 700, padding: '8px 40px 30px', lineHeight: 1.5 }}>
          32 chapters in all — from the Scriptures to the Last Judgment.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, StatusStrip, UnitBanner, Node });
