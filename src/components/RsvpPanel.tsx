import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface CompRow {
  id?: string;
  full_name: string;
  attending: boolean;
}

/**
 * Painel de RSVP do convidado: confirma a própria presença e gerencia
 * os acompanhantes (adicionar, editar nome, marcar vai/não vai, remover).
 * Tudo protegido por RLS (cada um só altera os próprios registros).
 */
export default function RsvpPanel({ onClose }: { onClose: () => void }) {
  const { session, profile, refreshProfile } = useAuth();
  const [attending, setAttending] = useState<boolean | null>(profile?.attending ?? null);
  const [comps, setComps] = useState<CompRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    supabase
      .from('companions')
      .select('id, full_name, attending')
      .eq('profile_id', session.user.id)
      .order('created_at')
      .then(({ data }) => {
        setComps((data as CompRow[]) ?? []);
        setLoading(false);
      });
  }, [session]);

  function addComp() {
    setComps((c) => [...c, { full_name: '', attending: true }]);
  }
  function updateComp(i: number, patch: Partial<CompRow>) {
    setComps((c) => c.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }
  function removeComp(i: number) {
    setComps((c) => c.filter((_, idx) => idx !== i));
  }

  async function save() {
    if (!session?.user) return;
    setBusy(true);
    setError(null);
    const uid = session.user.id;

    // 1) presença do convidado
    const up = await supabase.from('profiles').update({ attending }).eq('id', uid);
    if (up.error) {
      setBusy(false);
      setError(up.error.message);
      return;
    }

    // 2) substitui a lista de acompanhantes (apaga e reinsere os preenchidos)
    const del = await supabase.from('companions').delete().eq('profile_id', uid);
    if (del.error) {
      setBusy(false);
      setError(del.error.message);
      return;
    }
    const rows = comps
      .filter((c) => c.full_name.trim())
      .map((c) => ({ profile_id: uid, full_name: c.full_name.trim(), attending: c.attending }));
    if (rows.length > 0) {
      const ins = await supabase.from('companions').insert(rows);
      if (ins.error) {
        setBusy(false);
        setError(ins.error.message);
        return;
      }
    }

    await refreshProfile();
    setBusy(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-cream p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-2xl text-espresso">Confirmar Presença</h3>
          <button onClick={onClose} className="text-cocoa hover:text-espresso" aria-label="Fechar">
            ✕
          </button>
        </div>

        {/* Presença do convidado */}
        <p className="text-sm text-espresso/70">Você vai comparecer?</p>
        <div className="mt-2 flex gap-2">
          <Toggle active={attending === true} onClick={() => setAttending(true)} kind="yes">
            ✓ Eu vou
          </Toggle>
          <Toggle active={attending === false} onClick={() => setAttending(false)} kind="no">
            ✕ Não vou
          </Toggle>
        </div>

        {/* Acompanhantes */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-espresso">Acompanhantes</span>
          <button
            onClick={addComp}
            className="rounded border border-champagne/40 px-2 py-1 text-xs text-cocoa hover:bg-sand"
          >
            + Adicionar
          </button>
        </div>

        {loading ? (
          <p className="mt-3 text-xs text-espresso/50">Carregando…</p>
        ) : comps.length === 0 ? (
          <p className="mt-3 text-xs text-espresso/50">
            Nenhum acompanhante. Clique em “Adicionar” para incluir +1, +2…
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {comps.map((c, i) => (
              <div key={c.id ?? i} className="flex items-center gap-2">
                <span className="w-7 shrink-0 text-xs text-cocoa">+{i + 1}</span>
                <input
                  value={c.full_name}
                  onChange={(e) => updateComp(i, { full_name: e.target.value })}
                  placeholder={`Nome do acompanhante ${i + 1}`}
                  className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-sm text-espresso outline-none focus:border-champagne"
                />
                <button
                  type="button"
                  onClick={() => updateComp(i, { attending: !c.attending })}
                  className={`shrink-0 rounded border px-2 py-2 text-xs ${
                    c.attending
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-champagne/40 text-espresso/50'
                  }`}
                  title="Marcar se este acompanhante vai"
                >
                  {c.attending ? 'Vai' : 'Não vai'}
                </button>
                <button
                  type="button"
                  onClick={() => removeComp(i)}
                  className="shrink-0 rounded border border-red-300 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                  aria-label="Remover"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={save}
          disabled={busy || attending === null}
          className="mt-6 w-full rounded-lg bg-cocoa py-3 text-sm font-medium uppercase tracking-widest text-cream transition hover:bg-espresso disabled:opacity-60"
        >
          {busy ? 'Salvando…' : 'Salvar confirmação'}
        </button>
        {attending === null && (
          <p className="mt-2 text-center text-[11px] text-cocoa/70">
            Escolha “Eu vou” ou “Não vou” para salvar.
          </p>
        )}
      </div>
    </div>
  );
}

function Toggle({
  active,
  onClick,
  kind,
  children,
}: {
  active: boolean;
  onClick: () => void;
  kind: 'yes' | 'no';
  children: React.ReactNode;
}) {
  const activeCls =
    kind === 'yes' ? 'border-green-400 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-600';
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
        active ? activeCls : 'border-champagne/40 text-espresso'
      }`}
    >
      {children}
    </button>
  );
}
