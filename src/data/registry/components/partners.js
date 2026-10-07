// Partner engines shown as "Partner Engines (examples)" in the umbrella
// diagram. These are third-party products; Cloudera-specific integration
// depth is marked illustrative unless documented.

const PARTNER_NOTE =
  "The umbrella diagram lists this engine as a partner engine example for Cloudera Anywhere Cloud. Cloudera describes Anywhere Cloud as able to deploy Cloudera-verified partner services and 'any other open source or partner engine of choice'; the specific packaging, versions and certification for this engine should be confirmed with Cloudera.";

const neo4j = {
  id: "neo4j",
  name: "Neo4j",
  origin: "partner",
  category: "partners",
  parentId: "cloudera-anywhere-cloud",
  tagline: "Native graph database queried with Cypher.",
  overview:
    "Neo4j is a graph database from Neo4j, Inc. It stores data as a labeled property graph — nodes, typed relationships and properties — using native graph storage where each relationship record points directly to its neighbors (index-free adjacency), so traversals cost depend on the subgraph touched rather than total data size. Queries are written in Cypher (and Neo4j supports the ISO GQL direction); clients connect over the Bolt protocol.",
  businessValue:
    "Answers relationship-heavy questions — fraud rings, network dependencies, knowledge graphs for AI — that are slow or awkward as multi-way SQL joins.",
  capabilities: [
    "Labeled property graph model with ACID transactions",
    "Cypher query language; pattern matching over paths",
    "Clustering with primary servers (Raft) and read-scaling secondaries",
    "Graph Data Science library: centrality, community detection, similarity, embeddings",
    "Vector indexes for GraphRAG-style retrieval",
  ],
  highlights: [
    "Neo4j Connector for Apache Spark reads/writes graph data from Spark DataFrames.",
    "Neo4j Connector for Kafka streams changes in and out of the graph.",
  ],
  workflow: {
    title: "Cypher query lifecycle",
    stages: [
      ["connect", "Bolt session", "A driver opens a Bolt connection and starts a transaction with the routing table for the cluster."],
      ["parse", "Parse & plan", "Cypher is parsed and the cost-based planner chooses index seeks, expands and joins."],
      ["anchor", "Find anchor nodes", "Index or label scans locate starting nodes (e.g. a suspicious account)."],
      ["expand", "Traverse relationships", "The runtime follows relationship pointers hop by hop (index-free adjacency)."],
      ["filter", "Filter & aggregate", "Path predicates and aggregations are applied."],
      ["commit", "Commit / return", "Writes are committed via the transaction log and replicated; results stream back to the client."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["drivers", "Drivers (Bolt)", "Java, Python, JS, .NET, Go drivers.", "client"],
        { id: "dbms", label: "Neo4j DBMS", kind: "focus", description: "Query engine and native graph store.",
          children: [["planner", "Cypher planner", "Cost-based plan selection."], ["runtime", "Runtime", "Executes the operator tree."], ["pagecache", "Page cache", "Caches graph store pages in memory."]],
          childEdges: [["planner", "runtime"], ["runtime", "pagecache"]] },
        ["store", "Native graph store", "Node, relationship and property record files.", "store"],
        ["txlog", "Transaction log", "Durable log used for recovery and replication.", "store"],
        ["cluster", "Cluster (primaries / secondaries)", "Raft-replicated primaries; async secondaries for read scale."],
        ["gds", "Graph Data Science", "Algorithms on in-memory graph projections."],
      ],
      edges: [["drivers", "dbms", "Bolt"], ["dbms", "store"], ["dbms", "txlog"], ["txlog", "cluster", "replicate"], ["dbms", "gds", "project", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["ice", "Iceberg transactions table", "Governed lakehouse data.", "store", "apache-iceberg"],
        ["spark", "Spark + Neo4j Connector", "Builds nodes/relationships from DataFrames.", "apache", "apache-spark"],
        ["graph", "Account–device–merchant graph", "Entities linked by shared attributes.", "focus"],
        ["algo", "GDS community detection", "Find tightly connected rings."],
        ["out", "Ring scores back to lakehouse", "Results written for BI and models.", "data"],
      ],
      edges: [["ice", "spark", "read"], ["spark", "graph", "write graph"], ["graph", "algo"], ["algo", "out"]],
    },
    deployment: {
      nodes: [
        ["cac", "Cloudera Anywhere Cloud", "Diagram lists Neo4j as a partner engine example.", "cloudera", "cloudera-anywhere-cloud"],
        ["k8s", "Kubernetes deployment", "Neo4j publishes Helm charts for Kubernetes.", "core"],
        ["aura", "Neo4j AuraDB (managed)", "Neo4j's own managed cloud service.", "partner"],
        ["spark", "Spark connector path", "Data exchanged with the lakehouse through Spark.", "apache", "apache-spark"],
        ["fabric", "Unified Data Fabric", "Governance of source data in Cloudera.", "cloudera", "unified-data-fabric"],
      ],
      edges: [["cac", "k8s", "illustrative", { dashed: true }], ["spark", "k8s", "Bolt"], ["fabric", "spark", "governed reads"], ["aura", "spark", "alternative", { dashed: true }]],
    },
  },
  io: {
    inputs: ["Nodes/relationships via Cypher", "Spark DataFrames (connector)", "Kafka events (connector)", "CSV bulk import"],
    outputs: ["Query results", "Graph algorithm results", "Change events"],
    dependencies: ["JVM runtime", "Persistent volumes", "Cluster discovery"],
    connectors: ["Neo4j Connector for Apache Spark", "Neo4j Connector for Kafka", "JDBC driver (BI)"],
    apis: ["Cypher", "Bolt protocol", "HTTP query API"],
    integrations: ["Apache Spark", "Apache Kafka", "LLM frameworks (GraphRAG)"],
  },
  ops: {
    security: "Native users and roles with fine-grained graph privileges; LDAP/SSO integration in Enterprise Edition; TLS for Bolt/HTTP.",
    governance: "Source data stays governed in the lakehouse; graph-side access is controlled by Neo4j's role-based security.",
    monitoring: "Metrics endpoints (Prometheus), query logs, Neo4j Ops Manager.",
    scalability: "Scale reads with secondaries; scale data with multiple databases / sharding features in recent versions.",
  },
  clouderaContext: {
    standalone: "Neo4j is an independent product (Community and Enterprise editions, plus AuraDB cloud).",
    clouderaIntegration: PARTNER_NOTE,
    realWorld: "Illustrative: Spark reads governed transaction tables, the Neo4j Spark connector builds a graph, community detection flags fraud rings, and scores flow back to Iceberg for investigators.",
  },
  useCases: [
    { title: "Fraud ring detection", scenario: "Link accounts, devices and merchants to expose collusion.", industryIds: ["financial", "insurance"] },
    { title: "Network topology & impact", scenario: "Model network elements and dependencies.", industryIds: ["telco"] },
    { title: "Knowledge graph for research", scenario: "Connect compounds, targets and publications.", industryIds: ["pharma", "healthcare"] },
  ],
  illustrative: true,
  verificationNotes: ["Neo4j packaging within Cloudera Anywhere Cloud is not documented in sources reviewed; integration view is illustrative."],
  relatedComponentIds: ["cloudera-anywhere-cloud", "apache-spark", "apache-kafka", "starrocks", "clickhouse"],
};

const starrocks = {
  id: "starrocks",
  name: "StarRocks",
  origin: "partner",
  category: "partners",
  parentId: "cloudera-anywhere-cloud",
  tagline: "MPP analytical database with vectorized execution and lakehouse catalogs.",
  overview:
    "StarRocks is an open-source MPP OLAP database (a Linux Foundation project; CelerData offers a commercial distribution). Frontend (FE) nodes manage metadata and plan queries with a cost-based optimizer; Backend (BE) nodes store data and execute fully vectorized pipelines. In shared-data mode, stateless Compute Nodes (CN) cache data from object storage. External catalogs let StarRocks query Hive, Iceberg, Hudi and Delta Lake tables in place.",
  businessValue: "Sub-second dashboards and high-concurrency customer-facing analytics, either on its own storage or directly on open lakehouse tables.",
  capabilities: [
    "Vectorized, pipelined MPP execution engine",
    "Cost-based optimizer with join reordering and runtime filters",
    "Shared-nothing or shared-data (object storage + local cache) architectures",
    "External catalogs for Iceberg, Hive, Hudi, Delta Lake",
    "Asynchronous materialized views with automatic query rewrite",
  ],
  highlights: ["Real-time ingestion via Stream Load, Routine Load (Kafka) and Flink/Spark connectors; Primary Key tables support upserts."],
  workflow: {
    title: "StarRocks query lifecycle",
    stages: [
      ["connect", "MySQL-protocol connection", "Clients connect to an FE using the MySQL wire protocol."],
      ["parse", "Parse & analyze", "The FE parses SQL and resolves internal or external catalog metadata."],
      ["cbo", "Cost-based optimization", "The optimizer chooses join order/distribution and may rewrite to a materialized view."],
      ["fragments", "Fragment scheduling", "The plan is split into fragments and dispatched to BE/CN nodes."],
      ["exec", "Vectorized pipelines", "BE/CN execute pipelines over column batches, reading local tablets or cached object-store files."],
      ["return", "Merge & return", "The result is merged and returned through the FE."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "MySQL-protocol clients", "BI tools, apps, JDBC.", "client"],
        { id: "fe", label: "Frontend (FE)", kind: "focus", description: "Metadata, planning and coordination.",
          children: [["leader", "FE leader", "Writes metadata; elected among followers."], ["follower", "FE followers / observers", "Replicate metadata; serve reads."], ["cbo", "Cost-based optimizer", "Plans queries, MV rewrite."]],
          childEdges: [["leader", "follower", "replicate"], ["follower", "cbo", "", { dashed: true }]] },
        ["be", "Backend (BE)", "Stores tablets and executes queries (shared-nothing)."],
        ["cn", "Compute Node (CN)", "Stateless compute with local cache (shared-data)."],
        ["obj", "Object storage", "S3-compatible / HDFS for shared-data mode.", "store", "s3-storage"],
        ["ext", "External catalogs", "Iceberg, Hive, Hudi, Delta Lake.", "store", "apache-iceberg"],
      ],
      edges: [["client", "fe", "SQL"], ["fe", "be", "fragments"], ["fe", "cn", "fragments"], ["cn", "obj", "read / cache"], ["be", "ext", "", { dashed: true }], ["cn", "ext", "scan"]],
    },
    dataFlow: {
      nodes: [
        ["kafka", "Kafka topics", "Live events.", "data", "apache-kafka"],
        ["rl", "Routine Load", "Continuous ingestion from Kafka.", "core"],
        ["pk", "Primary Key table", "Upsert-capable native table.", "data"],
        ["ice", "Iceberg (external catalog)", "Historical lakehouse data in place.", "store", "apache-iceberg"],
        ["mv", "Async materialized view", "Pre-joined aggregates for dashboards."],
        ["dash", "Customer-facing dashboard", "High-concurrency queries.", "client"],
      ],
      edges: [["kafka", "rl"], ["rl", "pk"], ["pk", "mv"], ["ice", "mv", "refresh"], ["mv", "dash", "rewrite"]],
    },
    deployment: {
      nodes: [
        ["cac", "Cloudera Anywhere Cloud", "Diagram lists StarRocks as a partner engine example.", "cloudera", "cloudera-anywhere-cloud"],
        ["k8s", "Kubernetes (operator)", "StarRocks Kubernetes operator deploys FE/BE/CN.", "core"],
        ["obj", "Shared-data storage", "Object storage holding table data.", "store", "cloudera-object-store"],
        ["ice", "Iceberg tables", "Read in place via external catalog.", "store", "apache-iceberg"],
        ["fabric", "Unified Data Fabric", "Governs the shared lakehouse tables.", "cloudera", "unified-data-fabric"],
      ],
      edges: [["cac", "k8s", "illustrative", { dashed: true }], ["k8s", "obj"], ["k8s", "ice", "external catalog"], ["fabric", "ice", "governs"]],
    },
  },
  io: {
    inputs: ["Stream Load (HTTP)", "Routine Load (Kafka)", "Broker Load (files)", "Flink/Spark connectors", "External catalogs"],
    outputs: ["Query results", "Materialized views", "INSERT INTO external tables where supported"],
    dependencies: ["FE metadata quorum", "BE storage or object storage + CN cache"],
    connectors: ["Flink connector", "Spark connector", "Kafka Routine Load"],
    apis: ["MySQL protocol / JDBC", "HTTP Stream Load API"],
    integrations: ["Apache Iceberg", "Apache Kafka", "Apache Flink", "Apache Ranger (StarRocks supports Ranger-based authorization)"],
  },
  ops: {
    security: "Users, roles and privileges; LDAP authentication; Apache Ranger integration for access control.",
    governance: "When reading Iceberg via external catalogs, table-level governance can remain in the shared catalog/policy layer.",
    monitoring: "Prometheus metrics, query profiles, audit logs.",
    scalability: "Add BE/CN for compute; FE observers for query concurrency; shared-data mode scales compute independently of storage.",
  },
  clouderaContext: {
    standalone: "StarRocks is an independent open-source project with commercial support from CelerData.",
    clouderaIntegration: PARTNER_NOTE,
    realWorld: "Illustrative: StarRocks reads governed Iceberg tables via an external catalog and serves sub-second, high-concurrency dashboards while Kafka feeds real-time Primary Key tables.",
  },
  useCases: [
    { title: "Customer-facing analytics", scenario: "Thousands of concurrent dashboard queries.", industryIds: ["telco", "financial"] },
    { title: "Real-time operational dashboards", scenario: "Kafka-fed upserts with fresh aggregates.", industryIds: ["manufacturing"] },
  ],
  illustrative: true,
  verificationNotes: ["StarRocks packaging within Cloudera Anywhere Cloud is not documented in sources reviewed; integration view is illustrative."],
  relatedComponentIds: ["cloudera-anywhere-cloud", "apache-iceberg", "apache-kafka", "clickhouse", "neo4j", "trino"],
};

