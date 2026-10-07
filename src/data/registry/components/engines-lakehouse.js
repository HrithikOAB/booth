export const iceberg = {
  id: "apache-iceberg",
  name: "Apache Iceberg",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-lakehouse",
  tagline: "Open table format that makes object-store files behave like reliable tables.",
  overview:
    "Apache Iceberg is a table format, not an engine. It tracks a table as a tree of metadata: a catalog points to the current metadata file, which lists snapshots; each snapshot points to a manifest list; manifests list data files with column statistics. Commits atomically swap the catalog pointer, giving ACID semantics, time travel and safe concurrent writers across many engines.",
  businessValue:
    "One copy of data that Spark, Impala, Hive, Flink, Trino and partner engines can all read and write — no lock-in and no copies.",
  capabilities: [
    "ACID commits via optimistic concurrency on the catalog pointer",
    "Hidden partitioning and partition evolution without rewrites",
    "Schema evolution by column ID (add, drop, rename, reorder)",
    "Time travel and rollback to any retained snapshot",
    "Row-level deletes (position/equality deletes; deletion vectors in format v3)",
  ],
  highlights: [
    "Planning uses manifest statistics, so engines skip files without listing directories.",
    "The REST catalog specification lets any engine share one catalog; Apache Polaris implements it, and Cloudera announced Polaris adoption in 2026.",
  ],
  workflow: {
    title: "Iceberg write & read lifecycle",
    stages: [
      ["write", "Engine writes data files", "Spark, Flink, Impala or NiFi write new Parquet/ORC/Avro data files to object storage."],
      ["manifest", "Write manifests", "The writer records new files (with partition values and column stats) in manifest files."],
      ["mlist", "Write manifest list", "A manifest list for the new snapshot references all manifests."],
      ["meta", "Write metadata.json", "A new metadata file records schema, partition spec and the new snapshot."],
      ["commit", "Atomic catalog commit", "The catalog swaps the table pointer if the base version is unchanged; otherwise the writer retries."],
      ["plan", "Reader scan planning", "Readers load current metadata and prune manifests/files using partition and column statistics."],
      ["read", "Read data files", "Only matching files are read; delete files are applied at read time."],
      ["maintain", "Table maintenance", "Compaction, snapshot expiry and orphan-file removal keep tables fast."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["catalog", "Catalog", "Hive Metastore or a REST catalog (e.g. Polaris) — holds the current metadata pointer."],
        ["meta", "metadata.json", "Schema, partition specs, snapshot history, properties.", "focus"],
        ["snap", "Snapshots", "Each commit creates a snapshot pointing to a manifest list.", "data"],
        ["mlist", "Manifest list", "One per snapshot; lists manifests with partition summaries.", "data"],
        ["manifest", "Manifest files", "Track data/delete files with column-level stats.", "data"],
        ["files", "Data & delete files", "Parquet/ORC/Avro on object storage.", "store", "cloudera-object-store"],
      ],
      edges: [["catalog", "meta", "points to"], ["meta", "snap"], ["snap", "mlist"], ["mlist", "manifest"], ["manifest", "files"]],
    },
    dataFlow: {
      nodes: [
        ["nifi", "NiFi PutIceberg", "Streaming appends.", "apache", "apache-nifi"],
        ["spark", "Spark MERGE INTO", "Batch upserts.", "apache", "apache-spark"],
        ["table", "Iceberg table", "Single shared copy.", "focus"],
        ["impala", "Impala / Hive", "BI SQL in Cloudera Data Warehouse.", "apache", "apache-impala"],
        ["trino", "Trino", "Federated SQL.", "apache", "trino"],
        ["partner", "Partner engines", "Engines such as StarRocks that read Iceberg via external catalogs.", "partner", "starrocks"],
      ],
      edges: [["nifi", "table", "append"], ["spark", "table", "merge"], ["table", "impala", "scan"], ["table", "trino", "scan"], ["table", "partner", "scan", { dashed: true }]],
    },
    deployment: {
      nodes: [
        ["hms", "Hive Metastore catalog", "Iceberg catalog in Cloudera Runtime.", "apache", "apache-hive"],
        ["rest", "Iceberg REST catalog", "Cloudera announced Iceberg REST integration (2024) and Apache Polaris adoption (2026).", "cloudera"],
        ["ozone", "Cloudera Object Store", "On-prem storage for Iceberg files.", "store", "cloudera-object-store"],
        ["cloud", "S3 / ADLS / GCS", "Cloud object storage.", "store", "s3-storage"],
        ["ranger", "Ranger policies", "Table/column policies apply to Iceberg tables.", "security", "apache-ranger"],
      ],
      edges: [["hms", "ozone"], ["hms", "cloud"], ["rest", "ozone"], ["rest", "cloud"], ["ranger", "hms", "governs", { dashed: true }]],
    },
  },
  io: {
    inputs: ["Writes from Spark, Flink, Hive, Impala, NiFi, Trino"],
    outputs: ["Consistent snapshots for any compatible reader"],
    dependencies: ["A catalog (HMS, REST, JDBC, Hadoop)", "Object or distributed storage"],
    connectors: ["Spark runtime", "Flink connector", "Trino / Impala / Hive integrations", "NiFi PutIceberg"],
    apis: ["Java & Python (PyIceberg) libraries", "REST Catalog OpenAPI spec", "SQL extensions (MERGE, time travel)"],
    integrations: ["Cloudera Data Lakehouse", "Cloudera Data Warehouse", "Cloudera Data Engineering", "Apache Polaris"],
  },
  ops: {
    security: "Storage-level encryption plus engine/catalog authorization; in Cloudera, Ranger policies govern Iceberg tables.",
    governance: "Snapshot history acts as an audit trail; Atlas and Cloudera Data Lineage capture table lineage.",
    monitoring: "Metadata tables ($snapshots, $files, $manifests) expose table health; a Cloudera demo shows an Agent Studio Iceberg MCP agent monitoring table health.",
    scalability: "Planning cost scales with metadata, not directory listings; compaction controls small files.",
  },
  clouderaContext: {
    standalone: "Iceberg is a vendor-neutral Apache specification and set of libraries used by many engines and clouds.",
    clouderaIntegration: "Iceberg is the foundation of Cloudera's open data lakehouse across Data Warehouse, Data Engineering and Data Flow; Anywhere Cloud highlights zero-copy queries on Iceberg with Polaris catalog interoperability.",
    realWorld: "NiFi streams claims into an Iceberg table, Spark merges corrections nightly, Impala dashboards and Trino federation read the same snapshot — and auditors time-travel to month-end.",
  },
  useCases: [
    { title: "Point-in-time regulatory reporting", scenario: "Time travel to the snapshot used for a filed report.", industryIds: ["financial", "insurance"] },
    { title: "Multi-engine lakehouse", scenario: "Streaming writers and BI readers share one table.", industryIds: ["telco", "manufacturing"] },
  ],
  relatedComponentIds: ["cloudera-data-lakehouse", "data-lakehouse-2", "apache-spark", "trino", "apache-impala", "apache-nifi", "cloudera-object-store"],
};

