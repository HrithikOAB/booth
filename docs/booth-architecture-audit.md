# Booth architecture audit

Audit date: 2026-10-07. Scope: the Cloudera booth explorer (`booth-web`), ahead of the
diagram-first Level-2 redesign.

The booth is shown on a large screen to walk-up visitors. Every screen has to work at
three attention levels: **5 seconds** (what is it), **30 seconds** (how it works),
**2 minutes** (architecture, workflow, demo). The architecture is the hero, the video is
the proof, text is only the caption.

---

## 1. Current Level-1 architecture

- Route: `/explore/v2` → `PlatformExplorerV2Page` → `PlatformArchitectureV2`.
- Layout (from `src/data/architectureBlueprint.js`):
  - **Left pillar** — "Cloudera Base (or DataHub) · With Data Services 1.5.x": Cloudera AI,
    Data Engineering, Data Lakehouse, Data Flow; Cloudera Engines (Spark, NiFi, Kafka);
    Cloudera Manager; Platform row (Object Store · Platform · SDX).
  - **Center** — three connector notes with animated SVG wiring: seamless transition of
    jobs & engines; engines and services can query the platform; independent or integrated data.
  - **Right pillar** — "Cloudera Anywhere Cloud · With Cloudera Data Services 2.0":
    DE 2.0 / DL 2.0 / AI 2.0 / DF 2.0; engines (Spark 4.0, Trino); partner engines
    (Neo4j, StarRocks, ClickHouse); Unified Data Fabric (Atlas / Ranger, governance,
    security, metadata, Cloudera Data Lineage); Cloudera Object Store.
  - **Footer** — two small cards: Cloud (GCP, Azure, AWS) and On Premises (Object Store,
    Dell, S3, NVIDIA, AMD).
- Every clickable element resolves through `src/data/registry/nodeMap.js` (59 diagram ids)
  to a component route. `scripts/verify-coverage.mjs` fails the build if one does not.
- Hover highlights related blocks (`highlightSetForNode`), search dims non-matches,
  `?focus=<nodeId>` deep-links back to a block.

**Gaps against the brief.** Hybrid cloud is two small cards, not a first-class concept.
Governance is not shown as spanning the architecture. Ownership (Cloudera / open source /
partner / infrastructure) is shown only in the legend. Clicking a node jumps straight to a
new page with no "zoom into the platform" transition.

Decision (per the client): the Level-1 layout is kept. Changes are additive (see §11).

## 2. Current Level-2 architecture

- Route: `/component/:componentId` → `ComponentPage`.
- A scrolling **documentation article** with ten numbered sections and a sticky table of
  contents: Overview (paragraph, business value, highlights, key capabilities), Internal
  architecture, Workflow (+ numbered prose steps), Inputs/outputs/APIs (6 bullet cards),
  Data flow, Deployment, Security & operations (4 prose cards), Cloudera context (3 prose
  cards), Use cases, Resources (video grid and doc grid).
- Up to six separate React Flow canvases per page, each 400–560px high and lazily mounted.
- Node details live in `NodeSidePanel` (description and incoming/outgoing connection lists).
  Opening a linked component needs a double-click.

**Verdict.** The content is good, but it is presented as a documentation portal: on a
1920×1080 booth screen the visitor sees a paragraph, not a diagram. This is the page to
replace.

## 3. Component inventory (50 entries)

Columns: internal-architecture nodes · workflow stages · videos (YouTube) · docs.

