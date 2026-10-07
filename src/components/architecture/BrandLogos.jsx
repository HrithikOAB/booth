/**
 * Crisp hand-built SVG approximations of the brand marks shown in the official
 * Cloudera architecture diagram. One <BrandLogo id="..." /> entry point so the
 * V2 diagram can render recognizable logos instead of plain text chips.
 *
 * Each entry returns an inline-flex chip: an SVG icon + a label. Layout/border
 * come from the `.eng-brand` class (see architecture-v2.css); id-specific color
 * accents come from `.eng-brand--<id>`.
 */

const ic = { className: "eng-logo-ic", "aria-hidden": true, focusable: "false" };

/* Apache Spark — pinwheel of flame "petals" */
function SparkIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <g fill="none" stroke="#e8590c" strokeWidth="2" strokeLinecap="round">
        <path d="M12 3c3 2 1 5 3 7" />
        <path d="M12 3c-3 2-1 6-4 7" />
        <path d="M5 11c3 1 4 3 7 3" />
        <path d="M19 11c-3 1-4 4-7 4" />
      </g>
      <circle cx="12" cy="12" r="2.4" fill="#f2662d" />
    </svg>
  );
}

/* Apache NiFi — flowing droplet */
function NifiIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="#728e9b" />
      <path d="M12 7c2 3 3 5 3 7a3 3 0 0 1-6 0c0-2 1-4 3-7z" fill="#fff" opacity="0.5" />
    </svg>
  );
}

/* Apache Kafka — connected nodes */
function KafkaIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <g stroke="#231f20" strokeWidth="1.6">
        <path d="M8 7l6 5M8 17l6-5" />
      </g>
      <g fill="#231f20">
        <circle cx="8" cy="7" r="2.2" />
        <circle cx="8" cy="17" r="2.2" />
        <circle cx="16" cy="12" r="2.6" />
      </g>
    </svg>
  );
}

/* Trino — rabbit */
function TrinoIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <g fill="#dd00a1">
        <path d="M8 4c1 2 1 5 1 7l-2-1c-1-3-1-5 1-6z" />
        <path d="M14 4c-1 2-1 5-1 7l2-1c1-3 1-5-1-6z" />
        <circle cx="11" cy="15" r="5" />
      </g>
      <circle cx="9.4" cy="14" r="0.9" fill="#fff" />
      <circle cx="12.6" cy="14" r="0.9" fill="#fff" />
    </svg>
  );
}

/* neo4j — graph of three dots */
function Neo4jIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <g stroke="#018bff" strokeWidth="1.6">
        <path d="M6 16l5-8M11 8l6 5" />
      </g>
      <g fill="#018bff">
        <circle cx="6" cy="16" r="2.4" />
        <circle cx="11" cy="8" r="2.4" />
        <circle cx="17" cy="13" r="2.4" />
      </g>
    </svg>
  );
}

/* StarRocks — rounded star */
function StarRocksIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path
        d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.3l5.9-.9z"
        fill="#00b2ff"
      />
    </svg>
  );
}

/* ClickHouse — yellow bars */
function ClickHouseIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <g fill="#ffcc00">
        <rect x="4" y="5" width="3" height="14" rx="0.5" />
        <rect x="9" y="5" width="3" height="14" rx="0.5" />
        <rect x="14" y="5" width="3" height="14" rx="0.5" />
        <rect x="19" y="10" width="2" height="4" rx="0.5" />
      </g>
    </svg>
  );
}

/* Google Cloud — four-color circle */
function GoogleCloudIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path d="M12 5a7 7 0 0 1 6.1 3.5l-3 1.7A3.5 3.5 0 0 0 12 8.5z" fill="#ea4335" />
      <path d="M18.1 8.5A7 7 0 0 1 19 12a7 7 0 0 1-.9 3.5l-3-1.7A3.5 3.5 0 0 0 15.5 12a3.5 3.5 0 0 0-.4-1.8z" fill="#fbbc05" />
      <path d="M18.1 15.5A7 7 0 0 1 12 19a7 7 0 0 1-6.1-3.5l3-1.7A3.5 3.5 0 0 0 12 15.5a3.5 3.5 0 0 0 3.1-1.7z" fill="#34a853" />
      <path d="M5.9 15.5A7 7 0 0 1 5 12a7 7 0 0 1 7-7v3.5A3.5 3.5 0 0 0 8.5 12c0 .6.1 1.2.4 1.8z" fill="#4285f4" />
    </svg>
  );
}

