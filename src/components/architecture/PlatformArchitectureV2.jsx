import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { basePillar, cacPillar, connectorFlows, deployment } from "../../data/architectureBlueprint.js";
import ServiceGlyphs from "./ServiceGlyphs.jsx";
import { BrandLogo, ClouderaMark } from "./BrandLogos.jsx";
import { useDiagramState } from "./DiagramHit.jsx";
import { resolveNode, OWNERSHIP } from "../../data/registry/index.js";

const GOVERNANCE_IDS = [
  "base-sdx", "base-platform", "unified-fabric", "atlas-ranger", "gov-atlas", "gov-ranger",
  "gov-governance", "gov-security", "gov-metadata", "data-lineage", "hybrid-auth", "hybrid-meta",
];

/** The four building blocks Cloudera documents for hybrid environments. */
const HYBRID_PILLS = [
  ["hybrid-auth", "Unified authentication"],
  ["hybrid-meta", "Metadata sync"],
  ["hybrid-net", "Network connectivity"],
  ["hybrid-port", "Workload portability"],
];

function Tag({ children, tone = "oss" }) {
  return <span className={`arch-v2-tag arch-v2-tag--${tone}`}>{children}</span>;
}

/* ---- entrance animation variants ---- */
const stage = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const reveal = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Diagram block. With `node` + `st` it becomes a keyboard-accessible link to the
 * component page resolved from the registry; nested blocks stop propagation.
 */
