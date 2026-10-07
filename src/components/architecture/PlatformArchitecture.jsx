import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  basePillar,
  cacPillar,
  connectorFlows,
  deployment,
  diagramTitle,
  highlightSetForNode,
  serviceIdForNode,
} from "../../data/architectureBlueprint.js";
import ServiceGlyphs from "./ServiceGlyphs.jsx";

function ArchBlock({ id, className = "", active, dimmed, onEnter, onLeave, onClick, children, title }) {
  return (
    <div
      id={id}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`umb-block ${className} ${active ? "is-active" : ""} ${dimmed ? "is-dimmed" : ""}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      title={title}
    >
      {children}
    </div>
  );
}

export default function PlatformArchitecture({ searchQuery = "" }) {
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);
  const [scale, setScale] = useState(0.88);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  const q = searchQuery.trim().toLowerCase();
  const highlightIds = useMemo(() => {
    const set = hoverId ? new Set(highlightSetForNode(hoverId)) : new Set();
    if (q) {
      const match = (label, id) => {
        if (String(label).toLowerCase().includes(q)) set.add(id);
      };
      basePillar.services.forEach((s) => match(s.label, s.id));
      cacPillar.cds20.services.forEach((s) => match(s.label, s.id));
    }
    return set.size ? set : null;
  }, [hoverId, q]);

  const isDim = (id) => highlightIds && !highlightIds.has(id);

  const goService = useCallback(
    (nodeId) => {
      const sid = serviceIdForNode(nodeId);
      if (sid) navigate(`/explore/service/${sid}`);
    },
    [navigate]
  );

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(1.35, Math.max(0.5, s - e.deltaY * 0.001)));
  };

  const onPointerDown = (e) => {
    if (e.target.closest(".umb-block")) return;
    drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
  };
  const endDrag = () => {
    drag.current = null;
  };

  return (
    <div
      className="umbrella-viewport"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <div className="umbrella-stage" style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})` }}>
        <h2 className="umbrella-diagram-title">{diagramTitle}</h2>
        <div className="umbrella-columns">
          <section className="umb-pillar umb-pillar--base">
            <header><strong>{basePillar.title}</strong><span>{basePillar.subtitle}</span></header>
            <div className="umb-service-row">
              {basePillar.services.map((s) => (
                <ArchBlock key={s.id} id={s.id} className="umb-service-card" active={hoverId === s.id} dimmed={isDim(s.id)}
                  onEnter={() => setHoverId(s.id)} onLeave={() => setHoverId(null)} onClick={() => goService(s.id)} title={s.label}>
                  <ServiceGlyphs type={s.icon} /><span>{s.label}</span>
                </ArchBlock>
              ))}
            </div>
            <ArchBlock className="umb-band" dimmed={isDim("eng-spark")}>
              <div className="umb-band-label">{basePillar.enginesLabel}</div>
              <div className="umb-engine-row">
                {basePillar.engines.map((e) => (
                  <ArchBlock key={e.id} id={e.id} className="umb-engine" dimmed={isDim(e.id)} active={hoverId === e.id}
                    onEnter={() => setHoverId(e.id)} onLeave={() => setHoverId(null)}>{e.label}</ArchBlock>
                ))}
              </div>
            </ArchBlock>
            <ArchBlock id="base-mgr" className="umb-manager" dimmed={isDim("base-mgr")} onEnter={() => setHoverId("base-mgr")} onLeave={() => setHoverId(null)}>
              {basePillar.manager.label}
            </ArchBlock>
            <ArchBlock id="base-platform" className="umb-platform" dimmed={isDim("base-platform")} active={["base-platform","base-obj","base-sdx"].includes(hoverId)}
              onEnter={() => setHoverId("base-platform")} onLeave={() => setHoverId(null)}>
              <div className="umb-platform-title">{basePillar.platform.label}</div>
              <div className="umb-platform-split">
                <ArchBlock id="base-obj" className="umb-platform-cell" dimmed={isDim("base-obj")} onEnter={() => setHoverId("base-obj")} onLeave={() => setHoverId(null)}>
                  {basePillar.platform.objectStore.label}
                </ArchBlock>
                <ArchBlock id="base-sdx" className="umb-platform-cell umb-platform-cell--sdx" dimmed={isDim("base-sdx")} active={hoverId === "base-sdx"}
                  onEnter={() => setHoverId("base-sdx")} onLeave={() => setHoverId(null)} onClick={() => goService("base-sdx")}>
                  {basePillar.platform.sdx.label}
                </ArchBlock>
              </div>
            </ArchBlock>
          </section>

          <div className="umb-connectors">
            <svg className="umb-wires" viewBox="0 0 120 520" preserveAspectRatio="none">
              <path className="umb-wire" d="M0,80 C40,80 80,80 120,80" />
              <path className="umb-wire" d="M120,260 C80,260 40,260 0,260" />
              <path className="umb-wire umb-wire--dash" d="M0,420 C60,400 60,440 120,420" />
              <circle r="4" fill="#22c5c7"><animateMotion dur="3s" repeatCount="indefinite" path="M0,80 C40,80 80,80 120,80" /></circle>
              <circle r="4" fill="#f56600"><animateMotion dur="3.5s" repeatCount="indefinite" path="M120,260 C80,260 40,260 0,260" /></circle>
              <circle r="3" fill="#22c5c7"><animateMotion dur="4s" repeatCount="indefinite" path="M0,420 C60,400 60,440 120,420" /></circle>
            </svg>
            {connectorFlows.map((flow, i) => (
              <ArchBlock key={flow.id} id={flow.id} className={`umb-flow-label umb-flow-label--${i}`}
                active={flow.highlights.includes(hoverId)}
                dimmed={highlightIds && !flow.highlights.some((h) => highlightIds.has(h))}
                onEnter={() => setHoverId(flow.highlights[0])} onLeave={() => setHoverId(null)}>{flow.label}</ArchBlock>
            ))}
          </div>

          <section className="umb-pillar umb-pillar--cac">
            <header><strong>{cacPillar.title}</strong><span>{cacPillar.subtitle}</span></header>
            <div className="umb-cac-top">
              <ArchBlock className="umb-cac-box umb-cac-box--cds">
                <div className="umb-band-label">{cacPillar.cds20.label}</div>
                <div className="umb-cds-grid">
                  {cacPillar.cds20.services.map((s) => (
                    <ArchBlock key={s.id} id={s.id} className="umb-service-card umb-service-card--cac" active={hoverId === s.id} dimmed={isDim(s.id)}
                      onEnter={() => setHoverId(s.id)} onLeave={() => setHoverId(null)} onClick={() => goService(s.id)}>{s.label}</ArchBlock>
                  ))}
                </div>
              </ArchBlock>
              <ArchBlock className="umb-cac-box umb-cac-box--engines">
                <div className="umb-band-label">{cacPillar.engines.label}</div>
                {cacPillar.engines.items.map((e) => (
                  <ArchBlock key={e.id} id={e.id} className="umb-engine umb-engine--cac" dimmed={isDim(e.id)} active={hoverId === e.id}
                    onEnter={() => setHoverId(e.id)} onLeave={() => setHoverId(null)}>{e.label}</ArchBlock>
                ))}
              </ArchBlock>
              <ArchBlock className="umb-cac-box umb-cac-box--partners">
                <div className="umb-band-label">{cacPillar.partners.label}</div>
                {cacPillar.partners.items.map((e) => (
                  <ArchBlock key={e.id} id={e.id} className="umb-engine umb-engine--partner" dimmed={isDim(e.id)}>{e.label}</ArchBlock>
                ))}
              </ArchBlock>
            </div>
            <ArchBlock className="umb-anywhere-core" dimmed={isDim("unified-fabric")}>
              <div className="umb-anywhere-title">{cacPillar.anywhere.label}</div>
              <ArchBlock id="unified-fabric" className="umb-fabric" dimmed={isDim("unified-fabric")} onEnter={() => setHoverId("unified-fabric")} onLeave={() => setHoverId(null)}>
                {cacPillar.anywhere.fabric.label}
              </ArchBlock>
              <div className="umb-gov-row">
                <ArchBlock id="atlas-ranger" className="umb-gov-cell" dimmed={isDim("atlas-ranger")} active={hoverId === "atlas-ranger"}
                  onEnter={() => setHoverId("atlas-ranger")} onLeave={() => setHoverId(null)} onClick={() => goService("atlas-ranger")}>
                  <strong>{cacPillar.anywhere.governance.label}</strong><small>{cacPillar.anywhere.governance.sub}</small>
                </ArchBlock>
                <ArchBlock id="data-lineage" className="umb-gov-cell" dimmed={isDim("data-lineage")} active={hoverId === "data-lineage"}
                  onEnter={() => setHoverId("data-lineage")} onLeave={() => setHoverId(null)} onClick={() => goService("data-lineage")}>
                  <strong>{cacPillar.anywhere.lineage.label}</strong><small>{cacPillar.anywhere.lineage.sub}</small>
                </ArchBlock>
              </div>
              <ArchBlock id="cac-obj" className="umb-obj-bar" dimmed={isDim("cac-obj")} active={hoverId === "cac-obj"}
                onEnter={() => setHoverId("cac-obj")} onLeave={() => setHoverId(null)} onClick={() => goService("cac-obj")}>
                {cacPillar.anywhere.objectStore.label}
              </ArchBlock>
            </ArchBlock>
          </section>
        </div>
        <div className="umb-deploy">
          <div className="umb-deploy-col umb-deploy-col--cloud">
            <div className="umb-deploy-title">{deployment.cloud.label}</div>
            <div className="umb-deploy-items">{deployment.cloud.items.map((l) => <span key={l} className="umb-deploy-chip">{l}</span>)}</div>
          </div>
          <div className="umb-deploy-col umb-deploy-col--onprem">
            <div className="umb-deploy-title">{deployment.onPrem.label}</div>
            <div className="umb-deploy-items">{deployment.onPrem.items.map((l) => <span key={l} className="umb-deploy-chip">{l}</span>)}</div>
          </div>
        </div>
      </div>
      <div className="arch-controls">
        <button type="button" onClick={() => setScale((s) => Math.min(1.35, s + 0.08))}>+</button>
        <button type="button" onClick={() => setScale((s) => Math.max(0.5, s - 0.08))}>−</button>
        <button type="button" onClick={() => { setScale(0.88); setPan({ x: 0, y: 0 }); }}>↺</button>
      </div>
    </div>
  );
}
