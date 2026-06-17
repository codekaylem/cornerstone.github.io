/* Cornerstone — first-run onboarding: welcome → how it works → daily goal
   → sign in. Sets the daily goal and (optionally) the account, then drops
   the learner onto the path. Replayable from Profile. */

const ONBOARD_GOALS = [
  { v: 20, name: 'Relaxed', desc: 'about 3 minutes a day', icon: 'flame' },
  { v: 50, name: 'Steady', desc: 'about 8 minutes a day', icon: 'bolt', rec: true },
  { v: 100, name: 'Committed', desc: 'about 15 minutes a day', icon: 'target' },
  { v: 150, name: 'Devoted', desc: 'about 25 minutes a day', icon: 'crown' },
];

function BrandMark({ size = 76, radius = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `linear-gradient(135deg, ${C.navySoft}, ${C.navyDeep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 900, fontSize: size * 0.5, fontFamily: FSERIF,
      boxShadow: `0 10px 26px ${C.navy}45, inset 0 2px 0 rgba(255,255,255,.18)`,
    }}>C</div>
  );
}

function Dots({ n, i }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
      {Array.from({ length: n }).map((_, k) => (
        <div key={k} style={{
          height: 7, borderRadius: 9, transition: 'all .3s ease',
          width: k === i ? 22 : 7,
          background: k === i ? C.navy : k < i ? C.navySoft : C.line,
        }} />
      ))}
    </div>
  );
}

function FeatureRow({ icon, title, body, tint }) {
  const tc = themeColors(tint);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14, flexShrink: 0,
        background: tc.wash, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={26} color={tc.main} stroke={2.3} />
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ fontWeight: 900, fontSize: 16.5, color: C.navyDeep }}>{title}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.sub, lineHeight: 1.5, marginTop: 2 }}>{body}</div>
      </div>
    </div>
  );
}

function GoalRow({ goal, selected, onClick }) {
  return (
    <Press onClick={onClick} style={{
      width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
      background: selected ? C.navyWash : '#fff',
      ...bd3(selected ? C.navySoft : C.line, selected ? C.navySoft : '#e3ddd0', 2, selected ? 2 : 4),
      borderRadius: 16, padding: '14px 15px',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: selected ? C.navy : C.lineSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={goal.icon} size={23} color={selected ? '#fff' : C.mute} stroke={2.3} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 900, fontSize: 16.5, color: C.navyDeep }}>{goal.name}</span>
          {goal.rec && <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase', color: C.goldDeep, background: C.goldWash, padding: '3px 7px', borderRadius: 6 }}>Recommended</span>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.mute, marginTop: 2 }}>{goal.v} XP · {goal.desc}</div>
      </div>
      <div style={{
        width: 24, height: 24, borderRadius: 999, flexShrink: 0,
        border: `2px solid ${selected ? C.navy : C.line}`, background: selected ? C.navy : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && <Icon name="check" size={15} color="#fff" stroke={3.2} />}
      </div>
    </Press>
  );
}

function Onboarding({ initialGoal = 50, onFinish }) {
  const STEPS = 4;
  const [step, setStep] = React.useState(0);
  const [goal, setGoal] = React.useState(initialGoal);
  const [busy, setBusy] = React.useState(null);

  const next = () => setStep(s => Math.min(STEPS - 1, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  function chooseProvider(provider) {
    if (busy) return;
    setBusy(provider);
    setTimeout(() => { onFinish({ dailyGoal: goal, account: window.MOCK_ACCOUNTS[provider] }); }, 950);
  }

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', background: C.bg }}>
      {/* top chrome: back + dots */}
      <div style={{ padding: '52px 20px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Press onClick={back} disabled={step === 0} style={{ background: 'none', opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto' }}>
          <Icon name="arrowLeft" size={24} color={C.mute} stroke={2.6} />
        </Press>
        <div style={{ flex: 1 }}><Dots n={STEPS} i={step} /></div>
        <div style={{ width: 24 }} />
      </div>

      {/* step content */}
      <div key={step} style={{ flex: 1, overflowY: 'auto', padding: '8px 26px 20px', animation: 'sheetup .32s cubic-bezier(.2,.8,.2,1)' }}>
        {step === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 50 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><BrandMark size={88} radius={26} /></div>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: C.gold, marginTop: 24 }}>Cornerstone</div>
            <h1 style={{ margin: '10px 0 0', fontFamily: FSERIF, fontSize: 28, fontWeight: 700, color: C.navyDeep, lineHeight: 1.25, letterSpacing: -.4 }}>
              Know the faith,<br />stone by stone
            </h1>
            <p style={{ margin: '18px auto 0', fontSize: 15.5, fontWeight: 600, color: C.sub, lineHeight: 1.6, maxWidth: 300 }}>
              A guided journey through the 1689 London Baptist Confession — in plain, modern English.
            </p>
          </div>
        )}

        {step === 1 && (
          <div style={{ paddingTop: 8 }}>
            <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>How it works</h1>
            <p style={{ margin: '0 0 26px', fontSize: 15, fontWeight: 600, color: C.sub, lineHeight: 1.5 }}>
              Three simple habits, woven together.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <FeatureRow icon="home" tint="navy" title="Learn the path" body="Work chapter by chapter through bite-sized lessons that build on each other." />
              <FeatureRow icon="book" tint="gold" title="Read the source" body="The full Confession in modern English, with every proof-text a tap away." />
              <FeatureRow icon="dumbbell" tint="navy" title="Practice & remember" body="Quick reviews, weak-spot drills, and timed rounds keep it fresh." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ paddingTop: 8 }}>
            <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 900, color: C.navyDeep, letterSpacing: -.3 }}>Set your daily goal</h1>
            <p style={{ margin: '0 0 22px', fontSize: 15, fontWeight: 600, color: C.sub, lineHeight: 1.5 }}>
              A little each day goes a long way. You can change this anytime.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {ONBOARD_GOALS.map(g => (
                <GoalRow key={g.v} goal={g} selected={goal === g.v} onClick={() => setGoal(g.v)} />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ paddingTop: 40, paddingBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: C.goldWash, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="shield" size={34} color={C.gold} stroke={2.2} />
              </div>
            </div>
            <h1 style={{ margin: '0 0 6px', fontSize: 25, fontWeight: 900, color: C.navyDeep, textAlign: 'center', letterSpacing: -.3 }}>Save your progress</h1>
            <p style={{ margin: '0 auto 24px', fontSize: 15, fontWeight: 600, color: C.sub, lineHeight: 1.55, textAlign: 'center', maxWidth: 300 }}>
              Sign in to keep your streak, hearts, and place in the Confession synced across devices.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <ProviderButton provider="google" busy={busy === 'google'} anyBusy={!!busy} onClick={() => chooseProvider('google')} />
              <ProviderButton provider="facebook" busy={busy === 'facebook'} anyBusy={!!busy} onClick={() => chooseProvider('facebook')} />
            </div>
          </div>
        )}
      </div>

      {/* bottom CTA */}
      <div style={{ padding: '8px 26px 30px' }}>
        {step < 3 && (
          <Chunky full color={C.navy} onClick={next}>
            {step === 0 ? 'Get started' : step === 2 ? `Set ${goal} XP goal` : 'Continue'}
          </Chunky>
        )}
        {step === 0 && (
          <button onClick={() => setStep(3)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: C.sub, fontWeight: 800, fontSize: 14.5, padding: '14px 0 2px' }}>
            I already have an account
          </button>
        )}
        {step === 3 && (
          <button onClick={() => onFinish({ dailyGoal: goal, account: null })} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: C.sub, fontWeight: 800, fontSize: 15, padding: '6px 0', textTransform: 'uppercase', letterSpacing: .5 }}>
            I’ll do this later
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding, BrandMark });
