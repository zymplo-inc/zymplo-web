import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Country } from '@data/countries';

interface Props {
  country: Country;
  whatsappNumber?: string;
}

const OFICIOS = [
  { id: 'eletricista', emoji: '⚡', label: { br: 'Eletricista', es: 'Electricista', en: 'Electrician' } },
  { id: 'encanador', emoji: '🔧', label: { br: 'Encanador', es: 'Plomero', en: 'Plumber' } },
  { id: 'cabeleireira', emoji: '💇', label: { br: 'Cabeleireira', es: 'Estilista', en: 'Hairstylist' } },
  { id: 'pedreiro', emoji: '🧱', label: { br: 'Pedreiro', es: 'Albañil', en: 'Mason' } },
  { id: 'pintor', emoji: '🎨', label: { br: 'Pintor', es: 'Pintor', en: 'Painter' } },
  { id: 'marceneiro', emoji: '🪚', label: { br: 'Marceneiro', es: 'Carpintero', en: 'Carpenter' } },
  { id: 'manicure', emoji: '💅', label: { br: 'Manicure', es: 'Manicurista', en: 'Nail tech' } },
  { id: 'esteticista', emoji: '✨', label: { br: 'Esteticista', es: 'Esteticista', en: 'Esthetician' } },
  { id: 'barbeiro', emoji: '💈', label: { br: 'Barbeiro', es: 'Barbero', en: 'Barber' } },
  { id: 'mecanico', emoji: '🔩', label: { br: 'Mecânico', es: 'Mecánico', en: 'Mechanic' } },
  { id: 'lavador', emoji: '🚿', label: { br: 'Lavador', es: 'Lavador', en: 'Detailer' } },
  { id: 'borracheiro', emoji: '🛞', label: { br: 'Borracheiro', es: 'Vulcanizador', en: 'Tire repair' } },
  { id: 'confeiteira', emoji: '🍰', label: { br: 'Confeiteira', es: 'Repostera', en: 'Baker' } },
  { id: 'food_truck', emoji: '🌮', label: { br: 'Food truck', es: 'Food truck', en: 'Food truck' } },
  { id: 'marmita', emoji: '🍱', label: { br: 'Marmita', es: 'Comidas', en: 'Meal prep' } },
  { id: 'acai', emoji: '🍇', label: { br: 'Açaí', es: 'Postres', en: 'Açaí' } },
  { id: 'diarista', emoji: '🧹', label: { br: 'Diarista', es: 'Limpieza', en: 'House cleaner' } },
  { id: 'cuidador', emoji: '🤝', label: { br: 'Cuidador', es: 'Cuidador', en: 'Caregiver' } },
  { id: 'baba', emoji: '👶', label: { br: 'Babá', es: 'Niñera', en: 'Nanny' } },
  { id: 'costureira', emoji: '🧵', label: { br: 'Costureira', es: 'Costurera', en: 'Seamstress' } },
  { id: 'fotografo', emoji: '📸', label: { br: 'Fotógrafo', es: 'Fotógrafo', en: 'Photographer' } },
  { id: 'pet_groomer', emoji: '🐾', label: { br: 'Pet groomer', es: 'Estética canina', en: 'Pet groomer' } },
  { id: 'mototaxi', emoji: '🛵', label: { br: 'Mototaxi', es: 'Mototaxi', en: 'Moto courier' } },
  { id: 'tec_celular', emoji: '📱', label: { br: 'Téc celular', es: 'Téc celular', en: 'Phone tech' } },
  { id: 'tec_ar', emoji: '❄️', label: { br: 'Téc A/C', es: 'Téc A/C', en: 'AC tech' } },
  { id: 'jardineiro', emoji: '🌱', label: { br: 'Jardineiro', es: 'Jardinero', en: 'Gardener' } },
  { id: 'chaveiro', emoji: '🔑', label: { br: 'Chaveiro', es: 'Cerrajero', en: 'Locksmith' } },
  { id: 'massagista', emoji: '💆', label: { br: 'Massagista', es: 'Masajista', en: 'Massage' } },
];

