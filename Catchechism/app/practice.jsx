/* Cornerstone — Practice tab: Quick Review, Weak Spots, and Timed Drill.
   Reuses the question engine (QuestionView / grade / qFingerprint). */

// ── question registry: fingerprint → {q, unit} across every chapter ───
let _qIndex = null;
function questionIndex() {
  if (_qIndex) return _qIndex;
  _qIndex = {};
  ((window.CORNERSTONE && window.CORNERSTONE.units) || []).forEach(u =>
    u.lessons.forEach(l => (l.questions || []).forEach(q => {
      _qIndex[qFingerprint(q)] = { q, unit: u };
    })));
  return _qIndex;
}
function resolveWeak(fps) {
  const idx = questionIndex();
  return (fps || []).map(fp => idx[fp]).filter(Boolean);
}
// pooled questions from lessons the learner has touched (or all, as fallback)
function reviewPool(user) {
  const idx = questionIndex();
  const all = Object.values(idx);
  const doneCh = new Set((user.done || []).map(id => String(id).split('-')[0]));
  const started = all.filter(({ unit }) => doneCh.has(String(unit.chapter)));
  return (started.length >= 6 ? started : all);
}
Object.assign(window, { questionIndex, resolveWeak, reviewPool });

// ── one tappable practice mode card ───────────────────────────────────
function PracticeCard({ icon, kicker, title, desc, cta, accent, onClick, disabled, badge }) {
  const tc = themeColors(accent === 'navy' ? 'navy' : 'gold');
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '18px 18px 20px',
      ...bd3(C.line, '#e3ddd0', 2, 4),
      opacity: disabled ? 0.72 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 13, flexShrink: 0,
          background: tc.wash, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={24} color={tc.main} stroke={2.3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: tc.main }}>{kicker}</div>
          <div style={{ fontSize: 18.5, fontWeight: 900, color: C.navyDeep, letterSpacing: -.2 }}>{title}</div>
        </div>
        {badge != null && (
          <div style={{
            flexShrink: 0, minWidth: 26, height: 26, padding: '0 8px', borderRadius: 999,
            background: badge > 0 ? C.red : C.lineSoft, color: badge > 0 ? '#fff' : C.mute,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13.5,
          }}>{badge}</div>
        )}
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: C.sub, lineHeight: 1.5 }}>{desc}</p>
      <Chunky full color={disabled ? '#e7e1d6' : tc.main} disabled={disabled} onClick={onClick}>{cta}</Chunky>
    </div>
  );
}

// ── Practice home ─────────────────────────────────────────────────────
function PracticeScreen({ data, onQuickReview, onWeakSpots, onTimed, onHeartsClick }) {
  const user = data.user;
  const weakCount = (user.weak || []).length;
  const poolSize = reviewPool(user).length;
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <StatusStrip user={user} onHeartsClick={onHeartsClick} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 120px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.navyDeep, margin: '8px 0 6px', letterSpacing: -.4 }}>Practice</h1>
        <p style={{ margin: '0 0 20px', color: C.sub, fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
          Sharpen what you’ve learned. Practice never costs a heart.
        </p>

        {/* Quick Review — feature card */}
        <div style={{
          background: `linear-gradient(140deg, ${C.navy}, ${C.navyDeep})`, borderRadius: 22, padding: '22px 20px',
          boxShadow: `0 8px 22px ${C.navy}38`, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Icon name="dumbbell" size={26} color={C.goldSoft} />
            <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.goldSoft }}>Mixed Review</span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: '#fff' }}>Quick Review</h2>
          <p style={{ margin: '0 0 18px', color: '#fff', opacity: .8, fontSize: 14.5, fontWeight: 600, lineHeight: 1.5 }}>
            8 mixed questions drawn from chapters you’ve started. A gentle warm-up — no hearts spent.
          </p>
          <Chunky full color={C.gold} onClick={onQuickReview}>Start review</Chunky>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Weak Spots */}
          <PracticeCard
            icon="target" accent="gold" kicker="Targeted" title="Weak Spots"
            badge={weakCount}
            desc={weakCount > 0
              ? `You’ve missed ${weakCount} question${weakCount === 1 ? '' : 's'}. Drill them until they stick — they leave this list once you get them right.`
              : 'Nothing to review yet. Questions you miss in a lesson land here so you can master them.'}
            cta={weakCount > 0 ? `Review ${weakCount}` : 'All clear'}
            disabled={weakCount === 0}
            onClick={onWeakSpots}
          />

          {/* Timed Drill */}
          <PracticeCard
            icon="timer" accent="navy" kicker="60 Seconds" title="Timed Drill"
            desc={`Answer as many as you can before the clock runs out. ${poolSize}+ questions in the pool — tap fast, the next one loads instantly.`}
            cta="Start the clock"
            onClick={onTimed}
          />
        </div>
      </div>
    </div>
  );
}

