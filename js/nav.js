(function(){
  const btn  = document.querySelector('.nav-toggle');
  const nav  = document.getElementById('primary-nav') || document.querySelector('.nav-links');
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);
  }
  if (!btn || !nav) return;

  function setNavTop(){
    const header = document.querySelector('.site-header');
    const promo  = document.querySelector('.promo-ribbon');
    let top = 0;
    const ignorePromo = document.body.classList.contains('menu-open');
    if (!ignorePromo && promo && promo.offsetParent !== null) {
      top += promo.getBoundingClientRect().height;
    }
    if (header) top += header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-top', top + 'px');
  }

  function openMenu(){
    document.body.classList.add('menu-open'); // disable promo sticky
    setNavTop();
    nav.classList.add('is-open');
    overlay.hidden = false;
    btn.setAttribute('aria-expanded','true');
    btn.setAttribute('aria-label','Close menu');
    document.body.classList.add('nav-open');
    const first = nav.querySelector('a'); if (first) first.focus();
  }

  function closeMenu(){
    nav.classList.remove('is-open');
    overlay.hidden = true;
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Open menu');
    document.body.classList.remove('nav-open');
    document.body.classList.remove('menu-open'); // restore promo sticky
  }

  function toggle(){
    nav.classList.contains('is-open') ? closeMenu() : openMenu();
  }

  btn.addEventListener('click', toggle);
  overlay.addEventListener('click', closeMenu);
  nav.addEventListener('click', e => { if (e.target.tagName === 'A') closeMenu(); });

  ['resize','orientationchange','scroll'].forEach(ev =>
    window.addEventListener(ev, () => {
      if (nav.classList.contains('is-open')) setNavTop();
    })
  );

  closeMenu(); // ensure closed on load
})();
