// Verifies explorer completeness and writes coverage-report.md.
//   npm run verify            → report + non-zero exit on hard failures
// Hard failures: dangling refs, diagram ids without a component, industry
// architecture refs that do not resolve. Content gaps are reported, not fatal.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { computeCoverage, CHECKS } from "../src/data/registry/coverage.js";
import { componentById, nodeMap, resolveNode } from "../src/data/registry/index.js";
import { industries } from "../src/data/industries.js";
import { useCaseArchitecture } from "../src/data/industryArchitecture.js";
import { flatNodes } from "../src/components/explorer/layout.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cov = computeCoverage();
const failures = [];

// 1. Every clickable id used in the umbrella diagrams resolves to a component page.
const diagramFiles = ["src/components/architecture/PlatformStack.jsx", "src/components/architecture/PlatformArchitectureV2.jsx"];
const literalIds = new Set();
for (const f of diagramFiles) {
  const src = readFileSync(join(root, f), "utf8");
  for (const m of src.matchAll(/\b(?:nodeId|node)="([^"]+)"/g)) literalIds.add(m[1]);
  for (const m of src.matchAll(/\["((?:cloud|onprem|eng|gov)-[a-z0-9-]+)",/g)) literalIds.add(m[1]);
}
["base-ai", "base-de", "base-dl", "base-df", "cac-de2", "cac-dl2", "cac-ai2", "cac-df2", "p-neo4j", "p-starrocks", "p-clickhouse", "flow-jobs", "flow-query", "flow-data", "hybrid-auth", "hybrid-meta", "hybrid-net", "hybrid-port"].forEach((id) => literalIds.add(id));
const diagramRows = [...literalIds].sort().map((id) => {
  const r = resolveNode(id);
  if (!r) failures.push(`Diagram element "${id}" has no component page`);
  return { id, target: r ? r.component.id + (r.context ? `?context=${r.context}` : "") : "—" };
});

// 2. Dangling references inside component content.
cov.rows.filter((r) => r.dangling.length).forEach((r) => failures.push(`${r.id}: dangling refs ${r.dangling.join(", ")}`));
cov.unmappedNodes.forEach((n) => failures.push(`nodeMap "${n}" points at a missing component`));
// Booth rules are hard failures: a booth page must never show a long one-liner or a broken trace.
cov.rows.forEach((r) => r.boothProblems.forEach((p) => failures.push(`${r.id}: booth — ${p}`)));

// 3. Industry architectures: every ref resolves; every use case has ≥4 lifecycle stages.
const industryRows = [];
for (const ind of industries) {
  for (const uc of ind.useCases) {
    const { views, componentIds } = useCaseArchitecture(ind, uc);
    const refs = [...flatNodes(views.internal), ...views.workflow.nodes].map((n) => n.ref).filter(Boolean);
    const bad = refs.filter((r) => !componentById[r]);
    if (bad.length) failures.push(`${ind.id}/${uc.id}: unresolved refs ${bad.join(", ")}`);
    if (views.workflow.nodes.length < 4) failures.push(`${ind.id}/${uc.id}: lifecycle has < 4 stages`);
    industryRows.push({ ind: ind.name, uc: uc.title, nodes: flatNodes(views.internal).length, stages: views.workflow.nodes.length, comps: componentIds.length });
  }
}

// ---- report ----
const tick = (b) => (b ? "✅" : "❌");
const lines = [];
lines.push("# Cloudera Component Explorer — coverage report", "");
lines.push(`Generated ${new Date().toISOString().slice(0, 10)} by \`npm run verify\`.`, "");
lines.push("## Summary", "");
lines.push(`- Components with pages: **${cov.totals.components}** (${cov.totals.complete} pass every check)`);
lines.push(`- Diagram elements mapped: **${Object.keys(nodeMap).length}** in nodeMap, **${diagramRows.length}** clickable ids found in the two diagrams`);
lines.push(`- Verified documentation links: **${cov.totals.verifiedLinks} / ${cov.totals.totalLinks}**`);
lines.push(`- Industry use cases with interactive architecture + lifecycle: **${industryRows.length}** across ${industries.length} industries`);
lines.push(`- Hard failures: **${failures.length}**`, "");

lines.push("## Completion matrix", "");
lines.push(`| Component | ${CHECKS.map((c) => c.label).join(" | ")} | Docs ✓ | Videos |`);
lines.push(`|---|${CHECKS.map(() => ":-:").join("|")}|:-:|:-:|`);
for (const r of cov.rows) {
  lines.push(`| ${r.name} | ${CHECKS.map((c) => tick(r.results[c.id])).join(" | ")} | ${r.verifiedDocs}/${r.totalDocs} | ${r.videos} |`);
}
lines.push("");

lines.push("## Diagram element → page", "");
lines.push("| Element id | Opens |", "|---|---|");
diagramRows.forEach((d) => lines.push(`| \`${d.id}\` | \`/component/${d.target}\` |`));
lines.push("");

lines.push("## Industry architectures", "");
lines.push("| Industry | Use case | Nodes | Lifecycle stages | Linked components |", "|---|---|:-:|:-:|:-:|");
industryRows.forEach((r) => lines.push(`| ${r.ind} | ${r.uc} | ${r.nodes} | ${r.stages} | ${r.comps} |`));
lines.push("");

lines.push("## Gaps and blockers", "");
const gaps = cov.rows.filter((r) => !Object.values(r.results).every(Boolean));
if (gaps.length) {
  lines.push("Content checks not met:", "");
  gaps.forEach((r) => lines.push(`- **${r.name}**: missing ${CHECKS.filter((c) => !r.results[c.id]).map((c) => c.label).join(", ")}`));
  lines.push("");
}
lines.push("Verification flags:", "");
cov.blockers.forEach((r) => {
  const tags = [r.illustrative && "illustrative integration", r.needsVerification && "needs verification"].filter(Boolean).join(", ");
  lines.push(`- **${r.name}**${tags ? ` (${tags})` : ""}${r.verificationNotes.length ? `: ${r.verificationNotes.join(" ")}` : ""}`);
});
lines.push("");
if (failures.length) {
  lines.push("## Hard failures", "");
  failures.forEach((f) => lines.push(`- ${f}`));
  lines.push("");
}

writeFileSync(join(root, "coverage-report.md"), lines.join("\n"));
console.log(`components=${cov.totals.components} complete=${cov.totals.complete} diagramIds=${diagramRows.length} industryUseCases=${industryRows.length} links=${cov.totals.verifiedLinks}/${cov.totals.totalLinks} failures=${failures.length}`);
failures.forEach((f) => console.error("FAIL", f));
process.exit(failures.length ? 1 : 0);