export const flink = {
  id: "apache-flink",
  name: "Apache Flink",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-flow",
  tagline: "Stateful stream processing with exactly-once state and event-time semantics.",
  overview:
    "Apache Flink executes dataflow programs over unbounded and bounded streams. A JobManager turns the job graph into an execution graph and schedules parallel subtasks into TaskManager slots. Operators keep keyed state in state backends (heap or RocksDB) and Flink takes consistent distributed snapshots — checkpoints — by injecting barriers into the streams, enabling exactly-once state recovery.",
  businessValue:
    "Millisecond decisions on live events — fraud, anomalies, alerts — with correct results even when events arrive late or out of order.",
  capabilities: [
    "Event-time processing with watermarks and windowing",
    "Keyed state with RocksDB backend for very large state",
    "Barrier-based checkpoints and user-triggered savepoints",
    "Exactly-once end-to-end with transactional sinks (e.g. Kafka)",
    "Flink SQL and Table API alongside the DataStream API",
  ],
  highlights: ["Cloudera's streaming analytics offering is built on Flink and includes SQL Stream Builder for SQL over streams."],
  workflow: {
    title: "Flink job lifecycle",
    stages: [
      ["submit", "Job submission", "The client compiles the program or SQL into a JobGraph and submits it to the Dispatcher."],
      ["schedule", "JobMaster scheduling", "A JobMaster builds the ExecutionGraph and requests slots from the ResourceManager."],
      ["deploy", "Deploy subtasks", "Operator subtasks (often chained) are deployed into TaskManager slots."],
      ["process", "Stream processing", "Records flow through operators; keyed state is updated per key."],
      ["watermark", "Watermarks & windows", "Watermarks advance event time and trigger window results."],
      ["checkpoint", "Checkpoint barriers", "Barriers flow with data; each operator snapshots state to durable storage."],
      ["sink", "Transactional sinks", "Sinks commit output when the checkpoint completes (two-phase commit)."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Client / SQL Stream Builder", "Submits jobs or SQL.", "client"],
        {
          id: "jm", label: "JobManager", kind: "focus",
          description: "Coordinates scheduling, checkpoints and recovery.",
          children: [
            ["disp", "Dispatcher", "REST endpoint; starts JobMasters."],
            ["rm", "ResourceManager", "Manages TaskManager slots."],
            ["jmaster", "JobMaster", "One per job; runs the checkpoint coordinator."],
          ],
          childEdges: [["disp", "jmaster"], ["jmaster", "rm", "slots"]],
        },
        ["tm", "TaskManagers", "Worker JVMs with task slots running operator subtasks."],
        ["state", "State backend", "HashMap (heap) or embedded RocksDB.", "store"],
        ["ckpt", "Checkpoint storage", "Durable snapshots on HDFS/Ozone/S3.", "store"],
        ["src", "Sources / sinks", "Kafka, files, Iceberg, JDBC.", "external", "apache-kafka"],
      ],
      edges: [["client", "jm", "JobGraph"], ["jm", "tm", "deploy"], ["tm", "state"], ["state", "ckpt", "snapshot"], ["src", "tm", "records"]],
    },
    dataFlow: {
      nodes: [
        ["kin", "Kafka: transactions", "Event stream keyed by card.", "data", "apache-kafka"],
        ["wm", "Assign watermarks", "Tolerate bounded out-of-order events."],
        ["key", "keyBy(card)", "Partition state by card ID."],
        ["win", "Sliding window features", "Velocity and amount over the last 10 minutes.", "data"],
        ["score", "Scoring operator", "Rules or model inference."],
        ["kout", "Kafka: alerts", "Exactly-once transactional sink.", "data"],
      ],
      edges: [["kin", "wm"], ["wm", "key"], ["key", "win"], ["win", "score"], ["score", "kout", "2PC commit"]],
    },
    deployment: {
      nodes: [
        ["csa", "Cloudera Streaming Analytics", "Flink + SQL Stream Builder on Cloudera.", "cloudera"],
        ["yarn", "Flink on YARN", "Application clusters on Cloudera Base.", "core", "cloudera-base-datahub"],
        ["k8s", "Flink on Kubernetes", "Operator-managed deployments in containerized environments."],
        ["kafka", "Kafka", "Primary source and sink.", "apache", "apache-kafka"],
        ["store", "Checkpoint store", "HDFS / Ozone / S3.", "store", "cloudera-object-store"],
      ],
      edges: [["csa", "yarn"], ["csa", "k8s"], ["kafka", "yarn", "", { dashed: true }], ["yarn", "store"], ["k8s", "store"]],
    },
  },
  io: {
    inputs: ["Kafka topics", "CDC streams", "Files", "Iceberg tables"],
    outputs: ["Kafka topics", "Iceberg tables", "Databases", "Alerts"],
    dependencies: ["Resource provider (YARN/Kubernetes)", "Durable checkpoint storage"],
    connectors: ["Kafka", "Iceberg", "JDBC", "FileSystem"],
    apis: ["DataStream API", "Table API / Flink SQL", "REST API"],
    integrations: ["Cloudera SQL Stream Builder", "Schema Registry", "Atlas lineage (Cloudera)"],
  },
  ops: {
    security: "Kerberos/TLS on secure clusters; Kafka connector uses SASL/TLS; Ranger governs underlying topics/tables in Cloudera.",
    governance: "Atlas can capture Flink job lineage in Cloudera Streaming Analytics.",
    monitoring: "Flink Web UI (backpressure, checkpoints, watermarks) and metrics reporters.",
    scalability: "Rescale from savepoints with different parallelism; RocksDB supports state far larger than memory.",
  },
  clouderaContext: {
    standalone: "Flink is an Apache project deployable on YARN, Kubernetes or standalone.",
    clouderaIntegration: "Cloudera provides Flink as Cloudera Streaming Analytics (with SQL Stream Builder) alongside Kafka and NiFi in its data-in-motion portfolio; the Anywhere Cloud marketplace lists real-time event processing.",
    realWorld: "Flink reads Kafka telemetry, detects anomalies in sliding windows, emits alerts to Kafka and appends aggregates to Iceberg.",
  },
  useCases: [
    { title: "Fraud scoring in motion", scenario: "Score card transactions before authorization completes.", industryIds: ["financial"] },
    { title: "Network anomaly detection", scenario: "Detect faults across streaming probe data.", industryIds: ["telco"] },
  ],
  relatedComponentIds: ["apache-kafka", "apache-nifi", "cloudera-data-flow", "apache-iceberg", "data-flow-2"],
};

