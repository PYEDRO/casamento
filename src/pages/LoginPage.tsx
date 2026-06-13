import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bringingGuest, setBringingGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
        if (bringingGuest && !guestName.trim()) {
          throw new Error('Informe o nome do seu acompanhante.');
        }
        await signUp({ fullName, email, password, bringingGuest, guestName });
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
    <div className="flex min-h-screen items-center justify-center bg-sand bg-cover bg-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-cream/95 p-8 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <div className="mb-2 text-champagne">♥</div>
          <h1 className="font-script text-4xl text-champagne">Ana &amp; Carlos</h1>
          <p className="mt-1 text-xs tracking-[0.3em] text-cocoa">
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
            <Input
              label="Seu nome completo"
              value={fullName}
              onChange={setFullName}
              required
            />
          )}
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            required
          />
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
              <label className="flex items-center gap-2 text-sm text-espresso">
                <input
                  type="checkbox"
                  checked={bringingGuest}
                  onChange={(e) => setBringingGuest(e.target.checked)}
                  className="accent-champagne"
                />
                Vou levar um acompanhante
              </label>
              {bringingGuest && (
                <div className="mt-3">
                  <Input
                    label="Nome do acompanhante"
                    value={guestName}
                    onChange={setGuestName}
                    required
                  />
                </div>
              )}
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
      <span className="mb-1 block text-xs uppercase tracking-wider text-cocoa">
        {label}
      </span>
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
