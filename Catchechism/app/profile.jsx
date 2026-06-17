/* Cornerstone — Profile / stats screen */

function Ring({ value, size = 92, stroke = 10, color = C.gold, track = '#eee4d2', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)}
          style={{ transition: 'stroke-dashoffset .6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

function StatTile({ icon, value, label, color, fill }) {
  return (
    <div style={{ background: '#fff', border: `2px solid ${C.line}`, borderRadius: 16, padding: '14px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon name={icon} size={22} color={color} fill={fill ? color : 'none'} />
        <span style={{ fontWeight: 900, fontSize: 22, color: C.ink }}>{value}</span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.mute }}>{label}</div>
    </div>
  );
}

function StreakCalendar({ week, streak }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, borderRadius: 18,
      padding: '18px 18px 20px', boxShadow: `0 6px 16px ${C.gold}40`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Icon name="flame" size={30} color="#fff" />
        <div>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>{streak}-day streak</div>
          <div style={{ fontSize: 13, color: '#fff', opacity: .85, fontWeight: 700, marginTop: 3 }}>{streak > 0 ? 'Keep the flame lit today' : 'Hit your goal to start a streak'}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {days.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', opacity: .8 }}>{d}</span>
            <div style={{
              width: 30, height: 30, borderRadius: 999,
              background: week[i] ? '#fff' : 'rgba(255,255,255,.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: week[i] ? 'none' : '1.5px solid rgba(255,255,255,.35)',
            }}>
              {week[i] && <Icon name="flame" size={18} color={C.goldDeep} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ a }) {
  const earned = a.tier === 'earned';
  const locked = a.tier === 'locked';
  const prog = a.tier === 'progress';
  const ring = earned ? C.gold : prog ? C.navy : '#d8d0c1';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, background: '#fff',
      border: `2px solid ${C.line}`, borderRadius: 16, padding: '13px 15px',
      opacity: locked ? .6 : 1,
    }}>
      <div style={{
        width: 50, height: 50, borderRadius: 14, flexShrink: 0,
        background: earned ? `linear-gradient(135deg, ${C.goldSoft}, ${C.gold})` : prog ? C.navyWash : C.lockedBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: earned ? `0 3px 0 ${C.goldDeep}` : 'none',
      }}>
        <Icon name={locked ? 'lock' : a.icon} size={26} color={earned ? '#fff' : prog ? C.navy : '#aaa093'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15.5, color: C.ink }}>{a.name}</div>
        <div style={{ fontSize: 12.5, color: C.mute, fontWeight: 600, marginTop: 1 }}>{a.desc}</div>
        {prog && (
          <div style={{ marginTop: 7, height: 7, borderRadius: 6, background: '#ece6dc', overflow: 'hidden' }}>
            <div style={{ width: `${a.progress * 100}%`, height: '100%', background: C.navy, borderRadius: 6 }} />
          </div>
        )}
      </div>
      {earned && <Icon name="check" size={20} color={C.gold} stroke={3} />}
    </div>
  );
}

