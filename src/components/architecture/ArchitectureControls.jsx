import { useReactFlow } from "@xyflow/react";

export default function ArchitectureControls() {
  const { zoomIn, zoomOut, fitView, setViewport } = useReactFlow();

  const reset = () => setViewport({ x: 0, y: 0, zoom: 1 });
  const fullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  return (
    <div className="arch-controls">
      <button type="button" onClick={() => zoomIn()} title="Zoom in">+</button>
      <button type="button" onClick={() => zoomOut()} title="Zoom out">−</button>
      <button type="button" onClick={() => fitView({ padding: 0.08 })} title="Fit">⊡</button>
      <button type="button" onClick={reset} title="Reset">↺</button>
      <button type="button" onClick={fullscreen} title="Fullscreen">⛶</button>
    </div>
  );
}
