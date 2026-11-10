import Section from '@/components/site/Section';
import FaqList from '@/components/site/FaqList';
import CtaBand from '@/components/site/CtaBand';
import PageHero from '@/components/site/PageHero';
import { OFFER_PAGES } from '@/lib/offerPages';

export default function OfferPage({ slug, children }) {
  const page = OFFER_PAGES[slug];
  const half = Math.ceil(page.sections.length / 2);

  return (
    <>
      <PageHero
        kicker={page.kicker}
        title={page.headline}
        lead={page.intro}
        primary={{ to: '/contact', label: 'Start a project' }}
        secondary={{ href: '/compare', label: 'Run a free comparison' }}
      />

      <Section kicker="What is included" title="How the work connects.">
        <div className="grid gap-5 md:grid-cols-2">
          {[page.sections.slice(0, half), page.sections.slice(half)].map((column, index) => (
            <div key={index} className="space-y-5">
              {column.map((section) => (
                <article key={section.title} className="panel p-6">
                  <h3 className="font-display text-lg font-bold">{section.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{section.body}</p>
                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2.5 text-sm text-muted-foreground">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {children}

      <Section kicker="Questions" title="Answers before you start.">
        <div className="max-w-3xl">
          <FaqList items={page.faqs} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}