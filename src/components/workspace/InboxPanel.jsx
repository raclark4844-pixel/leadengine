import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, Inbox, Send } from 'lucide-react';
import LeadDetail from '@/components/workspace/LeadDetail';
import HandoffDialog from '@/components/workspace/HandoffDialog';

const TYPE_LABELS = {
  project_brief: 'Project brief',
  contact: 'Contact',
  campaign_followup: 'Campaign follow-up',
  website_review: 'Website review',
  comparison: 'Comparison',
};

export default function InboxPanel() {
  const [leads, setLeads] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [handoffLead, setHandoffLead] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let active = true;
    setLeads(null);
    base44.entities.Lead
      .filter({ status: { $in: ['new', 'reviewing', 'contacted'] } }, { sort: '-created_date', limit: 50 })
      .then((page) => active && setLeads(page?.items || []))
      .catch(() => active && setLeads([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  async function markContacted(lead) {
    await base44.entities.Lead.update(lead.id, { status: 'contacted' });
    refresh();
  }

  if (selectedId) {
    return <LeadDetail leadId={selectedId} onClose={() => setSelectedId(null)} onChanged={refresh} />;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        New requests land here. Review the request, mark it contacted, and hand qualified opportunities to the right
        teammate.
      </p>

      {leads === null ? (
        <div className="panel p-8 text-sm text-muted-foreground">Loading the inbox…</div>
      ) : leads.length === 0 ? (
        <div className="panel p-8 text-sm text-muted-foreground">
          The inbox is clear. New leads from the website, the review tools, and campaign follow-up requests appear here
          until they are contacted or handed off.
        </div>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li key={lead.id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip chip-volt">{lead.status}</span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-faint">
                      {TYPE_LABELS[lead.request_type] || 'Contact'}
                    </span>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold">{lead.full_name}</p>
                  <p className="mt-1 text-xs text-faint">
                    {[lead.company, lead.email, lead.phone, lead.campaign_name].filter(Boolean).join(' · ')}
                  </p>
                  {(lead.need || lead.message) && (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {(lead.need || lead.message).slice(0, 220)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-stretch gap-2">
                  <button type="button" onClick={() => setSelectedId(lead.id)} className="btn-ghost !px-4 !py-2 text-sm">
                    <Inbox size={14} />
                    Open request
                  </button>
                  {lead.status !== 'contacted' && (
                    <button
                      type="button"
                      onClick={() => markContacted(lead)}
                      className="btn-ghost !px-4 !py-2 text-sm"
                    >
                      <Check size={14} />
                      Mark contacted
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setHandoffLead(lead)}
                    className="btn-volt !px-4 !py-2 text-sm"
                  >
                    <Send size={14} />
                    Qualify & hand off
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {handoffLead && (
        <HandoffDialog
          lead={handoffLead}
          onClose={() => setHandoffLead(null)}
          onDone={() => refresh()}
        />
      )}
    </div>
  );
}