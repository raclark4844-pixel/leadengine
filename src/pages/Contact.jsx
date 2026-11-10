import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import ProjectBriefForm from '@/components/forms/ProjectBriefForm';
import { SITE } from '@/lib/site';

export default function Contact() {
  return (
    <>
      <PageHero
        kicker="Start a project"
        title="Tell us what you want to build."
        lead="The brief collects what we need to understand the offer, the audience, the conversion path, the current tools, and the growth priorities before the build starts."
      />

      <Section kicker="Project brief" title="Three short steps.">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <ProjectBriefForm />
          <div className="space-y-4">
            <div className="panel p-6">
              <span className="kicker">Direct contact</span>
              <p className="mt-4 text-sm text-muted-foreground">
                <a className="text-volt underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
              <p className="mt-2 text-sm text-faint">{SITE.cityLine}</p>
              <p className="text-sm text-faint">{SITE.areaLine}</p>
              <p className="mt-3 text-sm text-faint">Phone unpublished. Email reaches Ryan directly.</p>
            </div>
            <div className="panel p-6">
              <span className="kicker">What happens next</span>
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>1. Your brief is saved in the lead engine and emailed to Ryan.</li>
                <li>2. The offer, audience, and current site are reviewed before priorities are chosen.</li>
                <li>3. You get a straight answer on what to build first, and what can wait.</li>
              </ol>
            </div>
            <div className="panel p-6">
              <span className="kicker">No fake proof</span>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                No invented revenue, borrowed logos, fake testimonials, or fabricated traffic and lead numbers. {SITE.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}