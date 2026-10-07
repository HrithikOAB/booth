import { useNavigate } from "react-router-dom";
import { serviceById } from "../../data/services.js";

export default function ServiceInformationPanel({ service, onClose }) {
  const navigate = useNavigate();
  if (!service) return null;

  const caps = service.capabilities ?? service.points ?? [];
  const related = (service.relatedServiceIds ?? []).map((id) => serviceById[id]).filter(Boolean);

  return (
    <div className="service-modal-info">
      <div className="kicker">{service.category ?? "PLATFORM"}</div>
      <h2>{service.name}</h2>
      <p className="lead">{service.lead || service.blurb}</p>

      <h3>What it does</h3>
      <ul>
        {caps.map((p) => <li key={p}>{p}</li>)}
      </ul>

      {service.inputs?.length > 0 && (
        <>
          <h3>Inputs</h3>
          <ul>{service.inputs.map((p) => <li key={p}>{p}</li>)}</ul>
        </>
      )}
      {service.outputs?.length > 0 && (
        <>
          <h3>Outputs</h3>
          <ul>{service.outputs.map((p) => <li key={p}>{p}</li>)}</ul>
        </>
      )}
      {service.tags?.length > 0 && (
        <>
          <h3>Builds on</h3>
          <div className="chip-row">
            {service.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
        </>
      )}
      {related.length > 0 && (
        <>
          <h3>Related services</h3>
          <div className="chip-row">
            {related.map((s) => (
              <span className="chip" key={s.id} onClick={() => navigate(`/explore/service/${s.id}`)}>
                {s.name}
              </span>
            ))}
          </div>
        </>
      )}
      <div className="modal-actions">
        <button type="button" className="btn-primary" onClick={() => navigate(`/explore/service/${service.id}`)}>
          Explore workflow
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate("/industries")}>
          Explore industry applications
        </button>
        <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
