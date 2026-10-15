// Cloudera platform layer: Base, Manager, Platform runtime, Object Store, SDX,
// Data Lineage, Unified Data Fabric and Anywhere Cloud.

const base = {
  id: "cloudera-base-datahub",
  name: "Cloudera Base / Data Services 1.5.x",
  origin: "cloudera",
  category: "platform",
  tagline: "The established Cloudera platform: Base clusters plus containerized Data Services.",
  overview:
    "The left pillar of the umbrella diagram is the established Cloudera platform. Cloudera Base (Cloudera Runtime 7.x managed by Cloudera Manager) provides storage, engines and SDX on premises; Cloudera Data Services 1.5.x add containerized, self-service Data Engineering, Data Lakehouse/Warehouse, AI and Data Flow on Kubernetes next to it. Cloudera states the existing platform is supported through 2032 with version 7.3.2 and coexists with Anywhere Cloud.",
  businessValue: "A proven, governed data platform customers keep running while they adopt Anywhere Cloud at their own pace.",
  capabilities: ["Cloudera Runtime services (Spark, NiFi, Kafka, Hive, Impala, Ozone, HBase…)", "Cloudera Manager lifecycle management", "SDX security and governance", "Data Services 1.5.x on embedded or OpenShift Kubernetes", "Support through 2032 with 7.3.2 (per Cloudera)"],
  workflow: {
    stages: [
      ["install", "Install Base cluster", "Cloudera Manager deploys Runtime services on hosts.", "cloudera-manager"],
      ["secure", "Secure with SDX", "Kerberos/LDAP, Ranger, Atlas and TLS are enabled.", "cloudera-sdx"],
      ["store", "Store data", "Ozone/HDFS hold tables and files.", "cloudera-object-store"],
      ["services", "Add Data Services", "Kubernetes-based CDE, CDW, AI and CDF attach to the Base Data Lake.", "cloudera-data-engineering"],
      ["run", "Run workloads", "Pipelines, SQL, streaming and AI share governed data."],
      ["evolve", "Evolve to 2.0", "Workloads transition to Anywhere Cloud when ready.", "flow-seamless-transition"],
    ],
  },
  views: {
    internal: {
      nodes: [
        { id: "svcs", label: "Data Services 1.5.x", kind: "cloudera", description: "Containerized services.",
          children: [["ai", "Cloudera AI", "", "cloudera", "cloudera-ai"], ["de", "Data Engineering", "", "cloudera", "cloudera-data-engineering"], ["dl", "Data Lakehouse", "", "cloudera", "cloudera-data-lakehouse"], ["df", "Data Flow", "", "cloudera", "cloudera-data-flow"]],
          childEdges: [] },
        ["engines", "Engines", "Spark, NiFi, Kafka.", "apache", "apache-spark"],
        ["mgr", "Cloudera Manager", "Lifecycle and monitoring.", "cloudera", "cloudera-manager"],
        ["platform", "Cloudera Platform", "Runtime + SDX.", "focus", "cloudera-platform"],
        ["obj", "Object Store", "Ozone / HDFS.", "store", "cloudera-object-store"],
        ["sdx", "SDX", "Security & governance.", "security", "cloudera-sdx"],
      ],
      edges: [["svcs", "engines", "run on"], ["engines", "platform"], ["mgr", "platform", "manages"], ["platform", "obj"], ["platform", "sdx"]],
    },
    dataFlow: {
      nodes: [["nifi", "NiFi", "Ingest.", "apache", "apache-nifi"], ["kafka", "Kafka", "Stream.", "apache", "apache-kafka"], ["obj", "Object Store", "Persist.", "store", "cloudera-object-store"], ["spark", "Spark", "Transform.", "apache", "apache-spark"], ["sql", "Impala/Hive", "Query.", "apache", "apache-impala"], ["ai", "Cloudera AI", "Model.", "cloudera", "cloudera-ai"]],
      edges: [["nifi", "kafka"], ["nifi", "obj"], ["kafka", "spark"], ["spark", "obj"], ["obj", "sql"], ["obj", "ai"]],
    },
    deployment: {
      nodes: [["dc", "Customer data center", "Bare metal / VMs.", "cloudera", "on-premises-deployment"], ["base", "Base cluster", "Runtime hosts.", "focus"], ["k8s", "ECS / OpenShift", "Kubernetes for Data Services.", "core"], ["hw", "Dell / NVIDIA hardware", "Customer-chosen infrastructure.", "vendor", "dell-technologies"]],
      edges: [["dc", "base"], ["dc", "k8s"], ["k8s", "base", "shares Data Lake"], ["hw", "dc", "", { dashed: true }]],
    },
  },
  io: { inputs: ["Enterprise sources"], outputs: ["Governed data products"], dependencies: ["Hosts", "Kubernetes for Data Services"], connectors: ["Runtime connectors"], apis: ["Cloudera Manager API", "Service APIs"], integrations: ["All Cloudera services"] },
  ops: { security: "Kerberos, LDAP, TLS, Ranger, encryption at rest.", governance: "Atlas and Cloudera Data Lineage.", monitoring: "Cloudera Manager and Observability.", scalability: "Add hosts; Data Services autoscale on Kubernetes." },
  clouderaContext: { standalone: "A Cloudera product built from Apache projects.", clouderaIntegration: "The foundation of the Cloudera umbrella and source side of the connector flows to Anywhere Cloud.", realWorld: "A bank's multi-petabyte Base cluster keeps running regulatory batch while new AI workloads start in Anywhere Cloud." },
  useCases: [{ title: "Enterprise data platform", scenario: "Run governed analytics on premises.", industryIds: ["financial", "telco", "healthcare"] }],
  relatedComponentIds: ["cloudera-manager", "cloudera-platform", "cloudera-sdx", "cloudera-object-store", "cloudera-anywhere-cloud", "hybrid-cloud"],
  booth: {
    oneLiner: "The established Cloudera platform: Base clusters plus containerized Data Services.",
    trace: { label: "Services on one platform", nodes: ["svcs", "engines", "platform", "obj"] },
  },
};

