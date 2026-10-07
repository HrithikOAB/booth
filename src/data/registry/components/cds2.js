// Cloudera Data Services 2.0 — the service editions inside the Anywhere Cloud pillar.
const CDS2_NOTE =
  "Edition-level details for Data Services 2.0 are described from Cloudera's Anywhere Cloud announcement (Aug 2026); confirm feature availability per release.";

const anywhereDeploy = (focusId, focusLabel, prev) => ({
  nodes: [
    ["k8s", "Anywhere Cloud Kubernetes", "Modular runtime (Taikun-based infrastructure layer).", "core", "cloudera-anywhere-cloud"],
    ["focus", focusLabel, "This 2.0 service.", "focus", focusId],
    ["public", "Public cloud", "AWS, Azure, GCP.", "cloud", "cloud-deployment"],
    ["private", "Private / sovereign / air-gapped", "Customer data centers.", "cloudera", "on-premises-deployment"],
    ["fabric", "Unified Data Fabric", "Shared governance and lineage.", "cloudera", "unified-data-fabric"],
    ["prev", "1.5.x edition", "Coexists during transition.", "cloudera", prev],
  ],
  edges: [["k8s", "focus"], ["public", "k8s", "", { dashed: true }], ["private", "k8s", "", { dashed: true }], ["fabric", "focus", "governs", { dashed: true }], ["prev", "focus", "transition"]],
});

const shared = () => ({
  ops: {
    security: "Zero-trust Unified Data Fabric: centralized identity, Ranger-based authorization, PII masking and audit lineage.",
    governance: "Lineage and catalog through the Unified Data Fabric (Octopai-based lineage).",
    monitoring: "Platform observability across modular services; agentic copilot assistance (announced).",
    scalability: "Services deploy modularly on Kubernetes and scale independently per workload.",
  },
  verificationNotes: [CDS2_NOTE],
});

