(function () {
  const STORAGE_KEY = 'nurtex_cookie_consent_v1';
  const hasStorage = (() => {
    try {
      localStorage.setItem('__nurtex_test', '1');
      localStorage.removeItem('__nurtex_test');
      return true;
    } catch (_) {
      return false;
    }
  })();

  function readConsent() {
    if (!hasStorage) return null;
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function saveConsent(value) {
    window.NURTEX_CONSENT = value;
    if (hasStorage) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('nurtex:consent', { detail: value }));
    if (value.analytics) loadAnalytics();
  }

  function addScript(src, attrs) {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    Object.entries(attrs || {}).forEach(([key, value]) => script.setAttribute(key, value));
    document.head.appendChild(script);
  }

  function loadAnalytics() {
    const gtmId = window.NURTEX_GTM_ID;
    const gaId = window.NURTEX_GA_ID;
    const plausibleDomain = window.NURTEX_PLAUSIBLE_DOMAIN;

    if (gtmId && !window.__NURTEX_GTM_LOADED__) {
      window.__NURTEX_GTM_LOADED__ = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      addScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
    }

    if (gaId && !window.__NURTEX_GA_LOADED__) {
      window.__NURTEX_GA_LOADED__ = true;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', gaId, { anonymize_ip: true });
      addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`);
    }

    if (plausibleDomain && !window.__NURTEX_PLAUSIBLE_LOADED__) {
      window.__NURTEX_PLAUSIBLE_LOADED__ = true;
      window.plausible = window.plausible || function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
      addScript('https://plausible.io/js/script.js', { 'data-domain': plausibleDomain });
    }
  }

  function injectStyles() {
    if (document.getElementById('nurtex-consent-style')) return;
    const style = document.createElement('style');
    style.id = 'nurtex-consent-style';
    style.textContent = `
      a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
        outline: 3px solid #ff3b30 !important;
        outline-offset: 3px !important;
      }
      .nurtex-cookie-banner {
        position: fixed;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 2147483000;
        max-width: 920px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 18px;
        align-items: center;
        padding: 18px 20px;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 12px;
        background: rgba(7, 8, 12, .96);
        color: #f5f7fa;
        box-shadow: 0 24px 70px rgba(0,0,0,.55);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        font-family: Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .nurtex-cookie-banner strong {
        display: block;
        margin-bottom: 4px;
        font-size: 15px;
      }
      .nurtex-cookie-banner p {
        margin: 0;
        color: #b5b7bd;
        font-size: 14px;
        line-height: 1.5;
      }
      .nurtex-cookie-banner a {
        color: #f5f7fa;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .nurtex-cookie-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .nurtex-cookie-actions button {
        border: 1px solid rgba(255,255,255,.22);
        border-radius: 8px;
        padding: 11px 14px;
        cursor: pointer;
        color: #f5f7fa;
        background: rgba(255,255,255,.06);
        font-weight: 800;
        font-size: 13px;
      }
      .nurtex-cookie-actions [data-consent="all"] {
        border-color: #ff3b30;
        background: #ff3b30;
      }
      @media (max-width: 768px) {
        .nurtex-cookie-banner {
          grid-template-columns: 1fr;
          bottom: 88px;
          padding: 16px;
        }
        .nurtex-cookie-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          justify-content: stretch;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    if (document.getElementById('nurtex-cookie-banner')) return;
    injectStyles();
    const banner = document.createElement('section');
    banner.id = 'nurtex-cookie-banner';
    banner.className = 'nurtex-cookie-banner';
    banner.setAttribute('aria-label', 'Ustawienia prywatności i cookies');
    banner.innerHTML = `
      <div>
        <strong>Prywatność na stronie NURTEX</strong>
        <p>Używamy niezbędnych ustawień strony oraz, za Twoją zgodą, analityki do mierzenia reklam i zapytań. Możesz wybrać tylko niezbędne. <a href="/polityka-prywatnosci/">Polityka prywatności</a></p>
      </div>
      <div class="nurtex-cookie-actions">
        <button type="button" data-consent="necessary">Tylko niezbędne</button>
        <button type="button" data-consent="all">Akceptuję</button>
      </div>
    `;
    banner.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-consent]');
      if (!button) return;
      const analytics = button.dataset.consent === 'all';
      saveConsent({ necessary: true, analytics, date: new Date().toISOString() });
      banner.remove();
    });
    document.body.appendChild(banner);
  }

  const existing = readConsent();
  if (existing) {
    window.NURTEX_CONSENT = existing;
    if (existing.analytics) loadAnalytics();
    injectStyles();
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner, { once: true });
  } else {
    showBanner();
  }
})();
