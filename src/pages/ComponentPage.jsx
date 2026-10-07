import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { componentById, resourcesFor, diagramNodesFor, CATEGORIES } from "../data/registry/index.js";
import { OriginBadge } from "../components/component-page/MediaCards.jsx";
import {
  SECTIONS,
  OverviewSection,
  ArchitectureSection,
  WorkflowSection,
  IOSection,
  DataFlowSection,
  DeploymentSection,
  SecuritySection,
  ContextSection,
  UseCasesSection,
  ResourcesSection,
  RelatedRail,
} from "../components/component-page/Sections.jsx";

const CONTEXT_LABEL = { base: "Cloudera Base pillar", anywhere: "Anywhere Cloud pillar", onprem: "On-premises deployment", fabric: "Anywhere Cloud fabric core" };

function regionLabel(nodeId) {
  if (nodeId.startsWith("base-") || nodeId.startsWith("eng-")) return "Base pillar";
  if (nodeId.startsWith("flow-")) return "Connector flow";
  if (nodeId.startsWith("cloud-") || nodeId.startsWith("onprem-") || nodeId.startsWith("deploy-")) return "Deployment footer";
  return "Anywhere Cloud pillar";
}

export default function ComponentPage() {
  const { componentId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const c = componentById[componentId];
  const scrollRef = useRef(null);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    setActive("overview");
  }, [componentId]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { root, rootMargin: "-20% 0px -65% 0px" },
    );
    root.querySelectorAll(".cp-section").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [componentId]);

  if (!c) {
    return (
      <div className="page-scroll">
        <div className="cp-missing">
          <h1>Component not found</h1>
          <p>No page exists for “{componentId}”.</p>
          <Link className="btn-link" to="/components">
            Browse all components →
          </Link>
        </div>
      </div>
    );
  }

  const context = params.get("context");
  const contextNote = context && c.contexts?.[context];
  const cat = CATEGORIES.find((x) => x.id === c.category);
  const parent = c.parentId ? componentById[c.parentId] : null;
  const prevEdition = c.previousEditionId ? componentById[c.previousEditionId] : null;
  const appears = diagramNodesFor(c.id).map((a) => ({ ...a, label: (a.context && CONTEXT_LABEL[a.context]) || regionLabel(a.nodeId) }));
  const appearsIn = appears.filter((a, i) => appears.findIndex((b) => b.label === a.label) === i);
  const resources = resourcesFor(c.id);

  const jump = (id) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="page-scroll" ref={scrollRef}>
      <div className="cp">
        <div className="cp-topbar">
          <button type="button" className="back-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/explore/v2"))}>
            ← Back
          </button>
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/explore/v2">Architecture</Link>
              </li>
              <li>
                <Link to={`/components?category=${c.category}`}>{cat?.label ?? c.category}</Link>
              </li>
              {parent && (
                <li>
                  <Link to={parent.route}>{parent.name}</Link>
                </li>
              )}
              <li aria-current="page">{c.name}</li>
            </ol>
          </nav>
        </div>

        <header className="cp-hero">
          <div className="cp-badges">
            <OriginBadge origin={c.origin} />
            {c.edition && <span className="badge badge--outline">{c.edition}</span>}
            {c.illustrative && <span className="badge badge--warn">Illustrative integration</span>}
            {c.needsVerification && <span className="badge badge--warn">Needs verification</span>}
          </div>
          <h1>{c.name}</h1>
          {c.aka && <p className="cp-aka">{c.aka}</p>}
          <p className="cp-tagline">{c.tagline}</p>
          {contextNote && (
            <p className="cp-context" role="note">
              <strong>Opened from {CONTEXT_LABEL[context] ?? context}:</strong> {contextNote}
            </p>
          )}
          {prevEdition && (
            <p className="cp-context">
              Next edition of <Link to={prevEdition.route}>{prevEdition.name}</Link>.
            </p>
          )}
        </header>

        <div className="cp-layout">
          <nav className="cp-toc" aria-label="On this page">
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button type="button" className={active === s.id ? "on" : ""} aria-current={active === s.id ? "true" : undefined} onClick={() => jump(s.id)}>
                    <span>{String(i + 1).padStart(2, "0")}</span> {s.label}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="cp-main" key={c.id}>
            <OverviewSection c={c} appearsIn={appearsIn} />
            <ArchitectureSection c={c} />
            <WorkflowSection c={c} />
            <IOSection c={c} />
            <DataFlowSection c={c} />
            <DeploymentSection c={c} />
            <SecuritySection c={c} />
            <ContextSection c={c} />
            <UseCasesSection c={c} />
            <ResourcesSection resources={resources} />
            <RelatedRail c={c} />
          </div>
        </div>
      </div>
    </div>
  );
}
