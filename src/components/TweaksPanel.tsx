import { useEffect } from 'react';

export type Theme = 'dark' | 'light';
export type HeroVariant = 'statement' | 'grid';
export type AccentUse = 'minimal' | 'standard' | 'loud';

export interface Tweaks {
  theme: Theme;
  heroVariant: HeroVariant;
  accentUse: AccentUse;
  showSectionIndex: boolean;
  monoOverlines: boolean;
}

interface TweaksPanelProps {
  tweaks: Tweaks;
  setTweaks: (t: Tweaks) => void;
  open: boolean;
}

export function TweaksPanel({ tweaks, setTweaks, open }: TweaksPanelProps) {
  const set = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) =>
    setTweaks({ ...tweaks, [k]: v });

  useEffect(() => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: tweaks }, '*');
    }
  }, [tweaks]);

  return (
    <div className={`tweaks ${open ? 'open' : ''}`} role="region" aria-label="Tweaks">
      <h4>TWEAKS</h4>

      <div className="tweak-row">
        <label>Theme</label>
        <div className="tweak-btn-group">
          {(['dark', 'light'] as Theme[]).map((v) => (
            <button
              key={v}
              className={`tweak-btn ${tweaks.theme === v ? 'on' : ''}`}
              onClick={() => set('theme', v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Hero</label>
        <div className="tweak-btn-group">
          {(['statement', 'grid'] as HeroVariant[]).map((v) => (
            <button
              key={v}
              className={`tweak-btn ${tweaks.heroVariant === v ? 'on' : ''}`}
              onClick={() => set('heroVariant', v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Accent use</label>
        <div className="tweak-btn-group">
          {(['minimal', 'standard', 'loud'] as AccentUse[]).map((v) => (
            <button
              key={v}
              className={`tweak-btn ${tweaks.accentUse === v ? 'on' : ''}`}
              onClick={() => set('accentUse', v)}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <label>Section index</label>
        <div className="tweak-btn-group">
          <button
            className={`tweak-btn ${tweaks.showSectionIndex ? 'on' : ''}`}
            onClick={() => set('showSectionIndex', true)}
          >
            ON
          </button>
          <button
            className={`tweak-btn ${!tweaks.showSectionIndex ? 'on' : ''}`}
            onClick={() => set('showSectionIndex', false)}
          >
            OFF
          </button>
        </div>
      </div>

      <div className="tweak-row">
        <label>Mono overlines</label>
        <div className="tweak-btn-group">
          <button
            className={`tweak-btn ${tweaks.monoOverlines ? 'on' : ''}`}
            onClick={() => set('monoOverlines', true)}
          >
            ON
          </button>
          <button
            className={`tweak-btn ${!tweaks.monoOverlines ? 'on' : ''}`}
            onClick={() => set('monoOverlines', false)}
          >
            OFF
          </button>
        </div>
      </div>
    </div>
  );
}
