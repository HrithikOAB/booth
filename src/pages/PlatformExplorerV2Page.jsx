import { useState } from "react";
import { Link } from "react-router-dom";
import { architectureLegend } from "../data/architecture.js";
import PlatformArchitectureV2 from "../components/architecture/PlatformArchitectureV2.jsx";
import ArchitectureSearch from "../components/architecture/ArchitectureSearch.jsx";

export default function PlatformExplorerV2Page() {
  const [search, setSearch] = useState("");

  return (
    <div className="explorer-page explorer-page--v2">
      <div className="explorer-toolbar">
        <h1>Cloudera</h1>
        <ArchitectureSearch value={search} onChange={setSearch} onClear={() => setSearch("")} />
        <Link to="/components" className="toolbar-link">All components</Link>
        <div className="arch-legend">
          {architectureLegend.map((item) => (
            <span key={item.id}>
              <i style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
      <div className="arch-canvas-wrap">
        <PlatformArchitectureV2 searchQuery={search} />
      </div>
    </div>
  );
}
