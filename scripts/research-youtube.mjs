// Finds official YouTube videos per component and confirms each one via oEmbed.
// Usage: node scripts/research-youtube.mjs   (resumable; writes scripts/youtube-research.json)
const Q = [
  ["cloudera-ai", "Cloudera AI overview", /cloudera/i],
  ["cloudera-data-flow", "Cloudera DataFlow NiFi demo", /cloudera/i],
  ["cloudera-data-lakehouse", "Cloudera open data lakehouse Iceberg", /cloudera/i],
  ["cloudera-data-engineering", "Cloudera Data Engineering Spark Airflow", /cloudera/i],
  ["cloudera-data-warehouse", "Cloudera Data Warehouse Impala", /cloudera/i],
  ["cloudera-agent-studio", "Cloudera Agent Studio", /cloudera/i],
  ["cloudera-manager", "Cloudera Manager tutorial", /cloudera/i],
  ["cloudera-sdx", "Cloudera SDX shared data experience", /cloudera/i],
  ["cloudera-data-lineage", "Cloudera Octopai data lineage", /cloudera|octopai/i],
  ["cloudera-anywhere-cloud", "Cloudera Anywhere Cloud", /cloudera/i],
  ["cloudera-object-store", "Cloudera Ozone object store", /cloudera|apache/i],
  ["cloudera-platform", "Cloudera Data Platform overview", /cloudera/i],
  ["cloudera-base-datahub", "Cloudera Data Hub", /cloudera/i],
  ["unified-data-fabric", "Cloudera data fabric", /cloudera/i],
  ["apache-spark", "Apache Spark architecture driver executors Databricks", /databricks|apache|spark/i],
  ["spark-4", "Apache Spark 4.0 new features", /databricks|apache|spark/i],
  ["apache-nifi", "Apache NiFi introduction", /cloudera|apache|nifi/i],
  ["apache-kafka", "Apache Kafka fundamentals Confluent", /confluent|apache/i],
  ["trino", "Trino query engine introduction", /trino|starburst/i],
  ["apache-iceberg", "Apache Iceberg table format explained", /iceberg|cloudera|dremio|tabular|apache/i],
  ["apache-flink", "Apache Flink introduction", /flink|apache|confluent|ververica|cloudera/i],
  ["apache-impala", "Apache Impala Cloudera", /cloudera|apache/i],
  ["apache-hive", "Apache Hive LLAP Cloudera", /cloudera|apache/i],
  ["apache-airflow", "Apache Airflow introduction", /astronomer|apache|airflow/i],
  ["neo4j", "Neo4j graph database introduction", /neo4j/i],
  ["starrocks", "StarRocks introduction", /starrocks|celerdata/i],
  ["clickhouse", "ClickHouse introduction", /clickhouse/i],
  ["apache-atlas", "Apache Atlas metadata lineage Cloudera", /cloudera|apache/i],
  ["apache-ranger", "Apache Ranger policies Cloudera", /cloudera|apache/i],
  ["google-cloud", "Cloudera on Google Cloud", /cloudera|google/i],
  ["microsoft-azure", "Cloudera on Microsoft Azure", /cloudera|microsoft|azure/i],
  ["aws", "Cloudera on AWS", /cloudera|amazon|aws/i],
  ["s3-storage", "Amazon S3 introduction", /amazon|aws/i],
  ["dell-technologies", "Cloudera Dell Technologies", /cloudera|dell/i],
  ["nvidia", "Cloudera NVIDIA AI inference NIM", /cloudera|nvidia/i],
  ["amd", "AMD ROCm overview", /amd/i],
];

const UA = { "User-Agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-US" };

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const OUT = new URL("./youtube-research.json", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, opts = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(url, { ...opts, signal: AbortSignal.timeout(20000) });
    } catch (e) {
      if (attempt === 2) throw e;
      await sleep(4000 * (attempt + 1));
    }
  }
}
async function search(q) {
  const r = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, { headers: UA });
  const html = await r.text();
  return [...new Set([...html.matchAll(/"videoId":"([\w-]{11})"/g)].map((m) => m[1]))].slice(0, 10);
}
async function oembed(id) {
  const r = await get(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
  if (!r.ok) return null;
  return r.json();
}

const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
for (const [cid, q, author] of Q) {
  if (out[cid]?.youtubeId) continue;
  await sleep(1500);
  try {
    const ids = await search(q);
    for (const id of ids) {
      const o = await oembed(id);
      if (o && author.test(o.author_name)) {
        out[cid] = { youtubeId: id, title: o.title, channel: o.author_name, channelUrl: o.author_url };
        break;
      }
    }
    if (!out[cid]) out[cid] = null;
  } catch (e) {
    out[cid] = { error: String(e) };
  }
  writeFileSync(OUT, JSON.stringify(out, null, 2));
}
console.log(JSON.stringify(out, null, 2));
