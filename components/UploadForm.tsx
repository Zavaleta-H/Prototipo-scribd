import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(r => setUser(r.data?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.data?.subscription?.unsubscribe();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return alert('Seleccione archivo y título.');
    if (!user) return alert('Inicia sesión primero (página /auth).');

    setStatus('Subiendo...');
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('documents').upload(filePath, file, { cacheControl: '3600', upsert: false });
    if (error) { setStatus('Error subiendo'); console.error(error); return; }

    // call server API to register document metadata (server will use service role)
    const resp = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        author_text: '',
        description: '',
        language: 'es',
        storage_path: filePath,
        mime: file.type || 'application/pdf',
        owner_id: user.id
      })
    });
    if (!resp.ok) { setStatus('Error guardando metadatos'); const txt = await resp.text(); console.error(txt); return; }

    setStatus('Subido correctamente.');
    setFile(null); setTitle('');
  }

  return (
    <form onSubmit={handleUpload} style={{ border: '1px solid #eee', padding: 12, maxWidth: 600 }}>
      <div><label>Título</label><br /><input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} /></div>
      <div style={{ marginTop: 8 }}><label>Archivo (PDF)</label><br /><input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} /></div>
      <div style={{ marginTop: 8 }}><button type="submit">Subir (Requiere login)</button></div>
      <div style={{ marginTop: 8 }}>{status}</div>
      <div style={{ marginTop: 8 }}>{user ? <div>Sesión: {user.email}</div> : <div>No logueado — <a href="/auth">Entrar / Registrarse</a></div>}</div>
    </form>
  );
}
