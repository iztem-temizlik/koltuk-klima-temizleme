/* İZTEM GA4: consent-based page and contact-button measurement. */
(function () {
  'use strict';
  if (window.iztemMeasurementLoaded) return;
  window.iztemMeasurementLoaded = true;
  const measurementId = 'G-2502QCTWEQ';
  const storageKey = 'iztem.analytics-consent.v1';
  const production = ['iztem.com.tr', 'www.iztem.com.tr'].includes(location.hostname);
  let choice = null;
  let started = false;
  let returnFocus = null;
  try { choice = localStorage.getItem(storageKey); } catch (_) { /* Site remains usable without storage. */ }
  const enabled = () => production && choice === 'granted';
  function gtag() { window.dataLayer.push(arguments); }
  function start() {
    if (!enabled() || started) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    gtag('js', new Date());
    // Do not attach query strings, neighbourhoods, message contents or form values.
    let referrer = '';
    try { const u = new URL(document.referrer); referrer = u.origin + u.pathname; } catch (_) {}
    gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: location.origin + location.pathname,
      page_referrer: referrer
    });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(tag);
  }
  function position(anchor) {
    if (anchor.id === 'quote-link') return 'quote_form';
    if (anchor.closest('.mobile-actions,.mobile-bar,.floating-wa')) return 'mobile_contact';
    if (anchor.closest('header')) return 'header';
    if (anchor.closest('footer')) return 'footer';
    if (anchor.closest('.hero,.service-hero,.hero-section')) return 'hero';
    return 'content';
  }
  document.addEventListener('click', function (event) {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor || event.defaultPrevented) return;
    let url;
    try { url = new URL(anchor.href, location.href); } catch (_) { return; }
    const whatsapp = url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com'].includes(url.hostname);
    const phone = url.protocol === 'tel:';
    if (!whatsapp && !phone) return;
    if (enabled() && started) {
      gtag('event', whatsapp ? 'whatsapp_click' : 'phone_click', {
        send_to: measurementId,
        contact_position: position(anchor),
        page_path: location.pathname,
        transport_type: 'beacon'
      });
    }
    // Form messages stay outside href, so automatic outbound-link measurement cannot read them.
    if (whatsapp && anchor.dataset.waMessage && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      window.open('https://wa.me/905438108096?text=' + encodeURIComponent(anchor.dataset.waMessage), '_blank', 'noopener,noreferrer');
    }
  });
  function clearCookies() {
    document.cookie.split(';').forEach(function (part) {
      const name = part.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      ['', '; domain=iztem.com.tr', '; domain=.iztem.com.tr', '; domain=www.iztem.com.tr'].forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + domain + '; SameSite=Lax';
      });
    });
  }
  function buildPreferences() {
    const style = document.createElement('style');
    style.textContent = '#iztem-consent{position:fixed;z-index:1000;left:16px;bottom:18px;width:370px;max-width:calc(100vw - 32px);padding:19px;background:#fff;color:#18211b;border:1px solid #ccd5cd;border-radius:16px;box-shadow:0 8px 35px #18211b26;font:14px/1.55 Arial,sans-serif}#iztem-consent[hidden]{display:none}#iztem-consent h2{font-size:18px;line-height:1.3;letter-spacing:normal;margin:0 0 9px}#iztem-consent p{color:#435047;font-size:13px;margin:0 0 14px}#iztem-consent .choices{display:flex;gap:10px}#iztem-consent button{flex:1;min-height:44px;background:#fff;color:#18211b;border:1px solid #a7b4a9;border-radius:9px;padding:9px;font:bold 13px Arial,sans-serif;cursor:pointer}#iztem-consent button:last-child{background:#ffd22f}#iztem-consent button:focus-visible,#iztem-measurement-settings:focus-visible{outline:3px solid #867000;outline-offset:3px}#iztem-measurement-settings{display:block;margin:18px auto;padding:8px 13px;min-height:44px;border:1px solid #d1d9d2;border-radius:8px;background:white;color:#33483a;font:13px Arial,sans-serif;cursor:pointer}@media(max-width:780px){#iztem-consent{left:10px;bottom:calc(76px + env(safe-area-inset-bottom));padding:12px 14px;max-width:calc(100vw - 20px);max-height:calc(100dvh - 175px);overflow:auto}#iztem-consent h2{font-size:15px;margin:0 0 5px}#iztem-consent p{font-size:12px;line-height:1.45;margin:0 0 9px}#iztem-consent button{min-height:40px}#iztem-measurement-settings{margin-bottom:105px}}';
    document.head.appendChild(style);
    const box = document.createElement('section');
    box.id = 'iztem-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-labelledby', 'iztem-consent-title');
    box.innerHTML = '<h2 id="iztem-consent-title">Ziyaret ölçümü tercihiniz</h2><p>Google Analytics ile ziyaretleri ve iletişim düğmesi tıklamalarını ölçmemize izin verir misiniz? Ölçüm çerezleri onayınızla kullanılır. Mesaj içeriğiniz ölçüme eklenmez. Tercihinizi sayfanın altından değiştirebilirsiniz.</p><div class="choices"><button type="button" data-choice="denied">İzin verme</button><button type="button" data-choice="granted">İzin ver</button></div>';
    box.hidden = choice === 'granted' || choice === 'denied';
    box.addEventListener('click', function (event) {
      const button = event.target.closest('button[data-choice]');
      if (!button) return;
      const wasStarted = started;
      choice = button.dataset.choice;
      try { localStorage.setItem(storageKey, choice); } catch (_) {}
      box.hidden = true;
      if (choice === 'granted') {
        window['ga-disable-' + measurementId] = false;
        if (started) gtag('consent', 'update', { analytics_storage: 'granted' });
        start();
      } else {
        window['ga-disable-' + measurementId] = true;
        clearCookies();
        // Unload the tag when withdrawing consent so it makes no further requests.
        if (wasStarted) { location.reload(); return; }
      }
      if (returnFocus) { returnFocus.focus(); returnFocus = null; }
    });
    document.body.appendChild(box);
    const settings = document.createElement('button');
    settings.id = 'iztem-measurement-settings';
    settings.type = 'button';
    settings.textContent = 'Ölçüm tercihleri';
    settings.addEventListener('click', function () {
      returnFocus = settings;
      box.hidden = false;
      box.querySelector('button').focus();
    });
    (document.querySelector('footer') || document.body).appendChild(settings);
  }
  start();
  buildPreferences();
})();
