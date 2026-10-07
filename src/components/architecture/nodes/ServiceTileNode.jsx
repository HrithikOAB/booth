import { NodeToolbar, Position } from "@xyflow/react";

export default function ServiceTileNode({ data, selected }) {
  const cls = [
    "arch-service-tile",
    data.variant ?? "base",
    data.clickable ? "clickable" : "",
    data.highlight ? "highlight" : "",
    data.dimmed ? "dimmed" : "",
    selected ? "highlight" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {data.tooltip && (
        <NodeToolbar isVisible={data.showTooltip} position={Position.Top}>
          <span style={{ fontSize: 11, padding: 6 }}>{data.tooltip}</span>
        </NodeToolbar>
      )}
      <div className={cls} style={{ width: data.width, height: data.height }}>
        {data.label}
      </div>
    </>
  );
}
