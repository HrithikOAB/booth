// Governance: Apache Atlas, Apache Ranger and the four governance capabilities
// shown inside the Atlas & Ranger block of the Anywhere Cloud pillar.

const atlas = {
  id: "apache-atlas",
  name: "Apache Atlas",
  origin: "apache-oss",
  category: "governance",
  tagline: "Metadata management, classification and lineage for the data platform.",
  overview:
    "Apache Atlas is an open-source metadata and governance framework. It models data assets as typed entities (tables, columns, topics, processes), captures lineage from hooks in Hive, Spark, Kafka, NiFi and others, lets stewards attach classifications (tags) such as PII, and propagates those tags along lineage. Ranger consumes Atlas tags for tag-based policies.",
  businessValue: "Makes data discoverable and explainable, and lets one PII tag drive security everywhere.",
  capabilities: ["Type system and entity graph", "Hooks for automatic metadata/lineage capture", "Classifications with propagation", "Glossary terms", "REST API and search"],
  workflow: {
    stages: [["hook", "Engine hook fires", "Hive/Spark/NiFi emit metadata events.", "apache-hive"], ["kafka", "Notification topic", "Events flow through Kafka.", "apache-kafka"], ["ingest", "Ingest entities", "Atlas server creates/updates entities and lineage."], ["classify", "Classify", "Stewards tag columns (e.g., PII)."], ["propagate", "Propagate", "Tags flow to derived datasets along lineage."], ["policy", "Drive policies", "Ranger tag-sync applies tag-based policies.", "apache-ranger"]],
  },
  views: {
    internal: {
      nodes: [{ id: "hooks", label: "Hooks", kind: "apache", description: "Per-engine metadata capture.", children: [["hh", "Hive hook", ""], ["sh", "Spark hook", ""], ["nh", "NiFi reporting", ""]], childEdges: [] }, ["kafka", "Kafka notifications", "", "apache", "apache-kafka"], ["server", "Atlas server", "Type system, ingest, REST.", "focus"], ["graph", "Graph store (JanusGraph)", "Entities and relationships.", "store"], ["index", "Search index (Solr)", "Search.", "store"], ["ui", "Atlas UI / API", "", "client"], ["tagsync", "Ranger TagSync", "", "security", "apache-ranger"]],
      edges: [["hooks", "kafka"], ["kafka", "server"], ["server", "graph"], ["server", "index"], ["ui", "server"], ["server", "tagsync", "tags", { dashed: true }]],
    },
    dataFlow: {
      nodes: [["src", "raw.customers", "", "data"], ["job", "Spark job", "", "apache", "apache-spark"], ["dst", "gold.customers", "PII tag propagated.", "data"], ["atlas", "Atlas lineage", "", "focus"]],
      edges: [["src", "job"], ["job", "dst"], ["job", "atlas", "lineage", { dashed: true }]],
    },
    deployment: {
      nodes: [["base", "Cloudera Base SDX", "", "cloudera", "cloudera-sdx"], ["dl", "Cloud Data Lakes", "", "cloud", "cloud-deployment"], ["fabric", "Unified Data Fabric", "", "cloudera", "unified-data-fabric"]],
      edges: [["base", "fabric"], ["dl", "fabric"]],
    },
  },
  io: { inputs: ["Hook events", "Steward edits"], outputs: ["Metadata graph", "Lineage", "Tags"], dependencies: ["Kafka", "HBase/JanusGraph", "Solr"], connectors: ["Hooks"], apis: ["Atlas REST v2"], integrations: ["Ranger", "Cloudera Data Lineage"] },
  ops: { security: "Kerberos/SSO auth; Ranger-governed Atlas permissions.", governance: "It is the governance metadata store.", monitoring: "Cloudera Manager.", scalability: "Scales with backing stores." },
  clouderaContext: { standalone: "An Apache project usable independently.", clouderaIntegration: "Part of SDX, labeled 'Atlas & Ranger' in the Anywhere Cloud pillar.", realWorld: "A PII tag on 'ssn' propagates to 14 derived tables automatically." },
  useCases: [{ title: "PII discovery & tagging", scenario: "Classify and propagate.", industryIds: ["healthcare", "financial"] }],
  relatedComponentIds: ["apache-ranger", "metadata-management", "data-lineage-concept", "cloudera-sdx"],
};