export const cds2Group = {
  id: "cloudera-data-services-2",
  name: "Cloudera Data Services 2.0",
  origin: "cloudera",
  category: "cds-2",
  parentId: "cloudera-anywhere-cloud",
  tagline: "Modular Cloudera data services for Anywhere Cloud.",
  overview:
    "Cloudera Data Services 2.0 is the set of Cloudera services — Data Engineering 2.0, Data Lakehouse 2.0, AI 2.0 and Data Flow 2.0 — delivered through Cloudera Anywhere Cloud. Cloudera describes Anywhere Cloud as a modular hybrid data and AI platform with a marketplace of Cloudera Data Services, Cloudera-verified partner services and open-source engines, deployable to public, sovereign, private and air-gapped environments, and coexisting with the existing platform (supported through 2032 with 7.3.2).",
  businessValue: "Pick only the services you need, run them anywhere, and move from 1.5.x without a big-bang migration.",
  capabilities: ["Modular marketplace deployment", "Same services across public, private, sovereign and air-gapped", "Shared Unified Data Fabric governance", "Coexistence with Cloudera Base / Data Services 1.5.x"],
  workflow: {
    title: "Adopting Data Services 2.0",
    stages: [
      ["assess", "Assess workloads", "Identify jobs, flows and models on 1.5.x to move.", "cloudera-base-datahub"],
      ["provision", "Provision Anywhere Cloud", "Stand up the Kubernetes-based platform where needed.", "cloudera-anywhere-cloud"],
      ["select", "Select services", "Deploy the 2.0 services and engines from the marketplace."],
      ["connect", "Connect data", "Zero-copy access to Iceberg tables via the fabric.", "unified-data-fabric"],
      ["transition", "Transition workloads", "Move jobs and flows gradually; both run side-by-side.", "flow-seamless-transition"],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["market", "Marketplace", "Service and engine blueprints.", "core"],
        { id: "svcs", label: "Data Services 2.0", kind: "focus", description: "The four 2.0 services.",
          children: [["de2", "Data Engineering 2.0", "Spark 4 pipelines.", "cloudera", "data-engineering-2"], ["dl2", "Data Lakehouse 2.0", "Iceberg + Polaris.", "cloudera", "data-lakehouse-2"], ["ai2", "AI 2.0", "Private AI.", "cloudera", "ai-2"], ["df2", "Data Flow 2.0", "NiFi flows.", "cloudera", "data-flow-2"]],
          childEdges: [] },
        ["engines", "Engines", "Spark 4, Trino and partner engines.", "apache", "spark-4"],
        ["fabric", "Unified Data Fabric", "Governance & lineage.", "cloudera", "unified-data-fabric"],
        ["store", "Object storage", "Iceberg tables.", "store", "cloudera-object-store"],
      ],
      edges: [["market", "svcs", "deploy"], ["svcs", "engines", "run on"], ["fabric", "svcs", "", { dashed: true }], ["engines", "store"]],
    },
    dataFlow: {
      nodes: [
        ["df", "Data Flow 2.0", "Ingest.", "cloudera", "data-flow-2"],
        ["dl", "Data Lakehouse 2.0", "Store once.", "cloudera", "data-lakehouse-2"],
        ["de", "Data Engineering 2.0", "Transform.", "cloudera", "data-engineering-2"],
        ["ai", "AI 2.0", "Model & serve.", "cloudera", "ai-2"],
      ],
      edges: [["df", "dl"], ["dl", "de"], ["de", "dl", "curated", { dashed: true }], ["dl", "ai"]],
    },
    deployment: anywhereDeploy("cloudera-data-services-2", "Data Services 2.0", "cloudera-base-datahub"),
  },
  io: {
    inputs: ["Existing 1.5.x workloads", "Sources via Data Flow 2.0"],
    outputs: ["Pipelines, tables, models and flows on Anywhere Cloud"],
    dependencies: ["Cloudera Anywhere Cloud", "Unified Data Fabric"],
    connectors: ["Iceberg REST / Polaris catalog"],
    apis: ["Per-service APIs"],
    integrations: ["Partner engines (Neo4j, StarRocks, ClickHouse — illustrative)"],
  },
  ...shared(),
  clouderaContext: {
    standalone: "A Cloudera product grouping, not an open-source project.",
    clouderaIntegration: "The service layer of Anywhere Cloud, sharing the Unified Data Fabric and engines.",
    realWorld: "A bank keeps core batch on 7.3.2 while new AI workloads start on AI 2.0 in a sovereign cloud, all reading the same governed tables.",
  },
  useCases: [{ title: "Phased modernization", scenario: "Adopt 2.0 services workload by workload.", industryIds: ["financial", "telco"] }],
  relatedComponentIds: ["cloudera-anywhere-cloud", "data-engineering-2", "data-lakehouse-2", "ai-2", "data-flow-2", "unified-data-fabric"],
};

const edition = ({ id, name, prev, tagline, overview, capabilities, stages, internal, dataFlow, io, ctx, useCases, related }) => ({
  id, name, origin: "cloudera", category: "cds-2", parentId: "cloudera-data-services-2", previousEditionId: prev,
  tagline, overview, businessValue: "Same service experience as 1.5.x with modular, run-anywhere deployment and fabric-wide governance.",
  capabilities, workflow: { stages },
  views: { internal, dataFlow, deployment: anywhereDeploy(id, name, prev) },
  io, ...shared(), clouderaContext: ctx, useCases,
  relatedComponentIds: [prev, "cloudera-data-services-2", ...related],
});

