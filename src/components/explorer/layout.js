import dagre from "@dagrejs/dagre";

export const NODE_W = 220;
export const NODE_H = 88;
export const CHILD_W = 186;
export const CHILD_H = 62;
const PAD = 16;
const HEADER = 46;
const GAP = 14;

function dagrePositions(nodes, edges, dir, sizeOf, { nodesep = 34, ranksep = 76 } = {}) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: dir, nodesep, ranksep, marginx: 0, marginy: 0 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach((n) => {
    const s = sizeOf(n);
    g.setNode(n.id, { width: s.w, height: s.h });
  });
  edges.forEach((e) => {
    if (e.source !== e.target && g.hasNode(e.source) && g.hasNode(e.target)) g.setEdge(e.source, e.target);
  });
  dagre.layout(g);
  const out = {};
  nodes.forEach((n) => {
    const p = g.node(n.id);
    const s = sizeOf(n);
    out[n.id] = { x: p.x - s.w / 2, y: p.y - s.h / 2, w: s.w, h: s.h };
  });
  return out;
}

/** Children of an expanded group: dagre when they have edges, otherwise a compact grid. */
function innerLayout(node, dir) {
  const kids = node.children;
  let pos;
  if (node.childEdges?.length) {
    pos = dagrePositions(kids, node.childEdges, dir === "LR" ? "TB" : "LR", () => ({ w: CHILD_W, h: CHILD_H }), { nodesep: GAP, ranksep: 40 });
  } else {
    const cols = kids.length <= 3 ? 1 : 2;
    pos = {};
    kids.forEach((k, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      pos[k.id] = { x: c * (CHILD_W + GAP), y: r * (CHILD_H + GAP), w: CHILD_W, h: CHILD_H };
    });
  }
  const all = Object.values(pos);
  const minX = Math.min(...all.map((p) => p.x));
  const minY = Math.min(...all.map((p) => p.y));
  const maxX = Math.max(...all.map((p) => p.x + p.w));
  const maxY = Math.max(...all.map((p) => p.y + p.h));
  all.forEach((p) => {
    p.x = p.x - minX + PAD;
    p.y = p.y - minY + HEADER;
  });
  return { pos, w: Math.max(NODE_W, maxX - minX + PAD * 2), h: maxY - minY + HEADER + PAD };
}

function radialPositions(nodes) {
  const [hub, ...spokes] = nodes;
  const r = Math.max(280, spokes.length * 54);
  const out = { [hub.id]: { x: -NODE_W / 2, y: -NODE_H / 2, w: NODE_W, h: NODE_H } };
  spokes.forEach((n, i) => {
    const a = (i / spokes.length) * Math.PI * 2 - Math.PI / 2;
    out[n.id] = { x: Math.cos(a) * r - NODE_W / 2, y: Math.sin(a) * r * 0.7 - NODE_H / 2, w: NODE_W, h: NODE_H };
  });
  return out;
}

/** Every node id in a view (including nested children) mapped to its top-level parent, or null. */
export function parentIndex(view) {
  const idx = {};
  view.nodes.forEach((n) => {
    idx[n.id] = null;
    n.children?.forEach((c) => (idx[c.id] = n.id));
  });
  return idx;
}

export function flatNodes(view) {
  return view.nodes.flatMap((n) => [n, ...(n.children ?? []).map((c) => ({ ...c, parent: n.id }))]);
}

/**
 * Lay out a registry view for React Flow. Collapsed groups absorb edges that
 * target their children; expanded groups become parents of their children.
 */
export function layoutView(view, expanded) {
  const dir = view.dir ?? "LR";
  const radial = view.layout === "radial";
  const parentOf = parentIndex(view);
  const inner = {};
  view.nodes.forEach((n) => {
    if (n.children?.length && expanded.has(n.id)) inner[n.id] = innerLayout(n, dir);
  });
  const sizeOf = (n) => (inner[n.id] ? { w: inner[n.id].w, h: inner[n.id].h } : { w: NODE_W, h: NODE_H });
  const lift = (id) => {
    const p = parentOf[id];
    return p && !inner[p] ? p : id;
  };
  const top = (id) => parentOf[id] ?? id;

  const pos = radial
    ? radialPositions(view.nodes)
    : dagrePositions(view.nodes, view.edges.map((e) => ({ source: top(e.source), target: top(e.target) })), dir, sizeOf);

  const rfNodes = [];
  view.nodes.forEach((n) => {
    const p = pos[n.id];
    const open = Boolean(inner[n.id]);
    rfNodes.push({
      id: n.id,
      type: open ? "archGroup" : "arch",
      position: { x: p.x, y: p.y },
      style: open ? { width: p.w, height: p.h } : undefined,
      data: { ...n, dir, hasChildren: Boolean(n.children?.length), childCount: n.children?.length ?? 0, expanded: open },
    });
    if (!open) return;
    n.children.forEach((c) => {
      const cp = inner[n.id].pos[c.id];
      rfNodes.push({
        id: c.id,
        type: "arch",
        parentId: n.id,
        extent: "parent",
        position: { x: cp.x, y: cp.y },
        data: { ...c, dir: n.childEdges?.length ? (dir === "LR" ? "TB" : "LR") : dir, isChild: true, parent: n.id },
      });
    });
  });

  const seen = new Set();
  const rfEdges = [];
  const pushEdge = (e, key) => {
    const source = lift(e.source);
    const target = lift(e.target);
    if (source === target) return;
    const k = `${source}->${target}`;
    if (seen.has(k)) return;
    seen.add(k);
    rfEdges.push({ id: key, source, target, type: "particle", label: e.label, data: { dashed: Boolean(e.dashed), floating: radial } });
  };
  view.edges.forEach((e, i) => pushEdge(e, e.id ?? `e-${i}`));
  view.nodes.forEach((n) => {
    if (inner[n.id]) n.childEdges?.forEach((e, i) => pushEdge(e, `c-${n.id}-${i}`));
  });

  return { nodes: rfNodes, edges: rfEdges };
}
