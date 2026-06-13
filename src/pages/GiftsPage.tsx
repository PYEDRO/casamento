import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GiftProgress } from '../types';
import GiftCard from '../components/GiftCard';
import Navbar from '../components/Navbar';

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('gift_progress')
      .select('*')
      .order('sort_order');
    if (!error && data) setGifts(data as GiftProgress[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(gifts.map((g) => g.category)))],
    [gifts],
  );
  const visible = gifts.filter((g) => filter === 'Todos' || g.category === filter);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-10 text-center">
          <h2 className="font-script text-4xl text-champagne">Lista de Presentes</h2>
          <h1 className="mt-1 font-serif text-3xl text-espresso">Celebre Conosco</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-espresso/60">
            Sua presença já é o melhor presente. Mas se desejar nos presentear,
            separamos algumas sugestões com muito carinho.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded border px-4 py-1.5 text-sm ${
                filter === c
                  ? 'border-cocoa bg-cocoa text-cream'
                  : 'border-champagne/40 text-espresso'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-cocoa">Carregando presentes…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((g) => (
              <GiftCard key={g.id} gift={g} onContributed={load} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
