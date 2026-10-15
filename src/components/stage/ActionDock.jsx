/** The four booth actions. Every one keeps the visitor on the architecture. */
export default function ActionDock({ canWatch, canIntegrate, activeView, onWatch, onHowItWorks, onIntegrations, onDocs }) {
  return (
    <nav className="st-dock" aria-label="Component actions">
      {canWatch && (
        <button type="button" className="st-dock-btn st-dock-btn--watch" onClick={onWatch}>
          <span aria-hidden="true">▶</span> Watch
        </button>
      )}
      <button type="button" className={`st-dock-btn ${activeView === "workflow" ? "on" : ""}`} onClick={onHowItWorks}>
        <span aria-hidden="true">↻</span> How it works
      </button>
      {canIntegrate && (
        <button type="button" className={`st-dock-btn ${activeView === "integration" ? "on" : ""}`} onClick={onIntegrations}>
          <span aria-hidden="true">⇄</span> Integrations
        </button>
      )}
      <button type="button" className="st-dock-btn" onClick={onDocs}>
        <span aria-hidden="true">⌗</span> Official docs
      </button>
    </nav>
  );
}
