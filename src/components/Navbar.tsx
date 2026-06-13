import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-champagne/20 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:px-4">
        <Link to="/" className="shrink-0 font-script text-xl text-champagne sm:text-2xl">
          Ana &amp; Carlos
        </Link>
        <div className="flex items-center gap-3 text-xs text-cocoa sm:gap-4 sm:text-sm">
          <Link to="/" className="hover:text-espresso">
            Início
          </Link>
          <Link to="/presentes" className="hover:text-espresso">
            Presentes
          </Link>
          <span className="hidden md:inline">
            Olá, {profile?.full_name?.split(' ')[0] ?? 'Convidado'}
          </span>
          <button onClick={signOut} className="shrink-0 hover:text-espresso">
            Sair ↩
          </button>
        </div>
      </nav>
    </header>
  );
}