| id | name | origin | status (new) | arch | wf | vid (yt) | docs |
|---|---|---|---|---|---|---|---|
| cloudera-ai | Cloudera AI | cloudera | current | 10 | 6 | 3 (1) | 4 |
| cloudera-data-engineering | Cloudera Data Engineering | cloudera | current | 9 | 7 | 2 (1) | 2 |
| cloudera-data-lakehouse | Cloudera Data Lakehouse | cloudera | current | 6 | 6 | 2 (1) | 3 |
| cloudera-data-flow | Cloudera Data Flow | cloudera | current | 9 | 7 | 3 (1) | 1 |
| cloudera-data-warehouse | Cloudera Data Warehouse | cloudera | current | 9 | 6 | 2 (1) | 1 |
| cloudera-agent-studio | Cloudera Agent Studio | cloudera | current | 8 | 6 | 2 (1) | 2 |
| cloudera-data-services-2 | Cloudera Data Services 2.0 | cloudera | reference-architecture | 9 | 5 | 1 (0) | 2 |
| data-engineering-2 | Data Engineering 2.0 | cloudera | reference-architecture | 6 | 5 | 1 (0) | 2 |
| data-lakehouse-2 | Data Lakehouse 2.0 | cloudera | reference-architecture | 5 | 4 | 1 (0) | 2 |
| ai-2 | AI 2.0 | cloudera | reference-architecture | 6 | 5 | 1 (0) | 2 |
| data-flow-2 | Data Flow 2.0 | cloudera | reference-architecture | 5 | 4 | 1 (0) | 1 |
| cloudera-base-datahub | Cloudera Base / Data Services 1.5.x | cloudera | current | 10 | 6 | 1 (0) | 2 |
| cloudera-manager | Cloudera Manager | cloudera | current | 8 | 6 | **0** | 1 |
| cloudera-platform | Cloudera Platform | cloudera | current | 7 | 5 | 1 (0) | 1 |
| cloudera-object-store | Cloudera Object Store | cloudera | current | 9 | 6 | 1 (1) | 2 |
| cloudera-sdx | Cloudera SDX | cloudera | current | 9 | 6 | 2 (1) | 2 |
| cloudera-data-lineage | Cloudera Data Lineage | cloudera | current | 7 | 6 | 3 (1) | 3 |
| unified-data-fabric | Unified Data Fabric | cloudera | current | 6 | 5 | 1 (1) | 3 |
| cloudera-anywhere-cloud | Cloudera Anywhere Cloud | cloudera | current | 10 | 6 | 2 (1) | 3 |
| apache-spark | Apache Spark | apache-oss | ecosystem | 12 | 8 | 1 (0) | 1 |
| spark-4 | Apache Spark 4.0 | apache-oss | ecosystem | 7 | 6 | 1 (1) | 2 |
| apache-nifi | Apache NiFi | apache-oss | ecosystem | 10 | 8 | 1 (0) | 1 |
| apache-kafka | Apache Kafka | apache-oss | ecosystem | 10 | 7 | 1 (1) | 1 |
| trino | Trino | open-source | ecosystem | 13 | 8 | 1 (1) | 2 |
| apache-iceberg | Apache Iceberg | apache-oss | ecosystem | 6 | 8 | 1 (0) | 3 |
| apache-flink | Apache Flink | apache-oss | ecosystem | 9 | 7 | 1 (1) | 1 |
| apache-impala | Apache Impala | apache-oss | ecosystem | 7 | 7 | 2 (1) | 1 |
| apache-hive | Apache Hive & Hive Metastore | apache-oss | ecosystem | 10 | 6 | 1 (0) | 1 |
| apache-airflow | Apache Airflow | apache-oss | ecosystem | 8 | 7 | 1 (0) | 1 |
| neo4j | Neo4j | partner | partner | 9 | 6 | 1 (1) | 1 |
| starrocks | StarRocks | partner | partner | 9 | 6 | 1 (1) | 1 |
| clickhouse | ClickHouse | partner | partner | 9 | 6 | 1 (1) | 1 |
| apache-atlas | Apache Atlas | apache-oss | ecosystem | 10 | 6 | 2 (1) | 1 |
| apache-ranger | Apache Ranger | apache-oss | ecosystem | 10 | 6 | 2 (1) | 2 |
| metadata-management | Metadata Management | capability | current | 5 | 4 | 1 (0) | 2 |
| data-lineage-concept | Data Lineage (capability) | capability | current | 5 | 4 | 1 (0) | 2 |
| access-control | Access Control | capability | current | 5 | 4 | 1 (0) | 2 |
| security-policies-auditing | Security Policies & Auditing | capability | current | 5 | 4 | 1 (0) | 2 |
| google-cloud | Google Cloud | cloud-provider | ecosystem | 7 | 5 | 1 (1) | 2 |
| microsoft-azure | Microsoft Azure | cloud-provider | ecosystem | 7 | 5 | 1 (1) | 2 |
| aws | Amazon Web Services | cloud-provider | ecosystem | 7 | 5 | 1 (1) | 2 |
| s3-storage | S3 / S3-compatible Storage | capability | ecosystem | 5 | 4 | 1 (1) | 2 |
| dell-technologies | Dell Technologies | hardware-vendor | ecosystem | 5 | 4 | 1 (0) | 1 |
| nvidia | NVIDIA | hardware-vendor | ecosystem | 5 | 4 | 2 (1) | 3 |
| amd | AMD | hardware-vendor | ecosystem | 5 | 4 | **0** | 1 |
| on-premises-deployment | On-Premises Deployment | capability | current | 6 | 5 | 2 (0) | 2 |
| cloud-deployment | Cloud Deployment | capability | current | 5 | 4 | 1 (0) | 2 |
| flow-seamless-transition | Seamless Transition of Jobs | flow | reference-architecture | 5 | 5 | 1 (0) | 2 |
| flow-engines-query-platform | Engines Can Query Across Platforms | flow | reference-architecture | 5 | 5 | 1 (0) | 2 |
| flow-independent-integrated-data | Independent or Integrated Data | flow | reference-architecture | 5 | 4 | 1 (0) | 2 |

