import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ArchitectureCanvas from "../explorer/ArchitectureCanvas.jsx";
import { VideoCard, DocCard } from "./MediaCards.jsx";
import { componentById } from "../../data/registry/index.js";
import { industryById } from "../../data/industries.js";

export const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "architecture", label: "Internal architecture" },
  { id: "workflow", label: "Workflow" },
  { id: "io", label: "Inputs, outputs & APIs" },
  { id: "dataflow", label: "Data flow" },
  { id: "deployment", label: "Deployment" },
  { id: "security", label: "Security & operations" },
  { id: "context", label: "Cloudera context" },
  { id: "usecases", label: "Use cases" },
  { id: "resources", label: "Resources & media" },
];

/** Mounts children only once scrolled near, so a page with several canvases stays fast. */
export function LazyMount({ height, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (shown || !ref.current) return undefined;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setShown(true), { rootMargin: "300px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [shown]);
  return (
    <div ref={ref} style={shown ? undefined : { minHeight: height }} className={shown ? undefined : "lazy-ph"}>
      {shown ? children : null}
    </div>
  );
}

function Section({ id, n, title, lead, children }) {
  return (
    <section id={id} className="cp-section" aria-labelledby={`${id}-h`}>
      <header className="cp-sec-head">
        <span className="cp-sec-n">{String(n).padStart(2, "0")}</span>
        <div>
          <h2 id={`${id}-h`}>{title}</h2>
          {lead && <p>{lead}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}

function Canvas({ views, keys, initial, height = "520px", title }) {
  const subset = Object.fromEntries(keys.filter((k) => views[k]).map((k) => [k, views[k]]));
  if (!Object.keys(subset).length) return <p className="cp-empty">No diagram authored for this section.</p>;
  return (
    <LazyMount height={height}>
      <ArchitectureCanvas views={subset} initialView={initial} height={height} title={title} />
    </LazyMount>
  );
}

function List({ items }) {
  if (!items?.length) return <p className="cp-empty">—</p>;
  return (
    <ul className="cp-list">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

export function OverviewSection({ c, appearsIn }) {
  return (
    <Section id="overview" n={1} title="Overview">
      <div className="cp-overview">
        <div>
          <p className="cp-lead">{c.overview}</p>
          {c.businessValue && (
            <div className="cp-callout">
              <h3>Business value</h3>
              <p>{c.businessValue}</p>
            </div>
          )}
          {c.highlights?.length > 0 && (
            <div className="cp-callout cp-callout--teal">
              <h3>Highlights</h3>
              <List items={c.highlights} />
            </div>
          )}
        </div>
        <div className="cp-card">
          <h3>Key capabilities</h3>
          <List items={c.capabilities} />
          {appearsIn.length > 0 && (
            <>
              <h3>Where it appears</h3>
              <div className="chip-row">
                {appearsIn.map((a) => (
                  <Link key={a.nodeId} className="chip" to={`/explore/v2?focus=${a.nodeId}`}>
                    {a.label}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  );
}

export function ArchitectureSection({ c }) {
  return (
    <Section id="architecture" n={2} title="Internal architecture" lead="Click any block for details. Blocks marked “+ inside” expand to show sub-components; ↗ blocks link to their own pages.">
      <Canvas views={c.views} keys={["internal", "integration"]} initial="internal" height="560px" title={`${c.name} architecture`} />
    </Section>
  );
}

export function WorkflowSection({ c }) {
  const stages = c.workflow?.stages ?? [];
  return (
    <Section id="workflow" n={3} title={c.workflow?.title ?? "Workflow"} lead="Press Play to walk through each step; the active path animates.">
      <Canvas views={c.views} keys={["workflow"]} initial="workflow" height="420px" title={`${c.name} workflow`} />
      <ol className="cp-steps">
        {stages.map((s, i) => (
          <li key={s.id}>
            <span className="cp-step-n">{i + 1}</span>
            <div>
              <strong>{s.label}</strong>
              <p>{s.description}</p>
              {s.ref && componentById[s.ref] && (
                <Link className="cp-inline-link" to={componentById[s.ref].route}>
                  {componentById[s.ref].name} →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function IOSection({ c }) {
  const io = c.io ?? {};
  const cells = [
    ["Inputs", io.inputs],
    ["Outputs", io.outputs],
    ["Dependencies", io.dependencies],
    ["Connectors", io.connectors],
    ["APIs & interfaces", io.apis],
    ["Integrations", io.integrations],
  ];
  return (
    <Section id="io" n={4} title="Inputs, outputs & APIs">
      <div className="cp-grid3">
        {cells.map(([t, items]) => (
          <div key={t} className="cp-card">
            <h3>{t}</h3>
            <List items={items} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function DataFlowSection({ c }) {
  return (
    <Section id="dataflow" n={5} title="Data flow" lead="How data moves through this component. Particles show direction; dashed lines are control or optional paths.">
      <Canvas views={c.views} keys={["dataFlow"]} initial="dataFlow" height="440px" title={`${c.name} data flow`} />
    </Section>
  );
}

export function DeploymentSection({ c }) {
  return (
    <Section id="deployment" n={6} title="Deployment" lead={c.edition ? `Shown in the diagram as part of ${c.edition}.` : undefined}>
      <Canvas views={c.views} keys={["deployment"]} initial="deployment" height="420px" title={`${c.name} deployment`} />
    </Section>
  );
}

export function SecuritySection({ c }) {
  const ops = c.ops ?? {};
  return (
    <Section id="security" n={7} title="Security & operations">
      <div className="cp-grid4">
        {[
          ["Security", ops.security],
          ["Governance", ops.governance],
          ["Monitoring", ops.monitoring],
          ["Scalability", ops.scalability],
        ].map(([t, v]) => (
          <div key={t} className="cp-card">
            <h3>{t}</h3>
            <p>{v ?? "—"}</p>
          </div>
        ))}
      </div>
      {c.views.security && <Canvas views={c.views} keys={["security"]} initial="security" height="400px" title={`${c.name} security`} />}
    </Section>
  );
}

export function ContextSection({ c }) {
  const ctx = c.clouderaContext ?? {};
  return (
    <Section id="context" n={8} title="Cloudera context">
      {c.illustrative && (
        <p className="cp-warn" role="note">
          Illustrative: the integration shown here is a reference pattern, not a documented Cloudera product integration.
        </p>
      )}
      <div className="cp-grid3">
        <div className="cp-card">
          <h3>On its own</h3>
          <p>{ctx.standalone}</p>
        </div>
        <div className="cp-card cp-card--accent">
          <h3>Inside Cloudera</h3>
          <p>{ctx.clouderaIntegration}</p>
        </div>
        <div className="cp-card">
          <h3>Real-world example</h3>
          <p>{ctx.realWorld}</p>
        </div>
      </div>
      {c.verificationNotes?.length > 0 && (
        <div className="cp-notes" role="note">
          <h3>Verification notes</h3>
          <List items={c.verificationNotes} />
        </div>
      )}
    </Section>
  );
}

export function UseCasesSection({ c }) {
  return (
    <Section id="usecases" n={9} title="Use cases">
      <div className="cp-grid3">
        {(c.useCases ?? []).map((u) => (
          <div key={u.title} className="cp-card">
            <h3>{u.title}</h3>
            <p>{u.scenario}</p>
            <div className="chip-row">
              {(u.industryIds ?? [])
                .filter((id) => industryById[id])
                .map((id) => (
                  <Link key={id} className="chip" to={`/industries/${id}`}>
                    {industryById[id].name}
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ResourcesSection({ resources }) {
  const { docs, videos } = resources;
  return (
    <Section id="resources" n={10} title="Official resources & media" lead="Links are checked automatically; each shows when it was last verified.">
      {videos.length > 0 ? (
        <div className="cp-media">
          {videos.map((v) => (
            <VideoCard key={v.src ?? v.id} item={v} />
          ))}
        </div>
      ) : (
        <p className="cp-empty">No verified video for this component yet.</p>
      )}
      <div className="cp-docs">
        {docs.map((d) => (
          <DocCard key={d.url} item={d} />
        ))}
      </div>
    </Section>
  );
}

export function RelatedRail({ c }) {
  const rel = (c.relatedComponentIds ?? []).map((id) => componentById[id]).filter(Boolean);
  if (!rel.length) return null;
  return (
    <aside className="cp-related" aria-label="Related components">
      <h2>Related components</h2>
      <div className="cp-related-grid">
        {rel.map((r) => (
          <Link key={r.id} to={r.route} className="rel-card">
            <span className="rel-cat">{r.category.replace(/-/g, " ")}</span>
            <strong>{r.name}</strong>
            <span>{r.tagline}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
