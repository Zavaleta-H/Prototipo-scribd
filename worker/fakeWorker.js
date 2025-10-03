/*
Fake worker: mark processing uploads as ready.
Run manually:
SUPABASE_URL=https://<project>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<key> node worker/fakeWorker.js
*/
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function markReady() {
  const { data, error } = await supabase.from('uploads').select('*').eq('status', 'processing').limit(50);
  if (error) return console.error(error);
  for (const u of data) {
    await supabase.from('uploads').update({ status: 'ready' }).eq('id', u.id);
    console.log('Marked ready', u.id);
  }
}
markReady().then(()=>process.exit()).catch(e=>{console.error(e);process.exit(1)});