Every entry already has an internal architecture view, a workflow, at least one doc and a
deep link from Level 1. "Videos" includes booth MP4s bundled in `public/videos/`.

## 4. Missing components

Brief items not present as their own entry:

| Missing | Action |
|---|---|
| Cloudera AI Workbench | Add `cloudera-ai-workbench` (child of Cloudera AI). Source: cloudera.com AI Workbench product page and the Cloudera AI architecture doc (web / application / data tiers). |
| AI Studios | Add `ai-studios` (child of Cloudera AI). Source: the cloudera.com AI product page lists "Cloudera AI Studios" as a key feature; the AI Workbench page names synthetic data, fine-tuning, RAG and multi-agent workflows. |
| AI Inference Service | Add `ai-inference-service` (child of Cloudera AI). Source: Cloudera blog "Cloudera AI Inference Service enables easy integration and deployment of GenAI" (KServe, Knative, Istio + Knox/Ranger, Iceberg payload logging, Prometheus, OpenAI API / Open Inference Protocol). |
| Apache HBase | Add `apache-hbase` (open source, ecosystem). Source: hbase.apache.org. |
| Hybrid Cloud | Add `hybrid-cloud`. Source: Cloudera docs "How do Cloudera Hybrid Environments work?" (unified authentication, metadata synchronization, network connectivity, workload portability). |

Already present under another id: Spark 4.x (`spark-4`), Data Lineage (`data-lineage-concept`
plus `cloudera-data-lineage`), On-Premises (`on-premises-deployment`), Cloud Deployment
(`cloud-deployment`), S3 (`s3-storage`).

## 5. Historical vs current terminology

| Label on the Level-1 diagram | Classification | How the UI treats it |
|---|---|---|
| Cloudera Base (or DataHub) | current family name (Cloudera Base on premises; Data Hub is a cloud cluster type) | current |
| With Data Services 1.5.x | release/edition label of the reference diagram | "Reference architecture" note on Level 1; edition badge on Level 2 |
| Cloudera Anywhere Cloud | current (Aug 2026 press release, product page) | current |
| Cloudera Data Services 2.0, DE/DL/AI/DF 2.0 | reference-architecture terminology from the supplied diagram | status `reference-architecture`; Level 2 says "Reference architecture terminology" |
| Cloudera AI (formerly Cloudera Machine Learning) | current | current; former name shown as "aka" |
| AI Workbench (formerly ML Workspace) | current | current |
| Cloudera Data Lineage (formerly Octopai) | current; acquisition Nov 2024 | current; "formerly Octopai" only on the lineage page |
| Seamless transition / engines query / independent data | connector notes of the reference diagram | status `reference-architecture` |

