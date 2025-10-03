import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Explore() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(50);
      setDocs(data || []);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Explorar documentos</h2>
      <ul>
        {docs.map(d => (
          <li key={d.id}><Link href={`/doc/${d.id}`}>{d.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}
