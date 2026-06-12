export interface Competitor {
  name: string
  rating: number
  reviews: number
  hasSite: boolean
  status: 'Aparece' | 'Invisível'
  highlight?: boolean
  googleAds?: boolean
  instagramAtivo?: boolean
  siteQualidade?: 'básico' | 'profissional' | 'premium'
}

interface GoogleBusiness {
  rating: number
  reviews: number
  verificado: boolean
  temFotos: boolean
  horarioPreenchido: boolean
  categoriasOk: boolean
}

interface SocialPresenca {
  handle: string
  seguidores: number
  ativo: boolean
}

interface YoutubePresenca {
  canal: string
  inscritos: number
}

interface LinkedinPresenca {
  pagina: string
  seguidores: number
}

export interface SiteInfo {
  url: string
  ssl: boolean
  mobile: boolean
  velocidade: 'lento' | 'médio' | 'rápido'
  seoBasico: boolean
  qualidade: 'básico' | 'profissional' | 'premium'
}

export interface BuscaInfo {
  palavraChave: string
  volumeEstimado: 'baixo' | 'médio' | 'alto'
  posicaoAtual?: number
}

export interface Problema {
  categoria: 'busca' | 'redes' | 'reputacao' | 'site' | 'conversao'
  titulo: string
  descricao: string
  impacto: 'alto' | 'médio' | 'baixo'
}

export interface Recomendacao {
  prioridade: 1 | 2 | 3
  servico: 'site' | 'seo-local' | 'google-perfil' | 'social' | 'google-ads' | 'conteudo'
  titulo: string
  descricao: string
  antes?: string
  depois?: string
}

export interface Investimento {
  min: number
  max: number
  modalidade: 'único' | 'mensal' | 'ambos'
}

export interface DiagnosticoData {
  slug: string
  empresa: string
  segmento: string
  cidade: string
  estado: string
  dataGerado: string
  endereco: string
  telefone: string
  especialidade: string
  problemaHeadline: string
  plataformas: {
    googleBusiness: GoogleBusiness
    instagram?: SocialPresenca
    facebook?: SocialPresenca
    youtube?: YoutubePresenca
    tiktok?: SocialPresenca
    linkedin?: LinkedinPresenca
  }
  site?: SiteInfo
  busca: BuscaInfo
  competitors: Competitor[]
  problemas: Problema[]
  oportunidadeTexto: string
  recomendacoes: Recomendacao[]
  investimento?: Investimento
  ctaWhatsapp: string
  prazo: string
  ativo: boolean
}

export const DIAGNOSTICOS: DiagnosticoData[] = [
  {
    slug: 'uti-informatica',
    empresa: 'UTI Informática & Celulares',
    segmento: 'Assistência técnica Apple',
    cidade: 'Foz do Iguaçu',
    estado: 'PR',
    dataGerado: '2026-06-12',
    endereco: 'Av. Brasil, 40 — Centro, Foz do Iguaçu - PR',
    telefone: '(45) 3028-2249',
    especialidade: 'Apple (iPhone, iPad, MacBook) + Notebooks gerais',
    problemaHeadline:
      'Quando alguém pesquisa "assistência técnica foz do iguaçu" no Google, a UTI não aparece nos resultados — mesmo tendo nota melhor que a maioria dos concorrentes. O Google prioriza fichas com site vinculado.',
    plataformas: {
      googleBusiness: {
        rating: 4.6,
        reviews: 125,
        verificado: true,
        temFotos: true,
        horarioPreenchido: true,
        categoriasOk: false,
      },
      instagram: {
        handle: '@utiassistencia',
        seguidores: 544,
        ativo: true,
      },
    },
    busca: {
      palavraChave: 'assistência técnica foz do iguaçu',
      volumeEstimado: 'médio',
    },
    competitors: [
      { name: 'Astec Celulares', rating: 5.0, reviews: 50,  hasSite: true,  status: 'Aparece',   siteQualidade: 'básico' },
      { name: 'Cia Tec',         rating: 4.5, reviews: 31,  hasSite: true,  status: 'Aparece',   siteQualidade: 'básico' },
      { name: 'X Cell',          rating: 4.9, reviews: 152, hasSite: true,  status: 'Aparece',   siteQualidade: 'profissional' },
      { name: 'UTI Informática', rating: 4.6, reviews: 125, hasSite: false, status: 'Invisível', highlight: true },
    ],
    problemas: [
      {
        categoria: 'busca',
        titulo: 'Clientes prontos para comprar indo para a concorrência',
        descricao:
          'Quem busca "conserto iPhone Foz" ou "troca de tela Foz" encontra os concorrentes — não vocês. O Google prioriza negócios com site vinculado ao perfil.',
        impacto: 'alto',
      },
      {
        categoria: 'busca',
        titulo: 'Posicionamento Apple inexistente no digital',
        descricao:
          'Vocês são especialistas Apple — mas sem presença online, esse posicionamento não existe para quem pesquisa "assistência Apple Foz do Iguaçu".',
        impacto: 'alto',
      },
      {
        categoria: 'conversao',
        titulo: 'Diferencial real enterrado nas avaliações',
        descricao:
          'Clientes elogiam rapidez e serviços únicos (eSIM, transferência de dados). Em um site, isso vira destaque na primeira dobra — não texto perdido em reviews.',
        impacto: 'médio',
      },
    ],
    oportunidadeTexto:
      'A UTI tem o que a maioria dos concorrentes não tem: nota alta (4.6), volume forte de avaliações (125) e especialização clara em Apple. O que falta é um canal digital que transforme esses ativos em visibilidade e captação. Um site profissional vinculado ao Google resolve três problemas ao mesmo tempo: aparecer nas buscas locais, comunicar os diferenciais com clareza e facilitar o contato via WhatsApp.',
    recomendacoes: [
      {
        prioridade: 1,
        servico: 'site',
        titulo: 'Site profissional com SEO local',
        descricao:
          'Criar site focado em "assistência técnica Foz do Iguaçu" para aparecer nas buscas e comunicar a especialização Apple.',
        antes: 'Invisível nas buscas — concorrentes com nota menor aparecem antes',
        depois: 'Aparece quando alguém busca "assistência técnica Foz" ou "conserto iPhone Foz"',
      },
      {
        prioridade: 2,
        servico: 'google-perfil',
        titulo: 'Otimizar perfil Google Business',
        descricao:
          'Adicionar categoria específica de assistência Apple, mais fotos do estabelecimento e vincular o site ao perfil.',
        antes: 'Perfil incompleto sem categoria Apple — o Google ranqueia mais baixo',
        depois: 'Perfil otimizado aparece para buscas como "assistência Apple perto de mim"',
      },
      {
        prioridade: 3,
        servico: 'seo-local',
        titulo: 'SEO local contínuo',
        descricao:
          'Publicações regulares no Google Business e conteúdo no site sobre os serviços mais buscados para manter e melhorar a posição.',
        antes: 'Nenhuma presença em conteúdo — ranking estagnado',
        depois: 'Conteúdo relevante gera autoridade local e atrai tráfego orgânico recorrente',
      },
    ],
    ctaWhatsapp: '5587981209267',
    prazo: '15–25 dias',
    ativo: true,
  },
]
