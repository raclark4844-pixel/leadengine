import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CalendarClock, CheckCircle2, Inbox, Megaphone } from 'lucide-react';

const STATUS_LABELS = {
  new: 'New',
  reviewing: 'Reviewing',
  contacted: 'Contacted',
  qualified: 'Qualified',
  handed_off: 'Handed off',
  closed: 'Closed',
};

export default function OverviewPanel({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [due, setDue] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const today = new Date().toISOString().slice(0, 10);
      const [leadGroups, campaignGroups, reviewCount, recentPage, openLeads] = await Promise.all([
        base44.entities.Lead.aggregate({ query: {}, groupBy: 'status' }),
        base44.entities.Campaign.aggregate({ query: {}, groupBy: 'status' }),
        base44.entities.WebsiteReview.count({}),
        base44.entities.Lead.filter({}, { sort: '-created_date', limit: 6 }),
        base44.entities.Lead.filter({ follow_up_date: { $lte: today }, status: { $nin: ['closed', 'handed_off'] } }, { sort: 'follow_up_date', limit: 8 }),
      ]);
      if (!active) return;
      const byStatus = {};
      (leadGroups?.rows || []).forEach((row) => {
        byStatus[row.status || 'new'] = row.count;
      });
      const campaignByStatus = {};
      (campaignGroups?.rows || []).forEach((row) => {
        campaignByStatus[row.status || 'draft'] = row.count;
      });
      setStats({
        byStatus,
        open:
          (byStatus.new || 0) + (byStatus.reviewing || 0) + (byStatus.contacted || 0) + (byStatus.qualified || 0),
        campaigns: campaignByStatus,
        reviews: reviewCount || 0,
      });
      setRecent(recentPage?.items || []);
      setDue(openLeads?.items || []);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  if (!stats) return <div className="panel p-8 text-sm text-muted-foreground">Loading the workspace…</div>;

  const cards = [
    { icon: Inbox, label: 'Open leads', value: stats.open, tab: 'leads' },
    { icon: CalendarClock, label: 'Follow-ups due', value: due.length, tab: 'leads' },
    { icon: Megaphone, label: 'Live campaigns', value: stats.campaigns.current || 0, tab: 'campaigns' },
    { icon: CheckCircle2, label: 'Website reviews', value: stats.reviews, tab: 'reviews' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.tab)}
            className="panel p-5 text-left transition-colors hover:border-faint"
          >
            <card.icon size={17} className="text-volt" />
            <p className="mt-4 font-display text-3xl font-extrabold">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-display text-lg font-bold">Leads by stage</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {Object.keys(STATUS_LABELS).map((status) => (
              <li key={status} className="flex items-center justify-between border-b border-line/60 pb-2 last:border-0">
                <span className="text-muted-foreground">{STATUS_LABELS[status]}</span>
                <span className="font-medium">{stats.byStatus[status] || 0}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel p-6">
          <h2 className="font-display text-lg font-bold">Follow-ups due</h2>
          {due.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Nothing is overdue. Set a follow-up date on a lead and it will show here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3 text-sm">
              {due.map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-3 border-b border-line/60 pb-2 last:border-0">
                  <span>
                    <span className="font-medium">{lead.full_name}</span>
                    <span className="ml-2 text-xs text-faint">{lead.company || lead.request_type}</span>
                  </span>
                  <span className="text-xs text-sun">{lead.follow_up_date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Newest leads</h2>
          <button type="button" onClick={() => onNavigate('leads')} className="text-sm text-volt hover:underline">
            Open all leads
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No leads yet. Submissions from the website land here automatically.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recent.map((lead) => (
              <li key={lead.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{lead.full_name}</p>
                  <p className="text-xs text-faint">
                    {[lead.company, lead.email, lead.request_type].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="chip">{STATUS_LABELS[lead.status] || 'New'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}