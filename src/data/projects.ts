export type ProjectStatus = 'LIVE' | 'BETA' | 'CASE';

export interface StackEntry {
  name: string;
  role: string;
  detail: string;
}

export interface PaletteSwatch {
  hex: string;
  role: string;
}

export interface TypographyRow {
  role: string;
  family: string;
  weight: string;
  size: string;
  sample: string;
  mode: 'typewriter' | 'static';
}

export interface ComponentToken {
  label: string;
  role: string;
  kind: 'cta-primary' | 'cta-ghost' | 'service-card' | 'badge' | 'nav-link';
}

export interface SpacingSpec {
  base: string;
  sectionPadding: string;
  maxWidth: string;
  grid: string;
}

export interface ImplNote {
  n: string;
  title: string;
  body: string;
}

export type RoadmapPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type RoadmapStatus = 'SUGGESTED' | 'PLANNED' | 'IN PROGRESS';

export interface RoadmapItem {
  priority: RoadmapPriority;
  name: string;
  desc: string;
  effort: string;
  status: RoadmapStatus;
}

export interface CaseStudyNav {
  slug: string;
  n: string;
  title: string;
  desc: string;
}

export interface CaseStudyContent {
  slug: string;
  n: string;
  h1Lines: string[];
  tagline: string;
  overview: { problem: string; solution: string; result: string };
  brief: string[];
  meta: Array<{ k: string; v: string }>;
  palette: PaletteSwatch[];
  typography: TypographyRow[];
  components: ComponentToken[];
  spacing: SpacingSpec;
  stack: StackEntry[];
  notes: ImplNote[];
  roadmap: RoadmapItem[];
  nav: { prev?: CaseStudyNav; next?: CaseStudyNav };
}

export interface Project {
  n: string;
  status: ProjectStatus;
  title: string;
  desc: string;
  client: string;
  year: string;
  role: string;
  stack: string[];
  tag: string;
  slug?: string;
  caseStudy?: CaseStudyContent;
}

