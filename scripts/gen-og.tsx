// Validação LOCAL da imagem OG — gera PNGs reais via Satori pra inspeção visual.
// Uso: npx tsx scripts/gen-og.tsx
import { writeFileSync, mkdirSync } from 'node:fs';
import { generateOg } from '../api/og';

mkdirSync('.tmp-og', { recursive: true });

async function save(name: string, qs: string) {
  const resp = await generateOg(new URLSearchParams(qs));
  const buf = Buffer.from(await resp.arrayBuffer());
  writeFileSync(`.tmp-og/${name}`, buf);
  console.log('wrote', `.tmp-og/${name}`, buf.length, 'bytes');
}

await save('portfolio.png', '');
await save('diagnostico.png', 'tipo=diagnostico&empresa=UTI Informática&cidade=Foz do Iguaçu');
console.log('done');