/* Microsoft Azure — triangular "A" */
function AzureIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path d="M10 4L4 19h4l2-5 3 3-6 2h12L10 4z" fill="#0089d6" />
    </svg>
  );
}

/* AWS — smile arrow */
function AwsIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <text x="12" y="12" textAnchor="middle" fontSize="7" fontWeight="800" fill="#232f3e" fontFamily="Inter, sans-serif">
        aws
      </text>
      <path d="M5 16c4 2.6 10 2.6 14 0" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 15.2l2 .8-.8 2" fill="none" stroke="#ff9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Dell */
function DellIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#0085c3" strokeWidth="1.6" />
      <text x="12" y="15" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#0085c3" fontFamily="Inter, sans-serif">
        DELL
      </text>
    </svg>
  );
}

/* S3 Store — bucket */
function S3Icon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path d="M6 6h12l-1.3 13.2a1 1 0 0 1-1 .8H8.3a1 1 0 0 1-1-.8z" fill="#3f8624" />
      <ellipse cx="12" cy="6" rx="6" ry="1.8" fill="#58a942" />
    </svg>
  );
}

/* NVIDIA — eye swirl */
function NvidiaIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path
        d="M9 8c3-1 6 0 8 2-2 3-5 4-8 3 1-1 1-2 0-3 2 0 3 .5 4 1 .5-1-1-2-2-2-2 0-3 .5-4 2-1-2 .5-4 2-5-1 0-2 0-3 .5C6 9 7 7 9 8z"
        fill="#76b900"
      />
    </svg>
  );
}

/* AMD — arrow */
function AmdIcon() {
  return (
    <svg {...ic} viewBox="0 0 24 24">
      <path d="M5 5h8l6 6v8h-5v-5h-5v5H5z" fill="none" stroke="#000" strokeWidth="1.8" />
      <path d="M5 5l6 6" stroke="#000" strokeWidth="1.8" />
    </svg>
  );
}

const BRANDS = {
  spark: { Icon: SparkIcon, label: "Apache Spark" },
  nifi: { Icon: NifiIcon, label: "Apache NiFi" },
  kafka: { Icon: KafkaIcon, label: "Apache Kafka" },
  spark4: { Icon: SparkIcon, label: "Spark 4.0" },
  trino: { Icon: TrinoIcon, label: "Trino" },
  neo4j: { Icon: Neo4jIcon, label: "neo4j" },
  starrocks: { Icon: StarRocksIcon, label: "StarRocks" },
  clickhouse: { Icon: ClickHouseIcon, label: "ClickHouse" },
  gcp: { Icon: GoogleCloudIcon, label: "Google Cloud" },
  azure: { Icon: AzureIcon, label: "Azure Cloud" },
  aws: { Icon: AwsIcon, label: "AWS Cloud" },
  dell: { Icon: DellIcon, label: "Dell Technologies" },
  s3: { Icon: S3Icon, label: "S3 Store" },
  nvidia: { Icon: NvidiaIcon, label: "NVIDIA" },
  amd: { Icon: AmdIcon, label: "AMD" },
};

/**
 * @param {string} id    one of the keys in BRANDS
 * @param {boolean} iconOnly  render just the mark, no text label
 */
export function BrandLogo({ id, iconOnly = false, className = "" }) {
  const brand = BRANDS[id];
  if (!brand) return <span className={`eng-brand ${className}`}>{id}</span>;
  const { Icon, label } = brand;
  return (
    <span className={`eng-brand eng-brand--${id} ${className}`}>
      <Icon />
      {!iconOnly && <span className="eng-brand__label">{label}</span>}
    </span>
  );
}

/** Cloudera wordmark used for Manager / Platform / Object Store / SDX. */
export function ClouderaMark({ suffix = "", className = "" }) {
  return (
    <span className={`cda-mark ${className}`}>
      <span className="cda-mark__cl">CLOUDERA</span>
      {suffix ? <span className="cda-mark__suffix">{suffix}</span> : null}
    </span>
  );
}
