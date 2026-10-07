const v = (slug) => `/videos/${slug}.mp4`;

export const industries = [
  {
    id: "financial",
    name: "Banking & Financial Services",
    icon: "BFS",
    tagline: "Real-time insight on governed financial data.",
    overview:
      "Banks need unified data platforms that support fraud detection, risk modeling, and regulatory reporting while keeping sensitive data secure and auditable.",
    businessValue:
      "Faster detection of fraud and risk signals, stronger customer intelligence, and more reliable regulatory reporting on a governed foundation.",
    relatedServiceIds: ["dataflow", "lakehouse", "warehouse", "sdx", "privateai"],
    url: "https://www.cloudera.com/solutions/financial-services.html",
    useCases: [
      {
        id: "fraud",
        title: "Real-time fraud detection",
        summary: "Stream transactions and score risk in motion before settlement.",
        flow: ["Data Sources", "Ingestion", "Stream Processing", "Lakehouse", "Governance", "Analytics / AI", "Fraud outcome"],
        serviceIds: ["dataflow", "lakehouse", "privateai", "sdx"],
      },
      {
        id: "risk",
        title: "Risk analytics",
        summary: "Unified risk models across trading, credit, and operational data.",
        flow: ["Data Sources", "Ingestion", "Processing", "Storage", "Governance", "Analytics", "Risk decisions"],
        serviceIds: ["engineering", "lakehouse", "warehouse", "sdx"],
      },
      {
        id: "customer",
        title: "Customer intelligence",
        summary: "360° customer views for personalization and retention.",
        flow: ["Data Sources", "Ingestion", "Processing", "Lakehouse", "Governance", "Analytics / AI", "Customer insight"],
        serviceIds: ["engineering", "lakehouse", "warehouse", "privateai"],
      },
      {
        id: "regulatory",
        title: "Regulatory reporting",
        summary: "Lineage-backed reporting for auditors and regulators.",
        flow: ["Data Sources", "Ingestion", "Storage", "Governance", "Analytics", "Reporting outcome"],
        serviceIds: ["lakehouse", "sdx", "warehouse"],
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: "INS",
    tagline: "Smarter claims, pricing, and customer risk.",
    overview:
      "Insurers combine telematics, claims, and policy data to improve underwriting, detect fraud, and deliver usage-based products.",
    businessValue:
      "More accurate risk pricing, faster claims resolution, and improved customer trust through governed analytics.",
    relatedServiceIds: ["dataflow", "engineering", "lakehouse", "warehouse", "sdx"],
    url: "https://www.cloudera.com/solutions/insurance.html",
    useCases: [
      { id: "claims", title: "Claims analytics", summary: "Analyze claims patterns to reduce leakage.", flow: ["IoT & policy data", "Ingestion", "Processing", "Storage", "Governance", "Analytics", "Claims outcome"], serviceIds: ["dataflow", "engineering", "lakehouse", "warehouse"] },
      { id: "fraud-ins", title: "Fraud detection", summary: "Identify anomalous claims and providers.", flow: ["Data Sources", "Ingestion", "Processing", "Lakehouse", "Governance", "AI", "Fraud alerts"], serviceIds: ["dataflow", "privateai", "sdx"] },
      { id: "risk-ins", title: "Customer risk analysis", summary: "Usage-based and behavioral risk scoring.", flow: ["Telematics", "Ingestion", "Stream", "Storage", "Governance", "Analytics", "Pricing"], serviceIds: ["dataflow", "lakehouse", "warehouse"] },
      { id: "ubi", title: "Usage-based insurance", summary: "Product models driven by real driving or usage data.", flow: ["Edge data", "Ingestion", "Processing", "Lakehouse", "Governance", "Analytics", "UBI product"], serviceIds: ["dataflow", "engineering", "lakehouse"] },
    ],
  },
  {
    id: "telco",
    name: "Telecommunications",
    icon: "TEL",
    tagline: "Network and customer analytics at scale.",
    overview:
      "Operators optimize networks, reduce churn, and monetize usage data with streaming and large-scale analytics.",
    businessValue:
      "Better network performance, proactive churn management, and billing accuracy on unified data.",
    relatedServiceIds: ["dataflow", "engineering", "lakehouse", "warehouse", "privateai"],
    url: "https://www.cloudera.com/solutions/telecommunications.html",
    useCases: [
      { id: "network", title: "Network optimization", summary: "Correlate telemetry for capacity planning.", flow: ["Network probes", "Ingestion", "Stream processing", "Storage", "Governance", "Analytics", "Network outcome"], serviceIds: ["dataflow", "engineering", "lakehouse"] },
      { id: "churn", title: "Customer churn analytics", summary: "Predict churn from usage and support signals.", flow: ["CRM & usage", "Ingestion", "Processing", "Lakehouse", "Governance", "AI", "Retention"], serviceIds: ["engineering", "lakehouse", "privateai"] },
      { id: "anomaly", title: "Network anomaly detection", summary: "Detect faults and security events in real time.", flow: ["Streams", "Ingestion", "Processing", "Governance", "AI", "Alerts"], serviceIds: ["dataflow", "privateai", "sdx"] },
      { id: "billing", title: "Usage and billing analytics", summary: "Reconcile usage records for billing accuracy.", flow: ["CDR data", "Ingestion", "Processing", "Warehouse", "Governance", "Analytics", "Billing"], serviceIds: ["dataflow", "warehouse", "engineering"] },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    icon: "HLS",
    tagline: "Secure analytics for care and research.",
    overview:
      "Health organizations need interoperability, governance, and AI on patient and research data without compromising privacy.",
    businessValue:
      "Safer research acceleration, governed AI, and trusted sharing across care settings.",
    relatedServiceIds: ["lakehouse", "sdx", "privateai", "engineering", "agents"],
    url: "https://www.cloudera.com/solutions/life-sciences.html",
    useCases: [
      { id: "patient", title: "Secure patient data analytics", summary: "Analytics on de-identified and governed datasets.", flow: ["Clinical systems", "Ingestion", "Processing", "Lakehouse", "Governance", "Analytics", "Care insight"], serviceIds: ["engineering", "lakehouse", "sdx"] },
      { id: "research", title: "Clinical research", summary: "Integrate trial and real-world evidence.", flow: ["Trial data", "Ingestion", "Processing", "Storage", "Governance", "Analytics", "Research outcome"], serviceIds: ["engineering", "lakehouse", "sdx"] },
      { id: "hai", title: "Healthcare AI", summary: "GenAI and ML on private, governed health data.", flow: ["Data Sources", "Lakehouse", "Governance", "Private AI", "Clinical AI apps"], serviceIds: ["lakehouse", "privateai", "sdx"] },
      { id: "interop", title: "Data interoperability & governance", summary: "Metadata, lineage, and policy across systems.", flow: ["Sources", "Ingestion", "Catalog", "Governance", "Sharing", "Outcome"], serviceIds: ["sdx", "dataflow", "lakehouse"] },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "MFG",
    tagline: "Industrial IoT and connected products.",
    overview:
      "Manufacturers unify plant, supply chain, and product telemetry for quality, maintenance, and innovation.",
    businessValue:
      "Less unplanned downtime, higher quality yields, and smarter connected products.",
    relatedServiceIds: ["dataflow", "engineering", "lakehouse", "privateai", "warehouse"],
    url: "https://www.cloudera.com/solutions/manufacturing.html",
    useCases: [
      { id: "maint", title: "Predictive maintenance", summary: "Sensor-driven failure prediction.", flow: ["IoT sensors", "Ingestion", "Stream", "Processing", "Lakehouse", "AI", "Maintenance"], serviceIds: ["dataflow", "engineering", "privateai"] },
      { id: "iiot", title: "Industrial IoT analytics", summary: "High-volume telemetry at the edge and in cloud.", flow: ["Edge", "Ingestion", "Processing", "Storage", "Governance", "Analytics", "Operations"], serviceIds: ["dataflow", "lakehouse", "engineering"] },
      { id: "quality", title: "Quality monitoring", summary: "Detect defects across production lines.", flow: ["Plant data", "Ingestion", "Processing", "Warehouse", "Analytics", "Quality outcome"], serviceIds: ["dataflow", "warehouse", "engineering"] },
      { id: "connected", title: "Connected-product intelligence", summary: "Product usage feedback into R&D.", flow: ["Product telemetry", "Ingestion", "Lakehouse", "Governance", "Analytics", "Product insight"], serviceIds: ["dataflow", "lakehouse", "warehouse"] },
    ],
  },
  {
    id: "pharma",
    name: "Pharmaceuticals",
    icon: "PHR",
    tagline: "Governed data for trials and discovery.",
    overview:
      "Pharma teams integrate clinical, genomic, and operational data to accelerate trials and research with full governance.",
    businessValue:
      "Faster trial insights, integrated research data, and compliant AI for discovery.",
    relatedServiceIds: ["engineering", "lakehouse", "sdx", "privateai", "agents"],
    url: "https://www.cloudera.com/solutions/life-sciences.html",
    video: v("pharma-clinical"),
    useCases: [
      { id: "trials", title: "Clinical trial analytics", summary: "Optimize design and recruitment with unified data.", flow: ["Trial systems", "Ingestion", "Processing", "Lakehouse", "Governance", "Analytics", "Trial outcome"], serviceIds: ["engineering", "lakehouse", "sdx"] },
      { id: "integration", title: "Research data integration", summary: "Combine genomic, clinical, and operational sources.", flow: ["Sources", "Ingestion", "Processing", "Storage", "Governance", "Analytics", "Research"], serviceIds: ["engineering", "lakehouse", "sdx"] },
      { id: "drugdev", title: "Drug development analytics", summary: "Analytics pipelines for discovery milestones.", flow: ["Lab data", "Processing", "Lakehouse", "Governance", "AI", "Development"], serviceIds: ["engineering", "lakehouse", "privateai"] },
      { id: "governed-ai", title: "Governed AI for research", summary: "Private AI on sensitive research datasets.", flow: ["Research data", "Lakehouse", "Governance", "Private AI", "Research apps"], serviceIds: ["privateai", "sdx", "agents"] },
    ],
  },
];

export const industryById = Object.fromEntries(industries.map((i) => [i.id, i]));

export const domains = industries.map((i) => ({
  id: i.id,
  name: i.name,
  icon: i.icon,
  type: i.video ? "video" : "link",
  blurb: i.tagline,
  url: i.url,
  lead: i.overview,
  points: i.useCases?.map((u) => u.title) ?? [],
  video: i.video ?? null,
  captions: null,
}));