const UTI_CASE: CaseStudyContent = {
  slug: 'uti-informatica',
  n: '001',
  h1Lines: ['UTI Informática', '& Celulares'],
  tagline: 'Landing page that converts walk-ins into WhatsApp leads.',
  overview: {
    problem: 'Repair shop invisible online, losing leads to larger chains',
    solution: 'Dark landing page, WhatsApp as primary CTA, Google Maps structured data',
    result: '[ RESULT · TBD ]',
  },
  brief: [
    'UTI Informática & Celulares is an Apple-focused repair shop in Foz do Iguaçu. Walk-in traffic from the downtown area was steady, but online visibility was nonexistent — the business had no site, no Google Business profile optimization, and a Facebook page that hadn\'t been updated since 2022. Prospective customers searching "conserto iPhone Foz" were landing on competing chains two blocks away.',
    'The client had two hard constraints: no recurring monthly cost for a SaaS site builder, and a primary conversion mechanism the owner could monitor from his phone. A traditional contact form was off the table — he doesn\'t check email during the day. WhatsApp was already how 90% of existing customers reached the shop, so the brief was to lean into that channel rather than fight it.',
    'Goal for the 3-week engagement: ship a single-page site that (a) ranks for local intent keywords within a Foz radius, (b) routes every CTA into a pre-filled WhatsApp message, and (c) looks premium enough that the shop reads as an Apple specialist rather than a generic repair bench. No tracking beyond Google Search Console — the owner wanted to see query impressions, not analyze sessions.',
  ],
  meta: [
    { k: 'CLIENT', v: 'UTI Informática & Celulares' },
    { k: 'LOCATION', v: 'Foz do Iguaçu, PR' },
    { k: 'TIMELINE', v: '3 weeks' },
    { k: 'DELIVERABLE', v: 'Landing page + SEO setup' },
    { k: 'LIVE URL', v: '[ url · tbd ]' },
  ],
  palette: [
    { hex: '#0A0A0A', role: 'Background' },
    { hex: '#141414', role: 'Surface' },
    { hex: '#F2F2F2', role: 'Text primary' },
    { hex: '#8C8C8C', role: 'Text muted' },
    { hex: '#E8002D', role: 'Accent' },
    { hex: '#FFFFFF', role: 'CTA text' },
  ],
  typography: [
    {
      role: 'Display',
      family: 'Plus Jakarta Sans',
      weight: '800',
      size: '72 / 64 / 48px',
      sample: 'Aa',
      mode: 'typewriter',
    },
    {
      role: 'Body',
      family: 'Plus Jakarta Sans',
      weight: '400',
      size: '16px · line-height 1.7',
      sample: 'The quick brown fox jumps over the lazy dog.',
      mode: 'static',
    },
    {
      role: 'Mono / Labels',
      family: 'JetBrains Mono',
      weight: '400',
      size: '11px · uppercase',
      sample: 'SYSTEM_LABEL',
      mode: 'typewriter',
    },
  ],
  components: [
    { label: 'WhatsApp CTA', role: 'Primary action · wa.me deep link', kind: 'cta-primary' },
    { label: 'Ghost CTA', role: 'Secondary · outlined', kind: 'cta-ghost' },
    { label: 'Service card', role: 'iPhone / Mac / iPad tile', kind: 'service-card' },
    { label: 'Apple Specialist', role: 'Credibility badge', kind: 'badge' },
    { label: 'Nav link', role: 'Top nav item · mono', kind: 'nav-link' },
  ],
  spacing: {
    base: '4px',
    sectionPadding: '80px vertical / 80px horizontal',
    maxWidth: '1200px',
    grid: '12 columns · 24px gutter',
  },
  stack: [
    { name: 'Figma', role: 'Design & prototyping', detail: 'Used for: UI design, component library, client handoff' },
    { name: 'HTML5', role: 'Semantic markup', detail: 'Used for: page structure, JSON-LD LocalBusiness schema, accessibility' },
    { name: 'CSS3', role: 'Custom properties, Grid', detail: 'Used for: design tokens, responsive layout, scroll-linked animations' },
    { name: 'JavaScript', role: 'Interaction layer', detail: 'Used for: WhatsApp redirect logic, UTM passthrough, form fallback' },
    { name: 'Search Console', role: 'SEO monitoring', detail: 'Used for: impression tracking, indexing status, mobile usability' },
    { name: 'WhatsApp API', role: 'Conversion channel', detail: 'Used for: wa.me deep links with pre-filled device + issue context' },
  ],
  notes: [
    {
      n: '01',
      title: 'WhatsApp as primary conversion mechanism',
      body: 'Every CTA on the page — hero, each service card, sticky bottom bar on mobile — routes to wa.me/5545XXXXXXXXX with a pre-filled message that includes the service category (e.g. "Vim pelo site — quero orçar conserto de iPhone"). The message gets parsed on the shop\'s side so the technician knows the context before opening the chat.\n\nUTM parameters are appended to the wa.me link itself: utm_source=site, utm_medium=hero_cta, utm_campaign=apple_repair. The WhatsApp Business app strips them on the customer side but keeps them on the operator reports — enough to distinguish which CTA on the page drove the chat.\n\nFor local service businesses the trade-off is clear: forms have a 2-3% conversion ceiling because they commit the customer to waiting for an email reply that might never come. WhatsApp has near-100% open rate and the operator is already on the platform 8h/day. Sacrificing the lead-scoring and marketing-automation affordances of a form was worth the 4-5x lift in reply-rate.',
    },
    {
      n: '02',
      title: 'Local SEO structured data',
      body: 'JSON-LD LocalBusiness schema sits in the <head>, declaring the shop as an ElectronicsStore with a geo coordinate, opening hours, price range, and three explicit service types (iPhoneRepair, MacRepair, iPadRepair). Google Business Profile\'s NAP (Name, Address, Phone) is mirrored exactly — any divergence between the site and the profile would hurt ranking.\n\nThe Google Maps embed is lazy-loaded behind a click-to-load placeholder. The default iframe adds ~400ms to LCP on 4G, and since only ~20% of visitors interact with the map, the deferred-load pattern preserves page speed for the majority.\n\nMobile-first page speed budget: LCP < 1.2s on throttled 4G (Slow 4G profile in Lighthouse), CLS < 0.05, TBT < 150ms. Hit by inlining critical CSS, preloading the hero image at responsive breakpoints, and self-hosting two font weights instead of the Google Fonts default of four.',
    },
    {
      n: '03',
      title: 'Dark-first design rationale',
      body: 'The dark palette is a positioning signal, not an aesthetic preference. The competition in the local market — three chains within a 1km radius — all use white backgrounds with blue or green accents. That template reads as generic repair bench. UTI\'s clients are willing to pay 20-30% more for an Apple-specialist experience, and they expect that premium framing from the first frame.\n\nDark also keeps visual proximity to Apple\'s own marketing aesthetic without crossing into trademark territory. The accent red (#E8002D) is lifted from the iPhone 15 Pro Max product page — close enough to register, different enough to be UTI\'s. Legal risk: none, since the color itself isn\'t protected.\n\nOLED-friendly is a secondary win. Foz do Iguaçu has ~85% mobile traffic to local service searches, and most recent devices in that bracket are OLED. A dark page draws ~40% less battery under the same pixel brightness — not a marketing point, but a UX nicety that compounds with time-on-page.',
    },
  ],
  roadmap: [
    { priority: 'HIGH', name: 'Online repair intake form', desc: 'Customer submits device + problem before visiting. Reduces friction, pre-qualifies leads.', effort: '~5 days', status: 'SUGGESTED' },
    { priority: 'HIGH', name: 'Service status tracker', desc: 'Customer enters ticket number, sees repair stage. Reduces phone support volume.', effort: '~8 days', status: 'SUGGESTED' },
    { priority: 'MEDIUM', name: 'Multilingual support (PT/ES)', desc: 'Foz do Iguaçu border city — Spanish-speaking customers from Argentina/Paraguay.', effort: '~2 days', status: 'SUGGESTED' },
    { priority: 'MEDIUM', name: 'Google Reviews integration', desc: 'Live feed of Google Maps reviews on the page. Social proof without manual curation.', effort: '~3 days', status: 'SUGGESTED' },
    { priority: 'LOW', name: 'Repair price estimator', desc: 'Interactive widget: select device + issue, get price range. Reduces quote calls.', effort: '~6 days', status: 'SUGGESTED' },
    { priority: 'LOW', name: 'WhatsApp chatbot flow', desc: 'Automated first-response with FAQ + routing to technician.', effort: '~10 days', status: 'SUGGESTED' },
  ],
  nav: {
    next: {
      slug: 'devdex',
      n: '002',
      title: 'DevDex',
      desc: 'Community gallery where devs publish learning projects.',
    },
  },
};

