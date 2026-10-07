import { Link } from "react-router-dom";
import { componentById } from "../../data/registry/index.js";
import { KIND_LABEL } from "./ArchNode.jsx";
import { flatNodes } from "./layout.js";

function Connections({ list, dir, byId, onSelect }) {
  if (!list.length) return null;
  return (
    <div className="nsp-block">
      <h4>{dir === "in" ? "Receives from" : "Sends to"}</h4>
      <ul className="nsp-conns">
        {list.map((e) => {
          const other = byId[dir === "in" ? e.source : e.target];
          return (
            <li key={e.id}>
              <button type="button" onClick={() => onSelect(other.id)}>
                <span>{other.label}</span>
                {e.label && <em>{e.label}</em>}
                {e.dashed && <em>control / optional path</em>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function NodeSidePanel({ node, view, onClose, onSelect }) {
  if (!node) return null;
  const all = flatNodes(view);
  const byId = Object.fromEntries(all.map((n) => [n.id, n]));
  const edges = [...view.edges, ...view.nodes.flatMap((n) => n.childEdges ?? [])];
  const incoming = edges.filter((e) => e.target === node.id && byId[e.source]);
  const outgoing = edges.filter((e) => e.source === node.id && byId[e.target]);
  const target = node.ref ? componentById[node.ref] : null;
  const parent = node.parent ? byId[node.parent] : null;

  return (
    <aside className="nsp" aria-label={`Details for ${node.label}`}>
      <div className="nsp-top">
        <span className={`nsp-kind nsp-kind--${node.kind}`}>{node.step >= 0 && node.step != null ? `Step ${node.step + 1}` : KIND_LABEL[node.kind] ?? "Node"}</span>
        <button type="button" className="nsp-close" onClick={onClose} aria-label="Close details">
          ×
        </button>
      </div>
      <h3>{node.label}</h3>
      {parent && (
        <p className="nsp-parent">
          Inside{" "}
          <button type="button" onClick={() => onSelect(parent.id)}>
            {parent.label}
          </button>
        </p>
      )}
      {node.description && <p className="nsp-desc">{node.description}</p>}

      {node.children?.length > 0 && (
        <div className="nsp-block">
          <h4>Inside this block</h4>
          <ul className="nsp-conns">
            {node.children.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onSelect(c.id)}>
                  <span>{c.label}</span>
                  {c.description && <em>{c.description}</em>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Connections list={incoming} dir="in" byId={byId} onSelect={onSelect} />
      <Connections list={outgoing} dir="out" byId={byId} onSelect={onSelect} />

      {target && (
        <Link className="nsp-open" to={target.route}>
          Open {target.name} →
        </Link>
      )}
    </aside>
  );
}
