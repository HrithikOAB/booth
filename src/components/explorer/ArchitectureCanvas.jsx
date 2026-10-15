import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactFlow, ReactFlowProvider, Background, MiniMap, MarkerType, useReactFlow } from "@xyflow/react";
import { ArchNode, ArchGroupNode } from "./ArchNode.jsx";
import ParticleEdge from "./ParticleEdge.jsx";
import NodeSidePanel from "./NodeSidePanel.jsx";
import usePlayback from "./usePlayback.js";
import { layoutView, flatNodes, parentIndex, BOOTH_SIZES, DEFAULT_SIZES } from "./layout.js";
import { VIEW_META, sentences } from "../../data/registry/schema.js";

const nodeTypes = { arch: ArchNode, archGroup: ArchGroupNode };
const edgeTypes = { particle: ParticleEdge };
const MINIMAP_COLOR = { focus: "#f2662d", cloudera: "#f2662d", stage: "#f2662d", apache: "#5aa9ff", partner: "#9aa7b4", cloud: "#4fd1c5", vendor: "#4fd1c5", security: "#b18cff" };
const ORANGE = "#f2662d";
const SLATE = "#7b8fa3";

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

function Canvas({
  views,
  meta,
  initialView,
  height,
  title,
  variant,
  activeView,
  onViewChange,
  trace,
  playSignal,
  traceSignal,
  focusTag,
  renderPanel,
  renderIdlePanel,
  onSelectionChange,
  initialSelectedId,
}) {
  const booth = variant === "booth";
  const tabs = useMemo(() => (meta ?? VIEW_META).filter((m) => views[m.id]?.nodes?.length), [meta, views]);
  const [ownViewKey, setOwnViewKey] = useState(() => (views[initialView] ? initialView : tabs[0]?.id));
  const viewKey = activeView && views[activeView] ? activeView : ownViewKey;
  const setViewKey = (k) => (onViewChange ? onViewChange(k) : setOwnViewKey(k));
  const view = views[viewKey];
  const playable = Boolean(tabs.find((t) => t.id === viewKey)?.playback);
  const traceView = trace?.view ?? "internal";
  const canTrace = Boolean(trace?.nodes?.length && viewKey === traceView);

  const [expanded, setExpanded] = useState(() => new Set());
  const [selectedId, setSelectedId] = useState(() => initialSelectedId ?? null);
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [tracing, setTracing] = useState(false);
  const wrapRef = useRef(null);
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const rf = useReactFlow();

  const steps = useMemo(() => (playable && view ? view.nodes : []), [playable, view]);
  const pb = usePlayback(steps.length, { interval: reduced ? 4200 : 2800 });
  const { reset: resetPlayback, play: startPlayback } = pb;
  const traceNodes = useMemo(() => (canTrace ? trace.nodes : []), [canTrace, trace]);
  const tp = usePlayback(traceNodes.length, { interval: reduced ? 1600 : 1000 });
  const { reset: resetTrace, play: startTrace } = tp;

  const prevView = useRef(viewKey);
  useEffect(() => {
    if (prevView.current === viewKey) return;
    prevView.current = viewKey;
    setExpanded(new Set());
    setSelectedId(null);
    setQuery("");
    setTracing(false);
    resetPlayback();
    resetTrace();
  }, [viewKey, resetPlayback, resetTrace]);

  useEffect(() => {
    if (playSignal) startPlayback();
  }, [playSignal, startPlayback]);

  const all = useMemo(() => (view ? flatNodes(view) : []), [view]);
  const parents = useMemo(() => (view ? parentIndex(view) : {}), [view]);

  const startTracing = useCallback(() => {
    resetPlayback();
    setSelectedId(null);
    setTracing(true);
    const groups = traceNodes.map((id) => parents[id]).filter(Boolean);
    if (groups.length) setExpanded((prev) => new Set([...prev, ...groups]));
    resetTrace();
    startTrace();
  }, [resetPlayback, traceNodes, parents, resetTrace, startTrace]);
  const stopTracing = useCallback(() => {
    setTracing(false);
    resetTrace();
  }, [resetTrace]);

  useEffect(() => {
    if (traceSignal && canTrace) startTracing();
  }, [traceSignal]);

  const toggle = useCallback((id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

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

  const layout = useMemo(() => (view ? layoutView(view, expanded, booth ? BOOTH_SIZES : DEFAULT_SIZES) : { nodes: [], edges: [] }), [view, expanded, booth]);

  const activeId = pb.index >= 0 ? steps[pb.index]?.id : null;
  const visited = useMemo(() => new Set(steps.slice(0, pb.index + 1).map((s) => s.id)), [steps, pb.index]);
  const inPlayback = pb.index >= 0;
  const stepOf = useMemo(() => Object.fromEntries(steps.map((s, i) => [s.id, i])), [steps]);

  const visibleIds = useMemo(() => new Set(layout.nodes.map((n) => n.id)), [layout.nodes]);
  const liftVisible = useCallback((id) => (visibleIds.has(id) ? id : parents[id] ?? id), [visibleIds, parents]);
  const traced = useMemo(
    () => (tracing ? traceNodes.slice(0, Math.max(0, tp.index + 1)).map(liftVisible) : []),
    [tracing, traceNodes, tp.index, liftVisible],
  );
  const tracedSet = useMemo(() => new Set(traced), [traced]);
  const traceHead = traced.length ? traced[traced.length - 1] : null;

  const nodes = useMemo(
    () =>
      layout.nodes.map((n) => {
        let state = "normal";
        if (tracing) state = n.id === traceHead ? "active" : tracedSet.has(n.id) ? "traced" : "dim";
        else if (inPlayback) state = n.id === activeId ? "active" : visited.has(n.id) ? "visited" : "dim";
        else if (hits) state = hits.has(n.id) ? "normal" : "dim";
        else if (selectedId && booth) {
          const linked = layout.edges.some((e) => (e.source === selectedId && e.target === n.id) || (e.target === selectedId && e.source === n.id));
          state = n.id === selectedId || linked || n.data.parent === selectedId ? "normal" : "soft";
        }
        return {
          ...n,
          selected: n.id === selectedId,
          data: { ...n.data, state, booth, focusTag, searchHit: Boolean(hits?.has(n.id)), step: stepOf[n.id] ?? null, onToggle: toggle },
        };
      }),
    [layout.nodes, layout.edges, tracing, traceHead, tracedSet, inPlayback, activeId, visited, hits, selectedId, booth, focusTag, toggle, stepOf],
  );

  const edges = useMemo(() => {
    const traceOrder = Object.fromEntries(traced.map((id, i) => [id, i]));
    return layout.edges.map((e) => {
      let state = "normal";
      if (tracing) {
        const a = traceOrder[e.source];
        const b = traceOrder[e.target];
        state = a != null && b != null && Math.abs(a - b) === 1 ? "trace" : "dim";
      } else if (inPlayback) {
        if (e.target === activeId && visited.has(e.source)) state = "active";
        else state = visited.has(e.source) && visited.has(e.target) ? "visited" : "dim";
      } else if (selectedId) {
        state = e.source === selectedId || e.target === selectedId ? "active" : booth ? "soft" : "normal";
      } else if (hits) {
        state = hits.has(e.source) || hits.has(e.target) ? "normal" : "dim";
      }
      const color = state === "active" || state === "trace" ? ORANGE : SLATE;
      const marker = { type: MarkerType.ArrowClosed, width: 16, height: 16, color };
      return {
        ...e,
        markerEnd: e.data.reverse ? undefined : marker,
        markerStart: e.data.kind === "bi" || e.data.reverse ? marker : undefined,
        data: { ...e.data, state, reducedMotion: reduced },
      };
    });
  }, [layout.edges, traced, tracing, inPlayback, activeId, visited, selectedId, hits, reduced, booth]);

  const fit = useCallback(
    (opts) => requestAnimationFrame(() => rf.fitView({ padding: booth ? 0.14 : 0.18, duration: reduced ? 0 : 400, ...opts })),
    [rf, reduced, booth],
  );
  useEffect(() => {
    fit();
  }, [layout, fit]);
  useEffect(() => {
    // Booth screens keep the whole diagram in view so the crowd sees the full path.
    if (activeId && !booth) fit({ nodes: [{ id: parents[activeId] ?? activeId }], maxZoom: 1.1, padding: 0.6 });
  }, [activeId, parents, fit, booth]);

  const panelOpen = Boolean(selectedId);
  useEffect(() => {
    if (!booth) return undefined;
    const t = setTimeout(() => fit(), 60);
    return () => clearTimeout(t);
  }, [panelOpen, booth, fit]);

  useEffect(() => {
    const on = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => fit(), 120);
    return () => clearTimeout(t);
  }, [fullscreen, fit]);

  const selectedRaw = selectedId ? all.find((n) => n.id === selectedId) : null;
  const selected = useMemo(() => (selectedRaw ? { ...selectedRaw, step: stepOf[selectedRaw.id] ?? null } : null), [selectedRaw, stepOf]);
  useEffect(() => {
    onSelectionChange?.(selected);
  }, [selected, onSelectionChange]);

  if (!view) return null;

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };
  const reset = () => {
    setExpanded(new Set());
    setSelectedId(null);
    setQuery("");
    stopTracing();
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

  const narration = activeId ? steps[pb.index] : null;
  const panelProps = { node: selected, view, onClose: () => setSelectedId(null), onSelect: setSelectedId };
  const traceLabels = traceNodes.map((id) => all.find((n) => n.id === id)?.label ?? id);

  return (
    <div ref={wrapRef} className={`ac${booth ? " ac--booth" : ""}${fullscreen ? " ac--fs" : ""}`} style={fullscreen || booth ? undefined : { height }}>
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
        {!booth && (
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
        )}
        <div className="ac-tools">
          {playable && (
            <div className="ac-play" role="group" aria-label="Playback">
              <button type="button" onClick={pb.prev} disabled={pb.index <= 0} aria-label="Previous step">‹</button>
              <button type="button" className="ac-play-main" onClick={pb.toggle} aria-label={pb.playing ? "Pause" : "Play flow"}>
                {pb.playing ? "❚❚ Pause" : pb.index >= steps.length - 1 ? "↻ Replay" : booth ? "▶ Play flow" : "▶ Play"}
              </button>
              <button type="button" onClick={pb.next} disabled={pb.index >= steps.length - 1} aria-label="Next step">›</button>
            </div>
          )}
          {canTrace && (
            <button type="button" className="ac-trace" aria-pressed={tracing} onClick={tracing ? stopTracing : startTracing}>
              {tracing ? "✕ Stop trace" : "⟿ Trace data"}
            </button>
          )}
          {!booth && groups.length > 0 && (
            <button type="button" onClick={expandAll}>
              {expanded.size ? "Collapse all" : "Expand all"}
            </button>
          )}
          <button type="button" onClick={() => rf.zoomIn({ duration: 200 })} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => rf.zoomOut({ duration: 200 })} aria-label="Zoom out">−</button>
          {!booth && <button type="button" onClick={() => fit()}>Fit</button>}
          <button type="button" onClick={reset}>Reset</button>
          {!booth && (
            <button type="button" onClick={() => setShowMap((v) => !v)} aria-pressed={showMap}>Map</button>
          )}
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
            onNodeDoubleClick={(_, n) => !booth && n.data.ref && navigate(`/component/${n.data.ref}`)}
            onPaneClick={() => setSelectedId(null)}
          >
            <Background gap={22} size={1} color="rgba(255,255,255,0.06)" />
            {showMap && !booth && <MiniMap pannable zoomable nodeColor={(n) => MINIMAP_COLOR[n.data?.kind] ?? "#2a3d4c"} maskColor="rgba(8,16,24,0.7)" />}
          </ReactFlow>

          {narration && booth && (
            <div className="ac-steppill" aria-live="polite">
              <span className="ac-steppill-n">{pb.index + 1}</span>
              <div>
                <small className="ac-steppill-of">Step {pb.index + 1} of {steps.length}</small>
                <strong>{narration.label}</strong>
                <span>{sentences(narration.description, 1)}</span>
              </div>
            </div>
          )}
          {narration && !booth && (
            <div className="ac-narration" aria-live="polite">
              <span className="ac-step">
                Step {pb.index + 1} / {steps.length}
              </span>
              <strong>{narration.label}</strong>
              <span>{narration.description}</span>
            </div>
          )}
          {tracing && (
            <div className="ac-tracebar" aria-live="polite">
              {trace.label && <span className="ac-tracebar-label">{trace.label}</span>}
              <ol>
                {traceLabels.map((l, i) => (
                  <li key={traceNodes[i]} className={i <= tp.index ? (i === tp.index ? "on" : "done") : ""}>
                    {l}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {!narration && !tracing && view.caption && !booth && <div className="ac-caption">{view.caption}</div>}
          {!narration && !tracing && (
            <div className="ac-hint">{booth ? "Tap any block to explore" : "Click a node for details · double-click ↗ nodes to open their page"}</div>
          )}
        </div>
        {selected ? (renderPanel ? renderPanel(panelProps) : <NodeSidePanel {...panelProps} />) : renderIdlePanel?.()}
      </div>
    </div>
  );
}

export default function ArchitectureCanvas({ views, meta, initialView = "internal", height = "560px", title, variant = "default", ...rest }) {
  return (
    <ReactFlowProvider>
      <Canvas views={views} meta={meta} initialView={initialView} height={height} title={title} variant={variant} {...rest} />
    </ReactFlowProvider>
  );
}
