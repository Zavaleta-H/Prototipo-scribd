import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { title, author_text, description, language, storage_path, mime, owner_id } = req.body;
  if (!title || !storage_path) return res.status(400).json({ error: 'Missing fields' });

  try {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title,
        author_text,
        description,
        language,
        storage_path,
        mime,
        owner_id
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    // create an upload row
    await supabase.from('uploads').insert({ document_id: data.id, original_filename: storage_path.split('/').pop(), size_bytes: 0, status: 'ready' });
    return res.status(201).json({ document: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
