import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { EXAMPLE_CAMPAIGNS } from '@/lib/leadEngine';
import FollowUpRequestForm from '@/components/leadengine/FollowUpRequestForm';

const FILTERS = [
  { key: 'all', label: 'All campaigns' },
  { key: 'current', label: 'Current' },
  { key: 'past', label: 'Past' },
];

const STATUS_STYLE = {
  current: 'border-volt/40 text-volt',
  draft: 'border-sun/40 text-sun',
  past: 'border-line text-muted-foreground',
};

export default function CampaignPreview() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const campaigns = EXAMPLE_CAMPAIGNS.filter((campaign) => filter === 'all' || campaign.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                filter === item.key ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-faint">
          For viewing purposes only · example campaigns · visitors cannot create or save drafts here.
        </span>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <article key={campaign.name} className="panel flex flex-col p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${STATUS_STYLE[campaign.status]}`}>
                  {campaign.status}
                </span>
                <span className="text-[11px] uppercase tracking-[0.14em] text-faint">{campaign.industry}</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{campaign.name}</h3>
              <p className="mt-1 text-sm text-volt">{campaign.offer}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{campaign.summary}</p>
              <ul className="mt-4 space-y-1.5">
                {campaign.captures.map((capture) => (
                  <li key={capture} className="text-xs text-faint">{capture}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setSelected(campaign)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-volt"
              >
                <Plus size={15} />
                Request a follow-up
              </button>
            </article>
          ))}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <FollowUpRequestForm campaignName={selected?.name || ''} />
          <div className="panel mt-4 p-5">
            <span className="kicker">Authorized users</span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Creating campaigns, reviewing leads, and sending outreach require a workspace login.
            </p>
            <Link to="/workspace" className="btn-ghost mt-4 !py-2 text-sm">Team sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}