import { useEffect, useRef } from 'react';
import { createLayout, stagger, random } from 'animejs';

const WAAPI_SRC = `/* WAAPI */

document.querySelectorAll('.circle').forEach(($el, i) => {
  $el.animate({
    translate: '100px',
  }, {
    duration: 1000,
    delay: i * 100,
    easing: 'ease-out',
  }).finished.then(() => {
    $el.style.translate = '100px';
  });
});`;

const ANIMEJS_SRC = `/* Tecnologia sem complicação. */

const solucao = {
  acao: "Traduzo problemas técnicos",
  entrega: "Experiência de usuário moderna",
  status: "Livre de fricções"
};`;

const KEYWORDS = new Set([
  'const','let','var','function','return','if','else','for',
  'while','new','this','true','false','null','undefined',
  'async','await','import','export','from','class','extends',
]);

const TOKEN_RE = /(['"`])(?:\\.|[^\\])*?\1|[a-zA-Z_$][a-zA-Z0-9_$]*|\s+|[^a-zA-Z_$'"`\s]+/g;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(el: HTMLElement): void {
  const tokens = (el.textContent ?? '').match(TOKEN_RE) ?? [];
  const counts: Record<string, number> = {};
  let html = '';
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (/^\s+$/.test(t)) { html += t; continue; }
    counts[t] = (counts[t] ?? 0) + 1;
    const attr = `data-layout-id="${esc(t)}-${counts[t]}"`;
    if (/^['"`]/.test(t)) {
      html += `<span class="cc-str" ${attr}>${esc(t)}</span>`;
    } else if (/^[a-zA-Z_$]/.test(t)) {
      const nextNonWs = tokens.slice(i + 1).join('').trimStart();
      const cls = KEYWORDS.has(t) ? 'cc-kw' : nextNonWs.startsWith('(') ? 'cc-fn' : 'cc-var';
      html += `<span class="${cls}" ${attr}>${esc(t)}</span>`;
    } else {
      html += `<span class="cc-op" ${attr}>${esc(t)}</span>`;
    }
  }
  el.innerHTML = html;
}

export function ContactCodeCard() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const codes = el.querySelectorAll<HTMLElement>('code');
    codes[0].textContent = WAAPI_SRC;
    codes[1].textContent = ANIMEJS_SRC;
    highlight(codes[0]);
    highlight(codes[1]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layout = createLayout(el, {
      loop: true,
      alternate: true,
      loopDelay: 500,
      duration: 1000,
      delay: 150,
      ease: 'inOutExpo',
      enterFrom: { opacity: 0, duration: 1250, delay: 100 },
      leaveTo: {
        opacity: 0,
        transform: () =>
          `translate(${random(-50, 50)}px, ${random(-200, 200)}px) rotate(${random(-30, 30)}deg)`,
        duration: 750,
        delay: stagger([0, 200], { from: 'random' }),
        ease: 'out(3)',
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    document.fonts.ready.then(() => {
      layout.update((l: { root: Element }) => {
        (l.root as HTMLElement).classList.toggle('cc-show');
      });
    });

    return () => {
      try { (layout.timeline as { pause?: () => void })?.pause?.(); } catch { /* noop */ }
    };
  }, []);

  return (
    <div className="cc-card" ref={ref}>
      <pre className="cc-waapi"><code /></pre>
      <pre className="cc-animejs"><code /></pre>
    </div>
  );
}
