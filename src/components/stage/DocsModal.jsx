import { useState } from "react";
import Modal from "./Modal.jsx";
import { useQr, shortUrl } from "./QrLink.jsx";

const DOC_KIND = { architecture: "Official architecture", product: "Product page", docs: "Documentation", press: "Press release", project: "Project site", vendor: "Vendor site" };
const ORDER = ["architecture", "product", "docs", "project", "vendor", "press"];

/** Official resources as scannable QR codes, so the visitor never leaves the architecture. */
export default function DocsModal({ title, docs, onClose }) {
  const list = [...docs].filter((d) => d.verified).sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  const [idx, setIdx] = useState(0);
  const doc = list[idx];
  const qr = useQr(doc?.url, 320);

  return (
    <Modal onClose={onClose} label={`Official resources for ${title}`} className="dm">
      <header className="dm-head">
        <span className="dm-kicker">Official resources</span>
        <h2>{title}</h2>
      </header>
      {list.length === 0 ? (
        <p className="dm-empty">No verified resource yet.</p>
      ) : (
        <div className="dm-body">
          <ul className="dm-list" role="tablist" aria-label="Resources">
            {list.slice(0, 6).map((d, i) => (
              <li key={d.url}>
                <button type="button" role="tab" aria-selected={i === idx} className={i === idx ? "on" : ""} onClick={() => setIdx(i)}>
                  <span>{DOC_KIND[d.kind] ?? "Resource"}</span>
                  <strong>{d.title}</strong>
                </button>
              </li>
            ))}
          </ul>
          <figure className="dm-qr">
            {qr ? <img src={qr} alt={`QR code for ${doc.title}`} width="240" height="240" /> : <div className="dm-qr-ph" />}
            <figcaption>
              <strong>Scan to open on your phone</strong>
              <a href={doc.url} target="_blank" rel="noreferrer">
                {shortUrl(doc.url)}
              </a>
              {doc.checkedOn && <small>Link verified {doc.checkedOn}</small>}
            </figcaption>
          </figure>
        </div>
      )}
    </Modal>
  );
}
