export default function EngineChipNode({ data }) {
  return (
    <div className={`arch-engine-chip ${data.partner ? "partner" : ""}`} style={{ width: data.width }}>
      {data.label}
    </div>
  );
}
