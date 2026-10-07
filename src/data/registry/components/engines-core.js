export const spark = {
  id: "apache-spark",
  name: "Apache Spark",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-base-datahub",
  tagline: "Distributed engine for batch, SQL, streaming and ML workloads.",
  overview:
    "Apache Spark is a unified, in-memory distributed compute engine. A Spark application consists of a driver process that plans work and many executor processes that run it in parallel. Spark exposes DataFrame/SQL, Structured Streaming, MLlib and GraphX APIs over a common execution core, and optimizes queries through the Catalyst optimizer and Tungsten execution engine.",
  businessValue:
    "One engine and one programming model for ETL, analytics, streaming and feature engineering — fewer systems to run, and pipelines that scale from a laptop to thousands of cores.",
  capabilities: [
    "DataFrame / Spark SQL with Catalyst cost-based optimization",
    "Adaptive Query Execution (AQE) re-plans at runtime using shuffle statistics",
    "Structured Streaming with exactly-once sinks via checkpointing",
    "Runs on YARN, Kubernetes or standalone cluster managers",
    "Native readers for Parquet, ORC, Avro, JSON and Apache Iceberg tables",
  ],
  highlights: [
    "Jobs are split into stages at shuffle boundaries; each stage runs as parallel tasks — one per partition.",
    "Lazy evaluation: transformations build a logical plan; only actions trigger execution.",
  ],
  workflow: {
    title: "Spark application lifecycle",
    stages: [
      ["submit", "Application submission", "spark-submit (or a CDE job) launches the driver with its configuration, JARs or Python files."],
      ["driver", "Driver & SparkSession", "The driver creates a SparkSession, builds the logical plan from DataFrame/SQL code and requests executors from the cluster manager."],
      ["catalyst", "Catalyst optimization", "Logical plan → analyzed → optimized (predicate pushdown, column pruning) → physical plan chosen by cost model."],
      ["dag", "DAG scheduling", "On an action, the DAGScheduler splits the plan into stages at every shuffle (wide dependency)."],
      ["tasks", "Task scheduling", "The TaskScheduler sends one task per partition to executors, preferring data-local slots."],
      ["exec", "Executor processing", "Executors run tasks, cache blocks in memory, write shuffle files and report status/metrics to the driver."],
      ["shuffle", "Shuffle exchange", "Downstream stages fetch shuffle blocks; AQE may coalesce partitions or switch join strategy."],
      ["output", "Write output", "Final stage commits results to storage (e.g. an Iceberg table commit) and the driver returns or exits."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Client / spark-submit", "CLI, notebook or CDE job definition that starts the application.", "client"],
        {
          id: "driver", label: "Driver", kind: "focus",
          description: "Owns the SparkSession, plans the job and coordinates executors.",
          children: [
            ["catalyst", "Catalyst optimizer", "Rule- and cost-based planning of DataFrame/SQL queries."],
            ["dagsched", "DAGScheduler", "Builds stages at shuffle boundaries and tracks stage completion."],
            ["tasksched", "TaskScheduler", "Assigns tasks to executor slots with locality preference."],
          ],
          childEdges: [["catalyst", "dagsched"], ["dagsched", "tasksched"]],
        },
        ["cm", "Cluster manager", "YARN (Cloudera Base) or Kubernetes (Cloudera Data Engineering) allocates executor containers/pods."],
        {
          id: "exec", label: "Executors", kind: "core",
          description: "JVM processes that run tasks and hold cached data.",
          children: [
            ["task", "Task threads", "One thread per task; processes one partition."],
            ["bm", "BlockManager", "In-memory / disk cache of DataFrame blocks and shuffle data."],
          ],
          childEdges: [["task", "bm"]],
        },
        ["shuffle", "Shuffle service", "Serves shuffle files so executors can be released (dynamic allocation)."],
        ["storage", "Storage", "HDFS, Ozone, S3/ADLS/GCS; Iceberg tables via catalog.", "store"],
        ["catalog", "Metastore / catalog", "Hive Metastore or Iceberg catalog resolves table metadata.", "store", "apache-hive"],
      ],
      edges: [
        ["client", "driver", "submit"],
        ["driver", "cm", "request executors"],
        ["cm", "exec", "launch"],
        ["driver", "exec", "tasks"],
        ["exec", "shuffle", "shuffle write"],
        ["exec", "storage", "read / write"],
        ["driver", "catalog", "resolve tables", { dashed: true }],
      ],
    },
    dataFlow: {
      nodes: [
        ["src", "Source files / tables", "Parquet, ORC, Iceberg or Kafka topics.", "store"],
        ["scan", "Scan (stage 1)", "Partitions read in parallel with predicate and column pushdown."],
        ["narrow", "Narrow transforms", "filter, select, map — pipelined inside one stage without data movement."],
        ["exchange", "Shuffle exchange", "groupBy/join repartitions rows by key across the network.", "data"],
        ["agg", "Aggregate / join (stage 2)", "Reduce-side work on co-located keys."],
        ["sink", "Sink", "Atomic commit to an Iceberg table or files.", "store", "apache-iceberg"],
      ],
      edges: [["src", "scan"], ["scan", "narrow"], ["narrow", "exchange", "partition by key"], ["exchange", "agg"], ["agg", "sink", "commit"]],
    },
    deployment: {
      nodes: [
        ["yarn", "Spark on YARN", "Cloudera Base clusters run Spark as YARN applications next to HDFS/Ozone.", "core", "cloudera-base-datahub"],
        ["k8s", "Spark on Kubernetes", "Driver and executors run as pods; used by Cloudera Data Engineering virtual clusters.", "core", "cloudera-data-engineering"],
        ["cde", "Cloudera Data Engineering", "Managed Spark service: job API, Airflow orchestration, autoscaling.", "cloudera", "cloudera-data-engineering"],
        ["gpu", "GPU nodes (optional)", "NVIDIA GPUs with the cuDF plug-in accelerate supported SQL/DataFrame operators.", "vendor", "nvidia"],
        ["obj", "Object storage", "Ozone on-prem or S3 / ADLS / GCS in cloud.", "store", "cloudera-object-store"],
      ],
      edges: [["cde", "k8s", "provisions"], ["yarn", "obj"], ["k8s", "obj"], ["gpu", "k8s", "node pool", { dashed: true }]],
    },
  },
  io: {
    inputs: ["Files (Parquet, ORC, Avro, CSV, JSON)", "Iceberg / Hive tables", "Kafka topics", "JDBC sources"],
    outputs: ["Iceberg / Hive tables", "Files", "Kafka topics", "ML models & features"],
    dependencies: ["Cluster manager (YARN or Kubernetes)", "Storage layer", "Metastore / catalog"],
    connectors: ["Iceberg Spark runtime", "Kafka source/sink", "JDBC", "Hive Warehouse Connector (Cloudera)"],
    apis: ["Scala, Java, Python (PySpark), R and SQL", "Spark Connect (thin-client protocol)"],
    integrations: ["Apache Airflow orchestration", "Apache Ranger (via metastore/Iceberg integrations)", "Apache Atlas lineage (Cloudera)"],
  },
  ops: {
    security: "Kerberos authentication on secure clusters; TLS for RPC and UI; encryption of shuffle/spill files can be enabled.",
    governance: "In Cloudera, Spark table access is governed through Ranger policies on the metastore/Iceberg layer and lineage is reported to Atlas.",
    monitoring: "Spark UI and History Server show jobs, stages, tasks, SQL plans and executor metrics; metrics sinks export to Prometheus/JMX.",
    scalability: "Horizontal: add executors. Dynamic allocation grows/shrinks executors with load; AQE handles skew at runtime.",
  },
  clouderaContext: {
    standalone: "Upstream Spark runs anywhere a cluster manager exists — YARN, Kubernetes or Spark standalone — reading any Hadoop-compatible or cloud storage.",
    clouderaIntegration: "Cloudera ships Spark in Cloudera Runtime (Base/Data Hub, on YARN) and as the engine of Cloudera Data Engineering (on Kubernetes) with job management, Airflow, Iceberg support and SDX security/lineage.",
    realWorld: "A nightly CDE pipeline reads raw events landed by NiFi, cleans and joins them with reference tables, writes curated Iceberg tables, and Impala/Trino serve them to BI.",
  },
  useCases: [
    { title: "Batch ETL to Iceberg", scenario: "Transform raw landing-zone files into partitioned, governed Iceberg tables.", industryIds: ["financial", "telco"] },
    { title: "Feature engineering", scenario: "Compute customer features for fraud or churn models at scale.", industryIds: ["financial", "insurance"] },
    { title: "Streaming enrichment", scenario: "Structured Streaming joins Kafka events with dimension tables.", industryIds: ["manufacturing"] },
  ],
  relatedComponentIds: ["spark-4", "cloudera-data-engineering", "apache-iceberg", "apache-airflow", "apache-kafka", "nvidia", "apache-hive"],
};