function ProfileScreen({ data, onSignInClick, onSignOut, onReplay }) {
  const u = data.user;
  const acct = u.account;
  const lessonsDone = u.done.length;
  const goalPct = Math.min(1, u.dailyXp / u.dailyGoal);
  const initials = acct ? acct.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : 'C';
  const achievements = computeAchievements(u);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 110 }}>
        {/* header */}
        <div style={{ padding: '54px 22px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            position: 'relative', width: 72, height: 72, borderRadius: 999, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.navySoft}, ${C.navyDeep})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 28, fontFamily: FSERIF,
            boxShadow: `0 5px 14px ${C.navy}40`,
          }}>{initials}
            {acct && (
              <div style={{
                position: 'absolute', right: -3, bottom: -3, width: 28, height: 28, borderRadius: 999,
                background: '#fff', border: `2px solid ${C.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,.15)',
              }}>
                {acct.provider === 'google' ? <GoogleMark size={15} /> : <FacebookMark size={15} />}
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 23, color: C.navyDeep }}>{acct ? acct.name : 'Cornerstone Learner'}</div>
            <div style={{ fontSize: 13.5, color: C.mute, fontWeight: 700, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {acct ? acct.email : 'Guest · Joined ' + u.joined}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* account / sign-in */}
          {acct ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, background: '#fff',
              border: `2px solid ${C.line}`, borderRadius: 16, padding: '13px 15px',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: C.navyWash, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {acct.provider === 'google' ? <GoogleMark size={20} /> : <FacebookMark size={20} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: C.ink }}>Signed in with {acct.label}</div>
                <div style={{ fontSize: 12.5, color: C.mute, fontWeight: 700, marginTop: 1 }}>Progress is syncing</div>
              </div>
              <Press onClick={onSignOut} style={{
                display: 'flex', alignItems: 'center', gap: 6, background: C.lineSoft, borderRadius: 11,
                padding: '9px 13px', color: C.sub, fontWeight: 800, fontSize: 13,
              }}>
                <Icon name="logout" size={17} color={C.sub} stroke={2.4} />
                Sign out
              </Press>
            </div>
          ) : (
            <div style={{
              background: `linear-gradient(140deg, ${C.navy}, ${C.navyDeep})`, borderRadius: 18,
              padding: '18px 18px 20px', boxShadow: `0 6px 16px ${C.navy}38`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Icon name="shield" size={26} color={C.goldSoft} />
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', color: C.goldSoft }}>Save your progress</span>
              </div>
              <h3 style={{ margin: '0 0 14px', fontSize: 19, fontWeight: 900, color: '#fff' }}>Sign in to sync across devices</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ProviderButton provider="google" onClick={onSignInClick} />
                <ProviderButton provider="facebook" onClick={onSignInClick} />
              </div>
            </div>
          )}

          {/* daily goal ring */}
          <div style={{
            background: '#fff', border: `2px solid ${C.line}`, borderRadius: 18, padding: 18,
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            <Ring value={goalPct} color={C.gold}>
              <Icon name="target" size={22} color={C.gold} />
              <span style={{ fontWeight: 900, fontSize: 15, color: C.ink, marginTop: 2 }}>{Math.round(goalPct * 100)}%</span>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 17, color: C.ink }}>Daily goal</div>
              <div style={{ fontSize: 14, color: C.sub, fontWeight: 700, marginTop: 3 }}>{u.dailyXp} / {u.dailyGoal} XP today</div>
              <div style={{ fontSize: 13, color: C.mute, fontWeight: 600, marginTop: 6 }}>One more lesson hits your goal.</div>
            </div>
          </div>

          {/* streak */}
          <StreakCalendar week={u.week} streak={u.streak} />

          {/* stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <StatTile icon="bolt" value={u.xp} label="Total XP" color={C.gold} />
            <StatTile icon="flame" value={u.streak} label="Day streak" color={C.gold} />
            <StatTile icon="book" value={lessonsDone} label="Lessons done" color={C.navy} />
            <StatTile icon="heart" value={u.hearts + '/' + u.maxHearts} label="Hearts" color={C.red} fill />
          </div>

          {/* achievements */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 4px 12px' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: C.navyDeep }}>Achievements</h3>
              <span style={{ fontSize: 13, fontWeight: 800, color: C.gold }}>
                {achievements.filter(a => a.tier === 'earned').length} earned
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {achievements.map(a => <AchievementCard key={a.id} a={a} />)}
            </div>
          </div>

          {/* utilities */}
          <Press onClick={onReplay} style={{
            display: 'flex', alignItems: 'center', gap: 12, background: '#fff',
            border: `2px solid ${C.line}`, borderRadius: 16, padding: '14px 15px', width: '100%', textAlign: 'left',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: C.navyWash, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="sparkle" size={20} color={C.navy} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14.5, color: C.ink }}>Replay the welcome tour</div>
              <div style={{ fontSize: 12.5, color: C.mute, fontWeight: 700, marginTop: 1 }}>See the intro and reset your daily goal</div>
            </div>
            <Icon name="chevron" size={18} color={C.mute} />
          </Press>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen, Ring, StreakCalendar, AchievementCard, StatTile });
