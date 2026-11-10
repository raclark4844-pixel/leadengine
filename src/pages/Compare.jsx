import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import WebsiteReviewTool from '@/components/tools/WebsiteReviewTool';

export default function Compare() {
  return (
    <>
      <PageHero
        kicker="Free comparison · no login required"
        title="See how your website compares, then decide what to fix first."
        lead="Enter your site (and up to three competitors) for a plain-language comparison of design signals, search readiness, conversion path, and local proof. You get a downloadable PDF, and Ryan follows up."
      />

      <Section kicker="The comparison" title="A working comparison, not a sales page.">
        <WebsiteReviewTool mode="comparison" />
      </Section>

      <Section
        kicker="How it works"
        title="What we read, and what we refuse to invent."
        lead="Everything in the report comes from your public pages or the public pages of the competitors you name."
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { title: 'Public signals only', body: 'Page structure, headings, metadata, schema, forms, links, images, and visible copy. Nothing behind a login, and no guessed numbers.' },
            { title: 'Honest labels', body: 'Each finding is marked working, not found, or needs a check, so a missing signal is not mistaken for a proven problem.' },
            { title: 'A next step, not a pitch', body: 'The report ends with what to fix first. If it turns out your site already does the work, the review will say so.' },
          ].map((item) => (
            <div key={item.title} className="panel p-6">
              <h3 className="font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        kicker="Want the full system?"
        title="Plan the website, visibility, and follow-up together."
        lead="The comparison shows where the gaps are. The project brief starts the work on the parts that matter most."
        primary={{ to: '/contact', label: 'File a project brief' }}
        secondary={{ to: '/platform', label: 'See the complete platform' }}
      />
    </>
  );
}