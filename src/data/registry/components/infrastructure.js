// Infrastructure: clouds, storage and hardware partners in the deployment footer.

const infra = (c) => ({ category: "infrastructure", ...c });

const cloudView = (id, name, services) => ({
  internal: {
    nodes: [
      ["cdp", "Cloudera environment", "Cloudera services deployed in the customer's account.", "cloudera", "cloud-deployment"],
      ["focus", name, "Cloud provider.", "focus"],
      { id: "svc", label: "Provider services used", kind: "cloud", description: "Building blocks Cloudera runs on.",
        children: services.map(([cid, l, d]) => [cid, l, d, "cloud"]), childEdges: [] },
      ["iam", "Provider IAM", "Roles Cloudera assumes.", "security"],
      ["fabric", "Unified Data Fabric", "Governance across clouds.", "cloudera", "unified-data-fabric"],
    ],
    edges: [["cdp", "focus", "runs in"], ["focus", "svc"], ["iam", "cdp", "credentials", { dashed: true }], ["fabric", "cdp", "", { dashed: true }]],
  },
  dataFlow: {
    nodes: [["src", "On-prem / SaaS sources", "", "external"], ["store", "Cloud object storage", "", "store", "s3-storage"], ["engines", "Cloudera engines", "", "apache", "apache-spark"], ["users", "Users & apps", "", "client"]],
    edges: [["src", "store", "ingest"], ["store", "engines"], ["engines", "users"]],
  },
  deployment: {
    nodes: [["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", name, "", "focus"], ["onprem", "On premises", "", "cloudera", "on-premises-deployment"]],
    edges: [["acc", "focus"], ["acc", "onprem", "hybrid", { dashed: true }]],
  },
});

const cloudShared = (name, id) => ({
  origin: "cloud-provider",
  parentId: "cloud-deployment",
  workflow: {
    stages: [
      ["account", "Prepare account", `Networking, IAM roles and storage are prepared in ${name}.`],
      ["register", "Register environment", "A Cloudera environment is registered with credentials.", "cloud-deployment"],
      ["datalake", "Create Data Lake / fabric", "Security and governance services start.", "cloudera-sdx"],
      ["services", "Deploy services", "Data services or Anywhere Cloud modules deploy.", "cloudera-data-services-2"],
      ["data", "Store data", "Data lives in the provider's object storage.", "s3-storage"],
    ],
  },
  io: { inputs: ["Cloud credentials", "Network config"], outputs: ["Running Cloudera services"], dependencies: [`${name} account`], connectors: ["Native object storage"], apis: [`${name} APIs (used by Cloudera control plane)`], integrations: ["Cloudera environments"] },
  ops: { security: "Least-privilege IAM, private networking, encryption with provider KMS.", governance: "Cloudera SDX/fabric policies on top of provider controls.", monitoring: "Cloudera observability plus provider monitoring.", scalability: "Elastic compute and storage." },
  useCases: [{ title: "Burst analytics", scenario: "Elastic compute in the cloud.", industryIds: ["telco", "financial"] }],
  relatedComponentIds: ["cloud-deployment", "cloudera-anywhere-cloud", "s3-storage", "unified-data-fabric"],
  clouderaContext: {
    standalone: `${name} is an independent cloud provider.`,
    clouderaIntegration: `Cloudera runs its services inside customer ${name} accounts and Anywhere Cloud lists public cloud among its deployment targets.`,
    realWorld: `A retailer runs seasonal analytics in ${name} while governed core data stays on premises.`,
  },
  id,
});

