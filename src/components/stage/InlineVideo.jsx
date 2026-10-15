import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Player, VideoThumb } from "./VideoModal.jsx";

function enterFullscreen(el) {
  if (!el) return;
  (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(el);
}
function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.webkitExitFullscreen?.();
}

/**
 * Thumbnail that turns into the player in place; nothing loads until the visitor taps it.
 * "Full screen" starts playback and fills the screen; an on-screen exit button is shown
 * because booth touch screens have no Escape key.
 */
const InlineVideo = forwardRef(function InlineVideo({ video, caption, className = "", playing: playingProp, onPlay }, ref) {
  const frameRef = useRef(null);
  const [ownPlaying, setOwnPlaying] = useState(false);
  const [isFs, setIsFs] = useState(false);
  // Controlled when a parent (the drawer) allows only one video to play at a time.
  const playing = playingProp ?? ownPlaying;
  const setPlaying = () => (onPlay ? onPlay() : setOwnPlaying(true));

  useEffect(() => {
    const on = () => setIsFs(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const fullscreen = () => {
    setPlaying();
    enterFullscreen(frameRef.current);
  };
  useImperativeHandle(ref, () => ({ fullscreen }));

  return (
    <figure className={`ivid ${className}`}>
      <div ref={frameRef} className={`ivid-frame${isFs ? " is-fs" : ""}`}>
        {playing ? <Player item={video} /> : <VideoThumb item={video} onPlay={setPlaying} />}
        {isFs ? (
          <button type="button" className="ivid-exit" onClick={exitFullscreen}>
            ✕ Exit full screen
          </button>
        ) : (
          <button type="button" className="ivid-fs" onClick={fullscreen} aria-label={`Play ${video.title} full screen`}>
            ⤢ Full screen
          </button>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
});

export default InlineVideo;
