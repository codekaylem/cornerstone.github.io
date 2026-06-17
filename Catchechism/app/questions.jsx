/* Cornerstone — question type components.
   Each receives: { q, value, setValue, phase, correct, live helpers }
   phase: 'answering' | 'checked'
   Helpers exported: isReady(q, value), grade(q, value), initValue(q)
*/

// ---- grading helpers --------------------------------------------------
function norm(s) { return String(s || '').toLowerCase().replace(/[.,;:'"!?]/g, '').replace(/\s+/g, ' ').trim(); }

function initValue(q) {
  switch (q.type) {
    case 'tapwords': return [];
    case 'match': return { locked: {}, misses: 0 };
    case 'type': return '';
    default: return null;
  }
}
function isReady(q, v) {
  switch (q.type) {
    case 'mc': case 'passage': case 'truefalse': case 'blank': return v !== null && v !== undefined;
    case 'type': return norm(v).length > 0;
    case 'tapwords': return Array.isArray(v) && v.length === q.answer.length;
    case 'match': return false; // self-resolving
    default: return false;
  }
}
function grade(q, v) {
  switch (q.type) {
    case 'mc': case 'passage': return v === q.answer;
    case 'truefalse': return v === q.answer;
    case 'blank': return v === q.answer;
    case 'type': return q.accept.map(norm).includes(norm(v));
    case 'tapwords': return JSON.stringify(v) === JSON.stringify(q.answer);
    default: return true;
  }
}
// stable fingerprint so we can track which questions a learner has missed
function qFingerprint(q) {
  const seed = [q.type, q.prompt, q.statement, q.before, q.question,
    q.pairs && q.pairs.map(pr => pr.a).join('~')].filter(Boolean).join('|');
  let h = 0;
  for (let i = 0; i < seed.length; i++) { h = (h * 31 + seed.charCodeAt(i)) | 0; }
  return q.type + '_' + (h >>> 0).toString(36);
}
Object.assign(window, { initValue, isReady, grade, normAnswer: norm, qFingerprint });

// ---- shared option card ----------------------------------------------
function OptionCard({ children, state, onClick, kbd }) {
  // state: 'idle' | 'selected' | 'correct' | 'wrong' | 'dim'
  const map = {
    idle: { bg: '#fff', bd: C.line, fg: C.ink, sh: '#e7e1d6' },
    selected: { bg: C.navyWash, bd: C.navySoft, fg: C.navyDeep, sh: '#cdd9e6' },
    correct: { bg: C.greenWash, bd: C.green, fg: C.greenDeep, sh: '#cfe4c9' },
    wrong: { bg: C.redWash, bd: C.red, fg: C.redDeep, sh: '#eccabf' },
    dim: { bg: '#fff', bd: C.lineSoft, fg: C.mute, sh: '#efe9df' },
  }[state];
  const disabled = state === 'correct' || state === 'wrong' || state === 'dim';
  return (
    <Press as="div" onClick={onClick} disabled={false}
      style={{
        background: map.bg, ...bd3(map.bd, map.sh),
        borderRadius: 15, padding: '15px 16px', color: map.fg,
        fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 12,
        opacity: state === 'dim' ? 0.7 : 1,
      }}>
      {kbd && (
        <span style={{
          width: 26, height: 26, flexShrink: 0, borderRadius: 7,
          border: `1.5px solid ${map.bd}`, color: map.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>{kbd}</span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
    </Press>
  );
}

// ---- Multiple choice / passage ---------------------------------------
function MultipleChoice({ q, value, setValue, phase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {q.options.map((opt, i) => {
        let state = 'idle';
        if (phase === 'checked') {
          if (i === q.answer) state = 'correct';
          else if (i === value) state = 'wrong';
          else state = 'dim';
        } else if (i === value) state = 'selected';
        return (
          <OptionCard key={i} state={state} kbd={i + 1}
            onClick={() => phase === 'answering' && setValue(i)}>{opt}</OptionCard>
        );
      })}
    </div>
  );
}

function Passage({ q, value, setValue, phase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#fffdf7', border: `1px solid ${C.goldSoft}`, borderLeft: `4px solid ${C.gold}`,
        borderRadius: 12, padding: '16px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
          <Icon name="quote" size={16} color={C.gold} />
          <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: C.goldDeep }}>{q.ref}</span>
        </div>
        <p style={{ margin: 0, fontFamily: FSERIF, fontSize: 16.5, lineHeight: 1.6, color: '#3a3526' }}>{q.passage}</p>
      </div>
      <div style={{ fontWeight: 800, fontSize: 17, color: C.ink }}>{q.question}</div>
      <MultipleChoice q={{ ...q, options: q.options, answer: q.answer }} value={value} setValue={setValue} phase={phase} />
    </div>
  );
}

// ---- True / False -----------------------------------------------------
function TrueFalse({ q, value, setValue, phase }) {
  const opts = [{ v: true, label: 'True', icon: 'check' }, { v: false, label: 'False', icon: 'x' }];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#fff', border: `2px solid ${C.line}`, borderRadius: 15,
        padding: '20px 18px', fontFamily: FSERIF, fontSize: 18, lineHeight: 1.5, color: C.ink, fontStyle: 'italic',
      }}>“{q.statement}”</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {opts.map(o => {
          let state = 'idle';
          if (phase === 'checked') {
            if (o.v === q.answer) state = 'correct';
            else if (o.v === value) state = 'wrong';
            else state = 'dim';
          } else if (o.v === value) state = 'selected';
          const m = { idle: C.line, selected: C.navySoft, correct: C.green, wrong: C.red, dim: C.lineSoft }[state];
          const fg = { idle: C.ink, selected: C.navyDeep, correct: C.greenDeep, wrong: C.redDeep, dim: C.mute }[state];
          const bg = { idle: '#fff', selected: C.navyWash, correct: C.greenWash, wrong: C.redWash, dim: '#fff' }[state];
          return (
            <Press as="div" key={o.label} onClick={() => phase === 'answering' && setValue(o.v)}
              style={{
                flex: 1, background: bg, ...bd3(m),
                borderRadius: 15, padding: '20px 0', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8, color: fg, fontWeight: 800, fontSize: 17,
              }}>
              <Icon name={o.icon} size={26} color={fg} stroke={3} />
              {o.label}
            </Press>
          );
        })}
      </div>
    </div>
  );
}

// ---- Fill in the blank (tap a word) ----------------------------------
function Blank({ q, value, setValue, phase }) {
  const chipState = (opt) => {
    if (phase === 'checked') {
      if (opt === q.answer) return 'correct';
      if (opt === value) return 'wrong';
      return 'dim';
    }
    return opt === value ? 'selected' : 'idle';
  };
  const blankColor = phase === 'checked'
    ? (value === q.answer ? C.green : C.red)
    : (value ? C.navySoft : C.mute);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        fontFamily: FSERIF, fontSize: 19, lineHeight: 1.7, color: C.ink,
        background: '#fff', border: `2px solid ${C.line}`, borderRadius: 15, padding: '18px 18px',
      }}>
        {q.before}{' '}
        <span style={{
          display: 'inline-flex', minWidth: 96, justifyContent: 'center',
          borderBottom: `3px solid ${blankColor}`, color: blankColor, fontWeight: 800,
          fontFamily: FUI, padding: '0 6px', verticalAlign: 'baseline',
        }}>{value || '\u00a0'}</span>
        {q.after}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {q.options.map((opt, i) => {
          const s = chipState(opt);
          const m = { idle: C.line, selected: C.navySoft, correct: C.green, wrong: C.red, dim: C.lineSoft }[s];
          const bg = { idle: '#fff', selected: C.navyWash, correct: C.greenWash, wrong: C.redWash, dim: '#faf7f1' }[s];
          const fg = { idle: C.ink, selected: C.navyDeep, correct: C.greenDeep, wrong: C.redDeep, dim: C.mute }[s];
          return (
            <Press as="div" key={i} onClick={() => phase === 'answering' && setValue(opt === value ? null : opt)}
              style={{
                background: bg, ...bd3(m), borderRadius: 13,
                padding: '11px 17px', fontWeight: 800, fontSize: 16, color: fg,
              }}>{opt}</Press>
          );
        })}
      </div>
    </div>
  );
}

