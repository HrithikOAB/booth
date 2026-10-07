import { useState } from "react";
import { Link } from "react-router-dom";
import PlatformStack from "../components/architecture/PlatformStack.jsx";
import ArchitectureSearch from "../components/architecture/ArchitectureSearch.jsx";
import { useKioskIdle } from "../hooks/useKioskIdle.js";

export default function PlatformExplorerPage() {
  const [search, setSearch] = useState("");
  useKioskIdle(90000, true);

  return (
    <div className="explorer-page explorer-page--dark">
      <div className="explorer-toolbar">
        <div className="explorer-title">
          <h1>The Cloudera Platform</h1>
          <span className="explorer-subtitle">One platform. Data &amp; AI, anywhere. Click any block to open its page.</span>
        </div>
        <ArchitectureSearch value={search} onChange={setSearch} onClear={() => setSearch("")} />
        <Link to="/components" className="toolbar-link">All components</Link>
        <Link to="/explore/v2" className="toolbar-link">Official diagram →</Link>
      </div>
      <div className="arch-canvas-wrap">
        <PlatformStack searchQuery={search} />
      </div>
    </div>
  );
}
