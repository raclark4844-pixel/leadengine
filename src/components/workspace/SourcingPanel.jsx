import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Search, UserPlus } from 'lucide-react';
import PropertyFacts from '@/components/workspace/PropertyFacts';

const LIMITS = [10, 20, 25];

export default function SourcingPanel() {
  const [form, setForm] = useState({ city: '', state: '', limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState(null);
  const [added, setAdded] = useState({});
  const [adding, setAdding] = useState(null);

  async function search() {
    if (!form.city.trim() || !form.state.trim()) {
      setError('Enter both a city and a state to search.');
      return;
    }
    setLoading(true);
    setError('');
    setItems(null);
    setAdded({});
    try {
      const response = await base44.functions.invoke('batchdataSourceLeads', {
        city: form.city.trim(),
        state: form.state.trim(),
        limit: form.limit,
      });
      const found = response.data?.items || [];
      setItems(found);
      if (!found.length) setError(response.data?.error || 'No properties matched that area.');
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
    setLoading(false);
  }

  async function addAsLead(index) {
    const item = items[index];
    setAdding(index);
    setError('');
    try {
      const created = await base44.entities.Lead.create({
        full_name: item.name || 'Property owner',
        request_type: 'property_lead',
        phone: item.phones?.[0] || '',
        email: item.emails?.[0] || '',
        address: item.addresses?.[0] || '',
        target_city: `${form.city}, ${form.state}`,
        source_page: 'BatchData property search',
        status: 'new',
        enrichment: { sourced: item.raw },
      });
      setAdded((prev) => ({ ...prev, [index]: created.id }));
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
    setAdding(null);
  }

  const field = 'h-10 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <div className="space-y-5">
      <div className="panel p-6">
        <h3 className="font-display text-base font-bold">Source property-owner leads</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Search BatchData property records by area, review the owners found, and add them to your lead list. Each
          record returned bills per-result credits to your BatchData account, so keep searches targeted.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_110px_110px_auto] sm:items-end">
          <label className="block text-sm">
            <span className="text-muted-foreground">City</span>
            <input
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
              placeholder="Columbus"
              className={`${field} mt-1.5`}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">State</span>
            <input
              value={form.state}
              onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))}
              placeholder="OH"
              maxLength={2}
              className={`${field} mt-1.5 uppercase`}
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Records</span>
            <select
              value={form.limit}
              onChange={(event) => setForm((prev) => ({ ...prev, limit: Number(event.target.value) }))}
              className={`${field} mt-1.5`}
            >
              {LIMITS.map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={search} disabled={loading} className="btn-volt !py-2.5 text-sm disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Search area
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-hot">{error}</p>}
      </div>

      {items && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="panel-raised p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold">{item.name || 'Owner not listed'}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.addresses?.[0] || 'Address unavailable'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.phones?.slice(0, 3).map((phoneValue) => (
                      <span key={phoneValue} className="chip">
                        {phoneValue}
                      </span>
                    ))}
                    {item.emails?.slice(0, 2).map((emailValue) => (
                      <span key={emailValue} className="chip">
                        {emailValue}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => addAsLead(index)}
                  disabled={added[index] || adding === index}
                  className="btn-ghost !py-2 text-sm disabled:opacity-60"
                >
                  {adding === index ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
                  {added[index] ? 'Added to leads' : 'Add as lead'}
                </button>
              </div>
              <PropertyFacts record={item.raw} />
              <details className="mt-3 text-xs text-faint">
                <summary className="cursor-pointer select-none">Raw BatchData record</summary>
                <pre className="mt-2 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-ink p-3">
                  {JSON.stringify(item.raw, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}