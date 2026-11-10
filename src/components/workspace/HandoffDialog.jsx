import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, X } from 'lucide-react';

export default function HandoffDialog({ lead, onClose, onDone }) {
  const [owner, setOwner] = useState(lead?.owner || '');
  const [status, setStatus] = useState('handed_off');
  const [summary, setSummary] = useState(() => {
    const contact = [lead?.email, lead?.phone].filter(Boolean).join(', ');
    return [
      `${lead?.full_name || 'The prospect'}${lead?.company ? ` (${lead.company})` : ''} asked about ${String(lead?.request_type || 'contact').replace('_', ' ')}.`,
      lead?.need ? `What they need: ${lead.need}.` : '',
      contact ? `Best contact: ${contact}.` : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!owner.trim()) return setError('Choose who receives this handoff.');
    if (!summary.trim()) return setError('Add a short handoff summary so the next person has context.');
    setSaving(true);
    setError('');
    try {
      await base44.entities.Lead.update(lead.id, { status, owner, handoff_summary: summary });
      const note = await base44.entities.LeadNote.create({
        lead_id: lead.id,
        kind: 'handoff',
        body: `Handed off to ${owner.trim()}: ${summary.trim()}`,
      });
      onDone?.({ status, owner, handoff_summary: summary.trim() }, note);
      onClose();
    } catch (err) {
      setError('Could not save the handoff. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const field = 'h-10 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4" role="dialog" aria-modal="true">
      <div className="panel-raised w-full max-w-lg p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="kicker">Qualified handoff</span>
            <h3 className="mt-2 font-display text-lg font-bold">Hand off {lead?.full_name}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-line p-1.5 text-muted-foreground hover:text-foreground">
            <X size={15} />
          </button>
        </div>

        <label className="mt-5 block text-sm">
          <span className="text-muted-foreground">Hand off to</span>
          <input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Teammate or destination (e.g. Sales, Ryan)"
            className={`${field} mt-1.5`}
          />
        </label>

        <label className="mt-4 block text-sm">
          <span className="text-muted-foreground">Stage after handoff</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className={`${field} mt-1.5`}>
            <option value="qualified">Qualified (awaiting contact)</option>
            <option value="handed_off">Handed off (delivered)</option>
          </select>
        </label>

        <label className="mt-4 block text-sm">
          <span className="text-muted-foreground">Handoff summary</span>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            rows={5}
            className="mt-1.5 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
          />
        </label>

        {error && <p className="mt-3 text-sm text-hot">{error}</p>}

        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={submit} disabled={saving} className="btn-volt !py-2.5 text-sm disabled:opacity-60">
            {saving && <Loader2 size={15} className="animate-spin" />}
            Complete handoff
          </button>
          <button type="button" onClick={onClose} className="btn-ghost !py-2.5 text-sm">
            Cancel
          </button>
        </div>
        <p className="mt-3 text-xs text-faint">
          The handoff is recorded on the lead with a note the whole team can see.
        </p>
      </div>
    </div>
  );
}