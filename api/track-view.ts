// Registra eventos de visualização e clique de CTA em diagnósticos.
// POST { slug: string, type: 'view' | 'cta' }
// Usa anon key + RLS (INSERT permitido para anon na tabela diagnostico_views).

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? '';
const ANON_KEY    = process.env.VITE_SUPABASE_ANON_KEY ?? '';

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  let slug: string;
  let type: string;
  try {
    const body = (await request.json()) as { slug?: unknown; type?: unknown };
    slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    type = typeof body.type === 'string' ? body.type : 'view';
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (type !== 'view' && type !== 'cta') {
    return new Response(JSON.stringify({ error: 'invalid type' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (SUPABASE_URL && ANON_KEY) {
    await fetch(`${SUPABASE_URL}/rest/v1/diagnostico_views`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ slug, type }),
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
