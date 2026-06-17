/* Cornerstone — app shell: tabs, nav, persistence, toast, guide sheet */

const STORE_KEY = 'cornerstone_v1';
const ONBOARD_KEY = 'cornerstone_onboarded_v1';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (e) { return null; }
}
function saveProgress(p) { try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {} }
function todayStr() { return new Date().toISOString().slice(0, 10); }

// flat list of playable lessons in order
function playableList(units) {
  const out = [];
  units.forEach(u => u.lessons.forEach(l => { if (l.questions.length) out.push({ unit: u, lesson: l }); }));
  return out;
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)', zIndex: 80,
      background: C.navyDeep, color: '#fff', padding: '11px 18px', borderRadius: 12,
      fontWeight: 700, fontSize: 14, maxWidth: 320, textAlign: 'center', lineHeight: 1.4,
      boxShadow: '0 8px 24px rgba(0,0,0,.22)', animation: 'bob 2s ease-in-out',
    }}>{msg}</div>
  );
}

function GuideSheet({ unit, statusOf, onClose, onStart }) {
  if (!unit) return null;
  const tc = themeColors(unit.theme);
  const locked = !unit.lessons.some(l => l.questions.length);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 90, background: 'rgba(20,25,35,.45)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.bg, borderRadius: '26px 26px 0 0', padding: '10px 22px 34px',
        maxHeight: '82%', overflowY: 'auto', animation: 'sheetup .28s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9, background: C.line, margin: '0 auto 18px' }} />
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.4, textTransform: 'uppercase', color: tc.main }}>Chapter {unit.chapter}</div>
        <h2 style={{ margin: '3px 0 8px', fontSize: 24, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>{unit.title}</h2>
        <p style={{ margin: 0, fontFamily: FSERIF, fontSize: 16, lineHeight: 1.6, color: C.sub, fontStyle: 'italic' }}>{unit.blurb}</p>

        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {unit.lessons.map(l => {
            const st = locked ? 'locked' : statusOf(l.id);
            const dot = st === 'done' ? tc.main : st === 'current' ? tc.main : '#d6cfc2';
            return (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', gap: 13, background: '#fff',
                border: `2px solid ${C.line}`, borderRadius: 14, padding: '13px 15px',
                opacity: st === 'locked' ? .6 : 1,
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 999, background: st === 'locked' ? C.lockedBg : tc.wash, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={st === 'locked' ? 'lock' : st === 'done' ? 'check' : l.icon} size={18} color={st === 'locked' ? '#aaa093' : tc.main} stroke={st === 'done' ? 3 : 2.2} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: C.ink }}>{l.title}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.mute }}>
                    {locked ? 'Locked' : st === 'done' ? 'Completed' : st === 'current' ? 'Up next · ' + l.questions.length + ' questions' : l.questions.length + ' questions'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!locked && (
          <div style={{ marginTop: 20 }}>
            <Chunky full color={tc.main} onClick={() => { const l = unit.lessons.find(x => statusOf(x.id) === 'current') || unit.lessons.find(x => x.questions.length); onStart(unit, l); }}>
              Start lesson
            </Chunky>
          </div>
        )}
      </div>
    </div>
  );
}

function PracticeScreenStub() { return null; } // replaced by app/practice.jsx

function BottomNav({ tab, setTab }) {
  const tabs = [{ id: 'learn', icon: 'home', label: 'Learn' }, { id: 'read', icon: 'book', label: 'Read' }, { id: 'practice', icon: 'dumbbell', label: 'Practice' }, { id: 'profile', icon: 'user', label: 'Profile' }];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      background: '#fff', borderTop: `1.5px solid ${C.line}`,
      display: 'flex', padding: '8px 12px 26px',
    }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <Press key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 0' }}>
            <div style={{
              padding: '4px 18px', borderRadius: 12, background: active ? C.navyWash : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={t.icon} size={26} color={active ? C.navy : C.mute} fill={false} stroke={active ? 2.6 : 2.2} />
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: active ? C.navy : C.mute, letterSpacing: .3 }}>{t.label}</span>
          </Press>
        );
      })}
    </div>
  );
}

