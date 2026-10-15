// ============================================================
//  Content model — authoritative source: etcio_summit.xlsx
//
//  type "video" -> embeds a YouTube clip in the detail panel / loop
//  type "link"  -> opens an external Cloudera page in a new tab
//
//  All videos are YouTube embeds (identified by `youtubeId`); the app
//  no longer bundles any downloaded MP4s.
// ============================================================

// ---- Main page: attract loop (muted, looping YouTube background) ----
export const loopPlaylist = [
  { youtubeId: "tLEGcWC4paI", label: "Cloudera DataFlow (CDF) Overview" },
  { youtubeId: "DcC7OCP8ke0", label: "Open Data Lakehouse" },
  { youtubeId: "-dtzknHhvTo", label: "Anywhere Cloud" },
  { youtubeId: "aFHlU9P5mFg", label: "Cloudera Data Platform — SDX" },
];

// ---- Platform-map layers (top -> bottom) --------------------
export const layers = [
  { id: "ingest", label: "Ingest · Data in Motion" },
  { id: "store", label: "Store · Open Data Lakehouse" },
  { id: "process", label: "Process · Data Engineering" },
  { id: "analyze", label: "Analyze · Data Warehouse" },
  { id: "ai", label: "AI · Private AI & Agents" },
  { id: "govern", label: "Govern · SDX & Lineage" },
  { id: "deploy", label: "Deploy · Anywhere Cloud" },
];

// ---- Technical capabilities (8, per spec) -------------------
export const services = [
  {
    id: "dataflow",
    name: "Data in Motion",
    icon: "🌊",
    layer: "ingest",
    type: "video",
    blurb: "Stream & move data edge-to-cloud (NiFi, Kafka, Flink).",
    lead: "Cloudera DataFlow captures data the moment it is created — from sensors, apps, and logs — and moves it anywhere in real time using Apache NiFi, Kafka, and Flink.",
    points: [
      "Universal data distribution from edge to any cloud",
      "Low-code streaming pipelines with Apache NiFi",
      "Kafka & Flink for high-throughput event streaming",
      "Feeds real-time AI and analytics instantly",
    ],
    tags: ["NiFi", "Kafka", "Flink", "Streaming"],
    youtubeId: "tLEGcWC4paI",
  },
  {
    id: "lakehouse",
    name: "Open Data Lakehouse",
    icon: "🧊",
    layer: "store",
    type: "video",
    blurb: "One open store on Apache Iceberg — no lock-in.",
    lead: "A single open lakehouse built on Apache Iceberg unifies your data lake and warehouse, so every engine can read the same tables without copies or vendor lock-in.",
    points: [
      "Open Apache Iceberg table format — no proprietary silos",
      "One copy of data shared across analytics, BI and AI",
      "Time-travel, schema evolution and ACID transactions",
      "Multi-engine: Spark, Impala, Hive, Flink on the same tables",
    ],
    tags: ["Apache Iceberg", "Open Format", "ACID"],
    youtubeId: "DcC7OCP8ke0",
  },
  {
    id: "engineering",
    name: "Data Engineering",
    icon: "🛠️",
    layer: "process",
    type: "video",
    blurb: "Build & orchestrate pipelines for data and AI.",
    lead: "Cloudera Data Engineering delivers managed Apache Spark with built-in orchestration to build, schedule, and monitor the pipelines that prepare data for analytics and AI.",
    points: [
      "Managed, auto-scaling Apache Spark",
      "Airflow-based pipeline orchestration",
      "Isolated, containerized job execution",
      "Prepares trusted data for warehouse & AI",
    ],
    tags: ["Apache Spark", "Airflow", "Pipelines"],
    youtubeId: "d7X5UY8o56k",
  },
  {
    id: "warehouse",
    name: "Data Warehouse",
    icon: "📊",
    layer: "analyze",
    type: "video",
    blurb: "Self-service analytics at massive scale.",
    lead: "Cloudera Data Warehouse gives analysts instant, self-service SQL access to the open lakehouse with the elasticity to handle thousands of concurrent queries.",
    points: [
      "Elastic, self-service SQL analytics",
      "High-concurrency BI on the open lakehouse",
      "Auto-suspend / resume to control cost",
      "Connects to any BI tool",
    ],
    tags: ["SQL", "Impala", "BI"],
    youtubeId: "w4rte8HIjBI",
  },
  {
    id: "privateai",
    name: "Private AI",
    icon: "🧠",
    layer: "ai",
    type: "video",
    blurb: "Enterprise & generative AI on your own terms.",
    lead: "Cloudera Private AI brings generative AI and machine learning to your governed data inside your own environment — so sensitive data and models never leave your control.",
    points: [
      "Build & deploy GenAI and ML on your own data",
      "Keeps data, prompts and models in your tenant",
      "MLOps: model registry, deployment & monitoring",
      "From prototype to production without rebuilds",
    ],
    tags: ["GenAI", "MLOps", "Private"],
    youtubeId: "JqWmErXze-s",
  },
  {
    id: "agents",
    name: "Agent Studio",
    icon: "🕹️",
    layer: "ai",
    type: "video",
    blurb: "Build governed AI agents on trusted data.",
    lead: "Cloudera Agent Studio lets you build and deploy AI agents that act on enterprise data — for example, an Iceberg MCP agent that monitors and maintains table health automatically.",
    points: [
      "Low-code builder for enterprise AI agents",
      "Agents grounded in governed, trusted data",
      "MCP tools — e.g. monitor Iceberg table health",
      "Human-in-the-loop and full auditability",
    ],
    tags: ["AI Agents", "MCP", "Iceberg"],
    youtubeId: "XZMaJaLBN6s",
  },
  {
    id: "sdx",
    name: "Data Lineage & Metadata (SDX)",
    icon: "🛡️",
    layer: "govern",
    type: "video",
    blurb: "Security, governance & lineage across every service.",
    lead: "The Shared Data Experience (SDX) is the security and governance fabric that spans the whole platform — one consistent set of policies, metadata, and end-to-end lineage shared by every service.",
    points: [
      "Automated metadata harvesting & data catalog",
      "End-to-end data lineage for trust & compliance",
      "Unified security & fine-grained access policies",
      "Write a policy once — it applies everywhere",
    ],
    tags: ["Lineage", "Metadata", "Governance", "Security"],
    youtubeId: "FEDicBHXkgc",
  },
  {
    id: "anywhere",
    name: "Anywhere Cloud",
    icon: "☁️",
    layer: "deploy",
    type: "link",
    blurb: "The same experience on-prem, public cloud, or anywhere.",
    lead: "",
    points: [],
    tags: ["Hybrid", "Multi-cloud", "Portable"],
    url: "https://www.cloudera.com/products/cloudera-data-platform/cdp-demos.html?internal_keyplay=cross&internal_campaign=Other---AlwaysOn-GLOBAL-WS-Website-CDP-Demo-Request&cid=7012H000001Z3MrQAK&internal_link=WWW-Nav-u01",
    youtubeId: null,
  },
];

