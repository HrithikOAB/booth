import { OWNERSHIP, STATUSES } from "../../data/registry/index.js";

/** `← PLATFORM` plus a breadcrumb that always tells the visitor where they are. */
export default function StageTopBar({ component, trail, nodeLabel, onPlatform, onCrumb }) {
  const own = OWNERSHIP[component.booth.ownership];
  const status = component.booth.status;
  return (
    <header className="st-top">
      <button type="button" className="st-back" onClick={onPlatform}>
        ← Platform
      </button>
      <div className="st-id">
        <nav className="st-crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <button type="button" onClick={onPlatform}>Platform</button>
            </li>
            {trail.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onCrumb(c)}>{c.name}</button>
              </li>
            ))}
            <li aria-current={nodeLabel ? undefined : "page"}>{component.name}</li>
            {nodeLabel && <li aria-current="page">{nodeLabel}</li>}
          </ol>
        </nav>
        <div className="st-title">
          <h1>{component.name}</h1>
          <p>{component.booth.oneLiner}</p>
        </div>
      </div>
      <div className="st-badges">
        {own && <span className={`st-badge st-badge--${own.tone}`}>{own.label}</span>}
        {status !== "current" && STATUSES[status] && status !== "partner" && <span className="st-badge st-badge--outline">{STATUSES[status].label}</span>}
        {component.edition && <span className="st-badge st-badge--outline">{component.edition}</span>}
      </div>
    </header>
  );
}
