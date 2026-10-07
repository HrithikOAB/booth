import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

export const KIND_LABEL = {
  focus: "This component",
  core: "Internal",
  stage: "Step",
  cloudera: "Cloudera",
  apache: "Open source",
  partner: "Partner",
  vendor: "Vendor",
  cloud: "Cloud",
  data: "Data",
  store: "Storage",
  client: "Client",
  external: "External",
  security: "Security",
};

function handles(dir) {
  return dir === "TB" ? [Position.Top, Position.Bottom] : [Position.Left, Position.Right];
}

function stateClass(data, selected) {
  return [
    `an--${data.kind ?? "core"}`,
    data.state && `an--${data.state}`,
    data.searchHit && "an--hit",
    selected && "an--selected",
    data.isChild && "an--child",
    data.ref && "an--linked",
  ]
    .filter(Boolean)
    .join(" ");
}

export const ArchNode = memo(function ArchNode({ id, data, selected }) {
  const [tp, sp] = handles(data.dir);
  return (
    <div className={`an ${stateClass(data, selected)}`} title={data.description || data.label}>
      <Handle type="target" position={tp} />
      <div className="an-head">
        <span className="an-kind">{data.step != null ? `Step ${data.step + 1}` : KIND_LABEL[data.kind] ?? "Node"}</span>
        {data.ref && <span className="an-ref" aria-hidden="true">↗</span>}
      </div>
      <div className="an-label">{data.label}</div>
      {!data.isChild && data.description && <div className="an-desc">{data.description}</div>}
      {data.hasChildren && (
        <button
          type="button"
          className="an-expand nodrag"
          aria-expanded={false}
          aria-label={`Expand ${data.label} (${data.childCount} inside)`}
          onClick={(e) => {
            e.stopPropagation();
            data.onToggle?.(id);
          }}
        >
          + {data.childCount} inside
        </button>
      )}
      <Handle type="source" position={sp} />
    </div>
  );
});

export const ArchGroupNode = memo(function ArchGroupNode({ id, data, selected }) {
  const [tp, sp] = handles(data.dir);
  return (
    <div className={`ag ${stateClass(data, selected)}`}>
      <Handle type="target" position={tp} />
      <div className="ag-head">
        <span className="an-kind">{KIND_LABEL[data.kind] ?? "Group"}</span>
        <span className="ag-label">{data.label}</span>
        <button
          type="button"
          className="an-expand nodrag"
          aria-expanded
          aria-label={`Collapse ${data.label}`}
          onClick={(e) => {
            e.stopPropagation();
            data.onToggle?.(id);
          }}
        >
          − collapse
        </button>
      </div>
      <Handle type="source" position={sp} />
    </div>
  );
});
