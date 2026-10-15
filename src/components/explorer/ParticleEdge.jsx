import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, useInternalNode } from "@xyflow/react";

function center(node) {
  const { x, y } = node.internals.positionAbsolute;
  const w = node.measured?.width ?? 0;
  const h = node.measured?.height ?? 0;
  return { x: x + w / 2, y: y + h / 2, w, h };
}

/** Point where the line from a's center towards b leaves a's rectangle. */
function borderPoint(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (!dx && !dy) return a;
  const sx = dx ? a.w / 2 / Math.abs(dx) : Infinity;
  const sy = dy ? a.h / 2 / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: a.x + dx * s, y: a.y + dy * s };
}

const GLOWING = new Set(["active", "trace"]);

function ParticleEdge({ id, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, markerEnd, markerStart, data = {} }) {
  const sNode = useInternalNode(source);
  const tNode = useInternalNode(target);

  let path;
  let lx;
  let ly;
  if (data.floating && sNode && tNode) {
    const a = center(sNode);
    const b = center(tNode);
    const p1 = borderPoint(a, b);
    const p2 = borderPoint(b, a);
    path = `M ${p1.x},${p1.y} L ${p2.x},${p2.y}`;
    lx = (p1.x + p2.x) / 2;
    ly = (p1.y + p2.y) / 2;
  } else {
    [path, lx, ly] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  }

  const state = data.state ?? "normal";
  const kind = data.kind ?? (data.dashed ? "control" : "data");
  const glow = GLOWING.has(state);
  // Only data-carrying edges get particles; control and optional paths stay still unless highlighted.
  const carries = kind === "data" || kind === "bi" || glow;
  const count = data.reducedMotion || state === "dim" || !carries ? 0 : glow ? 3 : 1;
  const dur = glow ? 1.5 : 3.4;

  return (
    <>
      {glow && <path d={path} className="pe-glow" fill="none" />}
      <BaseEdge id={id} path={path} markerEnd={markerEnd} markerStart={markerStart} className={`pe pe--${state} pe--k-${kind}${kind === "control" ? " pe--dashed" : ""}`} />
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} r={glow ? 4.5 : 2.8} className={`pe-dot pe-dot--${state}`}>
          <animateMotion dur={`${dur}s`} begin={`${(i * dur) / count}s`} repeatCount="indefinite" path={path} />
        </circle>
      ))}
      {label && (
        <EdgeLabelRenderer>
          <div className={`pe-label pe-label--${state} nodrag nopan`} style={{ transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)` }}>
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(ParticleEdge);
