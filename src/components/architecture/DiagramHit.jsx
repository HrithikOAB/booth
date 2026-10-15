import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { highlightSetForNode } from "../../data/architectureBlueprint.js";
import { nodeMap, resolveNode, routeForNode } from "../../data/registry/index.js";
import { rememberZoomOrigin } from "../stage/zoomOrigin.js";

/** Diagram ids of the components a node's component integrates with (its architecture paths). */
function relatedNodeIds(nodeId) {
  const c = resolveNode(nodeId)?.component;
  if (!c) return [];
  const rel = new Set(c.relatedComponentIds ?? []);
  return Object.entries(nodeMap)
    .filter(([, v]) => rel.has(v.id))
    .map(([k]) => k);
}

/**
 * Shared state for the umbrella diagrams: hover highlight, `?focus=` deep link,
 * registry-backed search and navigation to component pages.
 * `overlayIds` (e.g. the governance overlay) highlights a fixed set while no node is hovered.
 */
export function useDiagramState(searchQuery = "", overlayIds = null) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const focusId = params.get("focus");
  const [hoverId, setHoverId] = useState(null);
  const q = searchQuery.trim().toLowerCase();

  useEffect(() => {
    if (!focusId) return;
    const t = setTimeout(() => {
      document.querySelector(`[data-node="${CSS.escape(focusId)}"]`)?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    }, 450);
    return () => clearTimeout(t);
  }, [focusId]);

  const highlightIds = useMemo(() => {
    const set = hoverId ? new Set([...highlightSetForNode(hoverId), ...relatedNodeIds(hoverId)]) : new Set(overlayIds ?? []);
    if (q) {
      Object.keys(nodeMap).forEach((nodeId) => {
        const c = resolveNode(nodeId)?.component;
        if (!c) return;
        const hay = `${c.name} ${c.shortName ?? ""} ${c.tagline ?? ""}`.toLowerCase();
        if (hay.includes(q)) set.add(nodeId);
      });
    }
    return set.size ? set : null;
  }, [hoverId, q, overlayIds]);

  const go = useCallback(
    (nodeId) => {
      const to = routeForNode(nodeId);
      if (!to) return;
      rememberZoomOrigin(document.querySelector(`[data-node="${CSS.escape(nodeId)}"]`));
      navigate(to);
    },
    [navigate]
  );

  const dim = (id) => Boolean(highlightIds && !highlightIds.has(id));
  return { hoverId, setHoverId, focusId, highlightIds, dim, go, navigate };
}

/** A keyboard-accessible diagram element that opens its component page. */
export function Hit({ nodeId, to, state, className = "", activeClass = "is-active", dimClass = "is-dim", children, label, group }) {
  const { hoverId, setHoverId, focusId, dim, go, navigate } = state;
  const comp = nodeId ? resolveNode(nodeId)?.component : null;
  const title = label ?? comp?.name ?? "";
  const active = nodeId && (hoverId === nodeId || (group && group.includes(hoverId)));
  const focused = nodeId && focusId === nodeId;
  const onClick = (e) => {
    e.stopPropagation();
    if (to) navigate(to);
    else if (nodeId) go(nodeId);
  };
  return (
    <button
      type="button"
      data-node={nodeId}
      className={`dg-hit ${className} ${active ? activeClass : ""} ${nodeId && dim(nodeId) ? dimClass : ""} ${focused ? "is-focus" : ""}`}
      onMouseEnter={nodeId ? () => setHoverId(nodeId) : undefined}
      onMouseLeave={nodeId ? () => setHoverId(null) : undefined}
      onFocus={nodeId ? () => setHoverId(nodeId) : undefined}
      onBlur={nodeId ? () => setHoverId(null) : undefined}
      onClick={onClick}
      title={title ? `Open ${title}` : undefined}
      aria-label={title ? `Open ${title}` : undefined}
    >
      {children}
    </button>
  );
}
