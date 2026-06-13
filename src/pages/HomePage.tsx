import { normalizePixKey } from '../lib/pix';
import SiteNavbar from '../components/SiteNavbar';
import GiftsSection from '../components/GiftsSection';
import {
  COUPLE,
  HERO_IMAGE,
  STORY,
  STORY_IMAGE,
  GALLERY,
  CEREMONY,
  ARCH_IMAGE,
} from '../data/site';

const PIX_KEY = normalizePixKey(import.meta.env.VITE_PIX_KEY as string);
const PIX_NAME = import.meta.env.VITE_PIX_MERCHANT_NAME as string;

export default function HomePage() {
  return (
    <div id="top" className="bg-cream">
      <SiteNavbar />

      {/* HERO */}
      <section
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center text-center text-cream"
        style={{
          backgroundImage: `linear-gradient(rgba(46,37,29,.45), rgba(46,37,29,.55)), url(${HERO_IMAGE})`,
        }}
      >
        <div className="px-4">
          <p className="text-xs uppercase tracking-[0.5em] text-cream/80">O Grande Dia</p>
          <h1 className="mt-4 font-script text-6xl leading-tight sm:text-8xl">{COUPLE.names}</h1>
          <p className="mt-4 font-serif text-lg text-cream/90 sm:text-xl">
            {COUPLE.date} · {COUPLE.city}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <Badge>📅 {COUPLE.dateShort}</Badge>
            <Badge>🕔 {COUPLE.time}</Badge>
            <Badge>📍 {COUPLE.venue}</Badge>
          </div>
          <a
            href="#historia"
            className="mt-12 inline-block text-xs uppercase tracking-[0.3em] text-cream/80 hover:text-cream"
          >
            Nossa História
            <span className="mt-1 block animate-bounce">⌄</span>
          </a>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section id="historia" className="scroll-mt-20 bg-cream px-4 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-script text-4xl text-champagne">Nossa História</h2>
            <h3 className="mt-2 font-serif text-3xl text-espresso">
              Dois corações,
              <br />
              <em>uma vida</em>
            </h3>
            <ol className="mt-8 space-y-6 border-l border-champagne/30 pl-6">
              {STORY.map((s) => (
                <li key={s.year} className="relative">
                  <span className="absolute -left-[34px] flex h-6 w-6 items-center justify-center rounded-full bg-sand text-champagne">
                    ♥
                  </span>
                  <p className="text-xs tracking-[0.3em] text-champagne">{s.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-espresso/70">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <img src={STORY_IMAGE} alt="O casal" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="scroll-mt-20 bg-sand px-4 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-script text-4xl text-champagne">Nossa Galeria</h2>
          <h3 className="mt-1 font-serif text-3xl text-espresso">Momentos Eternos</h3>
          <div className="mx-auto my-4 flex items-center justify-center gap-3 text-champagne">
            <span className="h-px w-10 bg-champagne/40" />♥
            <span className="h-px w-10 bg-champagne/40" />
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
            {GALLERY.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow-sm">
                <img
                  src={src}
                  alt={`Galeria ${i + 1}`}
                  loading="lazy"
                  className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-64"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESENTES */}
      <GiftsSection />

      {/* CHAVE PIX */}
      <section className="bg-cream px-4 pb-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-sand p-8 text-center">
          <div className="text-2xl text-champagne">▦</div>
          <h3 className="mt-2 font-serif text-2xl text-espresso">Chave Pix</h3>
          <p className="mt-2 break-all font-medium text-champagne">{PIX_KEY}</p>
          <p className="mt-2 text-xs text-espresso/60">
            Favorecido: {PIX_NAME} · Você também pode transferir o valor diretamente
          </p>
        </div>
      </section>

      {/* A CELEBRAÇÃO */}
      <section id="cerimonia" className="scroll-mt-20 bg-espresso px-4 py-20 text-cream">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="font-script text-4xl text-champagne">A Celebração</h2>
          <h3 className="mt-1 font-serif text-3xl">Detalhes do Grande Dia</h3>
          <div className="mx-auto my-4 flex items-center justify-center gap-3 text-champagne">
            <span className="h-px w-10 bg-champagne/40" />♥
            <span className="h-px w-10 bg-champagne/40" />
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <InfoCard icon="🕔" title="Horário" lines={CEREMONY.horario} />
            <InfoCard icon="📍" title="Local" lines={CEREMONY.local} />
            <InfoCard icon="📅" title="Data" lines={CEREMONY.data} />
          </div>

          <div className="mt-10 overflow-hidden rounded-lg">
            <img src={ARCH_IMAGE} alt="Cerimônia" className="h-72 w-full object-cover" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cream px-4 py-12 text-center">
        <p className="font-script text-3xl text-champagne">{COUPLE.names}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cocoa">
          {COUPLE.date} · {COUPLE.city}
        </p>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3 text-champagne">
          <span className="h-px w-10 bg-champagne/40" />♥
          <span className="h-px w-10 bg-champagne/40" />
        </div>
      </footer>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-cream/40 bg-espresso/20 px-4 py-2 backdrop-blur">
      {children}
    </span>
  );
}

function InfoCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-champagne/30 p-6">
      <div className="text-2xl text-champagne">{icon}</div>
      <h4 className="mt-3 font-serif text-xl">{title}</h4>
      <div className="mt-3 space-y-1 text-sm text-cream/70">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </div>
  );
}
