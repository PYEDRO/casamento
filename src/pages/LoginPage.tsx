import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COUPLE, LOGIN_IMAGE } from '../data/site';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companions, setCompanions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function addCompanion() {
    setCompanions((c) => [...c, '']);
  }
  function updateCompanion(i: number, value: string) {
    setCompanions((c) => c.map((v, idx) => (idx === i ? value : v)));
  }
  function removeCompanion(i: number) {
    setCompanions((c) => c.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
        navigate('/');
      } else {
        const names = companions.map((n) => n.trim()).filter(Boolean);
        if (companions.length > 0 && names.length !== companions.length) {
          throw new Error('Preencha o nome de cada acompanhante ou remova os vazios.');
        }
        await signUp({ fullName, email, password, companions: names });
        setInfo(
          'Cadastro criado! Caso a confirmação de e-mail esteja ativa, confirme pelo link enviado. Depois entre normalmente.',
        );
        setMode('signin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo deu errado.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-10"
      style={{
        backgroundImage: `linear-gradient(rgba(46,37,29,.45), rgba(46,37,29,.45)), url(${LOGIN_IMAGE})`,
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-cream/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <div className="mb-3 text-champagne">♥</div>
          <h1 className="font-script text-4xl text-champagne">{COUPLE.names}</h1>
          <p className="mt-2 text-xs tracking-[0.3em] text-cocoa">
            14 DE SETEMBRO DE 2025
          </p>
          <p className="mt-4 text-sm text-espresso/70">
            {mode === 'signin'
              ? 'Esta página é exclusiva para nossos convidados.'
              : 'Confirme sua presença para acessar.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Input label="Seu nome completo" value={fullName} onChange={setFullName} required />
          )}
          <Input label="E-mail" type="email" value={email} onChange={setEmail} required />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

          {mode === 'signup' && (
            <div className="rounded-lg border border-champagne/40 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-espresso">Acompanhantes</span>
                <button
                  type="button"
                  onClick={addCompanion}
                  className="rounded border border-champagne/40 px-2 py-1 text-xs text-cocoa hover:bg-sand"
                >
                  + Adicionar
                </button>
              </div>

              {companions.length === 0 && (
                <p className="mt-2 text-xs text-espresso/50">
                  Nenhum acompanhante. Clique em “Adicionar” para incluir +1, +2…
                </p>
              )}

              <div className="mt-3 space-y-2">
                {companions.map((name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-8 shrink-0 text-xs text-cocoa">+{i + 1}</span>
                    <input
                      value={name}
                      onChange={(e) => updateCompanion(i, e.target.value)}
                      placeholder={`Nome do acompanhante ${i + 1}`}
                      className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-sm text-espresso outline-none focus:border-champagne"
                    />
                    <button
                      type="button"
                      onClick={() => removeCompanion(i)}
                      className="shrink-0 rounded border border-red-300 px-2 py-2 text-xs text-red-600 hover:bg-red-50"
                      aria-label="Remover acompanhante"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-green-700">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-cocoa py-3 text-sm font-medium uppercase tracking-widest text-cream transition hover:bg-espresso disabled:opacity-60"
          >
            {busy ? '...' : mode === 'signin' ? 'Entrar' : 'Confirmar presença'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin');
            setError(null);
            setInfo(null);
          }}
          className="mt-5 w-full text-center text-xs text-cocoa underline-offset-4 hover:underline"
        >
          {mode === 'signin'
            ? 'Primeira vez? Confirme sua presença'
            : 'Já tenho cadastro — entrar'}
        </button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-cocoa">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne focus:ring-1 focus:ring-champagne"
      />
    </label>
  );
}
