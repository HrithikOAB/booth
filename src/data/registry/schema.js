// ============================================================
//  Component registry — schema, normalizers, and fallback views.
//
//  A raw component entry (see components/*.js):
//  {
//    id, name, aka?, origin, category, parentId?, edition?,
//    tagline, overview, businessValue, capabilities[], highlights[],
//    workflow: { title, stages: [[id, label, narration, ref?], ...] },
//    views: { internal, dataFlow, deployment, security? },   // hand-authored
//    io: { inputs[], outputs[], dependencies[], connectors[], apis[], integrations[] },
//    ops: { security, governance, monitoring, scalability },
//    clouderaContext: { standalone, clouderaIntegration, realWorld },
//    useCases: [{ title, scenario, industryIds[] }],
//    relatedComponentIds[], verificationNotes[]?, illustrative?
//  }
//
//  A VIEW is { dir?, nodes[], edges[] }:
//    node  = [id, label, description?, kind?, ref?]  or
//            { id, label, description, kind, ref, children: [node...], childEdges: [edge...] }
//    edge  = [source, target, label?, { dashed?, kind? }?]
// ============================================================

export const ORIGINS = {
  cloudera: { label: "Cloudera product", tone: "orange" },
  "apache-oss": { label: "Apache Software Foundation project", tone: "blue" },
  "open-source": { label: "Open-source project (non-ASF)", tone: "blue" },
  partner: { label: "Partner engine · third-party product", tone: "slate" },
  "cloud-provider": { label: "Public cloud provider", tone: "teal" },
  "hardware-vendor": { label: "Hardware / infrastructure vendor", tone: "teal" },
  capability: { label: "Platform capability", tone: "violet" },
  flow: { label: "Architecture flow", tone: "violet" },
};

export const CATEGORIES = [
  { id: "cloudera-services", label: "Cloudera data services" },
  { id: "cds-2", label: "Cloudera Data Services 2.0" },
  { id: "platform", label: "Platform & control plane" },
  { id: "engines", label: "Engines & open formats" },
  { id: "partners", label: "Partner engines" },
  { id: "governance", label: "Governance, security & metadata" },
  { id: "infrastructure", label: "Cloud, storage & hardware" },
  { id: "flows", label: "Architecture flows" },
];

export function normNode(n) {
  if (Array.isArray(n)) {
    const [id, label, description = "", kind = "core", ref = null] = n;
    return { id, label, description, kind, ref };
  }
  return {
    kind: "core",
    description: "",
    ref: null,
    ...n,
    children: n.children?.map(normNode),
    childEdges: n.childEdges?.map(normEdge),
  };
}

export function normEdge(e, i = 0) {
  if (Array.isArray(e)) {
    const [source, target, label, opts = {}] = e;
    return { id: `e-${source}-${target}-${i}`, source, target, label, ...opts };
  }
  return { id: e.id ?? `e-${e.source}-${e.target}-${i}`, ...e };
}

export function normView(view) {
  if (!view) return null;
  return {
    dir: view.dir ?? "LR",
    caption: view.caption,
    nodes: view.nodes.map(normNode),
    edges: view.edges.map(normEdge),
  };
}

export function normStage(s) {
  if (Array.isArray(s)) {
    const [id, label, description, ref = null] = s;
    return { id, label, description, ref };
  }
  return s;
}

/** Workflow view built from playback stages; linear unless `workflow.edges` is given. */
export function workflowView(workflow) {
  if (!workflow?.stages?.length) return null;
  const stages = workflow.stages.map(normStage);
  const nodes = stages.map((s) => ({ ...s, kind: "stage" }));
  const edges = workflow.edges
    ? workflow.edges.map(normEdge)
    : stages.slice(1).map((s, i) => normEdge([stages[i].id, s.id], i));
  return { dir: workflow.dir ?? "LR", nodes, edges };
}

export function kindForOrigin(origin) {
  return {
    cloudera: "cloudera",
    "apache-oss": "apache",
    "open-source": "apache",
    partner: "partner",
    "cloud-provider": "cloud",
    "hardware-vendor": "vendor",
    capability: "security",
    flow: "stage",
  }[origin] ?? "core";
}

/** Hub-and-spoke integration view derived from relatedComponentIds. */
export function integrationView(component, componentById) {
  const rel = (component.relatedComponentIds ?? []).filter((id) => componentById[id] && id !== component.id);
  if (!rel.length) return null;
  return {
    dir: "LR",
    layout: "radial",
    nodes: [
      { id: component.id, label: component.name, description: component.tagline, kind: "focus", ref: null },
      ...rel.map((id) => ({
        id,
        label: componentById[id].name,
        description: componentById[id].tagline,
        ref: id,
        kind: kindForOrigin(componentById[id].origin),
      })),
    ],
    edges: rel.map((id, i) => normEdge([component.id, id], i)),
  };
}

/**
 * Fallback SECURITY view, used only for Cloudera-origin components that do
 * not author their own — SDX governs Cloudera data services.
 */
export function clouderaSecurityView(component) {
  return normView({
    nodes: [
      ["user", "User / service identity", "Authenticated via Kerberos, LDAP/AD or SAML through the platform identity layer.", "client"],
      ["svc", component.name, `${component.name} receives the request and calls its embedded authorization plugin.`, "focus"],
      ["ranger", "Apache Ranger", "Evaluates resource, tag and row/column policies and returns allow/deny.", "apache", "apache-ranger"],
      ["atlas", "Apache Atlas", "Supplies classifications (tags) used by tag-based policies.", "apache", "apache-atlas"],
      ["audit", "Audit store", "Every decision is written as an audit event for compliance review.", "store", "security-policies-auditing"],
      ["sdx", "Cloudera SDX", "Shared security & governance context for every Cloudera service.", "cloudera", "cloudera-sdx"],
    ],
    edges: [
      ["user", "svc", "request"],
      ["svc", "ranger", "authorize"],
      ["atlas", "ranger", "tags", { dashed: true }],
      ["ranger", "audit", "audit event"],
      ["sdx", "ranger", "policies", { dashed: true }],
      ["sdx", "atlas", "metadata", { dashed: true }],
    ],
  });
}

export const VIEW_META = [
  { id: "internal", label: "Architecture" },
  { id: "workflow", label: "Workflow", playback: true },
  { id: "dataFlow", label: "Data flow" },
  { id: "deployment", label: "Deployment" },
  { id: "integration", label: "Integrations" },
  { id: "security", label: "Security" },
];

/** Finalize a raw entry: normalize views and derive the route. */
export function finalizeComponent(raw, componentById) {
  const views = {};
  for (const key of ["internal", "dataFlow", "deployment", "security"]) {
    if (raw.views?.[key]) views[key] = normView(raw.views[key]);
  }
  views.workflow = workflowView(raw.workflow);
  views.integration = integrationView(raw, componentById);
  if (!views.security && raw.origin === "cloudera") views.security = clouderaSecurityView(raw);

  return {
    ...raw,
    route: `/component/${raw.id}`,
    workflow: raw.workflow ? { ...raw.workflow, stages: raw.workflow.stages.map(normStage) } : null,
    views,
  };
}
