import { useState, useRef } from 'react';
import { COUNTRY_SLUGS, type CountrySlug } from '@data/countries';

interface Props {
  currentSlug: CountrySlug;
  dict: any;
}

/**
 * Voice language detector · Grok contrarian idea.
 * Uses Web Speech API (best-effort): listens for 2-3 seconds, infers locale from
 * the recognized language tag, redirects to matching country subdomain.
 * Graceful degradation: if API unsupported or denied, button is hidden / shows tooltip.
 */
export default function VoiceLangSwitcher({ currentSlug, dict }: Props) {
  const v = (dict.voice_lang ?? {}) as any;
  const tooltip = v.tooltip ?? 'Speak to switch language';
  const listening = v.listening ?? 'Listening · say a word in your language';
  const detected = v.detected ?? 'Detected';
  const unsupportedLabel = v.unsupported ?? 'Voice not supported in this browser';
  const noMatch = v.no_match ?? "Couldn't detect · try again";

  const [state, setState] = useState<'idle' | 'listening' | 'detected' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const recRef = useRef<any>(null);

  const SR: any =
    typeof window !== 'undefined'
      ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      : null;

  if (!SR) {
    // Render hidden if unsupported (e.g. Safari mobile pre-iOS 16 strict)
    return null;
  }

  const start = () => {
    if (state === 'listening') {
      try { recRef.current?.stop(); } catch {}
      setState('idle');
      setMessage('');
      return;
    }

    try {
      const rec = new SR();
      recRef.current = rec;
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      // Default lang from current slug → encourage user to speak in that locale or switch
      const localeMap: Record<CountrySlug, string> = {
        br: 'pt-BR', mx: 'es-MX', us: 'en-US', co: 'es-CO', es: 'es-ES', ar: 'es-AR', py: 'es-PY',
      };
      rec.lang = localeMap[currentSlug] || 'en-US';
      rec.onstart = () => { setState('listening'); setMessage(listening); };
      rec.onerror = () => { setState('error'); setMessage(noMatch); };
      rec.onresult = (e: any) => {
        const transcript: string = e?.results?.[0]?.[0]?.transcript ?? '';
        const t = transcript.toLowerCase();
        // Heuristic: detect strong Portuguese / Spanish / English signals
        let target: CountrySlug | null = null;
        if (/\b(olá|você|obrigado|obrigada|tudo bem|legal|cara|véi|caraca)\b/.test(t)) target = 'br';
        else if (/\b(hello|hi|thanks|please|cool|dude|awesome)\b/.test(t)) target = 'us';
        else if (/\b(hola|gracias|por favor|chido|guey|órale|che|boludo|tío|vale|guay|bacano|parce|metele|dale que)\b/.test(t)) {
          // Spanish detected · keep current if already Spanish, else default to MX
          const spSlugs: CountrySlug[] = ['mx', 'co', 'es', 'ar', 'py'];
          target = spSlugs.includes(currentSlug) ? currentSlug : 'mx';
        }
        if (!target) {
          // Fall back to recognized lang tag
          const fromLang = (e?.results?.[0]?.[0]?.lang ?? rec.lang ?? '').toString().toLowerCase();
          if (fromLang.startsWith('pt')) target = 'br';
          else if (fromLang.startsWith('en')) target = 'us';
          else if (fromLang.startsWith('es')) target = COUNTRY_SLUGS.find((s) => s !== currentSlug && (['mx','co','es','ar','py'] as CountrySlug[]).includes(s)) ?? 'mx';
        }
        if (target && target !== currentSlug) {
          setState('detected');
          setMessage(`${detected}: ${target.toUpperCase()}`);
          setTimeout(() => { window.location.href = `https://${target}.zymplo.com/`; }, 600);
        } else {
          setState('error');
          setMessage(noMatch);
        }
      };
      rec.onend = () => {
        if (state === 'listening') setState('idle');
      };
      rec.start();
    } catch {
      setState('error');
      setMessage(noMatch);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={start}
        aria-label={tooltip}
        title={tooltip}
        className={`w-9 h-9 rounded-full transition flex items-center justify-center border ${state === 'listening' ? 'bg-turquesa text-white border-turquesa animate-pulse' : 'bg-white/60 hover:bg-turquesa/10 border-ink/10 hover:border-turquesa/40 text-slate hover:text-turquesa-deeper'}`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="2" width="6" height="12" rx="3"/>
          <path d="M5 10v2a7 7 0 0014 0v-2"/>
          <path d="M12 19v3"/>
        </svg>
      </button>

      {(state === 'listening' || state === 'detected' || state === 'error') && message && (
        <div className="absolute right-0 top-full mt-2 z-30 bg-ink text-paper text-xs font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap border border-white/10">
          {message}
        </div>
      )}
    </div>
  );
}
