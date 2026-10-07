/** Compact brand-style chips for the official architecture diagram. */
export function EngineBrand({ id, className = "" }) {
  const map = {
    spark: (
      <span className={`eng-brand eng-brand--spark ${className}`}>
        <i aria-hidden="true" />
        Apache Spark
      </span>
    ),
    nifi: <span className={`eng-brand eng-brand--nifi ${className}`}>Apache NiFi</span>,
    kafka: <span className={`eng-brand eng-brand--kafka ${className}`}>Kafka</span>,
    spark4: <span className={`eng-brand eng-brand--spark ${className}`}>Spark 4.0</span>,
    trino: <span className={`eng-brand eng-brand--trino ${className}`}>Trino</span>,
    neo4j: <span className={`eng-brand eng-brand--neo4j ${className}`}>neo4j</span>,
    starrocks: <span className={`eng-brand eng-brand--starrocks ${className}`}>StarRocks</span>,
    clickhouse: <span className={`eng-brand eng-brand--clickhouse ${className}`}>ClickHouse</span>,
    gcp: <span className={`eng-brand eng-brand--gcp ${className}`}>Google Cloud</span>,
    azure: <span className={`eng-brand eng-brand--azure ${className}`}>Microsoft Azure</span>,
    aws: <span className={`eng-brand eng-brand--aws ${className}`}>AWS</span>,
    dell: <span className={`eng-brand eng-brand--dell ${className}`}>Dell Technologies</span>,
    nvidia: <span className={`eng-brand eng-brand--nvidia ${className}`}>NVIDIA</span>,
    amd: <span className={`eng-brand eng-brand--amd ${className}`}>AMD</span>,
    s3: <span className={`eng-brand eng-brand--s3 ${className}`}>S3 Store</span>,
  };
  return map[id] ?? <span className={`eng-brand ${className}`}>{id}</span>;
}

export function ClouderaMark({ suffix = "", className = "" }) {
  return (
    <span className={`cda-mark ${className}`}>
      <span className="cda-mark__cl">CLOUDERA</span>
      {suffix ? <span className="cda-mark__suffix">{suffix}</span> : null}
    </span>
  );
}