const clickhouse = {
  id: "clickhouse",
  name: "ClickHouse",
  origin: "partner",
  category: "partners",
  parentId: "cloudera-anywhere-cloud",
  tagline: "Column-oriented OLAP database built around the MergeTree engine.",
  overview:
    "ClickHouse is an open-source column-oriented database (ClickHouse, Inc.). Data is written in immutable parts that MergeTree-family engines merge in the background; each part is sorted by the table's ORDER BY key with a sparse primary index over granules (8,192 rows by default), so queries skip most data. Replication uses ReplicatedMergeTree coordinated by ClickHouse Keeper (Raft), and Distributed tables fan queries out across shards. Table functions and engines read S3, Iceberg, Kafka and other systems.",
  businessValue: "Very fast aggregations over billions of rows — observability, telemetry and product analytics — on commodity hardware.",
  capabilities: [
    "MergeTree storage: sorted parts, sparse primary index, background merges",
    "Vectorized query execution over columns",
    "ReplicatedMergeTree with ClickHouse Keeper; Distributed engine for sharding",
    "Incremental materialized views that transform data on insert",
    "Integration engines/table functions: S3, Iceberg, Kafka, HDFS, MySQL, PostgreSQL",
  ],
  highlights: ["Interfaces: HTTP (port 8123) and native TCP (9000); ClickHouse Cloud uses SharedMergeTree with separated storage and compute."],
  workflow: {
    title: "Insert-and-query lifecycle",
    stages: [
      ["insert", "Batch insert", "Rows arrive (HTTP/native protocol or Kafka engine) and are sorted by the ORDER BY key."],
      ["part", "Write a new part", "Each insert writes an immutable part with column files, marks and a sparse primary index."],
      ["replicate", "Replicate", "With ReplicatedMergeTree, the part is registered in Keeper and fetched by replicas."],
      ["mv", "Materialized views fire", "Insert-triggered MVs transform the block into target tables."],
      ["merge", "Background merges", "Parts are merged into larger ones (and deduplicated/aggregated for special engines)."],
      ["query", "Query with index skipping", "Queries use the primary index and skip indexes to read only matching granules, in parallel across cores and shards."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Clients (HTTP / native)", "SQL over HTTP 8123 or TCP 9000.", "client"],
        { id: "server", label: "ClickHouse server", kind: "focus", description: "Parser, analyzer, pipeline executor.",
          children: [["parser", "Parser & analyzer", "SQL → query tree."], ["pipeline", "Vectorized pipeline", "Processes column chunks in parallel."], ["merges", "Merge scheduler", "Background part merges."]],
          childEdges: [["parser", "pipeline"]] },
        ["mt", "MergeTree parts", "Sorted column files with sparse primary index.", "store"],
        ["keeper", "ClickHouse Keeper", "Raft-based coordination for replication and DDL.", "core"],
        ["dist", "Distributed table", "Fans queries out to shards and merges results."],
        ["ext", "S3 / Iceberg / Kafka engines", "Read external data in place.", "external", "apache-iceberg"],
      ],
      edges: [["client", "server", "SQL"], ["server", "mt"], ["mt", "keeper", "replication log", { dashed: true }], ["dist", "server", "per shard"], ["server", "ext", "table functions"]],
    },
    dataFlow: {
      nodes: [
        ["kafka", "Kafka engine table", "Consumes telemetry topics.", "data", "apache-kafka"],
        ["mv", "Materialized view", "Parses and enriches each block on insert."],
        ["events", "events (MergeTree)", "ORDER BY (service, timestamp).", "data"],
        ["agg", "AggregatingMergeTree rollup", "Per-minute aggregates merged in background.", "data"],
        ["ice", "Iceberg archive (read)", "Historical data queried via the Iceberg table function.", "store", "apache-iceberg"],
        ["dash", "Observability dashboard", "Sub-second slicing.", "client"],
      ],
      edges: [["kafka", "mv"], ["mv", "events"], ["events", "agg", "MV"], ["agg", "dash"], ["ice", "dash", "ad hoc", { dashed: true }]],
    },
    deployment: {
      nodes: [
        ["cac", "Cloudera Anywhere Cloud", "Diagram lists ClickHouse as a partner engine example.", "cloudera", "cloudera-anywhere-cloud"],
        ["k8s", "Kubernetes (operator)", "Community operators deploy shards/replicas.", "core"],
        ["keeper", "Keeper ensemble", "Coordination for replicated tables.", "core"],
        ["obj", "Object storage", "S3-compatible disks / tiered storage.", "store", "s3-storage"],
        ["fabric", "Unified Data Fabric", "Governs the shared lakehouse sources.", "cloudera", "unified-data-fabric"],
      ],
      edges: [["cac", "k8s", "illustrative", { dashed: true }], ["k8s", "keeper"], ["k8s", "obj", "tiered storage"], ["fabric", "obj", "governs sources", { dashed: true }]],
    },
  },
  io: {
    inputs: ["INSERT via HTTP/native", "Kafka engine", "S3/Iceberg/HDFS table functions", "Database engines (MySQL/PostgreSQL)"],
    outputs: ["Query results in many formats (Parquet, Arrow, JSON, CSV)", "Materialized aggregates"],
    dependencies: ["ClickHouse Keeper (for replication)", "Local disks or object storage"],
    connectors: ["Kafka engine", "S3 / Iceberg table functions", "JDBC/ODBC drivers"],
    apis: ["SQL over HTTP", "Native TCP protocol", "MySQL/PostgreSQL wire-compatible interfaces"],
    integrations: ["Apache Kafka", "Apache Iceberg", "BI tools (Grafana, Superset)"],
  },
  ops: {
    security: "SQL-driven users, roles, row policies and quotas; LDAP/Kerberos authentication; TLS.",
    governance: "When querying lakehouse data in place, governance of source tables stays in the lakehouse policy layer.",
    monitoring: "system.* tables (query_log, parts, merges), Prometheus endpoint.",
    scalability: "Scale out with shards and replicas; separate storage and compute in ClickHouse Cloud.",
  },
  clouderaContext: {
    standalone: "ClickHouse is an independent open-source database with a managed ClickHouse Cloud offering.",
    clouderaIntegration: PARTNER_NOTE,
    realWorld: "Illustrative: Kafka telemetry lands in ClickHouse for second-level observability while long-term history stays in governed Iceberg tables queried on demand.",
  },
  useCases: [
    { title: "Network & service observability", scenario: "High-ingest telemetry with fast rollups.", industryIds: ["telco"] },
    { title: "Machine telemetry analytics", scenario: "Billions of sensor rows aggregated per minute.", industryIds: ["manufacturing"] },
  ],
  illustrative: true,
  verificationNotes: ["ClickHouse packaging within Cloudera Anywhere Cloud is not documented in sources reviewed; integration view is illustrative."],
  relatedComponentIds: ["cloudera-anywhere-cloud", "apache-kafka", "apache-iceberg", "starrocks", "neo4j"],
};

export default [neo4j, starrocks, clickhouse];
