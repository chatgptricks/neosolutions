(() => {
  'use strict';

  const form = document.querySelector('.lead-capture__form');
  if (!form) return;

  const submitBtn = form.querySelector('.lead-capture__submit');
  const statusEl = form.querySelector('[data-form-status]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Check honeypot for spam bots
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      return; // Silent fail for bots
    }

    const endpoint = form.getAttribute('action');
    const isCustomEndpoint = endpoint && endpoint !== '#' && endpoint !== '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = window.currentLang === 'es' ? 'Enviando...' : 'Sending...';
    }

    if (isCustomEndpoint) {
      try {
        const formData = new FormData(form);
        const response = await fetch(endpoint, {
          method: form.method || 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Submission failed');
      } catch (err) {
        console.warn('Form endpoint submit error:', err);
      }
    }

    // Success feedback
    form.classList.add('is-submitted');
    if (statusEl) {
      statusEl.hidden = false;
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = window.currentLang === 'es' ? 'Enviado ✓' : 'Sent ✓';
    }

    form.reset();
  });
})();
