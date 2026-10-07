export default function GroupFrameNode({ data }) {
  const variant = data.variant ?? "base";
  return (
    <div className={`arch-group-frame ${variant}`} style={{ width: data.width, height: data.height }}>
      <div className="arch-group-title">{data.title}</div>
    </div>
  );
}
