import { useEffect, useRef, useState } from "react";
import { loopPlaylist } from "../data/services.js";

const ids = loopPlaylist.map((c) => c.youtubeId);

// Load the YouTube IFrame Player API once and resolve when it's ready.
let apiPromise;
function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/** Muted, looping YouTube playlist that plays as the home attract background. */
export default function HomeVideoLoop() {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let destroyed = false;
    loadYouTubeApi().then((YT) => {
      if (destroyed || !YT || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.loadPlaylist({ playlist: ids, index: 0 });
            e.target.setLoop(true);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              const i = e.target.getPlaylistIndex?.();
              if (typeof i === "number" && i >= 0) setIndex(i);
            }
          },
        },
      });
    });
    return () => {
      destroyed = true;
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  const current = loopPlaylist[index] ?? loopPlaylist[0];

  return (
    <div className="home-video-loop">
      <div className="home-video-loop__player">
        <div ref={hostRef} />
      </div>
      <div className="loop-brand">cloud<span>era</span></div>
      <div className="now-playing">
        <span className="dot" />
        <span className="np-label">{current.label}</span>
      </div>
      <div className="loop-pips">
        {loopPlaylist.map((clip, i) => (
          <span key={clip.youtubeId} className={`pip${i === index ? " active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