const ranger = {
  id: "apache-ranger",
  name: "Apache Ranger",
  origin: "apache-oss",
  category: "governance",
  tagline: "Centralized authorization, masking, row filtering and audit.",
  overview:
    "Apache Ranger provides centralized security administration. Policies are authored in Ranger Admin and pulled by lightweight plugins embedded in each service (Hive, Impala, HDFS/Ozone, Kafka, NiFi, Solr…), which enforce them locally and send audit events. Ranger supports resource-based and tag-based policies, row-level filters and column masking. Cloudera contributed a Ranger authorizer plugin (Beta) to Apache Polaris 1.5.",
  businessValue: "Define access once, enforce everywhere, and prove it with a central audit.",
  capabilities: ["Resource- and tag-based policies", "Row filtering and column masking", "Plugins for many services", "Central audit (Solr/HDFS)", "Polaris authorizer plugin (Beta)"],
  workflow: {
    stages: [["author", "Author policy", "Admin defines who can access what in Ranger Admin."], ["sync", "Plugins sync", "Plugins poll and cache policies."], ["request", "Access request", "User queries via an engine."], ["evaluate", "Evaluate", "Plugin evaluates resource and tag policies.", "apache-atlas"], ["enforce", "Enforce", "Allow/deny, filter rows, mask columns."], ["audit", "Audit", "Decision is logged centrally.", "security-policies-auditing"]],
  },
  views: {
    internal: {
      nodes: [["admin", "Ranger Admin", "Policy UI & REST.", "focus"], ["db", "Policy DB", "", "store"], ["usersync", "UserSync", "LDAP/AD users & groups.", "core"], ["tagsync", "TagSync", "Atlas tags.", "core", "apache-atlas"], { id: "plugins", label: "Service plugins", kind: "security", description: "Local enforcement.", children: [["hp", "Hive/Impala", ""], ["kp", "Kafka", ""], ["op", "Ozone", ""], ["pp", "Polaris (Beta)", ""]], childEdges: [] }, ["audit", "Audit store", "Solr / HDFS.", "store"]],
      edges: [["admin", "db"], ["usersync", "admin"], ["tagsync", "admin"], ["admin", "plugins", "policies"], ["plugins", "audit", "events"]],
    },
    dataFlow: {
      nodes: [["user", "Analyst", "", "client"], ["impala", "Impala", "", "apache", "apache-impala"], ["plugin", "Ranger plugin", "", "security"], ["result", "Masked result", "", "data"], ["audit", "Audit", "", "store"]],
      edges: [["user", "impala"], ["impala", "plugin", "authorize"], ["plugin", "result", "mask/filter"], ["plugin", "audit"]],
    },
    deployment: {
      nodes: [["base", "Base SDX", "", "cloudera", "cloudera-sdx"], ["acc", "Anywhere Cloud fabric", "", "cloudera", "unified-data-fabric"], ["polaris", "Polaris catalog", "", "apache", "data-lakehouse-2"]],
      edges: [["base", "acc"], ["acc", "polaris", "authorizer", { dashed: true }]],
    },
  },
  io: { inputs: ["Policies", "Users/groups", "Tags"], outputs: ["Decisions", "Audits"], dependencies: ["Policy DB", "Audit store"], connectors: ["Service plugins"], apis: ["Ranger REST"], integrations: ["Atlas", "Polaris"] },
  ops: { security: "Is the security layer.", governance: "Policy history and audits.", monitoring: "Audit dashboards, plugin status.", scalability: "Local enforcement with cached policies." },
  clouderaContext: { standalone: "An Apache project.", clouderaIntegration: "Core of SDX in every Cloudera environment.", realWorld: "Call-center agents see only the last 4 digits of card numbers in every tool." },
  useCases: [{ title: "Column masking", scenario: "Mask sensitive fields.", industryIds: ["financial", "insurance", "healthcare"] }],
  relatedComponentIds: ["apache-atlas", "access-control", "security-policies-auditing", "cloudera-sdx"],
};

