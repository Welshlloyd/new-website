
// --- Unlimited Promo Kit JS (drop-in) ---
(function(){
  // ===== SETTINGS =====
  const PROMO_CODE = window.UNL_PROMO_CODE || 'UNLIMITED50';
  const PROMO_END_ISO = window.UNL_PROMO_END_ISO || null; // e.g. '2025-10-31T23:59:59'
  const CHECKOUT_BASE = window.UNL_CHECKOUT_BASE || 'https://woofofwalkstreet.com/checkout/unlimited';

  // ===== Helpers =====
  const $ = sel => document.querySelector(sel);
  function fmtCurrency(value, currency){
    try {
      return new Intl.NumberFormat('en-AU', { style:'currency', currency: currency || 'AUD'}).format(value);
    } catch(e){ return '$' + value.toFixed(2); }
  }
  function getParam(name){
    const m = new URLSearchParams(location.search).get(name);
    return m ? decodeURIComponent(m) : null;
  }
  function setText(id, txt){ const el = document.getElementById(id); if(el) el.textContent = txt; }

  // ===== Price rendering =====
  function renderPrice(containerIdPrefix){
    const container = document.getElementById(containerIdPrefix);
    if(!container) return;
    const base = parseFloat(container.getAttribute('data-base-price') || '0');
    const currency = container.getAttribute('data-currency') || 'AUD';
    const promo = +(base/2).toFixed(2);
    const map = {
      'plan-unlimited': {promo:'unlPromoPrice', base:'unlBasePrice'},
      'unlimited-hero': {promo:'unlPromoPrice2', base:'unlBasePrice2'}
    };
    const ids = map[containerIdPrefix];
    if(!ids) return;
    setText(ids.promo, fmtCurrency(promo, currency) + ' / mo');
    setText(ids.base, fmtCurrency(base, currency));
  }
  ['plan-unlimited','unlimited-hero'].forEach(renderPrice);

  // ===== Referral capture =====
  const urlRef = getParam('ref');
  if(urlRef){ try { localStorage.setItem('wow_ref', urlRef); } catch(e){} }
  const refInput = $('#refInput');
  if(refInput){
    const savedRef = localStorage.getItem('wow_ref');
    if(savedRef && !refInput.value) refInput.value = savedRef;
    refInput.addEventListener('input', () => {
      try { localStorage.setItem('wow_ref', refInput.value.trim()); } catch(e){}
    });
  }

  // ===== Build checkout URL =====
  function buildCheckoutUrl(){
    const ref = (refInput && refInput.value.trim()) || localStorage.getItem('wow_ref') || '';
    const usp = new URLSearchParams();
    usp.set('plan','unlimited');
    usp.set('coupon', PROMO_CODE);
    if(ref) usp.set('ref', ref);
    usp.set('utm_source','website');
    usp.set('utm_medium','cta');
    usp.set('utm_campaign','unlimited50');
    return CHECKOUT_BASE + '?' + usp.toString();
  }

  // ===== Bind CTAs =====
  ['unlCta','unlCta2'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('click', function(e){
      e.preventDefault();
      const url = buildCheckoutUrl();
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({event:'promo_click', plan:'unlimited', coupon:PROMO_CODE, ref:localStorage.getItem('wow_ref')||''});
      window.location.href = url;
    });
  });

  // ===== Countdown (optional) =====
  const timerEl = document.getElementById('promoTimer');
  if(PROMO_END_ISO && timerEl){
    const end = new Date(PROMO_END_ISO);
    function tick(){
      const now = new Date();
      const diff = end - now;
      if(diff <= 0){ timerEl.textContent = ' — ends soon!'; return; }
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      timerEl.textContent = ` — ends in ${d}d ${h}h ${m}m`;
      requestAnimationFrame(()=>setTimeout(tick, 60000));
    }
    tick();
  }
})();
