import { useEffect } from "react";
import { motion } from "framer-motion";
import ServiceVideoPanel from "./ServiceVideoPanel.jsx";
import ServiceInformationPanel from "./ServiceInformationPanel.jsx";

export default function ServiceDetailModal({ service, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (service?.type === "link" && service?.url) {
      window.open(service.url, "_blank", "noopener");
      onClose();
    }
  }, [service, onClose]);

  if (!service) return null;
  if (service.type === "link" && service.url) return null;

  return (
    <motion.div
      className="service-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="service-modal"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="service-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <ServiceVideoPanel service={service} />
        <ServiceInformationPanel service={service} onClose={onClose} />
      </motion.div>
    </motion.div>
  );
}
