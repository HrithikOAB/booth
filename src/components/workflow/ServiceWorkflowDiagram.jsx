import { useMemo, useCallback } from "react";
import { ReactFlow, Background, Handle, Position } from "@xyflow/react";

function StepNode({ data, selected }) {
  return (
    <div className={`workflow-step-node ${selected ? "selected" : ""}`} onClick={() => data.onSelect(data.id)}>
      <Handle type="target" position={Position.Left} />
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { step: StepNode };

export default function ServiceWorkflowDiagram({ workflow, selectedStepId, onSelectStep }) {
  const nodes = useMemo(
    () =>
      workflow.nodes.map((n) => ({
        id: n.id,
        type: "step",
        position: { x: n.x, y: n.y },
        data: { label: n.label, id: n.id, onSelect: onSelectStep },
        selected: selectedStepId === n.id,
      })),
    [workflow, selectedStepId, onSelectStep]
  );

  const edges = useMemo(
    () =>
      workflow.edges.map(([s, t]) => ({
        id: `${s}-${t}`,
        source: s,
        target: t,
        animated: true,
        style: { stroke: "#22c5c7", strokeWidth: 2 },
      })),
    [workflow]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag
      zoomOnScroll
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#243c50" gap={16} />
    </ReactFlow>
  );
}
