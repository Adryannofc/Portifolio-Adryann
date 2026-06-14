// Injeta meta tags Open Graph por rota /diagnostico/:slug (acionada via rewrite no vercel.json).
// Busca o diagnóstico no Supabase (server-side) e reescreve as tags do index.html base,
// para que crawlers (WhatsApp, LinkedIn) mostrem um cartão personalizado por empresa.
// O app React continua montando normalmente — só as tags do <head> mudam.

interface MetaValues {
  title: string;
  description: string;
  image: string;
  url: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMeta(html: string, attr: 'property' | 'name', val: string, content: string): string {
  const esc = escapeHtml(content);
  const re = new RegExp(`(<meta\\s+${attr}="${val}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${esc}$2`);
  return html.replace('</head>', `    <meta ${attr}="${val}" content="${esc}" />\n  </head>`);
}

export function injectMeta(html: string, m: MetaValues): string {
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(m.title)}</title>`);
  html = setMeta(html, 'name', 'description', m.description);
  html = setMeta(html, 'property', 'og:title', m.title);
  html = setMeta(html, 'property', 'og:description', m.description);
  html = setMeta(html, 'property', 'og:image', m.image);
  html = setMeta(html, 'property', 'og:url', m.url);
  html = setMeta(html, 'property', 'og:image:alt', m.title);
  html = setMeta(html, 'name', 'twitter:title', m.title);
  html = setMeta(html, 'name', 'twitter:description', m.description);
  html = setMeta(html, 'name', 'twitter:image', m.image);
  return html;
}

interface DiagMeta {
  empresa: string;
  cidade: string;
  descricao: string;
}

async function fetchDiagnostico(slug: string): Promise<DiagMeta | null> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!base || !key || !slug) return null;
  try {
    const res = await fetch(
      `${base}/rest/v1/diagnosticos?slug=eq.${encodeURIComponent(slug)}&select=empresa,ativo,data&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ empresa?: string; ativo?: boolean; data?: Record<string, unknown> }>;
    const row = rows[0];
    if (!row || row.ativo === false) return null;
    const data = (row.data ?? {}) as Record<string, string>;
    const empresa = row.empresa ?? data.empresa ?? 'Empresa';
    return {
      empresa,
      cidade: data.cidade ?? '',
      descricao: data.problemaHeadline ?? `Análise de presença digital de ${empresa}.`,
    };
  } catch {
    return null;
  }
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') ?? '';
  const origin = url.origin;

  // HTML base do app (com os asset paths atuais do build).
  let html: string;
  try {
    html = await (await fetch(`${origin}/`)).text();
  } catch {
    return Response.redirect(`${origin}/`, 302);
  }

  const diag = await fetchDiagnostico(slug);
  if (diag) {
    const title = `Diagnóstico de presença digital — ${diag.empresa}`;
    const description = diag.descricao.slice(0, 200);
    const image =
      `${origin}/api/og?tipo=diagnostico&empresa=${encodeURIComponent(diag.empresa)}` +
      (diag.cidade ? `&cidade=${encodeURIComponent(diag.cidade)}` : '');
    html = injectMeta(html, {
      title,
      description,
      image,
      url: `${origin}/diagnostico/${encodeURIComponent(slug)}`,
    });
  }

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': diag
        ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
        : 'public, max-age=0, s-maxage=30',
    },
  });
}
