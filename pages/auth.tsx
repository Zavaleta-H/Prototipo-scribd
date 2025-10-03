import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in'|'sign-up'>('sign-in');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(r => setUser(r.data?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'sign-up') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) return alert('Error: ' + error.message);
      alert('Revisa tu correo para verificar la cuenta.');
      setMode('sign-in');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert('Error: ' + error.message);
      router.push('/');
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>{mode === 'sign-in' ? 'Iniciar sesión' : 'Registrarse'}</h2>
      <form onSubmit={handleSubmit}>
        <div><input type="email" placeholder="correo" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}><input type="password" placeholder="contraseña" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}><button type="submit">{mode === 'sign-in' ? 'Entrar' : 'Registrarse'}</button></div>
      </form>
      <div style={{ marginTop: 8 }}><button onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>{mode === 'sign-in' ? 'Quiero crear cuenta' : 'Ya tengo cuenta'}</button></div>
      <div style={{ marginTop: 12 }}>{user ? <div>Usuario: {user.email} <button onClick={signOut}>Salir</button></div> : null}</div>
    </div>
  );
}
