import { useEffect, useRef, useState } from "react";
import { loopPlaylist } from "../data/services.js";

export default function HomeVideoLoop() {
  const videoRef = useRef(null);
  const [index, setIndex] = useState(0);
  const current = loopPlaylist[index];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    const p = el.play();
    if (p?.catch) p.catch(() => {});
  }, [index]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el?.textTracks) return;
    const enableCaptions = () => {
      for (let i = 0; i < el.textTracks.length; i++) {
        el.textTracks[i].mode = "showing";
      }
    };
    enableCaptions();
    el.addEventListener("loadedmetadata", enableCaptions);
    return () => el.removeEventListener("loadedmetadata", enableCaptions);
  }, [index, current.slug]);

  const goNext = () => setIndex((i) => (i + 1) % loopPlaylist.length);

  return (
    <div className="home-video-loop">
      <video
        ref={videoRef}
        key={current.slug}
        className="home-video-loop__player"
        autoPlay
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        onEnded={goNext}
        onError={goNext}
      >
        <source src={`/videos/${current.slug}.mp4`} type="video/mp4" />
        {current.captions && (
          <track kind="captions" src={current.captions} srcLang="en" label="English" default />
        )}
      </video>
      <div className="loop-brand">cloud<span>era</span></div>
      <div className="now-playing">
        <span className="dot" />
        <span className="np-label">{current.label}</span>
      </div>
      <div className="loop-pips">
        {loopPlaylist.map((clip, i) => (
          <span key={clip.slug} className={`pip${i === index ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
