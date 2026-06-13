import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { GiftProgress } from '../types';

interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
}
interface CompanionRow {
  profile_id: string;
  full_name: string;
}
interface ContributionRow {
  id: string;
  contributor_name: string | null;
  amount: number;
  status: string;
  created_at: string;
  gifts: { title: string } | null;
}

const fmt = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AdminDashboard() {
  const { profile, loading, signOut } = useAuth();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [companions, setCompanions] = useState<CompanionRow[]>([]);
  const [gifts, setGifts] = useState<GiftProgress[]>([]);
  const [contribs, setContribs] = useState<ContributionRow[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!profile?.is_admin) return;
    (async () => {
      const [p, c, g, ct] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').order('full_name'),
        supabase.from('companions').select('profile_id, full_name'),
        supabase.from('gift_progress').select('*').order('sort_order'),
        supabase
          .from('contributions')
          .select('id, contributor_name, amount, status, created_at, gifts(title)')
          .order('created_at', { ascending: false }),
      ]);
      if (p.data) setProfiles(p.data as ProfileRow[]);
      if (c.data) setCompanions(c.data as CompanionRow[]);
      if (g.data) setGifts(g.data as GiftProgress[]);
      if (ct.data) setContribs(ct.data as unknown as ContributionRow[]);
      setBusy(false);
    })();
  }, [profile]);

  const companionsByProfile = useMemo(() => {
    const m = new Map<string, string[]>();
    companions.forEach((c) => {
      const arr = m.get(c.profile_id) ?? [];
      arr.push(c.full_name);
      m.set(c.profile_id, arr);
    });
    return m;
  }, [companions]);

  const kpis = useMemo(() => {
    const confirmados = profiles.length;
    const acompanhantes = companions.length;
    const arrecadado = gifts.reduce((s, g) => s + Number(g.raised_amount), 0);
    const meta = gifts.reduce((s, g) => s + Number(g.target_amount), 0);
    return { confirmados, acompanhantes, total: confirmados + acompanhantes, arrecadado, meta };
  }, [profiles, companions, gifts]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-cocoa">
        Carregando…
      </div>
    );
  }
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-champagne/20 bg-cream/95 px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="font-script text-2xl text-champagne">Painel dos Noivos</h1>
          <div className="flex items-center gap-4 text-sm text-cocoa">
            <Link to="/" className="hover:text-espresso">
              ← Ver site
            </Link>
            <button onClick={signOut} className="hover:text-espresso">
              Sair ↩
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Convidados confirmados" value={String(kpis.confirmados)} />
          <Kpi label="Acompanhantes" value={String(kpis.acompanhantes)} />
          <Kpi label="Total de pessoas" value={String(kpis.total)} />
          <Kpi
            label="Arrecadado"
            value={fmt(kpis.arrecadado)}
            hint={`de ${fmt(kpis.meta)} em presentes`}
          />
        </div>

        {busy && <p className="mt-6 text-cocoa">Carregando dados…</p>}

        {/* RSVP */}
        <Section title="Lista de Confirmações (RSVP)">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-champagne">
                <tr className="border-b border-champagne/20">
                  <th className="py-2 pr-4">Convidado</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">Acompanhantes</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((p) => {
                  const comps = companionsByProfile.get(p.id) ?? [];
                  return (
                    <tr key={p.id} className="border-b border-champagne/10 align-top">
                      <td className="py-2 pr-4 text-espresso">{p.full_name || '—'}</td>
                      <td className="py-2 pr-4 text-espresso/70">{p.email ?? '—'}</td>
                      <td className="py-2 pr-4 text-espresso/70">
                        {comps.length === 0 ? (
                          <span className="text-espresso/40">nenhum</span>
                        ) : (
                          <span>
                            <span className="mr-2 rounded-full bg-sand px-2 py-0.5 text-xs text-cocoa">
                              {comps.length}
                            </span>
                            {comps.join(', ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {profiles.length === 0 && !busy && (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-espresso/50">
                      Nenhuma confirmação ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* PRESENTES */}
        <Section title="Status dos Presentes">
          <div className="space-y-3">
            {gifts.map((g) => {
              const pct = Math.min(
                Math.round((Number(g.raised_amount) / Number(g.target_amount)) * 100),
                100,
              );
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm text-espresso/80">
                    <span>
                      {g.icon} {g.title}
                    </span>
                    <span>
                      {fmt(Number(g.raised_amount))} / {fmt(Number(g.target_amount))} · {pct}%
                      {g.is_complete && <span className="ml-2 text-green-600">✓</span>}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-sand">
                    <div
                      className={`h-1.5 rounded-full ${g.is_complete ? 'bg-green-500' : 'bg-champagne'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* FINANCEIRO */}
        <Section title="Contribuições (Financeiro)">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-champagne">
                <tr className="border-b border-champagne/20">
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Contribuinte</th>
                  <th className="py-2 pr-4">Presente</th>
                  <th className="py-2 pr-4">Valor</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {contribs.map((c) => (
                  <tr key={c.id} className="border-b border-champagne/10">
                    <td className="py-2 pr-4 text-espresso/70">
                      {new Date(c.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-2 pr-4 text-espresso">{c.contributor_name ?? '—'}</td>
                    <td className="py-2 pr-4 text-espresso/70">{c.gifts?.title ?? '—'}</td>
                    <td className="py-2 pr-4 text-espresso">{fmt(Number(c.amount))}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          c.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {c.status === 'confirmed' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
                {contribs.length === 0 && !busy && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-espresso/50">
                      Nenhuma contribuição registrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-champagne/20 bg-white/60 p-5">
      <p className="text-xs uppercase tracking-wider text-champagne">{label}</p>
      <p className="mt-1 font-serif text-3xl text-espresso">{value}</p>
      {hint && <p className="mt-1 text-xs text-espresso/50">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-xl border border-champagne/20 bg-cream p-5">
      <h2 className="mb-4 font-serif text-xl text-espresso">{title}</h2>
      {children}
    </section>
  );
}
