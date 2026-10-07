import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppNavigation from "./components/AppNavigation.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import PageTransition from "./components/PageTransition.jsx";
import HomePage from "./pages/HomePage.jsx";
import PlatformExplorerV2Page from "./pages/PlatformExplorerV2Page.jsx";
import IndustryExplorerPage from "./pages/IndustryExplorerPage.jsx";
import { SERVICE_REDIRECTS } from "./data/registry/index.js";

const IndustryDetailPage = lazy(() => import("./pages/IndustryDetailPage.jsx"));
const ComponentPage = lazy(() => import("./pages/ComponentPage.jsx"));
const ComponentsCatalogPage = lazy(() => import("./pages/ComponentsCatalogPage.jsx"));
const CoveragePage = lazy(() => import("./pages/CoveragePage.jsx"));

function ServiceRedirect() {
  const { serviceId } = useParams();
  const target = SERVICE_REDIRECTS[serviceId];
  return <Navigate to={target ? `/component/${target}` : "/components"} replace />;
}

function ExploreRedirect() {
  const { search } = useLocation();
  return <Navigate to={`/explore/v2${search}`} replace />;
}

const page = (el) => (
  <PageTransition>
    <Suspense fallback={<div className="page-loading">Loading…</div>}>{el}</Suspense>
  </PageTransition>
);

export default function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/";

  return (
    <div className="app-shell">
      {showNav && <AppNavigation />}
      <CommandPalette />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={page(<HomePage />)} />
            <Route path="/explore" element={<ExploreRedirect />} />
            <Route path="/explore/v2" element={page(<PlatformExplorerV2Page />)} />
            <Route path="/explore/service/:serviceId" element={<ServiceRedirect />} />
            <Route path="/components" element={page(<ComponentsCatalogPage />)} />
            <Route path="/component/:componentId" element={page(<ComponentPage />)} />
            <Route path="/coverage" element={page(<CoveragePage />)} />
            <Route path="/industries" element={page(<IndustryExplorerPage />)} />
            <Route path="/industries/:industryId" element={page(<IndustryDetailPage />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
