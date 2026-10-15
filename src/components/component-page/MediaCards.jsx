import { useState } from "react";
import { ORIGINS } from "../../data/registry/schema.js";

export function OriginBadge({ origin }) {
  const o = ORIGINS[origin];
  if (!o) return null;
  return <span className={`badge badge--${o.tone}`}>{o.label}</span>;
}

export function VerifiedBadge({ item }) {
  if (item.verified) {
    const tip = item.checkedOn ? `Link checked on ${item.checkedOn}` : item.verifiedBy;
    return (
      <span className="vbadge vbadge--ok" title={tip}>
        ✓ Verified{item.checkedOn ? ` · ${item.checkedOn}` : ""}
      </span>
    );
  }
  return <span className="vbadge vbadge--warn" title="This link has not passed the automated check">Unverified</span>;
}

export function VideoCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="media-card">
      {open ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`}
          title={item.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="yt-thumb" onClick={() => setOpen(true)} aria-label={`Play video: ${item.title}`}>
          <img src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="yt-play" aria-hidden="true">▶</span>
        </button>
      )}
      <figcaption>
        <strong>{item.title}</strong>
        <span className="media-meta">
          YouTube · {item.channel} <VerifiedBadge item={item} />
        </span>
        <a href={item.url} target="_blank" rel="noreferrer">
          Open on YouTube ↗
        </a>
      </figcaption>
    </figure>
  );
}

const DOC_KIND = { press: "Press release", docs: "Documentation", product: "Product page", project: "Project site", vendor: "Vendor site" };

export function DocCard({ item }) {
  const short = item.url.replace(/^https?:\/\//, "");
  return (
    <a className="doc-card" href={item.url} target="_blank" rel="noreferrer">
      <span className="doc-kind">{DOC_KIND[item.kind] ?? "Resource"}</span>
      <strong>{item.title}</strong>
      <span className="doc-url">{short.length > 64 ? `${short.slice(0, 64)}…` : short}</span>
      <VerifiedBadge item={item} />
    </a>
  );
}