The component catalog keeps current product names; the supplied diagram stays as the
**reference architecture**.

## 6. Required Level-2 diagrams

Each Level-2 page renders three tabs: **Architecture** (internal), **Workflow** (playback),
**Integrations** (hub generated from `relatedComponentIds`). Authored `dataFlow`,
`deployment` and `security` views remain in data; the Architecture tab gets a
**Trace data** path instead.

Diagrams reworked to match the official architecture sources:

| Component | Diagram (brief) | Official source used |
|---|---|---|
| Cloudera AI | Develop (Workbench: notebooks, AI Studios, AMPs, training) → Registry → Production (AI Inference: models, autoscale, monitor) → Governance/SDX → Lakehouse | cloudera.com/products/enterprise-ai/ai.html; CML architecture doc; AI Inference blog |
| Cloudera Data Flow | Control Plane → Environment → Kubernetes → NiFi deployment → data; data does not traverse the Control Plane | docs.cloudera.com/dataflow/cloud/overview/topics/cdf-architecture.html |
| Cloudera Data Warehouse | Control Plane → Database Catalog (HMS) → multiple Virtual Warehouses → SQL/BI; lakehouse data | docs.cloudera.com/data-warehouse/cloud/overview/topics/dw-service-architecture.html |
| Cloudera Data Engineering | Sources → CDC → Spark → Iceberg → Airflow / Sessions / APIs → analytics/AI; SDX + lineage | cloudera.com/products/data-engineering.html |
| Cloudera Manager | Admin Console / API → Server → Management Service (monitoring, alerting), Database, Repository → Agents (heartbeat) → cluster services | docs.cloudera.com/cloudera-manager/7.13.2/concepts/topics/cm-architecture.html |
| Cloudera Object Store | Application → S3 API → Volume → Bucket → Key (object) → Ozone DataNodes | Ozone introduction (Cloudera docs) |
| Hybrid Cloud | Cloudera control → On-prem, AWS, Azure, GCP; lanes for authentication, metadata, network, runtime, governance; trace "workload portability" | Cloudera Hybrid Environments doc |
| Others (Spark, Trino, NiFi, Kafka, Atlas, Ranger, SDX, Lineage, Lakehouse, partners, clouds, hardware) | authored views already follow the brief's shape; booth pass adds micro text, traces and status | project/vendor docs in `resources.js` |

**Broken source in the brief:** `https://www.cloudera.com/products/cloudera-object-store.html`
returns HTTP 404 (checked 2026-10-07). It is not used; Object Store links to the Ozone docs.

## 7. Media requirements

- Rule: only video IDs that pass the YouTube oEmbed check (`npm run check-links`) and
  local MP4s bundled in `public/videos/` are shown.
- Added: `JqWmErXze-s` — "Cloudera Private AI: Bring AI to Your Data Anywhere"
  (Cloudera, Inc.; oEmbed verified 2026-10-07).
- Kept: `XZMaJaLBN6s` — Cloudera Agent Studio (client example, already in registry).
- Components with no video: Cloudera Manager, AMD. Their Watch button is hidden and
  docs (QR) are the primary action.
- Thumbnails come from `i.ytimg.com/vi/<id>/hqdefault.jpg` (lazy); the iframe
  (`youtube-nocookie.com`) mounts only after the visitor presses play.
- Architecture images: not hotlinked. Each component stores `officialArchitecture`
  (source page URL) so staff can open the official diagram via QR.

## 8. Existing reusable components

