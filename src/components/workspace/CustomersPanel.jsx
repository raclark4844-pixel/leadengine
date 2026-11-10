import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { INDUSTRIES } from '@/lib/industries';

const EMPTY = {
  name: '',
  contact_name: '',
  email: '',
  phone: '',
  website: '',
  industry: '',
  location: '',
  notes: '',
};

export default function CustomersPanel() {
  const [customers, setCustomers] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    base44.entities.Customer.filter({}, { sort: '-created_date', limit: 100 })
      .then((page) => active && setCustomers(page?.items || []))
      .catch(() => active && setCustomers([]));
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function startNew() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(customer) {
    setForm({
      name: customer.name || '',
      contact_name: customer.contact_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      website: customer.website || '',
      industry: customer.industry || '',
      location: customer.location || '',
      notes: customer.notes || '',
    });
    setEditingId(customer.id);
    setShowForm(true);
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    if (editingId) {
      await base44.entities.Customer.update(editingId, form);
    } else {
      await base44.entities.Customer.create(form);
    }
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(false);
    setSaving(false);
    setRefreshKey((key) => key + 1);
  }

  async function remove(customer) {
    if (!window.confirm(`Delete the customer record for ${customer.name}?`)) return;
    await base44.entities.Customer.delete(customer.id);
    setRefreshKey((key) => key + 1);
  }

  const field = 'h-10 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Company profiles and contact people for the businesses you serve. Customer details stay private to the
          workspace and are reused when planning campaigns.
        </p>
        <button type="button" onClick={startNew} className="btn-volt !py-2.5 text-sm">
          <Plus size={15} />
          New customer
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="panel p-6">
          <h3 className="font-display text-base font-bold">{editingId ? 'Edit customer' : 'New customer record'}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={form.name} onChange={set('name')} placeholder="Business name" className={field} required />
            <input value={form.contact_name} onChange={set('contact_name')} placeholder="Main contact" className={field} />
            <input value={form.email} onChange={set('email')} type="email" placeholder="Email" className={field} />
            <input value={form.phone} onChange={set('phone')} placeholder="Phone" className={field} />
            <input value={form.website} onChange={set('website')} placeholder="Website" className={field} />
            <input value={form.location} onChange={set('location')} placeholder="City or service area" className={field} />
            <select value={form.industry} onChange={set('industry')} className={field}>
              <option value="">Industry</option>
              {INDUSTRIES.map((industry) => (
                <option key={industry.slug} value={industry.name}>
                  {industry.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            rows={3}
            placeholder="Goals, current tools, campaign history, anything worth remembering"
            className="mt-3 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
          />
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-volt !py-2.5 text-sm disabled:opacity-60">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {editingId ? 'Save changes' : 'Save customer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm(EMPTY);
              }}
              className="btn-ghost !py-2.5 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {customers === null ? (
        <div className="panel p-8 text-sm text-muted-foreground">Loading customers…</div>
      ) : customers.length === 0 ? (
        <div className="panel p-8 text-sm text-muted-foreground">
          No customer records yet. Add the businesses you serve so campaign planning starts from saved details.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {customers.map((customer) => (
            <article key={customer.id} className="panel p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold">{customer.name}</h3>
                  <p className="mt-1 text-sm text-volt">{customer.contact_name || customer.industry}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(customer)}
                    aria-label={`Edit ${customer.name}`}
                    className="rounded-full border border-line p-2 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(customer)}
                    aria-label={`Delete ${customer.name}`}
                    className="rounded-full border border-line p-2 text-muted-foreground hover:text-hot"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <dl className="mt-3 space-y-1 text-xs text-faint">
                {customer.email && <div>Email: {customer.email}</div>}
                {customer.phone && <div>Phone: {customer.phone}</div>}
                {customer.website && <div>Website: {customer.website}</div>}
                {customer.location && <div>Location: {customer.location}</div>}
              </dl>
              {customer.notes && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{customer.notes}</p>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}