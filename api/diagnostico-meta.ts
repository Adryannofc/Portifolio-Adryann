// Serve meta tags Open Graph para crawlers que acessam /diagnostico/:slug.
// Acionada APENAS quando o user-agent é um bot (vercel.json has: user-agent).
// Usuários reais recebem index.html diretamente via /(.*) → index.html e nunca chegam aqui.

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
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(5000) },
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
  const reqUrl = new URL(request.url, 'http://n');
  const slug = reqUrl.searchParams.get('slug') ?? '';
  const headersAny = request.headers as unknown as { get?: (k: string) => string | null; host?: string };
  const host =
    (typeof headersAny.get === 'function' ? headersAny.get('host') : headersAny.host) ??
    'portifolio-adryann.vercel.app';
  const origin = `https://${host}`;

  const diag = await fetchDiagnostico(slug);

  const title = diag
    ? `Diagnóstico digital — ${diag.empresa}`
    : 'Diagnóstico de presença digital';
  const description = diag
    ? diag.descricao.slice(0, 200)
    : 'Análise de presença digital para empresas locais.';
  const image = diag
    ? `${origin}/api/og?tipo=diagnostico&empresa=${encodeURIComponent(diag.empresa)}${diag.cidade ? `&cidade=${encodeURIComponent(diag.cidade)}` : ''}`
    : `${origin}/api/og`;
  const url = `${origin}/diagnostico/${encodeURIComponent(slug)}`;

  // HTML mínimo para crawlers (bots não executam JS — só precisam das meta tags).
  // Usuários reais chegam via /(.*) → index.html e nunca passam por esta função.
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': diag
        ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
        : 'public, max-age=0, s-maxage=30',
    },
  });
}
