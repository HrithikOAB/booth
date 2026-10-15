import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { serviceById } from "../data/services.js";
import { getWorkflow } from "../data/workflows.js";
import ServiceWorkflowDiagram from "../components/workflow/ServiceWorkflowDiagram.jsx";
import ServiceDetailModal from "../components/service/ServiceDetailModal.jsx";

export default function ServiceWorkflowPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = serviceById[serviceId];
  const workflow = useMemo(() => (service ? getWorkflow(serviceId) : null), [service, serviceId]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    if (!service || !workflow) navigate("/explore/v2", { replace: true });
  }, [service, workflow, navigate]);

  if (!service || !workflow) return null;

  const step = workflow.nodes.find((n) => n.id === selectedStep);

  return (
    <div className="workflow-page">
      <button type="button" className="link-back" onClick={() => navigate("/explore/v2")}>
        ← Back to platform architecture
      </button>
      <div className="workflow-header">
        <div className="category">{service.category}</div>
        <h1>{service.name}</h1>
        <p className="lead">{workflow.title}</p>
      </div>
      <div className="workflow-diagram-wrap">
        <ServiceWorkflowDiagram
          workflow={workflow}
          selectedStepId={selectedStep}
          onSelectStep={setSelectedStep}
        />
      </div>
      {step && (
        <div style={{ marginBottom: 20, color: "#a7b5c3", maxWidth: 720 }}>
          <strong>{step.label}:</strong> {step.description}
        </div>
      )}
      <div className="workflow-actions">
        <button type="button" className="btn-primary" onClick={() => setModalOpen(true)}>
          View service details
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate("/industries")}>
          Explore industry applications
        </button>
      </div>
      <AnimatePresence>
        {modalOpen && <ServiceDetailModal service={service} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
