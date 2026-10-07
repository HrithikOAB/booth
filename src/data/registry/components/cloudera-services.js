// Cloudera data services — Base / Data Services 1.5.x editions shown in the
// left pillar of the umbrella diagram, plus Data Warehouse and Agent Studio.
import { cds2Group, de2, dl2, ai2, df2 } from "./cds2.js";

const cdai = {
  id: "cloudera-ai",
  name: "Cloudera AI",
  aka: "formerly Cloudera Machine Learning",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Data Services 1.5.x",
  parentId: "cloudera-base-datahub",
  tagline: "Governed workbench, model registry and private inference for ML and GenAI.",
  overview:
    "Cloudera AI is Cloudera's data service for machine learning and generative AI. Data scientists work in projects with containerized sessions, jobs and applications (Cloudera AI Workbench); models are versioned in a registry and served through the Cloudera AI Inference service, which Cloudera announced with embedded NVIDIA NIM microservices. Everything runs inside the customer's environment against governed data, so prompts, data and models stay under enterprise control.",
  businessValue:
    "Brings AI to where the data already lives — private and governed — so teams move from prototype to production without copying sensitive data to third-party services.",
  capabilities: [
    "Workbench: projects, interactive sessions, scheduled jobs and hosted applications on Kubernetes",
    "ML Runtimes: curated container images (Python, R, GPU) with editors such as JupyterLab",
    "Model registry for versioned models and deployment lineage",
    "AI Inference service with embedded NVIDIA NIM microservices (announced Oct 2024)",
    "Accelerators for ML Projects (AMPs) — prebuilt reference projects",
  ],
  highlights: [
    "Cloudera's AI Inference demos show private LLM serving to avoid sending tokens to external clouds.",
    "Agent Studio (see its page) builds governed agents on top of Cloudera AI.",
  ],
  workflow: {
    title: "From data to deployed model",
    stages: [
      ["data", "Access governed data", "A project connects to lakehouse tables through SDX-governed connections — Ranger policies decide what the user can read.", "cloudera-sdx"],
      ["session", "Explore in a session", "The data scientist launches a containerized session (CPU or GPU) with a chosen ML Runtime."],
      ["train", "Train & track", "Experiments run as sessions or jobs; metrics and artifacts are tracked."],
      ["register", "Register model", "The chosen model version is registered with its metadata in the model registry."],
      ["serve", "Deploy to AI Inference", "The model (or an optimized LLM via NVIDIA NIM) is deployed as a scalable, authenticated endpoint.", "nvidia"],
      ["app", "Consume in apps", "Applications and agents call the endpoint; usage and latency are monitored."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["users", "Data scientists / ML engineers", "Work in projects via the web UI, API or IDEs.", "client"],
        { id: "wb", label: "Cloudera AI Workbench", kind: "focus", description: "Projects, sessions, jobs and applications.",
          children: [["sessions", "Sessions", "Interactive containers per user."], ["jobs", "Jobs", "Scheduled/batch workloads."], ["apps", "Applications", "Hosted web apps (e.g. Streamlit)."]],
          childEdges: [] },
        ["runtimes", "ML Runtimes", "Container images for Python/R/GPU workloads.", "core"],
        ["registry", "Model registry", "Versioned models and metadata.", "store"],
        ["inference", "AI Inference service", "Production model & LLM serving; NVIDIA NIM embedded.", "cloudera"],
        ["k8s", "Kubernetes compute", "CPU and GPU node pools.", "core"],
        ["sdx", "SDX", "Identity, authorization and lineage.", "cloudera", "cloudera-sdx"],
      ],
      edges: [["users", "wb"], ["runtimes", "wb", "images", { dashed: true }], ["wb", "registry", "register"], ["registry", "inference", "deploy"], ["wb", "k8s"], ["inference", "k8s"], ["sdx", "wb", "governs", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["ice", "Governed Iceberg tables", "Features and documents in the lakehouse.", "store", "apache-iceberg"],
        ["prep", "Feature / embedding prep", "Spark or Python jobs build features or vector embeddings.", "core"],
        ["train", "Training job", "Fine-tune or train on GPUs.", "core"],
        ["model", "Registered model", "Versioned artifact.", "data"],
        ["endpoint", "Inference endpoint", "Authenticated REST/OpenAI-compatible API.", "cloudera"],
        ["app", "GenAI app / agent", "Assistant, scoring service or agent.", "client"],
      ],
      edges: [["ice", "prep"], ["prep", "train"], ["train", "model"], ["model", "endpoint", "deploy"], ["endpoint", "app", "predictions"]],
    },
    deployment: {
      nodes: [
        ["onprem", "Data Services 1.5.x on premises", "Cloudera AI on embedded or OpenShift Kubernetes next to Cloudera Base.", "cloudera", "on-premises-deployment"],
        ["cloud", "Public cloud", "Cloudera AI workbenches in AWS / Azure / GCP environments.", "cloud", "cloud-deployment"],
        ["gpu", "GPU node pools", "NVIDIA GPUs for training and NIM-based inference.", "vendor", "nvidia"],
        ["base", "Cloudera Base data", "Governed data and SDX shared by the cluster.", "cloudera", "cloudera-base-datahub"],
        ["ai2", "AI 2.0", "Anywhere Cloud edition of the AI service.", "cloudera", "ai-2"],
      ],
      edges: [["onprem", "base", "reads"], ["gpu", "onprem", "", { dashed: true }], ["gpu", "cloud", "", { dashed: true }], ["onprem", "ai2", "transition"]],
    },
  },
  io: {
    inputs: ["Governed lakehouse/warehouse tables", "Documents for RAG", "Feature datasets"],
    outputs: ["Registered models", "Inference endpoints", "Hosted applications"],
    dependencies: ["Kubernetes (Data Services)", "SDX Data Lake", "GPU nodes for accelerated workloads"],
    connectors: ["Data connections to Impala/Hive/Spark", "Object storage"],
    apis: ["Cloudera AI API v2", "Inference endpoints (REST, OpenAI-compatible for LLMs)"],
    integrations: ["NVIDIA NIM", "Cloudera Data Warehouse", "Agent Studio"],
  },
  ops: {
    security: "SSO and workload identity via the platform; Ranger-governed data access; endpoints require authentication tokens.",
    governance: "Model registry records versions; data lineage through SDX for data read by projects.",
    monitoring: "Resource usage per project, model endpoint metrics and logs.",
    scalability: "Kubernetes autoscaling of sessions, jobs and inference replicas; GPU quotas per team.",
  },
  clouderaContext: {
    standalone: "Cloudera AI is a Cloudera product (not an Apache project); it builds on open frameworks such as Python, Jupyter, PyTorch and Kubernetes.",
    clouderaIntegration: "It is a Cloudera Data Service that consumes data governed by SDX, runs on Data Services 1.5.x or public cloud, and continues as AI 2.0 in Cloudera Data Services 2.0.",
    realWorld: "An insurer fine-tunes a claims-summarization model on governed documents, serves it privately through AI Inference on GPUs, and an agent drafts adjuster notes — data never leaves the tenant.",
  },
  useCases: [
    { title: "Private document intelligence", scenario: "Summarize and classify sensitive documents with private LLMs.", industryIds: ["insurance", "healthcare", "financial"] },
    { title: "Predictive maintenance models", scenario: "Train failure-prediction models on sensor history.", industryIds: ["manufacturing"] },
  ],
  relatedComponentIds: ["ai-2", "cloudera-agent-studio", "nvidia", "cloudera-sdx", "cloudera-data-lakehouse", "apache-spark"],
};

const cde = {
  id: "cloudera-data-engineering",
  name: "Cloudera Data Engineering",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Data Services 1.5.x",
  parentId: "cloudera-base-datahub",
  tagline: "Managed Spark on Kubernetes with built-in Airflow orchestration.",
  overview:
    "Cloudera Data Engineering (CDE) is Cloudera's data service for building and running Spark pipelines. Administrators create virtual clusters — isolated, autoscaling Spark-on-Kubernetes environments — inside a CDE service. Engineers define jobs and resources (files, Python environments) through the UI, CLI or API, orchestrate them with an embedded Apache Airflow, and debug runs with Spark UI and logs. Jobs read and write governed lakehouse tables through SDX.",
  businessValue: "Self-service, isolated pipeline environments without hand-managing Spark clusters, with consistent security and lineage.",
  capabilities: [
    "Virtual clusters with independent Spark versions, quotas and autoscaling",
    "Job and resource management via UI, CLI and REST API",
    "Embedded Apache Airflow with CDE operators",
    "Interactive Spark sessions and external IDE connectivity",
    "Iceberg-native pipelines; NVIDIA GPU acceleration announced for Spark 4.1 (Aug 2026)",
  ],
  highlights: ["Cloudera demos show connecting external IDEs directly to Spark in CDE."],
  workflow: {
    title: "Pipeline lifecycle in CDE",
    stages: [
      ["vc", "Select virtual cluster", "A team works in its own virtual cluster with set Spark version and resource quota."],
      ["resources", "Upload resources", "Application code, dependencies and Python environments are uploaded as resources."],
      ["job", "Define Spark job", "A job binds code, configuration and schedule.", "apache-spark"],
      ["dag", "Orchestrate with Airflow", "An Airflow DAG sequences CDE jobs, checks and downstream refreshes.", "apache-airflow"],
      ["run", "Run on Kubernetes", "Driver and executor pods are scheduled and autoscaled on the cluster."],
      ["govern", "Governed reads/writes", "Spark reads and commits Iceberg tables under Ranger policies; lineage flows to Atlas.", "apache-iceberg"],
      ["observe", "Observe & tune", "Spark UI, logs and run history pinpoint slow stages."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["clients", "UI / CLI / API", "Define and trigger jobs.", "client"],
        { id: "svc", label: "CDE service", kind: "focus", description: "Control layer that hosts virtual clusters.",
          children: [["vc1", "Virtual cluster A", "Team-isolated Spark + Airflow."], ["vc2", "Virtual cluster B", "Different Spark version / quota."]],
          childEdges: [] },
        ["airflow", "Embedded Airflow", "Per-virtual-cluster orchestration.", "apache", "apache-airflow"],
        ["spark", "Spark on Kubernetes", "Driver/executor pods per run.", "apache", "apache-spark"],
        ["sched", "Kubernetes scheduling", "Queues and quotas decide where pods run.", "core"],
        ["dl", "SDX Data Lake", "Metastore, Ranger, Atlas.", "cloudera", "cloudera-sdx"],
        ["obj", "Object storage", "Iceberg tables and logs.", "store", "cloudera-object-store"],
      ],
      edges: [["clients", "svc"], ["svc", "airflow"], ["airflow", "spark", "trigger"], ["spark", "sched"], ["spark", "dl", "policies + lineage", { dashed: true }], ["spark", "obj", "read / write"]],
    },
    dataFlow: {
      nodes: [
        ["raw", "Raw zone", "Files landed by NiFi.", "store", "apache-nifi"],
        ["bronze", "Bronze Iceberg", "Typed, deduplicated.", "data"],
        ["silver", "Silver Iceberg", "Joined and conformed.", "data"],
        ["gold", "Gold Iceberg", "Business aggregates.", "data"],
        ["cdw", "CDW / Trino", "Serve BI and AI.", "cloudera", "cloudera-data-warehouse"],
      ],
      edges: [["raw", "bronze", "Spark job"], ["bronze", "silver", "Spark job"], ["silver", "gold", "Spark job"], ["gold", "cdw"]],
    },
    deployment: {
      nodes: [
        ["onprem", "Data Services 1.5.x", "CDE on embedded or OpenShift Kubernetes on premises.", "cloudera", "on-premises-deployment"],
        ["cloud", "Public cloud", "CDE services in AWS/Azure environments.", "cloud", "cloud-deployment"],
        ["base", "Cloudera Base", "Shared data and SDX.", "cloudera", "cloudera-base-datahub"],
        ["gpu", "GPU nodes", "NVIDIA cuDF acceleration (announced for Spark 4.1).", "vendor", "nvidia"],
        ["de2", "Data Engineering 2.0", "Anywhere Cloud edition; seamless job transition.", "cloudera", "data-engineering-2"],
      ],
      edges: [["onprem", "base"], ["cloud", "base", "hybrid", { dashed: true }], ["gpu", "onprem", "", { dashed: true }], ["onprem", "de2", "jobs move"]],
    },
  },
  io: {
    inputs: ["Raw files and tables", "Kafka topics", "External APIs"],
    outputs: ["Curated Iceberg tables", "Features", "Pipeline run history"],
    dependencies: ["Kubernetes", "SDX Data Lake", "Object storage"],
    connectors: ["Iceberg", "Kafka", "JDBC", "Cloud storage"],
    apis: ["CDE REST API", "CDE CLI", "Airflow operators"],
    integrations: ["Apache Spark", "Apache Airflow", "Cloudera Data Warehouse", "NVIDIA RAPIDS/cuDF (announced)"],
  },
  ops: {
    security: "Platform SSO and workload identity; Ranger governs table access; virtual-cluster level access control.",
    governance: "Spark lineage to Atlas; job definitions versioned.",
    monitoring: "Job run history, Spark UI, logs, Cloudera Observability.",
    scalability: "Virtual clusters autoscale within quotas; executors scale per job.",
  },
  clouderaContext: {
    standalone: "CDE is a Cloudera product; its engines (Spark, Airflow) are Apache projects that run independently elsewhere.",
    clouderaIntegration: "CDE is a Cloudera Data Service governed by SDX, available on Data Services 1.5.x and public cloud, with Data Engineering 2.0 in Cloudera Data Services 2.0.",
    realWorld: "A telco runs hourly CDR enrichment DAGs in CDE, writes Iceberg tables, and Impala dashboards refresh automatically.",
  },
  useCases: [
    { title: "Medallion lakehouse pipelines", scenario: "Bronze → silver → gold Iceberg tables.", industryIds: ["telco", "financial"] },
    { title: "Clinical data integration", scenario: "Harmonize trial sources on a schedule.", industryIds: ["pharma"] },
  ],
  relatedComponentIds: ["apache-spark", "apache-airflow", "data-engineering-2", "apache-iceberg", "nvidia", "cloudera-sdx"],
};

const cdl = {
  id: "cloudera-data-lakehouse",
  name: "Cloudera Data Lakehouse",
  aka: "Open Data Lakehouse",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Data Services 1.5.x",
  parentId: "cloudera-base-datahub",
  tagline: "Open lakehouse on Apache Iceberg shared by every engine.",
  overview:
    "Cloudera's open data lakehouse stores data once, in open formats and Apache Iceberg tables on object storage, and lets multiple engines — Impala, Hive, Spark, Flink, NiFi and Trino — work on the same tables under one SDX security and governance layer. Catalog interoperability (Hive Metastore, Iceberg REST, and Apache Polaris adoption announced in 2026) lets external engines participate without copies.",
  businessValue: "Eliminates data silos and copies between lake and warehouse, cutting cost and lock-in while making data AI-ready.",
  capabilities: [
    "Apache Iceberg tables with ACID, time travel, schema and partition evolution",
    "Multi-engine access: SQL, Spark, streaming and federation",
    "Shared metadata and policies through SDX",
    "Iceberg REST catalog integration and Apache Polaris adoption (announced)",
    "Table maintenance and migration from Hive tables",
  ],
  highlights: ["Cloudera demos show an Agent Studio Iceberg MCP agent monitoring table health."],
  workflow: {
    title: "Lakehouse data lifecycle",
    stages: [
      ["land", "Land raw data", "NiFi, Kafka and batch loads land data in object storage.", "apache-nifi"],
      ["table", "Create Iceberg tables", "Data is written as Iceberg tables registered in the catalog.", "apache-iceberg"],
      ["govern", "Apply governance", "Ranger policies, Atlas classifications and lineage are attached.", "cloudera-sdx"],
      ["process", "Transform", "Spark (CDE) and Hive build curated tables.", "cloudera-data-engineering"],
      ["serve", "Serve many engines", "Impala, Trino and partner engines read the same snapshots.", "cloudera-data-warehouse"],
      ["maintain", "Maintain & evolve", "Compaction, snapshot expiry, schema and partition evolution keep tables healthy."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["engines", "Engines", "Impala, Hive, Spark, Flink, NiFi, Trino.", "apache"],
        ["catalog", "Catalog layer", "Hive Metastore / Iceberg REST (Polaris).", "core"],
        ["iceberg", "Iceberg tables", "Open table format.", "focus", "apache-iceberg"],
        ["store", "Object storage", "Ozone on-prem; S3/ADLS/GCS in cloud.", "store", "cloudera-object-store"],
        ["sdx", "SDX", "Ranger, Atlas, lineage.", "cloudera", "cloudera-sdx"],
        ["catalogui", "Data catalog & lineage", "Discovery and lineage for users.", "cloudera", "cloudera-data-lineage"],
      ],
      edges: [["engines", "catalog", "resolve tables"], ["catalog", "iceberg"], ["iceberg", "store"], ["sdx", "engines", "policies", { dashed: true }], ["sdx", "catalogui", "", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["stream", "Streams (Kafka/NiFi)", "Continuous appends.", "apache", "apache-kafka"],
        ["batch", "Batch (Spark)", "Merges and backfills.", "apache", "apache-spark"],
        ["tbl", "Shared Iceberg table", "One copy.", "focus", "apache-iceberg"],
        ["bi", "BI (Impala)", "Dashboards.", "apache", "apache-impala"],
        ["fed", "Federation (Trino)", "Joins with other sources.", "apache", "trino"],
        ["ai", "AI (Cloudera AI)", "Features and RAG data.", "cloudera", "cloudera-ai"],
      ],
      edges: [["stream", "tbl"], ["batch", "tbl"], ["tbl", "bi"], ["tbl", "fed"], ["tbl", "ai"]],
    },
    deployment: {
      nodes: [
        ["base", "Cloudera Base storage", "Ozone/HDFS managed by Cloudera Manager.", "cloudera", "cloudera-base-datahub"],
        ["cloud", "Cloud object stores", "S3, ADLS, GCS.", "store", "s3-storage"],
        ["dell", "Dell ObjectScale", "Certified with Cloudera (announced Sep 2025).", "vendor", "dell-technologies"],
        ["sdx", "SDX Data Lake", "Per-environment catalog and policies.", "cloudera", "cloudera-sdx"],
        ["dl2", "Data Lakehouse 2.0", "Anywhere Cloud edition.", "cloudera", "data-lakehouse-2"],
      ],
      edges: [["sdx", "base"], ["sdx", "cloud"], ["sdx", "dell", "", { dashed: true }], ["base", "dl2", "zero-copy access"]],
    },
  },
  io: {
    inputs: ["Streams", "Files", "Database extracts", "Hive table migrations"],
    outputs: ["Iceberg tables for SQL, Spark, streaming and AI"],
    dependencies: ["Object storage", "Catalog", "SDX"],
    connectors: ["Iceberg integrations for each engine", "Iceberg REST catalog"],
    apis: ["SQL", "Spark/Flink APIs", "Iceberg REST"],
    integrations: ["Cloudera Data Warehouse", "Cloudera Data Engineering", "Cloudera Data Flow", "Cloudera AI"],
  },
  ops: {
    security: "Ranger table, column and row policies; encryption at rest and in transit.",
    governance: "Atlas metadata and classifications; Cloudera Data Lineage across systems.",
    monitoring: "Iceberg metadata tables, engine query profiles, observability tooling.",
    scalability: "Storage and compute scale independently; engines added without data copies.",
  },
  clouderaContext: {
    standalone: "The lakehouse pattern relies on open standards (Iceberg, Parquet) that work outside Cloudera too.",
    clouderaIntegration: "Cloudera packages the lakehouse across its data services with SDX governance; Data Lakehouse 2.0 continues it in Anywhere Cloud with Polaris interoperability.",
    realWorld: "A bank stores transactions once in Iceberg; fraud streaming, regulatory SQL and AI feature pipelines all use the same governed tables.",
  },
  useCases: [
    { title: "Unify lake and warehouse", scenario: "Retire duplicate copies across BI and data science.", industryIds: ["financial", "insurance"] },
    { title: "AI-ready research data", scenario: "Governed tables for clinical and genomic analytics.", industryIds: ["pharma", "healthcare"] },
  ],
  relatedComponentIds: ["apache-iceberg", "data-lakehouse-2", "cloudera-data-warehouse", "cloudera-sdx", "cloudera-object-store", "trino"],
};

const cdf = {
  id: "cloudera-data-flow",
  name: "Cloudera Data Flow",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Data Services 1.5.x",
  parentId: "cloudera-base-datahub",
  tagline: "Universal data distribution with NiFi, Kafka and Flink.",
  overview:
    "Cloudera Data Flow (CDF) moves data from any source to any destination. Its Flow Management capability is powered by Apache NiFi — flows are designed in the Flow Designer, versioned in the Catalog, started from the ReadyFlow Gallery, and run as isolated, autoscaling deployments on Kubernetes. Streams Messaging (Apache Kafka) and Streaming Analytics (Apache Flink) complete real-time pipelines. CDF 2.10 added building and deploying NiFi 2 flows.",
  businessValue: "One governed way to ingest and distribute data across hybrid environments, with far less custom connector code.",
  capabilities: [
    "Flow Designer for visual NiFi flow authoring and testing",
    "Catalog for versioned flow definitions",
    "ReadyFlow Gallery of prebuilt source-to-destination flows",
    "Flow deployments with autoscaling and KPIs on Kubernetes",
    "NiFi 2 flows (CDF 2.10), Kafka streams messaging, Flink streaming analytics",
  ],
  highlights: ["Cloudera's 'What's new in Data Flow 2.10' video covers building and deploying NiFi 2 flows."],
  workflow: {
    title: "Flow lifecycle in CDF",
    stages: [
      ["design", "Design", "A developer builds a flow in the Flow Designer and tests it with sample data.", "apache-nifi"],
      ["publish", "Publish to Catalog", "The flow definition is versioned in the Catalog."],
      ["deploy", "Deploy", "The wizard sets parameters, sizing, autoscaling and KPIs, then creates an isolated deployment."],
      ["ingest", "Ingest & route", "The flow pulls from sources, enriches and routes records with provenance."],
      ["stream", "Distribute via Kafka", "Events are published to Kafka topics for many consumers.", "apache-kafka"],
      ["analyze", "Analyze in Flink", "Streaming SQL detects patterns and writes results.", "apache-flink"],
      ["monitor", "Monitor KPIs", "Deployment dashboards and alerts track throughput and failures."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["designer", "Flow Designer", "Visual authoring and test sessions.", "core"],
        ["catalog", "Catalog", "Versioned flow definitions.", "store"],
        ["gallery", "ReadyFlow Gallery", "Prebuilt flows.", "core"],
        { id: "deploy", label: "Flow deployments", kind: "focus", description: "Isolated NiFi clusters on Kubernetes.",
          children: [["nifi", "NiFi runtime", "Processors and queues.", "apache", "apache-nifi"], ["kpi", "KPIs & alerts", "Throughput and errors."]],
          childEdges: [] },
        ["kafka", "Streams Messaging", "Kafka topics.", "apache", "apache-kafka"],
        ["flink", "Streaming Analytics", "Flink / SQL Stream Builder.", "apache", "apache-flink"],
        ["sdx", "SDX", "Policies and lineage.", "cloudera", "cloudera-sdx"],
      ],
      edges: [["designer", "catalog", "publish"], ["gallery", "deploy"], ["catalog", "deploy", "deploy"], ["deploy", "kafka", "publish"], ["kafka", "flink"], ["sdx", "deploy", "", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["src", "Sources", "Databases, files, APIs, IoT.", "external"],
        ["nifi", "NiFi flow", "Collect, enrich, route.", "apache", "apache-nifi"],
        ["kafka", "Kafka", "Durable event backbone.", "apache", "apache-kafka"],
        ["flink", "Flink", "Real-time analytics.", "apache", "apache-flink"],
        ["ice", "Iceberg lakehouse", "History.", "store", "apache-iceberg"],
        ["apps", "Apps & alerts", "Operational consumers.", "client"],
      ],
      edges: [["src", "nifi"], ["nifi", "kafka"], ["nifi", "ice"], ["kafka", "flink"], ["flink", "apps"], ["flink", "ice"]],
    },
    deployment: {
      nodes: [
        ["onprem", "Data Services 1.5.x", "CDF deployments on premises.", "cloudera", "on-premises-deployment"],
        ["cloud", "Public cloud", "CDF service in AWS/Azure.", "cloud", "cloud-deployment"],
        ["base", "Cloudera Base", "Kafka/Flink/NiFi clusters can also run on Base.", "cloudera", "cloudera-base-datahub"],
        ["df2", "Data Flow 2.0", "Anywhere Cloud edition.", "cloudera", "data-flow-2"],
      ],
      edges: [["onprem", "base"], ["cloud", "base", "hybrid", { dashed: true }], ["onprem", "df2", "transition"]],
    },
  },
  io: {
    inputs: ["Databases (CDC)", "Files", "APIs", "Logs", "IoT/edge"],
    outputs: ["Kafka topics", "Iceberg tables", "Cloud stores", "SaaS destinations"],
    dependencies: ["Kubernetes", "SDX", "Kafka for messaging"],
    connectors: ["Hundreds of NiFi processors", "ReadyFlows"],
    apis: ["CDF REST API & CLI", "NiFi REST API", "Kafka APIs"],
    integrations: ["Apache NiFi", "Apache Kafka", "Apache Flink", "Cloudera Data Lakehouse"],
  },
  ops: {
    security: "Platform SSO; Ranger policies for NiFi and Kafka; TLS everywhere; parameter-based secrets.",
    governance: "NiFi provenance and Atlas lineage for flows and topics.",
    monitoring: "Deployment KPIs, alerts and NiFi bulletins.",
    scalability: "Per-deployment autoscaling; Kafka partitions; Flink parallelism.",
  },
  clouderaContext: {
    standalone: "NiFi, Kafka and Flink are Apache projects usable on their own.",
    clouderaIntegration: "CDF is the Cloudera Data Service that packages them with design, catalog, deployment and SDX governance; Data Flow 2.0 continues in Anywhere Cloud.",
    realWorld: "A manufacturer streams PLC telemetry through NiFi into Kafka; Flink flags anomalies and history lands in Iceberg for model training.",
  },
  useCases: [
    { title: "Real-time fraud signals", scenario: "Stream transactions to scoring.", industryIds: ["financial"] },
    { title: "IoT telemetry ingestion", scenario: "Collect sensor data at the edge.", industryIds: ["manufacturing", "telco"] },
  ],
  relatedComponentIds: ["apache-nifi", "apache-kafka", "apache-flink", "data-flow-2", "cloudera-data-lakehouse"],
};

const cdw = {
  id: "cloudera-data-warehouse",
  name: "Cloudera Data Warehouse",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Data Services 1.5.x",
  parentId: "cloudera-base-datahub",
  tagline: "Autoscaling SQL virtual warehouses on the open lakehouse.",
  overview:
    "Cloudera Data Warehouse (CDW) provides self-service, containerized SQL engines on Kubernetes. Administrators create Database Catalogs (bound to the SDX metastore) and Virtual Warehouses running Impala or Hive, each sized, isolated and able to auto-suspend and autoscale. Analysts connect through Hue, JDBC/ODBC and BI tools, and Cloudera Data Visualization can build dashboards on top. All warehouses query the same governed Iceberg tables.",
  businessValue: "Dedicated compute per team without copying data, paying only for active capacity.",
  capabilities: [
    "Impala and Hive Virtual Warehouses",
    "Database Catalogs over the shared SDX metastore",
    "Auto-suspend and autoscaling",
    "Hue SQL editor and JDBC/ODBC endpoints",
    "Cloudera Data Visualization",
  ],
  highlights: ["Cloudera's ClouderaNow session shows creating insights from all data with CDW."],
  workflow: {
    title: "Self-service SQL",
    stages: [
      ["catalog", "Database Catalog", "Admin binds a catalog to the environment metastore."],
      ["vw", "Create Virtual Warehouse", "Choose Impala or Hive, size and autoscaling.", "apache-impala"],
      ["connect", "Connect", "Analyst opens Hue or a BI tool via JDBC/ODBC."],
      ["auth", "Authorize", "Ranger enforces table, column and row policies.", "apache-ranger"],
      ["query", "Query Iceberg", "Executors scan shared Iceberg tables in object storage.", "apache-iceberg"],
      ["scale", "Scale & suspend", "Executors scale with concurrency and suspend when idle."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["bi", "Hue / BI / JDBC", "SQL clients.", "client"],
        { id: "vws", label: "Virtual Warehouses", kind: "focus", description: "Isolated SQL compute.",
          children: [["impala", "Impala VW", "Interactive BI.", "apache", "apache-impala"], ["hive", "Hive VW", "ETL / complex SQL.", "apache", "apache-hive"]],
          childEdges: [] },
        ["dbc", "Database Catalog", "Metastore binding.", "core"],
        ["viz", "Data Visualization", "Dashboards.", "cloudera"],
        ["sdx", "SDX", "Ranger, Atlas.", "cloudera", "cloudera-sdx"],
        ["obj", "Object storage", "Iceberg tables.", "store", "cloudera-object-store"],
        ["k8s", "Kubernetes", "Autoscaled pods.", "core"],
      ],
      edges: [["bi", "vws"], ["viz", "vws"], ["vws", "dbc"], ["dbc", "sdx", "", { dashed: true }], ["vws", "obj", "scan"], ["vws", "k8s"]],
    },
    dataFlow: {
      nodes: [
        ["ice", "Gold Iceberg tables", "Curated by CDE.", "store", "apache-iceberg"],
        ["vw", "Impala VW", "Query execution.", "apache", "apache-impala"],
        ["cache", "Data cache", "Local caching of remote reads.", "core"],
        ["dash", "Dashboards", "BI consumers.", "client"],
      ],
      edges: [["ice", "cache"], ["cache", "vw"], ["vw", "dash", "results"]],
    },
    deployment: {
      nodes: [
        ["onprem", "Data Services 1.5.x", "CDW on premises.", "cloudera", "on-premises-deployment"],
        ["cloud", "Public cloud", "CDW in AWS/Azure.", "cloud", "cloud-deployment"],
        ["base", "Cloudera Base", "Shared metastore & data.", "cloudera", "cloudera-base-datahub"],
        ["trino", "Trino", "Federated SQL in Cloudera (announced).", "apache", "trino"],
      ],
      edges: [["onprem", "base"], ["cloud", "base", "hybrid", { dashed: true }], ["trino", "base", "federates", { dashed: true }]],
    },
  },
  io: {
    inputs: ["Iceberg/Hive tables", "SQL from BI tools"],
    outputs: ["Query results", "Dashboards", "Materialized tables"],
    dependencies: ["Kubernetes", "SDX metastore", "Object storage"],
    connectors: ["JDBC/ODBC", "Hue", "BI tools"],
    apis: ["SQL", "CDW API/CLI"],
    integrations: ["Apache Impala", "Apache Hive", "Data Visualization", "Trino"],
  },
  ops: {
    security: "SSO/LDAP auth; Ranger fine-grained policies and masking; TLS.",
    governance: "Atlas lineage for SQL; audit of queries.",
    monitoring: "Query profiles, warehouse metrics, observability.",
    scalability: "Executor-group autoscaling and auto-suspend per warehouse.",
  },
  clouderaContext: {
    standalone: "Impala and Hive are Apache SQL engines usable independently.",
    clouderaIntegration: "CDW packages them as autoscaling virtual warehouses under SDX on Data Services and public cloud; Anywhere Cloud adds Trino-powered federated analytics.",
    realWorld: "An insurer gives actuarial, claims and finance teams separate warehouses over one copy of governed policy data.",
  },
  useCases: [
    { title: "Regulatory reporting", scenario: "Governed SQL with masking.", industryIds: ["financial", "insurance"] },
    { title: "Network KPI dashboards", scenario: "Interactive BI over CDRs.", industryIds: ["telco"] },
  ],
  relatedComponentIds: ["apache-impala", "apache-hive", "trino", "cloudera-data-lakehouse", "cloudera-sdx"],
};

const agentStudio = {
  id: "cloudera-agent-studio",
  name: "Cloudera Agent Studio",
  origin: "cloudera",
  category: "cloudera-services",
  edition: "Cloudera AI",
  parentId: "cloudera-ai",
  tagline: "Build governed AI agents and multi-agent workflows on private data.",
  overview:
    "Agent Studio is part of Cloudera AI for designing, testing and deploying AI agents. Builders define agents with roles, tools and an LLM (for example one served privately by Cloudera AI Inference), compose them into workflows, test them, and deploy the workflow as an application or endpoint. Tools such as MCP servers connect agents to enterprise systems — Cloudera demos show an Iceberg MCP agent inspecting lakehouse tables.",
  businessValue: "Turns GenAI pilots into governed, private automations that act on enterprise data.",
  capabilities: [
    "Agent and multi-agent workflow designer",
    "Tool and MCP server integration",
    "Choice of LLM endpoint, including private Cloudera AI Inference",
    "Test runs with step-level traces",
    "Deploy workflows as applications/endpoints in Cloudera AI",
  ],
  highlights: ["Cloudera announced (Dec 2024) autonomous enterprise agent capabilities for AI practitioners with CrewAI."],
  verificationNotes: ["Exact Agent Studio framework internals vary by release — confirm against current Cloudera AI documentation."],
  workflow: {
    title: "Agent build-to-deploy",
    stages: [
      ["goal", "Define the task", "Describe the business task and success criteria."],
      ["agents", "Create agents", "Give each agent a role, instructions and an LLM.", "cloudera-ai"],
      ["tools", "Attach tools", "Connect MCP servers, APIs or SQL tools — e.g. Iceberg table tools.", "apache-iceberg"],
      ["test", "Test with traces", "Run the workflow and inspect every reasoning and tool step."],
      ["deploy", "Deploy", "Publish the workflow as an application or endpoint."],
      ["govern", "Govern & monitor", "Data access stays under SDX policies; runs are logged.", "cloudera-sdx"],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["builder", "Builder UI", "Design agents and workflows.", "client"],
        { id: "wf", label: "Agent workflow", kind: "focus", description: "Agents collaborating on a task.",
          children: [["a1", "Planner agent", "Decomposes the task."], ["a2", "Analyst agent", "Uses data tools."]],
          childEdges: [["a1", "a2", "delegates"]] },
        ["llm", "LLM endpoint", "Private model via AI Inference.", "cloudera", "cloudera-ai"],
        ["tools", "Tools / MCP servers", "Enterprise actions and data access.", "external"],
        ["ice", "Iceberg tables", "Governed data.", "store", "apache-iceberg"],
        ["app", "Deployed app", "Workflow endpoint.", "core"],
      ],
      edges: [["builder", "wf"], ["wf", "llm", "reason"], ["wf", "tools", "call"], ["tools", "ice", "query"], ["wf", "app", "deploy"]],
    },
    dataFlow: {
      nodes: [
        ["user", "Business user", "Asks a question.", "client"],
        ["agent", "Agent", "Plans steps.", "focus"],
        ["mcp", "MCP tool", "Runs governed query.", "external"],
        ["data", "Lakehouse", "Returns rows.", "store", "cloudera-data-lakehouse"],
        ["llm", "Private LLM", "Summarizes.", "cloudera", "cloudera-ai"],
      ],
      edges: [["user", "agent"], ["agent", "mcp"], ["mcp", "data"], ["data", "agent", "results", { dashed: true }], ["agent", "llm"], ["llm", "user", "answer", { dashed: true }]],
    },
    deployment: {
      nodes: [
        ["ai", "Cloudera AI workbench", "Hosts Agent Studio.", "cloudera", "cloudera-ai"],
        ["gpu", "GPU inference", "NVIDIA NIM-backed LLMs.", "vendor", "nvidia"],
        ["ai2", "AI 2.0", "Anywhere Cloud edition.", "cloudera", "ai-2"],
      ],
      edges: [["gpu", "ai"], ["ai", "ai2", "transition"]],
    },
  },
  io: {
    inputs: ["User tasks", "Enterprise data via tools", "Documents"],
    outputs: ["Answers", "Actions", "Generated reports"],
    dependencies: ["Cloudera AI", "LLM endpoint"],
    connectors: ["MCP servers", "REST tools", "SQL"],
    apis: ["Deployed workflow endpoint"],
    integrations: ["Cloudera AI Inference", "Cloudera Data Lakehouse"],
  },
  ops: {
    security: "Runs inside the customer environment; tools access data with governed credentials.",
    governance: "Execution traces for auditability; SDX policies on data.",
    monitoring: "Workflow run logs and traces.",
    scalability: "Scales with Cloudera AI applications and inference replicas.",
  },
  clouderaContext: {
    standalone: "Agent frameworks exist in open source; Agent Studio is Cloudera's governed packaging of agent building.",
    clouderaIntegration: "Part of Cloudera AI; uses private inference and SDX-governed data.",
    realWorld: "A pharma team deploys an agent that answers clinical-ops questions by querying governed trial tables and summarizing with a private LLM.",
  },
  useCases: [
    { title: "Data-ops copilot", scenario: "Agent monitors Iceberg table health.", industryIds: ["financial", "telco"] },
    { title: "Clinical operations assistant", scenario: "Answer questions over trial data.", industryIds: ["pharma"] },
  ],
  relatedComponentIds: ["cloudera-ai", "ai-2", "apache-iceberg", "nvidia", "cloudera-sdx"],
};

export default [cdai, cde, cdl, cdf, cdw, agentStudio, cds2Group, de2, dl2, ai2, df2];