| Piece | File | Reuse |
|---|---|---|
| React Flow canvas with tabs, dagre/radial layout, playback, fullscreen | `components/explorer/ArchitectureCanvas.jsx` | becomes the booth canvas (`variant="booth"`) |
| Node renderer | `components/explorer/ArchNode.jsx` | label-only booth nodes, ownership tags |
| Particle edge | `components/explorer/ParticleEdge.jsx` | edge semantics (data / control / bi / optional / glow) |
| Playback hook | `components/explorer/usePlayback.js` | Play Flow |
| Layout | `components/explorer/layout.js` | larger booth node sizes |
| Video card (lazy YouTube) | `components/component-page/MediaCards.jsx` | VideoModal |
| Kiosk idle | `hooks/useKioskIdle.js` | idle return in booth mode |
| Page transition | `components/PageTransition.jsx` | Level-1 → Level-2 zoom |
| Diagram state | `components/architecture/DiagramHit.jsx` | hover/focus on Level 1 |

## 9. Routes

| Route | Page | Change |
|---|---|---|
| `/` | HomePage (attract loop) | unchanged |
| `/explore/v2` | Level-1 map | additive (hybrid band, governance overlay, tags, zoom origin) |
| `/component/:id` | Level-2 | **rewritten as a full-screen architecture stage** |
| `/components` | catalog | unchanged |
| `/industries`, `/industries/:id` | industries | detail page rewritten diagram-first |
| `/coverage` | coverage report | extended with booth checks |
| `?booth=1` | any | turns booth mode on |

## 10. Data model

Single source of truth: `src/data/registry/` (plain JS). No parallel
`componentArchitecture.ts`; the brief's schema maps onto existing fields plus a new
optional `booth` block, with defaults derived in `finalizeComponent`:

| Brief field | Registry field |
|---|---|
| id, name, category | `id`, `name`, `category` |
| ownership | `booth.ownership` (derived from `origin`) |
| status | `booth.status` (derived from category/origin, overridable) |
| shortDescription | `booth.oneLiner` (default `tagline`) |
| architectureNodes, edges | `views.internal.nodes/edges` (edge `kind`: data, control, bi, optional) |
| workflows | `workflow.stages` (+ `booth.trace` for Trace data) |
| integrations | `relatedComponentIds` → Integrations tab |
| officialDocs | `resources.js` docs (link-checked) |
| officialArchitecture, officialProductPage | `booth.officialArchitecture`, `booth.officialProductPage` |
| youtubeVideos | `resources.js` videos (oEmbed-checked) |
| imageSources | `booth.officialArchitecture` (source page, not hotlinked) |
| deploymentModels | `booth.deploymentModels` |
| verificationDate | `booth.verificationDate` (default: link-check date) |
| node micro text / path / video | `booth.nodes[nodeId] = { micro, path, video }` (default: node description, first sentence) |
| uncertain claims | `booth.unverified[]` — never rendered |

## 11. Migration plan

1. **Registry** — add the `booth` block and edge kinds; derive defaults so all components
   work immediately; extend coverage checks (status, one-liner ≤ 90 chars, workflow,
   at least one video or doc action, micro text ≤ 3 sentences).
2. **Booth canvas** — label-only large nodes, ownership colour grammar, edge semantics,
   Trace data, step label pill during Play Flow, micro panel instead of the side panel,
   single-click "Explore" for linked nodes.
3. **Level-2 stage** — top bar (`← PLATFORM`, breadcrumb Platform › Component › Node,
   name, one-liner, badges), three tabs, full-height canvas, action dock
   (Watch · How it works · Integrations · Official docs), VideoModal, DocsModal with QR.
   The article sections are removed from the UI; their data stays.
4. **Content** — rework the diagrams listed in §6, add the five missing components,
   micro text and traces for the major components, verified media only.
5. **Level 1 (additive)** — related-node hover with tooltip, "Deploy anywhere" hybrid
   band with the four official building blocks, governance overlay toggle, ownership
   tags, zoom transition into Level 2.
6. **Booth mode** — `?booth=1` / nav toggle; minimal header, large targets, no search or
   minimap, fullscreen, idle return to the platform map.
7. **Industries** — the same stage format with lifecycle playback and a trace path.
8. **Verify** — `npm run verify`, `npm run check-links`, `npm run build`, browser check at
   1920×1080 in booth mode.
