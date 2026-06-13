import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { buildPixPayload } from '../lib/pix';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { GiftProgress } from '../types';

const PIX_KEY = import.meta.env.VITE_PIX_KEY as string;
const PIX_NAME = import.meta.env.VITE_PIX_MERCHANT_NAME as string;
const PIX_CITY = import.meta.env.VITE_PIX_MERCHANT_CITY as string;

interface Props {
  gift: GiftProgress;
  amount: number;
  onClose: () => void;
  onConfirmed: () => void;
}

export default function PixModal({ gift, amount, onClose, onConfirmed }: Props) {
  const { session, profile } = useAuth();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // txid curto e alfanumérico (limite do campo 05).
  const txid = `${gift.id.replace(/-/g, '').slice(0, 18)}`.toUpperCase();

  const payload = buildPixPayload({
    key: PIX_KEY,
    merchantName: PIX_NAME,
    merchantCity: PIX_CITY,
    amount,
    txid,
  });

  useEffect(() => {
    QRCode.toDataURL(payload, { margin: 1, width: 240 }).then(setQrDataUrl);
  }, [payload]);

  async function copy() {
    await navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function confirm() {
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.from('contributions').insert({
      gift_id: gift.id,
      user_id: session?.user.id,
      contributor_name: profile?.full_name ?? null,
      amount,
      status: 'confirmed',
      txid,
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    onConfirmed();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-cream p-6 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right text-cocoa hover:text-espresso"
          aria-label="Fechar"
        >
          ✕
        </button>
        <p className="text-xs uppercase tracking-[0.25em] text-champagne">
          Pagamento via Pix
        </p>
        <h3 className="mt-1 font-serif text-2xl text-espresso">{gift.title}</h3>
        <p className="mt-1 text-lg font-medium text-champagne">
          {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        <div className="mx-auto my-4 w-fit rounded-lg bg-white p-2 shadow">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code Pix" width={216} height={216} />
          ) : (
            <div className="h-[216px] w-[216px] animate-pulse bg-sand" />
          )}
        </div>

        <p className="text-sm text-espresso/70">Escaneie o QR ou copie a chave Pix</p>

        <button
          onClick={copy}
          className="mt-2 flex w-full items-center justify-between rounded-lg border border-champagne/40 bg-white/70 px-3 py-2 text-sm text-espresso"
        >
          <span className="truncate">{PIX_KEY}</span>
          <span className="ml-2 shrink-0 text-cocoa">{copied ? '✓' : '⧉'}</span>
        </button>

        <p className="mt-2 text-xs text-cocoa">
          Favorecido: <strong>{PIX_NAME}</strong> ·{' '}
          {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          onClick={confirm}
          disabled={busy}
          className="mt-4 w-full rounded-lg bg-cocoa py-3 text-sm font-medium uppercase tracking-widest text-cream transition hover:bg-espresso disabled:opacity-60"
        >
          {busy ? 'Registrando…' : 'Confirmar Contribuição'}
        </button>
        <p className="mt-2 text-[11px] leading-snug text-cocoa/70">
          Pix estático não confirma o pagamento automaticamente. Clique acima
          somente após efetuar a transferência.
        </p>
      </div>
    </div>
  );
}
