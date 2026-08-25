(() => {
  const BASE = './';
  const certificates = [
    'cert-hplife-1.jpg',
    'cert-hplife-2.jpg',
    'cert-ibm-1.jpg',
    'cert-ieee.jpg',
    'cert-iti-1.jpg',
    'cert-iti-2.jpg',
    'cert-iti-3.jpg',
    'cert-itlegend.jpg',
    'cert-nti.jpg',
    'cert-sololearn-1.jpg',
    'cert-sololearn-2.jpg',
    'cert-sololearn-3.jpg',
    'cert-tuwaiq.jpg'
  ];

  function addProfileImage() {
    const section = document.getElementById('home');
    if (!section || section.dataset.profileReady === 'true') return;
    const candidates = Array.from(section.querySelectorAll('span')).filter(el => el.textContent?.trim() === 'AM');
    const target = candidates[candidates.length - 1];
    if (!target) return;
    const img = document.createElement('img');
    img.src = `${BASE}profile.jpg`;
    img.alt = 'Antton Mikhael';
    img.className = target.className.replace(/text-7xl|sm:text-8xl|bg-gradient-to-br|from-cyan-300|via-violet-300|to-pink-300|bg-clip-text|text-transparent/g, '').trim();
    img.classList.add('w-full', 'h-full', 'object-cover');
    target.replaceWith(img);
    section.dataset.profileReady = 'true';
  }

  function addCertificateButtons() {
    const section = document.getElementById('certifications');
    if (!section || section.dataset.certReady === 'true') return;
    const cards = Array.from(section.querySelectorAll('div')).filter(el =>
      el.classList.contains('rounded-xl') &&
      el.classList.contains('border') &&
      el.classList.contains('bg-white/4')
    );
    if (cards.length !== certificates.length) return;

    cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'View Certificate';
      button.className = 'mt-3 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all duration-200 hover:bg-cyan-500/20 hover:border-cyan-400/50';
      button.addEventListener('click', () => openCertificate(certificates[index]));
      card.appendChild(button);
    });
    section.dataset.certReady = 'true';
  }

  function openCertificate(file) {
    closeCertificate();
    const overlay = document.createElement('div');
    overlay.id = 'certificate-viewer';
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/90 p-4 backdrop-blur-md';
    overlay.innerHTML = `
      <div class="relative flex max-h-[94vh] max-w-6xl flex-col items-center rounded-2xl border border-white/10 bg-[#071426] p-3 shadow-2xl" role="dialog" aria-modal="true">
        <button type="button" aria-label="Close certificate" class="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white transition hover:bg-cyan-500 hover:text-slate-950">✕</button>
        <img src="${BASE}${file}" alt="Certificate" class="max-h-[82vh] max-w-[90vw] rounded-xl object-contain" />
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('button').addEventListener('click', closeCertificate);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeCertificate(); });
    document.body.style.overflow = 'hidden';
  }

  function closeCertificate() {
    document.getElementById('certificate-viewer')?.remove();
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertificate(); });

  const CONTACT_API_URL = 'https://contact-api.toni-11.workers.dev';
  const TURNSTILE_SITE_KEY = '0x4AAAAAAEaPM7zSCZZp-rYC';
  let contactStep = 1;
  let contactEmail = '';
  let contactOtp = '';
  let contactName = '';
  let contactMessage = '';
  let contactHoneypot = '';
  let turnstileToken = '';
  let turnstileWidgetId = null;
  let contactLoading = false;
  let contactSuccessTimer = null;

  const CONTACT_INPUT_CLASS = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all';
  const CONTACT_BUTTON_CLASS = 'w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none';

  function updateContactSubmitButton(form) {
    const button = form?.querySelector('button[type="submit"]');
    if (!button) return;

    let disabled = contactLoading;
    if (contactStep === 1) disabled ||= !turnstileToken || !contactEmail.trim();
    if (contactStep === 2) disabled ||= !/^\d{6}$/.test(contactOtp);
    if (contactStep === 3) disabled ||= !contactName.trim() || !contactMessage.trim();

    button.disabled = disabled;
    button.textContent = contactStep === 1
      ? (contactLoading ? 'Sending Verification Code...' : 'Continue')
      : contactStep === 3
        ? (contactLoading ? 'Sending Message...' : 'Send Message')
        : 'Continue';
  }

  window.onTurnstileSuccess = token => {
    turnstileToken = token || '';
    const form = document.querySelector('#contact form');
    if (form) {
      clearContactError(form);
      updateContactSubmitButton(form);
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function getApiError(response) {
    try {
      const data = await response.json();
      if (data && typeof data.message === 'string') return data.message;
      if (data && typeof data.error === 'string') return data.error;
    } catch (_) {
      // Fall back to a generic message for non-JSON responses.
    }
    return 'Something went wrong. Please try again.';
  }

  function setContactError(form, message) {
    let error = form.querySelector('[data-contact-error]');
    if (!error) {
      error = document.createElement('div');
      error.dataset.contactError = 'true';
      error.className = 'rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300';
      error.setAttribute('role', 'alert');
      form.appendChild(error);
    }
    error.textContent = message;
  }

  function clearContactError(form) {
    form.querySelector('[data-contact-error]')?.remove();
  }

  function setContactSuccess(form, message) {
    let success = form.querySelector('[data-contact-success]');
    if (!success) {
      success = document.createElement('div');
      success.dataset.contactSuccess = 'true';
      success.className = 'rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300';
      success.setAttribute('role', 'status');
      form.appendChild(success);
    }
    success.textContent = message;
  }

  function removeTurnstile() {
    if (turnstileWidgetId !== null && window.turnstile?.remove) {
      try {
        window.turnstile.remove(turnstileWidgetId);
      } catch (_) {
        // Ignore cleanup errors from Turnstile.
      }
    }
    turnstileWidgetId = null;
  }

  function renderTurnstile(form) {
    const container = form.querySelector('[data-turnstile-container]');
    if (!container || turnstileWidgetId !== null || !window.turnstile?.render) return;

    const widget = container.querySelector('.cf-turnstile');
    if (!widget) return;

    turnstileWidgetId = window.turnstile.render(widget, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: 'onTurnstileSuccess',
    });
  }

  function renderContactForm(form) {
    if (!form || !form.closest('#contact')) return;

    const heading = form.closest('.p-8')?.querySelector('h3');
    if (heading) heading.textContent = 'Send a Message';

    clearContactError(form);
    form.querySelector('[data-contact-success]')?.remove();

    if (contactStep === 1) {
      removeTurnstile();
      form.innerHTML = `
        <div class="flex items-center gap-2 mb-6" data-contact-progress>
          ${[1, 2, 3].map(step => `
            <div class="flex items-center gap-2 flex-1">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === 1 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'border border-white/10 bg-white/5 text-slate-500'}">${step}</div>
              ${step < 3 ? '<div class="h-px flex-1 bg-white/10"></div>' : ''}
            </div>`).join('')}
        </div>

        <div>
          <label for="contact-email" class="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Email Address</label>
          <input id="contact-email" name="email" required type="email" class="${CONTACT_INPUT_CLASS}" placeholder="john@example.com" autocomplete="email" value="${escapeHtml(contactEmail)}" />
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.03] p-3 overflow-hidden" data-turnstile-container>
          <div class="cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}" data-callback="onTurnstileSuccess"></div>
        </div>

        <button type="submit" class="${CONTACT_BUTTON_CLASS}">Continue</button>
      `;

      const email = form.querySelector('#contact-email');
      email?.addEventListener('input', event => {
        contactEmail = event.target.value;
        if (turnstileToken && window.turnstile?.reset && turnstileWidgetId !== null) {
          try { window.turnstile.reset(turnstileWidgetId); } catch (_) {}
        }
        turnstileToken = '';
        updateContactSubmitButton(form);
      });

      updateContactSubmitButton(form);
      if (window.turnstile?.render) {
        renderTurnstile(form);
      } else {
        setTimeout(() => renderTurnstile(form), 300);
        setTimeout(() => renderTurnstile(form), 1000);
      }
      return;
    }

    if (contactStep === 2) {
      form.innerHTML = `
        <div class="flex items-center gap-2 mb-6" data-contact-progress>
          ${[1, 2, 3].map(step => `
            <div class="flex items-center gap-2 flex-1">
              <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step <= 2 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 'border border-white/10 bg-white/5 text-slate-500'}">${step}</div>
              ${step < 3 ? `<div class="h-px flex-1 ${step < 2 ? 'bg-cyan-500/60' : 'bg-white/10'}"></div>` : ''}
            </div>`).join('')}
        </div>

        <div>
          <label for="contact-otp" class="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Verification Code</label>
          <p class="mb-3 text-sm text-slate-400">Enter the 6-digit code sent to <span class="text-cyan-400">${escapeHtml(contactEmail)}</span>.</p>
          <input id="contact-otp" name="otp" required type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" class="${CONTACT_INPUT_CLASS} text-center text-lg font-semibold tracking-[0.35em]" placeholder="000000" autocomplete="one-time-code" value="${escapeHtml(contactOtp)}" />
          <p class="mt-2 text-xs text-slate-500">The verification code must contain exactly 6 digits.</p>
        </div>

        <button type="submit" class="${CONTACT_BUTTON_CLASS}">Continue</button>
        <button type="button" data-contact-back class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white">Back</button>
      `;

      const otp = form.querySelector('#contact-otp');
      otp?.addEventListener('input', event => {
        contactOtp = event.target.value.replace(/\D/g, '').slice(0, 6);
        event.target.value = contactOtp;
        updateContactSubmitButton(form);
      });

      updateContactSubmitButton(form);
      form.querySelector('[data-contact-back]')?.addEventListener('click', () => {
        contactStep = 1;
        turnstileToken = '';
        renderContactForm(form);
      });
      return;
    }

    form.innerHTML = `
      <div class="flex items-center gap-2 mb-6" data-contact-progress>
        ${[1, 2, 3].map(step => `
          <div class="flex items-center gap-2 flex-1">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white">${step}</div>
            ${step < 3 ? '<div class="h-px flex-1 bg-cyan-500/60"></div>' : ''}
          </div>`).join('')}
      </div>

      <div>
        <label for="contact-name" class="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Your Name</label>
        <input id="contact-name" name="name" required type="text" class="${CONTACT_INPUT_CLASS}" placeholder="John Doe" autocomplete="name" value="${escapeHtml(contactName)}" />
      </div>

      <div>
        <label for="contact-message" class="block text-xs text-slate-400 mb-1.5 uppercase tracking-wide">Message</label>
        <textarea id="contact-message" name="message" required rows="5" class="${CONTACT_INPUT_CLASS} resize-none" placeholder="Tell me about an opportunity, project, or collaboration...">${escapeHtml(contactMessage)}</textarea>
      </div>

      <div class="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label for="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabindex="-1" autocomplete="off" value="${escapeHtml(contactHoneypot)}" />
      </div>

      <button type="submit" class="${CONTACT_BUTTON_CLASS}">Send Message</button>
      <button type="button" data-contact-back class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white">Back</button>
    `;

    form.querySelector('#contact-name')?.addEventListener('input', event => {
      contactName = event.target.value;
      updateContactSubmitButton(form);
    });

    form.querySelector('#contact-message')?.addEventListener('input', event => {
      contactMessage = event.target.value;
      updateContactSubmitButton(form);
    });

    form.querySelector('#contact-website')?.addEventListener('input', event => {
      contactHoneypot = event.target.value;
    });

    updateContactSubmitButton(form);
    form.querySelector('[data-contact-back]')?.addEventListener('click', () => {
      contactStep = 2;
      renderContactForm(form);
    });
  }

  async function handleContactSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.closest('#contact')) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (contactLoading) return;
    clearContactError(form);

    if (contactStep === 1) {
      const email = form.querySelector('#contact-email')?.value?.trim() || contactEmail;
      contactEmail = email;

      if (!email) {
        setContactError(form, 'Please enter your email address.');
        return;
      }

      if (!turnstileToken) {
        setContactError(form, 'Please complete the security verification.');
        return;
      }

      contactLoading = true;
      updateContactSubmitButton(form);

      try {
        const response = await fetch(`${CONTACT_API_URL}/api/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, turnstileToken }),
        });

        if (!response.ok) throw new Error(await getApiError(response));

        contactStep = 2;
        contactOtp = '';
        contactLoading = false;
        removeTurnstile();
        renderContactForm(form);
      } catch (error) {
        contactLoading = false;
        updateContactSubmitButton(form);
        setContactError(form, error instanceof Error ? error.message : 'Unable to send the verification code. Please try again.');
      }
      return;
    }

    if (contactStep === 2) {
      const otp = form.querySelector('#contact-otp')?.value?.trim() || contactOtp;
      if (!/^\d{6}$/.test(otp)) {
        setContactError(form, 'Please enter the 6-digit verification code.');
        return;
      }

      contactOtp = otp;
      contactStep = 3;
      renderContactForm(form);
      return;
    }

    contactName = form.querySelector('#contact-name')?.value?.trim() || contactName;
    contactMessage = form.querySelector('#contact-message')?.value?.trim() || contactMessage;
    contactHoneypot = form.querySelector('#contact-website')?.value || contactHoneypot;

    if (!contactName) {
      setContactError(form, 'Please enter your name.');
      return;
    }

    if (!contactMessage) {
      setContactError(form, 'Please enter your message.');
      return;
    }

    contactLoading = true;
    updateContactSubmitButton(form);

    try {
      const response = await fetch(`${CONTACT_API_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          otp: contactOtp,
          honeypot: contactHoneypot,
        }),
      });

      if (!response.ok) throw new Error(await getApiError(response));

      contactLoading = false;
      setContactSuccess(form, 'Your message has been sent successfully. Thank you for reaching out!');

      contactSuccessTimer = window.setTimeout(() => {
        contactStep = 1;
        contactEmail = '';
        contactOtp = '';
        contactName = '';
        contactMessage = '';
        contactHoneypot = '';
        turnstileToken = '';
        removeTurnstile();
        if (contactSuccessTimer) clearTimeout(contactSuccessTimer);
        renderContactForm(form);
      }, 3000);
    } catch (error) {
      contactLoading = false;
      updateContactSubmitButton(form);
      setContactError(form, error instanceof Error ? error.message : 'Unable to send your message. Please try again.');
    }
  }

  function addContactForm() {
    const section = document.getElementById('contact');
    if (!section) return;

    const form = section.querySelector('form');
    if (!form || form.dataset.contactReady === 'true') return;

    form.dataset.contactReady = 'true';
    form.addEventListener('submit', handleContactSubmit, true);
    renderContactForm(form);
  }

  function run() {
    addProfileImage();
    addCertificateButtons();
    addContactForm();
  }

  run();
  const observer = new MutationObserver(run);
  observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
})();
