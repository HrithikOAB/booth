import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { componentById, resourcesFor, primaryNodeFor, BOOTH_VIEW_META } from "../data/registry/index.js";
import ArchitectureCanvas from "../components/explorer/ArchitectureCanvas.jsx";
import StageTopBar from "../components/stage/StageTopBar.jsx";
import ActionDock from "../components/stage/ActionDock.jsx";
import NodeMicroPanel, { ComponentOverviewPanel } from "../components/stage/NodeMicroPanel.jsx";
import VideoModal from "../components/stage/VideoModal.jsx";
import VideoDrawer, { videoGroups } from "../components/stage/VideoDrawer.jsx";
import DocsModal from "../components/stage/DocsModal.jsx";
import ZoomIn from "../components/stage/ZoomIn.jsx";
import { OWNERSHIP } from "../data/registry/schema.js";

function ancestors(c) {
  const out = [];
  let p = c.parentId && componentById[c.parentId];
  while (p && out.length < 3) {
    out.unshift(p);
    p = p.parentId && componentById[p.parentId];
  }
  return out;
}

function firstDocUrl(c) {
  const docs = resourcesFor(c.id).docs.filter((d) => d.verified);
  return (docs.find((d) => d.kind === "architecture" || d.kind === "docs") ?? docs[0])?.url ?? null;
}

/** Level 2: one full-screen architecture stage per component. The diagram is the content. */
export default function ComponentPage() {
  const { componentId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const c = componentById[componentId];
  // `?context=<nodeId>` (from a Level-1 block) preselects that node; a trace node starts the trace.
  const context = params.get("context");
  const contextNode = c?.views.internal?.nodes.some((n) => n.id === context) ? context : null;
  const startTrace = Boolean(contextNode && c.booth.traceFrom.includes(contextNode));

  const [view, setView] = useState("internal");
  const [playSignal, setPlaySignal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [video, setVideo] = useState(null);
  const [docsFor, setDocsFor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setView("internal");
    setPlaySignal(0);
    setSelected(null);
    setVideo(null);
    setDocsFor(null);
    setDrawerOpen(false);
  }, [componentId]);

  const trail = useMemo(() => (c ? ancestors(c) : []), [c]);
  const hasVideos = useMemo(() => {
    if (!c) return false;
    const g = videoGroups(c);
    return g.own.length > 0 || g.related.length > 0;
  }, [c]);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const goPlatform = useCallback(() => {
    const chain = c ? [c, ...ancestors(c).reverse()] : [];
    const nodeId = chain.map((x) => primaryNodeFor(x.id)).find(Boolean);
    navigate(nodeId ? `/explore/v2?focus=${nodeId}` : "/explore/v2");
  }, [c, navigate]);

  const openVideo = useCallback((owner, item) => {
    const vids = resourcesFor(owner.id).videos;
    setVideo({ owner, videos: vids, start: Math.max(0, vids.indexOf(vids.find((v) => (v.id ?? v.src) === (item?.id ?? item?.src)))) });
  }, []);

  const renderPanel = useCallback(
    (p) => (
      <NodeMicroPanel
        {...p}
        component={c}
        onWatch={openVideo}
        onDocs={(target) => setDocsFor(target)}
        onExplore={(target) => navigate(target.route)}
      />
    ),
    [c, openVideo, navigate],
  );
  const renderIdlePanel = useCallback(
    () => <ComponentOverviewPanel key={c.id} component={c} hasMoreVideos={hasVideos} onWatchAll={() => setDrawerOpen(true)} onDocs={(t) => setDocsFor(t)} />,
    [c, hasVideos],
  );

  if (!c) {
    return (
      <div className="st st--missing">
        <h1>Component not found</h1>
        <Link className="st-dock-btn" to="/explore/v2">
          ← Platform
        </Link>
      </div>
    );
  }

  const focusTag = OWNERSHIP[c.booth.ownership]?.label;
  return (
    <ZoomIn className="st" key={c.id}>
      <StageTopBar component={c} trail={trail} nodeLabel={selected?.label} onPlatform={goPlatform} onCrumb={(x) => navigate(x.route)} />
      <div className="st-stage">
        <ArchitectureCanvas
          key={c.id}
          variant="booth"
          views={c.views}
          meta={BOOTH_VIEW_META}
          activeView={view}
          onViewChange={setView}
          playSignal={playSignal}
          trace={c.booth.trace}
          traceSignal={startTrace ? 1 : 0}
          initialSelectedId={startTrace ? null : contextNode}
          focusTag={focusTag}
          renderPanel={renderPanel}
          renderIdlePanel={renderIdlePanel}
          onSelectionChange={setSelected}
          title={`${c.name} architecture`}
        />
      </div>
      <ActionDock
        canWatch={hasVideos}
        canIntegrate={Boolean(c.views.integration)}
        activeView={view}
        onWatch={() => setDrawerOpen(true)}
        onHowItWorks={() => {
          setView("workflow");
          setPlaySignal((n) => n + 1);
        }}
        onIntegrations={() => setView("integration")}
        onDocs={() => setDocsFor(c)}
      />
      {video && (
        <VideoModal
          videos={video.videos}
          startIndex={video.start}
          title={video.owner.name}
          subtitle={video.owner.booth.oneLiner}
          docUrl={firstDocUrl(video.owner)}
          onClose={() => setVideo(null)}
        />
      )}
      {drawerOpen && <VideoDrawer component={c} onClose={closeDrawer} />}
      {docsFor && <DocsModal title={docsFor.name} docs={resourcesFor(docsFor.id).docs} onClose={() => setDocsFor(null)} />}
    </ZoomIn>
  );
}
