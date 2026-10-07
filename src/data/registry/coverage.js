// Coverage checks shared by the /coverage page and scripts/verify-coverage.mjs.
import { components, componentById, resourcesFor, nodeMap } from "./index.js";
import { flatNodes } from "../../components/explorer/layout.js";

export const CHECKS = [
  { id: "overview", label: "Overview", test: (c) => Boolean(c.overview && c.tagline && c.capabilities?.length) },
  { id: "internal", label: "Internal arch (≥5 nodes)", test: (c) => (c.views.internal ? flatNodes(c.views.internal).length >= 5 : false) },
  { id: "workflow", label: "Workflow (≥4 stages)", test: (c) => (c.workflow?.stages?.length ?? 0) >= 4 },
  { id: "io", label: "Inputs / outputs / APIs", test: (c) => Boolean(c.io?.inputs?.length && c.io?.outputs?.length && c.io?.apis?.length) },
  { id: "dataFlow", label: "Data flow", test: (c) => (c.views.dataFlow?.nodes.length ?? 0) >= 3 },
  { id: "deployment", label: "Deployment", test: (c) => (c.views.deployment?.nodes.length ?? 0) >= 2 },
  { id: "ops", label: "Security & ops", test: (c) => Boolean(c.ops?.security && c.ops?.governance && c.ops?.monitoring && c.ops?.scalability) },
  { id: "context", label: "Cloudera context", test: (c) => Boolean(c.clouderaContext?.standalone && c.clouderaContext?.clouderaIntegration && c.clouderaContext?.realWorld) },
  { id: "useCases", label: "Use cases", test: (c) => (c.useCases?.length ?? 0) >= 1 },
  { id: "resources", label: "Verified resources", test: (c) => resourcesFor(c.id).docs.some((d) => d.verified) },
  { id: "media", label: "Media", test: (c) => resourcesFor(c.id).videos.length > 0 },
];

function danglingRefs(c) {
  const refs = [...(c.relatedComponentIds ?? []), c.parentId, c.previousEditionId].filter(Boolean);
  Object.values(c.views).forEach((v) => v && flatNodes(v).forEach((n) => n.ref && refs.push(n.ref)));
  (c.workflow?.stages ?? []).forEach((s) => s.ref && refs.push(s.ref));
  return [...new Set(refs.filter((r) => !componentById[r]))];
}

export function computeCoverage() {
  const rows = components.map((c) => {
    const results = Object.fromEntries(CHECKS.map((k) => [k.id, k.test(c)]));
    const dangling = danglingRefs(c);
    const res = resourcesFor(c.id);
    return {
      id: c.id,
      name: c.name,
      category: c.category,
      origin: c.origin,
      results,
      dangling,
      illustrative: Boolean(c.illustrative),
      needsVerification: Boolean(c.needsVerification),
      verificationNotes: c.verificationNotes ?? [],
      verifiedDocs: res.docs.filter((d) => d.verified).length,
      totalDocs: res.docs.length,
      videos: res.videos.length,
      complete: Object.values(results).every(Boolean) && !dangling.length,
    };
  });
  const unmappedNodes = Object.entries(nodeMap)
    .filter(([, v]) => !componentById[v.id])
    .map(([k]) => k);
  return {
    rows,
    unmappedNodes,
    totals: {
      components: rows.length,
      complete: rows.filter((r) => r.complete).length,
      diagramNodes: Object.keys(nodeMap).length,
      verifiedLinks: rows.reduce((s, r) => s + r.verifiedDocs, 0),
      totalLinks: rows.reduce((s, r) => s + r.totalDocs, 0),
    },
    blockers: rows.filter((r) => r.illustrative || r.needsVerification || r.verificationNotes.length),
  };
}
