import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { componentById, resourcesFor } from "../../data/registry/index.js";
import InlineVideo from "./InlineVideo.jsx";

const keyOf = (v) => v.id;

/** The service's own videos first, then one group per related service; a video appears only once. */
export function videoGroups(component) {
  const seen = new Set();
  const take = (videos) =>
    videos.filter((v) => {
      const k = keyOf(v);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  const own = take(resourcesFor(component.id).videos);
  const related = (component.relatedComponentIds ?? [])
    .map((id) => componentById[id])
    .filter((c) => c && c.id !== component.id)
    .map((c) => ({ component: c, videos: take(resourcesFor(c.id).videos) }))
    .filter((g) => g.videos.length);
  return { own, related };
}

function VideoItem({ item, playing, onPlay }) {
  return (
    <li className={`vd-item${playing ? " is-playing" : ""}`}>
      <InlineVideo
        video={item}
        playing={playing}
        onPlay={onPlay}
        className="vd-video"
        caption={
          <>
            <strong>{item.title}</strong>
            <span>YouTube · {item.channel}</span>
          </>
        }
      />
    </li>
  );
}

/** Slide-in list of videos that play inline, one at a time, without leaving the architecture. */
export default function VideoDrawer({ component, onClose }) {
  const ref = useRef(null);
  const [playingKey, setPlayingKey] = useState(null);
  const { own, related } = useMemo(() => videoGroups(component), [component]);

  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  const list = (videos, group) => (
    <ul className="vd-list">
      {videos.map((v) => {
        const k = `${group}:${keyOf(v)}`;
        return <VideoItem key={k} item={v} playing={playingKey === k} onPlay={() => setPlayingKey(k)} />;
      })}
    </ul>
  );

  return createPortal(
    <motion.div className="vd-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }}>
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={`Videos for ${component.name}`}
        tabIndex={-1}
        className="vd"
        onClick={(e) => e.stopPropagation()}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="vd-head">
          <div>
            <span className="vd-kicker">Watch</span>
            <h2>{component.name}</h2>
          </div>
          <button type="button" className="vd-close" onClick={onClose} aria-label="Close videos">
            ×
          </button>
        </header>
        <div className="vd-body">
          {own.length > 0 && (
            <section>
              <h3 className="vd-section">{component.name} videos</h3>
              {list(own, component.id)}
            </section>
          )}
          {related.length > 0 && (
            <section>
              <h3 className="vd-section">Related services</h3>
              {related.map((g) => (
                <div key={g.component.id} className="vd-group">
                  <h4>{g.component.name}</h4>
                  {list(g.videos, g.component.id)}
                </div>
              ))}
            </section>
          )}
          {!own.length && !related.length && <p className="vd-empty">No verified videos yet.</p>}
        </div>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}
