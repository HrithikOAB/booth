/**
 * Umbrella platform architecture — manual layout matching official two-pillar diagram.
 */

export const architectureLegend = [
  { id: "base", label: "Cloudera Base / DataHub (1.5.x)", color: "#3d7ab8" },
  { id: "cac", label: "Cloudera Anywhere Cloud / CDS 2.0", color: "#f56600" },
  { id: "partner", label: "Partner / ecosystem", color: "#8b9cb0" },
  { id: "deploy", label: "Deployment environments", color: "#22c5c7" },
];

const tile = (id, label, x, y, opts = {}) => ({
  id,
  type: "serviceTile",
  position: { x, y },
  data: {
    label,
    tooltip: opts.tooltip ?? label,
    serviceId: opts.serviceId ?? null,
    clickable: !!opts.serviceId,
    variant: opts.variant ?? "base",
    width: opts.width ?? 108,
    height: opts.height ?? 72,
  },
});

const chip = (id, label, x, y, opts = {}) => ({
  id,
  type: "engineChip",
  position: { x, y },
  data: { label, partner: !!opts.partner, width: opts.width ?? 90 },
});

export const architectureNodes = [
  {
    id: "frame-base",
    type: "groupFrame",
    position: { x: 40, y: 40 },
    data: {
      title: "Cloudera Base (or DataHub)\nWith Data Services 1.5.x",
      variant: "base",
      width: 520,
      height: 720,
    },
    zIndex: 0,
  },
  {
    id: "frame-cac",
    type: "groupFrame",
    position: { x: 620, y: 40 },
    data: {
      title: "Cloudera Anywhere Cloud\nWith Cloudera Data Services 2.0",
      variant: "cac",
      width: 560,
      height: 720,
    },
    zIndex: 0,
  },
  tile("base-ai", "Cloudera AI", 70, 130, { serviceId: "privateai", tooltip: "Cloudera AI — Private AI & agents" }),
  tile("base-de", "Data Engineering", 190, 130, { serviceId: "engineering" }),
  tile("base-dl", "Data Lakehouse", 310, 130, { serviceId: "lakehouse" }),
  tile("base-df", "Data Flow", 430, 130, { serviceId: "dataflow" }),
  {
    id: "base-engines-bar",
    type: "barLabel",
    position: { x: 70, y: 240 },
    data: { label: "Cloudera Engines", width: 468, height: 36 },
  },
  chip("eng-spark", "Apache Spark", 90, 290),
  chip("eng-nifi", "NiFi", 220, 290),
  chip("eng-kafka", "Kafka", 330, 290),
  {
    id: "base-manager",
    type: "barLabel",
    position: { x: 70, y: 360 },
    data: { label: "Cloudera Manager", width: 468, height: 40, accent: true },
  },
  tile("base-obj", "Cloudera\nObject Store", 70, 430, { width: 150, height: 80 }),
  tile("base-platform", "Cloudera\nPlatform", 240, 430, { width: 150, height: 80 }),
  tile("base-sdx", "SDX", 410, 430, { serviceId: "sdx", width: 128, height: 80 }),
  tile("cac-de2", "Data Engineering 2.0", 650, 130, { serviceId: "engineering", variant: "cac" }),
  tile("cac-dl2", "Data Lakehouse 2.0", 770, 130, { serviceId: "lakehouse", variant: "cac" }),
  tile("cac-ai2", "AI 2.0", 890, 130, { serviceId: "privateai", variant: "cac" }),
  tile("cac-df2", "Data Flow 2.0", 1010, 130, { serviceId: "dataflow", variant: "cac", width: 120 }),
  {
    id: "cac-engines-bar",
    type: "barLabel",
    position: { x: 650, y: 240 },
    data: { label: "Cloudera Engines", width: 500, height: 36, variant: "cac" },
  },
  chip("cac-spark4", "Spark 4.0", 670, 290),
  chip("cac-trino", "Trino", 800, 290),
  {
    id: "partner-bar",
    type: "barLabel",
    position: { x: 650, y: 350 },
    data: { label: "Partner Engines (examples)", width: 500, height: 32, variant: "partner" },
  },
  chip("partner-neo4j", "Neo4j", 670, 390, { partner: true }),
  chip("partner-starrocks", "StarRocks", 790, 390, { partner: true }),
  chip("partner-clickhouse", "ClickHouse", 920, 390, { partner: true }),
  {
    id: "frame-anywhere-inner",
    type: "groupFrame",
    position: { x: 650, y: 460 },
    data: {
      title: "Cloudera Anywhere Cloud",
      variant: "cac-inner",
      width: 500,
      height: 280,
    },
    zIndex: 1,
  },
  {
    id: "unified-fabric",
    type: "barLabel",
    position: { x: 670, y: 510 },
    data: { label: "Unified Data Fabric", width: 460, height: 32, accent: true, variant: "cac" },
  },
  tile("atlas-ranger", "Apache Atlas / Ranger\nGovernance · Security · Metadata", 670, 560, {
    width: 220,
    height: 88,
    serviceId: "sdx",
    variant: "cac",
  }),
  tile("data-lineage", "Cloudera Data Lineage", 910, 560, { serviceId: "sdx", variant: "cac", width: 200, height: 88 }),
  tile("cac-obj", "Cloudera Object Store", 670, 670, { width: 440, height: 48, serviceId: "anywhere", variant: "cac" }),
  {
    id: "conn-jobs",
    type: "connectorLabel",
    position: { x: 560, y: 155 },
    data: { label: "Seamless transition of jobs & engines" },
  },
  {
    id: "conn-query",
    type: "connectorLabel",
    position: { x: 540, y: 400 },
    data: { label: "Engines and Services can query Cloudera platform" },
  },
  {
    id: "conn-data",
    type: "connectorLabel",
    position: { x: 520, y: 620 },
    data: { label: "Independent data, integrated with data from Cloudera platform" },
  },
  {
    id: "deploy-cloud-frame",
    type: "groupFrame",
    position: { x: 40, y: 800 },
    data: { title: "Cloud", variant: "deploy", width: 560, height: 120 },
  },
  {
    id: "deploy-onprem-frame",
    type: "groupFrame",
    position: { x: 620, y: 800 },
    data: { title: "On Premises", variant: "deploy", width: 560, height: 120 },
  },
  ...["Google Cloud", "Microsoft Azure", "AWS"].map((label, i) => ({
    id: `cloud-${i}`,
    type: "deploymentTile",
    position: { x: 70 + i * 170, y: 850 },
    data: { label },
  })),
  ...["Cloudera Object Store", "Dell Technologies", "S3 Store", "NVIDIA", "AMD"].map((label, i) => ({
    id: `onprem-${i}`,
    type: "deploymentTile",
    position: { x: 640 + (i % 3) * 175, y: 850 + Math.floor(i / 3) * 50 },
    data: { label, small: i >= 3 },
  })),
];

export const architectureEdges = [
  { id: "e-jobs", source: "base-df", target: "cac-df2", animated: true },
  { id: "e-de", source: "base-de", target: "cac-de2", animated: true },
  { id: "e-dl", source: "base-dl", target: "cac-dl2", animated: true },
  { id: "e-ai", source: "base-ai", target: "cac-ai2", animated: true },
  { id: "e-sdx-fabric", source: "base-sdx", target: "unified-fabric", style: { strokeDasharray: "6 4" } },
  { id: "e-platform-query", source: "base-platform", target: "cac-spark4" },
  { id: "e-obj-integ", source: "base-obj", target: "cac-obj" },
  { id: "e-cloud-anywhere", source: "cloud-1", target: "frame-anywhere-inner", style: { stroke: "#22c5c7" } },
  { id: "e-onprem-base", source: "onprem-0", target: "frame-base", style: { stroke: "#22c5c7" } },
];