export const impala = {
  id: "apache-impala",
  name: "Apache Impala",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-warehouse",
  tagline: "Low-latency MPP SQL engine for BI on the lakehouse.",
  overview:
    "Apache Impala is a massively parallel SQL engine written in C++ that queries Parquet, ORC, Iceberg, Kudu and HBase data in place. Each impalad daemon can plan, coordinate and execute queries; the catalog daemon (catalogd) loads metadata from the Hive Metastore and the statestore broadcasts membership and catalog updates. Runtime code generation via LLVM compiles hot query paths into native code.",
  businessValue: "Interactive BI response times directly on open lakehouse data, without loading into a separate proprietary warehouse.",
  capabilities: [
    "MPP execution with LLVM runtime code generation",
    "Iceberg, Parquet, ORC and Kudu support",
    "Runtime filters and partition pruning",
    "Admission control and resource pools for concurrency",
    "Data caching for remote/object storage reads",
  ],
  highlights: ["Impala originated at Cloudera and is an Apache top-level project; it is a primary engine in Cloudera Data Warehouse."],
  workflow: {
    title: "Impala query lifecycle",
    stages: [
      ["connect", "Client connects", "A BI tool connects via JDBC/ODBC to a coordinator impalad."],
      ["plan", "Plan with cached metadata", "The coordinator uses catalog metadata (from catalogd via statestore) to build a distributed plan."],
      ["admit", "Admission control", "The query is admitted, queued or rejected according to resource-pool limits."],
      ["fragments", "Fragment distribution", "Plan fragments are sent to executor impalads near the data."],
      ["scan", "Scan with codegen", "Executors scan files with LLVM-compiled code, applying runtime filters."],
      ["exchange", "Exchange & aggregate", "Partial results are exchanged, joined and aggregated."],
      ["return", "Return results", "The coordinator streams results to the client."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["bi", "BI / SQL clients", "Hue, Tableau, Power BI via JDBC/ODBC.", "client"],
        ["coord", "Coordinator impalad", "Plans and coordinates queries.", "focus"],
        ["exec", "Executor impalads", "Scan, join and aggregate in parallel."],
        ["catalogd", "catalogd", "Loads and caches metadata from HMS; applies DDL."],
        ["statestore", "statestored", "Publishes membership and catalog topic updates."],
        ["hms", "Hive Metastore", "Table definitions shared with Hive/Spark.", "store", "apache-hive"],
        ["data", "Iceberg / Parquet files", "On Ozone, HDFS or cloud object storage.", "store", "apache-iceberg"],
      ],
      edges: [["bi", "coord", "SQL"], ["coord", "exec", "fragments"], ["exec", "data", "scan"], ["catalogd", "hms", "metadata"], ["catalogd", "statestore", "updates"], ["statestore", "coord", "broadcast", { dashed: true }], ["statestore", "exec", "membership", { dashed: true }]],
    },
    dataFlow: {
      nodes: [
        ["dash", "Dashboard query", "Revenue by region, last 90 days.", "client"],
        ["prune", "Partition pruning", "Only 90 days of partitions are planned."],
        ["rf", "Runtime filter", "Small dimension table builds a filter on region keys.", "data"],
        ["scan", "Parallel scans", "Executors read only matching Parquet row groups."],
        ["agg", "Pre-aggregate → merge", "Two-phase aggregation across executors."],
        ["res", "Result to BI", "Returned to the dashboard.", "client"],
      ],
      edges: [["dash", "prune"], ["prune", "scan"], ["rf", "scan", "filter", { dashed: true }], ["scan", "agg"], ["agg", "res"]],
    },
    deployment: {
      nodes: [
        ["cdw", "Cloudera Data Warehouse", "Impala Virtual Warehouses on Kubernetes with autoscaling.", "cloudera", "cloudera-data-warehouse"],
        ["base", "Impala on Cloudera Base", "Daemons on cluster nodes managed by Cloudera Manager.", "cloudera", "cloudera-base-datahub"],
        ["dl", "Data Lake / SDX", "Shared HMS, Ranger and Atlas.", "cloudera", "cloudera-sdx"],
        ["obj", "Object storage", "Ozone or cloud storage.", "store", "cloudera-object-store"],
        ["cache", "Local data cache", "Executor SSD cache for remote reads.", "store"],
      ],
      edges: [["cdw", "dl", "shares metadata"], ["base", "dl"], ["cdw", "obj"], ["base", "obj"], ["cache", "cdw", "", { dashed: true }]],
    },
  },
  io: {
    inputs: ["SQL from BI and apps"],
    outputs: ["Result sets", "INSERT/CTAS into Iceberg/Parquet tables"],
    dependencies: ["Hive Metastore", "Storage (Ozone/HDFS/S3/ADLS/GCS)"],
    connectors: ["JDBC/ODBC drivers", "HiveServer2 protocol"],
    apis: ["SQL", "impala-shell"],
    integrations: ["Apache Ranger (row filtering, column masking)", "Apache Atlas lineage", "Hue"],
  },
  ops: {
    security: "Kerberos/LDAP authentication, TLS, Ranger authorization including row filters and column masks.",
    governance: "Query lineage published to Atlas in Cloudera.",
    monitoring: "Query profiles, Cloudera Observability, Cloudera Manager metrics.",
    scalability: "Add executors; CDW autoscales executor groups for concurrency.",
  },
  clouderaContext: {
    standalone: "Impala is an Apache project and can be built and run outside Cloudera.",
    clouderaIntegration: "Impala powers Cloudera Data Warehouse Virtual Warehouses and runs on Cloudera Base, sharing the SDX metastore, Ranger policies and Atlas lineage.",
    realWorld: "Hundreds of analysts run dashboards on curated Iceberg tables in an autoscaling Impala Virtual Warehouse.",
  },
  useCases: [
    { title: "Executive dashboards", scenario: "High-concurrency BI on curated lakehouse tables.", industryIds: ["financial", "manufacturing"] },
    { title: "Usage & billing analytics", scenario: "Fast aggregations over CDR data.", industryIds: ["telco"] },
  ],
  relatedComponentIds: ["cloudera-data-warehouse", "apache-hive", "apache-iceberg", "apache-ranger", "cloudera-sdx"],
};

