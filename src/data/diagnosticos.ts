export interface Competitor {
  name: string
  rating: number
  reviews: number
  hasSite: boolean
  status: 'Aparece' | 'Invisível'
  highlight?: boolean
}

export interface DiagnosticoData {
  slug: string
  empresa: string
  segmento: string
  cidade: string
  estado: string
  ano: number
  endereco: string
  telefone: string
  google: { rating: number; reviews: number }
  instagram?: { handle: string; followers: number }
  especialidade: string
  temSite: boolean
  problemaHeadline: string
  problemaBusca: string
  competitors: Competitor[]
  perdas: Array<{ titulo: string; descricao: string }>
  oportunidadeTexto: string
  ctaWhatsapp: string
  prazo: string
}

export const DIAGNOSTICOS: DiagnosticoData[] = [
  {
    slug: 'uti-informatica',
    empresa: 'UTI Informática & Celulares',
    segmento: 'Assistência técnica Apple',
    cidade: 'Foz do Iguaçu',
    estado: 'PR',
    ano: 2026,
    endereco: 'Av. Brasil, 40 — Centro, Foz do Iguaçu - PR',
    telefone: '(45) 3028-2249',
    google: { rating: 4.6, reviews: 125 },
    instagram: { handle: '@utiassistencia', followers: 544 },
    especialidade: 'Apple (iPhone, iPad, MacBook) + Notebooks gerais',
    temSite: false,
    problemaHeadline:
      'Quando alguém pesquisa "assistência técnica foz do iguaçu" no Google, a UTI não aparece nos resultados — mesmo tendo nota melhor que a maioria dos concorrentes. O Google prioriza fichas com site vinculado.',
    problemaBusca: 'assistência técnica foz do iguaçu',
    competitors: [
      { name: 'Astec Celulares', rating: 5.0, reviews: 50,  hasSite: true,  status: 'Aparece' },
      { name: 'Cia Tec',         rating: 4.5, reviews: 31,  hasSite: true,  status: 'Aparece' },
      { name: 'X Cell',          rating: 4.9, reviews: 152, hasSite: true,  status: 'Aparece' },
      { name: 'UTI Informática', rating: 4.6, reviews: 125, hasSite: false, status: 'Invisível', highlight: true },
    ],
    perdas: [
      {
        titulo: 'Clientes prontos pra comprar indo para a concorrência',
        descricao:
          'Quem busca "conserto iPhone Foz" ou "troca de tela Foz" encontra os concorrentes — não vocês.',
      },
      {
        titulo: 'Diferencial real enterrado nas avaliações',
        descricao:
          'Clientes elogiam rapidez e serviços que nem operadora resolve (eSIM, transferência de dados). Num site, isso vira destaque na página principal.',
      },
      {
        titulo: 'Posicionamento Apple inexistente no digital',
        descricao:
          'Vocês são especialistas Apple — mas sem presença online, esse posicionamento não existe para quem pesquisa "assistência Apple Foz do Iguaçu".',
      },
    ],
    oportunidadeTexto:
      'A UTI tem o que a maioria dos concorrentes não tem: nota alta (4.6), volume forte de avaliações (125) e especialização clara em Apple. O que falta é um canal digital que transforme esses ativos em visibilidade e captação. Um site profissional vinculado ao Google resolve três problemas ao mesmo tempo: aparecer nas buscas locais, comunicar os diferenciais com clareza e facilitar o contato via WhatsApp.',
    ctaWhatsapp: '5587981209267',
    prazo: '15–25 dias',
  },
]