// ---- Build the sentence (tap words) ----------------------------------
function TapWords({ q, value, setValue, phase }) {
  const bank = React.useMemo(() => {
    const all = [...q.answer, ...(q.bank || [])];
    // stable shuffle by hashing
    return all.map((w, i) => ({ w, k: w + '_' + i }))
      .sort((a, b) => (a.w.length * 7 + a.w.charCodeAt(0)) % 5 - (b.w.length * 7 + b.w.charCodeAt(0)) % 5);
  }, [q]);
  const used = value || [];
  const usedKeys = used.map(u => u.k);
  const correct = phase === 'checked' && grade(q, used.map(u => u.w)) ;

  const lineColor = phase !== 'checked' ? C.line : (JSON.stringify(used.map(u=>u.w)) === JSON.stringify(q.answer) ? C.green : C.red);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* answer tray */}
      <div style={{
        minHeight: 64, borderTop: `2px solid ${C.line}`, borderBottom: `2px solid ${lineColor}`,
        padding: '14px 4px', display: 'flex', flexWrap: 'wrap', gap: 9, alignContent: 'flex-start',
      }}>
        {used.map((u, i) => (
          <Press as="div" key={u.k} onClick={() => phase === 'answering' && setValue(used.filter(x => x.k !== u.k))}
            style={{
              background: '#fff', ...bd3(C.line, null, 2, 3), borderRadius: 12,
              padding: '9px 14px', fontWeight: 700, fontSize: 16, color: C.ink,
            }}>{u.w}</Press>
        ))}
      </div>
      {/* word bank */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
        {bank.map(b => {
          const isUsed = usedKeys.includes(b.k);
          return (
            <Press as="div" key={b.k} disabled={isUsed || phase === 'checked'}
              onClick={() => phase === 'answering' && !isUsed && setValue([...used, b])}
              style={{
                background: isUsed ? C.lockedBg : '#fff', ...bd3(isUsed ? C.lineSoft : C.line, null, 2, isUsed ? 2 : 4),
                borderRadius: 12, padding: '10px 15px',
                fontWeight: 700, fontSize: 16, color: isUsed ? 'transparent' : C.ink,
                visibility: isUsed ? 'hidden' : 'visible',
              }}>{b.w}</Press>
          );
        })}
      </div>
    </div>
  );
}

