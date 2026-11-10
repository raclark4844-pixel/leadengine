import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Plus } from 'lucide-react';
import { CHANNEL_OPTIONS, EXAMPLE_CAMPAIGNS } from '@/lib/leadEngine';
import { INDUSTRIES } from '@/lib/industries';

const STATUS_STYLE = {
  current: 'border-volt/40 text-volt',
  draft: 'border-sun/40 text-sun',
  past: 'border-line text-muted-foreground',
};

const EMPTY = {
  name: '',
  customer_name: '',
  industry: '',
  offer: '',
  territory: '',
  lead_goal: '',
  start_date: '',
  status: 'draft',
  summary: '',
};

export default function CampaignsPanel() {
  const [campaigns, setCampaigns] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [channels, setChannels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    base44.entities.Campaign.filter({}, { sort: '-created_date', limit: 100 })
      .then((page) => active && setCampaigns(page?.items || []))
      .catch(() => active && setCampaigns([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function create() {
    if (!form.name.trim() || !form.customer_name.trim()) return;
    setSaving(true);
    await base44.entities.Campaign.create({
      ...form,
      lead_goal: form.lead_goal ? Number(form.lead_goal) : undefined,
      channels,
      is_example: false,
    });
    setForm(EMPTY);
    setChannels([]);
    setShowForm(false);
    setSaving(false);
    setRefreshKey((key) => key + 1);
  }

  async function loadExamples() {
    setSaving(true);
    await base44.entities.Campaign.bulkCreate(
      EXAMPLE_CAMPAIGNS.map((campaign) => ({
        name: campaign.name,
        customer_name: campaign.customer,
        industry: campaign.industry,
        offer: campaign.offer,
        status: campaign.status,
        summary: campaign.summary,
        notes: `Example workflow. Details worth capturing: ${campaign.captures.join('; ')}.`,
        is_example: true,
      }))
    );
    setSaving(false);
    setRefreshKey((key) => key + 1);
  }

  async function updateStatus(campaign, status) {
    await base44.entities.Campaign.update(campaign.id, { status });
    setRefreshKey((key) => key + 1);
  }

  const field = 'h-10 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Plan the customer, industry, offer, territory, lead goal, and requested channels. Drafts stay drafts until the team
          activates them.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowForm((value) => !value)} className="btn-volt !py-2.5 text-sm">
            <Plus size={15} />
            New campaign
          </button>
          {campaigns?.length === 0 && (
            <button type="button" onClick={loadExamples} disabled={saving} className="btn-ghost !py-2.5 text-sm">
              Load example campaigns
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="panel p-6">
          <h3 className="font-display text-base font-bold">New campaign draft</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={form.name} onChange={set('name')} placeholder="Campaign name" className={field} />
            <input value={form.customer_name} onChange={set('customer_name')} placeholder="Customer" className={field} />
            <select value={form.industry} onChange={set('industry')} className={field}>
              <option value="">Industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.slug} value={industry.name}>
                  {industry.name}
                </option>
              ))}
            </select>
            <input value={form.offer} onChange={set('offer')} placeholder="Offer being promoted" className={field} />
            <input value={form.territory} onChange={set('territory')} placeholder="Territory (counties, ZIPs, cities)" className={field} />
            <input value={form.lead_goal} onChange={set('lead_goal')} type="number" placeholder="Lead goal" className={field} />
            <input value={form.start_date} onChange={set('start_date')} type="date" className={field} />
            <select value={form.status} onChange={set('status')} className={field}>
              <option value="draft">Draft</option>
              <option value="current">Current</option>
              <option value="past">Past</option>
            </select>
          </div>
          <textarea
            value={form.summary}
            onChange={set('summary')}
            rows={2}
            placeholder="What this campaign is for"
            className="mt-3 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {CHANNEL_OPTIONS.map((channel) => (
              <button
                key={channel}
                type="button"
                onClick={() =>
                  setChannels((prev) => (prev.includes(channel) ? prev.filter((item) => item !== channel) : [...prev, channel]))
                }
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  channels.includes(channel) ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
                }`}
              >
                {channel}
              </button>
            ))}
          </div>
          <button type="button" onClick={create} disabled={saving} className="btn-volt mt-5 !py-2.5 text-sm disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            Save draft
          </button>
        </div>
      )}

      {campaigns === null ? (
        <div className="panel p-8 text-sm text-muted-foreground">Loading campaigns…</div>
      ) : campaigns.length === 0 ? (
        <div className="panel p-8 text-sm text-muted-foreground">
          No campaigns yet. Create one, or load the fictional examples to see how the workflow is organized.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="panel p-5">
              <div className="flex items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${STATUS_STYLE[campaign.status] || STATUS_STYLE.draft}`}>
                  {campaign.status}
                </span>
                {campaign.is_example && <span className="text-[11px] uppercase tracking-[0.14em] text-faint">Example</span>}
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{campaign.name}</h3>
              <p className="mt-1 text-sm text-volt">{campaign.customer_name}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{campaign.summary || campaign.offer}</p>
              <dl className="mt-4 space-y-1.5 text-xs text-faint">
                {campaign.industry && <div>Industry: {campaign.industry}</div>}
                {campaign.territory && <div>Territory: {campaign.territory}</div>}
                {campaign.lead_goal ? <div>Lead goal: {campaign.lead_goal}</div> : null}
                {campaign.channels?.length ? <div>Channels: {campaign.channels.join(', ')}</div> : null}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {['draft', 'current', 'past']
                  .filter((status) => status !== campaign.status)
                  .map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(campaign, status)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-muted-foreground hover:border-faint hover:text-foreground"
                    >
                      Move to {status}
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}