export const diagramTitle = "Cloudera Platform, Cloudera Data Services, and Cloudera Anywhere Cloud";

export const basePillar = {
  id: "base",
  title: "Cloudera Base (or DataHub)",
  subtitle: "With Data Services 1.5.x",
  services: [
    { id: "base-ai", label: "Cloudera AI", serviceId: "privateai", icon: "ai" },
    { id: "base-de", label: "Data Engineering", serviceId: "engineering", icon: "de" },
    { id: "base-dl", label: "Data Lakehouse", serviceId: "lakehouse", icon: "dl" },
    { id: "base-df", label: "Data Flow", serviceId: "dataflow", icon: "df" },
  ],
  enginesLabel: "Cloudera Engines",
  engines: [
    { id: "eng-spark", label: "Apache Spark" },
    { id: "eng-nifi", label: "NiFi" },
    { id: "eng-kafka", label: "Kafka" },
  ],
  manager: { id: "base-mgr", label: "Cloudera Manager" },
  platform: {
    label: "Cloudera Platform",
    objectStore: { id: "base-obj", label: "Cloudera Object Store" },
    sdx: { id: "base-sdx", label: "Cloudera SDX", serviceId: "sdx" },
  },
};

export const cacPillar = {
  id: "cac",
  title: "Cloudera Anywhere Cloud",
  subtitle: "With Cloudera Data Services 2.0",
  cds20: {
    label: "Cloudera Data Services 2.0",
    services: [
      { id: "cac-de2", label: "Data Engineering 2.0", serviceId: "engineering", pair: "base-de" },
      { id: "cac-dl2", label: "Data Lakehouse 2.0", serviceId: "lakehouse", pair: "base-dl" },
      { id: "cac-ai2", label: "AI 2.0", serviceId: "privateai", pair: "base-ai" },
      { id: "cac-df2", label: "Data Flow 2.0", serviceId: "dataflow", pair: "base-df" },
    ],
  },
  engines: {
    label: "Cloudera Engines",
    items: [
      { id: "cac-spark4", label: "Spark 4.0" },
      { id: "cac-trino", label: "Trino" },
    ],
  },
  partners: {
    label: "Partner Engines (examples)",
    items: [
      { id: "p-neo4j", label: "Neo4j", partner: true },
      { id: "p-starrocks", label: "StarRocks", partner: true },
      { id: "p-clickhouse", label: "ClickHouse", partner: true },
    ],
  },
  anywhere: {
    label: "Cloudera Anywhere Cloud",
    fabric: { id: "unified-fabric", label: "Unified Data Fabric" },
    governance: {
      id: "atlas-ranger",
      label: "Apache Atlas/Ranger",
      sub: "Governance | Security | Metadata",
      serviceId: "sdx",
    },
    lineage: {
      id: "data-lineage",
      label: "Cloudera Data Lineage",
      sub: "(formerly Octopai)",
      serviceId: "sdx",
    },
    objectStore: { id: "cac-obj", label: "Cloudera Object Store", serviceId: "anywhere" },
  },
};

export const connectorFlows = [
  {
    id: "flow-jobs",
    label: "Seamless transition of jobs & engines",
    highlights: ["base-de", "base-dl", "base-ai", "base-df", "cac-de2", "cac-dl2", "cac-ai2", "cac-df2"],
  },
  {
    id: "flow-query",
    label: "Engines and Services can query Cloudera platform",
    highlights: ["eng-spark", "eng-nifi", "eng-kafka", "cac-spark4", "cac-trino", "base-sdx", "base-platform", "unified-fabric", "atlas-ranger"],
  },
  {
    id: "flow-data",
    label: "Independent data, and integrated with data from Cloudera platform",
    highlights: ["base-obj", "base-sdx", "cac-obj", "unified-fabric", "data-lineage"],
  },
];

export const deployment = {
  cloud: { label: "Cloud", items: ["Google Cloud", "Microsoft Azure", "AWS"] },
  onPrem: { label: "On Premises", items: ["Cloudera Object Store", "Dell Technologies", "S3 Store", "NVIDIA", "AMD"] },
};

export function serviceIdForNode(nodeId) {
  const nodes = [
    ...basePillar.services,
    basePillar.platform.sdx,
    ...cacPillar.cds20.services,
    cacPillar.anywhere.governance,
    cacPillar.anywhere.lineage,
    cacPillar.anywhere.objectStore,
  ];
  return nodes.find((n) => n.id === nodeId)?.serviceId ?? null;
}

export function highlightSetForNode(nodeId) {
  const set = new Set([nodeId]);
  const pair = cacPillar.cds20.services.find((s) => s.id === nodeId || s.pair === nodeId);
  if (pair) { set.add(pair.id); set.add(pair.pair); }
  const governance = ["base-sdx", "unified-fabric", "atlas-ranger", "gov-atlas", "gov-ranger", "gov-governance", "gov-security", "gov-metadata", "data-lineage"];
  if (governance.includes(nodeId)) {
    [...governance, "base-platform"].forEach((x) => set.add(x));
  }
  if (nodeId === "base-platform") set.add("base-sdx");
  connectorFlows.forEach((f) => {
    if (f.highlights.includes(nodeId)) f.highlights.forEach((h) => set.add(h));
  });
  return set;
}
