import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import type { GiftProgress } from '../types';

interface Props {
  /** Presente a editar; ausente = criar novo. */
  gift?: GiftProgress | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['Lar & Conforto', 'Cozinha', 'Experiências', 'Decoração'];

/**
 * Formulário de administração de um item da lista de presentes.
 * Insert/Update protegidos pela RLS (policies gifts_*_admin): só passa
 * se o usuário atual tiver profiles.is_admin = true.
 */
export default function GiftEditor({ gift, onClose, onSaved }: Props) {
  const editing = Boolean(gift);
  const [category, setCategory] = useState(gift?.category ?? CATEGORIES[0]);
  const [title, setTitle] = useState(gift?.title ?? '');
  const [description, setDescription] = useState(gift?.description ?? '');
  const [icon, setIcon] = useState(gift?.icon ?? '🎁');
  const [target, setTarget] = useState<number>(gift?.target_amount ?? 0);
  const [sortOrder, setSortOrder] = useState<number>(gift?.sort_order ?? 99);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError('Informe o título do presente.');
    if (target <= 0) return setError('O valor-alvo deve ser maior que zero.');

    setBusy(true);
    const row = {
      category,
      title: title.trim(),
      description: description.trim() || null,
      icon,
      target_amount: target,
      sort_order: sortOrder,
    };
    const { error: err } = editing
      ? await supabase.from('gifts').update(row).eq('id', gift!.id)
      : await supabase.from('gifts').insert(row);
    setBusy(false);

    if (err) return setError(err.message);
    onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-cream p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl text-espresso">
            {editing ? 'Editar presente' : 'Adicionar presente'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-cocoa hover:text-espresso"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Categoria">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <div className="flex gap-3">
            <div className="w-20">
              <Field label="Ícone">
                <input
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                  className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-center text-espresso outline-none focus:border-champagne"
                />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Título">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
                />
              </Field>
            </div>
          </div>

          <Field label="Descrição">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
            />
          </Field>

          <div className="flex gap-3">
            <div className="flex-1">
              <Field label="Valor-alvo (R$)">
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
                />
              </Field>
            </div>
            <div className="w-28">
              <Field label="Ordem">
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
                />
              </Field>
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-lg bg-cocoa py-3 text-sm font-medium uppercase tracking-widest text-cream transition hover:bg-espresso disabled:opacity-60"
        >
          {busy ? 'Salvando…' : editing ? 'Salvar alterações' : 'Adicionar à lista'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-cocoa">
        {label}
      </span>
      {children}
    </label>
  );
}
