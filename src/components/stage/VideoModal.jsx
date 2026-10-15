import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import QrLink from "./QrLink.jsx";

/** Thumbnail that never loads the player: a YouTube still image. */
export function VideoThumb({ item, onPlay, size = "md" }) {
  if (!item) return null;
  const label = `Play video: ${item.title}`;
  return (
    <button type="button" className={`vthumb vthumb--${size}`} onClick={onPlay} aria-label={label}>
      <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className="vthumb-play" aria-hidden="true">▶</span>
      <span className="vthumb-title">{item.title}</span>
    </button>
  );
}

export function Player({ item }) {
  return (
    <iframe
      key={item.id}
      className="vm-player"
      src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&modestbranding=1`}
      title={item.title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

/**
 * Center modal over the architecture. The player mounts only after the visitor presses play,
 * so no audio starts on its own and no iframe loads until needed.
 */
export default function VideoModal({ videos, startIndex = 0, title, subtitle, docUrl, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setPlaying(false), [idx]);
  const item = videos[idx];
  if (!item) return null;

  return (
    <Modal onClose={onClose} label={`Video: ${item.title}`} className="vm">
      <div className="vm-stage">{playing ? <Player item={item} /> : <VideoThumb item={item} size="lg" onPlay={() => setPlaying(true)} />}</div>
      <div className="vm-foot">
        <div className="vm-text">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
          <em>
            {item.title}
            {item.channel ? ` · ${item.channel}` : ""}
          </em>
        </div>
        <div className="vm-actions">
          {item.type === "youtube" && <QrLink url={item.url} label="Open on YouTube" />}
          {docUrl && <QrLink url={docUrl} label="Official docs" />}
        </div>
      </div>
      {videos.length > 1 && (
        <div className="vm-list" role="tablist" aria-label="More videos">
          {videos.map((v, i) => (
            <button key={v.id} type="button" role="tab" aria-selected={i === idx} className={i === idx ? "on" : ""} onClick={() => setIdx(i)}>
              <span aria-hidden="true">▶</span> {v.title}
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
