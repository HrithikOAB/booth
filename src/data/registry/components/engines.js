// Engines & open formats. Apache/OSS projects are described as the upstream
// projects; Cloudera integration is stated separately in clouderaContext.
import { spark, spark4, nifi, kafka, trino } from "./engines-core.js";
import { iceberg, flink, impala, hive, airflow } from "./engines-lakehouse.js";
import { hbase } from "./engines-hbase.js";

export default [spark, spark4, nifi, kafka, trino, iceberg, flink, impala, hive, airflow, hbase];