const gcp = infra({
  ...cloudShared("Google Cloud", "google-cloud"), name: "Google Cloud",
  tagline: "Run Cloudera services on Google Cloud.",
  overview: "Google Cloud is one of the public clouds in the diagram's Cloud deployment group. Cloudera services use Google Compute Engine/GKE for compute and Google Cloud Storage for data, under Cloudera's security and governance.",
  capabilities: ["Compute Engine / GKE compute", "Google Cloud Storage", "Cloud IAM integration"],
  verificationNotes: ["Service availability on Google Cloud varies by Cloudera service and release — check the support matrix."],
  views: cloudView("google-cloud", "Google Cloud", [["gce", "Compute Engine / GKE", "Compute."], ["gcs", "Cloud Storage", "Objects."]]),
});
const azure = infra({
  ...cloudShared("Microsoft Azure", "microsoft-azure"), name: "Microsoft Azure",
  tagline: "Run Cloudera services on Azure.",
  overview: "Microsoft Azure is one of the public clouds in the Cloud deployment group. Cloudera services use Azure VMs/AKS for compute and ADLS Gen2 for data, with Azure managed identities.",
  capabilities: ["Azure VMs / AKS", "ADLS Gen2 storage", "Managed identities"],
  views: cloudView("microsoft-azure", "Microsoft Azure", [["vm", "VMs / AKS", "Compute."], ["adls", "ADLS Gen2", "Objects."]]),
});
const aws = infra({
  ...cloudShared("AWS", "aws"), name: "Amazon Web Services",
  tagline: "Run Cloudera services on AWS.",
  overview: "AWS is one of the public clouds in the Cloud deployment group. Cloudera services use EC2/EKS for compute and Amazon S3 for data, with IAM roles.",
  capabilities: ["EC2 / EKS", "Amazon S3", "IAM roles"],
  views: cloudView("aws", "AWS", [["ec2", "EC2 / EKS", "Compute."], ["s3", "Amazon S3", "Objects."]]),
});

const s3 = infra({
  id: "s3-storage", name: "S3 / S3-compatible Storage", origin: "capability", parentId: "on-premises-deployment",
  tagline: "The S3 API as the common storage contract for the lakehouse.",
  overview: "The 'S3' logo in the on-premises footer represents S3-compatible object storage. The S3 API has become the common contract between engines and storage: Amazon S3 in AWS, and on premises Apache Ozone's S3 Gateway or certified arrays such as Dell ObjectScale expose the same API, so Iceberg tables and engines work the same way.",
  capabilities: ["S3 REST API (PUT/GET/LIST)", "Buckets and prefixes", "Multipart upload", "Server-side encryption"],
  contexts: { onprem: "In the on-prem footer this is customer-run S3-compatible storage." },
  workflow: { stages: [["bucket", "Create bucket", "Admin creates a bucket and access keys."], ["write", "Write objects", "Engines write Parquet + Iceberg metadata.", "apache-iceberg"], ["read", "Read objects", "Engines read with range requests.", "trino"], ["secure", "Secure", "Encryption and Ranger/IAM policies.", "apache-ranger"]] },
  views: {
    internal: { nodes: [["clients", "Engines", "", "apache"], ["api", "S3 API", "", "focus"], ["ozone", "Ozone S3 Gateway", "", "cloudera", "cloudera-object-store"], ["dell", "Dell ObjectScale", "", "vendor", "dell-technologies"], ["aws", "Amazon S3", "", "cloud", "aws"]], edges: [["clients", "api"], ["api", "ozone"], ["api", "dell"], ["api", "aws"]] },
    dataFlow: { nodes: [["w", "Writer", "", "apache"], ["b", "Bucket", "", "store"], ["r", "Reader", "", "apache"]], edges: [["w", "b"], ["b", "r"]] },
    deployment: { nodes: [["onprem", "On premises", "", "cloudera", "on-premises-deployment"], ["cloud", "Cloud", "", "cloud", "cloud-deployment"], ["focus", "S3 API", "", "focus"]], edges: [["onprem", "focus"], ["cloud", "focus"]] },
  },
  io: { inputs: ["Objects"], outputs: ["Objects"], dependencies: ["Storage system"], connectors: ["S3A"], apis: ["S3 REST"], integrations: ["Iceberg"] },
  ops: { security: "Access keys/IAM, TLS, encryption.", governance: "Ranger (Ozone) or bucket policies.", monitoring: "Storage metrics.", scalability: "Scale-out." },
  clouderaContext: { standalone: "S3 is an AWS service; the API is widely implemented.", clouderaIntegration: "Cloudera engines use S3A to reach any S3-compatible store.", realWorld: "The same Iceberg table layout runs on Ozone on-prem and Amazon S3 in the cloud." },
  useCases: [{ title: "Portable lakehouse storage", scenario: "Same API everywhere.", industryIds: ["financial", "manufacturing"] }],
  relatedComponentIds: ["cloudera-object-store", "dell-technologies", "aws", "apache-iceberg"],
});