const manager = {
  id: "cloudera-manager",
  name: "Cloudera Manager",
  origin: "cloudera",
  category: "platform",
  parentId: "cloudera-base-datahub",
  tagline: "Install, configure, monitor and upgrade Cloudera Base clusters.",
  overview:
    "Cloudera Manager is the administration application for Cloudera Base. A Cloudera Manager Server, backed by a database, communicates with agents on every host to deploy parcels (packaged Runtime software), push configuration, start and stop roles, collect metrics and health checks, and orchestrate rolling restarts and upgrades. Admins use the web UI or REST API.",
  businessValue: "Cuts operational effort and risk for large clusters through automation, health checks and guided upgrades.",
  capabilities: ["Parcel-based software distribution", "Configuration management with versioning", "Health tests, charts and alerts", "Rolling restart and upgrade wizards", "REST API automation"],
  workflow: {
    stages: [
      ["hosts", "Add hosts", "Agents are installed and register with the server."],
      ["parcels", "Distribute parcels", "Runtime parcels are downloaded, distributed and activated."],
      ["services", "Assign roles", "Services and roles are placed on hosts."],
      ["config", "Configure", "Configuration is validated and deployed to agents."],
      ["monitor", "Monitor", "Agents report metrics and health tests; alerts fire."],
      ["upgrade", "Upgrade", "Rolling upgrades with minimal downtime."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["admin", "Admin Console", "Web UI administrators use to manage clusters.", "client"],
        ["api", "Cloudera Manager API", "For custom applications and automation.", "client"],
        { id: "server", label: "Cloudera Manager Server", kind: "focus", description: "Hosts the console, API and application logic; installs, configures, starts and stops services.",
          children: [["config", "Configuration", "Pushes configuration to hosts."], ["lifecycle", "Install & lifecycle", "Installs software; starts and stops services."]],
          childEdges: [] },
        ["db", "Database", "Stores configuration and monitoring information.", "store"],
        ["mgmt", "Management Service", "Roles for monitoring, alerting and reporting.", "core"],
        ["repo", "Cloudera Repository", "Software distributed by Cloudera Manager.", "store"],
        ["agents", "Agents (one per host)", "Start and stop processes, unpack configuration, monitor the host.", "core"],
        ["services", "Cluster services", "Cloudera Runtime services running on the hosts.", "cloudera", "cloudera-platform"],
      ],
      edges: [
        ["admin", "server"],
        ["api", "server"],
        ["server", "db", "state"],
        ["repo", "server", "software", { kind: "optional" }],
        ["server", "agents", "heartbeat", { kind: "bi" }],
        ["agents", "services", "start / stop", { kind: "control" }],
        ["agents", "mgmt", "metrics"],
      ],
    },
    dataFlow: {
      nodes: [["agent", "Agent", "Collects metrics.", "core"], ["mgmt", "Service Monitor", "Stores time series.", "core"], ["health", "Health tests", "Evaluate state.", "core"], ["alerts", "Alerts", "Notify admins.", "client"]],
      edges: [["agent", "mgmt"], ["mgmt", "health"], ["health", "alerts"]],
    },
    deployment: {
      nodes: [["cm", "CM server host", "", "focus"], ["cluster", "Base cluster hosts", "", "cloudera", "cloudera-platform"], ["ds", "Data Services", "Control plane integration.", "cloudera", "cloudera-base-datahub"]],
      edges: [["cm", "cluster", "manages"], ["cm", "ds", "", { dashed: true }]],
    },
  },
  io: { inputs: ["Host inventory", "Configuration"], outputs: ["Running services", "Metrics, alerts"], dependencies: ["Database", "Agents"], connectors: ["SNMP/SMTP alerts"], apis: ["Cloudera Manager REST API"], integrations: ["Cloudera Runtime", "Cloudera Observability"] },
  ops: { security: "Role-based admin access, TLS for agent communication, Kerberos automation.", governance: "Audit of admin actions and configuration history.", monitoring: "Built-in charts and health tests.", scalability: "Manages clusters up to thousands of hosts." },
  clouderaContext: { standalone: "A Cloudera product; not open source.", clouderaIntegration: "The management layer of Cloudera Base, shown below the engines in the diagram.", realWorld: "An admin rolls a security patch across 400 nodes with a rolling restart during business hours." },
  useCases: [{ title: "Zero-downtime upgrades", scenario: "Rolling upgrade of Runtime.", industryIds: ["financial", "telco"] }],
  relatedComponentIds: ["cloudera-base-datahub", "cloudera-platform", "cloudera-sdx"],
  booth: {
    oneLiner: "Install, configure, monitor and upgrade Cloudera clusters from one console.",
    trace: { label: "One heartbeat", nodes: ["admin", "server", "agents", "services"] },
    nodes: {
      server: { micro: "The heart of Cloudera Manager: hosts the Admin Console, the API and the logic that manages the cluster." },
      agents: { micro: "An agent on every host. Agents heartbeat to the server (every 15 seconds by default) and receive the actions to perform.", path: ["Server", "Heartbeat", "Agent", "Process"] },
      mgmt: { micro: "A set of roles that perform monitoring, alerting and reporting." },
      db: { micro: "Holds configuration and monitoring information." },
    },
    officialArchitecture: "https://docs.cloudera.com/cloudera-manager/7.13.2/concepts/topics/cm-architecture.html",
    deploymentModels: ["Cloudera on premises"],
    verificationDate: "2026-10-07",
  },
};

