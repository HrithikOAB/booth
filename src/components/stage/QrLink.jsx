import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function useQr(url, size = 168) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let live = true;
    setSrc(null);
    if (url) QRCode.toDataURL(url, { width: size, margin: 1, color: { dark: "#0e1a26", light: "#ffffff" } }).then((d) => live && setSrc(d));
    return () => {
      live = false;
    };
  }, [url, size]);
  return src;
}

export const shortUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\.html$/, "");

/** Booth-friendly link: a small QR the visitor scans, plus a plain link for staff. */
export default function QrLink({ url, label }) {
  const qr = useQr(url, 96);
  return (
    <a className="qrlink" href={url} target="_blank" rel="noreferrer" title={url}>
      {qr ? <img src={qr} alt="" width="48" height="48" /> : <span className="qrlink-ph" />}
      <span>
        <strong>{label}</strong>
        <small>Scan to open</small>
      </span>
    </a>
  );
}
