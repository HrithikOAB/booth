// Official resources per component. URLs here are checked by
// `npm run check-links`, which writes verification.js; only entries with a
// passing check render as "Verified".
import verification from "./verification.js";

const PR = (slug, title) => ({ kind: "press", title, url: `https://www.cloudera.com/about/news-and-blogs/press-releases/${slug}.html` });
const doc = (title, url, kind = "docs") => ({ kind, title, url });
const local = (slug, title, { captions = false, note } = {}) => ({
  type: "local", title, src: `/videos/${slug}.mp4`, captions: captions ? `/videos/${slug}.en.vtt` : null, note,
});
const yt = (id, title, channel) => ({ type: "youtube", id, title, channel, url: `https://www.youtube.com/watch?v=${id}` });

const P = {
  anywhere: PR("2026-08-19-cloudera-powers-the-agentic-ai-era-with-cloudera-anywhere-cloud", "Cloudera powers the agentic AI era with Cloudera Anywhere Cloud (Aug 2026)"),
  nvidiaSpark: PR("2026-08-20-cloudera-teams-with-nvidia-to-lower-cloud-compute-spend-and-accelerate-apache-spark-pipelines", "Cloudera teams with NVIDIA to accelerate Apache Spark pipelines (Aug 2026)"),
  nim: PR("2024-10-08-cloudera-unveils-ai-inference-service-with-embedded-nvidia-nim-microservices-to-accelerate-genai-development-and-deployment", "Cloudera AI Inference service with embedded NVIDIA NIM (Oct 2024)"),
  nvidia2024: PR("2024-03-19-cloudera-and-nvidia-collaborate-to-expand-generative-ai-capabilities-with-nvidia-microservices", "Cloudera and NVIDIA collaborate on NVIDIA microservices (Mar 2024)"),
  dell: PR("2025-09-25-cloudera-integrates-with-dell-objectscale-to-deliver-enterprises-a-next-generation-private-ai-platform", "Cloudera integrates with Dell ObjectScale for private AI (Sep 2025)"),
  octopai: PR("2024-11-14-cloudera-to-acquire-octopais-platform", "Cloudera to acquire Octopai's platform (Nov 2024)"),
  federation: PR("2025-11-20-cloudera-advances-unified-data-access-and-governance-with-ai-powered-federation-and-lineage", "AI-powered federation and lineage (Nov 2025)"),
  polaris: PR("2026-06-04-cloudera-adopts-apache-polaris-to-advance-open-governed-data-access-for-enterprise-ai-anywhere", "Cloudera adopts Apache Polaris (Jun 2026)"),
  taikun: PR("2025-08-04-cloudera-acquires-taikun-to-deliver-cloud-experience-to-data-anywhere-for-ai-everywhere", "Cloudera acquires Taikun (Aug 2025)"),
  icebergRest: PR("2024-08-06-cloudera-strengthens-metadata-management-with-modernized-data-catalog-and-iceberg-rest-integration", "Modernized Data Catalog and Iceberg REST integration (Aug 2024)"),
  crewai: PR("2024-12-10-cloudera-powers-autonomous-enterprise-agents-for-ai-practitioners-with-crewai", "Autonomous enterprise agents with CrewAI (Dec 2024)"),
  privateAi: PR("2025-08-06-cloudera-data-services-brings-private-ai-to-the-data-center", "Cloudera Data Services brings private AI to the data center (Aug 2025)"),
  inference2026: PR("2026-02-09-cloudera-unveils-next-phase-of-ai-inferencing-and-unified-data-access-capabilities", "Next phase of AI inferencing and unified data access (Feb 2026)"),
  gcp: PR("2021-03-31-cloudera-data-platform-available-on-google-cloud", "Cloudera Data Platform available on Google Cloud (Mar 2021)"),
  azure: PR("2019-11-06-cloudera-data-platform-available-on-microsoft-azure", "Cloudera Data Platform available on Microsoft Azure (Nov 2019)"),
  aws: PR("09-07-23-cloudera-signs-strategic-collaboration-agreement-with-aws", "Cloudera signs strategic collaboration agreement with AWS"),
  awsSovereign: PR("2025-10-09-cloudera-leverages-aws-to-deliver-a-sovereign-ready-data-and-ai-platform-as-a-launch-partner-for-the-aws-european-sovereign-cloud", "Sovereign-ready platform on AWS European Sovereign Cloud (Oct 2025)"),
};