function Block({ id, node, st, to, className = "", active, dimmed, onEnter, onLeave, onClick, children, title }) {
  const nodeId = node ?? id;
  const name = node ? resolveNode(node)?.component.name : null;
  const handleClick = onClick ?? (node || to ? () => (to ? st.navigate(to) : st.go(node)) : null);
  const enter = onEnter ?? (node ? () => st.setHoverId(node) : undefined);
  const leave = onLeave ?? (node ? () => st.setHoverId(null) : undefined);
  const isActive = active ?? (node ? st.hoverId === node : false);
  const isDim = dimmed ?? (node ? st.dim(node) : false);
  const label = title ?? (name ? `Open ${name}` : undefined);
  return (
    <div
      id={id}
      data-node={nodeId}
      role={handleClick ? "button" : undefined}
      tabIndex={handleClick ? 0 : undefined}
      aria-label={label}
      className={`arch-v2-block ${handleClick ? "is-link" : ""} ${className} ${isActive ? "is-active" : ""} ${isDim ? "is-dimmed" : ""} ${st && nodeId && st.focusId === nodeId ? "is-focus" : ""}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={handleClick ? (e) => { e.stopPropagation(); handleClick(); } : undefined}
      onKeyDown={(e) => {
        if (handleClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          e.stopPropagation();
          handleClick();
        }
      }}
      title={label}
    >
      {children}
    </div>
  );
}

function LineageGlyph() {
  return (
    <svg className="arch-v2-lineage-glyph" viewBox="0 0 48 32" aria-hidden="true">
      <circle cx="8" cy="16" r="4" fill="#f2662d" />
      <circle cx="24" cy="8" r="4" fill="#2b6cb0" />
      <circle cx="40" cy="16" r="4" fill="#2b6cb0" />
      <circle cx="24" cy="24" r="4" fill="#0d9488" />
      <path d="M8 16 L24 8 L40 16 L24 24 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
    </svg>
  );
}

const SERVICE_ICON = { "cac-de2": "de", "cac-dl2": "dl", "cac-ai2": "ai", "cac-df2": "df" };

export default function PlatformArchitectureV2({ searchQuery = "" }) {
  const [govOn, setGovOn] = useState(false);
  const st = useDiagramState(searchQuery, govOn ? GOVERNANCE_IDS : null);
  const { hoverId, setHoverId, highlightIds, go: goService } = st;
  const [activeFlow, setActiveFlow] = useState(null);
  const [scale, setScale] = useState(0.92);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tip, setTip] = useState(null);
  const drag = useRef(null);
  const viewportRef = useRef(null);

  const onHoverMove = (e) => {
    const el = e.target.closest?.("[data-node]");
    const c = el && resolveNode(el.dataset.node)?.component;
    if (!c) return setTip(null);
    const vr = viewportRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setTip({ id: el.dataset.node, name: c.name, line: c.booth.oneLiner, tag: OWNERSHIP[c.booth.ownership]?.label, x: r.left - vr.left + r.width / 2, y: r.top - vr.top });
  };

  const isDim = st.dim;
  const flowDim = (flowId) => Boolean(activeFlow && activeFlow !== flowId);

  const onWheel = (e) => {
    e.preventDefault();
    setScale((s) => Math.min(1.25, Math.max(0.55, s - e.deltaY * 0.001)));
  };
  const onPointerDown = (e) => {
    if (e.target.closest(".arch-v2-block")) return;
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
      ref={viewportRef}
      className={`arch-v2-viewport${govOn ? " is-gov" : ""}`}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={() => {
        endDrag();
        setTip(null);
      }}
      onMouseOver={onHoverMove}
    >
      <motion.div
        className="arch-v2-stage"
        style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${scale})` }}
        variants={stage}
        initial="hidden"
        animate="show"
      >
        <div className="arch-v2-board">
          {/* animated connector wiring */}
          <svg className="arch-v2-wiring" viewBox="0 0 1320 640" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="arch-v2-dot" markerWidth="8" markerHeight="8" refX="4" refY="4">
                <circle cx="4" cy="4" r="3.5" fill="#64748b" />
              </marker>
            </defs>

            <g className={`arch-v2-flow arch-v2-flow--jobs ${activeFlow === "flow-jobs" ? "is-on" : ""} ${flowDim("flow-jobs") ? "is-off" : ""}`}>
              <path className="arch-v2-path" d="M 520 96 L 660 96 L 800 96" markerStart="url(#arch-v2-dot)" markerEnd="url(#arch-v2-dot)" />
              <circle r="5" className="arch-v2-pulse">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M 520 96 L 800 96" />
              </circle>
            </g>

            <g className={`arch-v2-flow arch-v2-flow--query ${activeFlow === "flow-query" ? "is-on" : ""} ${flowDim("flow-query") ? "is-off" : ""}`}>
              <path className="arch-v2-path arch-v2-path--thin" d="M 800 300 L 660 300 L 520 352" markerStart="url(#arch-v2-dot)" markerEnd="url(#arch-v2-dot)" />
              <circle r="5" className="arch-v2-pulse arch-v2-pulse--orange">
                <animateMotion dur="3.2s" repeatCount="indefinite" path="M 800 300 L 660 300 L 520 352" />
              </circle>
            </g>

            <g className={`arch-v2-flow arch-v2-flow--data ${activeFlow === "flow-data" ? "is-on" : ""} ${flowDim("flow-data") ? "is-off" : ""}`}>
              <path className="arch-v2-path" d="M 520 512 L 660 512 L 800 480" markerStart="url(#arch-v2-dot)" markerEnd="url(#arch-v2-dot)" />
              <circle r="5" className="arch-v2-pulse arch-v2-pulse--teal">
                <animateMotion dur="3.6s" repeatCount="indefinite" path="M 800 480 L 660 512 L 520 512" />
              </circle>
            </g>
          </svg>

          {/* ---------- LEFT: Cloudera Base pillar ---------- */}
          <motion.aside className="arch-v2-col arch-v2-col--left" variants={reveal}>
            <div className="arch-v2-frame arch-v2-frame--base">
              <Block st={st} node="base-frame" className="arch-v2-pillar-head arch-v2-pillar-head--blue">
                <strong>{basePillar.title}</strong>
                <span>
                  {basePillar.subtitle} <Tag tone="ref">Reference architecture</Tag>
                </span>
              </Block>

              <div className="arch-v2-service-row">
                {basePillar.services.map((s) => (
                  <Block
                    key={s.id}
                    id={s.id}
                    st={st}
                    className="arch-v2-svc arch-v2-svc--base"
                    active={hoverId === s.id}
                    dimmed={isDim(s.id)}
                    onEnter={() => setHoverId(s.id)}
                    onLeave={() => setHoverId(null)}
                    onClick={() => goService(s.id)}
                    title={s.label}
                  >
                    <ServiceGlyphs type={s.icon} />
                    <span>{s.label}</span>
                  </Block>
                ))}
              </div>

              <div className="arch-v2-block arch-v2-band arch-v2-band--engines">
                <Block st={st} to="/components?category=engines" title="Open all engines" className="arch-v2-band-label">
                  {basePillar.enginesLabel} <Tag>Open source</Tag>
                </Block>
                <div className="arch-v2-engine-logos">
                  <Block st={st} node="eng-spark" className="arch-v2-logo"><BrandLogo id="spark" /></Block>
                  <Block st={st} node="eng-nifi" className="arch-v2-logo"><BrandLogo id="nifi" /></Block>
                  <Block st={st} node="eng-kafka" className="arch-v2-logo"><BrandLogo id="kafka" /></Block>
                </div>
              </div>

              <Block id="base-mgr" st={st} node="base-mgr" className="arch-v2-manager">
                <ClouderaMark suffix="Manager" />
              </Block>

              <Block
                id="base-platform"
                st={st}
                node="base-platform"
                className="arch-v2-platform arch-v2-platform--base"
                active={["base-platform", "base-obj", "base-sdx"].includes(hoverId)}
              >
                <div className="arch-v2-platform-row">
                  <Block id="base-obj" st={st} node="base-obj" className="arch-v2-platform-cell">
                    <ClouderaMark suffix="Object Store" />
                  </Block>
                  <div className="arch-v2-platform-mid">
                    <ClouderaMark suffix="Platform" />
                  </div>
                  <Block id="base-sdx" st={st} node="base-sdx" className="arch-v2-platform-cell arch-v2-platform-cell--sdx">
                    <ClouderaMark suffix="SDX" />
                  </Block>
                </div>
              </Block>
            </div>
          </motion.aside>

          {/* ---------- CENTER: connector notes ---------- */}
          <div className="arch-v2-col arch-v2-col--center">
            {connectorFlows.map((flow, i) => (
              <motion.div key={flow.id} variants={reveal}>
                <Block
                  id={flow.id}
                  className={`arch-v2-bridge arch-v2-bridge--${i}`}
                  active={activeFlow === flow.id || flow.highlights.includes(hoverId)}
                  dimmed={highlightIds && !flow.highlights.some((h) => highlightIds.has(h))}
                  onEnter={() => {
                    setActiveFlow(flow.id);
                    setHoverId(flow.highlights[0]);
                  }}
                  onLeave={() => {
                    setActiveFlow(null);
                    setHoverId(null);
                  }}
                  st={st}
                  title={`Open ${flow.label}`}
                  onClick={() => goService(flow.id)}
                >
                  {flow.label}
                </Block>
              </motion.div>
            ))}
          </div>

          {/* ---------- RIGHT: Cloudera Anywhere Cloud ---------- */}
          <aside className="arch-v2-col arch-v2-col--right">
            <motion.div variants={reveal}>
              <Block st={st} node="cac-frame" className="arch-v2-cac-head">
                <strong>{cacPillar.title}</strong>
                <span>
                  {cacPillar.subtitle} <Tag tone="ref">Reference architecture</Tag>
                </span>
              </Block>
            </motion.div>

            {/* top band: CDS 2.0 + Engines (grouped) and Partner Engines */}
            <motion.div className="arch-v2-cac-top" variants={reveal}>
              <div className="arch-v2-frame arch-v2-frame--cac arch-v2-cds-group">
                <div className="arch-v2-cac-panel arch-v2-cac-panel--cds">
                  <Block st={st} node="cds20" className="arch-v2-panel-title">{cacPillar.cds20.label}</Block>
                  <div className="arch-v2-cds-tiles">
                    {cacPillar.cds20.services.map((s) => (
                      <Block
                        key={s.id}
                        id={s.id}
                        st={st}
                        className="arch-v2-svc arch-v2-svc--cac"
                        active={hoverId === s.id}
                        dimmed={isDim(s.id)}
                        onEnter={() => setHoverId(s.id)}
                        onLeave={() => setHoverId(null)}
                        onClick={() => goService(s.id)}
                        title={s.label}
                      >
                        <ServiceGlyphs type={SERVICE_ICON[s.id] ?? "df"} />
                        <span>{s.label}</span>
                      </Block>
                    ))}
                  </div>
                </div>

                <div className="arch-v2-cac-panel arch-v2-cac-panel--engines">
                  <Block st={st} to="/components?category=engines" title="Open all engines" className="arch-v2-panel-title">
                    {cacPillar.engines.label} <Tag>Open source</Tag>
                  </Block>
                  <div className="arch-v2-engine-logos arch-v2-engine-logos--stack">
                    <Block id="cac-spark4" st={st} node="cac-spark4" className="arch-v2-logo">
                      <BrandLogo id="spark4" />
                    </Block>
                    <Block id="cac-trino" st={st} node="cac-trino" className="arch-v2-logo">
                      <BrandLogo id="trino" />
                    </Block>
                  </div>
                </div>
              </div>

              <div className="arch-v2-frame arch-v2-frame--cac arch-v2-partner-frame">
                <Block st={st} to="/components?category=partners" title="Open all partner engines" className="arch-v2-panel-title">
                  Partner Engines <em>(Examples)</em> <Tag tone="partner">Partner</Tag>
                </Block>
                <div className="arch-v2-engine-logos arch-v2-engine-logos--stack">
                  {cacPillar.partners.items.map((p) => (
                    <Block key={p.id} id={p.id} st={st} node={p.id} className="arch-v2-logo">
                      <BrandLogo id={p.label.toLowerCase()} />
                    </Block>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* bottom: Cloudera Anywhere Cloud fabric */}
            <motion.div className="arch-v2-frame arch-v2-frame--cac arch-v2-cac-bottom" variants={reveal}>
              <Block st={st} node="anywhere-core" className="arch-v2-anywhere-title">{cacPillar.anywhere.label}</Block>
              <Block id="unified-fabric" st={st} node="unified-fabric" className="arch-v2-fabric">
                <div className="arch-v2-fabric-title">{cacPillar.anywhere.fabric.label}</div>
                <div className="arch-v2-gov-row">
                  <div
                    id="atlas-ranger"
                    data-node="atlas-ranger"
                    className={`arch-v2-block arch-v2-gov arch-v2-gov--split ${isDim("atlas-ranger") ? "is-dimmed" : ""}`}
                  >
                    <div className="arch-v2-gov-names">
                      <Block st={st} node="gov-atlas" className="arch-v2-gov-link"><strong>Apache Atlas</strong></Block>
                      <span aria-hidden="true">/</span>
                      <Block st={st} node="gov-ranger" className="arch-v2-gov-link"><strong>Ranger</strong></Block>
                    </div>
                    <div className="arch-v2-gov-chips">
                      {[["gov-governance", "Governance"], ["gov-security", "Security"], ["gov-metadata", "Metadata"]].map(([id, label]) => (
                        <Block key={id} st={st} node={id} className="arch-v2-gov-chip">{label}</Block>
                      ))}
                    </div>
                  </div>
                  <Block id="data-lineage" st={st} node="data-lineage" className="arch-v2-gov arch-v2-gov--lineage">
                    <LineageGlyph />
                    <div>
                      <strong>{cacPillar.anywhere.lineage.label}</strong>
                      <span>{cacPillar.anywhere.lineage.sub}</span>
                    </div>
                  </Block>
                </div>
              </Block>
              <Block id="cac-obj" st={st} node="cac-obj" className="arch-v2-obj-bar">
                <ClouderaMark suffix="Object Store" />
              </Block>
            </motion.div>
          </aside>
        </div>

        {/* ---------- FOOTER: deploy anywhere (hybrid cloud) ---------- */}
        <motion.div className="arch-v2-hybrid" variants={reveal}>
          <Block st={st} node="hybrid-core" className="arch-v2-hybrid-head">
            <strong>Deploy anywhere</strong>
            <span>Hybrid cloud · data stays where it lives, compute moves closer to it</span>
          </Block>
          <div className="arch-v2-deploy">
            <div className="arch-v2-deploy-box arch-v2-deploy-box--onprem">
              <Block st={st} node="deploy-onprem" className="arch-v2-deploy-head">
                <span className="arch-v2-deploy-icon arch-v2-deploy-icon--server" aria-hidden="true" />
                {deployment.onPrem.label}
                <Tag tone="infra">Storage · infrastructure · accelerators</Tag>
              </Block>
              <div className="arch-v2-deploy-logos">
                <Block st={st} node="onprem-obj" className="arch-v2-deploy-tile arch-v2-deploy-tile--cda"><ClouderaMark suffix="Object Store" /></Block>
                {[["onprem-dell", "dell"], ["onprem-s3", "s3"], ["onprem-nvidia", "nvidia"], ["onprem-amd", "amd"]].map(([id, logo]) => (
                  <Block key={id} st={st} node={id} className="arch-v2-deploy-tile"><BrandLogo id={logo} /></Block>
                ))}
              </div>
            </div>

            <div className="arch-v2-hybrid-bus" aria-label="Hybrid building blocks">
              <svg className="arch-v2-hybrid-line" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 0 10 L 300 10" />
                <circle r="4" className="arch-v2-pulse arch-v2-pulse--teal">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path="M 0 10 L 300 10" />
                </circle>
                <circle r="4" className="arch-v2-pulse arch-v2-pulse--orange">
                  <animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M 300 10 L 0 10" />
                </circle>
              </svg>
              <div className="arch-v2-hybrid-pills">
                {HYBRID_PILLS.map(([id, label]) => (
                  <Block key={id} st={st} node={id} className="arch-v2-hybrid-pill">{label}</Block>
                ))}
              </div>
            </div>

            <div className="arch-v2-deploy-box arch-v2-deploy-box--cloud">
              <Block st={st} node="deploy-cloud" className="arch-v2-deploy-head">
                <span className="arch-v2-deploy-icon arch-v2-deploy-icon--cloud" aria-hidden="true" />
                {deployment.cloud.label}
                <Tag tone="infra">Cloud providers</Tag>
              </Block>
              <div className="arch-v2-deploy-logos">
                {[["cloud-aws", "aws"], ["cloud-azure", "azure"], ["cloud-gcp", "gcp"]].map(([id, logo]) => (
                  <Block key={id} st={st} node={id} className="arch-v2-deploy-tile"><BrandLogo id={logo} /></Block>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {tip && !drag.current && (
        <div className="arch-v2-tip" style={{ left: tip.x, top: tip.y }} role="tooltip">
          {tip.tag && <em>{tip.tag}</em>}
          <strong>{tip.name}</strong>
          <span>{tip.line}</span>
        </div>
      )}
      {govOn && <div className="arch-v2-gov-caption">Governance spans the whole platform: SDX · Apache Atlas · Apache Ranger · Lineage</div>}

      <div className="arch-controls">
        <button type="button" className={`arch-controls-gov${govOn ? " is-on" : ""}`} aria-pressed={govOn} onClick={() => setGovOn((v) => !v)}>
          Governance
        </button>
        <button type="button" onClick={() => setScale((s) => Math.min(1.25, s + 0.08))}>+</button>
        <button type="button" onClick={() => setScale((s) => Math.max(0.55, s - 0.08))}>−</button>
        <button type="button" onClick={() => { setScale(0.92); setPan({ x: 0, y: 0 }); }}>↺</button>
      </div>
    </div>
  );
}
