import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Country } from '@data/countries';
import type { Dict } from '@i18n/index';

interface Props { slug: string; country: Country; dict: Dict }

/** ChatDemo — WhatsApp simulator interactivo. Cycle infinito. */
export default function ChatDemo({ country, dict }: Props) {
  const messages = dict.chat.messages;
  const [shown, setShown] = useState<number>(0);
  const [typing, setTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = async () => {
      for (let i = 0; i < messages.length; i++) {
        if (cancelled) return;
        const isBot = messages[i].from === 'bot';
        if (isBot) {
          setTyping(true);
          await new Promise((r) => timers.push(setTimeout(r, 1400)));
          if (cancelled) return;
          setTyping(false);
        } else {
          await new Promise((r) => timers.push(setTimeout(r, 800)));
        }
        setShown((s) => s + 1);
        await new Promise((r) => timers.push(setTimeout(r, 600)));
      }
      await new Promise((r) => timers.push(setTimeout(r, 3000)));
      if (!cancelled) { setShown(0); run(); }
    };
    run();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [messages]);

  return (
    <section id="chatdemo" className="bg-paper py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquesa-paler text-turquesa-deeper text-xs font-bold uppercase tracking-widest">demo · 90s</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold tracking-tightest">{dict.chat.title}</h2>
          <p className="mt-4 text-lg text-mute max-w-md">{country.personas[0].name}, {country.personas[0].role}, conversa com o Zymplo como se fosse a sua secretária.</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          {/* Phone bezel */}
          <div className="rounded-[2.4rem] bg-ink p-3 shadow-[0_30px_80px_-20px_rgba(10,11,20,0.4)]">
            <div className="rounded-[1.9rem] bg-[#0b141a] overflow-hidden">
              {/* WA header */}
              <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-turquesa flex items-center justify-center text-white font-bold text-sm">Z</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">Zymplo</div>
                  <div className="text-[#8696a0] text-xs">online</div>
                </div>
              </div>
              {/* Chat area */}
              <div ref={containerRef} className="px-3 py-4 min-h-[360px] max-h-[420px] overflow-y-auto bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%230b141a%22 width=%22200%22 height=%22200%22/><circle cx=%22100%22 cy=%22100%22 r=%2230%22 fill=%22%23111c22%22 opacity=%220.5%22/></svg>')] flex flex-col gap-2">
                {messages.slice(0, shown).map((m, i) => (
                  <Bubble key={`${shown}-${i}`} from={m.from as 'user' | 'bot'} text={m.text} />
                ))}
                {typing && <TypingDots />}
              </div>
              {/* Input */}
              <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2">
                <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-[#8696a0] text-sm">Mensagem</div>
                <div className="w-9 h-9 rounded-full bg-turquesa flex items-center justify-center text-white">▶</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bubble({ from, text }: { from: 'user' | 'bot'; text: string }) {
  const isBot = from === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}
      className={`max-w-[78%] px-3 py-2 rounded-lg text-sm ${isBot ? 'bg-[#202c33] text-white self-start rounded-bl-sm' : 'bg-[#005c4b] text-white self-end rounded-br-sm'}`}
    >
      {text}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="self-start bg-[#202c33] px-3 py-2 rounded-lg rounded-bl-sm flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"
          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </div>
  );
}
