// Component registry: one entry per clickable item in the umbrella architecture.
import { CATEGORIES, ORIGINS, VIEW_META, finalizeComponent } from "./schema.js";
import nodeMap from "./nodeMap.js";
import { resourcesFor } from "./resources.js";
import clouderaServices from "./components/cloudera-services.js";
import platform from "./components/platform.js";
import engines from "./components/engines.js";
import partners from "./components/partners.js";
import governance from "./components/governance.js";
import infrastructure from "./components/infrastructure.js";
import flows from "./components/flows.js";

const rawList = [...clouderaServices, ...platform, ...engines, ...partners, ...governance, ...infrastructure, ...flows];

const rawById = Object.fromEntries(rawList.map((c) => [c.id, c]));

export const components = rawList.map((c) => finalizeComponent(c, rawById));
export const componentById = Object.fromEntries(components.map((c) => [c.id, c]));

export const componentsByCategory = CATEGORIES.map((cat) => ({
  ...cat,
  components: components.filter((c) => c.category === cat.id),
}));

/** Resolve a diagram element id (from architectureBlueprint) to `{ component, context }`. */
export function resolveNode(nodeId) {
  const hit = nodeMap[nodeId];
  if (!hit || !componentById[hit.id]) return null;
  return { component: componentById[hit.id], context: hit.context ?? null };
}

/** Route for a diagram element, including `?context=` when the same page is reached from several places. */
export function routeForNode(nodeId) {
  const r = resolveNode(nodeId);
  if (!r) return null;
  return r.context ? `${r.component.route}?context=${r.context}` : r.component.route;
}

/** Diagram ids that open a given component — used for "Where it appears". */
export function diagramNodesFor(componentId) {
  return Object.entries(nodeMap).filter(([, v]) => v.id === componentId).map(([k, v]) => ({ nodeId: k, context: v.context ?? null }));
}

export const SERVICE_REDIRECTS = {
  dataflow: "cloudera-data-flow",
  lakehouse: "cloudera-data-lakehouse",
  engineering: "cloudera-data-engineering",
  warehouse: "cloudera-data-warehouse",
  privateai: "cloudera-ai",
  agents: "cloudera-agent-studio",
  sdx: "cloudera-sdx",
  anywhere: "cloudera-anywhere-cloud",
};

export { CATEGORIES, ORIGINS, VIEW_META, nodeMap, resourcesFor };
