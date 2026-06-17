/* Cornerstone — lesson flow: progress, hearts, check/feedback, complete & fail */

function HeartRow({ n, max }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <Icon name="heart" size={26} color={n > 0 ? C.red : '#d9d3c8'} fill={n > 0 ? C.red : '#e9e3d9'} />
      <span style={{ fontWeight: 800, fontSize: 18, color: n > 0 ? C.red : C.mute, minWidth: 14 }}>{n}</span>
    </div>
  );
}

function LessonScreen({ lesson, theme, onExit, onFinish, onHearts, onPractice, practice = false, startHearts = 5 }) {
  const tc = themeColors(theme);
  const noHearts = !!practice; // practice / weak / timed never cost hearts
  const total = lesson.questions.length;
  const [queue, setQueue] = React.useState(() => lesson.questions.map((q, i) => ({ q, oi: i })));
  const [idx, setIdx] = React.useState(0);
  const [solved, setSolved] = React.useState(() => new Set());
  const [value, setValue] = React.useState(() => initValue(lesson.questions[0]));
  const [phase, setPhase] = React.useState('answering');
  const [correct, setCorrect] = React.useState(false);
  const [hearts, setHearts] = React.useState(startHearts);
  const [mistakes, setMistakes] = React.useState(0);
  const [screen, setScreen] = React.useState('play'); // play | done | fail
  const missedRef = React.useRef(new Set()); // fingerprints missed at least once
  const scrollRef = React.useRef(null);

  const cur = queue[idx];
  const q = cur.q;
  const ready = isReady(q, value);

  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [idx]);

  function doCheck() {
    if (phase !== 'answering' || !ready) return;
    const ok = grade(q, q.type === 'tapwords' ? value.map(v => v.w) : value);
    setCorrect(ok);
    setPhase('checked');
    if (!ok) {
      missedRef.current.add(qFingerprint(q));
      setMistakes(m => m + 1);
      if (!noHearts && hearts > 0) {
        const h = Math.max(0, hearts - 1);
        setHearts(h);
        onHearts && onHearts(h);
      }
    }
  }
  // match self-resolution
  function matchResolved() { setCorrect(true); setPhase('checked'); }
  function matchMiss() {
    missedRef.current.add(qFingerprint(q));
    setMistakes(m => m + 1);
    if (noHearts || hearts <= 0) return;
    const h = Math.max(0, hearts - 1); setHearts(h); onHearts && onHearts(h);
    if (h <= 0) setTimeout(() => setScreen('fail'), 500);
  }

  function advance() {
    // out of hearts? (real lessons only)
    if (!noHearts && hearts <= 0) { setScreen('fail'); return; }
    let nextQueue = queue;
    let nextSolved = solved;
    if (correct) {
      nextSolved = new Set(solved); nextSolved.add(cur.oi); setSolved(nextSolved);
    } else {
      nextQueue = [...queue, { q, oi: cur.oi }]; setQueue(nextQueue);
    }
    if (nextSolved.size >= total) { setScreen('done'); return; }
    const ni = idx + 1;
    setIdx(ni);
    setValue(initValue(nextQueue[ni].q));
    setPhase('answering');
    setCorrect(false);
  }

  const progress = Math.min(1, solved.size / total);

  if (screen === 'done') {
    const missed = [...missedRef.current];
    const clean = lesson.questions.map(qFingerprint).filter(fp => !missedRef.current.has(fp));
    return <LessonComplete lesson={lesson} theme={theme} mistakes={mistakes} heartsLeft={hearts} missed={missed} clean={clean} onFinish={onFinish} />;
  }
  if (screen === 'fail') return <LessonFail theme={theme} onPractice={onPractice} onExit={onExit} />;

  const isLive = q.type === 'match';

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: C.bg }}>
      {/* top bar */}
      <div style={{ padding: '52px 18px 10px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <Press onClick={onExit} style={{ background: 'none' }}>
          <Icon name="x" size={24} color={C.mute} stroke={2.6} />
        </Press>
        <div style={{ flex: 1, height: 14, borderRadius: 10, background: '#eae3d8', overflow: 'hidden' }}>
          <div style={{
            width: `${progress * 100}%`, height: '100%', borderRadius: 10,
            background: `linear-gradient(${C.goldSoft}, ${C.gold})`,
            boxShadow: progress > 0 ? `inset 0 2px 0 rgba(255,255,255,.5)` : 'none',
            transition: 'width .35s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        {noHearts
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: tc.wash, borderRadius: 999, padding: '5px 11px' }}>
              <Icon name="dumbbell" size={18} color={tc.main} stroke={2.4} />
              <span style={{ fontWeight: 800, fontSize: 12.5, color: tc.deep, textTransform: 'uppercase', letterSpacing: .5 }}>Practice</span>
            </div>
          : <HeartRow n={hearts} max={5} />}
      </div>

      {/* prompt + question */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 150px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 18px' }}>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase',
            color: tc.deep, background: tc.wash, padding: '5px 10px', borderRadius: 7,
          }}>{QUESTION_PROMPTS[q.type]}</span>
        </div>
        {q.prompt && q.type !== 'blank' && q.type !== 'type' && (
          <h2 style={{ margin: '0 0 20px', fontSize: 21, lineHeight: 1.35, fontWeight: 800, color: C.ink, textWrap: 'pretty' }}>{q.prompt}</h2>
        )}
        {(q.type === 'type') && (
          <h2 style={{ margin: '0 0 18px', fontSize: 18, lineHeight: 1.45, fontWeight: 700, color: C.ink, textWrap: 'pretty' }}>{q.prompt}</h2>
        )}
        <QuestionView q={q} value={value} setValue={setValue} phase={phase}
          onResolved={matchResolved} onMiss={matchMiss} />
        {isLive && (
          <p style={{ marginTop: 18, textAlign: 'center', color: C.mute, fontSize: 13.5, fontWeight: 600 }}>
            Tap a phrase on the left, then its match on the right.
          </p>
        )}
      </div>

      {/* footer: check button or feedback */}
      <FeedbackFooter
        phase={phase} correct={correct} q={q} ready={ready} isLive={isLive}
        onCheck={doCheck} onContinue={advance} theme={theme}
      />
    </div>
  );
}

