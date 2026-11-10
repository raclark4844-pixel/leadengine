import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import { PROCESS_STEPS } from '@/lib/site';

export default function Process() {
  return (
    <>
      <PageHero
        kicker="How the work runs"
        title="Four steps from brief to a system that keeps improving."
        lead="No invented proof, no promised rankings. A clear intake, an honest review of the offer, a build that connects the parts, and measurement that keeps decisions grounded."
        primary={{ to: '/contact', label: 'File a project brief' }}
        secondary={{ href: '/compare', label: 'Run a free website comparison' }}
      />

      <Section kicker="The engagement" title="What happens, in order.">
        <div className="grid gap-5 sm:grid-cols-2">
          {PROCESS_STEPS.map((step) => (
            <div key={step.n} className="panel p-6">
              <span className="kicker">{step.n}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        kicker="What will not happen"
        title="Honest by default."
        lead="The studio will not claim results it cannot show."
      >
        <ul className="grid max-w-4xl gap-3 text-[15px] text-muted-foreground sm:grid-cols-2">
          {[
            'No invented revenue or fabricated traffic numbers.',
            'No borrowed logos, fake testimonials, or made-up case studies.',
            'No guaranteed rankings, AI citations, lead volume, or conversion lifts.',
            'No automated outreach sent without review when a human decision is involved.',
          ].map((item) => (
            <li key={item} className="panel p-4">{item}</li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}