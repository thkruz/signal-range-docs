/*
 * SignalRange analytics consent.
 *
 * The same file ships in signal-range-home/public and signal-range-docs/public;
 * app.signalrange.space follows the same cookie contract in src/analytics.ts.
 * Keep all three in step.
 *
 * Google Analytics is opt-in: nothing is loaded and nothing is sent until the
 * visitor presses "Allow". The choice lives in one cookie on .signalrange.space
 * so a single answer covers the home site, the docs and the app.
 *
 * Load with: <script src="/sr-consent.js" data-ga-id="G-XXXXXXXXXX" defer></script>
 * Any element with [data-sr-consent-open] reopens the banner.
 */
(function () {
  var COOKIE = 'sr_analytics_consent';
  var ONE_YEAR_S = 60 * 60 * 24 * 365;
  var script = document.currentScript;
  var gaId = script && script.getAttribute('data-ga-id');
  // navigator.webdriver: Playwright and other automation get no banner and send nothing.
  if (!gaId || gaId === 'G-PLACEHOLDER' || navigator.webdriver) {
    return;
  }

  function cookieDomain() {
    var host = location.hostname;
    return host === 'signalrange.space' || host.slice(-18) === '.signalrange.space' ? '; Domain=.signalrange.space' : '';
  }

  function readChoice() {
    var match = document.cookie.match(/(?:^|;\s*)sr_analytics_consent=(granted|denied)/);
    return match ? match[1] : null;
  }

  function writeChoice(choice) {
    var secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = COOKIE + '=' + choice + '; Max-Age=' + ONE_YEAR_S + '; Path=/' + cookieDomain() + '; SameSite=Lax' + secure;
  }

  function clearGaCookies() {
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        document.cookie = name + '=; Max-Age=0; Path=/';
        document.cookie = name + '=; Max-Age=0; Path=/' + cookieDomain();
      }
    });
  }

  var loaded = false;
  function loadGa() {
    window['ga-disable-' + gaId] = false;
    if (loaded) {
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
    document.head.appendChild(tag);
    window.gtag('js', new Date());
    window.gtag('config', gaId, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }

  function decline() {
    writeChoice('denied');
    window['ga-disable-' + gaId] = true;
    clearGaCookies();
  }

  var banner = null;
  function closeBanner() {
    if (banner) {
      banner.remove();
      banner = null;
    }
  }

  function showBanner() {
    if (banner) {
      return;
    }
    banner = document.createElement('div');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics choice');
    banner.style.cssText =
      'position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:560px;margin:0 auto;' +
      'padding:16px;border-radius:8px;background:#111827;color:#f3f4f6;border:1px solid #374151;' +
      'font:14px/1.5 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)';

    var text = document.createElement('p');
    text.style.cssText = 'margin:0 0 12px';
    text.textContent =
      'May we use Google Analytics to count visits and see which pages are used? It stays off unless you allow it. ';
    var link = document.createElement('a');
    link.href = 'https://signalrange.space/privacy';
    link.textContent = 'Privacy policy';
    link.style.cssText = 'color:#93c5fd;text-decoration:underline';
    text.appendChild(link);

    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap';
    [
      ['Decline', decline],
      ['Allow', function () { writeChoice('granted'); loadGa(); }],
    ].forEach(function (pair) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = pair[0];
      button.style.cssText =
        'min-width:96px;padding:8px 16px;border-radius:6px;border:1px solid #9ca3af;background:#1f2937;' +
        'color:#f3f4f6;font:inherit;cursor:pointer';
      button.addEventListener('click', function () {
        pair[1]();
        closeBanner();
      });
      row.appendChild(button);
    });

    banner.appendChild(text);
    banner.appendChild(row);
    document.body.appendChild(banner);
  }

  var embedded;
  try {
    embedded = window.self !== window.top;
  } catch (e) {
    embedded = true;
  }

  var choice = readChoice();
  if (choice === 'granted') {
    loadGa();
  }

  function init() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('[data-sr-consent-open]')) {
        event.preventDefault();
        showBanner();
      }
    });
    // Docs briefs are iframed into the app, which asks for itself.
    if (choice === null && !embedded) {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
