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
      nodes: [["dc", "Customer data center", "Bare metal / VMs.", "cloudera", "on-premises-deployment"], ["base", "Base cluster", "Runtime hosts.", "focus"], ["k8s", "ECS / OpenShift", "Kubernetes for Data Services.", "core"], ["hw", "Dell / NVIDIA hardware", "Certified infrastructure.", "vendor", "dell-technologies"]],
      edges: [["dc", "base"], ["dc", "k8s"], ["k8s", "base", "shares Data Lake"], ["hw", "dc", "", { dashed: true }]],
    },
  },
  io: { inputs: ["Enterprise sources"], outputs: ["Governed data products"], dependencies: ["Hosts", "Kubernetes for Data Services"], connectors: ["Runtime connectors"], apis: ["Cloudera Manager API", "Service APIs"], integrations: ["All Cloudera services"] },
  ops: { security: "Kerberos, LDAP, TLS, Ranger, encryption at rest.", governance: "Atlas and Cloudera Data Lineage.", monitoring: "Cloudera Manager and Observability.", scalability: "Add hosts; Data Services autoscale on Kubernetes." },
  clouderaContext: { standalone: "A Cloudera product built from Apache projects.", clouderaIntegration: "The foundation of the Cloudera umbrella and source side of the connector flows to Anywhere Cloud.", realWorld: "A bank's multi-petabyte Base cluster keeps running regulatory batch while new AI workloads start in Anywhere Cloud." },
  useCases: [{ title: "Enterprise data platform", scenario: "Run governed analytics on premises.", industryIds: ["financial", "telco", "healthcare"] }],
  relatedComponentIds: ["cloudera-manager", "cloudera-platform", "cloudera-sdx", "cloudera-object-store", "cloudera-anywhere-cloud"],
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
      nodes: [["admin", "Admin UI / API", "", "client"], ["server", "CM Server", "Control plane.", "focus"], ["db", "CM database", "Configuration and state.", "store"], ["mgmt", "Management services", "Metrics, events, alerts.", "core"], { id: "agents", label: "Host agents", kind: "core", description: "One per host.", children: [["h1", "Host 1 roles", ""], ["h2", "Host 2 roles", ""]], childEdges: [] }, ["parcels", "Parcel repository", "Runtime software.", "store"]],
      edges: [["admin", "server"], ["server", "db"], ["server", "agents", "heartbeat"], ["agents", "mgmt", "metrics"], ["parcels", "agents", "distribute", { dashed: true }]],
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
      nodes: [["dc", "On premises", "", "cloudera", "on-premises-deployment"], ["focus", "Runtime cluster", "", "focus"], ["hw", "Certified hardware", "", "vendor", "dell-technologies"]],
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
        ["clients", "S3 / ofs clients", "Engines and apps.", "client"],
        ["s3g", "S3 Gateway", "S3-compatible endpoint.", "core"],
        ["om", "Ozone Manager", "Namespace: volumes, buckets, keys.", "focus"],
        ["scm", "Storage Container Manager", "Block/container placement.", "core"],
        { id: "dn", label: "Datanodes", kind: "store", description: "Store containers.", children: [["dn1", "Datanode 1", ""], ["dn2", "Datanode 2", ""], ["dn3", "Datanode 3", ""]], childEdges: [] },
        ["ranger", "Ranger", "Authorization.", "security", "apache-ranger"],
      ],
      edges: [["clients", "s3g"], ["s3g", "om"], ["clients", "om", "ofs", { dashed: true }], ["om", "scm"], ["scm", "dn"], ["clients", "dn", "data", { dashed: true }], ["ranger", "om", "", { dashed: true }]],
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
      nodes: [["idp", "Identity (LDAP/SSO/Kerberos)", "", "external"], ["ranger", "Apache Ranger", "Policies & audit.", "security", "apache-ranger"], ["atlas", "Apache Atlas", "Metadata & lineage.", "apache", "apache-atlas"], ["hms", "Shared metastore", "Table definitions.", "core"], { id: "plugins", label: "Engine plugins", kind: "core", description: "Enforcement points.", children: [["p1", "Hive/Impala", ""], ["p2", "Spark", ""], ["p3", "Kafka/NiFi", ""]], childEdges: [] }, ["focus", "SDX", "Shared experience.", "focus"]],
      edges: [["idp", "focus"], ["focus", "ranger"], ["focus", "atlas"], ["focus", "hms"], ["ranger", "plugins", "policies"], ["plugins", "ranger", "audits", { dashed: true }], ["atlas", "ranger", "tags", { dashed: true }]],
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
  relatedComponentIds: ["cloudera-data-services-2", "unified-data-fabric", "spark-4", "trino", "cloudera-base-datahub", "flow-seamless-transition"],
};

export default [base, manager, platform, objectStore, sdx, lineage, fabric, anywhere];