const serviceMeta = {
  dataflow: {
    category: "DATA INGESTION",
    inputs: ["Streaming events", "Edge sensors", "Application logs"],
    outputs: ["Real-time topics", "Lakehouse tables", "AI features"],
    capabilities: ["NiFi flows", "Kafka pipelines", "Flink stream processing"],
    useCases: ["Real-time fraud", "IoT telemetry", "Operational monitoring"],
    relatedServiceIds: ["lakehouse", "privateai", "engineering"],
  },
  lakehouse: {
    category: "DATA MANAGEMENT",
    inputs: ["Raw files", "Streams", "Batch loads"],
    outputs: ["Iceberg tables", "Shared datasets"],
    capabilities: ["Open Iceberg format", "Multi-engine access", "ACID & time travel"],
    useCases: ["Unified analytics", "Open data platform", "AI-ready data"],
    relatedServiceIds: ["engineering", "warehouse", "sdx"],
  },
  engineering: {
    category: "DATA ENGINEERING",
    inputs: ["Raw & curated sources", "External APIs"],
    outputs: ["Curated tables", "Features", "Pipeline artifacts"],
    capabilities: ["Managed Spark", "Airflow orchestration", "Job isolation"],
    useCases: ["ETL/ELT", "Feature engineering", "Data product delivery"],
    relatedServiceIds: ["dataflow", "lakehouse", "warehouse"],
  },
  warehouse: {
    category: "ANALYTICS",
    inputs: ["Curated lakehouse tables"],
    outputs: ["SQL result sets", "BI datasets"],
    capabilities: ["Elastic SQL", "High concurrency", "BI connectivity"],
    useCases: ["Self-service analytics", "Executive dashboards", "Regulatory reporting"],
    relatedServiceIds: ["lakehouse", "sdx", "privateai"],
  },
  privateai: {
    category: "AI",
    inputs: ["Governed datasets", "Documents", "Features"],
    outputs: ["Models", "GenAI apps", "Embeddings"],
    capabilities: ["Private GenAI", "MLOps", "In-tenant inference"],
    useCases: ["Enterprise assistants", "Document intelligence", "Predictive models"],
    relatedServiceIds: ["lakehouse", "agents", "sdx"],
  },
  agents: {
    category: "AI",
    inputs: ["Lakehouse context", "MCP tools", "Policies"],
    outputs: ["Governed agents", "Automated actions"],
    capabilities: ["Agent builder", "MCP integrations", "Audit trails"],
    useCases: ["Ops automation", "Table health monitoring", "Research assistants"],
    relatedServiceIds: ["privateai", "lakehouse", "sdx"],
  },
  sdx: {
    category: "GOVERNANCE",
    inputs: ["Metadata from all services"],
    outputs: ["Catalog", "Lineage", "Policies"],
    capabilities: ["Atlas/Ranger", "Lineage", "Unified security"],
    useCases: ["Compliance", "Data discovery", "Impact analysis"],
    relatedServiceIds: ["lakehouse", "engineering", "dataflow"],
  },
  anywhere: {
    category: "HYBRID CLOUD",
    inputs: ["Infrastructure choice", "Existing data estates"],
    outputs: ["Portable workloads", "Unified experience"],
    capabilities: ["Multi-cloud", "On-prem parity", "Data fabric"],
    useCases: ["Hybrid analytics", "Cloud migration", "Edge-to-core"],
    relatedServiceIds: ["lakehouse", "engineering", "sdx"],
    lead: "Run the same Cloudera data services on public cloud, on-premises, or hybrid — with a consistent control plane and unified data fabric.",
    points: [
      "Consistent CDS experience across environments",
      "Integrate independent data with platform data",
      "Deploy from cloud marketplaces or private data centers",
    ],
  },
};

export const servicesEnriched = services.map((s) => ({
  ...s,
  ...(serviceMeta[s.id] ?? {}),
  capabilities: serviceMeta[s.id]?.capabilities ?? s.points,
}));

export const serviceById = Object.fromEntries(servicesEnriched.map((s) => [s.id, s]));

export { domains } from "./industries.js";
