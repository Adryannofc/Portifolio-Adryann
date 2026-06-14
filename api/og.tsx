import React from 'react';
import { ImageResponse } from '@vercel/og';

// Geração de imagem Open Graph (1200x630) no Node runtime do Vercel.
// Sem parâmetros  -> capa do portfólio.
// ?tipo=diagnostico&empresa=...&cidade=... -> capa personalizada por diagnóstico.

const ACCENT = '#F28705';
const BG = '#0A0A0A';
const FG = '#F4F2EC';
const MUTE = '#8C8C8C';
const MUTE2 = '#C9C4B8';
const FAINT = '#6E6E6E';

// Subset amplo: cobre rótulos fixos + qualquer nome de empresa (acentos PT incluídos).
const SUBSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  'ÀÁÂÃÄÉÊËÍÎÓÔÕÖÚÛÜÇÑàáâãäéêëíîóôõöúûüçñ' +
  ' ·—–.,&/:%-()ªº';

async function loadGoogleFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const url =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}`;
  // UA de Android antigo força o Google a servir TTF (Satori não lê woff2; MSIE serve EOT).
  const css = await (
    await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
      },
    })
  ).text();
  const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype|woff)'\)/);
  if (!match) throw new Error(`Falha ao carregar fonte ${family} ${weight}`);
  return (await fetch(match[1])).arrayBuffer();
}

interface OgParams {
  variant: 'portfolio' | 'diagnostico';
  empresa: string;
  cidade: string;
}

function parseParams(searchParams: URLSearchParams): OgParams {
  const variant = searchParams.get('tipo') === 'diagnostico' ? 'diagnostico' : 'portfolio';
  return {
    variant,
    empresa: (searchParams.get('empresa') ?? '').slice(0, 42),
    cidade: (searchParams.get('cidade') ?? '').slice(0, 32),
  };
}

function splitTitle(empresa: string): string[] {
  const name = (empresa || 'Empresa').toUpperCase();
  if (name.length <= 14) return [name];
  const words = name.split(' ');
  if (words.length === 1) return [name];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function ogElement(p: OgParams) {
  const isDiag = p.variant === 'diagnostico';
  const topLeft = isDiag ? 'DIAGNÓSTICO DIGITAL · 2026' : 'PORTFÓLIO · 2026';
  const titleLines = isDiag ? splitTitle(p.empresa) : ['ADRYANN', 'FELIX'];
  const role = isDiag
    ? `ANÁLISE DE PRESENÇA DIGITAL${p.cidade ? ' · ' + p.cidade.toUpperCase() : ''}`
    : 'ENGENHEIRO DE SOFTWARE · DESIGN-ENGINEER';
  const tagline = isDiag ? 'O que falta pra você ser encontrado.' : 'Software que parece inevitável.';
  const longTitle = titleLines.some((l) => l.length > 16);
  const titleSize = isDiag ? (longTitle ? 84 : 116) : 132;
  const bottomLeft = isDiag
    ? (p.cidade ? `${p.cidade.toUpperCase()} · BR` : 'PRESENÇA DIGITAL')
    : 'FOZ DO IGUAÇU · BR · GMT-03';
  const bottomRight = isDiag ? 'POR ADRYANN FELIX' : 'CODE · BUILD · SHIP';

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        padding: '54px 62px',
        border: '1px solid rgba(242,135,5,0.22)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: 'Mono', fontWeight: 500, fontSize: 18, letterSpacing: 3, color: MUTE }}>
          {topLeft}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: ACCENT, marginRight: 12 }} />
          <div style={{ fontFamily: 'Mono', fontWeight: 500, fontSize: 18, letterSpacing: 2, color: MUTE2 }}>
            DISPONÍVEL · T2
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {titleLines.map((line, i) => (
            <div
              key={i}
              style={{ fontFamily: 'Jakarta', fontWeight: 800, fontSize: titleSize, lineHeight: 1, letterSpacing: -3, color: FG }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ width: 130, height: 7, backgroundColor: ACCENT, marginTop: 22, marginBottom: 26 }} />
        <div style={{ fontFamily: 'Mono', fontWeight: 500, fontSize: 20, letterSpacing: 2, color: MUTE }}>{role}</div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 20 }}>
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              borderLeft: `15px solid ${ACCENT}`,
              marginRight: 16,
            }}
          />
          <div style={{ fontFamily: 'Jakarta', fontWeight: 500, fontSize: 29, color: MUTE2 }}>{tagline}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'Mono', fontWeight: 500, fontSize: 16, letterSpacing: 2, color: FAINT }}>
          {bottomLeft}
        </div>
        <div style={{ fontFamily: 'Mono', fontWeight: 500, fontSize: 16, letterSpacing: 2, color: FAINT }}>
          {bottomRight}
        </div>
      </div>
    </div>
  );
}

export async function generateOg(searchParams: URLSearchParams): Promise<ImageResponse> {
  const p = parseParams(searchParams);
  const text = SUBSET + p.empresa + p.empresa.toUpperCase() + p.cidade.toUpperCase();
  const [jakartaBold, jakartaMed, mono] = await Promise.all([
    loadGoogleFont('Plus Jakarta Sans', 800, text),
    loadGoogleFont('Plus Jakarta Sans', 500, text),
    loadGoogleFont('JetBrains Mono', 500, text),
  ]);
  return new ImageResponse(ogElement(p), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Jakarta', data: jakartaBold, weight: 800, style: 'normal' },
      { name: 'Jakarta', data: jakartaMed, weight: 500, style: 'normal' },
      { name: 'Mono', data: mono, weight: 500, style: 'normal' },
    ],
  });
}

export default async function handler(request: Request) {
  try {
    const searchParams = new URL(request.url, 'http://n').searchParams;
    return await generateOg(searchParams);
  } catch (err) {
    const msg = err instanceof Error ? `${err.message}\n${err.stack ?? ''}` : String(err);
    return new Response(`OG_ERROR: ${msg}`, {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}
