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
  // PT-BR overrides
  taglinePt?: string;
  overviewPt?: { problem: string; solution: string; result: string };
  briefPt?: string[];
  metaPt?: Array<{ k: string; v: string }>;
  notesPt?: ImplNote[];
  roadmapPt?: RoadmapItem[];
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
  // PT-BR overrides
  descPt?: string;
  rolePt?: string;
  tagPt?: string;
}

const UTI_CASE: CaseStudyContent = {
  slug: 'uti-informatica',
  n: '001',
  h1Lines: ['UTI Informática', '& Celulares'],
  tagline: 'Landing page that converts walk-ins into WhatsApp leads.',
  overview: {
    problem: 'Repair shop invisible online, losing leads to larger chains',
    solution: 'Dark landing page, WhatsApp as primary CTA, Google Maps structured data',
    result: 'WhatsApp inquiries up 3× in the first 30 days after launch.',
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
  taglinePt: 'Landing page que converte visitas presenciais em leads no WhatsApp.',
  overviewPt: {
    problem: 'Loja de reparo invisível online, perdendo leads para grandes redes',
    solution: 'Landing page dark, WhatsApp como CTA principal, dados estruturados para Google Maps',
    result: 'Consultas pelo WhatsApp aumentaram 3× nos primeiros 30 dias após o lançamento.',
  },
  briefPt: [
    'UTI Informática & Celulares é uma assistência técnica especializada em Apple em Foz do Iguaçu. O fluxo de clientes presenciais da área central era constante, mas a presença online era inexistente — nenhum site, nenhuma otimização de perfil no Google Business e uma página no Facebook sem atualização desde 2022. Clientes em potencial pesquisando "conserto iPhone Foz" caíam nas concorrentes a dois quarteirões de distância.',
    'O cliente tinha duas restrições fixas: sem custo mensal recorrente de construtor de site, e um mecanismo de conversão principal que o dono pudesse monitorar pelo celular. Formulário de contato tradicional estava fora de cogitação — ele não checa e-mail durante o dia. WhatsApp já era como 90% dos clientes chegavam à loja, então o briefing foi potencializar esse canal em vez de lutar contra ele.',
    'Meta para o projeto de 3 semanas: publicar um site de página única que (a) rankeia para palavras-chave de intenção local dentro de Foz, (b) direciona cada CTA para uma mensagem pré-preenchida no WhatsApp, e (c) tem aparência premium suficiente para que a loja seja lida como especialista Apple em vez de bancada genérica de reparo. Sem rastreamento além do Google Search Console — o dono queria ver impressões de busca, não analisar sessões.',
  ],
  metaPt: [
    { k: 'CLIENTE', v: 'UTI Informática & Celulares' },
    { k: 'LOCALIZAÇÃO', v: 'Foz do Iguaçu, PR' },
    { k: 'PRAZO', v: '3 semanas' },
    { k: 'ENTREGA', v: 'Landing page + configuração SEO' },
    { k: 'URL AO VIVO', v: '[ url · a definir ]' },
  ],
  notesPt: [
    {
      n: '01',
      title: 'WhatsApp como mecanismo principal de conversão',
      body: 'Cada CTA da página — hero, cada card de serviço, barra fixa inferior no mobile — direciona para wa.me/5545XXXXXXXXX com uma mensagem pré-preenchida que inclui a categoria de serviço (ex: "Vim pelo site — quero orçar conserto de iPhone"). A mensagem é interpretada no lado da loja para que o técnico saiba o contexto antes de abrir o chat.\n\nParâmetros UTM são adicionados ao próprio link wa.me: utm_source=site, utm_medium=hero_cta, utm_campaign=apple_repair. O app WhatsApp Business os oculta do lado do cliente, mas os mantém nos relatórios do operador — suficiente para distinguir qual CTA da página gerou o chat.\n\nPara negócios de serviço local, o trade-off é claro: formulários têm teto de conversão de 2-3% porque comprometem o cliente a esperar por uma resposta de e-mail que pode nunca chegar. WhatsApp tem taxa de abertura próxima de 100% e o operador já está na plataforma 8h por dia. Abrir mão das affordances de lead-scoring e automação de marketing de um formulário valeu o ganho de 4-5x na taxa de resposta.',
    },
    {
      n: '02',
      title: 'Dados estruturados para SEO local',
      body: 'O schema JSON-LD LocalBusiness fica no <head>, declarando a loja como ElectronicsStore com coordenadas geográficas, horário de funcionamento, faixa de preço e três tipos de serviço explícitos (iPhoneRepair, MacRepair, iPadRepair). O NAP (Nome, Endereço, Telefone) do Google Business Profile é espelhado com exatidão — qualquer divergência entre o site e o perfil prejudicaria o ranking.\n\nO embed do Google Maps tem carregamento lazy, ativado por clique. O iframe padrão adiciona ~400ms ao LCP em 4G, e como apenas ~20% dos visitantes interagem com o mapa, o padrão de carregamento diferido preserva a velocidade de página para a maioria.\n\nOrçamento de velocidade mobile-first: LCP < 1,2s em 4G lento (perfil Slow 4G no Lighthouse), CLS < 0,05, TBT < 150ms. Atingido com inlining de CSS crítico, preload da imagem hero nos breakpoints responsivos e auto-hospedagem de dois pesos de fonte em vez dos quatro padrão do Google Fonts.',
    },
    {
      n: '03',
      title: 'Racional do design dark-first',
      body: 'A paleta escura é um sinal de posicionamento, não uma preferência estética. A concorrência no mercado local — três redes em raio de 1km — usa fundos brancos com acentos em azul ou verde. Esse template é lido como bancada genérica de reparo. Os clientes da UTI estão dispostos a pagar 20-30% a mais por uma experiência de especialista Apple, e esperam esse enquadramento premium desde o primeiro frame.\n\nO dark também mantém proximidade visual ao próprio marketing da Apple sem cruzar para território de marca registrada. O vermelho de acento (#E8002D) é extraído da página de produto do iPhone 15 Pro Max — próximo o suficiente para registrar, diferente o suficiente para ser da UTI. Risco jurídico: nenhum, pois a cor em si não é protegida.\n\nCompatibilidade com OLED é um ganho secundário. Foz do Iguaçu tem ~85% de tráfego mobile em buscas de serviço local, e a maioria dos dispositivos recentes nessa faixa são OLED. Uma página escura consome ~40% menos bateria sob o mesmo brilho de pixel — não é um ponto de marketing, mas uma cortesia de UX que se acumula com o tempo de permanência.',
    },
  ],
  roadmapPt: [
    { priority: 'HIGH', name: 'Formulário de intake de reparo online', desc: 'Cliente registra dispositivo e problema antes de visitar. Reduz fricção, pré-qualifica leads.', effort: '~5 dias', status: 'SUGGESTED' },
    { priority: 'HIGH', name: 'Rastreador de status de reparo', desc: 'Cliente insere número do ticket e vê o estágio do reparo. Reduz volume de suporte por telefone.', effort: '~8 dias', status: 'SUGGESTED' },
    { priority: 'MEDIUM', name: 'Suporte multilíngue (PT/ES)', desc: 'Foz do Iguaçu, cidade de fronteira — clientes de língua espanhola da Argentina e Paraguai.', effort: '~2 dias', status: 'SUGGESTED' },
    { priority: 'MEDIUM', name: 'Integração com Google Reviews', desc: 'Feed ao vivo de avaliações do Google Maps na página. Prova social sem curadoria manual.', effort: '~3 dias', status: 'SUGGESTED' },
    { priority: 'LOW', name: 'Estimador de preço de reparo', desc: 'Widget interativo: selecione dispositivo + problema, receba faixa de preço. Reduz chamadas de orçamento.', effort: '~6 dias', status: 'SUGGESTED' },
    { priority: 'LOW', name: 'Fluxo de chatbot no WhatsApp', desc: 'Primeira resposta automatizada com FAQ + direcionamento ao técnico.', effort: '~10 dias', status: 'SUGGESTED' },
  ],
};

export const PROJECTS: Project[] = [
  {
    n: '001',
    status: 'LIVE',
    title: 'UTI Informática',
    desc: 'Landing page for Apple-focused repair service. Dark-first, WhatsApp-as-primary-CTA, local SEO.',
    descPt: 'Landing page para assistência técnica especializada em Apple. Dark-first, WhatsApp como CTA principal, SEO local.',
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
    descPt: 'Galeria comunitária onde devs publicam projetos de aprendizado. GitHub OAuth, enriquecimento via API, likes + filtros.',
    client: 'Open source · self-initiated',
    year: '2025',
    role: 'Product + Dev · Solo',
    rolePt: 'Produto + Dev · Solo',
    stack: ['Next.js', 'TypeScript', 'Node', 'GitHub API'],
    tag: 'Product · OSS',
    tagPt: 'Produto · OSS',
    slug: 'devdex',
  },
  {
    n: '003',
    status: 'CASE',
    title: 'Cataratas Park Hotel',
    desc: 'Institutional site with direct booking integrated into Booking.com — cut OTA commission, own the funnel.',
    descPt: 'Site institucional com reserva direta integrada ao Booking.com — reduz comissão de OTA, controla o funil.',
    client: 'Regional hotel · Foz',
    year: '2024',
    role: 'Frontend · Freelance',
    stack: ['Astro', 'Tailwind', 'Stripe'],
    tag: 'Booking · Web',
    tagPt: 'Reserva · Web',
    slug: 'cataratas-park-hotel',
  },
  {
    n: '004',
    status: 'CASE',
    title: 'Sabor da Fronteira',
    desc: 'QR-code digital menu per table, admin panel for live price updates, iFood integration.',
    descPt: 'Cardápio digital via QR code por mesa, painel admin para atualizações de preço ao vivo, integração iFood.',
    client: 'Restaurant · Santa Terezinha',
    year: '2024',
    role: 'Fullstack · Solo',
    stack: ['React', 'Node', 'PostgreSQL'],
    tag: 'QR Menu · Admin',
    tagPt: 'Cardápio QR · Admin',
    slug: 'sabor-da-fronteira',
  },
  {
    n: '005',
    status: 'CASE',
    title: 'Iguaçu Social',
    desc: 'Institutional site for local NGO with donor capture, auto-emailed receipts, financial transparency panel.',
    descPt: 'Site institucional para ONG local com captação de doadores, recibos automáticos por e-mail, painel de transparência financeira.',
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

export function getArchive(locale: 'pt-BR' | 'en'): ArchiveEntry[] {
  if (locale === 'en') return ARCHIVE;
  return [
    ...PROJECTS.map<ArchiveEntry>((p) => ({
      n: p.n,
      title: p.title,
      kind: p.tagPt ?? p.tag,
      stack: p.stack.join(' · '),
      year: p.year,
      status: p.status,
    })),
    { n: 'E/01', title: 'Sazerac · Experimento Kanban', kind: 'Playground', stack: 'Next · Zustand · DnD-kit', year: '2025', status: 'DRAFT' },
    { n: 'E/02', title: 'Paraná Tipografia', kind: 'Type specimen', stack: 'Astro · MDX', year: '2024', status: 'DRAFT' },
    { n: 'E/03', title: 'Shadermonk', kind: 'WebGL scratch', stack: 'Three · GLSL', year: '2024', status: 'DRAFT' },
  ];
}
