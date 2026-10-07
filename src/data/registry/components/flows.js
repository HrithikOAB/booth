// The three connector flows between the Base pillar and the Anywhere Cloud pillar.
const flow = (c) => ({ category: "flows", origin: "flow", parentId: "cloudera-anywhere-cloud", ...c });

const transition = flow({
  id: "flow-seamless-transition", name: "Seamless Transition of Jobs",
  tagline: "Move Data Engineering jobs from 1.5.x to 2.0 without rewrites.",
  overview: "The top connector in the diagram links Data Engineering on the Base pillar to Data Engineering 2.0. It represents moving existing Spark jobs, resources and Airflow DAGs to the Anywhere Cloud edition while both platforms coexist — Cloudera states the existing platform is supported through 2032 with 7.3.2.",
  capabilities: ["Job definitions carry over", "Spark 3 → Spark 4 upgrade path", "Side-by-side operation", "Same governed tables"],
  verificationNotes: ["Specific migration tooling depends on release — consult Cloudera documentation."],
  workflow: { stages: [["inventory", "Inventory jobs", "List CDE jobs, resources and DAGs.", "cloudera-data-engineering"], ["test", "Validate on Spark 4", "Test jobs against Spark 4.", "spark-4"], ["move", "Deploy to DE 2.0", "Recreate jobs in Data Engineering 2.0.", "data-engineering-2"], ["parallel", "Run in parallel", "Compare outputs on the same Iceberg tables.", "apache-iceberg"], ["cutover", "Cut over", "Retire the old schedule."]] },
  views: {
    internal: { nodes: [["de", "Data Engineering (1.5.x)", "", "cloudera", "cloudera-data-engineering"], ["focus", "Transition", "", "focus"], ["de2", "Data Engineering 2.0", "", "cloudera", "data-engineering-2"], ["ice", "Shared Iceberg tables", "", "store", "apache-iceberg"], ["fabric", "Fabric governance", "", "cloudera", "unified-data-fabric"]], edges: [["de", "focus", "jobs"], ["focus", "de2"], ["de", "ice"], ["de2", "ice"], ["fabric", "de2", "", { dashed: true }]] },
    dataFlow: { nodes: [["job", "Spark job def", "", "data"], ["test", "Validation run", "", "core"], ["new", "DE 2.0 job", "", "focus"], ["tbl", "Same tables", "", "store"]], edges: [["job", "test"], ["test", "new"], ["new", "tbl"]] },
    deployment: { nodes: [["base", "Base / 1.5.x", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", "Transition", "", "focus"]], edges: [["base", "focus"], ["focus", "acc"]] },
  },
  io: { inputs: ["Existing jobs"], outputs: ["DE 2.0 jobs"], dependencies: ["Both platforms"], connectors: ["Shared catalog"], apis: ["CDE APIs"], integrations: ["Spark 4"] },
  ops: { security: "Policies continue via SDX/fabric.", governance: "Lineage across both.", monitoring: "Compare run metrics.", scalability: "Move job by job." },
  clouderaContext: { standalone: "A Cloudera migration pattern.", clouderaIntegration: "Connector 'Seamless Transition of Jobs' in the diagram.", realWorld: "A bank moves 300 nightly jobs over two quarters with zero downtime." },
  useCases: [{ title: "Phased migration", scenario: "Low-risk job moves.", industryIds: ["financial", "insurance"] }],
  relatedComponentIds: ["cloudera-data-engineering", "data-engineering-2", "spark-4"],
});

const query = flow({
  id: "flow-engines-query-platform", name: "Cloudera Engines Can Query Across Platforms",
  tagline: "Engines in either pillar query the same governed data.",
  overview: "The middle connector links the engines of the two pillars. Federation through Trino and shared Iceberg catalogs let Cloudera engines on Anywhere Cloud query data managed on the Base platform (and vice versa) — Cloudera describes zero-copy federated analytics powered by Iceberg and Trino.",
  capabilities: ["Trino federation", "Shared Iceberg/Polaris catalogs", "Consistent Ranger policies", "No data copies"],
  workflow: { stages: [["request", "Query submitted", "A user runs SQL in Anywhere Cloud.", "trino"], ["catalog", "Resolve tables", "Catalogs on both sides resolve tables.", "data-lakehouse-2"], ["authorize", "Authorize", "Ranger policies apply.", "apache-ranger"], ["scan", "Scan in place", "Data on Base storage is read directly.", "cloudera-object-store"], ["return", "Return results", "One result set."]] },
  views: {
    internal: { nodes: [["baseEng", "Base engines", "Spark, NiFi, Kafka.", "apache", "apache-spark"], ["accEng", "Anywhere engines", "Spark 4, Trino.", "apache", "trino"], ["focus", "Cross-platform query", "", "focus"], ["catalog", "Shared catalogs", "", "core"], ["data", "Governed data", "", "store"]], edges: [["accEng", "focus"], ["baseEng", "focus"], ["focus", "catalog"], ["catalog", "data"]] },
    dataFlow: { nodes: [["u", "Analyst", "", "client"], ["t", "Trino", "", "apache", "trino"], ["b", "Base tables", "", "store"], ["a", "Anywhere tables", "", "store"]], edges: [["u", "t"], ["t", "b"], ["t", "a"]] },
    deployment: { nodes: [["base", "Base", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", "Query path", "", "focus"]], edges: [["acc", "focus"], ["focus", "base"]] },
  },
  io: { inputs: ["SQL"], outputs: ["Results"], dependencies: ["Network connectivity", "Catalogs"], connectors: ["Trino connectors"], apis: ["SQL"], integrations: ["Iceberg", "Hive Metastore"] },
  ops: { security: "Same policies both sides.", governance: "Lineage of federated queries.", monitoring: "Query profiles.", scalability: "Push-down to sources." },
  clouderaContext: { standalone: "A Cloudera architecture pattern.", clouderaIntegration: "Connector 'Cloudera Engines Can Query Platform' in the diagram.", realWorld: "Analysts join new cloud data with on-prem history in one query." },
  useCases: [{ title: "Hybrid analytics", scenario: "Query old and new together.", industryIds: ["telco", "manufacturing"] }],
  relatedComponentIds: ["trino", "data-lakehouse-2", "cloudera-data-lakehouse", "unified-data-fabric"],
});

const independent = flow({
  id: "flow-independent-integrated-data", name: "Independent or Integrated Data",
  tagline: "Each pillar can own its data — or share it.",
  overview: "The bottom connector links the platform layers. Organizations can keep data independent on each platform (e.g., for residency) or integrate it through shared object storage, catalogs and the Unified Data Fabric so both pillars work on one copy.",
  capabilities: ["Independent data domains", "Shared storage and catalogs", "Fabric-wide governance", "Choice per dataset"],
  workflow: { stages: [["classify", "Classify datasets", "Decide residency and sharing per dataset."], ["independent", "Independent", "Keep separate storage and policies.", "on-premises-deployment"], ["integrate", "Integrated", "Share Iceberg tables via catalogs.", "apache-iceberg"], ["govern", "Govern", "Fabric applies consistent policies.", "unified-data-fabric"]] },
  views: {
    internal: { nodes: [["basePl", "Base platform", "", "cloudera", "cloudera-platform"], ["accPl", "Anywhere platform", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", "Data choice", "", "focus"], ["shared", "Shared Iceberg", "", "store", "apache-iceberg"], ["sep", "Separate stores", "", "store", "cloudera-object-store"]], edges: [["basePl", "focus"], ["accPl", "focus"], ["focus", "shared", "integrated"], ["focus", "sep", "independent", { dashed: true }]] },
    dataFlow: { nodes: [["d", "Dataset", "", "data"], ["p", "Policy decision", "", "focus"], ["s", "Shared", "", "store"], ["i", "Isolated", "", "store"]], edges: [["d", "p"], ["p", "s"], ["p", "i", "", { dashed: true }]] },
    deployment: { nodes: [["base", "Base", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["fabric", "Fabric", "", "focus", "unified-data-fabric"]], edges: [["base", "fabric"], ["acc", "fabric"]] },
  },
  io: { inputs: ["Datasets"], outputs: ["Placement decision"], dependencies: ["Catalogs"], connectors: ["Iceberg REST"], apis: ["—"], integrations: ["Fabric"] },
  ops: { security: "Per-dataset policies.", governance: "Residency rules.", monitoring: "Access audits.", scalability: "Per domain." },
  clouderaContext: { standalone: "A Cloudera architecture pattern.", clouderaIntegration: "Connector 'Independent or Integrated Data' in the diagram.", realWorld: "EU customer data stays isolated while product data is shared globally." },
  useCases: [{ title: "Residency-aware sharing", scenario: "Mix of isolated and shared data.", industryIds: ["financial", "healthcare"] }],
  relatedComponentIds: ["unified-data-fabric", "cloudera-object-store", "apache-iceberg"],
});

export default [transition, query, independent];
