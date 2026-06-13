import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-champagne/20 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-script text-2xl text-champagne">
          Ana &amp; Carlos
        </Link>
        <div className="flex items-center gap-4 text-sm text-cocoa">
          <Link to="/" className="hover:text-espresso">
            Início
          </Link>
          <Link to="/presentes" className="hover:text-espresso">
            Presentes
          </Link>
          <span className="hidden sm:inline">
            Olá, {profile?.full_name?.split(' ')[0] ?? 'Convidado'}
          </span>
          <button onClick={signOut} className="hover:text-espresso">
            Sair ↩
          </button>
        </div>
      </nav>
    </header>
  );
}
