export type NodeCategory = 'lang' | 'fw' | 'be' | 'data' | 'infra' | 'tool';

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
  { id: 'ts',        label: 'TypeScript', r: 40, cat: 'lang', yrs: 5, freq: 'DAILY'   },
  { id: 'nextjs',    label: 'Next.js',    r: 40, cat: 'fw',   yrs: 4, freq: 'DAILY'   },
  { id: 'pg',        label: 'PostgreSQL', r: 40, cat: 'data', yrs: 4, freq: 'DAILY'   },
  { id: 'react',     label: 'React',      r: 40, cat: 'fw',   yrs: 5, freq: 'DAILY'   },

  // Medium — 28
  { id: 'node',      label: 'Node.js',    r: 28, cat: 'be',   yrs: 5, freq: 'DAILY'   },
  { id: 'go',        label: 'Go',         r: 28, cat: 'lang', yrs: 2, freq: 'WEEKLY'  },
  { id: 'astro',     label: 'Astro',      r: 28, cat: 'fw',   yrs: 2, freq: 'WEEKLY'  },
  { id: 'docker',    label: 'Docker',     r: 28, cat: 'infra',yrs: 3, freq: 'WEEKLY'  },
  { id: 'prisma',    label: 'Prisma',     r: 28, cat: 'be',   yrs: 3, freq: 'DAILY'   },
  { id: 'tailwind',  label: 'Tailwind',   r: 28, cat: 'tool', yrs: 4, freq: 'DAILY'   },

  // Small — 18
  { id: 'js',        label: 'JavaScript', r: 18, cat: 'lang', yrs: 6, freq: 'DAILY'   },
  { id: 'rust',      label: 'Rust',       r: 18, cat: 'lang', yrs: 1, freq: 'MONTHLY' },
  { id: 'python',    label: 'Python',     r: 18, cat: 'lang', yrs: 3, freq: 'WEEKLY'  },
  { id: 'sql',       label: 'SQL',        r: 18, cat: 'lang', yrs: 5, freq: 'DAILY'   },
  { id: 'sveltekit', label: 'SvelteKit',  r: 18, cat: 'fw',   yrs: 1, freq: 'MONTHLY' },
  { id: 'rails',     label: 'Rails',      r: 18, cat: 'fw',   yrs: 2, freq: 'MONTHLY' },
  { id: 'trpc',      label: 'tRPC',       r: 18, cat: 'be',   yrs: 2, freq: 'WEEKLY'  },
  { id: 'rest',      label: 'REST',       r: 18, cat: 'be',   yrs: 5, freq: 'DAILY'   },
  { id: 'redis',     label: 'Redis',      r: 18, cat: 'data', yrs: 2, freq: 'WEEKLY'  },
  { id: 'sqlite',    label: 'SQLite',     r: 18, cat: 'data', yrs: 3, freq: 'WEEKLY'  },
  { id: 'clickhouse',label: 'ClickHouse', r: 18, cat: 'data', yrs: 1, freq: 'MONTHLY' },
  { id: 'fly',       label: 'Fly.io',     r: 18, cat: 'infra',yrs: 2, freq: 'WEEKLY'  },
  { id: 'terra',     label: 'Terraform',  r: 18, cat: 'infra',yrs: 1, freq: 'MONTHLY' },
  { id: 'nginx',     label: 'Nginx',      r: 18, cat: 'infra',yrs: 3, freq: 'WEEKLY'  },
  { id: 'figma',     label: 'Figma',      r: 18, cat: 'tool', yrs: 5, freq: 'DAILY'   },
  { id: 'linear',    label: 'Linear',     r: 18, cat: 'tool', yrs: 2, freq: 'DAILY'   },
  { id: 'neovim',    label: 'Neovim',     r: 18, cat: 'tool', yrs: 3, freq: 'DAILY'   },
  { id: 'git',       label: 'Git',        r: 18, cat: 'tool', yrs: 6, freq: 'DAILY'   },
];

export const EDGES: ReadonlyArray<readonly [string, string]> = [
  ['ts','js'], ['ts','react'], ['ts','nextjs'], ['ts','node'], ['ts','trpc'],
  ['js','react'], ['js','node'],
  ['sql','pg'], ['sql','sqlite'], ['sql','clickhouse'],
  ['go','docker'], ['go','rest'],
  ['python','sql'], ['python','rest'],
  ['rust','go'],

  ['nextjs','react'], ['nextjs','node'], ['nextjs','tailwind'], ['nextjs','trpc'],
  ['react','tailwind'], ['react','astro'], ['astro','tailwind'],
  ['sveltekit','tailwind'], ['rails','pg'], ['rails','redis'],

  ['node','prisma'], ['prisma','pg'], ['prisma','sqlite'],
  ['trpc','node'], ['rest','node'],
  ['node','redis'], ['redis','pg'],

  ['docker','fly'], ['docker','terra'], ['fly','terra'],
  ['nginx','docker'], ['nginx','fly'], ['nginx','rest'],

  ['figma','linear'], ['figma','tailwind'],
  ['neovim','git'], ['linear','git'], ['git','node'],
];

export interface CatPalette {
  fill: string;
  stroke: string;
  label: string;
}

export const CAT_COLOR: Record<NodeCategory, CatPalette> = {
  lang:  { fill: 'rgba(242, 135, 5, 0.22)',   stroke: '#F28705',                 label: '#F28705' },
  fw:    { fill: 'rgba(242, 242, 242, 0.10)', stroke: '#F2F2F2',                 label: '#F2F2F2' },
  be:    { fill: 'rgba(210, 206, 198, 0.10)', stroke: 'rgba(230,226,218,0.9)',   label: 'rgba(230,226,218,0.95)' },
  data:  { fill: 'rgba(160, 156, 148, 0.16)', stroke: 'rgba(200,196,188,0.85)',  label: 'rgba(220,216,208,0.92)' },
  infra: { fill: 'rgba(160, 156, 148, 0.12)', stroke: 'rgba(180,176,168,0.7)',   label: 'rgba(200,196,188,0.88)' },
  tool:  { fill: 'rgba(242, 242, 242, 0.06)', stroke: 'rgba(242,242,242,0.55)',  label: 'rgba(230,226,218,0.82)' },
};
