import { useMemo } from "react";
import { Link } from "react-router-dom";
import { computeCoverage, CHECKS } from "../data/registry/coverage.js";
import { CATEGORIES } from "../data/registry/index.js";
import verification from "../data/registry/verification.js";

export default function CoveragePage() {
  const cov = useMemo(() => computeCoverage(), []);
  const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  const t = cov.totals;

  return (
    <div className="page-scroll">
      <div className="coverage">
        <header className="page-head">
          <p className="kicker">Quality report</p>
          <h1>Coverage matrix</h1>
          <p className="page-sub">
            Every diagram element maps to a component page; each page is checked for all ten sections, diagram depth, verified resources and dangling links.
            {verification.generatedOn && ` Links last checked ${verification.generatedOn}.`}
          </p>
        </header>

        <div className="cov-stats">
          <div>
            <strong>{t.components}</strong>
            <span>component pages</span>
          </div>
          <div>
            <strong>
              {t.complete}/{t.components}
            </strong>
            <span>pass every check</span>
          </div>
          <div>
            <strong>
              {t.diagramNodes - cov.unmappedNodes.length}/{t.diagramNodes}
            </strong>
            <span>diagram elements linked</span>
          </div>
          <div>
            <strong>
              {t.verifiedLinks}/{t.totalLinks}
            </strong>
            <span>resource links verified</span>
          </div>
        </div>

        <div className="cov-table-wrap">
          <table className="cov-table">
            <thead>
              <tr>
                <th scope="col">Component</th>
                {CHECKS.map((k) => (
                  <th key={k.id} scope="col">
                    {k.label}
                  </th>
                ))}
                <th scope="col">Links</th>
              </tr>
            </thead>
            <tbody>
              {cov.rows.map((r) => (
                <tr key={r.id} className={r.complete ? "" : "cov-row--gap"}>
                  <th scope="row">
                    <Link to={`/component/${r.id}`}>{r.name}</Link>
                    <span>{catLabel[r.category]}</span>
                  </th>
                  {CHECKS.map((k) => (
                    <td key={k.id} className={r.results[k.id] ? "ok" : "no"} aria-label={r.results[k.id] ? "pass" : "missing"}>
                      {r.results[k.id] ? "✓" : "–"}
                    </td>
                  ))}
                  <td className={r.dangling.length ? "no" : "ok"}>{r.dangling.length ? r.dangling.join(", ") : "✓"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="catalog-group">
          <h2>Open items &amp; verification notes</h2>
          <div className="catalog-grid">
            {cov.blockers.map((b) => (
              <Link key={b.id} to={`/component/${b.id}`} className="comp-card">
                <strong>{b.name}</strong>
                {b.needsVerification && <em className="badge badge--warn">Needs verification</em>}
                {b.illustrative && !b.needsVerification && <em className="badge badge--warn">Illustrative integration</em>}
                {b.verificationNotes.map((n) => (
                  <span key={n} className="comp-tag">
                    {n}
                  </span>
                ))}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
