import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { componentsByCategory, components, CATEGORIES } from "../data/registry/index.js";
import { OriginBadge } from "../components/component-page/MediaCards.jsx";

export default function ComponentsCatalogPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const groups = useMemo(
    () =>
      componentsByCategory
        .filter((g) => category === "all" || g.id === category)
        .map((g) => ({
          ...g,
          components: g.components.filter((c) => !q || `${c.name} ${c.aka ?? ""} ${c.tagline}`.toLowerCase().includes(q)),
        }))
        .filter((g) => g.components.length),
    [category, q],
  );

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  return (
    <div className="page-scroll">
      <div className="catalog">
        <header className="page-head">
          <p className="kicker">Component explorer</p>
          <h1>Every block in the Cloudera architecture</h1>
          <p className="page-sub">
            {components.length} components — Cloudera services, open-source engines, partners, governance, clouds and hardware. Each has its own interactive architecture, workflow and verified resources.
          </p>
        </header>

        <div className="catalog-filters">
          <input
            type="search"
            value={params.get("q") ?? ""}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search components…"
            aria-label="Search components"
          />
          <div className="pill-row" role="tablist" aria-label="Filter by category">
            {[{ id: "all", label: "All" }, ...CATEGORIES].map((cat) => (
              <button key={cat.id} type="button" role="tab" aria-selected={category === cat.id} className={category === cat.id ? "on" : ""} onClick={() => set("category", cat.id)}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {groups.length === 0 && <p className="cp-empty">No components match “{q}”.</p>}
        {groups.map((g) => (
          <section key={g.id} className="catalog-group" aria-labelledby={`cat-${g.id}`}>
            <h2 id={`cat-${g.id}`}>
              {g.label} <span>{g.components.length}</span>
            </h2>
            <div className="catalog-grid">
              {g.components.map((c) => (
                <Link key={c.id} to={c.route} className="comp-card">
                  <OriginBadge origin={c.origin} />
                  <strong>{c.name}</strong>
                  <span className="comp-tag">{c.tagline}</span>
                  <span className="comp-foot">
                    {c.edition && <em>{c.edition}</em>}
                    {(c.illustrative || c.needsVerification) && <em className="warn">{c.needsVerification ? "Needs verification" : "Illustrative"}</em>}
                    <span className="comp-go">Open →</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