const COPY: Record<string, Record<string, string>> = {
  br: {
    step: 'Passo', of: 'de', back: 'Voltar', next: 'Próximo', skip: 'Pular',
    welcome_title: 'Tua secretária IA tá pronta',
    welcome_sub: 'Sem cadastro chato. Sem app. Só WhatsApp.',
    welcome_detecting: 'Detectando seu perfil...',
    welcome_ready: 'Tudo pronto pra começar',
    oficio_title: 'Qual teu trampo?',
    oficio_sub: 'Toca no teu ofício pra eu adaptar tudo pra ti',
    oficio_chosen: 'Show, vou adaptar pra ti',
    data_title: 'Confirma teus dados',
    data_sub: 'Validamos automático · zero papelada',
    data_doc: 'CNPJ ou CPF',
    data_doc_help: 'Auto-validamos na Receita',
    data_name: 'Como queres ser chamado?',
    data_name_ph: 'Diego',
    data_phone: 'WhatsApp',
    data_phone_help: 'Mandamos um oi pra confirmar',
    demo_title: 'Tua primeira cobrança · demo',
    demo_sub: 'Vê como ficaria pra um cliente real',
    demo_amount: 'Cobrar',
    demo_to: 'De',
    demo_to_ph: 'Maria Silva',
    demo_send: 'Enviar cobrança 💸',
    demo_sent: 'Mandado! O cliente recebeu o link Pix',
    done_title: 'Pronto · agora é só usar',
    done_sub: 'Salvei tudo. Abre o WhatsApp e me chama "oi Zymplo"',
    done_cta: 'Abrir WhatsApp 💬',
  },
  es: {
    step: 'Paso', of: 'de', back: 'Atrás', next: 'Siguiente', skip: 'Saltar',
    welcome_title: 'Tu secretaria IA está lista',
    welcome_sub: 'Sin registro pesado. Sin app. Solo WhatsApp.',
    welcome_detecting: 'Detectando tu perfil...',
    welcome_ready: 'Todo listo para empezar',
    oficio_title: '¿A qué te dedicás?',
    oficio_sub: 'Tocá tu oficio para que adapte todo a vos',
    oficio_chosen: 'Listo, lo adapto a vos',
    data_title: 'Confirmá tus datos',
    data_sub: 'Validamos automático · sin papeleo',
    data_doc: 'Tu documento',
    data_doc_help: 'Auto-validamos en el registro oficial',
    data_name: '¿Cómo te llamamos?',
    data_name_ph: 'Mario',
    data_phone: 'WhatsApp',
    data_phone_help: 'Te mando un saludo para confirmar',
    demo_title: 'Tu primer cobro · demo',
    demo_sub: 'Mirá cómo quedaría con un cliente real',
    demo_amount: 'Cobrar',
    demo_to: 'A',
    demo_to_ph: 'María Pérez',
    demo_send: 'Enviar cobro 💸',
    demo_sent: 'Listo! El cliente recibió el link de pago',
    done_title: 'Listo · ahora a usarlo',
    done_sub: 'Guardé todo. Abrí WhatsApp y decime "hola Zymplo"',
    done_cta: 'Abrir WhatsApp 💬',
  },
  en: {
    step: 'Step', of: 'of', back: 'Back', next: 'Next', skip: 'Skip',
    welcome_title: 'Your AI secretary is ready',
    welcome_sub: 'No tedious signup. No app. Just WhatsApp.',
    welcome_detecting: 'Detecting your profile...',
    welcome_ready: 'All set to start',
    oficio_title: 'What do you do?',
    oficio_sub: 'Tap your trade so I tailor everything to you',
    oficio_chosen: 'Got it, tailoring it for you',
    data_title: 'Confirm your details',
    data_sub: 'Auto-validated · zero paperwork',
    data_doc: 'Your tax ID',
    data_doc_help: 'We auto-verify with the IRS',
    data_name: 'What should we call you?',
    data_name_ph: 'Mike',
    data_phone: 'WhatsApp',
    data_phone_help: "We'll send a hi to confirm",
    demo_title: 'Your first invoice · demo',
    demo_sub: "See what it'd look like for a real client",
    demo_amount: 'Charge',
    demo_to: 'To',
    demo_to_ph: 'Maria Smith',
    demo_send: 'Send invoice 💸',
    demo_sent: 'Sent! Client got the payment link',
    done_title: "All set · let's roll",
    done_sub: 'Saved everything. Open WhatsApp and say "hi Zymplo"',
    done_cta: 'Open WhatsApp 💬',
  },
};

