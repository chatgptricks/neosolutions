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

const getBrowserLang = () => {
  const browserLang = window.navigator?.languages?.[0] || window.navigator?.language || 'en';
  return normalizeLang(browserLang);
};

const resolveInitialLang = () => getStoredLang() || getBrowserLang();

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
  
  // Toggle language switcher button states
  const btnEn = document.getElementById('btn-en');
  const btnEs = document.getElementById('btn-es');
  if (btnEn) btnEn.classList.toggle('is-active', nextLang === 'en');
  if (btnEs) btnEs.classList.toggle('is-active', nextLang === 'es');
  
  // Save preference
  if (persist) {
    try {
      window.localStorage.setItem(storageKey, nextLang);
    } catch {
      // Ignore storage failures and keep the in-memory language state.
    }
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
