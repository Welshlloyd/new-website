
// Accessible mobile nav: toggle + overlay + focus management
(function(){
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav') || document.querySelector('.nav-links');
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }
  if (!btn || !nav || !overlay) return;

  const focusables = () => Array.from(nav.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])'));
  let lastFocused = null;

  function openMenu(){
    lastFocused = document.activeElement;
    nav.classList.add('is-open');
    btn.setAttribute('aria-expanded','true');
    btn.setAttribute('aria-label','Close menu');
    overlay.hidden = false;
    document.body.classList.add('nav-open');
    const f = focusables()[0];
    if (f) f.focus();
  }
  function closeMenu(){
    nav.classList.remove('is-open');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Open menu');
    overlay.hidden = true;
    document.body.classList.remove('nav-open');
    if (lastFocused) lastFocused.focus();
  }
  function toggleMenu(){ (nav.classList.contains('is-open') ? closeMenu : openMenu)(); }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);
  nav.addEventListener('click', (e)=>{ if(e.target.tagName === 'A' && nav.classList.contains('is-open')) closeMenu(); });
  document.addEventListener('keydown', (e)=>{
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    else if (e.key === 'Tab') {
      const items = focusables(); if (!items.length) return;
      const first = items[0], last = items[items.length-1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Ensure closed on load
  closeMenu();
})();
