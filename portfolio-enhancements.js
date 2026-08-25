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

  function run() {
    addProfileImage();
    addCertificateButtons();
  }

  run();
  const observer = new MutationObserver(run);
  observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
})();