const platform = {
  id: "cloudera-platform",
  name: "Cloudera Platform",
  aka: "Cloudera Runtime",
  origin: "cloudera",
  category: "platform",
  parentId: "cloudera-base-datahub",
  tagline: "The runtime layer that combines storage, engines and SDX.",
  overview:
    "In the diagram, 'Platform' is the foundation box under the engines that contains the Object Store and SDX. It represents Cloudera Runtime — the tested distribution of open-source services — together with shared security and governance. Engines and data services sit on top and share its storage and metadata.",
  businessValue: "One tested, supported distribution rather than assembling and patching many projects separately.",
  capabilities: ["Tested open-source distribution", "Shared storage (Ozone/HDFS)", "Shared metastore and SDX", "Support and security patches from Cloudera"],
  workflow: {
    stages: [["dist", "Distribute Runtime", "Cloudera Manager installs the Runtime parcel.", "cloudera-manager"], ["storage", "Provide storage", "Object Store layer.", "cloudera-object-store"], ["meta", "Shared metadata", "Hive Metastore and Atlas.", "apache-atlas"], ["secure", "Enforce security", "Ranger and Kerberos.", "apache-ranger"], ["engines", "Host engines", "Spark, NiFi, Kafka, SQL engines run on it."]],
  },
  views: {
    internal: {
      nodes: [["engines", "Engines", "Workloads.", "apache"], { id: "rt", label: "Cloudera Runtime", kind: "focus", description: "Platform layer.", children: [["obj", "Object Store", "", "store", "cloudera-object-store"], ["sdx", "SDX", "", "security", "cloudera-sdx"], ["hms", "Metastore", "", "core"]], childEdges: [] }, ["mgr", "Cloudera Manager", "", "cloudera", "cloudera-manager"], ["hosts", "Hosts", "Compute & disks.", "core"]],
      edges: [["engines", "rt"], ["mgr", "rt", "manages"], ["rt", "hosts"]],
    },
    dataFlow: {
      nodes: [["write", "Engine writes", "", "apache"], ["obj", "Object Store", "", "store", "cloudera-object-store"], ["meta", "Metadata", "", "core"], ["read", "Engine reads", "", "apache"]],
      edges: [["write", "obj"], ["write", "meta"], ["meta", "read"], ["obj", "read"]],
    },
    deployment: {
      nodes: [["dc", "On premises", "", "cloudera", "on-premises-deployment"], ["focus", "Runtime cluster", "", "focus"], ["hw", "Infrastructure", "Servers and storage.", "vendor", "dell-technologies"]],
      edges: [["dc", "focus"], ["hw", "focus", "", { dashed: true }]],
    },
  },
  io: { inputs: ["Data from engines"], outputs: ["Persisted, governed data"], dependencies: ["Hosts", "Cloudera Manager"], connectors: ["Hadoop-compatible and S3 APIs"], apis: ["Service APIs"], integrations: ["All engines"] },
  ops: { security: "Kerberos, TLS, Ranger, encryption.", governance: "Atlas.", monitoring: "Cloudera Manager.", scalability: "Horizontal." },
  clouderaContext: { standalone: "Built from Apache projects.", clouderaIntegration: "The base layer of the left pillar.", realWorld: "All engines in a telco cluster share one metastore and policy set." },
  useCases: [{ title: "Shared platform", scenario: "Many teams on one runtime.", industryIds: ["telco", "financial"] }],
  relatedComponentIds: ["cloudera-object-store", "cloudera-sdx", "cloudera-manager", "cloudera-base-datahub"],
};

