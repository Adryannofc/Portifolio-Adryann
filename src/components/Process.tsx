import type { CSSProperties } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Overline } from './primitives';
import { SectionHead } from './Header';
import { useI18n } from '../contexts/I18nContext';

interface ProcessStep {
  n: string;
  phase: string;
  phasePt: string;
  title: string;
  titlePt: string;
  desc: string;
  descPt: string;
  deliverables: string[];
  deliverablesPt: string[];
  days: string;
  daysPt: string;
}

const PROCESS: ProcessStep[] = [
  {
    n: '01',
    phase: 'ORIENT',
    phasePt: 'ORIENTAR',
    title: 'Understand the business before the pixels.',
    titlePt: 'Entender o negócio antes dos pixels.',
    desc: "A half-day together. We map the actual constraint — revenue, time, audience. If a landing page isn't the answer, I say so.",
    descPt: 'Uma manhã juntos. Mapeamos a restrição real — receita, tempo, audiência. Se uma landing page não é a resposta, eu digo.',
    deliverables: ['Brief · written', 'Scope + risks', 'Go / no-go'],
    deliverablesPt: ['Brief · escrito', 'Escopo + riscos', 'Sim / não'],
    days: '1—2 days',
    daysPt: '1—2 dias',
  },
  {
    n: '02',
    phase: 'SHAPE',
    phasePt: 'MOLDAR',
    title: 'Design in the browser, not in isolation.',
    titlePt: 'Design no browser, não em isolamento.',
    desc: 'Low-fi flows to hi-fi in Figma to hi-fi in a Next.js sandbox. Decisions stick earlier because nothing is hypothetical.',
    descPt: 'Fluxos em baixa fidelidade para alta no Figma para alta em sandbox Next.js. Decisões se consolidam antes porque nada é hipotético.',
    deliverables: ['Flow map', 'Hi-fi key screens', 'Live sandbox URL'],
    deliverablesPt: ['Mapa de fluxo', 'Telas principais hi-fi', 'URL do sandbox'],
    days: '1—2 weeks',
    daysPt: '1—2 semanas',
  },
  {
    n: '03',
    phase: 'BUILD',
    phasePt: 'CONSTRUIR',
    title: 'Ship it small, ship it often.',
    titlePt: 'Entrega pequena, entrega frequente.',
    desc: 'Production-grade from day one. Preview deploys on every PR. You can see and touch progress without a meeting.',
    descPt: 'Código de produção desde o dia um. Preview de deploy a cada PR. Você vê e toca o progresso sem reunião.',
    deliverables: ['Staging URL · daily', 'Weekly walkthrough', 'Loom + written updates'],
    deliverablesPt: ['URL de staging · diário', 'Walkthrough semanal', 'Loom + atualizações escritas'],
    days: '2—6 weeks',
    daysPt: '2—6 semanas',
  },
  {
    n: '04',
    phase: 'HAND OFF',
    phasePt: 'ENTREGA',
    title: 'Leave you better than I found you.',
    titlePt: 'Deixo você melhor do que te encontrei.',
    desc: 'Docs your next engineer actually reads. Monitoring wired up. A month of care included — no surprises, no invoices.',
    descPt: 'Docs que seu próximo engenheiro realmente vai ler. Monitoramento configurado. Um mês de cuidado incluso — sem surpresas, sem cobranças extras.',
    deliverables: ['README · honest', 'Monitoring + alerts', '30 days of support'],
    deliverablesPt: ['README · honesto', 'Monitoramento + alertas', '30 dias de suporte'],
    days: '1 week',
    daysPt: '1 semana',
  },
];

export function Process() {
  const { locale, t } = useI18n();
  const ref = useReveal<HTMLElement>();
  return (
    <section id="process" className="process" ref={ref} data-screen-label="04 Process">
      <SectionHead
        index="04 /"
        eyebrow={t.process.eyebrow}
        title={
          <>
            <span className="mask-reveal">
              <span>{t.process.h2[0]}</span>
            </span>{' '}
            <span
              className="mask-reveal"
              style={{ '--reveal-delay': '100ms' } as CSSProperties}
            >
              <span>{t.process.h2[1]}</span>
            </span>
          </>
        }
        right={<span className="mono">{t.process.duration}</span>}
      />

      <div className="process-list">
        {PROCESS.map((p, i) => {
          const phase = locale === 'pt-BR' ? p.phasePt : p.phase;
          const title = locale === 'pt-BR' ? p.titlePt : p.title;
          const desc = locale === 'pt-BR' ? p.descPt : p.desc;
          const deliverables = locale === 'pt-BR' ? p.deliverablesPt : p.deliverables;
          const days = locale === 'pt-BR' ? p.daysPt : p.days;
          return (
            <div
              className="process-row reveal"
              key={p.n}
              style={{ '--reveal-delay': `${i * 80}ms` } as CSSProperties}
            >
              <div className="process-n mono">{p.n}</div>
              <div className="process-body">
                <div className="process-phase">
                  <Overline>{phase}</Overline>
                  <span className="mono process-days">{days}</span>
                </div>
                <h3 className="process-title">{title}</h3>
                <p className="process-desc">{desc}</p>
                <div className="process-deliv mono">
                  {deliverables.map((d, j) => (
                    <span key={d}>
                      {d}
                      {j < deliverables.length - 1 && <span className="process-sep">·</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
