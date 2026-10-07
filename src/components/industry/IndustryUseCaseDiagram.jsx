export default function IndustryUseCaseDiagram({ flow }) {
  if (!flow?.length) return null;
  return (
    <div className="use-case-flow">
      {flow.map((step, i) => (
        <span key={step}>
          {step}
          {i < flow.length - 1 && <span className="arrow">→</span>}
        </span>
      ))}
    </div>
  );
}
