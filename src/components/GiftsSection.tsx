import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { GiftProgress } from '../types';
import GiftCard from './GiftCard';
import GiftEditor from './GiftEditor';

export default function GiftsSection() {
  const { profile } = useAuth();
  const isAdmin = profile?.is_admin ?? false;

  const [gifts, setGifts] = useState<GiftProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [editor, setEditor] = useState<{ gift?: GiftProgress } | null>(null);

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

  async function handleDelete(gift: GiftProgress) {
    if (!confirm(`Excluir "${gift.title}" da lista?`)) return;
    const { error } = await supabase.from('gifts').delete().eq('id', gift.id);
    if (error) {
      alert(`Não foi possível excluir: ${error.message}`);
      return;
    }
    load();
  }

  const categories = useMemo(
    () => ['Todos', ...Array.from(new Set(gifts.map((g) => g.category)))],
    [gifts],
  );
  const visible = gifts.filter((g) => filter === 'Todos' || g.category === filter);

  return (
    <section id="presentes" className="scroll-mt-20 bg-cream px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h2 className="font-script text-3xl text-champagne sm:text-4xl">Lista de Presentes</h2>
          <h3 className="mt-1 font-serif text-2xl text-espresso sm:text-3xl">Celebre Conosco</h3>
          <div className="mx-auto my-4 flex items-center justify-center gap-3 text-champagne">
            <span className="h-px w-10 bg-champagne/40" />♥<span className="h-px w-10 bg-champagne/40" />
          </div>
          <p className="mx-auto max-w-xl text-sm text-espresso/60">
            Sua presença já é o melhor presente. Mas se desejar nos presentear,
            separamos algumas sugestões com muito carinho.
          </p>
        </header>

        {isAdmin && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={() => setEditor({})}
              className="rounded-lg bg-cocoa px-5 py-2 text-sm font-medium text-cream hover:bg-espresso"
            >
              ＋ Adicionar presente
            </button>
          </div>
        )}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded border px-3 py-1.5 text-sm sm:px-4 ${
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
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {visible.map((g) => (
              <GiftCard
                key={g.id}
                gift={g}
                onContributed={load}
                isAdmin={isAdmin}
                onEdit={() => setEditor({ gift: g })}
                onDelete={() => handleDelete(g)}
              />
            ))}
          </div>
        )}
      </div>

      {editor && (
        <GiftEditor
          gift={editor.gift}
          onClose={() => setEditor(null)}
          onSaved={() => {
            setEditor(null);
            load();
          }}
        />
      )}
    </section>
  );
}
