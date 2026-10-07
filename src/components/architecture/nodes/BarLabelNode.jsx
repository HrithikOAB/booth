export default function BarLabelNode({ data }) {
  return (
    <div
      className={`arch-bar-label ${data.accent ? "accent" : ""}`}
      style={{ width: data.width, height: data.height }}
    >
      {data.label}
    </div>
  );
}
