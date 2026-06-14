export interface Testimonial {
  id: string;
  name: string;
  role: string;
  business: string;
  quote: string;
  quotePt: string;
  avatar?: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
  labelPt: string;
}

// TODO: replace with real client quotes collected via WhatsApp/email
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'uti',
    name: 'Renato Souza',
    role: 'Proprietário',
    business: 'UTI Informática & Celulares',
    quote:
      'We went from zero online presence to receiving WhatsApp messages from people who found us on Google. The site paid for itself in the first week.',
    quotePt:
      'Saímos de zero presença online para receber mensagens no WhatsApp de pessoas que nos encontraram no Google. O site se pagou na primeira semana.',
    avatar: undefined,
  },
  {
    id: 'cataratas',
    name: 'Marcos Figueiredo',
    role: 'Gerente Comercial',
    business: 'Cataratas Park Hotel',
    quote:
      'Before the new site, almost all our bookings came through OTAs. Now we have a direct channel that converts — and we keep the margin.',
    quotePt:
      'Antes do novo site, quase todas as reservas vinham por OTA. Agora temos um canal direto que converte — e ficamos com a margem.',
    avatar: undefined,
  },
  {
    id: 'sabor',
    name: 'Claudia Menezes',
    role: 'Sócia-fundadora',
    business: 'Sabor da Fronteira',
    quote:
      'I needed something simple that I could actually manage myself. Adryann delivered exactly that — clean, fast, and the menu updates take me two minutes.',
    quotePt:
      'Precisava de algo simples que eu conseguisse gerenciar sozinha. O Adryann entregou exatamente isso — limpo, rápido, e atualizar o cardápio leva dois minutos.',
    avatar: undefined,
  },
];

// TODO: confirm numbers with real data (years active, client count, measurable results)
export const STATS: Stat[] = [
  { value: 5, suffix: '+', label: 'clients served',        labelPt: 'clientes atendidos' },
  { value: 3, suffix: '+', label: 'years building',        labelPt: 'anos construindo' },
  { value: 100, suffix: '%', label: 'on-time delivery',   labelPt: 'entregas no prazo' },
];