// ---- Type the answer --------------------------------------------------
function TypeAnswer({ q, value, setValue, phase }) {
  const ok = phase === 'checked' && grade(q, value);
  const bd = phase !== 'checked' ? (value ? C.navySoft : C.line) : (ok ? C.green : C.red);
  const ref = React.useRef(null);
  React.useEffect(() => { if (phase === 'answering' && ref.current) ref.current.focus(); }, [phase, q]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <input
        ref={ref} value={value || ''} disabled={phase === 'checked'}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your answer…"
        style={{
          width: '100%', boxSizing: 'border-box', background: '#fff',
          ...bd3(bd), borderRadius: 15,
          padding: '17px 18px', fontFamily: FUI, fontSize: 18, fontWeight: 700,
          color: ok ? C.greenDeep : C.ink, outline: 'none',
        }}
      />
      {phase === 'checked' && !ok && (
        <div style={{ fontSize: 15, color: C.redDeep, fontWeight: 700 }}>
          Answer: <span style={{ color: C.greenDeep }}>{q.answer}</span>
        </div>
      )}
    </div>
  );
}

// ---- Match the pairs (live, self-resolving) --------------------------
function MatchPairs({ q, value, setValue, phase, onResolved, onMiss }) {
  const left = React.useMemo(() => q.pairs.map((p, i) => ({ id: 'L' + i, text: p.a, key: i })), [q]);
  const right = React.useMemo(() => q.pairs
    .map((p, i) => ({ id: 'R' + i, text: p.b, key: i }))
    .sort((a, b) => (a.text.length % 3) - (b.text.length % 3) || a.text.localeCompare(b.text)), [q]);
  const [sel, setSel] = React.useState(null); // selected left key
  const [flash, setFlash] = React.useState(null); // {side,key,bad}
  const locked = (value && value.locked) || {};

  function tapLeft(k) {
    if (locked[k] || phase === 'checked') return;
    setSel(sel === k ? null : k);
  }
  function tapRight(k) {
    if (Object.values(locked).includes(k) || phase === 'checked') return;
    if (sel === null) { setFlash({ side: 'R', key: k, bad: true }); setTimeout(() => setFlash(null), 350); return; }
    if (sel === k) {
      const nl = { ...locked, [sel]: k };
      setValue({ ...value, locked: nl });
      setSel(null);
      if (Object.keys(nl).length === q.pairs.length) setTimeout(() => onResolved(), 350);
    } else {
      setFlash({ side: 'R', key: k, bad: true });
      onMiss && onMiss();
      setTimeout(() => { setFlash(null); setSel(null); }, 450);
    }
  }
  const cell = (item, side, isSel, isLocked, isFlash) => {
    const bd = isLocked ? C.green : isFlash ? C.red : isSel ? C.navySoft : C.line;
    const bg = isLocked ? C.greenWash : isFlash ? C.redWash : isSel ? C.navyWash : '#fff';
    const fg = isLocked ? C.green : isFlash ? C.redDeep : isSel ? C.navyDeep : C.ink;
    return (
      <Press as="div" key={item.id}
        onClick={() => side === 'L' ? tapLeft(item.key) : tapRight(item.key)}
        disabled={isLocked}
        style={{
          background: bg, ...bd3(bd), borderRadius: 13,
          padding: '13px 13px', fontWeight: 700, fontSize: 14.5, color: fg, lineHeight: 1.3,
          minHeight: 62, display: 'flex', alignItems: 'center',
          opacity: isLocked ? 0.55 : 1, transition: 'opacity .2s',
        }}>{item.text}</Press>
    );
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {left.map(it => cell(it, 'L', sel === it.key, !!locked[it.key], false))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {right.map(it => cell(it, 'R', false, Object.values(locked).includes(it.key),
          flash && flash.side === 'R' && flash.key === it.key))}
      </div>
    </div>
  );
}

// ---- dispatcher -------------------------------------------------------
function QuestionView(props) {
  switch (props.q.type) {
    case 'mc': return <MultipleChoice {...props} />;
    case 'passage': return <Passage {...props} />;
    case 'truefalse': return <TrueFalse {...props} />;
    case 'blank': return <Blank {...props} />;
    case 'tapwords': return <TapWords {...props} />;
    case 'type': return <TypeAnswer {...props} />;
    case 'match': return <MatchPairs {...props} />;
    default: return null;
  }
}

const PROMPTS = {
  mc: 'Choose the right answer', passage: 'Read, then answer',
  truefalse: 'True or false?', blank: 'Fill in the blank',
  tapwords: 'Build the sentence', type: 'Type what belongs in the blank',
  match: 'Match the pairs',
};
window.QUESTION_PROMPTS = PROMPTS;

Object.assign(window, { QuestionView, OptionCard, MatchPairs });
