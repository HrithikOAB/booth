import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { takeZoomOrigin } from "./zoomOrigin.js";

/** Level 2 grows out of the Level-1 block that was clicked: "zooming into the platform". */
export default function ZoomIn({ className, children }) {
  const reduce = useReducedMotion();
  const [origin] = useState(() => (reduce ? null : takeZoomOrigin()));
  if (!origin) return <div className={className}>{children}</div>;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const inset = `inset(${origin.y}px ${Math.max(0, vw - origin.x - origin.w)}px ${Math.max(0, vh - origin.y - origin.h)}px ${origin.x}px round 14px)`;
  return (
    <motion.div
      className={className}
      initial={{ clipPath: inset, scale: 1.04 }}
      animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)", scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${origin.x + origin.w / 2}px ${origin.y + origin.h / 2}px` }}
    >
      {children}
    </motion.div>
  );
}
