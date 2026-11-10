import Section from '@/components/site/Section';
import PageHero from '@/components/site/PageHero';
import CtaBand from '@/components/site/CtaBand';
import CampaignPreview from '@/components/leadengine/CampaignPreview';
import { CAMPAIGN_STEPS, WORKSPACE_FEATURES } from '@/lib/leadEngine';
import { JOURNEY } from '@/lib/site';

export default function LeadGeneration() {
  return (
    <>
      <PageHero
        kicker="Demore Technology Solutions · Lead generation"
        title="Find the opportunity. Connect every next step."
        lead="Bring your website, customer records, campaigns, conversations, and qualified handoffs into one connected growth system."
        primary={{ to: '/contact', label: 'Plan my lead-generation system' }}
        secondary={{ href: '#preview', label: 'Preview lead generation' }}
      />

      <Section
        kicker="One connected customer journey"
        title="Attract. Convert. Follow up. Improve."
        lead="Website and marketing services connect to a private campaign workspace. Integrations are scoped around your business."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY.map((step) => (
            <div key={step.n} className="panel p-5">
              <span className="kicker">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="preview"
        kicker="Try the workflow"
        title="Explore the campaign workspace."
        lead="View fictional current and past campaign examples. Request a follow-up from Ryan to discuss your business."
      >
        <CampaignPreview />
      </Section>

      <Section
        kicker="Inside your private workspace"
        title="More of the workflow, in one place."
        lead="The customer database, campaign builder, inbox, lead handoffs, cost views, and administration work together around the same customer and campaign."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKSPACE_FEATURES.map((feature) => (
            <div key={feature.n} className="panel-raised p-5">
              <span className="kicker">{feature.n}</span>
              <h3 className="mt-3 font-display text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section kicker="From campaign draft to handoff" title="A clear next step at every stage.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAMPAIGN_STEPS.map((step) => (
            <div key={step.n} className="panel p-5">
              <span className="font-display text-2xl font-extrabold text-volt">{step.n}</span>
              <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-faint">
          Campaign preparation, contact review, and staff approval remain part of the workflow. AI-assisted replies are
          drafts. Data providers, email, SMS, calling, verification, and AI services require configuration before their
          corresponding live features can run.
        </p>
      </Section>

      <CtaBand
        kicker="Your team stays in control"
        title="Plan the system around your business."
        lead="Send the brief and we will map the customer journey, the intake that matters, and the follow-up your team needs."
        primary={{ to: '/contact', label: 'File a project brief' }}
        secondary={{ to: '/platform', label: 'See the complete platform' }}
      />
    </>
  );
}