export const de2 = edition({
  id: "data-engineering-2", name: "Data Engineering 2.0", prev: "cloudera-data-engineering",
  tagline: "Spark 4 pipelines with Airflow, GPU acceleration and run-anywhere deployment.",
  overview: "Data Engineering 2.0 is the Anywhere Cloud edition of Cloudera Data Engineering. Cloudera's NVIDIA announcement (Aug 2026) describes cuDF GPU acceleration for Apache Spark 4.1 in Cloudera Data Engineering as part of Anywhere Cloud — up to 4x faster — governed through the Unified Data Fabric. Airflow orchestration is listed among Anywhere Cloud capabilities.",
  capabilities: ["Apache Spark 4.x runtime", "NVIDIA cuDF GPU acceleration for Spark 4.1 (announced)", "Airflow orchestration", "Seamless transition of 1.5.x jobs"],
  stages: [["code", "Bring job code", "Existing CDE jobs or new Spark 4 code.", "spark-4"], ["deploy", "Deploy on Anywhere Cloud", "Run in the chosen environment."], ["accelerate", "Optional GPU acceleration", "cuDF offloads supported operators to NVIDIA GPUs.", "nvidia"], ["orchestrate", "Orchestrate", "Airflow DAGs schedule jobs.", "apache-airflow"], ["write", "Write Iceberg", "Governed commits via the fabric.", "apache-iceberg"]],
  internal: { nodes: [["api", "Jobs API / UI", "Define and trigger jobs.", "client"], ["focus", "DE 2.0 control plane", "Job, resource and run management.", "focus"], ["airflow", "Airflow", "Orchestration.", "apache", "apache-airflow"], ["spark", "Spark 4 executors", "Distributed compute.", "apache", "spark-4"], ["gpu", "GPU (cuDF)", "Accelerated operators.", "vendor", "nvidia"], ["fabric", "Unified Data Fabric", "Policies and lineage.", "cloudera", "unified-data-fabric"]], edges: [["api", "focus"], ["focus", "airflow"], ["airflow", "spark", "trigger"], ["gpu", "spark", "accelerates", { dashed: true }], ["fabric", "spark", "governs", { dashed: true }]] },
  dataFlow: { nodes: [["raw", "Raw data", "Landed files and tables.", "store"], ["spark", "Spark 4 job", "Transform.", "apache", "spark-4"], ["ice", "Iceberg tables", "Curated output.", "store", "apache-iceberg"], ["consumers", "Trino / AI 2.0", "Downstream consumers.", "cloudera", "ai-2"]], edges: [["raw", "spark"], ["spark", "ice"], ["ice", "consumers"]] },
  io: { inputs: ["Spark job code", "Raw data"], outputs: ["Iceberg tables"], dependencies: ["Anywhere Cloud", "Unified Data Fabric"], connectors: ["Iceberg"], apis: ["Jobs API"], integrations: ["NVIDIA cuDF"] },
  ctx: { standalone: "Spark 4 and Airflow are Apache projects.", clouderaIntegration: "Cloudera's 2.0 packaging of them with fabric governance.", realWorld: "A telco cuts nightly aggregation time by running Spark 4.1 jobs on GPU nodes." },
  useCases: [{ title: "GPU-accelerated ETL", scenario: "Faster large joins and aggregations.", industryIds: ["telco", "financial"] }],
  related: ["spark-4", "apache-airflow", "nvidia"],
});