const objectStore = {
  id: "cloudera-object-store",
  name: "Cloudera Object Store",
  origin: "cloudera",
  category: "platform",
  tagline: "S3-compatible object storage for lakehouse tables, on premises and in the cloud.",
  overview:
    "The Object Store boxes in the diagram are the storage layer under every engine. On premises, Cloudera's object storage is Apache Ozone — a scalable, S3-compatible object store with buckets, volumes and erasure coding, managed in Cloudera Base. In Anywhere Cloud and public cloud, the same role is played by S3-compatible stores (Amazon S3, Azure ADLS, Google Cloud Storage, or certified on-prem stores such as Dell ObjectScale).",
  businessValue: "Separates storage from compute so engines scale independently and data is stored once.",
  capabilities: ["S3-compatible API (Ozone S3 Gateway)", "Hadoop-compatible filesystem access (ofs)", "Erasure coding and replication", "Ranger-governed access and encryption", "Scales to billions of objects"],
  contexts: {
    base: "In the Base pillar this is Ozone/HDFS storage managed by Cloudera Manager.",
    anywhere: "In Anywhere Cloud this is the object storage layer the Iceberg tables live on — cloud stores or certified on-prem object stores.",
    onprem: "In the on-premises deployment footer this is customer-run object storage (Ozone or certified S3-compatible arrays).",
  },
  verificationNotes: ["The diagram label 'Object Store' is generic; product branding (Ozone vs. third-party S3 stores) differs per deployment — confirm for each environment."],
  workflow: {
    stages: [
      ["write", "Engine writes", "Spark or NiFi writes data files via S3 or ofs.", "apache-spark"],
      ["auth", "Authorize", "Ranger checks bucket/volume/key permissions.", "apache-ranger"],
      ["meta", "Metadata service", "Ozone Manager records the key in its namespace."],
      ["blocks", "Store blocks", "Storage Container Manager allocates containers on datanodes."],
      ["replicate", "Protect", "Replication or erasure coding protects data."],
      ["read", "Readers", "Impala, Trino and AI read the same objects.", "apache-impala"],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["clients", "Applications", "Spark, Hive, Impala, NiFi and apps.", "client"],
        ["s3", "S3 API", "Ozone natively supports the S3 API; Hadoop-compatible access too.", "core"],
        ["volume", "Volume", "Like an account; created by administrators for a team.", "data"],
        ["bucket", "Bucket", "Similar to an Amazon S3 bucket.", "data"],
        ["key", "Key (object)", "Unique within a bucket; similar to an S3 object.", "data"],
        { id: "ozone", label: "Apache Ozone storage", kind: "focus", description: "Data is stored as blocks inside storage containers on DataNodes.",
          children: [["om", "Ozone Manager", "Namespace: volumes, buckets, keys."], ["scm", "Storage Container Manager", "Block and container placement."], ["dn", "DataNodes", "Hold the blocks."]],
          childEdges: [] },
        ["ranger", "Ranger", "Authorization and audit.", "security", "apache-ranger"],
      ],
      edges: [
        ["clients", "s3", "read / write"],
        ["s3", "volume"],
        ["volume", "bucket"],
        ["bucket", "key"],
        ["key", "ozone", "blocks"],
        ["ranger", "s3", "authorize", { kind: "control" }],
      ],
    },
    dataFlow: {
      nodes: [["ingest", "Ingest", "NiFi / Kafka connect.", "apache", "apache-nifi"], ["bucket", "Lakehouse bucket", "Iceberg data + metadata.", "focus"], ["engines", "Engines", "Spark, Impala, Trino.", "apache", "trino"], ["archive", "Lifecycle / archive", "Older snapshots expire.", "store"]],
      edges: [["ingest", "bucket"], ["bucket", "engines"], ["bucket", "archive", "", { dashed: true }]],
    },
    deployment: {
      nodes: [["base", "Base: Ozone", "", "cloudera", "cloudera-base-datahub"], ["cloud", "Cloud object stores", "", "store", "s3-storage"], ["dell", "Dell ObjectScale", "", "vendor", "dell-technologies"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"]],
      edges: [["acc", "base", "", { dashed: true }], ["acc", "cloud"], ["acc", "dell", "", { dashed: true }]],
    },
  },
  io: { inputs: ["Objects from engines"], outputs: ["Objects to engines"], dependencies: ["Hosts/disks or cloud provider"], connectors: ["S3 API", "ofs/o3fs"], apis: ["S3 REST", "Ozone shell"], integrations: ["Iceberg", "All engines"] },
  ops: { security: "Kerberos/S3 secrets, Ranger, TLS, transparent encryption.", governance: "Ranger audit of access.", monitoring: "Cloudera Manager metrics.", scalability: "Scale out datanodes; separate metadata scaling." },
  clouderaContext: { standalone: "Apache Ozone is an Apache project.", clouderaIntegration: "Cloudera ships Ozone in Runtime and uses S3-compatible storage across Anywhere Cloud.", realWorld: "A pharma company stores imaging and trial data in Ozone and queries it with Impala and Spark." },
  useCases: [{ title: "On-prem S3 for the lakehouse", scenario: "Cloud-native storage in the data center.", industryIds: ["pharma", "healthcare", "financial"] }],
  relatedComponentIds: ["s3-storage", "dell-technologies", "apache-iceberg", "cloudera-platform"],
  booth: {
    oneLiner: "S3-compatible object storage, powered by Apache Ozone.",
    trace: { label: "Write an object", nodes: ["clients", "s3", "volume", "bucket", "key", "ozone"] },
    nodes: {
      s3: { micro: "Applications talk to Ozone through the S3 API or a Hadoop-compatible file system." },
      key: { micro: "Each key lives in a bucket, much like an S3 object. Its data is stored as blocks on DataNodes.", path: ["Volume", "Bucket", "Key", "Blocks"] },
      ozone: { micro: "Apache Ozone is a scalable, distributed object store that handles both small and large files." },
    },
    officialArchitecture: "https://docs.cloudera.com/cdp-private-cloud-base/7.1.7/ozone-overview/topics/ozone-introduction.html",
    unverified: ["cloudera.com/products/cloudera-object-store.html returned 404 on 2026-10-07"],
    deploymentModels: ["Cloudera on premises"],
    verificationDate: "2026-10-07",
  },
};

const sdx = {
  id: "cloudera-sdx",
  name: "Cloudera SDX",
  aka: "Shared Data Experience",
  origin: "cloudera",
  category: "platform",
  tagline: "Shared security, governance and metadata for every engine and environment.",
  overview:
    "SDX is Cloudera's shared layer of security and governance — the security pillar of the Unified Data Fabric. It combines a shared metastore, Apache Ranger for authorization, masking and auditing, Apache Atlas for metadata, classification and lineage, and identity integration (Kerberos/LDAP/SSO). Policies are defined once and enforced in every engine.",
  businessValue: "One consistent policy model instead of per-engine security, making compliance and audit tractable.",
  capabilities: ["Ranger authorization, row filtering and masking", "Tag-based policies from Atlas classifications", "Centralized audit", "Atlas lineage", "Shared metastore across engines"],
  workflow: {
    stages: [
      ["identity", "Authenticate", "User authenticates through SSO/LDAP/Kerberos."],
      ["request", "Request data", "An engine receives a query or job."],
      ["policy", "Evaluate policy", "The engine's Ranger plugin evaluates resource and tag policies.", "apache-ranger"],
      ["enforce", "Enforce", "Rows are filtered and columns masked."],
      ["audit", "Audit", "Access is recorded centrally."],
      ["lineage", "Capture lineage", "Atlas records how data moved.", "apache-atlas"],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["idp", "Identity", "LDAP, SSO and Kerberos.", "external"],
        ["focus", "Cloudera SDX", "One security and governance layer for every service.", "focus"],
        ["security", "Security · Apache Ranger", "Authorization, row filtering, masking and audit.", "security", "apache-ranger"],
        ["policies", "Governance · Policies", "Defined once, enforced in every engine.", "security", "security-policies-auditing"],
        ["metadata", "Metadata · Apache Atlas", "Classification, search and lineage.", "apache", "apache-atlas"],
        { id: "services", label: "Data services", kind: "cloudera", description: "Every Cloudera service enforces the same policies.",
          children: [["ai", "Cloudera AI", "", "cloudera", "cloudera-ai"], ["de", "Data Engineering", "", "cloudera", "cloudera-data-engineering"], ["dw", "Data Warehouse", "", "cloudera", "cloudera-data-warehouse"], ["df", "Data Flow", "", "cloudera", "cloudera-data-flow"]],
          childEdges: [] },
      ],
      edges: [
        ["idp", "focus", "who"],
        ["focus", "security"],
        ["focus", "policies"],
        ["focus", "metadata"],
        ["security", "services", "enforce", { kind: "control" }],
        ["policies", "services", "", { kind: "control" }],
        ["metadata", "services", "tags + lineage", { kind: "bi" }],
      ],
    },
    dataFlow: {
      nodes: [["user", "Analyst", "", "client"], ["engine", "Engine", "", "apache"], ["ranger", "Ranger", "", "security", "apache-ranger"], ["data", "Data", "", "store"], ["audit", "Audit store", "", "store"]],
      edges: [["user", "engine"], ["engine", "ranger", "check"], ["engine", "data", "filtered"], ["ranger", "audit"]],
    },
    deployment: {
      nodes: [["base", "Base Data Lake", "", "cloudera", "cloudera-base-datahub"], ["cloud", "Cloud Data Lakes", "", "cloud", "cloud-deployment"], ["fabric", "Unified Data Fabric", "", "cloudera", "unified-data-fabric"]],
      edges: [["base", "fabric"], ["cloud", "fabric"]],
    },
  },
  io: { inputs: ["Identities", "Policies", "Engine access events"], outputs: ["Authorization decisions", "Audits", "Lineage"], dependencies: ["Identity provider"], connectors: ["Engine plugins"], apis: ["Ranger REST", "Atlas REST"], integrations: ["All Cloudera engines", "Octopai lineage", "Polaris (Ranger plugin)"] },
  ops: { security: "Central policy model; encryption.", governance: "Classification-driven policies.", monitoring: "Audit dashboards.", scalability: "Plugins cache policies locally." },
  clouderaContext: { standalone: "Ranger and Atlas are Apache projects.", clouderaIntegration: "SDX is Cloudera's integration of them across every service and environment.", realWorld: "A PII tag on a column automatically masks it in Impala, Spark and Trino." },
  useCases: [{ title: "GDPR/HIPAA enforcement", scenario: "Tag-based masking everywhere.", industryIds: ["healthcare", "financial", "insurance"] }],
  relatedComponentIds: ["apache-ranger", "apache-atlas", "unified-data-fabric", "access-control", "security-policies-auditing"],
  booth: {
    oneLiner: "One security and governance layer across every service and environment.",
    trace: { label: "One policy, everywhere", nodes: ["idp", "focus", "security", "services"] },
    nodes: {
      focus: { micro: "Define security and governance once. Every Cloudera service applies it.", path: ["Identity", "Policy", "Every engine"] },
      security: { micro: "Ranger decides who can see which tables, rows and columns, and audits every access." },
      metadata: { micro: "Atlas classifies data and records lineage. A PII tag can drive masking everywhere." },
    },
    officialProductPage: "https://www.cloudera.com/products/sdx.html",
    verificationDate: "2026-10-07",
  },
};

