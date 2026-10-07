export default function ArchitectureSearch({ value, onChange, onClear }) {
  return (
    <>
      <input
        className="arch-search"
        type="search"
        placeholder="Highlight a component…"
        aria-label="Highlight components in the diagram"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onClear()}
      />
      {value && (
        <button type="button" className="toolbar-link" onClick={onClear}>
          Clear
        </button>
      )}
    </>
  );
}