const concept = ({ id, name, tagline, overview, capabilities, stages, internal, dataFlow, ctx, useCases, related, io, ops }) => ({
  id, name, origin: "capability", category: "governance", parentId: "unified-data-fabric",
  tagline, overview, businessValue: "Reduces regulatory risk and makes data trustworthy for analytics and AI.",
  capabilities, workflow: { stages },
  views: {
    internal, dataFlow,
    deployment: {
      nodes: [["base", "Base SDX", "", "cloudera", "cloudera-sdx"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", name, "", "focus"], ["fabric", "Unified Data Fabric", "", "cloudera", "unified-data-fabric"]],
      edges: [["focus", "fabric"], ["fabric", "base"], ["fabric", "acc"]],
    },
  },
  io, ops, clouderaContext: ctx, useCases, relatedComponentIds: related,
});

export const metadataMgmt = concept({
  id: "metadata-management", name: "Metadata Management",
  tagline: "Know what data exists, what it means and who owns it.",
  overview: "Metadata management is the capability of capturing technical, business and operational metadata about data assets. In Cloudera it is delivered by Apache Atlas (technical metadata, classifications, glossary), the shared metastore, and the Unified Data Fabric's Data Catalog with 60+ connectors.",
  capabilities: ["Technical metadata capture", "Business glossary", "Ownership & stewardship", "Search and discovery"],
  stages: [["capture", "Capture", "Hooks and connectors harvest metadata.", "apache-atlas"], ["enrich", "Enrich", "Stewards add descriptions, owners and terms."], ["classify", "Classify", "Sensitivity tags."], ["discover", "Discover", "Users search the catalog.", "unified-data-fabric"]],
  internal: { nodes: [["sources", "Sources", "", "external"], ["atlas", "Atlas", "", "apache", "apache-atlas"], ["hms", "Metastore", "", "core"], ["catalog", "Data Catalog", "", "cloudera", "unified-data-fabric"], ["focus", "Metadata Management", "", "focus"]], edges: [["sources", "atlas"], ["sources", "hms"], ["atlas", "focus"], ["hms", "focus"], ["focus", "catalog"]] },
  dataFlow: { nodes: [["tbl", "New table", "", "data"], ["hook", "Hook event", "", "core"], ["entity", "Entity", "", "focus"], ["search", "Search result", "", "client"]], edges: [["tbl", "hook"], ["hook", "entity"], ["entity", "search"]] },
  io: { inputs: ["Metadata"], outputs: ["Catalog"], dependencies: ["Atlas"], connectors: ["Hooks"], apis: ["Atlas REST"], integrations: ["Catalog"] },
  ops: { security: "Metadata access is permissioned.", governance: "Stewardship.", monitoring: "Coverage metrics.", scalability: "Automated capture." },
  ctx: { standalone: "A general data-management capability.", clouderaIntegration: "Implemented by Atlas + Data Catalog in the fabric.", realWorld: "Analysts find certified 'customer' tables instead of guessing." },
  useCases: [{ title: "Data discovery", scenario: "Find trusted data fast.", industryIds: ["insurance", "telco"] }],
  related: ["apache-atlas", "unified-data-fabric", "data-lineage-concept"],
});

export const lineageConcept = concept({
  id: "data-lineage-concept", name: "Data Lineage (capability)",
  tagline: "Trace data from source to report and AI model.",
  overview: "Data lineage is the record of how data moves and transforms. Cloudera provides it through Atlas (engine-level lineage) and Cloudera Data Lineage (cross-platform, column-level and inferred lineage from the Octopai acquisition).",
  capabilities: ["Table and column lineage", "Impact analysis", "Root-cause analysis", "Cross-system lineage"],
  stages: [["capture", "Capture", "Engines and connectors report movements.", "apache-atlas"], ["stitch", "Stitch", "Cross-system graph.", "cloudera-data-lineage"], ["analyze", "Analyze", "Impact or root cause."], ["prove", "Prove", "Evidence for auditors."]],
  internal: { nodes: [["atlas", "Atlas lineage", "", "apache", "apache-atlas"], ["octo", "Cloudera Data Lineage", "", "cloudera", "cloudera-data-lineage"], ["focus", "Lineage graph", "", "focus"], ["ui", "Impact analysis", "", "client"], ["sources", "ETL / BI / DB", "", "external"]], edges: [["atlas", "focus"], ["sources", "octo"], ["octo", "focus"], ["focus", "ui"]] },
  dataFlow: { nodes: [["src", "Source", "", "external"], ["etl", "Transform", "", "apache"], ["rpt", "Report", "", "client"], ["g", "Lineage", "", "focus"]], edges: [["src", "etl"], ["etl", "rpt"], ["etl", "g", "", { dashed: true }]] },
  io: { inputs: ["Engine and connector metadata"], outputs: ["Lineage graph"], dependencies: ["Atlas", "Data Lineage"], connectors: ["60+"], apis: ["Atlas REST"], integrations: ["SDX"] },
  ops: { security: "Metadata only.", governance: "Audit evidence.", monitoring: "Harvest status.", scalability: "Automated." },
  ctx: { standalone: "A general capability.", clouderaIntegration: "Atlas + Cloudera Data Lineage.", realWorld: "Regulators ask where a capital figure came from; lineage answers in minutes." },
  useCases: [{ title: "Regulatory provenance", scenario: "BCBS 239 evidence.", industryIds: ["financial"] }],
  related: ["cloudera-data-lineage", "apache-atlas"],
});

export const accessControl = concept({
  id: "access-control", name: "Access Control",
  tagline: "Who can see and do what — enforced in every engine.",
  overview: "Access control combines authentication (Kerberos/LDAP/SSO) with Apache Ranger authorization: resource policies, tag-based policies, row filters and masking, enforced by plugins in each service and extended to Polaris catalogs.",
  capabilities: ["Authentication integration", "RBAC/ABAC via Ranger", "Row filters & masking", "Tag-based policies"],
  stages: [["authn", "Authenticate", "SSO/LDAP/Kerberos."], ["authz", "Authorize", "Ranger plugin decision.", "apache-ranger"], ["mask", "Mask/filter", "Fine-grained controls."], ["log", "Log", "Audit.", "security-policies-auditing"]],
  internal: { nodes: [["idp", "Identity provider", "", "external"], ["ranger", "Ranger", "", "security", "apache-ranger"], ["tags", "Atlas tags", "", "apache", "apache-atlas"], ["focus", "Access decision", "", "focus"], ["engine", "Engine", "", "apache"]], edges: [["idp", "focus"], ["ranger", "focus"], ["tags", "ranger", "", { dashed: true }], ["focus", "engine"]] },
  dataFlow: { nodes: [["u", "User", "", "client"], ["e", "Engine", "", "apache"], ["d", "Decision", "", "focus"], ["r", "Result", "", "data"]], edges: [["u", "e"], ["e", "d"], ["d", "r"]] },
  io: { inputs: ["Identity", "Policies"], outputs: ["Decisions"], dependencies: ["Ranger"], connectors: ["Plugins"], apis: ["Ranger REST"], integrations: ["IdP"] },
  ops: { security: "Least privilege.", governance: "Policy reviews.", monitoring: "Denied-access alerts.", scalability: "Local enforcement." },
  ctx: { standalone: "A general security capability.", clouderaIntegration: "Ranger within SDX/fabric.", realWorld: "Researchers see de-identified patient rows only." },
  useCases: [{ title: "De-identified research", scenario: "Row filters for researchers.", industryIds: ["healthcare", "pharma"] }],
  related: ["apache-ranger", "cloudera-sdx", "security-policies-auditing"],
});

export const policiesAuditing = concept({
  id: "security-policies-auditing", name: "Security Policies & Auditing",
  tagline: "Governance policies with a complete, central audit trail.",
  overview: "Security policies and auditing cover the policy lifecycle and the evidence trail: Ranger records every access decision centrally, Atlas and Cloudera Data Lineage show how data moved, and the fabric adds PII masking and audit lineage across environments.",
  capabilities: ["Central audit", "Policy lifecycle", "Compliance reporting", "Audit lineage"],
  stages: [["define", "Define policy", "Map regulation to policy.", "apache-ranger"], ["enforce", "Enforce", "Plugins enforce."], ["audit", "Audit", "Decisions logged."], ["report", "Report", "Compliance evidence."]],
  internal: { nodes: [["ranger", "Ranger Admin", "", "security", "apache-ranger"], ["audit", "Audit store", "", "store"], ["lineage", "Lineage", "", "cloudera", "cloudera-data-lineage"], ["focus", "Compliance view", "", "focus"], ["siem", "SIEM export", "", "external"]], edges: [["ranger", "audit"], ["audit", "focus"], ["lineage", "focus"], ["audit", "siem", "", { dashed: true }]] },
  dataFlow: { nodes: [["e", "Access event", "", "core"], ["a", "Audit store", "", "store"], ["r", "Report", "", "client"]], edges: [["e", "a"], ["a", "r"]] },
  io: { inputs: ["Access events"], outputs: ["Audit reports"], dependencies: ["Ranger"], connectors: ["SIEM"], apis: ["Ranger audit API"], integrations: ["Lineage"] },
  ops: { security: "Tamper-evident storage recommended.", governance: "Evidence for regulators.", monitoring: "Anomaly alerts.", scalability: "Indexed audit store." },
  ctx: { standalone: "A general capability.", clouderaIntegration: "Ranger audit + lineage in SDX/fabric.", realWorld: "An insurer produces a quarterly access report for auditors in hours." },
  useCases: [{ title: "Compliance reporting", scenario: "Who accessed PII.", industryIds: ["insurance", "financial", "healthcare"] }],
  related: ["apache-ranger", "access-control", "cloudera-data-lineage"],
});

export default [atlas, ranger, metadataMgmt, lineageConcept, accessControl, policiesAuditing];
