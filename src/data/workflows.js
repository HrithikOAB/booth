const defaultFlow = (name) => ({
  nodes: [
    { id: "sources", label: "Data Sources", x: 0, y: 120, description: "Applications, logs, IoT, partners." },
    { id: "ingest", label: "Ingestion", x: 200, y: 120, description: "Capture and land data reliably." },
    { id: "process", label: "Processing", x: 400, y: 120, description: "Transform, enrich, orchestrate." },
    { id: "store", label: "Lakehouse / Warehouse", x: 600, y: 120, description: "Governed storage for analytics." },
    { id: "consume", label: "Analytics & AI", x: 800, y: 120, description: "Dashboards, ML, GenAI." },
  ],
  edges: [["sources", "ingest"], ["ingest", "process"], ["process", "store"], ["store", "consume"]],
  title: `${name} workflow`,
});

export const workflowsByServiceId = {
  dataflow: {
    title: "Data in Motion workflow",
    nodes: [
      { id: "sources", label: "Edge & app sources", x: 0, y: 100, description: "Sensors, apps, logs, partners." },
      { id: "nifi", label: "NiFi / Kafka ingest", x: 180, y: 100, description: "Low-code flows and event streams." },
      { id: "stream", label: "Flink processing", x: 380, y: 100, description: "Real-time enrichment and routing." },
      { id: "lake", label: "Lakehouse tables", x: 580, y: 100, description: "Iceberg destinations for analytics." },
      { id: "ai", label: "Real-time AI", x: 780, y: 100, description: "Scores and alerts in motion." },
    ],
    edges: [["sources", "nifi"], ["nifi", "stream"], ["stream", "lake"], ["stream", "ai"]],
  },
  lakehouse: {
    title: "Open Data Lakehouse workflow",
    nodes: [
      { id: "land", label: "Land raw data", x: 0, y: 110, description: "Files and streams in open formats." },
      { id: "iceberg", label: "Iceberg tables", x: 200, y: 110, description: "ACID, time travel, schema evolution." },
      { id: "engines", label: "Multi-engine access", x: 420, y: 110, description: "Spark, Impala, Flink on same tables." },
      { id: "share", label: "Share & govern", x: 640, y: 80, description: "Policies via SDX." },
      { id: "bi", label: "BI & AI consumption", x: 640, y: 160, description: "Warehouse and Private AI workloads." },
    ],
    edges: [["land", "iceberg"], ["iceberg", "engines"], ["iceberg", "share"], ["engines", "bi"]],
  },
  engineering: {
    title: "Data Engineering workflow",
    nodes: [
      { id: "sources", label: "Data Sources", x: 0, y: 120, description: "Operational and external datasets." },
      { id: "ingest", label: "Ingestion", x: 160, y: 120, description: "Batch and micro-batch loads." },
      { id: "spark", label: "Spark processing", x: 320, y: 120, description: "Transformations and feature prep." },
      { id: "orchestrate", label: "Orchestration", x: 480, y: 120, description: "Airflow schedules and monitors." },
      { id: "quality", label: "Quality & lineage", x: 640, y: 120, description: "Tests and metadata capture." },
      { id: "targets", label: "Lakehouse / Warehouse", x: 800, y: 120, description: "Curated datasets for analytics." },
    ],
    edges: [["sources", "ingest"], ["ingest", "spark"], ["spark", "orchestrate"], ["orchestrate", "quality"], ["quality", "targets"]],
  },
  warehouse: {
    title: "Data Warehouse workflow",
    nodes: [
      { id: "curated", label: "Curated lakehouse", x: 0, y: 110, description: "Trusted tables from engineering." },
      { id: "sql", label: "Self-service SQL", x: 220, y: 110, description: "High-concurrency queries." },
      { id: "bi", label: "BI tools", x: 440, y: 110, description: "Dashboards and exploration." },
      { id: "govern", label: "Governance", x: 660, y: 110, description: "Row/column security via SDX." },
    ],
    edges: [["curated", "sql"], ["sql", "bi"], ["sql", "govern"]],
  },
  privateai: {
    title: "Private AI workflow",
    nodes: [
      { id: "data", label: "Governed data", x: 0, y: 100, description: "Lakehouse and warehouse datasets." },
      { id: "prep", label: "Feature & context prep", x: 180, y: 100, description: "RAG and feature stores." },
      { id: "train", label: "Train / tune models", x: 380, y: 100, description: "ML and GenAI in your tenant." },
      { id: "deploy", label: "Deploy & monitor", x: 580, y: 100, description: "MLOps and inference." },
      { id: "apps", label: "Enterprise apps", x: 780, y: 100, description: "Assistants and decisioning." },
    ],
    edges: [["data", "prep"], ["prep", "train"], ["train", "deploy"], ["deploy", "apps"]],
  },
  agents: {
    title: "Agent Studio workflow",
    nodes: [
      { id: "tools", label: "MCP tools & APIs", x: 0, y: 110, description: "Iceberg health, lineage, ops." },
      { id: "builder", label: "Agent builder", x: 200, y: 110, description: "Compose governed agents." },
      { id: "ground", label: "Ground on data", x: 400, y: 110, description: "Trusted lakehouse context." },
      { id: "run", label: "Run & audit", x: 600, y: 110, description: "Human-in-the-loop execution." },
    ],
    edges: [["tools", "builder"], ["ground", "builder"], ["builder", "run"]],
  },
  sdx: {
    title: "SDX & lineage workflow",
    nodes: [
      { id: "harvest", label: "Metadata harvest", x: 0, y: 110, description: "Catalog pipelines and tables." },
      { id: "lineage", label: "Lineage graph", x: 220, y: 110, description: "End-to-end impact analysis." },
      { id: "policy", label: "Security policies", x: 440, y: 110, description: "Atlas / Ranger unified policies." },
      { id: "apply", label: "Apply everywhere", x: 660, y: 110, description: "Consistent enforcement across services." },
    ],
    edges: [["harvest", "lineage"], ["lineage", "policy"], ["policy", "apply"]],
  },
  anywhere: {
    title: "Anywhere Cloud workflow",
    nodes: [
      { id: "choose", label: "Choose environment", x: 0, y: 110, description: "Public cloud, on-prem, or hybrid." },
      { id: "provision", label: "Provision fabric", x: 220, y: 110, description: "Consistent control plane." },
      { id: "services", label: "Run data services", x: 440, y: 110, description: "Same CDS experience anywhere." },
      { id: "integrate", label: "Integrate data", x: 660, y: 110, description: "Independent + platform data." },
    ],
    edges: [["choose", "provision"], ["provision", "services"], ["services", "integrate"]],
  },
};

export function getWorkflow(serviceId) {
  return workflowsByServiceId[serviceId] ?? defaultFlow(serviceId);
}
