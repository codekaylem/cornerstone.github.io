/* Cornerstone — account / sign-in. A bottom sheet that offers Google and
   Facebook sign-in (mocked for the prototype) and the small provider marks. */

function GoogleMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.3 6.6v5.5h7C42.6 36.8 45.1 31.2 45.1 24.5z"/>
      <path fill="#34A853" d="M24 46c5.8 0 10.7-1.9 14.3-5.2l-7-5.5c-1.9 1.3-4.4 2.1-7.3 2.1-5.6 0-10.4-3.8-12.1-8.9H4.7v5.7C8.3 41.3 15.6 46 24 46z"/>
      <path fill="#FBBC05" d="M11.9 28.5c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.7H4.7C3.2 17.5 2.4 20.6 2.4 24s.8 6.5 2.3 9.4l7.2-4.9z"/>
      <path fill="#EA4335" d="M24 11.1c3.2 0 6 1.1 8.2 3.2l6.1-6.1C34.7 4.7 29.8 2.7 24 2.7 15.6 2.7 8.3 7.4 4.7 14.6l7.2 5.7c1.7-5.1 6.5-9.2 12.1-9.2z"/>
    </svg>
  );
}

function FacebookMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#1877F2" d="M44 24C44 12.95 35.05 4 24 4S4 12.95 4 24c0 9.98 7.31 18.25 16.86 19.76V29.78h-5.08V24h5.08v-4.4c0-5.02 2.99-7.79 7.56-7.79 2.19 0 4.48.39 4.48.39v4.92h-2.52c-2.49 0-3.26 1.54-3.26 3.13V24h5.55l-.89 5.78h-4.66v13.98C36.69 42.25 44 33.98 44 24z"/>
      <path fill="#fff" d="M31.78 29.78 32.67 24h-5.55v-3.75c0-1.59.77-3.13 3.26-3.13h2.52v-4.92s-2.29-.39-4.48-.39c-4.57 0-7.56 2.77-7.56 7.79V24h-5.08v5.78h5.08v13.98a20.2 20.2 0 0 0 6.28 0V29.78h4.66z"/>
    </svg>
  );
}
window.GoogleMark = GoogleMark; window.FacebookMark = FacebookMark;

// the simulated accounts each provider "returns"
const MOCK_ACCOUNTS = {
  google: { provider: 'google', label: 'Google', name: 'Grace Bennett', email: 'grace.bennett@gmail.com' },
  facebook: { provider: 'facebook', label: 'Facebook', name: 'Grace Bennett', email: 'grace.b@facebook.com' },
};
window.MOCK_ACCOUNTS = MOCK_ACCOUNTS;

function ProviderButton({ provider, busy, anyBusy, onClick }) {
  const Mark = provider === 'google' ? GoogleMark : FacebookMark;
  const label = provider === 'google' ? 'Google' : 'Facebook';
  return (
    <Press onClick={onClick} disabled={anyBusy} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      background: '#fff', border: `2px solid ${C.line}`, borderRadius: 14, padding: '14px 18px',
      opacity: anyBusy && !busy ? .5 : 1,
    }}>
      {busy
        ? <span style={{ width: 20, height: 20, borderRadius: 999, border: `2.5px solid ${C.line}`, borderTopColor: C.navy, display: 'inline-block', animation: 'spin .7s linear infinite' }} />
        : <Mark size={22} />}
      <span style={{ fontWeight: 800, fontSize: 15.5, color: C.ink }}>
        {busy ? 'Connecting…' : `Continue with ${label}`}
      </span>
    </Press>
  );
}

function SignInSheet({ open, onClose, onSignIn }) {
  const [busy, setBusy] = React.useState(null);
  if (!open) return null;

  function go(provider) {
    if (busy) return;
    setBusy(provider);
    setTimeout(() => { onSignIn(MOCK_ACCOUNTS[provider]); setBusy(null); }, 950);
  }

  return (
    <div onClick={() => !busy && onClose()} style={{
      position: 'absolute', inset: 0, zIndex: 96, background: 'rgba(20,25,35,.5)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: C.bg, borderRadius: '26px 26px 0 0', padding: '10px 22px 34px',
        animation: 'sheetup .28s cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9, background: C.line, margin: '0 auto 18px' }} />
        <div style={{
          width: 58, height: 58, borderRadius: 17, margin: '4px auto 14px',
          background: `linear-gradient(135deg, ${C.navySoft}, ${C.navyDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 28, fontFamily: FSERIF,
          boxShadow: `0 5px 14px ${C.navy}40`,
        }}>C</div>
        <h2 style={{ margin: '0 0 6px', fontSize: 23, fontWeight: 900, color: C.navyDeep, textAlign: 'center', letterSpacing: -.3 }}>Save your progress</h2>
        <p style={{ margin: '0 auto 22px', fontSize: 14.5, fontWeight: 600, color: C.sub, textAlign: 'center', lineHeight: 1.55, maxWidth: 300 }}>
          Sign in to sync your streak, hearts, and place in the Confession across devices.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <ProviderButton provider="google" busy={busy === 'google'} anyBusy={!!busy} onClick={() => go('google')} />
          <ProviderButton provider="facebook" busy={busy === 'facebook'} anyBusy={!!busy} onClick={() => go('facebook')} />
        </div>

        <p style={{ margin: '20px auto 0', fontSize: 11.5, fontWeight: 600, color: C.mute, textAlign: 'center', lineHeight: 1.6, maxWidth: 280 }}>
          By continuing you agree to the Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { SignInSheet, ProviderButton });
