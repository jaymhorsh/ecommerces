import Link from 'next/link';

export function Footer() {
  return (
    <footer className="p-sides py-8 mt-12">
      <div className="w-full p-6 md:p-8 bg-foreground rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-2xl md:text-3xl font-bold text-background tracking-tight">
          Store404
        </Link>
        <p className="text-sm text-background/70">{new Date().getFullYear()} © Store404 — All rights reserved</p>
      </div>
    </footer>
  );
}
