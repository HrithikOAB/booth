// Booth overlay for components whose authored architecture already matches the
// booth brief: traces (ids in views.internal), micro text and status overrides.
// Components that were restructured for the booth carry their `booth` block inline.

const boothOverlay = {
  "cloudera-platform": { trace: { label: "Engines on the runtime", nodes: ["engines", "rt", "hosts"] } },

  // ---- reference-architecture terminology (Data Services 2.0 + connector flows) ----
  "cloudera-data-services-2": { trace: { label: "Marketplace to storage", nodes: ["market", "svcs", "engines", "store"] } },
  "data-engineering-2": { trace: { label: "Job run", nodes: ["api", "focus", "airflow", "spark"] } },
  "data-lakehouse-2": { trace: { label: "Engine to table", nodes: ["engines", "polaris", "focus", "store"] } },
  "ai-2": { trace: { label: "Build to serve", nodes: ["users", "focus", "frameworks", "inference"] } },
  "data-flow-2": { trace: { label: "Flow to stream", nodes: ["designer", "focus", "nifi", "kafka"] } },
  "flow-seamless-transition": { trace: { label: "Jobs move, data stays", nodes: ["de", "focus", "de2", "ice"] } },
  "flow-engines-query-platform": { trace: { label: "Query across platforms", nodes: ["baseEng", "focus", "catalog", "data"] } },
  "flow-independent-integrated-data": { trace: { label: "Shared data option", nodes: ["basePl", "focus", "shared"] } },

  // ---- open-source engines ----
  "apache-spark": {
    oneLiner: "Open-source distributed engine for batch, SQL, streaming and ML.",
    trace: { label: "One Spark application", nodes: ["client", "driver", "cm", "exec", "storage"] },
    nodes: {
      driver: { micro: "The driver turns your code into a DAG, splits it into stages and schedules tasks.", path: ["Application", "Driver", "DAG", "Stages", "Tasks"] },
      exec: { micro: "Executors run tasks in parallel and cache data in memory.", path: ["Tasks", "Executors", "Storage"] },
    },
  },
  "spark-4": { trace: { label: "Spark Connect request", nodes: ["py", "connect", "catalyst", "sched", "exec"] } },
  "apache-nifi": {
    oneLiner: "Open-source dataflow engine: route, transform and track data with provenance.",
    trace: { label: "Flow with provenance", nodes: ["web", "fc", "pr"] },
    nodes: {
      fc: { micro: "Processors pass FlowFiles through queues; back pressure keeps the flow stable.", path: ["Source", "FlowFile", "Processor", "Queue", "Router", "Destination"] },
      pr: { micro: "Provenance records every event in a FlowFile's life, for full traceability." },
    },
  },
  "apache-kafka": {
    trace: { label: "One event", nodes: ["prod", "cluster", "topic", "cg", "offsets"] },
    nodes: {
      topic: { micro: "Topics are split into partitions, replicated across brokers.", path: ["Producer", "Topic", "Partition", "Consumer group"] },
      cg: { micro: "Consumers in a group share partitions, so reading scales out." },
    },
  },
  trino: {
    trace: { label: "One query", nodes: ["client", "coord", "workers", "spi", "ice"] },
    nodes: {
      coord: { micro: "The coordinator parses and plans the query, then schedules a distributed plan.", path: ["SQL", "Plan", "Stages", "Tasks"] },
      workers: { micro: "Workers run tasks on splits and exchange data with each other." },
      spi: { micro: "Connectors let one SQL query reach Iceberg, databases, Kafka and more." },
    },
  },
  "apache-iceberg": {
    trace: { label: "Read a snapshot", nodes: ["catalog", "meta", "snap", "mlist", "manifest", "files"] },
    nodes: { snap: { micro: "Every commit creates a snapshot. Readers see a consistent table, and you can time travel." } },
  },
  "apache-flink": { trace: { label: "Stateful stream", nodes: ["src", "tm", "state", "ckpt"] } },
  "apache-impala": { trace: { label: "Interactive query", nodes: ["bi", "coord", "exec", "data"] } },
  "apache-hive": { trace: { label: "SQL on the lakehouse", nodes: ["client", "hs2", "tez", "files"] } },
  "apache-airflow": { trace: { label: "Scheduled run", nodes: ["sched", "exec", "workers", "db"] } },

  // ---- partners / ecosystem ----
  neo4j: {
    trace: { label: "Graph query", nodes: ["drivers", "dbms", "store"] },
    nodes: { dbms: { micro: "Cypher queries are planned and run against nodes and relationships.", path: ["Application", "Cypher", "Graph engine", "Graph storage"] } },
  },
  starrocks: {
    trace: { label: "Analytical query", nodes: ["client", "fe", "cn", "obj"] },
    nodes: { fe: { micro: "Frontends parse SQL and build the query plan; backends and compute nodes execute it.", path: ["Client", "Frontend", "Query plan", "Backend", "Result"] } },
  },
  clickhouse: {
    trace: { label: "Columnar query", nodes: ["client", "server", "mt"] },
    nodes: { mt: { micro: "MergeTree stores data in sorted parts that merge in the background.", path: ["Query", "Processing", "MergeTree", "Result"] } },
  },

  // ---- governance ----
  "apache-atlas": {
    trace: { label: "Metadata in, lineage out", nodes: ["hooks", "kafka", "server", "graph"] },
    nodes: {
      hooks: { micro: "Hooks in Hive, Spark and NiFi publish metadata changes as they happen." },
      server: { micro: "Types, entities, relationships and classifications power search and lineage.", path: ["Ingest", "Types", "Entities", "Classifications", "Lineage"] },
    },
  },
  "apache-ranger": {
    trace: { label: "Allow or deny", nodes: ["usersync", "admin", "plugins", "audit"] },
    nodes: {
      admin: { micro: "Policies are written once in Ranger Admin and pushed to every plugin." },
      plugins: { micro: "Each engine's plugin decides allow or deny locally, then writes an audit event.", path: ["User", "Policy", "Plugin", "Allow / Deny", "Audit"] },
    },
  },
  "metadata-management": { trace: { label: "Metadata to catalog", nodes: ["sources", "atlas", "focus", "catalog"] } },
  "data-lineage-concept": { trace: { label: "Lineage to impact", nodes: ["sources", "octo", "focus", "ui"] } },
  "access-control": { trace: { label: "Access decision", nodes: ["tags", "ranger", "focus", "engine"] } },
  "security-policies-auditing": { trace: { label: "Policy to audit", nodes: ["ranger", "audit", "focus"] } },

  // ---- clouds, storage and infrastructure ----
  aws: { trace: { label: "Cloudera on AWS", nodes: ["iam", "cdp", "focus", "svc"] } },
  "microsoft-azure": { trace: { label: "Cloudera on Azure", nodes: ["iam", "cdp", "focus", "svc"] } },
  "google-cloud": { trace: { label: "Cloudera on Google Cloud", nodes: ["iam", "cdp", "focus", "svc"] } },
  "s3-storage": { trace: { label: "One API, many stores", nodes: ["clients", "api", "ozone"] } },
  "dell-technologies": { trace: { label: "Infrastructure to engines", nodes: ["servers", "cloudera", "engines", "focus"] } },
  nvidia: {
    trace: { label: "GPU to inference", nodes: ["focus", "nim", "inference"] },
    nodes: { nim: { micro: "NIM microservices package optimized models; Cloudera AI Inference embeds them." } },
  },
  amd: { trace: { label: "Hardware to workload", nodes: ["focus", "hosts", "platform", "engines"] } },
  "cloud-deployment": { trace: { label: "Governed cloud", nodes: ["fabric", "focus", "aws"] } },
};

export default boothOverlay;
