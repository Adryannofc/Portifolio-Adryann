import { Link, useParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import { useReveal } from '../hooks/useReveal';
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
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECTS.find((p) => p.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!project || !project.caseStudy) {
    return (
      <main className="case-dark">
        <div className="case-404">
          <div className="case-404-n mono">404</div>
          <div className="overline">CASE STUDY NOT FOUND</div>
          <p className="body">
            Project "{slug}" doesn't have a published case study yet.
          </p>
          <Link to="/">↑ Back to all work</Link>
        </div>
      </main>
    );
  }

  const cs = project.caseStudy;

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
