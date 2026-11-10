import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import { INDUSTRIES, industryBySlug } from '@/lib/industries';

export default function IndustryDetail() {
  const { slug } = useParams();
  const industry = industryBySlug(slug);

  if (!industry) {
    return (
      <Section kicker="Industries" title="That industry page is not here.">
        <Link to="/industries" className="btn-volt">See all industries</Link>
      </Section>
    );
  }

  return (
    <>
      <PageHero
        kicker={`Industries · ${industry.name}`}
        title={industry.headline}
        lead={industry.intro}
        primary={{ to: '/contact', label: 'Start a project' }}
        secondary={{ href: '/compare', label: 'Run a free comparison' }}
      />

      <Section kicker={industry.kicker} title={`From ${industry.focus.toLowerCase()} to a useful sales conversation.`}>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">Capture what matters</h3>
            <ul className="mt-4 space-y-2.5">
              {industry.captures.map((capture) => (
                <li key={capture} className="flex gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-volt" />
                  {capture}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">Connect the next step</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{industry.next}</p>
          </div>
          <div className="panel p-6">
            <h3 className="font-display text-lg font-bold">Review the results</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{industry.review}</p>
          </div>
        </div>
      </Section>

      <Section kicker="Other industries" title="See the workflow that fits your business.">
        <div className="flex flex-wrap gap-2.5">
          {INDUSTRIES.filter((item) => item.slug !== industry.slug).map((item) => (
            <Link
              key={item.slug}
              to={`/industries/${item.slug}`}
              className="rounded-full border border-line px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-faint hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}