export const hive = {
  id: "apache-hive",
  name: "Apache Hive & Hive Metastore",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-warehouse",
  tagline: "SQL data warehouse engine and the shared metastore catalog.",
  overview:
    "Apache Hive provides SQL over large datasets. HiveServer2 accepts JDBC/ODBC sessions, the compiler uses Apache Calcite for cost-based optimization, and queries execute as Apache Tez DAGs — optionally accelerated by LLAP's persistent, caching daemons. The Hive Metastore (HMS) stores table schemas and locations and is the catalog shared by Hive, Impala, Spark and Iceberg in Cloudera.",
  businessValue: "Mature, governed SQL for heavy ETL and reporting, plus one catalog that every engine agrees on.",
  capabilities: [
    "HiveServer2 multi-session JDBC/ODBC endpoint",
    "Calcite-based cost-based optimizer",
    "Execution on Apache Tez; LLAP for low-latency caching",
    "ACID transactional ORC tables with compaction",
    "Hive Metastore shared catalog (also usable as an Iceberg catalog)",
  ],
  highlights: ["The Hive Metastore is part of the SDX data context shared across Cloudera services."],
  workflow: {
    title: "Hive query lifecycle",
    stages: [
      ["session", "Session open", "A client opens a JDBC session with HiveServer2 and is authenticated."],
      ["compile", "Compile", "Parser → semantic analysis with HMS metadata → Calcite CBO → physical plan."],
      ["authz", "Authorize", "The Ranger Hive plugin checks database/table/column privileges."],
      ["dag", "Build Tez DAG", "The plan becomes a Tez DAG of vertices."],
      ["exec", "Execute (Tez / LLAP)", "Vertices run in containers or LLAP daemons with an in-memory cache."],
      ["commit", "Commit", "Results are written with an ACID or Iceberg commit; HMS is updated."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Beeline / JDBC / ODBC", "SQL clients.", "client"],
        {
          id: "hs2", label: "HiveServer2", kind: "focus", description: "Sessions, compilation and execution management.",
          children: [["parser", "Parser & semantic analyzer", "Validates SQL against metastore metadata."], ["calcite", "Calcite CBO", "Join ordering and predicate pushdown."], ["planner", "Physical planner", "Generates the Tez DAG."]],
          childEdges: [["parser", "calcite"], ["calcite", "planner"]],
        },
        ["hms", "Hive Metastore", "Schemas, partitions, locations; backed by an RDBMS.", "store"],
        ["tez", "Tez AM & containers", "DAG execution on YARN or Kubernetes."],
        ["llap", "LLAP daemons", "Persistent executors with columnar cache."],
        ["ranger", "Ranger Hive plugin", "Authorization, masking, row filters.", "security", "apache-ranger"],
        ["files", "ORC / Parquet / Iceberg files", "Warehouse storage.", "store", "cloudera-object-store"],
      ],
      edges: [["client", "hs2"], ["hs2", "hms", "metadata"], ["hs2", "ranger", "authorize", { dashed: true }], ["hs2", "tez"], ["tez", "llap", "", { dashed: true }], ["tez", "files"], ["llap", "files"]],
    },
    dataFlow: {
      nodes: [
        ["raw", "Raw staged tables", "Landing zone.", "store"],
        ["etl", "INSERT OVERWRITE … SELECT", "Heavy ETL in Tez."],
        ["acid", "ACID / Iceberg table", "Transactional target.", "data"],
        ["compact", "Compaction", "Merges delta files in the background."],
        ["hms", "HMS update", "New partitions & stats registered.", "store"],
        ["consumers", "Impala / Spark / Trino", "Read via the same metastore.", "apache", "apache-impala"],
      ],
      edges: [["raw", "etl"], ["etl", "acid"], ["acid", "compact", "", { dashed: true }], ["etl", "hms"], ["hms", "consumers"]],
    },
    deployment: {
      nodes: [
        ["cdw", "CDW Hive Virtual Warehouse", "Containerized HS2 + LLAP with autoscaling.", "cloudera", "cloudera-data-warehouse"],
        ["base", "Hive on Cloudera Base", "HS2 and Tez on YARN, managed by Cloudera Manager.", "cloudera", "cloudera-base-datahub"],
        ["dl", "SDX Data Lake HMS", "Shared metastore per environment.", "cloudera", "cloudera-sdx"],
        ["db", "Metastore RDBMS", "PostgreSQL/MySQL/Oracle backing store.", "store"],
        ["obj", "Warehouse storage", "Ozone or cloud object store.", "store", "cloudera-object-store"],
      ],
      edges: [["cdw", "dl"], ["base", "dl"], ["dl", "db"], ["cdw", "obj"], ["base", "obj"]],
    },
  },
  io: {
    inputs: ["SQL (HiveQL)", "Files in warehouse storage"],
    outputs: ["Tables", "Result sets", "Metadata for all engines"],
    dependencies: ["Tez", "Metastore RDBMS", "YARN or Kubernetes"],
    connectors: ["JDBC/ODBC", "Hive Warehouse Connector for Spark", "Iceberg storage handler"],
    apis: ["HiveQL", "HMS Thrift API"],
    integrations: ["Ranger", "Atlas Hive hook (lineage)", "Impala, Spark, Trino (via HMS)"],
  },
  ops: {
    security: "Kerberos/LDAP; TLS; Ranger authorization with masking and row filtering.",
    governance: "The Atlas Hive hook emits table and column lineage on DDL/DML.",
    monitoring: "HS2 web UI, Tez UI, Cloudera Observability.",
    scalability: "Tez scales with containers; LLAP and CDW autoscaling for concurrency.",
  },
  clouderaContext: {
    standalone: "Hive and HMS are Apache projects; HMS is widely used as a generic catalog.",
    clouderaIntegration: "Cloudera runs Hive in Cloudera Base and Cloudera Data Warehouse; the HMS in each SDX Data Lake is the shared catalog for Hive, Impala, Spark and Iceberg.",
    realWorld: "Overnight Hive ETL builds conformed fact tables; morning dashboards query them via Impala using the same metastore.",
  },
  useCases: [
    { title: "Enterprise ETL", scenario: "Large SQL transformations with ACID guarantees.", industryIds: ["insurance", "financial"] },
    { title: "Shared catalog", scenario: "One table definition used by every engine.", industryIds: ["pharma"] },
  ],
  relatedComponentIds: ["apache-impala", "cloudera-data-warehouse", "apache-iceberg", "apache-atlas", "apache-ranger", "cloudera-sdx"],
};

