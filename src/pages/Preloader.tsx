import { useEffect, useState } from "react";
import "./Preloader.scss";

interface PreloaderProps {
  assets?: string[];
  fonts?: string[];
  onEnter?: () => void;
}

export default function Preloader({ assets = [], fonts = [], onEnter }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalCount = Math.max(1, assets.length + fonts.length);

    const checkComplete = () => {
      loadedCount++;
      const p = Math.min(100, Math.round((loadedCount / totalCount) * 100));
      setProgress(p);
      if (loadedCount >= totalCount) {
        setIsLoaded(true);
      }
    };

    // Preload image assets
    if (assets.length === 0 && fonts.length === 0) {
      setProgress(100);
      setIsLoaded(true);
      return;
    }

    assets.forEach((src) => {
      const img = new Image();
      img.onload = checkComplete;
      img.onerror = checkComplete;
      img.src = src;
    });

    // Check fonts
    if (document.fonts && fonts.length > 0) {
      Promise.all(fonts.map((f) => document.fonts.load(`1em "${f}"`)))
        .then(() => {
          fonts.forEach(() => checkComplete());
        })
        .catch(() => {
          fonts.forEach(() => checkComplete());
        });
    }

    // Safety timeout so preloader never blocks permanently
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
    }, 2200);

    return () => clearTimeout(safetyTimer);
  }, [assets, fonts]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter?.();
    }, 450);
  };

  return (
    <div className={`carnival-preloader ${isExiting ? "exiting" : ""}`} role="dialog" aria-modal="true" aria-label="Carnival loading">
      <div className="preloader-backdrop"></div>
      <div className="preloader-content">
        <div className="marquee-crest">
          <span className="crest-star">✦</span>
          <p className="kicker">SUPRAGNA 2K27</p>
          <span className="crest-star">✦</span>
        </div>
        <h1 className="title">Events</h1>
        <p className="subtitle"></p>

        <div className="meter-frame">
          <div className="meter-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="action-row">
          {isLoaded ? (
            <button
              type="button"
              className="enter-btn"
              onClick={handleEnter}
              autoFocus
            >
              <span>ENTER THE CARNIVAL ➔</span>
            </button>
          ) : (
            <span className="loading-badge">LIGHTING THE TENTS {progress}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
