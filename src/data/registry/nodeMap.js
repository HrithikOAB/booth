// Maps every clickable element of the umbrella architecture (ids from
// data/architectureBlueprint.js plus diagram-only labels) to a component page.
// `context` lets a page highlight where the item appeared (e.g. Object Store).

const nodeMap = {
  // ---- Cloudera Base (or DataHub) pillar ----
  "base-frame": { id: "cloudera-base-datahub" },
  "base-ai": { id: "cloudera-ai" },
  "base-de": { id: "cloudera-data-engineering" },
  "base-dl": { id: "cloudera-data-lakehouse" },
  "base-df": { id: "cloudera-data-flow" },
  "eng-spark": { id: "apache-spark" },
  "eng-nifi": { id: "apache-nifi" },
  "eng-kafka": { id: "apache-kafka" },
  "base-mgr": { id: "cloudera-manager" },
  "base-platform": { id: "cloudera-platform" },
  "base-obj": { id: "cloudera-object-store", context: "base" },
  "base-sdx": { id: "cloudera-sdx" },

  // ---- Connector flows (center) ----
  "flow-jobs": { id: "flow-seamless-transition" },
  "flow-query": { id: "flow-engines-query-platform" },
  "flow-data": { id: "flow-independent-integrated-data" },

  // ---- Cloudera Anywhere Cloud pillar ----
  "cac-frame": { id: "cloudera-anywhere-cloud" },
  "cds20": { id: "cloudera-data-services-2" },
  "cac-de2": { id: "data-engineering-2" },
  "cac-dl2": { id: "data-lakehouse-2" },
  "cac-ai2": { id: "ai-2" },
  "cac-df2": { id: "data-flow-2" },
  "cac-spark4": { id: "spark-4" },
  "cac-trino": { id: "trino" },
  "p-neo4j": { id: "neo4j" },
  "p-starrocks": { id: "starrocks" },
  "p-clickhouse": { id: "clickhouse" },
  "anywhere-core": { id: "cloudera-anywhere-cloud", context: "fabric" },
  "unified-fabric": { id: "unified-data-fabric" },
  "atlas-ranger": { id: "apache-atlas" },
  "gov-atlas": { id: "apache-atlas" },
  "gov-ranger": { id: "apache-ranger" },
  "gov-governance": { id: "security-policies-auditing" },
  "gov-security": { id: "access-control" },
  "gov-metadata": { id: "metadata-management" },
  "data-lineage": { id: "cloudera-data-lineage" },
  "lineage-concept": { id: "data-lineage-concept" },
  "cac-obj": { id: "cloudera-object-store", context: "anywhere" },

  // ---- Deployment footer ----
  "deploy-cloud": { id: "cloud-deployment" },
  "cloud-gcp": { id: "google-cloud" },
  "cloud-azure": { id: "microsoft-azure" },
  "cloud-aws": { id: "aws" },
  "deploy-onprem": { id: "on-premises-deployment" },
  "onprem-obj": { id: "cloudera-object-store", context: "onprem" },
  "onprem-dell": { id: "dell-technologies" },
  "onprem-s3": { id: "s3-storage", context: "onprem" },
  "onprem-nvidia": { id: "nvidia" },
  "onprem-amd": { id: "amd" },

  // ---- Deploy anywhere: hybrid building blocks ----
  "hybrid-core": { id: "hybrid-cloud" },
  "hybrid-auth": { id: "hybrid-cloud", context: "auth" },
  "hybrid-meta": { id: "hybrid-cloud", context: "meta" },
  "hybrid-net": { id: "hybrid-cloud", context: "net" },
  "hybrid-port": { id: "hybrid-cloud", context: "port" },
};

export default nodeMap;
