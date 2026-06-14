// Valida LOCALMENTE a injeção de meta tags (sem precisar de deploy/Supabase).
// Uso: npx tsx scripts/test-meta.ts
import { readFileSync } from 'node:fs';
import { injectMeta } from '../api/diagnostico-meta';

const html = readFileSync('index.html', 'utf8');
const out = injectMeta(html, {
  title: 'Diagnóstico de presença digital — UTI Informática & Celulares',
  description: 'Quando alguém pesquisa "assistência técnica foz do iguaçu", a UTI não aparece — mesmo com nota melhor que os concorrentes.',
  image: 'https://portifolio-adryann.vercel.app/api/og?tipo=diagnostico&empresa=UTI%20Inform%C3%A1tica%20%26%20Celulares&cidade=Foz%20do%20Igua%C3%A7u',
  url: 'https://portifolio-adryann.vercel.app/diagnostico/uti-informatica',
});

const tags = out.match(/<title>[^<]*<\/title>|<meta\s+(?:property|name)="(?:og:|twitter:|description)[^"]*"[^>]*>/gi);
console.log(tags?.join('\n'));