export const airflow = {
  id: "apache-airflow",
  name: "Apache Airflow",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-data-engineering",
  tagline: "Python-defined workflow orchestration and scheduling.",
  overview:
    "Apache Airflow orchestrates pipelines defined as DAGs (directed acyclic graphs) in Python. The scheduler creates DAG runs on schedules or triggers and queues task instances; an executor (Local, Celery, Kubernetes) runs them on workers. All state lives in a metadata database and is visible through the web UI and API. Deferrable operators hand long waits to a lightweight triggerer.",
  businessValue: "Reliable, observable pipelines with dependencies, retries and SLAs defined as code — reviewed and versioned like software.",
  capabilities: [
    "DAGs as Python code with operators, sensors and the TaskFlow API",
    "Schedules, data-aware triggers and backfills",
    "Retries, timeouts and alerting",
    "Pluggable executors including Kubernetes",
    "Large provider ecosystem (cloud, databases, Spark)",
  ],
  highlights: ["Cloudera Data Engineering embeds Airflow; the Anywhere Cloud marketplace lists orchestration powered by Apache Airflow."],
  workflow: {
    title: "DAG run lifecycle",
    stages: [
      ["author", "Author DAG", "An engineer writes a Python DAG defining tasks and dependencies."],
      ["parse", "DAG parsing", "The DAG processor parses files and serializes DAGs to the metadata DB."],
      ["schedule", "Schedule DAG run", "The scheduler creates a DAG run when its schedule or trigger fires."],
      ["queue", "Queue task instances", "Tasks whose upstreams succeeded are queued to the executor."],
      ["run", "Execute on workers", "Workers or pods run tasks — e.g. an operator that runs a CDE Spark job."],
      ["state", "Record state", "Task states, logs and XComs are stored; failures retry per policy."],
      ["observe", "Observe", "The UI/API show grid and graph views, logs and durations."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["dags", "DAG files", "Python definitions in a repo or bundle.", "data"],
        ["proc", "DAG processor", "Parses and serializes DAGs."],
        ["sched", "Scheduler", "Creates runs and queues tasks.", "focus"],
        ["exec", "Executor", "Local, Celery or Kubernetes executor."],
        ["workers", "Workers / pods", "Run task code."],
        ["trig", "Triggerer", "Async waits for deferrable operators."],
        ["db", "Metadata DB", "State of DAGs, runs and tasks.", "store"],
        ["ui", "Web UI / REST API", "Monitor and operate.", "client"],
      ],
      edges: [["dags", "proc"], ["proc", "db"], ["sched", "db"], ["sched", "exec"], ["exec", "workers"], ["workers", "db", "state"], ["trig", "db", "", { dashed: true }], ["ui", "db"]],
    },
    dataFlow: {
      nodes: [
        ["sensor", "Wait for landing file", "Sensor / deferrable trigger."],
        ["ingest", "CDE job: ingest", "Spark job loads raw data.", "cloudera", "cloudera-data-engineering"],
        ["dq", "Data quality check", "Fail fast on bad data."],
        ["transform", "CDE job: transform", "Builds curated Iceberg tables.", "apache", "apache-spark"],
        ["publish", "Refresh warehouse", "Trigger a CDW query or notify consumers.", "cloudera", "cloudera-data-warehouse"],
      ],
      edges: [["sensor", "ingest"], ["ingest", "dq"], ["dq", "transform", "pass"], ["transform", "publish"]],
    },
    deployment: {
      nodes: [
        ["cde", "Cloudera Data Engineering", "Embedded Airflow per virtual cluster.", "cloudera", "cloudera-data-engineering"],
        ["vc", "Virtual cluster", "Isolated Spark + Airflow environment."],
        ["k8s", "Kubernetes", "Airflow components and task pods."],
        ["ext", "External systems", "Operators call CDW, databases, APIs.", "external"],
        ["git", "Git repository", "DAG source control.", "data"],
      ],
      edges: [["cde", "vc"], ["vc", "k8s"], ["git", "vc", "DAGs"], ["k8s", "ext", "operators"]],
    },
  },
  io: {
    inputs: ["DAG definitions", "Schedules and triggers", "Connections & variables"],
    outputs: ["Task executions", "Logs", "Run history"],
    dependencies: ["Metadata database", "Executor backend"],
    connectors: ["Provider packages", "CDE operators (Cloudera)"],
    apis: ["Airflow REST API", "TaskFlow Python API"],
    integrations: ["Cloudera Data Engineering", "Spark", "Cloud storage"],
  },
  ops: {
    security: "UI/API authentication and role-based access; secrets backends for connections.",
    governance: "Pipelines as code with version history; task-level audit logs.",
    monitoring: "Grid/graph views, task logs, metrics via StatsD/OpenTelemetry.",
    scalability: "Scale workers/pods; the Kubernetes executor launches a pod per task.",
  },
  clouderaContext: {
    standalone: "Airflow is an Apache project usable with any compute.",
    clouderaIntegration: "Cloudera Data Engineering ships Airflow inside each virtual cluster with operators to run CDE Spark jobs and CDW queries.",
    realWorld: "A daily DAG waits for partner files, runs Spark ingestion and quality checks, then refreshes warehouse aggregates for 8 a.m. reports.",
  },
  useCases: [
    { title: "Daily regulatory pipeline", scenario: "Ordered, retried steps with full run history.", industryIds: ["financial"] },
    { title: "Trial data refresh", scenario: "Orchestrated integration of clinical sources.", industryIds: ["pharma"] },
  ],
  relatedComponentIds: ["cloudera-data-engineering", "apache-spark", "data-engineering-2", "cloudera-data-warehouse"],
};
