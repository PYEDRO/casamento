import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { COUPLE } from '../data/site';

const LINKS = [
  { href: '#historia', label: 'Nossa História' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#presentes', label: 'Presentes' },
  { href: '#cerimonia', label: 'Cerimônia' },
];

export default function SiteNavbar() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Convidado';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors ${
        scrolled ? 'bg-cream/95 shadow-sm backdrop-blur' : 'bg-cream/80 backdrop-blur'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <a href="#top" className="shrink-0 font-script text-2xl text-champagne">
          {COUPLE.names}
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-widest text-espresso/80 hover:text-champagne"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 text-sm text-cocoa md:flex">
          <span>Olá, {firstName}</span>
          <button onClick={signOut} className="hover:text-espresso">
            Sair ↩
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-cocoa md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-champagne/20 bg-cream/95 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm uppercase tracking-widest text-espresso/80"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center justify-between border-t border-champagne/20 pt-3 text-sm text-cocoa">
              <span>Olá, {firstName}</span>
              <button onClick={signOut}>Sair ↩</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
