import { Link } from "react-router-dom";
import { industries } from "../data/industries.js";
import { industryMedia } from "../data/assets.js";

export default function IndustryExplorerPage() {

  return (
    <div className="page-scroll">
      <div className="catalog">
        <header className="page-head">
          <span className="kicker">Industry solutions</span>
          <h1>Cloudera across industries</h1>
          <p className="page-sub">
            Interactive reference architectures for real enterprise scenarios, from fraud detection to clinical research.
            Every block links to the Cloudera component behind it.
          </p>
        </header>
        <div className="industries-grid">
          {industries.map((ind) => {
            const media = industryMedia[ind.id] ?? {};
            return (
              <Link key={ind.id} to={`/industries/${ind.id}`} className="industry-module">
                <div className="industry-module-bg" style={media.gradient ? { background: media.gradient } : undefined}>
                  {media.video && (
                    <video autoPlay muted loop playsInline aria-hidden="true">
                      <source src={media.video} type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="industry-module-content">
                  <span className="code">{ind.icon}</span>
                  <h2>{ind.name}</h2>
                  <p>{ind.tagline}</p>
                  <span className="industry-module-meta">{ind.useCases.length} interactive use cases →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