const lineage = {
  id: "cloudera-data-lineage",
  name: "Cloudera Data Lineage",
  aka: "Cloudera Octopai Data Lineage",
  origin: "cloudera",
  category: "platform",
  parentId: "unified-data-fabric",
  tagline: "Automated, cross-platform lineage and catalog (from the Octopai acquisition).",
  overview:
    "Cloudera acquired Octopai (announced Nov 2024) to add automated metadata, lineage and catalog. Cloudera's Data Lineage product page describes it as SaaS with 60+ native integrations and a Custom Lineage Connector, including inferred lineage across BI, ETL and databases. In Nov 2025 Cloudera announced Trino, SDX and Octopai Data Lineage integration with AI-driven classification and quality checks.",
  businessValue: "Answers 'where did this number come from?' across the entire estate — for impact analysis, migrations and audits.",
  capabilities: ["Automated metadata harvesting", "60+ native integrations + Custom Lineage Connector", "Cross-system and column-level lineage", "Inferred lineage", "Data catalog and discovery"],
  workflow: {
    stages: [
      ["connect", "Connect sources", "Connectors are configured for ETL, databases and BI."],
      ["harvest", "Harvest metadata", "Metadata is extracted automatically."],
      ["parse", "Parse & infer", "SQL, mappings and reports are parsed; gaps are inferred."],
      ["graph", "Build lineage graph", "Cross-system graph at table and column level."],
      ["explore", "Explore & analyze", "Users trace lineage, impact and catalog entries."],
      ["govern", "Feed governance", "Classifications and lineage support SDX policies.", "cloudera-sdx"],
    ],
  },
  views: {
    internal: {
      nodes: [["sources", "Sources", "ETL, DBs, BI, Cloudera engines.", "external"], ["connectors", "Connectors", "60+ native + custom.", "core"], ["harvest", "Metadata harvester", "", "core"], ["engine", "Lineage engine", "Parse & infer.", "focus"], ["graph", "Lineage graph & catalog", "", "store"], ["ui", "Lineage UI", "Explore, impact.", "client"], ["atlas", "Atlas / SDX", "", "apache", "apache-atlas"]],
      edges: [["sources", "connectors"], ["connectors", "harvest"], ["harvest", "engine"], ["engine", "graph"], ["graph", "ui"], ["atlas", "graph", "Cloudera metadata", { dashed: true }]],
    },
    dataFlow: {
      nodes: [["src", "Source DB", "", "external"], ["etl", "ETL job", "", "apache", "apache-spark"], ["tbl", "Iceberg table", "", "store", "apache-iceberg"], ["bi", "BI report", "", "client"], ["lin", "Lineage graph", "Captures every hop.", "focus"]],
      edges: [["src", "etl"], ["etl", "tbl"], ["tbl", "bi"], ["src", "lin", "", { dashed: true }], ["etl", "lin", "", { dashed: true }], ["tbl", "lin", "", { dashed: true }], ["bi", "lin", "", { dashed: true }]],
    },
    deployment: {
      nodes: [["saas", "SaaS lineage service", "", "focus"], ["base", "Cloudera Base", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["ext", "Non-Cloudera systems", "", "external"]],
      edges: [["base", "saas", "metadata"], ["acc", "saas", "metadata"], ["ext", "saas", "metadata"]],
    },
  },
  io: { inputs: ["Metadata from connected systems"], outputs: ["Lineage graph", "Catalog", "Impact reports"], dependencies: ["Connector access"], connectors: ["60+ native integrations", "Custom Lineage Connector"], apis: ["Lineage UI"], integrations: ["SDX", "Trino", "Atlas"] },
  ops: { security: "Metadata-only harvesting; access via Cloudera identity.", governance: "Lineage underpins audit and data quality.", monitoring: "Harvest job status.", scalability: "SaaS scale." },
  clouderaContext: { standalone: "Octopai was a standalone lineage vendor before acquisition.", clouderaIntegration: "Now Cloudera Data Lineage, part of the Unified Data Fabric.", realWorld: "Before changing a source column, a bank runs impact analysis and finds 37 affected reports." },
  useCases: [{ title: "Regulatory lineage (BCBS 239)", scenario: "Prove data provenance.", industryIds: ["financial", "insurance"] }],
  relatedComponentIds: ["unified-data-fabric", "data-lineage-concept", "apache-atlas", "cloudera-sdx", "trino"],
  booth: {
    oneLiner: "See where every number came from, across every system (formerly Octopai).",
    trace: { label: "Follow the data", nodes: ["sources", "connectors", "harvest", "engine", "graph", "ui"] },
    nodes: {
      engine: { micro: "Parses SQL, mappings and reports, and infers missing links.", path: ["Source", "Transformation", "Table", "Model", "Dashboard"] },
      graph: { micro: "A cross-system lineage graph down to column level." },
    },
    officialProductPage: "https://www.cloudera.com/products/unified-data-fabric/data-lineage.html",
    verificationDate: "2026-10-07",
  },
};

const fabric = {
  id: "unified-data-fabric",
  name: "Unified Data Fabric",
  origin: "cloudera",
  category: "platform",
  parentId: "cloudera-anywhere-cloud",
  tagline: "Zero-trust governance, federation, lineage and catalog across every environment.",
  overview:
    "Cloudera's Unified Data Fabric unifies access and governance across hybrid estates. Cloudera's product page groups it into Trino-based federation, Data Lineage, a Data Catalog with 60+ connectors, and SDX as the security pillar. The Anywhere Cloud page describes a unified zero-trust data fabric with PII masking and audit lineage.",
  businessValue: "Consistent policies and discovery wherever data lives, without centralizing all data first.",
  capabilities: ["Federated query via Trino", "Data Lineage (Octopai)", "Data Catalog with 60+ connectors", "SDX security: authorization, masking, audit", "Iceberg REST / Polaris catalog interoperability"],
  workflow: {
    stages: [["discover", "Discover", "Catalog finds data across systems."], ["govern", "Govern", "Ranger policies and PII masking apply.", "cloudera-sdx"], ["federate", "Federate", "Trino queries data in place.", "trino"], ["trace", "Trace", "Lineage records every hop.", "cloudera-data-lineage"], ["audit", "Audit", "Unified audit trail.", "security-policies-auditing"]],
  },
  views: {
    internal: {
      nodes: [["catalog", "Data Catalog", "60+ connectors.", "core"], ["lineage", "Data Lineage", "", "cloudera", "cloudera-data-lineage"], ["fed", "Federation (Trino)", "", "apache", "trino"], ["sdx", "SDX security", "", "security", "cloudera-sdx"], ["focus", "Unified Data Fabric", "", "focus"], ["sources", "Data across environments", "", "store"]],
      edges: [["focus", "catalog"], ["focus", "lineage"], ["focus", "fed"], ["focus", "sdx"], ["fed", "sources"], ["sdx", "fed", "policies", { dashed: true }]],
    },
    dataFlow: {
      nodes: [["user", "User / agent", "", "client"], ["fabric", "Fabric policy check", "", "focus"], ["trino", "Trino", "", "apache", "trino"], ["onprem", "On-prem Iceberg", "", "store"], ["cloud", "Cloud warehouse", "", "external"]],
      edges: [["user", "fabric"], ["fabric", "trino"], ["trino", "onprem"], ["trino", "cloud"]],
    },
    deployment: {
      nodes: [["base", "Base", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["public", "Public cloud", "", "cloud", "cloud-deployment"], ["focus", "Fabric", "", "focus"]],
      edges: [["focus", "base"], ["focus", "acc"], ["focus", "public"]],
    },
  },
  io: { inputs: ["Metadata and policies"], outputs: ["Governed, federated access"], dependencies: ["SDX", "Trino", "Lineage"], connectors: ["60+ catalog connectors"], apis: ["SQL", "Iceberg REST"], integrations: ["Polaris", "Octopai"] },
  ops: { security: "Zero-trust, PII masking.", governance: "Lineage and catalog.", monitoring: "Audit lineage.", scalability: "Federated, no central copy." },
  clouderaContext: { standalone: "A Cloudera capability composed of open engines and Cloudera products.", clouderaIntegration: "Shown as the governance core of the Anywhere Cloud pillar.", realWorld: "A healthcare network queries EHR data in two data centers and a cloud with one policy set." },
  useCases: [{ title: "Hybrid governance", scenario: "One policy model everywhere.", industryIds: ["healthcare", "financial"] }],
  relatedComponentIds: ["cloudera-sdx", "cloudera-data-lineage", "trino", "apache-atlas", "apache-ranger", "cloudera-anywhere-cloud"],
  booth: {
    oneLiner: "Governance, federation, lineage and catalog across every environment.",
    trace: { label: "Governed federated query", nodes: ["focus", "sdx", "fed", "sources"] },
    officialProductPage: "https://www.cloudera.com/products/unified-data-fabric.html",
  },
};

const anywhere = {
  id: "cloudera-anywhere-cloud",
  name: "Cloudera Anywhere Cloud",
  origin: "cloudera",
  category: "platform",
  tagline: "Modular hybrid data and AI platform — public, sovereign, private, air-gapped.",
  overview:
    "Announced in August 2026, Cloudera Anywhere Cloud is a modular hybrid data and AI platform with a marketplace of Cloudera Data Services, Cloudera-verified partner services and open-source engines. Cloudera lists zero-copy federated analytics with Iceberg and Trino, Airflow orchestration, vector index engines, Ray/PyTorch/TensorFlow, DuckDB/Polars, a unified zero-trust data fabric with PII masking and audit lineage, an agentic copilot, and deployment to public, sovereign, private and air-gapped environments. It coexists with the existing platform (supported through 2032 with 7.3.2). Its Kubernetes infrastructure layer builds on Cloudera's Taikun acquisition (Aug 2025).",
  businessValue: "Run the same governed data and AI services anywhere data must live, adopting modules incrementally.",
  capabilities: ["Marketplace of services, partner services and engines", "Zero-copy federated analytics (Iceberg + Trino)", "Unified zero-trust data fabric", "Public / sovereign / private / air-gapped", "Agentic copilot", "Coexists with 7.3.2 through 2032"],
  contexts: { fabric: "This node highlights the Anywhere Cloud core that hosts the Unified Data Fabric and governance." },
  workflow: {
    stages: [["provision", "Provision infrastructure", "Kubernetes on any cloud or data center (Taikun-based)."], ["marketplace", "Choose from marketplace", "Select Data Services 2.0, engines, partner services.", "cloudera-data-services-2"], ["connect", "Connect data", "Iceberg tables via Polaris; zero-copy.", "apache-iceberg"], ["govern", "Govern", "Unified Data Fabric applies zero-trust policies.", "unified-data-fabric"], ["run", "Run workloads", "Pipelines, SQL, AI and agents."], ["coexist", "Coexist with Base", "Connector flows link to 7.3.2 estates.", "flow-independent-integrated-data"]],
  },
  views: {
    internal: {
      nodes: [["market", "Marketplace", "Blueprints.", "core"], ["cds2", "Data Services 2.0", "", "cloudera", "cloudera-data-services-2"], { id: "eng", label: "Engines", kind: "apache", description: "Cloudera and partner engines.", children: [["spark4", "Spark 4", "", "apache", "spark-4"], ["trino", "Trino", "", "apache", "trino"], ["partners", "Partner engines", "Illustrative.", "partner", "neo4j"]], childEdges: [] }, ["fabric", "Unified Data Fabric", "", "cloudera", "unified-data-fabric"], ["obj", "Object Store", "", "store", "cloudera-object-store"], ["k8s", "Kubernetes layer", "Taikun-based.", "core"], ["focus", "Anywhere Cloud", "", "focus"]],
      edges: [["focus", "market"], ["market", "cds2"], ["market", "eng"], ["cds2", "eng", "run on"], ["fabric", "eng", "governs", { dashed: true }], ["eng", "obj"], ["k8s", "focus"]],
    },
    dataFlow: {
      nodes: [["base", "Base 7.3.2 data", "", "cloudera", "cloudera-base-datahub"], ["ice", "Iceberg / Polaris", "", "store", "apache-iceberg"], ["engines", "Engines", "", "apache", "spark-4"], ["ai", "AI 2.0", "", "cloudera", "ai-2"], ["apps", "Apps & agents", "", "client"]],
      edges: [["base", "ice", "zero-copy"], ["ice", "engines"], ["engines", "ai"], ["ai", "apps"]],
    },
    deployment: {
      nodes: [["focus", "Anywhere Cloud", "", "focus"], ["aws", "AWS", "", "cloud", "aws"], ["azure", "Azure", "", "cloud", "microsoft-azure"], ["gcp", "Google Cloud", "", "cloud", "google-cloud"], ["sov", "Sovereign / private", "", "cloudera", "on-premises-deployment"], ["air", "Air-gapped", "", "cloudera", "on-premises-deployment"]],
      edges: [["focus", "aws"], ["focus", "azure"], ["focus", "gcp"], ["focus", "sov"], ["focus", "air"]],
    },
  },
  io: { inputs: ["Existing estates", "New sources"], outputs: ["Governed data & AI services anywhere"], dependencies: ["Kubernetes infrastructure"], connectors: ["Iceberg REST/Polaris", "Connector flows"], apis: ["Service APIs"], integrations: ["NVIDIA", "Dell", "Partner engines"] },
  ops: { security: "Zero-trust fabric, PII masking, audit lineage.", governance: "Unified Data Fabric.", monitoring: "Agentic copilot and observability.", scalability: "Modular, per-service scaling." },
  clouderaContext: { standalone: "A Cloudera product.", clouderaIntegration: "The right pillar of the umbrella; coexists with Base via three connector flows.", realWorld: "A government agency runs AI 2.0 air-gapped while analytics run in a sovereign cloud on one fabric." },
  useCases: [{ title: "Sovereign AI", scenario: "Data residency with modern AI.", industryIds: ["financial", "healthcare", "telco"] }],
  relatedComponentIds: ["cloudera-data-services-2", "unified-data-fabric", "spark-4", "trino", "cloudera-base-datahub", "hybrid-cloud"],
  booth: {
    oneLiner: "Modular hybrid data and AI platform: public, sovereign, private, air-gapped.",
    trace: { label: "From marketplace to data", nodes: ["focus", "market", "cds2", "eng", "obj"] },
  },
};

// Source: docs.cloudera.com/hybrid-cloud/latest/overview/topics/hc-how-hybrid-cloud-envs-work.html
const hybrid = {
  id: "hybrid-cloud",
  name: "Hybrid Cloud",
  aka: "Cloudera Hybrid Environments",
  origin: "cloudera",
  category: "platform",
  tagline: "Cloud compute that works on on-premises data in place, under the same governance.",
  overview:
    "Cloudera Hybrid Environments use a compute-only cloud replica model based on in-place data access: workloads submitted to compute services in Cloudera Hybrid Data Hubs access data and metadata directly from an associated Cloudera on-premises cluster. Cloudera names four building blocks: unified authentication (two-way Kerberos cross-realm trust), metadata synchronization (the on-premises cluster is the metadata, authorization and governance context), network connectivity (stable, bi-directional connectivity for in-place reads and writes) and workload portability (a unified Runtime version on both sides).",
  businessValue: "Add cloud compute next to existing on-premises data without copying it and without a second governance model.",
  capabilities: ["Unified authentication", "Metadata synchronization", "Network connectivity", "Workload portability", "Compute-only cloud replica with in-place data access"],
  workflow: {
    title: "Workload portability",
    stages: [
      ["net", "Connect networks", "Stable, bi-directional connectivity between the on-premises cluster and the hybrid cloud environment."],
      ["auth", "Trust identities", "Two-way Kerberos cross-realm trust enables centralized authorization and governance.", "cloudera-sdx"],
      ["meta", "Synchronize metadata", "The on-premises cluster becomes the Hybrid Data Hub's metadata, authorization and governance context."],
      ["runtime", "Same runtime", "A unified Runtime version on both sides keeps workloads portable."],
      ["submit", "Run in cloud compute", "The workload is submitted to compute services in the Hybrid Data Hub."],
      ["inplace", "Read data in place", "The job reads and writes on-premises data directly — no copy.", "on-premises-deployment"],
      ["govern", "Same governance", "On-premises policies and governance apply to the cloud workload.", "cloudera-sdx"],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["cp", "Cloudera control", "Management for cloud environments and Hybrid Data Hubs.", "cloudera"],
        ["onprem", "On-premises cluster", "Holds the data and the metadata, authorization and governance context.", "focus", "on-premises-deployment"],
        ["auth", "Unified authentication", "Two-way Kerberos cross-realm trust between hybrid cloud and on-premises clusters.", "security"],
        ["meta", "Metadata synchronization", "The on-premises cluster is the Hybrid Data Hub's metadata, authorization and governance context.", "security"],
        ["net", "Network connectivity", "Stable, bi-directional connectivity for in-place data reads and writes.", "core"],
        ["port", "Workload portability", "A unified Runtime version on both sides.", "cloudera"],
        ["hdh", "Hybrid Data Hub", "Compute-only cloud replica: workloads run here and access on-premises data in place.", "cloud"],
        ["data", "Data stays where it lives", "On-premises data is read and written in place, not copied.", "store", "cloudera-object-store"],
        ["gov", "Same governance", "Centralized authorization and governance from the on-premises context.", "security", "cloudera-sdx"],
        ["aws", "AWS", "Cloudera public cloud environment.", "cloud", "aws"],
        ["azure", "Microsoft Azure", "Cloudera public cloud environment.", "cloud", "microsoft-azure"],
        ["gcp", "Google Cloud", "Cloudera public cloud environment.", "cloud", "google-cloud"],
      ],
      edges: [
        ["cp", "hdh", "provision", { kind: "control" }],
        ["cp", "aws", "", { kind: "control" }],
        ["cp", "azure", "", { kind: "control" }],
        ["cp", "gcp", "", { kind: "control" }],
        ["onprem", "auth", "", { kind: "bi" }],
        ["auth", "hdh", "", { kind: "bi" }],
        ["onprem", "meta", "", { kind: "bi" }],
        ["meta", "hdh", "", { kind: "bi" }],
        ["onprem", "net", "", { kind: "bi" }],
        ["net", "hdh", "", { kind: "bi" }],
        ["onprem", "port", "same runtime"],
        ["port", "hdh", "workload"],
        ["onprem", "data", "lives here"],
        ["hdh", "data", "read / write in place"],
        ["gov", "data", "governs", { kind: "control" }],
      ],
    },
    dataFlow: {
      nodes: [["job", "Workload", "", "client"], ["hdh", "Hybrid Data Hub compute", "", "cloud"], ["onprem", "On-premises data", "", "store", "on-premises-deployment"], ["result", "Results written in place", "", "data"]],
      edges: [["job", "hdh"], ["hdh", "onprem", "read in place"], ["hdh", "result"], ["result", "onprem", "write in place"]],
    },
    deployment: {
      nodes: [["onprem", "Cloudera on premises", "", "cloudera", "on-premises-deployment"], ["focus", "Hybrid environment", "", "focus"], ["cloud", "Cloudera on cloud", "", "cloud", "cloud-deployment"]],
      edges: [["onprem", "focus", "", { kind: "bi" }], ["focus", "cloud", "", { kind: "bi" }]],
    },
  },
  io: { inputs: ["On-premises data and metadata", "Workloads"], outputs: ["Results written in place"], dependencies: ["Network connectivity", "Kerberos cross-realm trust", "Matching Runtime versions"], connectors: ["In-place data access"], apis: ["Service APIs"], integrations: ["Cloudera on premises", "Cloudera Data Hub"] },
  ops: { security: "Two-way Kerberos cross-realm trust; centralized authorization.", governance: "On-premises cluster is the governance context.", monitoring: "Per-cluster tooling.", scalability: "Cloud compute scales independently of on-premises storage." },
  clouderaContext: { standalone: "A Cloudera capability.", clouderaIntegration: "Links Cloudera on premises with Cloudera Hybrid Data Hubs in the cloud.", realWorld: "A bank runs a peak-season Spark job in cloud compute against data that stays in its data center." },
  useCases: [{ title: "Cloud compute for on-prem data", scenario: "Add capacity without moving data.", industryIds: ["financial", "telco"] }],
  relatedComponentIds: ["on-premises-deployment", "cloud-deployment", "cloudera-sdx", "aws", "microsoft-azure", "google-cloud", "cloudera-anywhere-cloud"],
  booth: {
    oneLiner: "Cloud compute on on-premises data, in place, under the same governance.",
    trace: { label: "Workload portability", nodes: ["onprem", "port", "hdh", "data", "gov"] },
    traceFrom: ["port"],
    nodes: {
      auth: { micro: "A two-way Kerberos cross-realm trust links the hybrid cloud and on-premises clusters. That enables centralized authorization and governance." },
      meta: { micro: "The on-premises cluster acts as the Hybrid Data Hub's metadata, authorization and governance context." },
      net: { micro: "Stable, bi-directional connectivity supports in-place reads and writes for active jobs." },
      port: { micro: "A unified Runtime version on both sides keeps workloads portable by default.", path: ["On premises", "Cloud compute", "Same data", "Same governance"] },
      hdh: { micro: "A compute-only cloud replica. Workloads run here and access on-premises data and metadata directly." },
      data: { micro: "Data stays where it lives. Compute moves closer to it." },
    },
    officialArchitecture: "https://docs.cloudera.com/hybrid-cloud/latest/overview/topics/hc-how-hybrid-cloud-envs-work.html",
    unverified: ["Which cloud providers support Hybrid Data Hubs is not stated in the source doc", "Cloud bursting behaviour per workload type"],
    deploymentModels: ["Cloudera on premises", "Cloudera on cloud"],
    verificationDate: "2026-10-07",
  },
};

export default [base, manager, platform, objectStore, sdx, lineage, fabric, anywhere, hybrid];
