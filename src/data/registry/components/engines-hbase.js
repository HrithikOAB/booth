// Source: Apache HBase Reference Guide (hbase.apache.org/book.html) — architecture chapter.
export const hbase = {
  id: "apache-hbase",
  name: "Apache HBase",
  origin: "apache-oss",
  category: "engines",
  parentId: "cloudera-platform",
  tagline: "Distributed, versioned wide-column store for random, real-time reads and writes.",
  overview:
    "Apache HBase is an open-source, distributed, versioned, non-relational database modelled on Google Bigtable. Tables are split into regions served by RegionServers; an HMaster assigns regions and handles administrative operations, and ZooKeeper coordinates the cluster. Writes go to a write-ahead log (WAL) and an in-memory MemStore, which is flushed to immutable HFiles in the underlying storage.",
  businessValue: "Millisecond lookups and updates on very large tables, next to the analytics data.",
  capabilities: ["Random, real-time read/write access by row key", "Automatic sharding into regions", "Strongly consistent reads and writes", "Versioned cells", "Java, REST and Thrift APIs"],
  workflow: {
    title: "A write and a read",
    stages: [
      ["client", "Client locates the region", "The client looks up which RegionServer hosts the row via hbase:meta."],
      ["wal", "Write-ahead log", "The RegionServer appends the edit to the WAL for durability."],
      ["memstore", "MemStore", "The edit is held in memory, sorted by key."],
      ["flush", "Flush to HFiles", "Full MemStores are flushed to immutable HFiles in storage."],
      ["read", "Read", "Reads merge MemStore and HFiles to return the latest cell versions."],
    ],
  },
  views: {
    internal: {
      nodes: [
        ["client", "Client / API", "Java, REST or Thrift.", "client"],
        ["zk", "ZooKeeper", "Cluster coordination.", "core"],
        ["master", "HMaster", "Assigns regions; handles schema and admin operations.", "core"],
        { id: "rs", label: "RegionServers", kind: "focus", description: "Serve reads and writes for their regions.",
          children: [["wal", "WAL", "Write-ahead log for durability."], ["mem", "MemStore", "In-memory sorted edits."], ["regions", "Regions", "Contiguous row-key ranges of a table."]],
          childEdges: [] },
        ["hfiles", "HFiles", "Immutable files in HDFS or Ozone.", "store", "cloudera-object-store"],
      ],
      edges: [
        ["client", "rs", "get / put"],
        ["client", "zk", "locate", { kind: "control" }],
        ["master", "rs", "assign regions", { kind: "control" }],
        ["zk", "master", "", { kind: "control" }],
        ["rs", "hfiles", "flush"],
      ],
    },
    dataFlow: {
      nodes: [["put", "Put", "", "client"], ["wal", "WAL", "", "core"], ["mem", "MemStore", "", "core"], ["hfile", "HFile", "", "store"]],
      edges: [["put", "wal"], ["wal", "mem"], ["mem", "hfile", "flush"]],
    },
    deployment: {
      nodes: [["base", "Cloudera Base", "", "cloudera", "cloudera-base-datahub"], ["focus", "HBase service", "", "focus"], ["store", "HDFS / Ozone", "", "store", "cloudera-object-store"]],
      edges: [["base", "focus"], ["focus", "store"]],
    },
  },
  io: { inputs: ["Puts and deletes by row key"], outputs: ["Gets and scans"], dependencies: ["ZooKeeper", "HDFS or Ozone"], connectors: ["Spark, Hive and Phoenix integrations"], apis: ["Java client", "REST", "Thrift"], integrations: ["Cloudera Runtime"] },
  ops: { security: "Kerberos and Ranger authorization.", governance: "Ranger audit.", monitoring: "Metrics and web UIs.", scalability: "Regions split and spread across RegionServers." },
  clouderaContext: { standalone: "An Apache Software Foundation project.", clouderaIntegration: "Part of Cloudera Runtime on Cloudera Base, governed by SDX.", realWorld: "A telco serves per-subscriber usage counters with millisecond lookups." },
  useCases: [{ title: "Real-time profile store", scenario: "Low-latency lookups by key.", industryIds: ["telco", "financial"] }],
  relatedComponentIds: ["cloudera-platform", "cloudera-object-store", "apache-ranger"],
  booth: {
    oneLiner: "Open-source wide-column store for real-time reads and writes at scale.",
    trace: { label: "One write", nodes: ["client", "rs", "hfiles"] },
    nodes: {
      rs: { micro: "Each RegionServer serves a set of regions. Writes hit the WAL and MemStore first.", path: ["WAL", "MemStore", "HFile"] },
      master: { micro: "The HMaster assigns regions to RegionServers and handles admin operations." },
    },
    officialArchitecture: "https://hbase.apache.org/book.html",
    verificationDate: "2026-10-07",
  },
};
