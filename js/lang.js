// Language translation database
const strings = {
  en: {
    visitorWaiting: "Waiting for visitor...",
    userTyping: "User typing...",
    neoResponding: "Neo responding...",
    awaitingReply: "Awaiting reply...",
    neoQualifying: "Neo qualifying...",
    qualifyingLead: "Qualifying lead...",
    bookingCall: "Booking call...",
    callBookedComplete: "Call booked ✓",
    leadQualifiedBooked: "Lead qualified & booked ✓",
    igBadgeVal7: "7",
    igBadgeVal8: "8"
  },
  es: {
    visitorWaiting: "Esperando visitante...",
    userTyping: "Usuario escribiendo...",
    neoResponding: "Neo respondiendo...",
    awaitingReply: "Esperando respuesta...",
    neoQualifying: "Neo calificando...",
    qualifyingLead: "Calificando lead...",
    bookingCall: "Agendando llamada...",
    callBookedComplete: "Llamada agendada ✓",
    leadQualifiedBooked: "Lead calificado y agendado ✓",
    igBadgeVal7: "7",
    igBadgeVal8: "8"
  }
};

const pageMeta = {
  en: {
    title: "Neo Solutions — AI agents that respond, qualify, and book your leads",
    description: "Neo responds to your leads on WhatsApp, Instagram, and Facebook in seconds — qualifying, following up, and booking calls automatically, 24/7.",
    ogLocale: "en_US"
  },
  es: {
    title: "Neo Solutions — Agentes de IA que responden, califican y agendan tus leads",
    description: "Neo responde a tus leads en WhatsApp, Instagram y Facebook en segundos — calificando, dando seguimiento y agendando llamadas automáticamente, 24/7.",
    ogLocale: "es_ES"
  }
};

const structuredData = {
  en: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Which channels can Neo handle?",
        "acceptedAnswer": { "@type": "Answer", "text": "Neo is designed for inbound leads from WhatsApp, Instagram, Facebook, and website forms. During setup, we define which channels should be connected first." }
      },
      {
        "@type": "Question",
        "name": "What do you need from my business?",
        "acceptedAnswer": { "@type": "Answer", "text": "We need your offer details, common questions, qualification criteria, calendar rules, and examples of how your team normally replies to leads." }
      },
      {
        "@type": "Question",
        "name": "Can a human take over a conversation?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. We define the handoff rules with you so Neo knows when to qualify, when to book, and when to send the lead to your team." }
      },
      {
        "@type": "Question",
        "name": "How long does it take to go live?",
        "acceptedAnswer": { "@type": "Answer", "text": "Most launches are scoped around a 7-day window once we have the required business information, channel access, and approval on the response flow." }
      },
      {
        "@type": "Question",
        "name": "Can Neo respond in Spanish and English?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. The agent can be trained for your language needs, including bilingual lead flows, tone rules, and channel-specific response patterns." }
      }
    ]
  },
  es: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Qué canales puede manejar Neo?",
        "acceptedAnswer": { "@type": "Answer", "text": "Neo está diseñado para leads entrantes desde WhatsApp, Instagram, Facebook y formularios del sitio web. Durante la configuración definimos qué canales deben conectarse primero." }
      },
      {
        "@type": "Question",
        "name": "¿Qué necesitan de mi negocio?",
        "acceptedAnswer": { "@type": "Answer", "text": "Necesitamos detalles de tu oferta, preguntas frecuentes, criterios de calificación, reglas de agenda y ejemplos de cómo tu equipo responde normalmente a los leads." }
      },
      {
        "@type": "Question",
        "name": "¿Un humano puede tomar una conversación?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí. Definimos contigo las reglas de entrega para que Neo sepa cuándo calificar, cuándo agendar y cuándo pasar el lead a tu equipo." }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tarda en salir en vivo?",
        "acceptedAnswer": { "@type": "Answer", "text": "La mayoría de lanzamientos se estructuran alrededor de una ventana de 7 días una vez que tenemos la información del negocio, acceso a canales y aprobación del flujo de respuestas." }
      },
      {
        "@type": "Question",
        "name": "¿Neo puede responder en español e inglés?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sí. El agente puede entrenarse para tus necesidades de idioma, incluyendo flujos bilingües, reglas de tono y patrones de respuesta por canal." }
      }
    ]
  }
};

const supportedLangs = new Set(['en', 'es']);
const storageKey = 'neo-lang';

const normalizeLang = (value) => {
  if (!value) return 'en';

  const lower = String(value).toLowerCase();
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('en')) return 'en';

  return supportedLangs.has(lower) ? lower : 'en';
};

const getStoredLang = () => {
  try {
    const storedLang = window.localStorage.getItem(storageKey);
    return storedLang ? normalizeLang(storedLang) : null;
  } catch {
    return null;
  }
};

const getUrlLang = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    return urlLang ? normalizeLang(urlLang) : null;
  } catch {
    return null;
  }
};

const getBrowserLang = () => {
  const browserLang = window.navigator?.languages?.[0] || window.navigator?.language || 'en';
  return normalizeLang(browserLang);
};

const resolveInitialLang = () => getUrlLang() || getStoredLang() || getBrowserLang();

const syncLocalizedAttributes = (nextLang) => {
  const attrs = ['aria-label', 'alt', 'title', 'placeholder'];

  attrs.forEach(attr => {
    document.querySelectorAll(`[data-${nextLang}-${attr}]`).forEach(el => {
      const val = el.getAttribute(`data-${nextLang}-${attr}`);
      if (val) {
        el.setAttribute(attr, val);
      }
    });
  });
};

const syncMeta = (nextLang) => {
  const meta = pageMeta[nextLang] || pageMeta.en;
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', meta.description);
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', meta.ogLocale);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', meta.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', meta.description);

  const schema = document.getElementById('faq-schema');
  if (schema && structuredData[nextLang]) {
    schema.textContent = JSON.stringify(structuredData[nextLang]);
  }
};

const syncUrlLang = (nextLang) => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', nextLang);
    window.history.replaceState({}, '', url);
  } catch {
    // Ignore URL update failures.
  }
};

// Set default lang
window.currentLang = resolveInitialLang();

const setLanguage = (lang, { persist = true } = {}) => {
  const nextLang = normalizeLang(lang);

  window.currentLang = nextLang;
  document.documentElement.lang = nextLang;

  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + nextLang);
    if (val) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    }
  });

  syncLocalizedAttributes(nextLang);
  
  // Localize browser tab title, search/social snippets, and FAQ schema.
  syncMeta(nextLang);

  // Toggle language switcher button states
  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');
  if (btnEn) {
    btnEn.classList.toggle('is-active', nextLang === 'en');
    btnEn.setAttribute('aria-pressed', String(nextLang === 'en'));
  }
  if (btnEs) {
    btnEs.classList.toggle('is-active', nextLang === 'es');
    btnEs.setAttribute('aria-pressed', String(nextLang === 'es'));
  }
  
  // Save preference
  if (persist) {
    try {
      window.localStorage.setItem(storageKey, nextLang);
    } catch {
      // Ignore storage failures and keep the in-memory language state.
    }
    syncUrlLang(nextLang);
  }

  // Notify interactive simulation script to restart loop
  window.dispatchEvent(new CustomEvent('lang-change', { detail: { lang: nextLang } }));
};

// Expose globally for inline event handlers (onclick="setLanguage('...')")
window.strings = strings;
window.setLanguage = setLanguage;

// Initialize language state immediately so the page matches the browser
// preference on first paint, while preserving manual toggles afterward.
setLanguage(window.currentLang, { persist: false });