export const dl2 = edition({
  id: "data-lakehouse-2", name: "Data Lakehouse 2.0", prev: "cloudera-data-lakehouse",
  tagline: "Iceberg + Polaris lakehouse with zero-copy federated analytics.",
  overview: "Data Lakehouse 2.0 is the lakehouse in Anywhere Cloud. Cloudera lists \"zero-copy federated analytics powered by Apache Iceberg and Trino\", cites the Apache Polaris catalog, and announced (Jun 2026) a Ranger authorizer plugin (Beta) contributed to Polaris 1.5.",
  capabilities: ["Apache Iceberg tables", "Apache Polaris (Iceberg REST) catalog", "Trino federated analytics", "Ranger authorization for Polaris (Beta)"],
  stages: [["register", "Register tables", "Iceberg tables in Polaris.", "apache-iceberg"], ["authorize", "Authorize", "Ranger policies via the Polaris plugin.", "apache-ranger"], ["federate", "Federate", "Trino joins lakehouse and external sources.", "trino"], ["serve", "Serve engines", "Spark 4, partners and AI read the same tables."]],
  internal: { nodes: [["engines", "Engines", "Spark 4, Trino, partners.", "apache", "trino"], ["polaris", "Polaris catalog", "Iceberg REST catalog.", "core"], ["focus", "Iceberg tables", "Open table format.", "focus", "apache-iceberg"], ["ranger", "Ranger", "Authorization.", "security", "apache-ranger"], ["store", "Object storage", "Data and metadata files.", "store", "cloudera-object-store"]], edges: [["engines", "polaris"], ["polaris", "focus"], ["focus", "store"], ["ranger", "polaris", "authorizes", { dashed: true }]] },
  dataFlow: { nodes: [["ingest", "Data Flow 2.0", "Ingest.", "cloudera", "data-flow-2"], ["tbl", "Iceberg table", "One copy.", "focus", "apache-iceberg"], ["trino", "Trino", "Federated SQL.", "apache", "trino"], ["ext", "External sources", "Databases, SaaS.", "external"], ["bi", "BI / AI", "Consumers.", "client"]], edges: [["ingest", "tbl"], ["tbl", "trino"], ["ext", "trino", "federated", { dashed: true }], ["trino", "bi"]] },
  io: { inputs: ["Streams and batch writes"], outputs: ["Governed Iceberg tables"], dependencies: ["Object storage", "Polaris"], connectors: ["Iceberg REST"], apis: ["Iceberg REST", "SQL"], integrations: ["Trino", "Partner engines (illustrative)"] },
  ctx: { standalone: "Iceberg and Polaris are Apache projects; Trino is open source.", clouderaIntegration: "Cloudera packages them with fabric governance in Anywhere Cloud.", realWorld: "An insurer federates policy tables with a CRM database through Trino without copying data." },
  useCases: [{ title: "Federated customer 360", scenario: "Join lakehouse and operational stores.", industryIds: ["insurance", "financial"] }],
  related: ["apache-iceberg", "trino", "apache-ranger"],
});

export const ai2 = edition({
  id: "ai-2", name: "AI 2.0", prev: "cloudera-ai",
  tagline: "Private AI with modern frameworks, vector engines and inference anywhere.",
  overview: "AI 2.0 is Cloudera AI in Anywhere Cloud. Cloudera lists Ray, PyTorch and TensorFlow, vector index engines and DuckDB/Polars among Anywhere Cloud capabilities, plus an agentic copilot. Private inference continues the Cloudera AI Inference approach with NVIDIA NIM.",
  capabilities: ["Ray, PyTorch, TensorFlow", "Vector index engines for RAG", "DuckDB and Polars", "Private inference (NVIDIA NIM)"],
  stages: [["data", "Access governed data", "Through the fabric.", "unified-data-fabric"], ["embed", "Build embeddings", "Vector index engines store embeddings."], ["train", "Train / fine-tune", "Ray, PyTorch or TensorFlow on GPUs.", "nvidia"], ["serve", "Serve privately", "Inference endpoints in the tenant."], ["agents", "Power agents", "Agent workflows call endpoints.", "cloudera-agent-studio"]],
  internal: { nodes: [["users", "Practitioners", "Data scientists and AI engineers.", "client"], ["focus", "AI 2.0 workspace", "Projects and runtimes.", "focus"], ["frameworks", "Ray / PyTorch / TF", "Training frameworks.", "apache"], ["vector", "Vector index", "Embeddings for RAG.", "store"], ["inference", "Inference", "Private endpoints.", "cloudera"], ["gpu", "GPUs", "Accelerated compute.", "vendor", "nvidia"]], edges: [["users", "focus"], ["focus", "frameworks"], ["focus", "vector"], ["frameworks", "inference", "deploy"], ["gpu", "inference", "", { dashed: true }]] },
  dataFlow: { nodes: [["docs", "Governed documents", "Source content.", "store"], ["vec", "Vector index", "Embeddings.", "store"], ["llm", "Private LLM", "Generation.", "cloudera"], ["app", "RAG app", "Consumer.", "client"]], edges: [["docs", "vec", "embed"], ["vec", "llm", "retrieve"], ["llm", "app"]] },
  io: { inputs: ["Documents", "Tables"], outputs: ["Models", "Endpoints"], dependencies: ["GPUs", "Unified Data Fabric"], connectors: ["Lakehouse"], apis: ["Inference endpoints"], integrations: ["NVIDIA NIM"] },
  ctx: { standalone: "Ray, PyTorch, TensorFlow, DuckDB and Polars are open source.", clouderaIntegration: "Cloudera packages them with governed data and private inference.", realWorld: "A hospital network runs RAG over clinical guidelines in an air-gapped deployment." },
  useCases: [{ title: "Air-gapped RAG", scenario: "GenAI where data cannot leave.", industryIds: ["healthcare", "pharma"] }],
  related: ["cloudera-agent-studio", "nvidia"],
});

