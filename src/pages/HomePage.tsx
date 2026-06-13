import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { profile } = useAuth();
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <section className="bg-sand px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-cocoa">O Grande Dia</p>
        <h1 className="mt-4 font-script text-6xl text-espresso">Ana &amp; Carlos</h1>
        <p className="mt-4 text-cocoa">14 de Setembro de 2025 · São Paulo, Brasil</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-espresso">
          <span className="rounded border border-champagne/40 px-4 py-2">📅 14 Set 2025</span>
          <span className="rounded border border-champagne/40 px-4 py-2">🕔 17h00</span>
          <span className="rounded border border-champagne/40 px-4 py-2">📍 Quinta dos Ipês</span>
        </div>

        {profile?.bringing_guest && profile.guest_name && (
          <p className="mt-6 text-sm text-cocoa">
            Acompanhante confirmado: <strong>{profile.guest_name}</strong>
          </p>
        )}

        <Link
          to="/presentes"
          className="mt-10 inline-block rounded-lg bg-cocoa px-6 py-3 text-sm uppercase tracking-widest text-cream hover:bg-espresso"
        >
          Ver lista de presentes
        </Link>
      </section>
    </div>
  );
}
