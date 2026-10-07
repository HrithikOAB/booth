import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES, components } from "../data/registry/index.js";
import { industries } from "../data/industries.js";

const PAGES = [
  { id: "p-home", label: "Home", hint: "Page", to: "/" },
  { id: "p-v2", label: "Cloudera platform diagram", hint: "Page", to: "/explore/v2" },
  { id: "p-components", label: "All components", hint: "Page", to: "/components" },
  { id: "p-industries", label: "Industries", hint: "Page", to: "/industries" },
  { id: "p-coverage", label: "Coverage report", hint: "Page", to: "/coverage" },
];

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

function buildItems() {
  return [
    ...PAGES,
    ...components.map((c) => ({
      id: c.id,
      label: c.name,
      hint: catLabel[c.category] ?? "Component",
      keywords: `${c.shortName ?? ""} ${c.tagline ?? ""}`,
      to: c.route,
    })),
    ...industries.map((i) => ({ id: `ind-${i.id}`, label: i.name, hint: "Industry", to: `/industries/${i.id}` })),
  ];
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const items = useMemo(buildItems, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items.slice(0, 40);
    return items
      .map((it) => {
        const label = it.label.toLowerCase();
        const score = label.startsWith(term) ? 0 : label.includes(term) ? 1 : `${it.hint} ${it.keywords ?? ""}`.toLowerCase().includes(term) ? 2 : -1;
        return { it, score };
      })
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40)
      .map((r) => r.it);
  }, [q, items]);

  if (!open) return null;

  const choose = (it) => {
    setOpen(false);
    navigate(it.to);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(results.length - 1, s + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === "Enter" && results[sel]) {
      choose(results[sel]);
    }
  };

  return (
    <div className="cmdk-backdrop" onClick={() => setOpen(false)}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Search components and pages" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="cmdk-input"
          placeholder="Search components, pages, industries…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0); }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="cmdk-list"
          aria-activedescendant={results[sel] ? `cmdk-${results[sel].id}` : undefined}
        />
        <ul className="cmdk-list" id="cmdk-list" role="listbox">
          {results.length === 0 && <li className="cmdk-empty">No matches</li>}
          {results.map((it, i) => (
            <li
              key={it.id}
              id={`cmdk-${it.id}`}
              role="option"
              aria-selected={i === sel}
              className={`cmdk-item ${i === sel ? "is-sel" : ""}`}
              onMouseEnter={() => setSel(i)}
              onClick={() => choose(it)}
            >
              <span>{it.label}</span>
              <small>{it.hint}</small>
            </li>
          ))}
        </ul>
        <div className="cmdk-foot"><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open <kbd>esc</kbd> close</div>
      </div>
    </div>
  );
}