const hw = (c) => ({ category: "infrastructure", origin: "hardware-vendor", parentId: "on-premises-deployment", ...c });

const dell = hw({
  id: "dell-technologies", name: "Dell Technologies",
  tagline: "Dell ObjectScale certified with Cloudera for private AI.",
  overview: "Dell appears in the on-premises footer. Cloudera announced (Sep 2025) that Dell ObjectScale is certified with Cloudera for a Private AI platform, with all Cloudera compute engines able to run against ObjectScale as S3-compatible object storage, alongside Dell compute servers in customer data centers.",
  capabilities: ["Dell ObjectScale S3-compatible storage (certified)", "Dell PowerEdge compute for clusters", "Private AI reference deployments"],
  workflow: { stages: [["plan", "Size hardware", "Choose compute and storage."], ["deploy", "Deploy ObjectScale", "S3 endpoints and buckets.", "s3-storage"], ["connect", "Connect Cloudera", "Engines use S3A to ObjectScale.", "cloudera-object-store"], ["run", "Run workloads", "Analytics and private AI on premises.", "cloudera-ai"]] },
  views: {
    internal: { nodes: [["engines", "Cloudera engines", "Spark, Impala, Trino…", "apache", "apache-spark"], ["focus", "Dell ObjectScale", "S3-compatible object storage.", "focus"], ["servers", "Dell servers", "Compute.", "vendor"], ["gpu", "GPU servers", "Accelerated compute.", "vendor", "nvidia"], ["cloudera", "Cloudera platform", "Runs on Dell compute.", "cloudera", "cloudera-base-datahub"]], edges: [["engines", "focus", "S3"], ["servers", "cloudera"], ["gpu", "cloudera", "", { dashed: true }], ["cloudera", "engines"]] },
    dataFlow: { nodes: [["ingest", "Ingest", "NiFi flows.", "apache", "apache-nifi"], ["os", "ObjectScale bucket", "Lakehouse storage.", "focus"], ["ai", "Private AI", "Cloudera AI.", "cloudera", "cloudera-ai"]], edges: [["ingest", "os"], ["os", "ai"]] },
    deployment: { nodes: [["dc", "Customer data center", "", "cloudera", "on-premises-deployment"], ["focus", "Dell infrastructure", "", "focus"], ["acc", "Anywhere Cloud (private)", "", "cloudera", "cloudera-anywhere-cloud"]], edges: [["dc", "focus"], ["acc", "focus", "runs on"]] },
  },
  io: { inputs: ["Objects from engines"], outputs: ["Stored data"], dependencies: ["Data center"], connectors: ["S3 API"], apis: ["S3"], integrations: ["Cloudera engines"] },
  ops: { security: "Encryption, access keys.", governance: "Cloudera SDX on top.", monitoring: "Dell and Cloudera tooling.", scalability: "Scale-out storage." },
  clouderaContext: { standalone: "Dell is an independent hardware vendor.", clouderaIntegration: "ObjectScale certified with Cloudera (Sep 2025).", realWorld: "A hospital builds a private AI platform on Dell storage and Cloudera AI." },
  useCases: [{ title: "Private AI on premises", scenario: "Keep data in the data center.", industryIds: ["healthcare", "financial"] }],
  relatedComponentIds: ["s3-storage", "cloudera-object-store", "nvidia", "on-premises-deployment"],
});