export const PROJECTS: Project[] = [
  {
    n: '001',
    status: 'LIVE',
    title: 'UTI Informática',
    desc: 'Landing page for Apple-focused repair service. Dark-first, WhatsApp-as-primary-CTA, local SEO.',
    client: 'UTI Informática · Foz',
    year: '2025',
    role: 'Design + Dev · Solo',
    stack: ['Figma', 'HTML', 'CSS', 'JavaScript'],
    tag: 'Landing · SEO',
    slug: 'uti-informatica',
    caseStudy: UTI_CASE,
  },
  {
    n: '002',
    status: 'BETA',
    title: 'DevDex',
    desc: 'Community gallery where devs publish learning projects. GitHub OAuth, enrichment via API, likes + filters.',
    client: 'Open source · self-initiated',
    year: '2025',
    role: 'Product + Dev · Solo',
    stack: ['Next.js', 'TypeScript', 'Node', 'GitHub API'],
    tag: 'Product · OSS',
    slug: 'devdex',
  },
  {
    n: '003',
    status: 'CASE',
    title: 'Cataratas Park Hotel',
    desc: 'Institutional site with direct booking integrated into Booking.com — cut OTA commission, own the funnel.',
    client: 'Regional hotel · Foz',
    year: '2024',
    role: 'Frontend · Freelance',
    stack: ['Astro', 'Tailwind', 'Stripe'],
    tag: 'Booking · Web',
    slug: 'cataratas-park-hotel',
  },
  {
    n: '004',
    status: 'CASE',
    title: 'Sabor da Fronteira',
    desc: 'QR-code digital menu per table, admin panel for live price updates, iFood integration.',
    client: 'Restaurant · Santa Terezinha',
    year: '2024',
    role: 'Fullstack · Solo',
    stack: ['React', 'Node', 'PostgreSQL'],
    tag: 'QR Menu · Admin',
    slug: 'sabor-da-fronteira',
  },
  {
    n: '005',
    status: 'CASE',
    title: 'Iguaçu Social',
    desc: 'Institutional site for local NGO with donor capture, auto-emailed receipts, financial transparency panel.',
    client: 'NGO · Foz',
    year: '2023',
    role: 'Fullstack · Pro bono',
    stack: ['Next.js', 'Resend', 'Prisma'],
    tag: 'Pro bono · ONG',
    slug: 'iguacu-social',
  },
];

export type ArchiveStatus = ProjectStatus | 'DRAFT';

export interface ArchiveEntry {
  n: string;
  title: string;
  kind: string;
  stack: string;
  year: string;
  status: ArchiveStatus;
}

export const ARCHIVE: ArchiveEntry[] = [
  ...PROJECTS.map<ArchiveEntry>((p) => ({
    n: p.n,
    title: p.title,
    kind: p.tag,
    stack: p.stack.join(' · '),
    year: p.year,
    status: p.status,
  })),
  { n: 'E/01', title: 'Sazerac · Kanban experiment', kind: 'Playground', stack: 'Next · Zustand · DnD-kit', year: '2025', status: 'DRAFT' },
  { n: 'E/02', title: 'Paraná Tipografia', kind: 'Type specimen', stack: 'Astro · MDX', year: '2024', status: 'DRAFT' },
  { n: 'E/03', title: 'Shadermonk', kind: 'WebGL scratch', stack: 'Three · GLSL', year: '2024', status: 'DRAFT' },
];
