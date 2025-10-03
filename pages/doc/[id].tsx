import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('../../components/PDFViewer'), { ssr: false });

export default function DocPage() {
  const r = useRouter();
  const { id } = r.query;
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const { data } = await supabase.from('documents').select('*').eq('id', id).single();
      setDoc(data || null);
    }
    load();
  }, [id]);

  if (!doc) return <div style={{ padding: 24 }}>Cargando...</div>;

  const publicUrl = supabase.storage.from('documents').getPublicUrl(doc.storage_path).publicURL;

  return (
    <div style={{ padding: 24 }}>
      <h2>{doc.title}</h2>
      <p><strong>Autor:</strong> {doc.author_text}</p>
      <div style={{ border: '1px solid #ddd', padding: 12 }}>
        <PDFViewer url={publicUrl} />
      </div>
    </div>
  );
}
