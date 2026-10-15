import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { industryById } from "../data/industries.js";
import { componentById, resourcesFor } from "../data/registry/index.js";
import { markResource } from "../data/registry/resources.js";
import { INDUSTRY_VIEW_META, useCaseArchitecture } from "../data/industryArchitecture.js";
import ArchitectureCanvas from "../components/explorer/ArchitectureCanvas.jsx";
import NodeMicroPanel from "../components/stage/NodeMicroPanel.jsx";
import VideoModal from "../components/stage/VideoModal.jsx";
import DocsModal from "../components/stage/DocsModal.jsx";

/** Industry use case as a diagram-first stage: business event → Cloudera components → business action. */
export default function IndustryDetailPage() {
  const { industryId } = useParams();
  const navigate = useNavigate();
  const industry = industryById[industryId];

  const [activeUseCase, setActiveUseCase] = useState(industry?.useCases?.[0]?.id);
  const [view, setView] = useState("workflow");
  const [playSignal, setPlaySignal] = useState(1);
  const [traceSignal, setTraceSignal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [video, setVideo] = useState(null);
  const [docsFor, setDocsFor] = useState(null);

  useEffect(() => {
    if (!industry) navigate("/industries", { replace: true });
  }, [industry, navigate]);

  useEffect(() => {
    setActiveUseCase(industry?.useCases?.[0]?.id);
  }, [industry]);

  const uc = industry?.useCases.find((u) => u.id === activeUseCase) ?? industry?.useCases[0];
  const arch = useMemo(() => (industry && uc ? useCaseArchitecture(industry, uc) : null), [industry, uc]);

  // The lifecycle plays as soon as a use case is shown — the story tells itself.
  useEffect(() => {
    setView("workflow");
    setPlaySignal((n) => n + 1);
  }, [uc?.id]);

  // Industry nodes have no registry entry of their own; the linked component supplies video and docs.
  const pseudo = useMemo(() => (industry ? { id: industry.id, name: industry.name, booth: { nodes: {}, oneLiner: industry.tagline } } : null), [industry]);
  const openVideo = useCallback((owner, item) => {
    const vids = resourcesFor(owner.id).videos;
    setVideo({ owner, videos: vids, start: Math.max(0, vids.findIndex((v) => (v.id ?? v.src) === (item?.id ?? item?.src))) });
  }, []);
  const renderPanel = useCallback(
    (p) => <NodeMicroPanel {...p} component={pseudo} onWatch={openVideo} onDocs={(t) => setDocsFor(t)} onExplore={(t) => navigate(t.route)} />,
    [pseudo, openVideo, navigate],
  );

  if (!industry || !uc || !arch) return null;

  const industryVideo = industry.video ? [markResource({ type: "local", title: `${industry.name} with Cloudera`, src: industry.video })] : null;
  const industryDocs = industry.url ? [markResource({ kind: "product", title: `${industry.name} solutions on cloudera.com`, url: industry.url })] : [];

  return (
    <div className="st st--industry">
      <header className="st-top">
        <button type="button" className="st-back" onClick={() => navigate("/industries")}>
          ← Industries
        </button>
        <div className="st-id">
          <nav className="st-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <button type="button" onClick={() => navigate("/explore/v2")}>Platform</button>
              </li>
              <li>
                <button type="button" onClick={() => navigate("/industries")}>Industries</button>
              </li>
              <li>{industry.name}</li>
              <li aria-current="page">{selected?.label ?? uc.title}</li>
            </ol>
          </nav>
          <div className="st-title">
            <h1>{industry.name}</h1>
            <p>{uc.summary}</p>
          </div>
        </div>
        <div className="st-badges">
          <span className="st-badge st-badge--outline">Reference pattern</span>
        </div>
      </header>

      <div className="st-ind-body">
        <div className="st-ucs" role="tablist" aria-label="Use cases">
          {industry.useCases.map((u) => (
            <button key={u.id} type="button" role="tab" aria-selected={u.id === uc.id} className={u.id === uc.id ? "on" : ""} onClick={() => setActiveUseCase(u.id)}>
              {u.title}
            </button>
          ))}
        </div>
        <div className="st-stage">
          <ArchitectureCanvas
            key={`${industry.id}-${uc.id}`}
            variant="booth"
            views={arch.views}
            meta={INDUSTRY_VIEW_META}
            activeView={view}
            onViewChange={setView}
            playSignal={playSignal}
            traceSignal={traceSignal}
            trace={arch.trace}
            renderPanel={renderPanel}
            onSelectionChange={setSelected}
            title={`${industry.name}: ${uc.title}`}
          />
        </div>
      </div>

      <nav className="st-dock" aria-label="Use case actions">
        {industryVideo && (
          <button type="button" className="st-dock-btn st-dock-btn--watch" onClick={() => setVideo({ owner: pseudo, videos: industryVideo, start: 0 })}>
            <span aria-hidden="true">▶</span> Watch
          </button>
        )}
        <button
          type="button"
          className={`st-dock-btn ${view === "workflow" ? "on" : ""}`}
          onClick={() => {
            setView("workflow");
            setPlaySignal((n) => n + 1);
          }}
        >
          <span aria-hidden="true">↻</span> Play lifecycle
        </button>
        <button
          type="button"
          className={`st-dock-btn ${view === "internal" ? "on" : ""}`}
          onClick={() => {
            setView("internal");
            setTraceSignal((n) => n + 1);
          }}
        >
          <span aria-hidden="true">⟿</span> Trace data
        </button>
        {industryDocs.length > 0 && (
          <button type="button" className="st-dock-btn" onClick={() => setDocsFor({ name: industry.name, docs: industryDocs })}>
            <span aria-hidden="true">⌗</span> Official page
          </button>
        )}
      </nav>
      <div className="st-ind-comps" aria-label="Cloudera components in this use case">
        {arch.componentIds.map((id) => (
          <button key={id} type="button" onClick={() => navigate(componentById[id].route)}>
            {componentById[id].name}
          </button>
        ))}
      </div>

      {video && (
        <VideoModal videos={video.videos} startIndex={video.start} title={video.owner.name} subtitle={video.owner.booth?.oneLiner} onClose={() => setVideo(null)} />
      )}
      {docsFor && <DocsModal title={docsFor.name} docs={docsFor.docs ?? resourcesFor(docsFor.id).docs} onClose={() => setDocsFor(null)} />}
    </div>
  );
}
