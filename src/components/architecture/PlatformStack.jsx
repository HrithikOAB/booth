import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { basePillar, cacPillar, connectorFlows, deployment } from "../../data/architectureBlueprint.js";
import ServiceGlyphs from "./ServiceGlyphs.jsx";
import { BrandLogo, ClouderaMark } from "./BrandLogos.jsx";
import { Hit, useDiagramState } from "./DiagramHit.jsx";

const CDS_GLYPH = { "cac-de2": "de", "cac-dl2": "dl", "cac-ai2": "ai", "cac-df2": "df" };
const GOV_PARTS = [
  { id: "gov-governance", label: "Governance" },
  { id: "gov-security", label: "Security" },
  { id: "gov-metadata", label: "Metadata" },
];
const CLOUD_LOGOS = [["cloud-gcp", "gcp"], ["cloud-azure", "azure"], ["cloud-aws", "aws"]];
const ONPREM_LOGOS = [["onprem-dell", "dell"], ["onprem-s3", "s3"], ["onprem-nvidia", "nvidia"], ["onprem-amd", "amd"]];

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } };

export default function PlatformStack({ searchQuery = "" }) {
  const state = useDiagramState(searchQuery);
  const { dim } = state;
  const [activeFlow, setActiveFlow] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  const flowSet = useMemo(() => {
    const f = activeFlow && connectorFlows.find((x) => x.id === activeFlow);
    return f ? new Set(f.highlights) : null;
  }, [activeFlow]);
  const flowState = flowSet ? { ...state, dim: (id) => !flowSet.has(id) } : state;

  const playFlows = () => {
    clearInterval(timer.current);
    let i = 0;
    setActiveFlow(connectorFlows[0].id);
    timer.current = setInterval(() => {
      i += 1;
      if (i >= connectorFlows.length) {
        clearInterval(timer.current);
        setTimeout(() => setActiveFlow(null), 1300);
        return;
      }
      setActiveFlow(connectorFlows[i].id);
    }, 1600);
  };

  const flowOn = (id) => activeFlow === id;
  const flowOff = (id) => activeFlow && activeFlow !== id;
  const s = flowState;

  return (
    <div className="pex-viewport">
      <motion.div className={`pex ${activeFlow ? "is-flowing" : ""}`} variants={container} initial="hidden" animate="show">
        <svg className="pex-wires" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="pexGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[
            { id: "flow-jobs", d: "M360 108 H500 H640", c: "#f2662d" },
            { id: "flow-query", d: "M640 300 H500 H360", c: "#4a9fe8" },
            { id: "flow-data", d: "M360 492 H500 H640", c: "#2dd4bf" },
          ].map((w) => (
            <g key={w.id} className={`pex-wire ${flowOn(w.id) ? "is-on" : ""} ${flowOff(w.id) ? "is-off" : ""}`}>
              <path d={w.d} fill="none" stroke={w.c} className="pex-wire-path" />
              <circle r="5" fill="#fff" filter="url(#pexGlow)" className="pex-wire-dot">
                <animateMotion dur="2.4s" repeatCount="indefinite" path={w.d} />
              </circle>
            </g>
          ))}
        </svg>

        <div className="pex-board">
          {/* ---------- LEFT: Cloudera Base ---------- */}
          <motion.section className="pex-env pex-env--base" variants={reveal}>
            <Hit nodeId="base-frame" state={s} className="pex-env-head">
              <strong>{basePillar.title}</strong>
              <span>{basePillar.subtitle}</span>
            </Hit>
            <div className="pex-svc-row">
              {basePillar.services.map((svc) => (
                <Hit key={svc.id} nodeId={svc.id} state={s} className="pex-tile pex-tile--base">
                  <span className="pex-tile-ic"><ServiceGlyphs type={svc.icon} /></span>
                  <span className="pex-tile-label">{svc.label}</span>
                </Hit>
              ))}
            </div>
            <div className="pex-band">
              <Hit to="/components?category=engines" state={s} label="All engines" className="pex-band-label pex-link">
                {basePillar.enginesLabel}
              </Hit>
              <div className="pex-logos">
                {[["eng-spark", "spark"], ["eng-nifi", "nifi"], ["eng-kafka", "kafka"]].map(([id, logo]) => (
                  <Hit key={id} nodeId={id} state={s} className="pex-logo-hit"><BrandLogo id={logo} /></Hit>
                ))}
              </div>
            </div>
            <Hit nodeId="base-mgr" state={s} className="pex-mgr"><ClouderaMark suffix="Manager" /></Hit>
            <div className={`pex-platform ${dim("base-platform") ? "is-dim" : ""}`}>
              <Hit nodeId="base-obj" state={s} className="pex-plat-cell"><ClouderaMark suffix="Object Store" /></Hit>
              <Hit nodeId="base-platform" state={s} className="pex-plat-mid"><ClouderaMark suffix="Platform" /></Hit>
              <Hit nodeId="base-sdx" state={s} className="pex-plat-cell pex-plat-cell--sdx"><ClouderaMark suffix="SDX" /></Hit>
            </div>
          </motion.section>

          {/* ---------- CENTER: flows ---------- */}
          <motion.div className="pex-flows" variants={reveal}>
            {connectorFlows.map((f) => (
              <div key={f.id} onMouseEnter={() => setActiveFlow(f.id)} onMouseLeave={() => setActiveFlow(null)}>
                <Hit nodeId={f.id} state={state} className={`pex-flow-chip ${flowOn(f.id) ? "is-on" : ""} ${flowOff(f.id) ? "is-off" : ""}`}>
                  {f.label}
                </Hit>
              </div>
            ))}
          </motion.div>

          {/* ---------- RIGHT: Anywhere Cloud ---------- */}
          <motion.section className="pex-env pex-env--cac" variants={reveal}>
            <Hit nodeId="cac-frame" state={s} className="pex-env-head pex-env-head--cac">
              <strong>{cacPillar.title}</strong>
              <span>{cacPillar.subtitle}</span>
            </Hit>
            <div className="pex-cac-top">
              <div className="pex-subpanel pex-subpanel--wide">
                <Hit nodeId="cds20" state={s} className="pex-band-label pex-link">{cacPillar.cds20.label}</Hit>
                <div className="pex-cds-grid">
                  {cacPillar.cds20.services.map((svc) => (
                    <Hit key={svc.id} nodeId={svc.id} state={s} className="pex-tile pex-tile--cac">
                      <span className="pex-tile-ic pex-tile-ic--sm"><ServiceGlyphs type={CDS_GLYPH[svc.id] ?? "df"} /></span>
                      <span className="pex-tile-label">{svc.label}</span>
                    </Hit>
                  ))}
                </div>
              </div>
              <div className="pex-subpanel">
                <Hit to="/components?category=engines" state={s} label="All engines" className="pex-band-label pex-link">
                  {cacPillar.engines.label}
                </Hit>
                <div className="pex-logos pex-logos--stack">
                  <Hit nodeId="cac-spark4" state={s} className="pex-logo-hit"><BrandLogo id="spark4" /></Hit>
                  <Hit nodeId="cac-trino" state={s} className="pex-logo-hit"><BrandLogo id="trino" /></Hit>
                </div>
              </div>
              <div className="pex-subpanel">
                <Hit to="/components?category=partners" state={s} label="All partner engines" className="pex-band-label pex-link">
                  Partner Engines <em>(Examples)</em>
                </Hit>
                <div className="pex-logos pex-logos--stack">
                  {cacPillar.partners.items.map((p) => (
                    <Hit key={p.id} nodeId={p.id} state={s} className="pex-logo-hit"><BrandLogo id={p.label.toLowerCase()} /></Hit>
                  ))}
                </div>
              </div>
            </div>
            <div className="pex-fabric-wrap">
              <Hit nodeId="anywhere-core" state={s} label={cacPillar.anywhere.label} className="pex-fabric-kicker pex-link">
                {cacPillar.anywhere.label}
              </Hit>
              <Hit nodeId="unified-fabric" state={s} className="pex-fabric-title pex-link">{cacPillar.anywhere.fabric.label}</Hit>
              <div className="pex-gov-row">
                <div className={`pex-gov pex-gov--split ${dim("atlas-ranger") ? "is-dim" : ""}`}>
                  <div className="pex-gov-names">
                    <Hit nodeId="gov-atlas" state={s} className="pex-gov-link"><strong>Apache Atlas</strong></Hit>
                    <span aria-hidden="true">/</span>
                    <Hit nodeId="gov-ranger" state={s} className="pex-gov-link"><strong>Ranger</strong></Hit>
                  </div>
                  <div className="pex-gov-chips">
                    {GOV_PARTS.map((g) => (
                      <Hit key={g.id} nodeId={g.id} state={s} className="pex-gov-chip">{g.label}</Hit>
                    ))}
                  </div>
                </div>
                <Hit nodeId="data-lineage" state={s} className="pex-gov">
                  <strong>{cacPillar.anywhere.lineage.label}</strong>
                  <span>{cacPillar.anywhere.lineage.sub}</span>
                </Hit>
              </div>
              <Hit nodeId="cac-obj" state={s} className="pex-obj-bar"><ClouderaMark suffix="Object Store" /></Hit>
            </div>
          </motion.section>
        </div>

        {/* ---------- FOOTER: deployment ---------- */}
        <motion.div className="pex-deploy" variants={reveal}>
          <div className="pex-deploy-box">
            <Hit nodeId="deploy-cloud" state={s} className="pex-deploy-head">
              <span className="pex-deploy-ic pex-deploy-ic--cloud" />{deployment.cloud.label}
            </Hit>
            <div className="pex-logos">
              {CLOUD_LOGOS.map(([id, logo]) => (
                <Hit key={id} nodeId={id} state={s} className="pex-logo-hit"><BrandLogo id={logo} /></Hit>
              ))}
            </div>
          </div>
          <div className="pex-deploy-box">
            <Hit nodeId="deploy-onprem" state={s} className="pex-deploy-head">
              <span className="pex-deploy-ic pex-deploy-ic--server" />{deployment.onPrem.label}
            </Hit>
            <div className="pex-logos">
              <Hit nodeId="onprem-obj" state={s} className="pex-deploy-cda"><ClouderaMark suffix="Object Store" /></Hit>
              {ONPREM_LOGOS.map(([id, logo]) => (
                <Hit key={id} nodeId={id} state={s} className="pex-logo-hit"><BrandLogo id={logo} /></Hit>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <button type="button" className={`pstack-play ${activeFlow ? "is-playing" : ""}`} onClick={playFlows}>
        <span className="pstack-play-ic">▶</span>{activeFlow ? "Flowing…" : "Trace data flow"}
      </button>
    </div>
  );
}