function App() {
  const base = CORNERSTONE;
  const [user, setUser] = React.useState(() => {
    const saved = loadProgress();
    return { ...base.user, ...(saved || {}) };
  });
  const data = React.useMemo(() => ({ ...base, user }), [user]);
  const [tab, setTab] = React.useState('learn');
  const [onboarded, setOnboarded] = React.useState(() => {
    try { return localStorage.getItem(ONBOARD_KEY) === '1'; } catch (e) { return false; }
  });
  const [lesson, setLesson] = React.useState(null); // {unit, lesson, practice?}
  const [timed, setTimed] = React.useState(null); // {pool}
  const [guideUnit, setGuideUnit] = React.useState(null);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [heartsOpen, setHeartsOpen] = React.useState(false);
  const [ach, setAch] = React.useState(null); // newly-unlocked achievement to celebrate
  const [toast, setToast] = React.useState('');
  const toastTimer = React.useRef(null);

  React.useEffect(() => { saveProgress(user); }, [user]);

  // on mount: apply heart refill, roll over the day, seed seen-achievements baseline
  React.useEffect(() => {
    setUser(prev => {
      const n = { ...prev, ...refillHearts(prev) };
      const today = todayStr();
      if (prev.lastActiveDate && prev.lastActiveDate !== today) n.dailyXp = 0;
      n.lastActiveDate = today;
      if (!prev.seenAchievements) n.seenAchievements = earnedIds(prev);
      return n;
    });
  }, []);

  function showToast(m) {
    setToast(m); clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }
  const doneSet = new Set(user.done);
  function statusOf(id) { return doneSet.has(id) ? 'done' : (id === user.current ? 'current' : 'locked'); }

  function startLesson(unit, l) {
    // out of hearts? block the path and send them to earn one in practice
    if ((user.hearts || 0) <= 0) {
      setGuideUnit(null);
      setHeartsOpen(true);
      setTimeout(() => showToast('Out of hearts — practice to earn one first'), 120);
      return;
    }
    setGuideUnit(null);
    setLesson({ unit, lesson: l });
  }

  // hearts economy ----------------------------------------------------
  function persistHearts(n) {
    setUser(prev => {
      const max = prev.maxHearts || 5;
      const v = Math.max(0, Math.min(max, n));
      const next = { ...prev, hearts: v };
      if (v < max && !prev.heartsAt) next.heartsAt = Date.now();
      if (v >= max) next.heartsAt = null;
      return next;
    });
  }
  function refillWithGems() {
    setUser(prev => {
      const max = prev.maxHearts || 5;
      if (prev.hearts >= max || (prev.gems || 0) < HEART_GEM_COST) return prev;
      return { ...prev, hearts: max, heartsAt: null, gems: prev.gems - HEART_GEM_COST };
    });
    setHeartsOpen(false);
    setTimeout(() => showToast('Hearts refilled · −' + HEART_GEM_COST + ' gems'), 150);
  }
  function refillTick() {
    setUser(prev => {
      const r = refillHearts(prev);
      return (r.hearts !== prev.hearts || r.heartsAt !== prev.heartsAt) ? { ...prev, ...r } : prev;
    });
  }
  function heartsToPractice() { setHeartsOpen(false); setTab('practice'); }

  function signIn(account) {
    setUser(prev => ({ ...prev, account, name: account.name.split(' ')[0] }));
    setAuthOpen(false);
    setTimeout(() => showToast('Signed in with ' + account.label + ' · welcome, ' + account.name.split(' ')[0] + '!'), 220);
  }
  function signOut() {
    setUser(prev => ({ ...prev, account: null, name: 'Friend' }));
    setTimeout(() => showToast('Signed out'), 150);
  }

  function completeOnboarding({ dailyGoal, account }) {
    setUser(prev => ({
      ...prev,
      dailyGoal: dailyGoal || prev.dailyGoal,
      ...(account ? { account, name: account.name.split(' ')[0] } : {}),
    }));
    try { localStorage.setItem(ONBOARD_KEY, '1'); } catch (e) {}
    setOnboarded(true);
    if (account) setTimeout(() => showToast('Welcome, ' + account.name.split(' ')[0] + '! Your goal is set.'), 300);
    else setTimeout(() => showToast('Daily goal set to ' + (dailyGoal || user.dailyGoal) + ' XP'), 300);
  }
  function replayOnboarding() {
    setTab('learn');
    setOnboarded(false);
  }

  function startPractice() {
    const pool = reviewPool(user).map(x => x.q);
    const pick = shuffle(pool).slice(0, 8);
    setLesson({ unit: base.units[0], lesson: { id: 'practice', title: 'Quick Review', questions: pick }, practice: true });
  }

  function startWeakSpots() {
    const weak = resolveWeak(user.weak);
    if (!weak.length) { showToast('No weak spots yet — nicely done!'); return; }
    const pick = shuffle(weak).slice(0, 10).map(x => x.q);
    setLesson({ unit: weak[0].unit, lesson: { id: 'weak', title: 'Weak Spots', questions: pick }, practice: true });
  }

  function startTimed() {
    setTimed({ pool: reviewPool(user) });
  }

  function finishLesson({ xp, lessonId, missed, clean, perfect }) {
    const prev = user;
    const max = prev.maxHearts || 5;
    const isPractice = lessonId === 'practice' || lessonId === 'weak' || lessonId === 'timed';
    const next = { ...prev };
    next.xp = prev.xp + xp;

    // weak-spot set: add freshly missed, drop freshly mastered
    const weak = new Set(prev.weak || []);
    (missed || []).forEach(fp => weak.add(fp));
    (clean || []).forEach(fp => weak.delete(fp));
    next.weak = [...weak];

    // practice rewards a heart; real lessons already spent theirs live
    if (isPractice && prev.hearts < max) {
      next.hearts = Math.min(max, prev.hearts + 1);
      next.heartsAt = next.hearts >= max ? null : prev.heartsAt;
    }
    // perfect (no hearts lost) real lessons feed the Spotless badge
    if (!isPractice && perfect) next.perfectLessons = (prev.perfectLessons || 0) + 1;

    // mark lesson done + unlock the next node
    if (lessonId && !isPractice) {
      const done = new Set(prev.done); done.add(lessonId); next.done = [...done];
      if (lessonId === prev.current) {
        const pl = playableList(base.units);
        const i = pl.findIndex(x => x.lesson.id === lessonId);
        const nxt = pl[i + 1];
        if (nxt) next.current = nxt.lesson.id;
      }
    }

    // daily goal + streak (counts once per day)
    const today = todayStr();
    next.dailyXp = Math.min(prev.dailyGoal, prev.dailyXp + xp);
    let goalJustMet = false;
    if (next.dailyXp >= prev.dailyGoal && prev.lastGoalDate !== today) {
      next.lastGoalDate = today;
      next.streak = (prev.streak || 0) + 1;
      goalJustMet = true;
    }

    // achievement unlocks (compare against what we've already celebrated)
    const before = new Set(prev.seenAchievements || earnedIds(prev));
    const nowEarned = earnedIds(next);
    const newly = nowEarned.filter(id => !before.has(id));
    next.seenAchievements = [...new Set([...(prev.seenAchievements || []), ...nowEarned])];

    setUser(next);
    setLesson(null);
    setTimed(null);

    // celebrate: an achievement takes priority, then goal, then the usual XP toast
    if (newly.length) {
      const def = computeAchievements(next).find(a => a.id === newly[0]);
      setTimeout(() => setAch(def), 380);
    } else if (goalJustMet) {
      setTimeout(() => showToast('Daily goal reached · ' + next.streak + '-day streak!'), 300);
    } else {
      const label = lessonId === 'practice' ? 'Nice review! +' + xp + ' XP'
        : lessonId === 'weak' ? 'Weak spots sharpened · +' + xp + ' XP'
        : lessonId === 'timed' ? 'Drill done · +' + xp + ' XP'
        : 'Lesson complete · +' + xp + ' XP';
      setTimeout(() => showToast(label), 250);
    }
  }

  // first-run onboarding takes over the whole screen
  if (!onboarded) {
    return <Onboarding initialGoal={user.dailyGoal} onFinish={completeOnboarding} />;
  }

  // timed drill overlay takes the whole screen
  if (timed) {
    return (
      <TimedDrillScreen
        pool={timed.pool} theme="navy"
        onExit={() => setTimed(null)}
        onFinish={finishLesson}
      />
    );
  }

  // lesson overlay takes the whole screen
  if (lesson) {
    return (
      <LessonScreen
        lesson={lesson.lesson} theme={lesson.unit.theme}
        startHearts={user.hearts}
        practice={!!lesson.practice}
        onHearts={persistHearts}
        onPractice={() => { setLesson(null); setTab('practice'); }}
        onExit={() => setLesson(null)}
        onFinish={finishLesson}
      />
    );
  }

  return (
    <div style={{ height: '100%', position: 'relative', background: C.bg }}>
      <Toast msg={toast} />
      {tab === 'learn' && <HomeScreen data={data} statusOf={statusOf} onStart={startLesson} onGuide={setGuideUnit} onToast={showToast} onHeartsClick={() => setHeartsOpen(true)} />}
      {tab === 'read' && <ReadScreen data={data} />}
      {tab === 'practice' && <PracticeScreen data={data} onQuickReview={startPractice} onWeakSpots={startWeakSpots} onTimed={startTimed} onHeartsClick={() => setHeartsOpen(true)} />}
      {tab === 'profile' && <ProfileScreen data={data} onSignInClick={() => setAuthOpen(true)} onSignOut={signOut} onReplay={replayOnboarding} />}
      <BottomNav tab={tab} setTab={setTab} />
      <GuideSheet unit={guideUnit} statusOf={statusOf} onClose={() => setGuideUnit(null)} onStart={startLesson} />
      <SignInSheet open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={signIn} />
      <HeartsSheet open={heartsOpen} user={user} onClose={() => setHeartsOpen(false)} onRefillGems={refillWithGems} onPractice={heartsToPractice} onTick={refillTick} />
      <AchievementUnlock ach={ach} onClose={() => setAch(null)} />
    </div>
  );
}

window.CornerstoneApp = App;
