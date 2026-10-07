// Builds component-linked architecture + lifecycle views for industry use cases.
// Each `flow` stage label from industries.js is classified into a platform lane;
// every lane maps to registry components so nodes open real component pages.
// These are reference patterns, not customer-specific deployments.
import { normView, workflowView } from "./registry/schema.js";
import { SERVICE_REDIRECTS, componentById } from "./registry/index.js";

const LANES = {
  ingest: {
    match: /ingest/,
    ref: "cloudera-data-flow",
    kind: "cloudera",
    children: [["apache-nifi", "Apache NiFi", "Flow-based ingestion with back-pressure and provenance."]],
    narrate: (src) => `Cloudera Data Flow (Apache NiFi) collects ${src} from source systems, routing and transforming records with full provenance.`,
  },
  stream: {
    match: /stream/,
    ref: "apache-kafka",
    label: "Streaming",
    kind: "apache",
    children: [
      ["apache-kafka", "Apache Kafka", "Durable, partitioned event log that decouples producers and consumers."],
      ["apache-flink", "Apache Flink", "Stateful stream processing with event-time windows."],
    ],
    narrate: () => "Events land on Apache Kafka topics; Apache Flink jobs enrich, window and score them in motion.",
  },
  process: {
    match: /process/,
    ref: "cloudera-data-engineering",
    kind: "cloudera",
    children: [
      ["apache-spark", "Apache Spark", "Distributed batch and streaming transformations."],
      ["apache-airflow", "Apache Airflow", "Orchestrates pipeline dependencies and schedules."],
    ],
    narrate: () => "Cloudera Data Engineering runs Apache Spark pipelines, orchestrated by Apache Airflow, to cleanse, join and feature-engineer the data.",
  },
  lakehouse: {
    match: /lakehouse|storage/,
    ref: "cloudera-data-lakehouse",
    kind: "cloudera",
    children: [
      ["apache-iceberg", "Apache Iceberg", "Open table format with ACID commits, time travel and schema evolution."],
      ["cloudera-object-store", "Cloudera Object Store", "S3-compatible object storage for table data."],
    ],
    narrate: () => "Curated data is committed as Apache Iceberg tables in the lakehouse, giving every engine one governed copy.",
  },
  warehouse: {
    match: /warehouse/,
    ref: "cloudera-data-warehouse",
    kind: "cloudera",
    children: [
      ["apache-impala", "Apache Impala", "Low-latency MPP SQL for interactive BI."],
      ["apache-hive", "Apache Hive", "SQL for large batch and ETL workloads."],
    ],
    narrate: () => "Cloudera Data Warehouse serves the tables to SQL users with Apache Impala and Apache Hive.",
  },
  governance: {
    match: /governance|catalog/,
    ref: "cloudera-sdx",
    kind: "cloudera",
    children: [
      ["apache-ranger", "Apache Ranger", "Fine-grained access policies and audit."],
      ["apache-atlas", "Apache Atlas", "Metadata, classification and lineage."],
    ],
    narrate: () => "Cloudera SDX applies consistent policy: Apache Ranger enforces access and masking, Apache Atlas tracks classification and lineage.",
  },
  ai: {
    match: /\bai\b|ai apps|private ai/,
    ref: "cloudera-ai",
    kind: "cloudera",
    narrate: () => "Cloudera AI trains, deploys and serves models next to the governed data, so sensitive records never leave the platform.",
  },
  analytics: {
    match: /analytic|reporting/,
    ref: "cloudera-data-warehouse",
    label: "Analytics & BI",
    kind: "cloudera",
    children: [
      ["apache-impala", "Apache Impala", "Interactive SQL for dashboards."],
      ["trino", "Trino", "Federated SQL across sources."],
    ],
    narrate: () => "Analysts query the governed tables with interactive SQL and BI tools.",
  },
  share: {
    match: /shar/,
    ref: "unified-data-fabric",
    kind: "cloudera",
    narrate: () => "The unified data fabric shares governed datasets across teams and environments without copying policy logic.",
  },
};

const ORDER = ["ingest", "stream", "process", "warehouse", "lakehouse", "governance", "ai", "analytics", "share"];

function laneFor(label, i, last) {
  const l = label.toLowerCase();
  if (i === 0) return "source";
  if (i === last) return "outcome";
  for (const key of ORDER) if (LANES[key].match.test(l)) return key;
  return "outcome";
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Architecture + lifecycle views and linked component ids for one use case. */
export function useCaseArchitecture(industry, useCase) {
  const last = useCase.flow.length - 1;
  const source = useCase.flow[0];
  const componentIds = new Set((useCase.serviceIds ?? []).map((s) => SERVICE_REDIRECTS[s]).filter(Boolean));

  const steps = useCase.flow.map((label, i) => {
    const lane = laneFor(label, i, last);
    const id = `s${i}-${slug(label)}`;
    if (lane === "source") {
      return { id, label, lane, kind: "external", ref: null, description: `${label} for ${industry.name.toLowerCase()} — the systems of record feeding this use case.` };
    }
    if (lane === "outcome") {
      return { id, label, lane, kind: "client", ref: null, description: `${useCase.title}: ${useCase.summary}` };
    }
    const def = LANES[lane];
    const comp = componentById[def.ref];
    componentIds.add(def.ref);
    def.children?.forEach(([cid]) => componentById[cid] && componentIds.add(cid));
    return {
      id,
      label: def.label ?? comp?.name ?? label,
      stageLabel: label,
      lane,
      kind: def.kind,
      ref: def.ref,
      description: def.narrate(source.toLowerCase()),
      children: def.children
        ?.filter(([cid]) => componentById[cid])
        .map(([cid, clabel, cdesc]) => ({ id: `${id}-${cid}`, label: clabel, description: cdesc, kind: componentById[cid].origin === "cloudera" ? "cloudera" : "apache", ref: cid })),
    };
  });

  if (useCase.serviceIds?.includes("agents") && !steps.some((s) => s.ref === "cloudera-agent-studio")) {
    const aiIdx = steps.findIndex((s) => s.lane === "ai");
    if (aiIdx >= 0) {
      steps[aiIdx].children = [
        { id: `${steps[aiIdx].id}-agents`, label: "Cloudera Agent Studio", description: "Builds governed AI agents on top of Cloudera AI.", kind: "cloudera", ref: "cloudera-agent-studio" },
      ];
      componentIds.add("cloudera-agent-studio");
    }
  }

  const gov = steps.find((s) => s.lane === "governance");
  const chain = steps.filter((s) => s !== gov);
  const edges = chain.slice(1).map((s, i) => [chain[i].id, s.id]);
  if (gov) {
    chain
      .filter((s) => ["lakehouse", "warehouse", "ai", "analytics", "process"].includes(s.lane))
      .forEach((s) => edges.push([gov.id, s.id, "policy", { dashed: true }]));
  }

  const internal = normView({
    caption: `${useCase.title} — reference architecture on Cloudera. Expand blocks to see the engines inside.`,
    nodes: steps.map(({ id, label, description, kind, ref, children }) => (children?.length ? { id, label, description, kind, ref, children } : [id, label, description, kind, ref])),
    edges,
  });

  const lifecycle = workflowView({
    stages: steps.map((s) => [s.id, s.stageLabel ?? s.label, s.description, s.ref]),
  });

  return {
    views: { internal, workflow: lifecycle },
    componentIds: [...componentIds].filter((id) => componentById[id]),
  };
}

export const INDUSTRY_VIEW_META = [
  { id: "internal", label: "Architecture" },
  { id: "workflow", label: "Lifecycle", playback: true },
];
