import { useState } from 'react';
import type { GiftProgress } from '../types';
import PixModal from './PixModal';

const PRESETS = [50, 100, 200];

export default function GiftCard({
  gift,
  onContributed,
}: {
  gift: GiftProgress;
  onContributed: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [showPix, setShowPix] = useState(false);

  const remaining = Math.max(gift.target_amount - gift.raised_amount, 0);
  const pct = Math.min(
    Math.round((gift.raised_amount / gift.target_amount) * 100),
    100,
  );
  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="rounded-xl border border-champagne/20 bg-cream p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <span className="text-2xl">{gift.icon}</span>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-champagne">
              {gift.category}
            </p>
            <h3 className="font-serif text-xl text-espresso">{gift.title}</h3>
            <p className="mt-1 text-sm text-espresso/60">{gift.description}</p>
          </div>
        </div>
        {gift.is_complete && (
          <span className="shrink-0 rounded-full border border-green-300 px-2 py-0.5 text-xs text-green-700">
            ✓ Completo
          </span>
        )}
      </div>

      <div className="mt-4 flex justify-between text-sm text-espresso/70">
        <span>
          {fmt(gift.raised_amount)} de {fmt(gift.target_amount)}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-sand">
        <div
          className={`h-1.5 rounded-full ${gift.is_complete ? 'bg-green-500' : 'bg-champagne'}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {!gift.is_complete && (
        <>
          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-3 text-sm text-cocoa hover:text-espresso"
          >
            🎁 Contribuir {open ? '▲' : '▾'}
          </button>

          {open && (
            <div className="mt-3 border-t border-champagne/20 pt-3">
              <p className="mb-2 text-xs text-espresso/60">
                Escolha um valor para contribuir:
              </p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setAmount(p)}
                    className={`rounded border px-3 py-1 text-sm ${
                      amount === p
                        ? 'border-cocoa bg-cocoa text-cream'
                        : 'border-champagne/40 text-espresso'
                    }`}
                  >
                    {fmt(p)}
                  </button>
                ))}
                <button
                  onClick={() => setAmount(remaining)}
                  className="rounded border border-champagne/40 px-3 py-1 text-sm text-espresso"
                >
                  Valor total
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={remaining}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded border border-champagne/40 bg-white/70 px-3 py-2 text-espresso outline-none focus:border-champagne"
                />
                <button
                  onClick={() => amount > 0 && setShowPix(true)}
                  className="shrink-0 rounded bg-cocoa px-4 py-2 text-sm text-cream hover:bg-espresso"
                >
                  Pagar via Pix
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showPix && (
        <PixModal
          gift={gift}
          amount={amount}
          onClose={() => setShowPix(false)}
          onConfirmed={() => {
            setShowPix(false);
            setOpen(false);
            onContributed();
          }}
        />
      )}
    </div>
  );
}
