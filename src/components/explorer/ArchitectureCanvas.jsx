import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactFlow, ReactFlowProvider, Background, MiniMap, MarkerType, useReactFlow } from "@xyflow/react";
import { ArchNode, ArchGroupNode } from "./ArchNode.jsx";
import ParticleEdge from "./ParticleEdge.jsx";
import NodeSidePanel from "./NodeSidePanel.jsx";
import usePlayback from "./usePlayback.js";
import { layoutView, flatNodes, parentIndex } from "./layout.js";
import { VIEW_META } from "../../data/registry/schema.js";

const nodeTypes = { arch: ArchNode, archGroup: ArchGroupNode };
const edgeTypes = { particle: ParticleEdge };
const MINIMAP_COLOR = { focus: "#f2662d", cloudera: "#f2662d", stage: "#f2662d", apache: "#5aa9ff", partner: "#9aa7b4", cloud: "#4fd1c5", vendor: "#4fd1c5", security: "#b18cff" };

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function Canvas({ views, meta, initialView, height, title }) {
  const tabs = useMemo(() => (meta ?? VIEW_META).filter((m) => views[m.id]?.nodes?.length), [meta, views]);
  const [viewKey, setViewKey] = useState(() => (views[initialView] ? initialView : tabs[0]?.id));
  const view = views[viewKey];
  const playable = Boolean(tabs.find((t) => t.id === viewKey)?.playback);

  const [expanded, setExpanded] = useState(() => new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const rf = useReactFlow();

  const steps = useMemo(() => (playable && view ? view.nodes : []), [playable, view]);
  const pb = usePlayback(steps.length, { interval: reduced ? 4200 : 2800 });
  const { reset: resetPlayback } = pb;

  useEffect(() => {
    setExpanded(new Set());
    setSelectedId(null);
    setQuery("");
    resetPlayback();
  }, [viewKey, resetPlayback]);

  const toggle = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const all = useMemo(() => (view ? flatNodes(view) : []), [view]);
  const parents = useMemo(() => (view ? parentIndex(view) : {}), [view]);
  const q = query.trim().toLowerCase();
  const hits = useMemo(
    () => (q ? new Set(all.filter((n) => `${n.label} ${n.description ?? ""}`.toLowerCase().includes(q)).map((n) => n.id)) : null),
    [all, q],
  );

  useEffect(() => {
    if (!hits) return;
    const groups = [...hits].map((id) => parents[id]).filter(Boolean);
    if (groups.length) setExpanded((prev) => (groups.every((g) => prev.has(g)) ? prev : new Set([...prev, ...groups])));
  }, [hits, parents]);

  const layout = useMemo(() => (view ? layoutView(view, expanded) : { nodes: [], edges: [] }), [view, expanded]);

  const activeId = pb.index >= 0 ? steps[pb.index]?.id : null;
  const visited = useMemo(() => new Set(steps.slice(0, pb.index + 1).map((s) => s.id)), [steps, pb.index]);
  const inPlayback = pb.index >= 0;
  const stepOf = useMemo(() => Object.fromEntries(steps.map((s, i) => [s.id, i])), [steps]);

  const nodes = useMemo(
    () =>
      layout.nodes.map((n) => {
        let state = "normal";
        if (inPlayback) state = n.id === activeId ? "active" : visited.has(n.id) ? "visited" : "dim";
        else if (hits) state = hits.has(n.id) ? "normal" : "dim";
        return {
          ...n,
          selected: n.id === selectedId,
          data: { ...n.data, state, searchHit: Boolean(hits?.has(n.id)), step: stepOf[n.id] ?? null, onToggle: toggle },
        };
      }),
    [layout.nodes, inPlayback, activeId, visited, hits, selectedId, toggle, stepOf],
  );

  const edges = useMemo(
    () =>
      layout.edges.map((e) => {
        let state = "normal";
        if (inPlayback) {
          if (e.target === activeId && visited.has(e.source)) state = "active";
          else state = visited.has(e.source) && visited.has(e.target) ? "visited" : "dim";
        } else if (selectedId) {
          state = e.source === selectedId || e.target === selectedId ? "active" : "normal";
        } else if (hits) {
          state = hits.has(e.source) || hits.has(e.target) ? "normal" : "dim";
        }
        return {
          ...e,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16, color: state === "active" ? "#f2662d" : "#5d7488" },
          data: { ...e.data, state, reducedMotion: reduced },
        };
      }),
    [layout.edges, inPlayback, activeId, visited, selectedId, hits, reduced],
  );

  const fit = useCallback(
    (opts) => requestAnimationFrame(() => rf.fitView({ padding: 0.18, duration: reduced ? 0 : 400, ...opts })),
    [rf, reduced],
  );
  useEffect(() => {
    fit();
  }, [layout, fit]);
  useEffect(() => {
    if (activeId) fit({ nodes: [{ id: parents[activeId] ?? activeId }], maxZoom: 1.1, padding: 0.6 });
  }, [activeId, parents, fit]);

  useEffect(() => {
    const on = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => fit(), 120);
    return () => clearTimeout(t);
  }, [fullscreen, fit]);

  if (!view) return null;

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };
  const reset = () => {
    setExpanded(new Set());
    setSelectedId(null);
    setQuery("");
    pb.reset();
    fit();
  };
  const groups = view.nodes.filter((n) => n.children?.length).map((n) => n.id);
  const expandAll = () => setExpanded((prev) => (prev.size ? new Set() : new Set(groups)));
  const focusFirstHit = () => {
    const first = hits && [...hits][0];
    if (!first) return;
    setSelectedId(first);
    setTimeout(() => fit({ nodes: [{ id: first }], maxZoom: 1.2, padding: 0.8 }), 60);
  };

  const selectedRaw = selectedId ? all.find((n) => n.id === selectedId) : null;
  const selected = selectedRaw ? { ...selectedRaw, step: stepOf[selectedRaw.id] ?? null } : null;
  const narration = activeId ? steps[pb.index] : null;

  return (
    <div ref={wrapRef} className={`ac${fullscreen ? " ac--fs" : ""}`} style={fullscreen ? undefined : { height }}>
      <div className="ac-bar" role="toolbar" aria-label={`${title ?? "Architecture"} controls`}>
        {tabs.length > 1 && (
          <div className="ac-tabs" role="tablist" aria-label="Diagram view">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={t.id === viewKey} className={t.id === viewKey ? "on" : ""} onClick={() => setViewKey(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="ac-search">
          <input
            type="search"
            value={query}
            placeholder="Search nodes…"
            aria-label="Search nodes in this diagram"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && focusFirstHit()}
          />
          {hits && <span className="ac-hits">{hits.size} match{hits.size === 1 ? "" : "es"}</span>}
        </div>
        <div className="ac-tools">
          {playable && (
            <div className="ac-play" role="group" aria-label="Playback">
              <button type="button" onClick={pb.prev} disabled={pb.index <= 0} aria-label="Previous step">‹</button>
              <button type="button" className="ac-play-main" onClick={pb.toggle} aria-label={pb.playing ? "Pause" : "Play workflow"}>
                {pb.playing ? "❚❚ Pause" : pb.index >= steps.length - 1 ? "↻ Replay" : "▶ Play"}
              </button>
              <button type="button" onClick={pb.next} disabled={pb.index >= steps.length - 1} aria-label="Next step">›</button>
            </div>
          )}
          {groups.length > 0 && (
            <button type="button" onClick={expandAll}>
              {expanded.size ? "Collapse all" : "Expand all"}
            </button>
          )}
          <button type="button" onClick={() => rf.zoomIn({ duration: 200 })} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => rf.zoomOut({ duration: 200 })} aria-label="Zoom out">−</button>
          <button type="button" onClick={() => fit()}>Fit</button>
          <button type="button" onClick={reset}>Reset</button>
          <button type="button" onClick={() => setShowMap((v) => !v)} aria-pressed={showMap}>Map</button>
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {fullscreen ? "Exit ⤡" : "⤢"}
          </button>
        </div>
      </div>

      <div className="ac-body">
        <div className="ac-flow">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            minZoom={0.2}
            maxZoom={2.2}
            fitView
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, n) => setSelectedId(n.id)}
            onNodeDoubleClick={(_, n) => n.data.ref && navigate(`/component/${n.data.ref}`)}
            onPaneClick={() => setSelectedId(null)}
          >
            <Background gap={22} size={1} color="rgba(255,255,255,0.06)" />
            {showMap && <MiniMap pannable zoomable nodeColor={(n) => MINIMAP_COLOR[n.data?.kind] ?? "#2a3d4c"} maskColor="rgba(8,16,24,0.7)" />}
          </ReactFlow>
          {narration && (
            <div className="ac-narration" aria-live="polite">
              <span className="ac-step">
                Step {pb.index + 1} / {steps.length}
              </span>
              <strong>{narration.label}</strong>
              <span>{narration.description}</span>
            </div>
          )}
          {!narration && view.caption && <div className="ac-caption">{view.caption}</div>}
          {!narration && <div className="ac-hint">Click a node for details · double-click ↗ nodes to open their page</div>}
        </div>
        {selected && <NodeSidePanel node={selected} view={view} onClose={() => setSelectedId(null)} onSelect={setSelectedId} />}
      </div>
    </div>
  );
}

export default function ArchitectureCanvas({ views, meta, initialView = "internal", height = "560px", title }) {
  return (
    <ReactFlowProvider>
      <Canvas views={views} meta={meta} initialView={initialView} height={height} title={title} />
    </ReactFlowProvider>
  );
}
