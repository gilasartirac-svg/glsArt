(() => {
  const install = () => {
    const toolbar = document.querySelector('.home-hero .toolbar');
    if (!toolbar || toolbar.querySelector('[data-virtual-gallery-entry]')) return;
    const link = document.createElement('a');
    link.className = 'btn ghost';
    link.href = '/virtual-gallery/';
    link.dataset.virtualGalleryEntry = 'true';
    link.textContent = 'گالری مجازی سه‌بعدی';
    link.setAttribute('aria-label', 'ورود به گالری مجازی سه‌بعدی گیلاس آرت');
    toolbar.appendChild(link);
  };
  const app = document.getElementById('app');
  if (!app) return;
  install();
  new MutationObserver(install).observe(app, { childList: true, subtree: true });
})();
