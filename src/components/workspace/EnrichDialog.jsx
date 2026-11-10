import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function EnrichDialog({ lead, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [compliance, setCompliance] = useState(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    base44.functions
      .invoke('batchdataEnrichLead', {
        full_name: lead.full_name || '',
        address: lead.address || '',
        city: lead.target_city || '',
        phone: lead.phone || '',
        email: lead.email || '',
      })
      .then((response) => {
        if (!active) return;
        setResult(response.data || null);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.error || err.message);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lead.id]);

  const phone = result?.phones?.[0] || lead.phone || '';

  async function checkCompliance() {
    setChecking(true);
    setError('');
    try {
      const response = await base44.functions.invoke('batchdataCheckPhone', { phone });
      setCompliance(response.data || null);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
    setChecking(false);
  }

  function buildSummary() {
    const parts = [];
    if (result?.phones?.length) parts.push(`${result.phones.length} phone(s)`);
    if (result?.emails?.length) parts.push(`${result.emails.length} email(s)`);
    let text = `BatchData enrichment: ${parts.length ? parts.join(' and ') : 'no new contacts'} found.`;
    if (compliance) {
      const dnc =
        compliance.dnc === true ? 'DNC registered (do not call)' : compliance.dnc === false ? 'DNC clear' : 'DNC unknown';
      const litigator =
        compliance.litigator === true
          ? 'TCPA litigator flagged'
          : compliance.litigator === false
            ? 'no litigator history'
            : 'litigator status unknown';
      text += ` Calling compliance: ${dnc}, ${litigator}.`;
    }
    return text;
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const updated = {
        phone: lead.phone || result?.phones?.[0] || '',
        email: lead.email || result?.emails?.[0] || '',
        address: lead.address || result?.addresses?.[0] || '',
        enrichment: {
          batchdata: result?.raw || null,
          contacts: { phones: result?.phones || [], emails: result?.emails || [] },
          compliance: compliance || null,
        },
      };
      await base44.entities.Lead.update(lead.id, updated);
      const note = await base44.entities.LeadNote.create({
        lead_id: lead.id,
        kind: 'enrich',
        body: buildSummary(),
      });
      onSaved?.(updated, note);
      setSaved(true);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
    setSaving(false);
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto border-line bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">BatchData enrichment</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={15} className="animate-spin" />
            Searching BatchData for contact details…
          </div>
        )}

        {error && <p className="text-sm text-hot">{error}</p>}

        {result && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{result.summary || 'Search complete.'}</p>

            <div className="space-y-2">
              {result.phones?.length > 0 ? (
                result.phones.map((item) => (
                  <p key={item} className="rounded-xl border border-line bg-ink px-3 py-2 text-sm">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-sm text-faint">No phone numbers found.</p>
              )}
              {result.emails?.length > 0 && (
                <p className="rounded-xl border border-line bg-ink px-3 py-2 text-sm">{result.emails.join(', ')}</p>
              )}
              {result.addresses?.length > 0 && (
                <p className="rounded-xl border border-line bg-ink px-3 py-2 text-sm text-muted-foreground">
                  {result.addresses.join(' · ')}
                </p>
              )}
            </div>

            {phone && !compliance && (
              <button type="button" onClick={checkCompliance} disabled={checking} className="btn-ghost !py-2.5 text-sm disabled:opacity-60">
                {checking ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                Check calling compliance for {phone}
              </button>
            )}

            {compliance && (
              <div className="space-y-2 rounded-xl border border-line bg-ink p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-faint">Calling compliance</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`chip ${compliance.dnc === true ? '!text-hot' : compliance.dnc === false ? 'chip-volt' : ''}`}>
                    {compliance.dnc === true ? 'DNC registered — do not call' : compliance.dnc === false ? 'Not on the DNC registry' : 'DNC status unavailable'}
                  </span>
                  <span className={`chip ${compliance.litigator === true ? '!text-hot' : compliance.litigator === false ? 'chip-volt' : ''}`}>
                    {compliance.litigator === true ? 'TCPA litigator' : compliance.litigator === false ? 'No litigator history' : 'Litigator status unavailable'}
                  </span>
                  {compliance.lineType && <span className="chip">{String(compliance.lineType)}</span>}
                  {compliance.carrier && <span className="chip">{String(compliance.carrier)}</span>}
                </div>
                {compliance.dnc === true && (
                  <p className="flex items-center gap-1.5 text-xs text-hot">
                    <ShieldAlert size={13} />
                    This number is on the Do Not Call registry — remove it from calling and SMS batches.
                  </p>
                )}
              </div>
            )}

            <details className="text-xs text-faint">
              <summary className="cursor-pointer select-none">Raw BatchData response</summary>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-ink p-3">
                {JSON.stringify(result.raw, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost !py-2.5 text-sm">
            {saved ? 'Done' : 'Close'}
          </button>
          {result && (
            <button type="button" onClick={save} disabled={saving || saved} className="btn-volt !py-2.5 text-sm disabled:opacity-60">
              {saving && <Loader2 size={15} className="animate-spin" />}
              {saved ? 'Saved to lead' : 'Save to lead'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}