import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import { INDUSTRIES } from '@/lib/industries';

export default function Industries() {
  return (
    <>
      <PageHero
        kicker="Built around your buyer"
        title="See how the workflow fits your industry."
        lead="Choose an example to see the offer, the details worth capturing, and the handoff that helps your team respond."
        primary={{ to: '/contact', label: 'Start a project' }}
        secondary={{ href: '/lead-generation', label: 'Explore the Lead Engine' }}
      />

      <Section
        kicker="Industries"
        title="Nine workflows, one system."
        lead="Examples show how a configured workflow can be used. They are not live customer records or promises of results."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <Link
              key={industry.slug}
              to={`/industries/${industry.slug}`}
              className="panel group flex flex-col p-5 transition-colors hover:border-faint"
            >
              <h3 className="font-display text-lg font-bold">{industry.name}</h3>
              <p className="mt-2 text-sm text-volt">{industry.focus}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{industry.headline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-volt">
                Explore {industry.name}
                <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}