import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { industryById } from "../data/industries.js";
import { componentById } from "../data/registry/index.js";
import { INDUSTRY_VIEW_META, useCaseArchitecture } from "../data/industryArchitecture.js";
import ArchitectureCanvas from "../components/explorer/ArchitectureCanvas.jsx";
import { OriginBadge } from "../components/component-page/MediaCards.jsx";
import { useKioskIdle } from "../hooks/useKioskIdle.js";

export default function IndustryDetailPage() {
  const { industryId } = useParams();
  const navigate = useNavigate();
  const industry = industryById[industryId];
  const [activeUseCase, setActiveUseCase] = useState(industry?.useCases?.[0]?.id);
  useKioskIdle(120000, true);

  useEffect(() => {
    if (!industry) navigate("/industries", { replace: true });
  }, [industry, navigate]);

  useEffect(() => {
    setActiveUseCase(industry?.useCases?.[0]?.id);
  }, [industry]);

  const uc = industry?.useCases.find((u) => u.id === activeUseCase) ?? industry?.useCases[0];
  const arch = useMemo(() => (industry && uc ? useCaseArchitecture(industry, uc) : null), [industry, uc]);

  if (!industry || !uc) return null;

  return (
    <div className="page-scroll">
      <div className="cp ind">
        <div className="cp-topbar">
          <button type="button" className="back-btn" onClick={() => navigate("/industries")}>
            ← All industries
          </button>
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/industries">Industries</Link></li>
              <li aria-current="page">{industry.name}</li>
            </ol>
          </nav>
        </div>

        <header className="cp-hero">
          <div className="cp-badges">
            <span className="badge badge--outline">{industry.icon}</span>
            <span className="badge badge--outline">{industry.useCases.length} use cases</span>
          </div>
          <h1>{industry.name}</h1>
          <p className="cp-tagline">{industry.overview}</p>
        </header>

        <section className="ind-section" aria-labelledby="ind-uc">
          <h2 id="ind-uc" className="ind-h2">Use cases</h2>
          <div className="ind-uc-grid" role="tablist" aria-label="Use cases">
            {industry.useCases.map((u, i) => (
              <button
                key={u.id}
                type="button"
                role="tab"
                aria-selected={u.id === uc.id}
                className={`ind-uc ${u.id === uc.id ? "is-on" : ""}`}
                onClick={() => setActiveUseCase(u.id)}
              >
                <span className="ind-uc-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{u.title}</strong>
                <span>{u.summary}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ind-section" aria-labelledby="ind-arch">
          <div className="cp-sec-head">
            <h2 id="ind-arch">{uc.title}: interactive architecture</h2>
            <p>
              A reference pattern built from Cloudera components. Expand blocks to see the engines inside, switch to
              <em> Lifecycle</em> and press play to walk the data end to end, or double-click any ↗ block to open its page.
            </p>
          </div>
          <ArchitectureCanvas
            key={`${industry.id}-${uc.id}`}
            views={arch.views}
            meta={INDUSTRY_VIEW_META}
            height="520px"
            title={`${industry.name} — ${uc.title}`}
          />
          <p className="ind-note" role="note">
            Illustrative reference architecture. Actual deployments vary by customer requirements and environment.
          </p>
        </section>

        <section className="ind-section" aria-labelledby="ind-comps">
          <h2 id="ind-comps" className="ind-h2">Components in this use case</h2>
          <div className="cp-related-grid">
            {arch.componentIds.map((id) => {
              const c = componentById[id];
              return (
                <Link key={id} to={c.route} className="rel-card">
                  <OriginBadge origin={c.origin} />
                  <strong>{c.name}</strong>
                  <span>{c.tagline}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="ind-section ind-value" aria-labelledby="ind-value">
          <div className="cp-callout">
            <h3 id="ind-value">Business value</h3>
            <p>{industry.businessValue}</p>
          </div>
          {industry.url && (
            <a className="cp-inline-link" href={industry.url} target="_blank" rel="noopener noreferrer">
              {industry.name} solutions on cloudera.com ↗
            </a>
          )}
        </section>
      </div>
    </div>
  );
}
