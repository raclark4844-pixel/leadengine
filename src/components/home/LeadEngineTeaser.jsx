import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Target, Mail, Receipt } from 'lucide-react';
import Section from '@/components/site/Section';

const FEATURES = [
  { icon: Users, title: 'Customer records', body: 'Business, website, contact people, and campaign history kept together.' },
  { icon: Target, title: 'Campaign planning', body: 'Customer, industry, offer, territory, goals, and requested channels.' },
  { icon: Mail, title: 'Conversations', body: 'Campaign replies and context in one inbox with reviewed reply drafts.' },
  { icon: Receipt, title: 'Costs and outcomes', body: 'Recorded costs, lead delivery history, and handoff records in one view.' },
];

export default function LeadEngineTeaser() {
  return (
    <Section
      kicker="A dedicated workspace for leads"
      title="Explore the Demore Lead Engine."
      lead="Bring prospect research, campaign organization, outreach drafts, and follow-up into one workspace. Start a campaign draft, manage current activity, and review past campaigns together across customers."
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="panel-raised p-5">
              <feature.icon size={18} className="text-volt" />
              <h3 className="mt-4 font-display text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
        <div className="panel flex flex-col justify-between p-6 sm:p-8">
          <div>
            <span className="kicker">Public preview</span>
            <h3 className="mt-4 font-display text-xl font-bold">View example campaigns, then request a follow-up.</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Fictional current and past campaigns show how the workflow fits restaurants, pubs, pizza shops, and
              contractors. Creating campaigns requires an authorized login.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/lead-generation" className="btn-volt !py-2.5 text-sm">
              Preview lead generation
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/workspace" className="btn-ghost !py-2.5 text-sm">
              Team sign in
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}