const nvidia = hw({
  id: "nvidia", name: "NVIDIA",
  tagline: "GPU acceleration for Cloudera AI inference and Spark.",
  overview: "NVIDIA appears in the on-premises footer. Cloudera announced an NVIDIA microservices collaboration (Mar 2024), the Cloudera AI Inference service with embedded NVIDIA NIM microservices (Oct 2024), and cuDF GPU acceleration for Apache Spark 4.1 in Cloudera Data Engineering as part of Anywhere Cloud, with up to 4x acceleration (Aug 2026).",
  capabilities: ["NVIDIA GPUs for training and inference", "NVIDIA NIM in Cloudera AI Inference", "cuDF acceleration for Spark 4.1 (announced)"],
  workflow: { stages: [["gpu", "Provision GPUs", "GPU nodes join the Kubernetes cluster."], ["nim", "Deploy NIM", "Optimized LLM containers in AI Inference.", "cloudera-ai"], ["spark", "Accelerate Spark", "cuDF accelerates supported operators.", "data-engineering-2"], ["serve", "Serve & scale", "Endpoints autoscale on GPUs."]] },
  views: {
    internal: { nodes: [["focus", "NVIDIA GPUs", "Accelerated compute.", "focus"], ["nim", "NIM microservices", "Optimized inference containers.", "vendor"], ["cudf", "cuDF for Spark", "GPU dataframe acceleration.", "vendor"], ["inference", "Cloudera AI Inference", "", "cloudera", "cloudera-ai"], ["de", "Data Engineering 2.0", "", "cloudera", "data-engineering-2"]], edges: [["focus", "nim"], ["focus", "cudf"], ["nim", "inference"], ["cudf", "de"]] },
    dataFlow: { nodes: [["data", "Governed data", "", "store"], ["gpu", "GPU job", "", "focus"], ["out", "Model / results", "", "data"]], edges: [["data", "gpu"], ["gpu", "out"]] },
    deployment: { nodes: [["dc", "On premises", "", "cloudera", "on-premises-deployment"], ["cloud", "Cloud GPUs", "", "cloud", "cloud-deployment"], ["focus", "NVIDIA", "", "focus"]], edges: [["focus", "dc"], ["focus", "cloud"]] },
  },
  io: { inputs: ["Models", "Spark plans"], outputs: ["Accelerated results"], dependencies: ["GPU drivers/operators"], connectors: ["NIM containers"], apis: ["OpenAI-compatible endpoints"], integrations: ["Cloudera AI", "CDE"] },
  ops: { security: "Runs inside the customer environment.", governance: "Data governed by SDX/fabric.", monitoring: "GPU utilization.", scalability: "GPU node pools." },
  clouderaContext: { standalone: "NVIDIA is an independent hardware and software vendor.", clouderaIntegration: "NIM in AI Inference; cuDF for Spark in CDE.", realWorld: "A bank serves a private LLM on NVIDIA GPUs for analyst research." },
  useCases: [{ title: "Private LLM inference", scenario: "On-prem GenAI.", industryIds: ["financial", "healthcare", "pharma"] }],
  relatedComponentIds: ["cloudera-ai", "data-engineering-2", "spark-4", "dell-technologies"],
});

