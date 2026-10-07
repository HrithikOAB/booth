import { useState } from "react";
import { assets } from "../data/assets.js";

export default function HeroVideo() {
  const [videoSrc, setVideoSrc] = useState(assets.heroBackgroundVideo);
  const [failed, setFailed] = useState(false);

  const onError = () => {
    if (videoSrc !== assets.heroBackgroundFallback) setVideoSrc(assets.heroBackgroundFallback);
    else setFailed(true);
  };

  return (
    <div className="hero-video-component">
      <div className="hero-video-frame">
        {!failed ? (
          <video
            key={videoSrc}
            className="hero-video-el"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="auto"
            onError={onError}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <div className="hero-video-fallback">
            <p>Video unavailable</p>
            <span>Add a clip at {assets.heroBackgroundVideo}</span>
          </div>
        )}
      </div>
      <p className="hero-video-caption">Cloudera platform in action</p>
    </div>
  );
}
