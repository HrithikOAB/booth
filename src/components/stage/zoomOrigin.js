// Remembers which Level-1 block was clicked so Level 2 can expand out of it.
const KEY = "booth-zoom-origin";
const MAX_AGE_MS = 2000;

export function rememberZoomOrigin(el) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ x: r.left, y: r.top, w: r.width, h: r.height, t: Date.now() }));
  } catch {
    /* storage unavailable: the page simply fades in */
  }
}

export function takeZoomOrigin() {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    const o = raw && JSON.parse(raw);
    return o && Date.now() - o.t < MAX_AGE_MS ? o : null;
  } catch {
    return null;
  }
}