const D = {
  anywhereProduct: doc("Cloudera Anywhere Cloud", "https://www.cloudera.com/products/anywhere-cloud.html", "product"),
  fabricProduct: doc("Unified Data Fabric", "https://www.cloudera.com/products/unified-data-fabric.html", "product"),
  lineageProduct: doc("Cloudera Data Lineage", "https://www.cloudera.com/products/unified-data-fabric/data-lineage.html", "product"),
};

const raw = {
  "cloudera-ai": { docs: [doc("Cloudera AI documentation", "https://docs.cloudera.com/machine-learning/cloud/index.html"), P.nim, P.inference2026, P.privateAi], videos: [local("private-ai", "Private AI with Cloudera", { captions: true }), local("ai-inference-secure", "Secure AI Inference demo"), yt("_ijsX-TPqCc", "Why Cloudera AI is the Key to Solving Your Data Readiness and AI Project Backlog", "Cloudera, Inc.")] },
  "cloudera-data-engineering": { docs: [doc("Cloudera Data Engineering documentation", "https://docs.cloudera.com/data-engineering/cloud/index.html"), P.nvidiaSpark], videos: [local("data-engineering", "Cloudera Data Engineering overview", { captions: true }), yt("d7X5UY8o56k", "External IDE Connectivity with Cloudera Data Engineering", "Cloudera, Inc.")] },
  "cloudera-data-lakehouse": { docs: [doc("Open Data Lakehouse", "https://www.cloudera.com/products/open-data-lakehouse.html", "product"), P.icebergRest, P.polaris], videos: [local("open-data-lakehouse", "Cloudera Open Data Lakehouse", { captions: true }), yt("DcC7OCP8ke0", "Why Cloudera Open Data Lakehouse with Apache Iceberg?", "Cloudera, Inc.")] },
  "cloudera-data-flow": { docs: [doc("Cloudera Data Flow documentation", "https://docs.cloudera.com/dataflow/cloud/index.html")], videos: [local("cdf-overview", "Cloudera Data Flow overview", { captions: true }), local("realtime-ai", "Real-time AI with Cloudera"), yt("tLEGcWC4paI", "What's new in Cloudera Data Flow 2.10: NiFi 2 Flows", "Cloudera, Inc.")] },
  "cloudera-data-warehouse": { docs: [doc("Cloudera Data Warehouse documentation", "https://docs.cloudera.com/data-warehouse/cloud/index.html")], videos: [local("data-warehouse", "Cloudera Data Warehouse", { captions: true }), yt("w4rte8HIjBI", "ClouderaNow 21 - Easily Create Insights From All Your Data", "Cloudera, Inc.")] },
  "cloudera-agent-studio": { docs: [P.crewai, doc("Cloudera AI documentation", "https://docs.cloudera.com/machine-learning/cloud/index.html")], videos: [local("agent-studio-iceberg", "Agent Studio Iceberg MCP agent"), yt("XZMaJaLBN6s", "Cloudera Agent Studio", "Cloudera, Inc.")] },
  "cloudera-data-services-2": { docs: [D.anywhereProduct, P.anywhere], videos: [local("anywhere-cloud", "Cloudera Anywhere Cloud")] },
  "data-engineering-2": { docs: [P.nvidiaSpark, D.anywhereProduct], videos: [local("data-engineering", "Cloudera Data Engineering overview", { captions: true })] },
  "data-lakehouse-2": { docs: [P.polaris, D.anywhereProduct], videos: [local("open-data-lakehouse", "Cloudera Open Data Lakehouse", { captions: true })] },
  "ai-2": { docs: [D.anywhereProduct, P.anywhere], videos: [local("ai-inference-prototype", "AI Inference: prototype to production")] },
  "data-flow-2": { docs: [D.anywhereProduct], videos: [local("cdf-overview", "Cloudera Data Flow overview", { captions: true })] },
  "cloudera-base-datahub": { docs: [doc("Cloudera Base on premises documentation", "https://docs.cloudera.com/cdp-private-cloud-base/latest/index.html"), P.privateAi], videos: [local("hybrid-anywhere", "Hybrid data anywhere")] },
  "cloudera-manager": { docs: [doc("Cloudera Manager (Base documentation)", "https://docs.cloudera.com/cdp-private-cloud-base/latest/index.html")], videos: [] },
  "cloudera-platform": { docs: [doc("Cloudera Runtime / Base documentation", "https://docs.cloudera.com/cdp-private-cloud-base/latest/index.html")], videos: [local("hybrid-anywhere", "Hybrid data anywhere")] },
  "cloudera-object-store": { docs: [doc("Apache Ozone", "https://ozone.apache.org/", "project"), P.dell], videos: [yt("qt8bhOy65xg", "Introduction to Ozone on Cloudera Data Platform", "Cloudera, Inc.")] },
  "cloudera-sdx": { docs: [doc("Cloudera SDX", "https://www.cloudera.com/products/sdx.html", "product"), D.fabricProduct], videos: [local("sdx", "Cloudera SDX", { captions: true }), yt("aFHlU9P5mFg", "Data Sharing Powered by REST Catalog", "Cloudera, Inc.")] },
  "cloudera-data-lineage": { docs: [D.lineageProduct, P.octopai, P.federation], videos: [local("data-lineage", "Cloudera Data Lineage"), local("metadata-harvest", "Automated metadata harvesting"), yt("FEDicBHXkgc", "Cloudera Octopai Overview: Intelligent Automated Data Lineage", "OCTOPAI")] },
  "unified-data-fabric": { docs: [D.fabricProduct, P.federation, P.polaris], videos: [yt("Jr8FOQLgZcY", "Cloudera Unified Data Fabric: Automate Data Governance, Lineage, and Trust", "Cloudera, Inc.")] },
  "cloudera-anywhere-cloud": { docs: [D.anywhereProduct, P.anywhere, P.taikun], videos: [local("anywhere-cloud", "Cloudera Anywhere Cloud"), yt("-dtzknHhvTo", "From 60 Days to 60 Minutes: Introducing Cloudera Anywhere Cloud", "Cloudera, Inc.")] },
  "apache-spark": { docs: [doc("Apache Spark documentation", "https://spark.apache.org/docs/latest/", "project")], videos: [local("data-engineering", "Spark in Cloudera Data Engineering", { captions: true })] },
  "spark-4": { docs: [doc("Spark 4.0.0 release notes", "https://spark.apache.org/releases/spark-release-4-0-0.html", "project"), P.nvidiaSpark], videos: [yt("gWWysCAubRk", "What's New in Apache Spark 4.0?", "Databricks")] },
  "apache-nifi": { docs: [doc("Apache NiFi documentation", "https://nifi.apache.org/documentation/", "project")], videos: [local("cdf-overview", "NiFi in Cloudera Data Flow", { captions: true })] },
  "apache-kafka": { docs: [doc("Apache Kafka documentation", "https://kafka.apache.org/documentation/", "project")], videos: [yt("-DyWhcX3Dpc", "Introduction | Apache Kafka Fundamentals", "Confluent")] },
  "trino": { docs: [doc("Trino documentation", "https://trino.io/docs/current/", "project"), P.federation], videos: [yt("zA8RFDpoJ0A", "What is Trino?", "Starburst")] },
  "apache-iceberg": { docs: [doc("Apache Iceberg documentation", "https://iceberg.apache.org/docs/latest/", "project"), P.icebergRest, P.polaris], videos: [local("open-data-lakehouse", "Iceberg in the Cloudera lakehouse", { captions: true })] },
  "apache-flink": { docs: [doc("Apache Flink documentation", "https://nightlies.apache.org/flink/flink-docs-stable/", "project")], videos: [yt("PVoc5tRr6to", "What is Apache Flink?", "Confluent")] },
  "apache-impala": { docs: [doc("Apache Impala", "https://impala.apache.org/", "project")], videos: [yt("HSCJi4TnN3k", "Apache Impala 101: A quick-start guide", "Cloudera, Inc."), local("data-warehouse", "Impala in Cloudera Data Warehouse", { captions: true })] },
  "apache-hive": { docs: [doc("Apache Hive", "https://hive.apache.org/", "project")], videos: [local("data-warehouse", "Hive in Cloudera Data Warehouse", { captions: true })] },
  "apache-airflow": { docs: [doc("Apache Airflow documentation", "https://airflow.apache.org/docs/", "project")], videos: [local("data-engineering", "Airflow in Cloudera Data Engineering", { captions: true })] },
  "neo4j": { docs: [doc("Neo4j documentation", "https://neo4j.com/docs/", "project")], videos: [yt("HjvQSfGIyHo", "Neo4j Fundamentals", "Neo4j")] },
  "starrocks": { docs: [doc("StarRocks documentation", "https://docs.starrocks.io/", "project")], videos: [yt("-yVk7t942is", "What is StarRocks", "PhoenixAI")] },
  "clickhouse": { docs: [doc("ClickHouse documentation", "https://clickhouse.com/docs", "project")], videos: [yt("FtoWGT7kS-c", "What Is ClickHouse?", "ClickHouse")] },
  "apache-atlas": { docs: [doc("Apache Atlas", "https://atlas.apache.org/", "project")], videos: [yt("Cp1cYP7i8S8", "Data Lineage and Metadata Management Demo", "Cloudera, Inc."), local("metadata-harvest", "Automated metadata harvesting")] },
  "apache-ranger": { docs: [doc("Apache Ranger", "https://ranger.apache.org/", "project"), P.polaris], videos: [yt("9GIAwAaP5ek", "A Deep Dive into Apache Ranger's Architecture & Capabilities", "Cloudera, Inc."), local("sdx", "Cloudera SDX", { captions: true })] },
  "metadata-management": { docs: [P.icebergRest, D.fabricProduct], videos: [local("metadata-harvest", "Automated metadata harvesting")] },
  "data-lineage-concept": { docs: [D.lineageProduct, P.federation], videos: [local("data-lineage", "Cloudera Data Lineage")] },
  "access-control": { docs: [doc("Apache Ranger", "https://ranger.apache.org/", "project"), doc("Cloudera SDX", "https://www.cloudera.com/products/sdx.html", "product")], videos: [local("sdx", "Cloudera SDX", { captions: true })] },
  "security-policies-auditing": { docs: [doc("Apache Ranger", "https://ranger.apache.org/", "project"), D.fabricProduct], videos: [local("sdx", "Cloudera SDX", { captions: true })] },
  "google-cloud": { docs: [P.gcp, doc("Google Cloud", "https://cloud.google.com/", "vendor")], videos: [yt("KQm_mbHMKcU", "What's new in CDP Public Cloud?", "Cloudera, Inc.")] },
  "microsoft-azure": { docs: [P.azure, doc("Microsoft Azure", "https://azure.microsoft.com/", "vendor")], videos: [yt("rLgBlUC8TbU", "A deep look into Cloudera Data Platform | Open Azure Day", "Microsoft Azure")] },
  "aws": { docs: [P.aws, P.awsSovereign], videos: [yt("rf2RGi6xV5k", "Meet Cloudera at AWS Summit Washington DC 2026", "Cloudera, Inc.")] },
  "s3-storage": { docs: [doc("Amazon S3", "https://aws.amazon.com/s3/", "vendor"), doc("Apache Ozone", "https://ozone.apache.org/", "project")], videos: [yt("77lMCiiMilo", "Introduction to Amazon S3", "Amazon Web Services")] },
  "dell-technologies": { docs: [P.dell], videos: [local("private-ai", "Private AI with Cloudera", { captions: true })] },
  "nvidia": { docs: [P.nim, P.nvidiaSpark, P.nvidia2024], videos: [yt("RYcSax0zLcg", "Cloudera AI Inference Service Demo", "Cloudera, Inc."), local("ai-inference-secure", "Secure AI Inference demo")] },
  "amd": { docs: [doc("AMD EPYC server processors", "https://www.amd.com/en/products/processors/server/epyc.html", "vendor")], videos: [] },
  "on-premises-deployment": { docs: [P.privateAi, P.dell], videos: [local("hybrid-anywhere", "Hybrid data anywhere"), local("private-ai", "Private AI with Cloudera", { captions: true })] },
  "cloud-deployment": { docs: [D.anywhereProduct, P.awsSovereign], videos: [local("anywhere-cloud", "Cloudera Anywhere Cloud")] },
  "flow-seamless-transition": { docs: [D.anywhereProduct, P.anywhere], videos: [local("hybrid-anywhere", "Hybrid data anywhere")] },
  "flow-engines-query-platform": { docs: [P.federation, D.fabricProduct], videos: [local("anywhere-cloud", "Cloudera Anywhere Cloud")] },
  "flow-independent-integrated-data": { docs: [D.fabricProduct, P.polaris], videos: [local("hybrid-anywhere", "Hybrid data anywhere")] },
};

const statusFor = (url) => verification.urls?.[url];

export function resourcesFor(componentId) {
  const r = raw[componentId] || { docs: [], videos: [] };
  const mark = (item) => {
    if (item.type === "local") return { ...item, verified: true, verifiedBy: "Bundled with the booth" };
    const s = statusFor(item.url);
    return { ...item, verified: Boolean(s?.ok), checkedOn: s?.checkedOn || null, status: s?.status ?? null };
  };
  return { docs: r.docs.map(mark), videos: r.videos.map(mark) };
}

export const allResourceUrls = () => {
  const urls = new Set();
  Object.values(raw).forEach((r) => {
    r.docs.forEach((d) => urls.add(d.url));
    r.videos.filter((v) => v.type === "youtube").forEach((v) => urls.add(v.url));
  });
  return [...urls];
};

export const rawResources = raw;
