/* ═══════════════════════════════════════════════════════════
   TETRIS ENGINE — pure game logic (no React, easy to reason about)
   Board: 20 rows × 10 cols. SRS-style shapes + simplified wall kicks.
   ═══════════════════════════════════════════════════════════ */

export const COLS = 10;
export const ROWS = 20;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type Cell = PieceType | null;
export type Grid = Cell[][];

/** Colours taken verbatim from the Claude Design mock. */
export const COLORS: Record<PieceType, string> = {
  I: '#22D3EE',
  O: '#FACC15',
  T: '#C084FC',
  S: '#4ADE80',
  Z: '#F87171',
  J: '#60A5FA',
  L: '#FB923C',
};

/** Each piece: 4 rotation states, each a list of [row, col] within its local box. */
const SHAPES: Record<PieceType, [number, number][][]> = {
  I: [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
  ],
  O: [
    [[0, 1], [0, 2], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [1, 2]],
  ],
  T: [
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 1]],
    [[0, 1], [1, 0], [1, 1], [2, 1]],
  ],
  S: [
    [[0, 1], [0, 2], [1, 0], [1, 1]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 1], [1, 2], [2, 0], [2, 1]],
    [[0, 0], [1, 0], [1, 1], [2, 1]],
  ],
  Z: [
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 2], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[0, 1], [1, 0], [1, 1], [2, 0]],
  ],
  J: [
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 0], [2, 1]],
  ],
  L: [
    [[0, 2], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [1, 2], [2, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
  ],
};

/** Simplified kick attempts (dx, dy) tried in order when a rotation collides. */
const KICKS: [number, number][] = [
  [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1],
];

const LINE_SCORES = [0, 100, 300, 500, 800];
const TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export interface ActivePiece {
  type: PieceType;
  rot: number; // 0..3
  x: number; // column offset of the local box
  y: number; // row offset of the local box (may be negative at spawn)
}

export type GameStatus = 'playing' | 'paused' | 'over';

export interface GameState {
  grid: Grid;
  active: ActivePiece;
  next: PieceType;
  bag: PieceType[];
  lines: number;
  score: number;
  level: number;
  status: GameStatus;
}

export type Action =
  | { type: 'TICK' }
  | { type: 'MOVE'; dir: -1 | 1 }
  | { type: 'ROTATE' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'RESET' };

export function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(null));
}

function shuffle(arr: PieceType[]): PieceType[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 7-bag randomiser: pull the next piece, refilling a shuffled bag when empty. */
function pull(bag: PieceType[]): [PieceType, PieceType[]] {
  const b = bag.length ? bag : shuffle(TYPES);
  const [head, ...rest] = b;
  return [head, rest];
}

function spawn(type: PieceType): ActivePiece {
  return { type, rot: 0, x: 3, y: 0 };
}

/** Absolute board cells occupied by a piece. */
export function cellsOf(p: ActivePiece): [number, number][] {
  return SHAPES[p.type][p.rot].map(([r, c]) => [p.y + r, p.x + c]);
}

export function collides(grid: Grid, p: ActivePiece): boolean {
  return cellsOf(p).some(
    ([r, c]) =>
      c < 0 || c >= COLS || r >= ROWS || (r >= 0 && grid[r][c] !== null),
  );
}

/** Where the active piece would land — used to draw the ghost. */
export function ghostCells(state: GameState): [number, number][] {
  let p = state.active;
  while (!collides(state.grid, { ...p, y: p.y + 1 })) p = { ...p, y: p.y + 1 };
  return cellsOf(p);
}

export function activeCells(state: GameState): [number, number][] {
  return cellsOf(state.active);
}

/** Cells of a piece's spawn orientation, for the NEXT preview. */
export function previewCells(type: PieceType): [number, number][] {
  return SHAPES[type][0];
}

/** Falling speed (ms per gravity step) — gets faster every level. */
export function gravityMs(level: number): number {
  return Math.max(80, 800 - (level - 1) * 65);
}

export function initState(): GameState {
  const [first, b1] = pull(shuffle(TYPES));
  const [next, b2] = pull(b1);
  return {
    grid: emptyGrid(),
    active: spawn(first),
    next,
    bag: b2,
    lines: 0,
    score: 0,
    level: 1,
    status: 'playing',
  };
}

function tryRotate(grid: Grid, p: ActivePiece): ActivePiece {
  const rot = (p.rot + 1) % 4;
  for (const [dx, dy] of KICKS) {
    const cand: ActivePiece = { ...p, rot, x: p.x + dx, y: p.y + dy };
    if (!collides(grid, cand)) return cand;
  }
  return p;
}

/** Lock the piece into the grid, clear lines, score, and spawn the next piece. */
function lockAndSpawn(state: GameState, piece: ActivePiece): GameState {
  const grid = state.grid.map((row) => row.slice());
  for (const [r, c] of cellsOf(piece)) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) grid[r][c] = piece.type;
  }

  const remaining = grid.filter((row) => row.some((cell) => cell === null));
  const cleared = ROWS - remaining.length;
  while (remaining.length < ROWS) remaining.unshift(Array<Cell>(COLS).fill(null));

  const lines = state.lines + cleared;
  const level = Math.floor(lines / 10) + 1;
  const score = state.score + (LINE_SCORES[cleared] ?? 0) * state.level;

  const [next, bag] = pull(state.bag);
  const active = spawn(state.next);
  const over = collides(remaining, active);

  return {
    ...state,
    grid: remaining,
    active,
    next,
    bag,
    lines,
    level,
    score,
    status: over ? 'over' : state.status,
  };
}

export function reducer(state: GameState, action: Action): GameState {
  if (action.type === 'RESET') return initState();

  if (action.type === 'TOGGLE_PAUSE') {
    if (state.status === 'playing') return { ...state, status: 'paused' };
    if (state.status === 'paused') return { ...state, status: 'playing' };
    return state;
  }

  if (state.status !== 'playing') return state;

  switch (action.type) {
    case 'MOVE': {
      const cand = { ...state.active, x: state.active.x + action.dir };
      return collides(state.grid, cand) ? state : { ...state, active: cand };
    }
    case 'ROTATE':
      return { ...state, active: tryRotate(state.grid, state.active) };
    case 'TICK':
    case 'SOFT_DROP': {
      const cand = { ...state.active, y: state.active.y + 1 };
      if (!collides(state.grid, cand)) {
        const bonus = action.type === 'SOFT_DROP' ? 1 : 0;
        return { ...state, active: cand, score: state.score + bonus };
      }
      return lockAndSpawn(state, state.active);
    }
    case 'HARD_DROP': {
      let p = state.active;
      let dist = 0;
      while (!collides(state.grid, { ...p, y: p.y + 1 })) {
        p = { ...p, y: p.y + 1 };
        dist++;
      }
      return lockAndSpawn({ ...state, score: state.score + dist * 2 }, p);
    }
    default:
      return state;
  }
}