export const spark4 = {
  id: "spark-4",
  name: "Apache Spark 4.0",
  aka: "Spark 4",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-anywhere-cloud",
  tagline: "The Spark 4.x line shown as a Cloudera engine in Anywhere Cloud.",
  overview:
    "Apache Spark 4.0 (released 2025) is a major release of Spark. Headline upstream changes include ANSI SQL mode on by default, the VARIANT type for semi-structured data, SQL pipe syntax, SQL UDFs and session variables, string collations, a Python Data Source API, and a matured Spark Connect client/server architecture that decouples thin clients from the cluster. It requires Java 17+ and Scala 2.13.",
  businessValue:
    "Stricter SQL semantics reduce silent data errors, VARIANT makes JSON-heavy pipelines faster, and Spark Connect lets apps and notebooks talk to shared Spark clusters without bundling the full runtime.",
  capabilities: [
    "Spark Connect: gRPC-based client/server protocol with thin clients",
    "ANSI SQL mode enabled by default (overflow and cast errors raise instead of returning NULL)",
    "VARIANT data type for efficient semi-structured data",
    "SQL pipe syntax (|>) and SQL user-defined functions",
    "Python Data Source API for custom batch and streaming sources in pure Python",
  ],
  highlights: [
    "Cloudera's diagram lists Spark 4.0 as a Cloudera engine in Cloudera Data Services 2.0.",
    "Cloudera announced NVIDIA cuDF GPU acceleration for Apache Spark 4.1 in Cloudera Data Engineering as part of Anywhere Cloud (Aug 2026).",
  ],
  workflow: {
    title: "Spark Connect request lifecycle",
    stages: [
      ["client", "Thin client builds plan", "A Spark Connect client builds an unresolved logical plan locally — no JVM required on the client."],
      ["grpc", "gRPC request", "The plan is serialized as protobuf and sent to the Spark Connect server endpoint."],
      ["server", "Connect server session", "The server, running inside the driver, maps the request to an isolated SparkSession."],
      ["analyze", "Analyze & optimize", "Catalyst resolves the plan with ANSI semantics and optimizes it."],
      ["execute", "Distributed execution", "Stages and tasks run on executors exactly as in classic Spark."],
      ["stream", "Arrow result stream", "Results stream back to the client as Apache Arrow batches."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["py", "Python / Scala clients", "Thin Spark Connect clients, notebooks, IDEs.", "client"],
        ["connect", "Spark Connect server", "gRPC endpoint inside the driver; manages client sessions.", "focus"],
        ["catalyst", "Catalyst + ANSI mode", "Analyzer and optimizer with ANSI SQL semantics by default."],
        ["variant", "VARIANT & collations", "New type-system features used during planning and execution.", "data"],
        ["sched", "DAG & task schedulers", "Core scheduling of stages and tasks."],
        ["exec", "Executors", "Run tasks; optional GPU acceleration via plug-ins."],
        ["pyds", "Python Data Source API", "Custom sources/sinks implemented in Python.", "data"],
      ],
      edges: [["py", "connect", "gRPC + protobuf"], ["connect", "catalyst"], ["variant", "catalyst", "", { dashed: true }], ["catalyst", "sched"], ["sched", "exec"], ["pyds", "exec", "reads/writes", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["json", "Semi-structured events", "JSON payloads from APIs or Kafka.", "store"],
        ["parse", "parse_json → VARIANT", "Stores parsed JSON in the binary VARIANT encoding."],
        ["query", "Pipe-syntax SQL", "FROM t |> WHERE ... |> AGGREGATE ..."],
        ["ansi", "ANSI checks", "Invalid casts/overflows fail fast rather than writing NULLs."],
        ["ice", "Iceberg table", "Curated output committed atomically.", "store", "apache-iceberg"],
      ],
      edges: [["json", "parse"], ["parse", "query"], ["query", "ansi"], ["ansi", "ice", "commit"]],
    },
    deployment: {
      nodes: [
        ["cac", "Cloudera Anywhere Cloud", "Marketplace-based deployment of Cloudera engines.", "cloudera", "cloudera-anywhere-cloud"],
        ["de2", "Data Engineering 2.0", "Cloudera Data Services 2.0 edition of Data Engineering.", "cloudera", "data-engineering-2"],
        ["k8s", "Kubernetes pods", "Driver, Connect server and executors as pods."],
        ["gpu", "NVIDIA GPU node pool", "cuDF plug-in for supported operators (announced for Spark 4.1).", "vendor", "nvidia"],
        ["ice", "Iceberg on object storage", "Shared tables governed by the Unified Data Fabric.", "store", "apache-iceberg"],
      ],
      edges: [["cac", "de2"], ["de2", "k8s", "runs"], ["gpu", "k8s", "", { dashed: true }], ["k8s", "ice", "read / write"]],
    },
  },
  io: {
    inputs: ["Iceberg tables", "Semi-structured JSON", "Kafka streams", "Python data sources"],
    outputs: ["Iceberg tables", "Arrow result sets to clients", "Streaming sinks"],
    dependencies: ["Java 17+", "Scala 2.13", "Kubernetes or YARN"],
    connectors: ["Spark Connect clients", "Iceberg runtime", "Kafka"],
    apis: ["Spark Connect gRPC API", "DataFrame/SQL", "Python Data Source API"],
    integrations: ["Cloudera Data Engineering 2.0", "Unified Data Fabric governance", "NVIDIA cuDF plug-in"],
  },
  ops: {
    security: "Spark Connect endpoints should be fronted by authentication/TLS; standard Spark security (Kerberos/TLS) still applies to cluster RPC.",
    governance: "In Cloudera, tables are governed through the Unified Data Fabric (Ranger policies, Atlas/Lineage metadata).",
    monitoring: "Spark UI shows Connect sessions alongside jobs/stages; metrics exportable to Prometheus.",
    scalability: "Same executor scale-out model as Spark 3; Connect lets many lightweight clients share a cluster.",
  },
  clouderaContext: {
    standalone: "Spark 4.0 is an upstream Apache release usable on any supported cluster manager.",
    clouderaIntegration: "The umbrella diagram places Spark 4.0 among Cloudera Engines in Cloudera Data Services 2.0 / Anywhere Cloud; Cloudera has announced GPU-accelerated Spark 4.1 for Cloudera Data Engineering. Exact Spark versions per release should be confirmed in Cloudera release notes.",
    realWorld: "Data engineers move jobs from Spark 3 on Data Services 1.5.x to Spark 4 on Data Engineering 2.0, using ANSI mode to catch data-quality issues and VARIANT for event payloads.",
  },
  useCases: [
    { title: "JSON-heavy event pipelines", scenario: "Store clickstream payloads as VARIANT and query without schema rewrites.", industryIds: ["telco"] },
    { title: "Shared notebooks via Spark Connect", scenario: "Many analysts connect thin clients to a governed cluster.", industryIds: ["financial", "pharma"] },
  ],
  verificationNotes: ["Confirm which Spark 4.x minor version ships with each Cloudera Data Services 2.0 release."],
  relatedComponentIds: ["apache-spark", "data-engineering-2", "cloudera-anywhere-cloud", "nvidia", "apache-iceberg"],
};

export const nifi = {
  id: "apache-nifi",
  name: "Apache NiFi",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-flow",
  tagline: "Visual, flow-based data movement with back pressure and full provenance.",
  overview:
    "Apache NiFi automates data movement between systems using a visual flow canvas. Data travels as FlowFiles — a content payload plus key/value attributes — through processors connected by queues. NiFi persists every FlowFile state change in write-ahead repositories, applies back pressure when queues fill, and records a provenance event for every action so any piece of data can be traced and replayed.",
  businessValue:
    "Hundreds of ready-made processors replace bespoke integration code; provenance gives auditors a complete chain of custody from edge to lake.",
  capabilities: [
    "Drag-and-drop flow design with hundreds of processors and controller services",
    "Guaranteed delivery via FlowFile, Content and Provenance repositories",
    "Per-connection back pressure (object count and data size thresholds)",
    "Prioritizers: FIFO, oldest/newest first, attribute-based priority",
    "NiFi 2.x adds Python processors and requires Java 21",
  ],
  highlights: [
    "Default back-pressure thresholds per connection are 10,000 FlowFiles or 1 GB.",
    "Provenance lets operators view, download or replay content at any step.",
  ],
  workflow: {
    title: "FlowFile lifecycle",
    stages: [
      ["create", "FlowFile creation", "A source processor (e.g. ListenHTTP, ConsumeKafka, ListS3) creates FlowFiles: content goes to the Content Repository, attributes to the FlowFile Repository."],
      ["process", "Processor execution", "The scheduler triggers processors by timer or event; each session reads/modifies content and attributes transactionally."],
      ["route", "Routing via relationships", "Processors emit FlowFiles to named relationships (success, failure, matched…) wired to connections."],
      ["queue", "Connection queues", "Each connection is a persistent queue between processors."],
      ["bp", "Back pressure", "When a queue reaches its object/size threshold, the upstream processor stops being scheduled."],
      ["prio", "Prioritization", "Prioritizers decide which queued FlowFile is processed next."],
      ["prov", "Provenance", "Every RECEIVE, CONTENT_MODIFIED, ROUTE, SEND or DROP event is indexed in the Provenance Repository."],
      ["deliver", "Delivery to external systems", "Sink processors (PutIceberg, PublishKafka, PutS3Object…) deliver data and the FlowFile is removed."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["web", "Web UI / REST API", "Design, operate and monitor flows.", "client"],
        {
          id: "fc", label: "Flow Controller", kind: "focus",
          description: "Schedules processors and manages thread pools.",
          children: [
            ["proc", "Processors", "Units of work: get, transform, route, put."],
            ["cs", "Controller services", "Shared resources: SSL contexts, DB pools, record readers/writers."],
            ["pg", "Process groups", "Nested sub-flows with input/output ports."],
          ],
          childEdges: [["cs", "proc", "used by"], ["pg", "proc", "contains"]],
        },
        ["ffr", "FlowFile repository", "Write-ahead log of FlowFile attributes and state.", "store"],
        ["cr", "Content repository", "Immutable, copy-on-write payload storage.", "store"],
        ["pr", "Provenance repository", "Indexed history of every event for lineage and replay.", "store"],
        ["s2s", "Site-to-Site", "Efficient transfer between NiFi instances/clusters."],
        ["coord", "Cluster coordination", "Elects cluster coordinator and primary node (ZooKeeper, or Kubernetes leases in NiFi 2)."],
      ],
      edges: [["web", "fc", "configure"], ["fc", "ffr", "state"], ["fc", "cr", "content"], ["fc", "pr", "events"], ["fc", "s2s"], ["coord", "fc", "", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["src", "ConsumeKafka / ListenHTTP", "Source processors create FlowFiles.", "external"],
        ["q1", "Queue (back pressure 10k / 1 GB)", "Persistent connection queue.", "data"],
        ["route", "RouteOnAttribute", "Splits traffic by attribute rules."],
        ["xform", "JoltTransformRecord / UpdateRecord", "Record-oriented transforms with schema awareness."],
        ["fail", "Failure / retry queue", "Failed FlowFiles retried or routed for inspection.", "data"],
        ["sink", "PutIceberg / PublishKafka", "Delivers to lakehouse tables or topics.", "store", "apache-iceberg"],
      ],
      edges: [["src", "q1", "success"], ["q1", "route"], ["route", "xform", "matched"], ["xform", "sink", "success"], ["xform", "fail", "failure"], ["fail", "xform", "retry", { dashed: true }]],
    },
    deployment: {
      nodes: [
        ["cfm", "Cloudera Flow Management", "NiFi clusters on Cloudera Base managed by Cloudera Manager.", "cloudera", "cloudera-base-datahub"],
        ["cdf", "Cloudera Data Flow service", "Deploys flows as isolated NiFi clusters on Kubernetes with autoscaling.", "cloudera", "cloudera-data-flow"],
        ["k8s", "Kubernetes", "Each flow deployment runs as its own pods."],
        ["edge", "Edge / MiNiFi agents", "Lightweight agents collect data at the edge and send it to NiFi.", "external"],
        ["reg", "Flow catalog / Registry", "Versioned flow definitions for promotion between environments.", "store"],
      ],
      edges: [["reg", "cdf", "deploy version"], ["cdf", "k8s"], ["edge", "cfm", "Site-to-Site"], ["edge", "cdf", "Site-to-Site"], ["reg", "cfm", "", { dashed: true }]],
    },
  },
  io: {
    inputs: ["Files, SFTP, HTTP", "Kafka topics", "Databases (CDC/JDBC)", "Cloud object stores", "IoT / MQTT"],
    outputs: ["Iceberg / Hive tables", "Kafka topics", "Object storage", "Databases, APIs"],
    dependencies: ["Java 21 (NiFi 2.x)", "Local or persistent volumes for repositories", "Coordination (ZooKeeper or Kubernetes)"],
    connectors: ["PutIceberg", "ConsumeKafka / PublishKafka", "ListS3 / PutS3Object", "ExecuteSQL / QueryDatabaseTable"],
    apis: ["NiFi REST API", "Site-to-Site protocol", "Python processor API (NiFi 2)"],
    integrations: ["Apache Kafka", "Apache Ranger authorization for NiFi", "Apache Atlas lineage reporting (Cloudera)"],
  },
  ops: {
    security: "TLS everywhere; user authentication via LDAP, Kerberos, OIDC or certificates; component-level authorization (Ranger in Cloudera).",
    governance: "Provenance repository is the built-in chain of custody; Cloudera can report flow lineage to Atlas.",
    monitoring: "Bulletins, queue status, processor statistics and Prometheus reporting tasks.",
    scalability: "Cluster scale-out with load-balanced connections; Cloudera Data Flow autoscales flow deployments on Kubernetes.",
  },
  clouderaContext: {
    standalone: "NiFi is an Apache project deployable as a single node or cluster anywhere Java runs.",
    clouderaIntegration: "Cloudera packages NiFi as Cloudera Flow Management on Base and as the runtime of the Cloudera Data Flow service, adding ReadyFlows, a flow catalog, Kubernetes deployments and SDX security. Cloudera Data Flow 2.10 added building and deploying NiFi 2 flows.",
    realWorld: "Edge agents send sensor readings to NiFi, which enriches and routes them into Kafka for real-time processing and into Iceberg tables for historical analytics.",
  },
  useCases: [
    { title: "IoT telemetry ingestion", scenario: "Collect plant sensor data, normalize records and land them in Kafka and Iceberg.", industryIds: ["manufacturing"] },
    { title: "Regulated file transfer", scenario: "Move partner files with full provenance for audit.", industryIds: ["financial", "insurance", "healthcare"] },
  ],
  relatedComponentIds: ["cloudera-data-flow", "data-flow-2", "apache-kafka", "apache-flink", "apache-iceberg", "apache-ranger"],
};

export const kafka = {
  id: "apache-kafka",
  name: "Apache Kafka",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-flow",
  tagline: "Distributed, replicated commit log for event streaming.",
  overview:
    "Apache Kafka stores streams of records in topics, split into partitions that are append-only, ordered logs replicated across brokers. Producers append records; consumers read at their own pace by tracking offsets, organized into consumer groups that share partitions. Modern Kafka uses KRaft — a built-in Raft-based controller quorum — for metadata; Kafka 4.0 removed ZooKeeper entirely.",
  businessValue:
    "Decouples producers from consumers so many teams can react to the same events in real time, with durable replay for recovery and new use cases.",
  capabilities: [
    "Partitioned topics with configurable replication factor",
    "Ordering guaranteed within a partition (not across partitions)",
    "Idempotent producers and transactions for exactly-once processing within Kafka",
    "Consumer groups with automatic partition rebalancing",
    "Kafka Connect for source/sink integration; Kafka Streams for stream processing",
  ],
  highlights: [
    "acks=all with min.insync.replicas ensures a committed write survives broker failure.",
    "Committed consumer offsets are stored in the internal __consumer_offsets topic.",
  ],
  workflow: {
    title: "Record lifecycle",
    stages: [
      ["produce", "Producer send", "The producer serializes the record, picks a partition (key hash or sticky partitioner) and batches records."],
      ["leader", "Partition leader append", "The batch is sent to the partition's leader broker and appended to its log segment."],
      ["replicate", "Replication to ISR", "Followers fetch from the leader; the record is committed once all in-sync replicas have it."],
      ["ack", "Acknowledgement", "With acks=all the producer is acknowledged after commit; idempotence de-duplicates retries."],
      ["fetch", "Consumer fetch", "Consumers in a group are each assigned partitions and fetch committed records in offset order."],
      ["commit", "Offset commit", "Consumers commit offsets — at-least-once by default, exactly-once with transactional read-process-write."],
      ["downstream", "Downstream processing", "Flink, Spark, NiFi or Kafka Connect sinks process and land the data."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["prod", "Producers", "Apps, NiFi, CDC connectors.", "client"],
        {
          id: "cluster", label: "Kafka cluster", kind: "focus",
          description: "Brokers hosting partition replicas.",
          children: [
            ["b1", "Broker 1 — leader P0", "Leader replica for partition 0."],
            ["b2", "Broker 2 — follower P0", "In-sync follower replica."],
            ["b3", "Broker 3 — follower P0", "In-sync follower replica."],
          ],
          childEdges: [["b1", "b2", "replicate"], ["b1", "b3", "replicate"]],
        },
        ["kraft", "KRaft controller quorum", "Raft-based metadata quorum: topics, partitions, leader election."],
        ["topic", "Topic → partitions", "Each partition is an ordered, append-only log.", "data"],
        ["cg", "Consumer group", "Members share partitions; each partition is read by one member of the group.", "client"],
        ["offsets", "__consumer_offsets", "Internal topic storing committed offsets.", "store"],
        ["connect", "Kafka Connect", "Source/sink connector framework."],
      ],
      edges: [["prod", "cluster", "produce"], ["kraft", "cluster", "metadata", { dashed: true }], ["cluster", "topic"], ["topic", "cg", "fetch"], ["cg", "offsets", "commit"], ["connect", "cluster", "", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["app", "Payment service", "Produces transactions keyed by account ID.", "client"],
        ["p", "Topic: payments (12 partitions)", "Same key → same partition → ordered per account.", "data"],
        ["fraud", "Group: fraud-scoring", "Flink job scoring each transaction.", "apache", "apache-flink"],
        ["lake", "Group: lake-ingest", "NiFi or Kafka Connect landing to Iceberg.", "apache", "apache-nifi"],
        ["alerts", "Topic: fraud-alerts", "Scored results for downstream actions.", "data"],
        ["ice", "Iceberg table", "Historical analytics.", "store", "apache-iceberg"],
      ],
      edges: [["app", "p", "produce"], ["p", "fraud", "consume"], ["p", "lake", "consume"], ["fraud", "alerts", "produce"], ["lake", "ice", "write"]],
    },
    deployment: {
      nodes: [
        ["csm", "Cloudera Streams Messaging", "Kafka on Cloudera Base managed by Cloudera Manager.", "cloudera", "cloudera-base-datahub"],
        ["smm", "Streams Messaging Manager", "Cloudera UI to monitor topics, producers, consumers and lag.", "cloudera"],
        ["sr", "Schema Registry", "Central schema store used by producers and consumers.", "cloudera"],
        ["srm", "Streams Replication Manager", "Cross-cluster replication built on MirrorMaker 2.", "cloudera"],
        ["k8s", "Kafka as a modular engine", "Anywhere Cloud lists Kafka among deployable Cloudera engines.", "cloudera", "cloudera-anywhere-cloud"],
      ],
      edges: [["csm", "smm", "monitored by"], ["csm", "sr", "", { dashed: true }], ["csm", "srm", "replicate"], ["srm", "k8s", "DR / hybrid"]],
    },
  },
  io: {
    inputs: ["Application events", "CDC change streams", "IoT telemetry", "Logs"],
    outputs: ["Ordered event streams for consumers", "Connect sinks to lake/warehouse"],
    dependencies: ["KRaft controllers (or ZooKeeper on older releases)", "Durable disks per broker"],
    connectors: ["Kafka Connect source/sink connectors", "NiFi Consume/PublishKafka", "Flink Kafka connector", "Spark Kafka source"],
    apis: ["Producer API", "Consumer API", "Admin API", "Streams API", "Connect REST API"],
    integrations: ["Schema Registry", "Apache Ranger topic-level authorization", "Apache Atlas topic lineage (Cloudera)"],
  },
  ops: {
    security: "TLS encryption, SASL authentication (Kerberos/GSSAPI, SCRAM, OAUTHBEARER), ACLs or Ranger policies per topic and consumer group.",
    governance: "Schema Registry enforces compatibility; Atlas captures topics as metadata entities in Cloudera.",
    monitoring: "Consumer lag, under-replicated partitions, request latency — via SMM, JMX or Prometheus.",
    scalability: "Add partitions and brokers; reassign partitions (Cruise Control automates rebalancing in Cloudera).",
  },
  clouderaContext: {
    standalone: "Kafka is an Apache project runnable on any servers or Kubernetes.",
    clouderaIntegration: "Cloudera delivers Kafka as Streams Messaging with SMM, Schema Registry, SRM and Cruise Control, secured by Ranger and catalogued in Atlas; Cloudera's Anywhere Cloud announcement names Kafka among Cloudera engines deployable from marketplace blueprints.",
    realWorld: "Card transactions stream into Kafka; Flink scores fraud in milliseconds while NiFi lands every event into Iceberg for model retraining.",
  },
  useCases: [
    { title: "Real-time fraud", scenario: "Partitioned payment streams feed fraud-scoring consumers.", industryIds: ["financial"] },
    { title: "Network telemetry backbone", scenario: "Probe and CDR events fan out to many consumers.", industryIds: ["telco"] },
  ],
  relatedComponentIds: ["apache-nifi", "apache-flink", "cloudera-data-flow", "apache-spark", "apache-ranger", "apache-atlas"],
};

export const trino = {
  id: "trino",
  name: "Trino",
  aka: "formerly PrestoSQL",
  origin: "open-source",
  category: "engines",
  parentId: "cloudera-anywhere-cloud",
  tagline: "Distributed SQL engine for federated, interactive queries.",
  overview:
    "Trino is an open-source massively parallel SQL query engine governed by the Trino Software Foundation — it is not an Apache Software Foundation project. A coordinator parses, plans and schedules queries; workers execute them in pipelined stages. Trino does not store data: connectors implementing its SPI expose catalogs over Iceberg/Hive lakes, relational databases, Kafka and more, so one SQL statement can join across systems.",
  businessValue:
    "Query data where it lives — lakehouse, databases and object stores — without copying it, giving analysts one SQL entry point.",
  capabilities: [
    "ANSI SQL with cost-based optimizer and dynamic filtering",
    "Connector SPI: Iceberg, Hive, Delta Lake, PostgreSQL, MySQL, Kafka and many more",
    "Pipelined in-memory execution; optional fault-tolerant execution with spooled exchanges",
    "Authentication: password/LDAP, OAuth 2.0, Kerberos, JWT, certificates",
    "Pluggable access control (file-based, OPA, Apache Ranger plugin)",
  ],
  highlights: [
    "Catalogs are configured per data source; a query addresses catalog.schema.table.",
    "Cloudera announced Trino integrated with SDX and Cloudera Octopai Data Lineage for federated, governed access (Nov 2025).",
  ],
  workflow: {
    title: "Query execution lifecycle",
    stages: [
      ["submit", "Query submission", "A client (JDBC, CLI, BI tool) sends SQL over HTTP to the coordinator; the user is authenticated."],
      ["parse", "Parse & analyze", "The coordinator parses SQL and resolves catalogs, schemas and columns through connector metadata APIs."],
      ["authz", "Access control check", "The configured access-control plugin authorizes every catalog/table/column access."],
      ["plan", "Plan & optimize", "The logical plan is optimized (predicate/projection pushdown, join reordering, dynamic filters) and split into fragments."],
      ["schedule", "Stage scheduling", "Fragments become stages; tasks are scheduled on workers and connectors enumerate splits."],
      ["exec", "Worker execution", "Drivers run operator pipelines over splits; data is exchanged between stages over the network."],
      ["sources", "Connector reads", "Connectors read Iceberg/Parquet files, query databases or consume Kafka, pushing down filters where supported."],
      ["result", "Results to client", "The root stage streams results back through the coordinator to the client."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Clients", "JDBC/ODBC, Trino CLI, BI tools, Python.", "client"],
        {
          id: "coord", label: "Coordinator", kind: "focus",
          description: "Parses, plans, schedules and tracks queries.",
          children: [
            ["parser", "Parser & analyzer", "SQL → AST → analyzed statement."],
            ["optimizer", "Planner / optimizer", "Cost-based plan with pushdown and dynamic filtering."],
            ["scheduler", "Scheduler", "Assigns stages and splits to workers."],
          ],
          childEdges: [["parser", "optimizer"], ["optimizer", "scheduler"]],
        },
        {
          id: "workers", label: "Workers", kind: "core",
          description: "Execute tasks of each stage in parallel.",
          children: [
            ["task", "Tasks → drivers", "Each task runs drivers; each driver is an operator pipeline."],
            ["exch", "Exchange", "Shuffles intermediate data between stages."],
          ],
          childEdges: [["task", "exch"]],
        },
        ["spi", "Connector SPI", "Metadata, split, page source/sink interfaces."],
        ["ice", "Iceberg / Hive catalog", "Lakehouse tables on object storage.", "store", "apache-iceberg"],
        ["rdbms", "Relational DBs", "PostgreSQL, MySQL, Oracle… via JDBC-based connectors.", "external"],
        ["kafka", "Kafka", "Topics exposed as tables.", "external", "apache-kafka"],
        ["ac", "Access control", "Ranger plugin, OPA or file-based rules.", "security", "apache-ranger"],
      ],
      edges: [["client", "coord", "SQL / HTTP"], ["coord", "workers", "tasks"], ["coord", "ac", "authorize", { dashed: true }], ["workers", "spi"], ["spi", "ice"], ["spi", "rdbms"], ["spi", "kafka"]],
    },
    dataFlow: {
      nodes: [
        ["sql", "SELECT … JOIN …", "Federated query across lakehouse and CRM DB.", "client"],
        ["s1", "Stage: scan Iceberg", "Reads Parquet splits with partition and min/max pruning."],
        ["s2", "Stage: scan PostgreSQL", "Pushes filters into the source database."],
        ["df", "Dynamic filter", "Build-side keys prune the probe-side scan at runtime.", "data"],
        ["join", "Stage: hash join + aggregate", "Distributed join across workers."],
        ["out", "Result set", "Streamed back to the client.", "client"],
      ],
      edges: [["sql", "s1"], ["sql", "s2"], ["s2", "df", "build keys"], ["df", "s1", "prune", { dashed: true }], ["s1", "join"], ["s2", "join"], ["join", "out"]],
    },
    deployment: {
      nodes: [
        ["cac", "Cloudera Anywhere Cloud", "Trino named as a Cloudera engine deployable from marketplace blueprints.", "cloudera", "cloudera-anywhere-cloud"],
        ["fabric", "Unified Data Fabric", "Trino federates queries across object storage, lakehouse and databases.", "cloudera", "unified-data-fabric"],
        ["k8s", "Kubernetes", "Coordinator and worker pods."],
        ["sdx", "Cloudera SDX", "Shared security/governance applied to Trino access.", "cloudera", "cloudera-sdx"],
        ["sources", "Object stores & databases", "On-prem and cloud sources reached by connectors.", "store"],
      ],
      edges: [["cac", "k8s", "deploys"], ["fabric", "k8s", "", { dashed: true }], ["sdx", "k8s", "policies"], ["k8s", "sources", "connectors"]],
    },
  },
  io: {
    inputs: ["SQL from JDBC/ODBC/HTTP clients"],
    outputs: ["Result sets", "CTAS / INSERT into writable connectors (e.g. Iceberg)"],
    dependencies: ["Catalog configs per source", "Metastore or Iceberg catalog for lake tables", "Java runtime"],
    connectors: ["Iceberg", "Hive", "Delta Lake", "PostgreSQL / MySQL / Oracle", "Kafka", "Elasticsearch"],
    apis: ["Client REST protocol", "JDBC driver", "Connector SPI"],
    integrations: ["Cloudera SDX", "Cloudera Data Lineage (Octopai)", "Apache Ranger (Trino plugin)", "BI tools"],
  },
  ops: {
    security: "TLS to the coordinator; authentication via LDAP/password, OAuth 2.0, Kerberos or JWT; access control via plugins.",
    governance: "In Cloudera, Trino access is governed by SDX and lineage captured by Cloudera Data Lineage, per Cloudera's Nov 2025 announcement.",
    monitoring: "Web UI per query (stages, operators, splits), JMX and OpenMetrics endpoints.",
    scalability: "Add workers for throughput; resource groups isolate workloads; fault-tolerant execution for long ETL queries.",
  },
  clouderaContext: {
    standalone: "Trino is an independent open-source project; anyone can deploy it with any supported connector.",
    clouderaIntegration: "Cloudera lists Trino as a Cloudera engine in Data Services 2.0 / Anywhere Cloud and describes Unified Data Fabric federation and zero-copy Iceberg analytics powered by Trino, governed by SDX.",
    realWorld: "An analyst joins governed Iceberg sales tables with a live PostgreSQL CRM in one query; Ranger masks PII columns and lineage records which sources fed the report.",
  },
  useCases: [
    { title: "Federated customer 360", scenario: "Join lakehouse history with operational databases without copying.", industryIds: ["financial", "telco"] },
    { title: "Zero-copy analytics on Iceberg", scenario: "Interactive SQL over shared Iceberg tables.", industryIds: ["insurance", "manufacturing"] },
  ],
  verificationNotes: ["Confirm Trino version and supported connectors per Cloudera release."],
  relatedComponentIds: ["unified-data-fabric", "apache-iceberg", "cloudera-sdx", "cloudera-data-lineage", "apache-ranger", "data-lakehouse-2"],
};
