// Fire-and-forget usage counts (see api/track.js and the oikos_track RPC).
// Aggregates only — event, page, day. Nothing about the person.
//
// sendBeacon survives the page unloading, which matters for outbound clicks
// and exports that navigate away; fetch keepalive is the fallback.
export function track(event, path = window.location.pathname) {
  try {
    const payload = JSON.stringify({ event, path: String(path).slice(0, 200) });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
      if (ok) return;
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Measurement must never break the page.
  }
}

// Counts clicks on links leaving the site, by destination host — this is how
// you can see which network sites the Oikos Map actually sends people to.
export function trackOutboundClicks() {
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      // Share buttons count themselves as share_article; skip them here so
      // outbound stays a clean measure of visits to other sites.
      if (!link || link.hasAttribute('data-no-outbound')) return;
      let url;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol) || url.host === window.location.host) return;
      track('outbound', url.host.replace(/^www\./, ''));
    },
    { capture: true, passive: true },
  );
}
