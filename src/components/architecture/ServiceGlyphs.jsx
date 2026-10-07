/**
 * Line-style service icons matching the official Cloudera diagram tiles:
 *   ai → connected neural nodes,  de → gear over stacked blocks,
 *   dl → data-lakehouse building,  df → branching data-flow arrows.
 * API unchanged: <ServiceGlyphs type="ai|de|dl|df" />
 */
export default function ServiceGlyphs({ type }) {
  const c = { className: "svc-glyph", width: 40, height: 40, viewBox: "0 0 40 40", "aria-hidden": true };
  const blue = "#2b6cb0";
  const orange = "#f2662d";

  if (type === "ai") {
    return (
      <svg {...c}>
        <g stroke={blue} strokeWidth="1.6" fill="none">
          <path d="M20 10v6M14 28l4-9M26 28l-4-9" />
        </g>
        <circle cx="20" cy="9" r="3.2" fill={blue} />
        <circle cx="13" cy="29" r="3.2" fill={blue} />
        <circle cx="27" cy="29" r="3.2" fill={blue} />
        <circle cx="20" cy="19" r="2.4" fill={orange} />
      </svg>
    );
  }

  if (type === "de") {
    return (
      <svg {...c}>
        <g fill="none" stroke={orange} strokeWidth="1.6">
          <circle cx="20" cy="12" r="5" />
          <path d="M20 5v2M20 17v2M13 12h2M25 12h2M15 7l1.4 1.4M24.6 15.6L26 17M15 17l1.4-1.4M24.6 8.4L26 7" />
        </g>
        <circle cx="20" cy="12" r="1.8" fill={orange} />
        <g fill={blue}>
          <rect x="10" y="24" width="8" height="8" rx="1.2" />
          <rect x="22" y="24" width="8" height="8" rx="1.2" />
        </g>
      </svg>
    );
  }

  if (type === "dl") {
    return (
      <svg {...c}>
        <path d="M20 7l12 7H8z" fill={blue} />
        <g stroke={blue} strokeWidth="1.6" fill="none">
          <path d="M10 14v16M30 14v16M10 30h20" />
          <path d="M15 16v12M20 16v12M25 16v12" />
        </g>
        <path d="M8 30h24" stroke="#0d9488" strokeWidth="2.4" />
      </svg>
    );
  }

  if (type === "dw") {
    return (
      <svg {...c}>
        <path d="M8 32h24" stroke={blue} strokeWidth="1.6" />
        <g fill={blue}>
          <rect x="10" y="20" width="4" height="12" rx="1" />
          <rect x="18" y="14" width="4" height="18" rx="1" />
          <rect x="26" y="23" width="4" height="9" rx="1" />
        </g>
        <path d="M11 16l6-5 5 4 6-7" fill="none" stroke={orange} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "agent") {
    return (
      <svg {...c}>
        <path d="M20 6l11 6.5v13L20 32 9 25.5v-13z" fill="none" stroke={blue} strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="20" cy="19" r="3" fill={orange} />
        <g stroke={blue} strokeWidth="1.4">
          <path d="M20 12v4M20 22v4M15 19h2M23 19h2" />
        </g>
      </svg>
    );
  }

  // df — branching flow
  return (
    <svg {...c}>
      <g stroke={blue} strokeWidth="1.6" fill="none">
        <path d="M10 20h7M17 20c5 0 3-9 8-9M17 20c5 0 3 9 8 9" />
      </g>
      <circle cx="9" cy="20" r="3" fill={orange} />
      <g fill={blue}>
        <circle cx="27" cy="11" r="3" />
        <circle cx="27" cy="29" r="3" />
      </g>
    </svg>
  );
}
