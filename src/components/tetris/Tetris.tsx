import { useEffect, useReducer, useRef, type CSSProperties } from 'react';
import { useI18n } from '../../contexts/I18nContext';
import {
  COLS,
  ROWS,
  COLORS,
  reducer,
  initState,
  gravityMs,
  activeCells,
  ghostCells,
  previewCells,
  type Action,
} from './engine';

const pad = (n: number, len: number) => String(n).padStart(len, '0');
const cellVar = (color?: string): CSSProperties | undefined =>
  color ? ({ '--cell-color': color } as CSSProperties) : undefined;

export function Tetris() {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  // Latest state for listeners/loop without re-subscribing every render.
  // Synced in an effect (not during render) so async readers — the RAF loop and
  // key/pointer handlers — always see the current state.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  });

  // ── Gravity loop: RAF + time accumulator (framerate independent) ──
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const s = stateRef.current;
      const dt = now - last;
      last = now;
      if (s.status !== 'playing') {
        acc = 0;
        return;
      }
      acc += dt;
      if (acc > 1000) acc = gravityMs(s.level); // clamp after long stalls
      while (acc >= gravityMs(s.level)) {
        acc -= gravityMs(s.level);
        dispatch({ type: 'TICK' });
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Keyboard controls (desktop) ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          dispatch({ type: 'MOVE', dir: -1 });
          break;
        case 'ArrowRight':
          e.preventDefault();
          dispatch({ type: 'MOVE', dir: 1 });
          break;
        case 'ArrowDown':
          e.preventDefault();
          dispatch({ type: 'SOFT_DROP' });
          break;
        case 'ArrowUp':
        case 'x':
        case 'X':
          e.preventDefault();
          dispatch({ type: 'ROTATE' });
          break;
        case ' ':
          e.preventDefault();
          dispatch(s.status === 'over' ? { type: 'RESET' } : { type: 'HARD_DROP' });
          break;
        case 'p':
        case 'P':
          dispatch({ type: 'TOGGLE_PAUSE' });
          break;
        case 'r':
        case 'R':
        case 'Enter':
          if (e.key === 'Enter' && s.status !== 'over') break;
          dispatch({ type: 'RESET' });
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Auto-pause when the tab is hidden ──
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && stateRef.current.status === 'playing') {
        dispatch({ type: 'TOGGLE_PAUSE' });
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, []);

  // ── Touch controls: tap with press-and-hold auto-repeat ──
  const holdTimer = useRef<number | null>(null);
  const repeatTimer = useRef<number | null>(null);
  const stopRepeat = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (repeatTimer.current) window.clearInterval(repeatTimer.current);
    holdTimer.current = null;
    repeatTimer.current = null;
  };
  const press = (action: Action, repeat: boolean) => (e: React.PointerEvent) => {
    e.preventDefault();
    dispatch(action);
    if (!repeat) return;
    holdTimer.current = window.setTimeout(() => {
      repeatTimer.current = window.setInterval(() => dispatch(action), 60);
    }, 220);
  };
  useEffect(() => stopRepeat, []);

  // ── Build the render layer from current state ──
  const active = activeCells(state);
  const ghost = state.status === 'playing' ? ghostCells(state) : [];
  const activeSet = new Set(active.map(([r, c]) => r * COLS + c));
  const ghostSet = new Set(ghost.map(([r, c]) => r * COLS + c));
  const activeColor = COLORS[state.active.type];

  const nextSet = new Set(previewCells(state.next).map(([r, c]) => r * 4 + c));
  const nextColor = COLORS[state.next];

  return (
    <div className="tetris">
      <div className="tetris-stage">
        <div className="tetris-board-wrap">
          <div className="tetris-board" aria-hidden="true">
            {Array.from({ length: ROWS }).map((_, r) =>
              Array.from({ length: COLS }).map((_, c) => {
                const key = r * COLS + c;
                const filled = state.grid[r][c];
                let cls = 't-cell';
                let color: string | undefined;
                if (filled) {
                  cls += ' filled';
                  color = COLORS[filled];
                } else if (activeSet.has(key)) {
                  cls += ' active';
                  color = activeColor;
                } else if (ghostSet.has(key)) {
                  cls += ' ghost';
                  color = activeColor;
                }
                return <div key={key} className={cls} style={cellVar(color)} />;
              }),
            )}
          </div>

          {state.status !== 'playing' && (
            <div className="tetris-overlay">
              <p className="tetris-overlay-title">
                {state.status === 'over' ? t.notFound.gameOver : t.notFound.paused}
              </p>
              {state.status === 'over' && (
                <p className="tetris-overlay-score">
                  {t.notFound.panel.score} {pad(state.score, 4)}
                </p>
              )}
              <button
                type="button"
                className="tetris-overlay-btn"
                data-cursor="link"
                onClick={() =>
                  dispatch(state.status === 'over' ? { type: 'RESET' } : { type: 'TOGGLE_PAUSE' })
                }
              >
                {state.status === 'over' ? t.notFound.restart : t.notFound.resume}
              </button>
            </div>
          )}
        </div>

        <div className="tetris-panel">
          <div className="panel-sec">
            <p className="panel-lbl">{t.notFound.panel.next}</p>
            <div className="next-grid" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, r) =>
                Array.from({ length: 4 }).map((_, c) => {
                  const k = r * 4 + c;
                  const on = nextSet.has(k);
                  return (
                    <div
                      key={k}
                      className={on ? 'next-cell filled' : 'next-cell'}
                      style={on ? cellVar(nextColor) : undefined}
                    />
                  );
                }),
              )}
            </div>
          </div>

          <div className="panel-sec">
            <p className="panel-lbl">{t.notFound.panel.lines}</p>
            <p className="stat-num">{pad(state.lines, 4)}</p>
          </div>

          <div className="panel-sec">
            <p className="panel-lbl">{t.notFound.panel.score}</p>
            <p className="stat-num">{pad(state.score, 4)}</p>
          </div>

          <div className="panel-sec">
            <p className="panel-lbl">{t.notFound.panel.level}</p>
            <p className="stat-num">{pad(state.level, 2)}</p>
          </div>

          <div className="panel-sec">
            <div className="panel-btns">
              <button
                type="button"
                className="panel-btn pause"
                data-cursor="link"
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              >
                {state.status === 'paused' ? t.notFound.resume : t.notFound.pause}
              </button>
              <button
                type="button"
                className="panel-btn"
                data-cursor="link"
                onClick={() => dispatch({ type: 'RESET' })}
              >
                {t.notFound.stop}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tetris-touch" aria-label={t.notFound.touchHint}>
        <button
          type="button"
          className="touch-btn"
          aria-label="Left"
          onPointerDown={press({ type: 'MOVE', dir: -1 }, true)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
        >
          ◀
        </button>
        <button
          type="button"
          className="touch-btn"
          aria-label="Rotate"
          onPointerDown={press({ type: 'ROTATE' }, false)}
        >
          ⟳
        </button>
        <button
          type="button"
          className="touch-btn"
          aria-label="Right"
          onPointerDown={press({ type: 'MOVE', dir: 1 }, true)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
        >
          ▶
        </button>
        <button
          type="button"
          className="touch-btn"
          aria-label="Soft drop"
          onPointerDown={press({ type: 'SOFT_DROP' }, true)}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
          onPointerCancel={stopRepeat}
        >
          ▼
        </button>
        <button
          type="button"
          className="touch-btn drop"
          aria-label="Hard drop"
          onPointerDown={press(
            state.status === 'over' ? { type: 'RESET' } : { type: 'HARD_DROP' },
            false,
          )}
        >
          DROP
        </button>
      </div>
    </div>
  );
}