const amd = hw({
  id: "amd", name: "AMD",
  tagline: "Shown in the official diagram — Cloudera partnership details need verification.",
  overview: "AMD appears as a logo in the on-premises footer of the official umbrella diagram. We could not find a Cloudera source describing a specific AMD integration, so this page only describes AMD's general role as a CPU/GPU vendor for on-prem infrastructure.",
  needsVerification: true,
  illustrative: true,
  verificationNotes: ["No Cloudera press release or documentation describing an AMD integration was found — treat as unverified."],
  capabilities: ["x86 server CPUs commonly used in data center clusters", "GPU accelerators (general vendor capability)"],
  workflow: { stages: [["select", "Select hardware", "Choose servers for the cluster."], ["certify", "Check support matrix", "Confirm OS/hardware support for Cloudera."], ["deploy", "Deploy", "Install the platform.", "cloudera-base-datahub"], ["run", "Run workloads", "Engines run on the hosts."]] },
  views: {
    internal: { nodes: [["focus", "AMD hardware", "Illustrative.", "focus"], ["hosts", "Cluster hosts", "Servers.", "core"], ["platform", "Cloudera Platform", "", "cloudera", "cloudera-platform"], ["engines", "Engines", "Workloads.", "apache"], ["mgr", "Cloudera Manager", "Host metrics.", "cloudera", "cloudera-manager"]], edges: [["focus", "hosts", "", { dashed: true }], ["hosts", "platform"], ["platform", "engines"], ["mgr", "hosts", "", { dashed: true }]] },
    dataFlow: { nodes: [["d", "Data", "", "store"], ["h", "Hosts", "", "focus"], ["r", "Results", "", "data"]], edges: [["d", "h"], ["h", "r"]] },
    deployment: { nodes: [["dc", "On premises", "", "cloudera", "on-premises-deployment"], ["focus", "AMD", "", "focus"]], edges: [["focus", "dc", "", { dashed: true }]] },
  },
  io: { inputs: ["—"], outputs: ["—"], dependencies: ["Data center"], connectors: ["—"], apis: ["—"], integrations: ["Needs verification"] },
  ops: { security: "Platform security applies.", governance: "SDX.", monitoring: "Cloudera Manager host metrics.", scalability: "Add hosts." },
  clouderaContext: { standalone: "AMD is an independent semiconductor company.", clouderaIntegration: "Shown in the official diagram; integration details unverified.", realWorld: "Illustrative: a cluster built on AMD-based servers." },
  useCases: [{ title: "Illustrative hardware choice", scenario: "Server selection for clusters.", industryIds: ["manufacturing"] }],
  relatedComponentIds: ["on-premises-deployment", "nvidia", "dell-technologies"],
});

const group = (c) => ({ category: "infrastructure", origin: "capability", ...c });

