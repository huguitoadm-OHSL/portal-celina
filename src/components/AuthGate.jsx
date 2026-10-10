import { useEffect, useState } from 'react';

export default function AuthGate({ children }) {
  const [access, setAccess] = useState('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth', { credentials: 'same-origin', cache: 'no-store', signal: controller.signal })
      .then(async response => { const data = await response.json(); setAccess(response.ok && data.authorized === true ? 'allowed' : 'signed-out'); })
      .catch(() => { if (!controller.signal.aborted) setAccess('signed-out'); });
    return () => controller.abort();
  }, []);
  async function login(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', password }) });
      setPassword('');
      const data = await response.json();
      if (!response.ok || data.authorized !== true) throw new Error(data.error || 'No se pudo ingresar.');
      setAccess('allowed');
    } catch (failure) { setError(failure.message || 'No se pudo conectar. Intenta nuevamente.'); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (review) { setReview(false); return; }
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
      if (!response.ok) throw new Error('No se pudo cerrar la sesión. Intenta nuevamente.');
      window.location.replace('/');
    } catch (failure) { setError(failure.message); setBusy(false); }
  }
  if (access === 'allowed' || (import.meta.env.DEV && review)) return <><div className="session-bar"><span>{review ? 'Vista de revisión local' : 'Portal Celina · Acceso personal'}</span><button disabled={busy} onClick={logout}>Cerrar sesión</button></div>{error && <p role="alert">{error}</p>}{children}</>;
  return <div className="login-shell"><section className="login-card"><div className="brand-mark">C</div><p className="eyebrow">CELINA · GESTIÓN COMERCIAL</p><h1>Bienvenido al portal</h1><p>Tu espacio de gestión. Ingresa con tu contraseña para continuar.</p>{access === 'loading' ? <p role="status">Verificando sesión…</p> : <form onSubmit={login}><label>Contraseña<input type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={event => setPassword(event.target.value)}/></label><button className="primary-button" disabled={busy}>{busy ? 'Verificando…' : 'Ingresar'}</button></form>}{error && <p role="alert">{error}</p>}{import.meta.env.DEV && <button className="review-button" onClick={() => setReview(true)}>Vista de revisión local</button>}<small>Portal Celina V4.0 · Acceso personal</small></section></div>;
}