const langKey = (locale: string) => (locale.startsWith('pt') ? 'br' : locale.startsWith('en') ? 'en' : 'es');

const docByCountry: Record<string, { label: string; placeholder: string; pattern?: string }> = {
  br: { label: 'CNPJ / CPF', placeholder: '12.345.678/0001-90' },
  mx: { label: 'RFC', placeholder: 'XAXX010101000' },
  us: { label: 'EIN / SSN', placeholder: '12-3456789' },
  co: { label: 'NIT / Cédula', placeholder: '900.123.456-7' },
  es: { label: 'NIF / DNI', placeholder: '12345678A' },
  ar: { label: 'CUIT', placeholder: '20-12345678-3' },
  py: { label: 'RUC', placeholder: '12345678-9' },
};

export default function Onboarding5Steps({ country, whatsappNumber = '5511999999999' }: Props) {
  const [step, setStep] = useState(0);
  const [oficio, setOficio] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(150);
  const [clientName, setClientName] = useState('');
  const [demoSent, setDemoSent] = useState(false);
  const [welcomeReady, setWelcomeReady] = useState(false);

  const lang = langKey(country.locale);
  const t = COPY[lang];
  const labelLang = lang === 'br' ? 'br' : lang === 'en' ? 'en' : 'es';
  const docMeta = docByCountry[country.slug] ?? docByCountry.br;

  useEffect(() => {
    if (step === 0) {
      const id = setTimeout(() => setWelcomeReady(true), 1400);
      return () => clearTimeout(id);
    }
  }, [step]);

  const stepNames = ['welcome', 'oficio', 'data', 'demo', 'done'];
  const total = stepNames.length;

  const wa = useMemo(() => {
    const text = encodeURIComponent(`oi Zymplo, sou ${name || 'novo'} ${oficio ? `(${oficio})` : ''}`);
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  }, [name, oficio, whatsappNumber]);

  const canNext =
    (step === 0 && welcomeReady) ||
    (step === 1 && !!oficio) ||
    (step === 2 && name.length > 1 && doc.length > 4) ||
    (step === 3 && demoSent) ||
    step === 4;

  const goNext = () => setStep((s) => Math.min(s + 1, total - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div class="max-w-3xl mx-auto px-6 py-12 md:py-20">
      {/* Progress bar */}
      <div class="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={total}>
        {stepNames.map((_, i) => (
          <div
            key={i}
            class={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-turquesa' : 'bg-ink/10'
            }`}
          />
        ))}
      </div>
      <div class="text-xs uppercase tracking-widest text-mute font-bold mb-2">
        {t.step} {step + 1} {t.of} {total}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            class="text-center"
          >
            <div class="mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-turquesa to-turquesa-dark flex items-center justify-center shadow-[0_20px_60px_-20px_rgba(20,184,166,0.6)] mb-6">
              <motion.svg
                viewBox="0 0 96 96"
                width="64"
                height="64"
                animate={welcomeReady ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={welcomeReady ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                <g fill="none" stroke="#FAFBFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M26 44 L40 28 L54 44 L72 22" />
                  <path d="M22 56 Q48 86 74 56" />
                </g>
              </motion.svg>
            </div>
            <h1 class="font-display text-4xl md:text-5xl font-bold tracking-tightest">{t.welcome_title}</h1>
            <p class="mt-3 text-mute text-lg max-w-md mx-auto">{t.welcome_sub}</p>
            <motion.div
              class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-turquesa-deeper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {welcomeReady ? (
                <>
                  <span class="w-2 h-2 rounded-full bg-success" /> {t.welcome_ready}
                </>
              ) : (
                <>
                  <span class="w-2 h-2 rounded-full bg-turquesa animate-pulse" /> {t.welcome_detecting}
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="oficio"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tightest text-center">{t.oficio_title}</h2>
            <p class="mt-2 text-mute text-center">{t.oficio_sub}</p>
            <div class="mt-8 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {OFICIOS.map((o) => {
                const selected = oficio === o.id;
                return (
                  <button
                    type="button"
                    key={o.id}
                    onClick={() => setOficio(o.id)}
                    class={`group flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      selected
                        ? 'border-turquesa bg-turquesa-paler shadow-[0_8px_24px_-8px_rgba(20,184,166,0.5)] scale-105'
                        : 'border-ink/5 bg-paper hover:border-turquesa/40 hover:bg-turquesa-paler/40'
                    }`}
                  >
                    <span class="text-3xl" aria-hidden="true">{o.emoji}</span>
                    <span class={`text-xs font-bold text-center leading-tight ${selected ? 'text-turquesa-deeper' : 'text-slate'}`}>
                      {(o.label as Record<string, string>)[labelLang] ?? o.label.br}
                    </span>
                  </button>
                );
              })}
            </div>
            {oficio && (
              <motion.p
                class="mt-6 text-center text-turquesa-deeper font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ✨ {t.oficio_chosen}
              </motion.p>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tightest text-center">{t.data_title}</h2>
            <p class="mt-2 text-mute text-center">{t.data_sub}</p>
            <div class="mt-8 space-y-5">
              <label class="block">
                <span class="text-sm font-bold text-slate">{t.data_name}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName((e.target as HTMLInputElement).value)}
                  placeholder={t.data_name_ph}
                  class="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-ink/10 bg-paper focus:border-turquesa focus:outline-none transition font-semibold"
                />
              </label>
              <label class="block">
                <span class="text-sm font-bold text-slate">{docMeta.label}</span>
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => setDoc((e.target as HTMLInputElement).value)}
                  placeholder={docMeta.placeholder}
                  class="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-ink/10 bg-paper focus:border-turquesa focus:outline-none transition font-mono"
                />
                <span class="mt-1 inline-flex items-center gap-1 text-xs text-success font-semibold">
                  ✓ {t.data_doc_help}
                </span>
              </label>
              <label class="block">
                <span class="text-sm font-bold text-slate">{t.data_phone}</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
                  placeholder={`+${whatsappNumber.slice(0, 2)} `}
                  class="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-ink/10 bg-paper focus:border-turquesa focus:outline-none transition font-mono"
                />
                <span class="mt-1 text-xs text-mute">{t.data_phone_help}</span>
              </label>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tightest text-center">{t.demo_title}</h2>
            <p class="mt-2 text-mute text-center">{t.demo_sub}</p>
            <div class="mt-8 grid md:grid-cols-2 gap-6 items-center">
              <div class="space-y-4">
                <label class="block">
                  <span class="text-sm font-bold text-slate">{t.demo_to}</span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName((e.target as HTMLInputElement).value)}
                    placeholder={t.demo_to_ph}
                    disabled={demoSent}
                    class="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-ink/10 bg-paper focus:border-turquesa focus:outline-none disabled:opacity-60"
                  />
                </label>
                <label class="block">
                  <span class="text-sm font-bold text-slate">
                    {t.demo_amount} <span class="text-turquesa-deeper">{country.currency.symbol}</span>
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number((e.target as HTMLInputElement).value || 0))}
                    disabled={demoSent}
                    class="mt-1 w-full px-4 py-3 rounded-2xl border-2 border-ink/10 bg-paper focus:border-turquesa focus:outline-none font-display text-2xl font-bold disabled:opacity-60"
                  />
                </label>
                {!demoSent && (
                  <button
                    type="button"
                    onClick={() => setDemoSent(true)}
                    disabled={!clientName || amount < 1}
                    class="w-full px-6 py-4 rounded-2xl bg-turquesa hover:bg-turquesa-dark text-white font-bold text-lg shadow-[0_12px_32px_-12px_rgba(20,184,166,0.6)] transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t.demo_send}
                  </button>
                )}
                {demoSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    class="px-4 py-3 rounded-2xl bg-success/10 border border-success/30 text-success font-bold"
                  >
                    ✓ {t.demo_sent}
                  </motion.div>
                )}
              </div>
              <div class="relative aspect-square max-w-xs mx-auto rounded-3xl bg-gradient-to-br from-ink to-slate p-6 flex flex-col items-center justify-center text-paper">
                <div class="text-xs uppercase tracking-widest font-bold text-turquesa-light">
                  {country.payments[0]}
                </div>
                <div class="mt-2 font-display text-4xl font-bold">
                  {country.currency.format(amount || 0)}
                </div>
                <svg viewBox="0 0 100 100" class="w-32 h-32 mt-3" aria-label="QR code demo">
                  <rect width="100" height="100" fill="#FAFBFF" />
                  {Array.from({ length: 64 }).map((_, i) => {
                    const x = (i % 8) * 12 + 2;
                    const y = Math.floor(i / 8) * 12 + 2;
                    const seed = (i * 7919 + (clientName.length || 1) * 31 + amount) % 7;
                    if (seed < 3) return null;
                    return <rect key={i} x={x} y={y} width="10" height="10" fill="#0A0B14" />;
                  })}
                  <rect x="2" y="2" width="22" height="22" fill="none" stroke="#0A0B14" stroke-width="3" />
                  <rect x="76" y="2" width="22" height="22" fill="none" stroke="#0A0B14" stroke-width="3" />
                  <rect x="2" y="76" width="22" height="22" fill="none" stroke="#0A0B14" stroke-width="3" />
                </svg>
                <div class="mt-2 text-xs opacity-70 truncate max-w-full">
                  {clientName || t.demo_to_ph}
                </div>
                {demoSent && (
                  <motion.div
                    class="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Array.from({ length: 18 }).map((_, i) => (
                      <motion.span
                        key={i}
                        class="absolute w-2 h-2 rounded-full"
                        style={{
                          background: ['#14B8A6', '#5EEAD4', '#623AE6', '#F59E0B'][i % 4],
                          left: `${(i * 53) % 100}%`,
                          top: '50%',
                        }}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 200, opacity: 0, x: (i % 2 ? 1 : -1) * (20 + i * 4) }}
                        transition={{ duration: 1.4 + (i % 3) * 0.2, ease: 'easeOut' }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            class="text-center"
          >
            <motion.div
              class="mx-auto w-24 h-24 rounded-full bg-success/10 border-2 border-success flex items-center justify-center mb-6"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#22C55E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </motion.div>
            <h2 class="font-display text-4xl md:text-5xl font-bold tracking-tightest">{t.done_title}</h2>
            <p class="mt-3 text-mute text-lg max-w-md mx-auto">{t.done_sub}</p>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-success hover:bg-[#1BA651] text-white font-bold text-lg shadow-[0_16px_40px_-12px_rgba(34,197,94,0.6)] transition"
            >
              {t.done_cta}
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      {step < total - 1 && (
        <div class="mt-12 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            class="px-5 py-2.5 rounded-full text-sm font-bold text-slate hover:bg-ink/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← {t.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext}
            class="px-6 py-2.5 rounded-full bg-ink hover:bg-slate text-paper text-sm font-bold transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t.next} →
          </button>
        </div>
      )}
    </div>
  );
}