function FeedbackFooter({ phase, correct, q, ready, isLive, onCheck, onContinue, theme }) {
  const checked = phase === 'checked';
  const tone = correct ? { fg: C.greenDeep, bg: C.greenWash, rim: C.green, label: 'Amen — correct!', icon: 'check' }
    : { fg: C.redDeep, bg: C.redWash, rim: C.red, label: 'Not quite', icon: 'x' };
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: checked ? tone.bg : C.bg,
      borderTop: `1px solid ${checked ? 'transparent' : C.line}`,
      padding: '16px 20px 30px', transition: 'background .2s',
      boxShadow: checked ? 'none' : '0 -6px 20px rgba(0,0,0,.03)',
    }}>
      {checked && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999, flexShrink: 0, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 0 ${tone.rim}`,
          }}>
            <Icon name={tone.icon} size={22} color={tone.fg} stroke={3} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: tone.fg }}>{tone.label}</div>
            {q.explain && <div style={{ fontSize: 13.5, lineHeight: 1.45, color: tone.fg, opacity: .85, marginTop: 2 }}>{q.explain}</div>}
          </div>
        </div>
      )}
      {!checked && !isLive && (
        <Chunky full color={ready ? C.green : '#e7e1d6'} disabled={!ready} onClick={onCheck}>Check</Chunky>
      )}
      {!checked && isLive && (
        <div style={{ textAlign: 'center', color: C.mute, fontWeight: 700, fontSize: 14, padding: '4px 0' }}>Match all pairs to continue</div>
      )}
      {checked && (
        <Chunky full color={correct ? C.green : C.red} onClick={onContinue}>Continue</Chunky>
      )}
    </div>
  );
}

// ---- Lesson complete --------------------------------------------------
function LessonComplete({ lesson, theme, mistakes, heartsLeft, missed, clean, onFinish }) {
  const total = lesson.questions.length;
  const accuracy = Math.round((total / (total + mistakes)) * 100);
  const baseXp = 20;
  const perfect = mistakes === 0;
  const bonus = perfect ? 5 : 0;
  const xp = baseXp + bonus;
  const stats = [
    { label: 'Total XP', value: '+' + xp, icon: 'bolt', color: C.gold },
    { label: 'Accuracy', value: accuracy + '%', icon: 'target', color: C.navy },
    { label: 'Hearts left', value: heartsLeft, icon: 'heart', color: C.red },
  ];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: '64px 24px 30px', textAlign: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 108, height: 108, borderRadius: 999,
            background: `radial-gradient(circle at 50% 35%, ${C.goldSoft}, ${C.gold})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 14px 30px ${C.gold}55, inset 0 3px 0 rgba(255,255,255,.5)`,
          }}>
            <Icon name={perfect ? 'sparkle' : 'star'} size={56} color="#fff" stroke={2.4} />
          </div>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>
            {perfect ? 'Spotless!' : 'Lesson complete!'}
          </h1>
          <p style={{ margin: '8px 0 0', color: C.sub, fontSize: 15.5, fontWeight: 600 }}>
            {lesson.title} · {perfect ? 'No hearts lost — flawless work.' : 'Well done. Keep building.'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {stats.map(s => (
            <div key={s.label} style={{ flex: 1, borderRadius: 16, padding: 2, background: s.color }}>
              <div style={{ background: '#fff', borderRadius: 14, padding: '12px 6px 13px' }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: s.color, marginBottom: 6 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <Icon name={s.icon} size={20} color={s.color} fill={s.icon === 'heart' ? s.color : 'none'} />
                  <span style={{ fontWeight: 900, fontSize: 20, color: C.ink }}>{s.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Chunky full color={C.gold} onClick={() => onFinish({ xp, lessonId: lesson.id, missed, clean, perfect })}>Claim {xp} XP</Chunky>
    </div>
  );
}

// ---- Lesson fail ------------------------------------------------------
function LessonFail({ theme, onPractice, onExit }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, padding: '64px 24px 30px', textAlign: 'center' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 104, height: 104, borderRadius: 999, background: C.redWash,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${C.red}`,
          }}>
            <Icon name="heart" size={50} color={C.red} fill={C.redWash} />
          </div>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: C.redDeep }}>Out of hearts</h1>
          <p style={{ margin: '8px 18px 0', color: C.sub, fontSize: 15.5, lineHeight: 1.5, fontWeight: 600 }}>
            “Let us run with patience the race set before us.” Earn a heart in practice, then return to the path.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Chunky full color={C.navy} onClick={onPractice}>Practice to earn a heart</Chunky>
        <Press onClick={onExit} style={{ background: 'none', color: C.mute, fontWeight: 800, fontSize: 15, padding: '6px 0', textTransform: 'uppercase', letterSpacing: .5 }}>Back to path</Press>
      </div>
    </div>
  );
}

Object.assign(window, { LessonScreen, LessonComplete, LessonFail });