const onprem = group({
  id: "on-premises-deployment", name: "On-Premises Deployment",
  tagline: "Run Cloudera in your own data centers — private, sovereign or air-gapped.",
  overview: "The On-Premises group in the footer shows the infrastructure customers run themselves: object storage, Dell, S3-compatible storage, NVIDIA and AMD hardware. Cloudera Base, Data Services 1.5.x and Anywhere Cloud (private, sovereign and air-gapped) all deploy here.",
  capabilities: ["Bare metal or virtualized hosts", "Kubernetes for Data Services / Anywhere Cloud", "Air-gapped installs", "Hardware partners (Dell ObjectScale certified with Cloudera, Sep 2025)"],
  workflow: { stages: [["infra", "Provide infrastructure", "Servers, storage, network.", "dell-technologies"], ["k8s", "Kubernetes", "For containerized services."], ["install", "Install Cloudera", "Base or Anywhere Cloud.", "cloudera-base-datahub"], ["secure", "Secure", "SDX / fabric.", "cloudera-sdx"], ["run", "Run", "Workloads near the data."]] },
  views: {
    internal: { nodes: [["focus", "On premises", "", "focus"], ["obj", "Object Store", "", "store", "cloudera-object-store"], ["dell", "Dell", "", "vendor", "dell-technologies"], ["s3", "S3", "", "store", "s3-storage"], ["nvidia", "NVIDIA", "", "vendor", "nvidia"], ["amd", "AMD", "Processor and accelerator hardware option.", "vendor", "amd"]], edges: [["focus", "obj"], ["focus", "dell"], ["focus", "s3"], ["focus", "nvidia"], ["focus", "amd", "", { dashed: true }]] },
    dataFlow: { nodes: [["src", "Plant/branch sources", "", "external"], ["dc", "Data center lakehouse", "", "focus"], ["users", "Users", "", "client"]], edges: [["src", "dc"], ["dc", "users"]] },
    deployment: { nodes: [["base", "Cloudera Base", "", "cloudera", "cloudera-base-datahub"], ["acc", "Anywhere Cloud private", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", "On premises", "", "focus"]], edges: [["base", "focus"], ["acc", "focus"]] },
  },
  io: { inputs: ["Hardware"], outputs: ["Platform capacity"], dependencies: ["Data center"], connectors: ["—"], apis: ["—"], integrations: ["Dell", "NVIDIA"] },
  ops: { security: "Physical + SDX controls.", governance: "Data residency.", monitoring: "Cloudera Manager.", scalability: "Add hardware." },
  clouderaContext: { standalone: "General deployment model.", clouderaIntegration: "Footer group of the umbrella diagram.", realWorld: "A defense contractor runs air-gapped analytics." },
  useCases: [{ title: "Data residency", scenario: "Keep data in-country.", industryIds: ["financial", "healthcare"] }],
  relatedComponentIds: ["dell-technologies", "nvidia", "amd", "s3-storage", "cloudera-object-store"],
});

const cloud = group({
  id: "cloud-deployment", name: "Cloud Deployment",
  tagline: "Run Cloudera services in AWS, Azure and Google Cloud.",
  overview: "The Cloud group in the footer shows the public clouds where Cloudera services run in customer accounts. Anywhere Cloud lists public cloud among its deployment targets alongside sovereign, private and air-gapped environments.",
  capabilities: ["Customer-account deployments", "Native object storage", "Elastic compute", "Hybrid with on premises"],
  workflow: { stages: [["choose", "Choose provider", "AWS, Azure or Google Cloud."], ["env", "Register environment", "Credentials and networking."], ["deploy", "Deploy services", "Anywhere Cloud modules.", "cloudera-anywhere-cloud"], ["govern", "Govern", "Fabric spans clouds.", "unified-data-fabric"]] },
  views: {
    internal: { nodes: [["focus", "Cloud", "", "focus"], ["gcp", "Google Cloud", "", "cloud", "google-cloud"], ["azure", "Azure", "", "cloud", "microsoft-azure"], ["aws", "AWS", "", "cloud", "aws"], ["fabric", "Fabric", "", "cloudera", "unified-data-fabric"]], edges: [["focus", "gcp"], ["focus", "azure"], ["focus", "aws"], ["fabric", "focus", "", { dashed: true }]] },
    dataFlow: { nodes: [["onprem", "On-prem data", "", "store"], ["cloud", "Cloud object storage", "", "focus"], ["users", "Users", "", "client"]], edges: [["onprem", "cloud", "replicate / federate", { dashed: true }], ["cloud", "users"]] },
    deployment: { nodes: [["acc", "Anywhere Cloud", "", "cloudera", "cloudera-anywhere-cloud"], ["focus", "Cloud", "", "focus"], ["onprem", "On premises", "", "cloudera", "on-premises-deployment"]], edges: [["acc", "focus"], ["acc", "onprem"]] },
  },
  io: { inputs: ["Cloud accounts"], outputs: ["Cloudera environments"], dependencies: ["Provider"], connectors: ["Object storage"], apis: ["Provider APIs"], integrations: ["AWS", "Azure", "GCP"] },
  ops: { security: "IAM + SDX.", governance: "Fabric.", monitoring: "Observability.", scalability: "Elastic." },
  clouderaContext: { standalone: "General deployment model.", clouderaIntegration: "Footer group of the umbrella diagram.", realWorld: "A telco bursts ML training into the cloud." },
  useCases: [{ title: "Elastic capacity", scenario: "Burst workloads.", industryIds: ["telco"] }],
  relatedComponentIds: ["aws", "microsoft-azure", "google-cloud", "cloudera-anywhere-cloud"],
});

export default [gcp, azure, aws, s3, dell, nvidia, amd, onprem, cloud];
