import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKioskIdle(ms = 90000, enabled = true) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!enabled) return;
    let t;
    const reset = () => {
      clearTimeout(t);
      t = setTimeout(() => navigate("/"), ms);
    };
    const events = ["pointerdown", "keydown", "mousemove", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();
    return () => {
      clearTimeout(t);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [navigate, ms, enabled]);
}
