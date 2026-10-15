import { forwardRef, useRef } from "react";
import { motion } from "framer-motion";
import { componentById, microFor, resourcesFor, OWNERSHIP } from "../../data/registry/index.js";
import { KIND_LABEL } from "../explorer/ArchNode.jsx";
import { flatNodes } from "../explorer/layout.js";
import { videoGroups } from "./VideoDrawer.jsx";
import InlineVideo from "./InlineVideo.jsx";

/** "prev → this → next" chips when no path is authored for the node. */
function derivedPath(node, view) {
  const all = flatNodes(view);
  const byId = Object.fromEntries(all.map((n) => [n.id, n]));
  const edges = [...view.edges, ...view.nodes.flatMap((n) => n.childEdges ?? [])];
  const from = edges.find((e) => e.target === node.id && byId[e.source]);
  const to = edges.find((e) => e.source === node.id && byId[e.target]);
  if (!from && !to) return null;
  return [from && byId[from.source].label, node.label, to && byId[to.target].label].filter(Boolean);
}

/** A component's headline video: its first video. */
function headlineVideo(componentId) {
  const vids = resourcesFor(componentId).videos;
  return vids[0] ?? null;
}

/** The component's own video, falling back to the first related service that has one. */
function componentVideo(component) {
  const own = headlineVideo(component.id);
  if (own) return { video: own, owner: component };
  const related = component.relatedComponentIds ? videoGroups(component).related[0] : null;
  if (!related) return null;
  return { video: related.videos[0], owner: related.component };
}

/** Pick the most specific video: authored for the node, else the linked component's, else this component's. */
function videoFor(component, node, override) {
  if (override) {
    const hit = resourcesFor(component.id).videos.find((v) => v.id === override);
    if (hit) return { video: hit, owner: component };
  }
  const linked = node.ref && componentById[node.ref];
  if (linked && linked.id !== component.id) {
    const v = headlineVideo(linked.id);
    if (v) return { video: v, owner: linked };
  }
  return componentVideo(component);
}

const PanelVideo = forwardRef(function PanelVideo({ media }, ref) {
  const { video, owner } = media;
  return (
    <InlineVideo
      ref={ref}
      className="nmp-video"
      video={video}
      caption={
        <>
          <strong>{video.title}</strong>
          <span>{owner.name} · YouTube</span>
        </>
      }
    />
  );
});

const mediaKey = (m) => (m ? `${m.owner.id}:${m.video.id}` : "none");

/** Shown when no block is selected: the main component and its video. */
export function ComponentOverviewPanel({ component, onWatchAll, onDocs, hasMoreVideos }) {
  const media = componentVideo(component);
  const videoRef = useRef(null);
  const own = OWNERSHIP[component.booth.ownership];
  return (
    <motion.aside
      className="nmp nmp--overview"
      aria-label={`About ${component.name}`}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nmp-top">
        <span className="nmp-tag nmp-tag--focus">{own?.label ?? "Component"}</span>
      </div>
      <h3>{component.name}</h3>
      <p className="nmp-micro">{component.booth.oneLiner}</p>
      {media && <PanelVideo key={mediaKey(media)} ref={videoRef} media={media} />}
      <p className="nmp-hint">Tap any block in the diagram to see its video.</p>
      <div className="nmp-actions">
        {media && (
          <button type="button" className="nmp-btn nmp-btn--primary" onClick={() => videoRef.current?.fullscreen()}>
            ⤢ Full screen
          </button>
        )}
        {hasMoreVideos && (
          <button type="button" className="nmp-btn" onClick={onWatchAll}>
            ▶ All videos
          </button>
        )}
        <button type="button" className="nmp-btn" onClick={() => onDocs(component)}>
          Docs
        </button>
      </div>
    </motion.aside>
  );
}

export default function NodeMicroPanel({ component, node, view, onClose, onSelect, onWatch, onDocs, onExplore }) {
  const { micro, path: authoredPath, video: override } = microFor(component, node);
  const path = authoredPath ?? derivedPath(node, view);
  const linked = node.ref && componentById[node.ref] && node.ref !== component.id ? componentById[node.ref] : null;
  const media = videoFor(component, node, override);
  const videoRef = useRef(null);
  const tag = node.step != null ? `Step ${node.step + 1}` : node.kind === "focus" ? component.name : KIND_LABEL[node.kind] ?? "Block";

  return (
    <motion.aside
      key={node.id}
      className="nmp"
      aria-label={`Details for ${node.label}`}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nmp-top">
        <span className={`nmp-tag nmp-tag--${node.kind}`}>{tag}</span>
        <button type="button" className="nmp-close" onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>
      <h3>{node.label}</h3>
      {micro && <p className="nmp-micro">{micro}</p>}

      {path?.length > 1 && (
        <ol className="nmp-path" aria-label="Where it sits in the flow">
          {path.map((p, i) => (
            <li key={`${p}-${i}`} className={p === node.label ? "on" : ""}>
              {p}
            </li>
          ))}
        </ol>
      )}

      {media && <PanelVideo key={`${node.id}:${mediaKey(media)}`} ref={videoRef} media={media} />}

      {node.children?.length > 0 && (
        <div className="nmp-inside">
          <span>Inside</span>
          <div>
            {node.children.map((c) => (
              <button key={c.id} type="button" onClick={() => onSelect(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="nmp-actions">
        {media && (
          <button type="button" className="nmp-btn nmp-btn--primary" onClick={() => videoRef.current?.fullscreen()}>
            ⤢ Full screen
          </button>
        )}
        <button type="button" className="nmp-btn" onClick={() => onDocs(linked ?? component)}>
          Docs
        </button>
        {linked && (
          <button type="button" className="nmp-btn nmp-btn--explore" onClick={() => onExplore(linked)}>
            Explore {linked.name} ↗
          </button>
        )}
      </div>
    </motion.aside>
  );
}
