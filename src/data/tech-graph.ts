export type NodeCategory = 'lang' | 'fw' | 'be' | 'data' | 'infra' | 'tool' | 'design' | 'shell';

export interface GraphNode {
  id: string;
  label: string;
  r: number;
  cat: NodeCategory;
  yrs: number;
  freq: 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

export const NODES: GraphNode[] = [
  // Large — 40
  { id: 'ts',         label: 'TypeScript',  r: 40, cat: 'lang',   yrs: 5, freq: 'DAILY'   },
  { id: 'nextjs',     label: 'Next.js',     r: 40, cat: 'fw',     yrs: 4, freq: 'DAILY'   },
  { id: 'pg',         label: 'PostgreSQL',  r: 40, cat: 'data',   yrs: 4, freq: 'DAILY'   },
  { id: 'react',      label: 'React',       r: 40, cat: 'fw',     yrs: 5, freq: 'DAILY'   },
  { id: 'java',       label: 'Java',        r: 40, cat: 'lang',   yrs: 5, freq: 'DAILY'   },
  { id: 'spring',     label: 'Spring Boot', r: 28, cat: 'fw',     yrs: 5, freq: 'DAILY'   },
  { id: 'c',          label: 'C',           r: 18, cat: 'lang',   yrs: 5, freq: 'DAILY'   },

  // Medium — 28
  { id: 'node',       label: 'Node.js',     r: 28, cat: 'be',     yrs: 5, freq: 'DAILY'   },
  { id: 'docker',     label: 'Docker',      r: 28, cat: 'infra',  yrs: 3, freq: 'WEEKLY'  },
  { id: 'tailwind',   label: 'Tailwind',    r: 28, cat: 'tool',   yrs: 4, freq: 'DAILY'   },

  // Small — 18
  { id: 'js',         label: 'JavaScript',  r: 18, cat: 'lang',   yrs: 6, freq: 'DAILY'   },
  { id: 'sql',        label: 'SQL',         r: 18, cat: 'lang',   yrs: 5, freq: 'DAILY'   },
  { id: 'sqlite',     label: 'SQLite',      r: 18, cat: 'data',   yrs: 3, freq: 'WEEKLY'  },
  { id: 'git',        label: 'Git',         r: 18, cat: 'tool',   yrs: 6, freq: 'DAILY'   },
  { id: 'postman',    label: 'Postman',     r: 18, cat: 'tool',   yrs: 6, freq: 'DAILY'   },
  { id: 'intellij',   label: 'Intellij',    r: 18, cat: 'tool',   yrs: 6, freq: 'DAILY'   },
  { id: 'dbeaver',    label: 'Dbeaver',     r: 18, cat: 'tool',   yrs: 6, freq: 'DAILY'   },
  { id: 'apidog',     label: 'API Dog',     r: 18, cat: 'tool',   yrs: 2, freq: 'WEEKLY'  },
  { id: 'cursor',     label: 'Cursor',      r: 18, cat: 'tool',   yrs: 1, freq: 'DAILY'   },
  { id: 'trello',     label: 'Trello',      r: 18, cat: 'tool',   yrs: 3, freq: 'MONTHLY' },

  // Shell — 18
  { id: 'bash',       label: 'Bash',        r: 18, cat: 'shell',  yrs: 4, freq: 'DAILY'   },
  { id: 'powershell', label: 'PowerShell',  r: 18, cat: 'shell',  yrs: 2, freq: 'WEEKLY'  },
  { id: 'warp',       label: 'Warp',        r: 18, cat: 'shell',  yrs: 1, freq: 'DAILY'   },

  // Design — 18
  { id: 'figma',      label: 'Figma',       r: 18, cat: 'design', yrs: 5, freq: 'DAILY'   },
  { id: 'excalidraw', label: 'Excalidraw',  r: 18, cat: 'design', yrs: 2, freq: 'WEEKLY'  },
  { id: 'miro',       label: 'Miro',        r: 18, cat: 'design', yrs: 2, freq: 'WEEKLY'  },
];

export const EDGES: ReadonlyArray<readonly [string, string]> = [
  // TypeScript / JS core
  ['ts','js'], ['ts','react'], ['ts','nextjs'], ['ts','node'],
  ['js','react'], ['js','node'],

  // SQL / data
  ['sql','pg'], ['sql','sqlite'],

  // Next.js / React / Tailwind
  ['nextjs','react'], ['nextjs','node'], ['nextjs','tailwind'],
  ['react','tailwind'],

  // Git
  ['git','node'],

  // Shell / Terminal
  ['bash','warp'], ['bash','powershell'], ['bash','git'], ['bash','docker'],
  ['warp','git'], ['warp','docker'], ['warp','cursor'],

  // Cursor / IDE
  ['cursor','ts'], ['cursor','react'], ['cursor','git'], ['cursor','intellij'],

  // API testing
  ['apidog','postman'], ['apidog','node'], ['apidog','spring'],
  ['postman','node'], ['postman','spring'],

  // Design tools
  ['figma','tailwind'], ['figma','react'],
  ['excalidraw','figma'], ['excalidraw','miro'],
  ['miro','figma'], ['miro','trello'],
  ['trello','figma'], ['trello','git'],

  // Java / Spring
  ['java','spring'], ['java','sql'], ['java','intellij'], ['java','c'],
  ['spring','pg'], ['spring','docker'],
  ['c','bash'],
];

export interface CatPalette {
  fill: string;
  stroke: string;
  label: string;
}

export const CAT_COLOR: Record<NodeCategory, CatPalette> = {
  // LANGUAGES — amber/orange (primary identity)
  lang: {
    fill:   'rgba(242, 135, 5, 0.22)',
    stroke: '#F28705',
    label:  '#F28705',
  },
  // FRAMEWORKS — white (UI layer)
  fw: {
    fill:   'rgba(242, 242, 242, 0.10)',
    stroke: 'rgba(242, 242, 242, 0.85)',
    label:  '#F2F2F2',
  },
  // BACKEND / RUNTIME — blue-gray
  be: {
    fill:   'rgba(96, 165, 250, 0.12)',
    stroke: 'rgba(147, 197, 253, 0.75)',
    label:  'rgba(186, 230, 253, 0.90)',
  },
  // DATA / DATABASES — teal
  data: {
    fill:   'rgba(20, 184, 166, 0.14)',
    stroke: 'rgba(45, 212, 191, 0.75)',
    label:  'rgba(94, 234, 212, 0.90)',
  },
  // INFRA — red-orange (fire/server energy)
  infra: {
    fill:   'rgba(239, 68, 68, 0.14)',
    stroke: 'rgba(252, 165, 165, 0.70)',
    label:  'rgba(254, 202, 202, 0.88)',
  },
  // TOOLS — muted white (neutral utilities)
  tool: {
    fill:   'rgba(148, 163, 184, 0.10)',
    stroke: 'rgba(203, 213, 225, 0.55)',
    label:  'rgba(226, 232, 240, 0.82)',
  },
  // DESIGN — violet/purple
  design: {
    fill:   'rgba(139, 92, 246, 0.18)',
    stroke: 'rgba(167, 139, 250, 0.80)',
    label:  'rgba(196, 181, 253, 0.92)',
  },
  // SHELL / TERMINAL — green
  shell: {
    fill:   'rgba(34, 197, 94, 0.14)',
    stroke: 'rgba(74, 222, 128, 0.75)',
    label:  'rgba(134, 239, 172, 0.90)',
  },
};
