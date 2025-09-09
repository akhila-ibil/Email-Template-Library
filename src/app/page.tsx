import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Email Template Editor</h1>
      <p>Build email content with + buttons.</p>
      <Link href="/editor">Open Editor →</Link>
    </main>
  );
}
