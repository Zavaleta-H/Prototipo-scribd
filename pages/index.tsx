import Head from 'next/head';
import Link from 'next/link';
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <Head><title>Prototipo Scribd - MVP</title></Head>
      <h1>Prototipo Scribd - MVP</h1>
      <p>Sube un PDF y visualízalo en la página de documento.</p>
      <UploadForm />
      <p style={{ marginTop: 24 }}><Link href="/explore">Ir a Explorar</Link></p>
      <p><Link href="/auth">Entrar / Registrarse</Link></p>
    </div>
  )
}
