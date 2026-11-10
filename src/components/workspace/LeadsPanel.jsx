import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Search } from 'lucide-react';
import LeadDetail from '@/components/workspace/LeadDetail';

const STATUSES = ['all', 'new', 'reviewing', 'contacted', 'qualified', 'handed_off', 'closed'];

const LABELS = {
  all: 'All',
  new: 'New',
  reviewing: 'Reviewing',
  contacted: 'Contacted',
  qualified: 'Qualified',
  handed_off: 'Handed off',
  closed: 'Closed',
};

export default function LeadsPanel() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLeads(null);
    base44.entities.Lead.filter(status === 'all' ? {} : { status }, { sort: '-created_date', limit: 100 })
      .then((page) => active && setLeads(page?.items || []))
      .catch(() => active && setLeads([]));
    return () => {
      active = false;
    };
  }, [status, refreshKey]);

  const term = search.trim().toLowerCase();
  const visible = (leads || []).filter((lead) =>
    term
      ? [lead.full_name, lead.company, lead.email, lead.phone, lead.website, lead.need].filter(Boolean).join(' ').toLowerCase().includes(term)
      : true
  );

  if (selectedId) {
    return (
      <LeadDetail
        leadId={selectedId}
        onClose={() => setSelectedId(null)}
        onChanged={() => setRefreshKey((key) => key + 1)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatus(key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                status === key ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
              }`}
            >
              {LABELS[key]}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, company, email"
            className="h-10 w-full rounded-full border border-line bg-ink pl-9 pr-3 text-sm outline-none focus:border-volt"
          />
        </div>
      </div>

      {leads === null ? (
        <div className="panel p-8 text-sm text-muted-foreground">Loading leads…</div>
      ) : visible.length === 0 ? (
        <div className="panel p-8 text-sm text-muted-foreground">
          No leads match this view yet. Submissions from the website, the comparison tool, and campaign follow-up requests
          land here.
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-elevated/60 text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3 font-medium">Lead</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className="cursor-pointer border-t border-line/70 transition-colors hover:bg-elevated/40"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{lead.full_name}</p>
                    <p className="text-xs text-faint">{[lead.company, lead.email].filter(Boolean).join(' · ')}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{String(lead.request_type || 'contact').replace('_', ' ')}</td>
                  <td className="px-4 py-3">
                    <span className="chip">{LABELS[lead.status] || 'New'}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.follow_up_date || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}