// ── Timed Drill ───────────────────────────────────────────────────────
const TIMED_TYPES = ['mc', 'truefalse', 'blank', 'passage'];
const DRILL_SECONDS = 60;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function TimedDrillScreen({ pool, theme, onExit, onFinish }) {
  const tc = themeColors('navy');
  const deck = React.useRef(shuffle(pool.filter(p => TIMED_TYPES.includes(p.q.type)).map(p => p.q)));
  const [idx, setIdx] = React.useState(0);
  const [value, setValue] = React.useState(() => initValue(deck.current[0]));
  const [phase, setPhase] = React.useState('answering');
  const [lastOk, setLastOk] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [answered, setAnswered] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [best, setBest] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(DRILL_SECONDS);
  const [screen, setScreen] = React.useState('play'); // play | done
  const missedRef = React.useRef(new Set());
  const cleanRef = React.useRef(new Set());
  const advTimer = React.useRef(null);
  const scrollRef = React.useRef(null);

  const q = deck.current[idx % deck.current.length];

  // countdown
  React.useEffect(() => {
    if (screen !== 'play') return;
    if (timeLeft <= 0) { setScreen('done'); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen]);

  React.useEffect(() => () => clearTimeout(advTimer.current), []);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [idx]);

  // auto-check the moment a single-value answer is chosen
  React.useEffect(() => {
    if (phase !== 'answering' || screen !== 'play') return;
    if (value === null || value === undefined) return;
    const ok = grade(q, value);
    const fp = qFingerprint(q);
    if (ok) { setScore(s => s + 1); setStreak(s => { const n = s + 1; setBest(b => Math.max(b, n)); return n; }); cleanRef.current.add(fp); }
    else { setStreak(0); missedRef.current.add(fp); cleanRef.current.delete(fp); }
    setLastOk(ok);
    setAnswered(a => a + 1);
    setPhase('checked');
    advTimer.current = setTimeout(() => {
      setIdx(i => i + 1);
      setValue(initValue(deck.current[(idx + 1) % deck.current.length]));
      setLastOk(null);
      setPhase('answering');
    }, 620);
  }, [value]);

  if (screen === 'done') {
    return <TimedComplete score={score} answered={answered} best={best}
      missed={[...missedRef.current]} clean={[...cleanRef.current]} onFinish={onFinish} />;
  }

  const pct = timeLeft / DRILL_SECONDS;
  const low = timeLeft <= 10;
  const barColor = low ? C.red : C.gold;

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: C.bg }}>
      {/* top bar: exit · timer · score */}
      <div style={{ padding: '52px 18px 10px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Press onClick={onExit} style={{ background: 'none' }}>
          <Icon name="x" size={24} color={C.mute} stroke={2.6} />
        </Press>
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, borderRadius: 10, background: '#eae3d8', overflow: 'hidden' }}>
            <div style={{
              width: `${pct * 100}%`, height: '100%', borderRadius: 10,
              background: low ? `linear-gradient(${C.red}, ${C.redDeep})` : `linear-gradient(${C.goldSoft}, ${C.gold})`,
              transition: 'width 1s linear, background .3s',
            }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 58, justifyContent: 'flex-end' }}>
          <Icon name="timer" size={22} color={barColor} stroke={2.4} />
          <span style={{ fontWeight: 900, fontSize: 19, color: barColor, fontVariantNumeric: 'tabular-nums', animation: low ? 'tick .5s steps(1) infinite' : 'none' }}>{timeLeft}</span>
        </div>
      </div>

      {/* score strip */}
      <div style={{ display: 'flex', gap: 10, padding: '4px 18px 6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="bolt" size={18} color={C.gold} />
          <span style={{ fontWeight: 900, fontSize: 16, color: C.ink }}>{score}</span>
          <span style={{ fontWeight: 700, fontSize: 12.5, color: C.mute }}>correct</span>
        </div>
        {streak >= 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.gold }}>
            <Icon name="flame" size={18} color={C.gold} />
            <span style={{ fontWeight: 900, fontSize: 16 }}>{streak}</span>
            <span style={{ fontWeight: 700, fontSize: 12.5 }}>streak</span>
          </div>
        )}
      </div>

      {/* question */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 16px' }}>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
            color: tc.deep, background: tc.wash, padding: '5px 10px', borderRadius: 7,
          }}>{QUESTION_PROMPTS[q.type]}</span>
        </div>
        {q.prompt && (
          <h2 style={{ margin: '0 0 18px', fontSize: 20, lineHeight: 1.35, fontWeight: 800, color: C.ink, textWrap: 'pretty' }}>{q.prompt}</h2>
        )}
        <QuestionView q={q} value={value} setValue={(v) => phase === 'answering' && setValue(v)} phase={phase} />
      </div>

      {/* feedback chip */}
      {phase === 'checked' && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: lastOk ? C.greenWash : C.redWash,
          padding: '16px 20px 26px', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 999, flexShrink: 0, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 0 ${lastOk ? C.green : C.red}`,
          }}>
            <Icon name={lastOk ? 'check' : 'x'} size={20} color={lastOk ? C.greenDeep : C.redDeep} stroke={3} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, color: lastOk ? C.greenDeep : C.redDeep }}>
            {lastOk ? 'Correct!' : 'Keep going'}
          </span>
        </div>
      )}
    </div>
  );
}

function TimedComplete({ score, answered, best, missed, clean, onFinish }) {
  const accuracy = answered ? Math.round((score / answered) * 100) : 0;
  const xp = score * 3;
  const stats = [
    { label: 'Correct', value: score, icon: 'bolt', color: C.gold },
    { label: 'Accuracy', value: accuracy + '%', icon: 'target', color: C.navy },
    { label: 'Best streak', value: best, icon: 'flame', color: C.red },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: '64px 24px 30px', textAlign: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 108, height: 108, borderRadius: 999,
            background: `radial-gradient(circle at 50% 35%, ${C.navySoft}, ${C.navyDeep})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 14px 30px ${C.navy}55, inset 0 3px 0 rgba(255,255,255,.25)`,
          }}>
            <Icon name="timer" size={54} color="#fff" stroke={2.4} />
          </div>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>Time!</h1>
          <p style={{ margin: '8px 0 0', color: C.sub, fontSize: 15.5, fontWeight: 600 }}>
            {score === 0 ? 'Give it another go — speed comes with reps.'
              : best >= 6 ? 'Blazing fast. Well done.'
              : 'Nicely done — come back and beat it.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {stats.map(s => (
            <div key={s.label} style={{ flex: 1, borderRadius: 16, padding: 2, background: s.color }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '12px 6px 13px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: s.color, marginBottom: 6 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <Icon name={s.icon} size={20} color={s.color} fill={s.icon === 'flame' ? 'none' : 'none'} />
                  <span style={{ fontWeight: 900, fontSize: 20, color: C.ink }}>{s.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Chunky full color={C.navy} onClick={() => onFinish({ xp, lessonId: 'timed', missed, clean })}>Claim {xp} XP</Chunky>
    </div>
  );
}

Object.assign(window, { PracticeScreen, PracticeCard, TimedDrillScreen, TimedComplete });
