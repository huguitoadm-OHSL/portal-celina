import { isAuthorizedClaims } from '../services/authorization';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, getIdTokenResult } from 'firebase/auth';
import { auth } from '../firebase';

export default function AuthGate({ children }) {
  const [access, setAccess] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => onAuthStateChanged(auth, async user => {
    if (!user) { setAccess('signed-out'); return; }
    try {
      const { claims } = await getIdTokenResult(user, true);
      setAccess(isAuthorizedClaims(claims) ? 'allowed' : 'denied');
    } catch { setAccess('signed-out'); setError('No se pudo verificar el acceso. Intente nuevamente.'); }
  }), []);
  async function login(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { await signInWithEmailAndPassword(auth, email.trim(), password); setPassword(''); }
    catch { setError('No se pudo iniciar sesión. Verifique sus credenciales y la habilitación de su cuenta con el administrador.'); }
    finally { setBusy(false); }
  }
  if (access === 'allowed' || (import.meta.env.DEV && review)) return <><div className="session-bar"><span>{review ? 'Vista de revisión local' : email || auth.currentUser?.email}</span><button onClick={() => { setReview(false); signOut(auth).catch(() => setError('No se pudo cerrar la sesión.')); }}>Cerrar sesión</button></div>{children}</>;
  return <div className="login-shell"><section className="login-card"><div className="brand-mark">C</div><p className="eyebrow">CELINA · GESTIÓN COMERCIAL</p><h1>Bienvenido al portal</h1><p>Acceso exclusivo para el equipo autorizado.</p>{access === 'loading' ? <p role="status">Verificando sesión…</p> : <form onSubmit={login}><label>Correo corporativo<input type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)}/></label><label>Contraseña<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/></label><button className="primary-button" disabled={busy}>{busy ? 'Verificando…' : 'Ingresar'}</button></form>}{access === 'denied' && <p role="alert">Su cuenta no tiene permiso para acceder al portal. Solicite la habilitación al administrador.</p>}{error && <p role="alert">{error}</p>}{import.meta.env.DEV && <button className="review-button" onClick={() => setReview(true)}>Vista de revisión local</button>}<small>Portal Celina V4.0</small></section></div>;
}