export const df2 = edition({
  id: "data-flow-2", name: "Data Flow 2.0", prev: "cloudera-data-flow",
  tagline: "NiFi-based universal data distribution on Anywhere Cloud.",
  overview: "Data Flow 2.0 is Cloudera Data Flow in Anywhere Cloud, bringing NiFi flow design and deployment, with Kafka streaming, to every Anywhere Cloud environment under the Unified Data Fabric.",
  capabilities: ["NiFi 2 flows", "Kafka streaming via engine blueprints", "Deploy flows in any environment", "Fabric lineage"],
  stages: [["design", "Design flow", "NiFi 2 flow.", "apache-nifi"], ["deploy", "Deploy anywhere", "Edge, private or public."], ["stream", "Stream", "Publish to Kafka.", "apache-kafka"], ["land", "Land in lakehouse", "Iceberg tables.", "data-lakehouse-2"]],
  internal: { nodes: [["designer", "Flow design", "Author flows.", "client"], ["focus", "DF 2.0 deployments", "Running flows.", "focus"], ["nifi", "NiFi 2", "Flow runtime.", "apache", "apache-nifi"], ["kafka", "Kafka", "Streaming.", "apache", "apache-kafka"], ["fabric", "Fabric lineage", "Governance.", "cloudera", "unified-data-fabric"]], edges: [["designer", "focus"], ["focus", "nifi"], ["nifi", "kafka"], ["fabric", "nifi", "", { dashed: true }]] },
  dataFlow: { nodes: [["src", "Sources", "Any system.", "external"], ["nifi", "NiFi", "Route.", "apache", "apache-nifi"], ["kafka", "Kafka", "Stream.", "apache", "apache-kafka"], ["dl", "Lakehouse 2.0", "Store.", "cloudera", "data-lakehouse-2"]], edges: [["src", "nifi"], ["nifi", "kafka"], ["nifi", "dl"]] },
  io: { inputs: ["Any source"], outputs: ["Topics", "Tables"], dependencies: ["Anywhere Cloud"], connectors: ["NiFi processors"], apis: ["Flow APIs"], integrations: ["Kafka"] },
  ctx: { standalone: "NiFi and Kafka are Apache projects.", clouderaIntegration: "Cloudera's 2.0 flow service with fabric lineage.", realWorld: "A manufacturer runs the same flow definition at plants and in the cloud." },
  useCases: [{ title: "Edge-to-cloud ingestion", scenario: "Consistent flows across sites.", industryIds: ["manufacturing", "telco"] }],
  related: ["apache-nifi", "apache-kafka"],
});
