import type { Country, CountrySlug } from '@data/countries';
import { waLink, BRAND } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** HeroB — "Apple + Stripe premium AI" · centered minimal + gradient mesh + chat mockup. */
export default function HeroB({ slug, country, dict }: Props) {
  const headline = dict.hero.headline_b ?? dict.hero.eyebrow;
  const subline = dict.hero.subline_premium ?? dict.hero.subline;
  return (
    <section className="relative bg-paper overflow-hidden">
      {/* R93: globos + country flag removed 2026-05-02 */}
      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur border border-ink/10 text-xs font-bold uppercase tracking-widest text-turquesa-deeper">
          <span className="w-1.5 h-1.5 rounded-full bg-turquesa animate-pulse" />
          {dict.hero.eyebrow}
        </div>
        <h1
          className="mt-8 font-display text-[48px] sm:text-[72px] md:text-[104px] leading-[0.95] tracking-tightest text-ink max-w-5xl mx-auto"
          style={{ fontWeight: 700 }}
        >
          {splitHeadline(headline)}
        </h1>
        <p className="mt-8 text-lg md:text-2xl text-slate max-w-2xl mx-auto leading-relaxed">
          {subline}
        </p>
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <a
            id="cta"
            href={waLink(slug as CountrySlug)}
            target="_blank"
            rel="noopener"
            className="bg-azul text-white font-semibold text-base px-7 py-3.5 rounded-full hover:bg-purple hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg"
            style={{ transition: 'transform 0.4s var(--ease-spring), background-color 0.2s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo)' }}
          >
            {country.cta.primary}
          </a>
          <a
            href="#chatdemo"
            className="bg-white text-ink font-semibold text-base px-7 py-3.5 rounded-full border border-ink/15 hover:border-ink/40 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
            style={{ transition: 'transform 0.4s var(--ease-spring), border-color 0.2s var(--ease-out-expo)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            {country.cta.secondary}
          </a>
        </div>
      </div>

      {/* Chat mockup centered as product hero */}
      <div className="relative max-w-md mx-auto px-6 pb-24 md:pb-32">
        <ChatMockup country={country} dict={dict} />
      </div>
    </section>
  );
}

/** Split headline · color secondary half (Stripe trick) */
function splitHeadline(text: string) {
  const words = text.split(' ');
  const half = Math.ceil(words.length / 2);
  const first = words.slice(0, half).join(' ');
  const second = words.slice(half).join(' ');
  return (
    <>
      <span className="text-ink">{first} </span>
      <span className="bg-gradient-to-r from-turquesa via-azul to-purple bg-clip-text text-transparent">{second}</span>
    </>
  );
}

/** R93 (2026-05-02): GradientMesh globos removed across all countries · clean paper bg */

/** WhatsApp chat mockup · product as hero */
function ChatMockup({ country, dict }: { country: Country; dict: Dict }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-ink/10">
      {/* WA header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-turquesa flex items-center justify-center shrink-0">
          <img src={BRAND.logoIso} alt="Zymplo" className="w-5 h-5" width="20" height="20" style={{ filter: 'brightness(0) invert(1)' }} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Zymplo</div>
          <div className="text-[10px] opacity-80">{(dict.chat as any).online ?? 'online'} · AI</div>
        </div>
        <span className="opacity-60 text-xs">📞 📹 ⋮</span>
      </div>
      <div className="bg-[#E5DDD5] px-4 py-5 space-y-2 min-h-[260px]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
        {dict.chat.messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 text-sm rounded-2xl ${m.from === 'user' ? 'bg-[#DCF8C6] text-ink' : 'bg-white text-ink'}`} style={{ boxShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
