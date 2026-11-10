import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import HandoffDialog from '@/components/workspace/HandoffDialog';
import EnrichDialog from '@/components/workspace/EnrichDialog';

const STATUSES = ['new', 'reviewing', 'contacted', 'qualified', 'handed_off', 'closed'];
const NOTE_KINDS = ['note', 'call', 'email', 'sms', 'handoff'];

export default function LeadDetail({ leadId, onClose, onChanged }) {
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ status: 'new', owner: '', follow_up_date: '', handoff_summary: '' });
  const [note, setNote] = useState({ kind: 'note', body: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [enrichOpen, setEnrichOpen] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      base44.entities.Lead.get(leadId),
      base44.entities.LeadNote.filter({ lead_id: leadId }, { sort: '-created_date', limit: 50 }),
    ]).then(([record, notePage]) => {
      if (!active) return;
      setLead(record);
      setForm({
        status: record?.status || 'new',
        owner: record?.owner || '',
        follow_up_date: record?.follow_up_date || '',
        handoff_summary: record?.handoff_summary || '',
      });
      setNotes(notePage?.items || []);
    });
    return () => {
      active = false;
    };
  }, [leadId]);

  async function save() {
    setSaving(true);
    setSaved(false);
    await base44.entities.Lead.update(leadId, {
      status: form.status,
      owner: form.owner,
      follow_up_date: form.follow_up_date,
      handoff_summary: form.handoff_summary,
    });
    setLead((prev) => ({ ...prev, ...form }));
    setSaving(false);
    setSaved(true);
    onChanged?.();
  }

  async function addNote() {
    if (!note.body.trim()) return;
    const created = await base44.entities.LeadNote.create({ lead_id: leadId, kind: note.kind, body: note.body });
    setNotes((prev) => [created, ...prev]);
    setNote({ kind: note.kind, body: '' });
  }

  if (!lead) return <div className="panel p-8 text-sm text-muted-foreground">Loading the lead…</div>;

  const field = 'h-10 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <div className="space-y-5">
      <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} />
        Back to leads
      </button>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div className="panel p-6">
          <span className="kicker">{String(lead.request_type || 'contact').replace('_', ' ')}</span>
          <h2 className="mt-3 font-display text-xl font-bold">{lead.full_name}</h2>
          <dl className="mt-5 space-y-2.5 text-sm">
            {[
              ['Company', lead.company],
              ['Email', lead.email],
              ['Phone', lead.phone],
              ['Website', lead.website],
              ['Industry', lead.industry],
              ['Market', lead.target_city],
              ['Budget', lead.budget],
              ['Timeline', lead.timeline],
              ['Campaign', lead.campaign_name],
              ['Source', lead.source_page],
              ['Submitted', lead.created_date ? new Date(lead.created_date).toLocaleString() : ''],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-line/60 pb-2 last:border-0">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
          </dl>
          {lead.enrichment?.compliance && (
            <div className="mt-5 flex flex-wrap gap-2">
              {lead.enrichment.compliance.dnc === true && <span className="chip !text-hot">DNC registered — do not call</span>}
              {lead.enrichment.compliance.dnc === false && <span className="chip chip-volt">Not on the DNC registry</span>}
              {lead.enrichment.compliance.litigator === true && <span className="chip !text-hot">TCPA litigator</span>}
              {lead.enrichment.compliance.litigator === false && <span className="chip chip-volt">No litigator history</span>}
              {lead.enrichment.compliance.lineType && <span className="chip">{String(lead.enrichment.compliance.lineType)}</span>}
            </div>
          )}
          {lead.need && <p className="mt-5 text-sm text-muted-foreground">{lead.need}</p>}
          {lead.message && (
            <div className="mt-5 rounded-xl border border-line bg-elevated p-4 text-sm leading-relaxed text-foreground/90 whitespace-pre-line">
              {lead.message}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="panel p-6">
            <h3 className="font-display text-base font-bold">Next step</h3>
            <div className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="text-muted-foreground">Stage</span>
                <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className={`${field} mt-1.5`}>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Owner</span>
                <input value={form.owner} onChange={(event) => setForm((prev) => ({ ...prev, owner: event.target.value }))} placeholder="Who owns the next step" className={`${field} mt-1.5`} />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Follow-up date</span>
                <input type="date" value={form.follow_up_date} onChange={(event) => setForm((prev) => ({ ...prev, follow_up_date: event.target.value }))} className={`${field} mt-1.5`} />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Handoff summary</span>
                <textarea
                  value={form.handoff_summary}
                  onChange={(event) => setForm((prev) => ({ ...prev, handoff_summary: event.target.value }))}
                  rows={3}
                  placeholder="Request, agreement to contact, and the useful details"
                  className="mt-1.5 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
                />
              </label>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={save} disabled={saving} className="btn-volt !py-2.5 text-sm disabled:opacity-60">
                {saving && <Loader2 size={15} className="animate-spin" />}
                Save lead
              </button>
              <button type="button" onClick={() => setHandoffOpen(true)} className="btn-ghost !py-2.5 text-sm">
                Qualify & hand off
              </button>
              <button type="button" onClick={() => setEnrichOpen(true)} className="btn-ghost !py-2.5 text-sm">
                Enrich with BatchData
              </button>
              {saved && <span className="text-xs text-volt">Saved</span>}
            </div>
          </div>

          <div className="panel p-6">
            <h3 className="font-display text-base font-bold">Activity</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {NOTE_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setNote((prev) => ({ ...prev, kind }))}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    note.kind === kind ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
            <textarea
              value={note.body}
              onChange={(event) => setNote((prev) => ({ ...prev, body: event.target.value }))}
              rows={3}
              placeholder="What happened, and what is next?"
              className="mt-3 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
            />
            <button type="button" onClick={addNote} className="btn-ghost mt-3 !py-2 text-sm">
              <Plus size={15} />
              Add activity
            </button>

            {notes.length > 0 && (
              <ul className="mt-5 space-y-3">
                {notes.map((item) => (
                  <li key={item.id} className="border-b border-line/60 pb-3 last:border-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-faint">
                      {item.kind} · {item.created_date ? new Date(item.created_date).toLocaleDateString() : ''}
                    </p>
                    <p className="mt-1 text-sm text-foreground/90 whitespace-pre-line">{item.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {enrichOpen && (
        <EnrichDialog
          lead={lead}
          onClose={() => setEnrichOpen(false)}
          onSaved={(updated, note) => {
            setLead((prev) => ({ ...prev, ...updated }));
            setNotes((prev) => [note, ...prev]);
          }}
        />
      )}

      {handoffOpen && (
        <HandoffDialog
          lead={lead}
          onClose={() => setHandoffOpen(false)}
          onDone={(updated, note) => {
            setLead((prev) => ({ ...prev, ...updated }));
            setForm((prev) => ({ ...prev, ...updated }));
            setNotes((prev) => [note, ...prev]);
            onChanged?.();
          }}
        />
      )}
    </div>
  );
}