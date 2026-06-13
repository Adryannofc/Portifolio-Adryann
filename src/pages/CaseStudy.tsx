import { Link, useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../contexts/I18nContext';
import { CaseHeader } from '../components/case-study/CaseHeader';
import { CaseOverview } from '../components/case-study/CaseOverview';
import { CaseStyleGuide } from '../components/case-study/CaseStyleGuide';
import { CaseStack } from '../components/case-study/CaseStack';
import { CaseNotes } from '../components/case-study/CaseNotes';
import { CaseRoadmap } from '../components/case-study/CaseRoadmap';
import { CaseFooter } from '../components/case-study/CaseFooter';
import { SectionDots } from '../components/case-study/SectionDots';
import { PageTransitionCurtain } from '../components/case-study/PageTransitionCurtain';

export function CaseStudy() {
  const { locale, t } = useI18n();
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!project || !project.caseStudy) {
    return (
      <main className="case-dark">
        <div className="case-404">
          <div className="case-404-n mono">404</div>
          <div className="overline">{t.caseStudy.notFound}</div>
          <p className="body">
            {t.caseStudy.notFoundMsg.replace('{slug}', slug ?? '')}
          </p>
          <Link to="/">{t.caseStudy.backToWork}</Link>
        </div>
      </main>
    );
  }

  const raw = project.caseStudy;
  const cs = locale === 'pt-BR'
    ? {
        ...raw,
        tagline: raw.taglinePt ?? raw.tagline,
        overview: raw.overviewPt ?? raw.overview,
        brief: raw.briefPt ?? raw.brief,
        meta: raw.metaPt ?? raw.meta,
        notes: raw.notesPt ?? raw.notes,
        roadmap: raw.roadmapPt ?? raw.roadmap,
      }
    : raw;

  return (
    <main className="case-dark" ref={ref}>
      <PageTransitionCurtain />
      <SectionDots />
      <CaseHeader project={project} cs={cs} />
      <CaseOverview cs={cs} />
      <CaseStyleGuide cs={cs} />
      <CaseStack cs={cs} />
      <CaseNotes cs={cs} />
      <CaseRoadmap cs={cs} />
      <CaseFooter cs={cs} />
    </main>
  );
}
