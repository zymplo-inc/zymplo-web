import { useEffect, useState } from 'react';

const KEY = 'zymplo_consent_v1';

/** CookieBanner — solo renderizado en EU (gate desde CountryLayout). */
export default function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);
  if (!show) return null;
  const accept = (consent: 'all' | 'essential') => {
    localStorage.setItem(KEY, JSON.stringify({ consent, ts: Date.now() }));
    setShow(false);
  };
  return (
    <div role="dialog" aria-label="Cookies" className="fixed bottom-4 left-4 right-4 md:left-auto md:max-w-md z-50 bg-ink text-paper rounded-2xl p-5 shadow-2xl border border-paper/10">
      <div className="text-sm font-semibold mb-2">🍪 Cookies</div>
      <p className="text-xs text-paper/70">
        Usamos cookies esenciales para que el sitio funcione. Con tu consentimiento, también medimos uso para mejorar el producto. GDPR.
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <button onClick={() => accept('all')} className="bg-turquesa hover:bg-turquesa-dark text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">Aceptar todo</button>
        <button onClick={() => accept('essential')} className="bg-paper/10 hover:bg-paper/15 text-paper text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">Solo esenciales</button>
      </div>
    </div>
  );
}
