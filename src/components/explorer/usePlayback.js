import { useCallback, useEffect, useRef, useState } from "react";

/** Steps through `count` stages on a timer; stops at the last stage. */
export default function usePlayback(count, { interval = 2800 } = {}) {
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setTimeout(() => {
      setIndex((i) => {
        if (i + 1 >= count) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, index < 0 ? 0 : interval);
    return () => clearTimeout(timer.current);
  }, [playing, index, count, interval]);

  const play = useCallback(() => {
    setIndex((i) => (i + 1 >= count ? -1 : i));
    setPlaying(true);
  }, [count]);
  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);
  const next = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.min(count - 1, i + 1));
  }, [count]);
  const prev = useCallback(() => {
    setPlaying(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);
  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(-1);
  }, []);

  return { index, playing, play, pause, toggle, next, prev, reset, setIndex };
}
