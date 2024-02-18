import ThemeToggle from '@/components/theme-toggle';
import Link from 'next/link';
export default function LandingPage() {
  return (
    <main>
      <h2>Welcome to Crates</h2>
      <Link href="/login">Go to a\pp</Link>
    </main>
  );
}
