import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2 } from 'lucide-react';

const EMPTY = { full_name: '', email: '', phone: '', company: '', message: '' };

export default function FollowUpRequestForm({ campaignName = '', campaignId = '', compact = false }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    if (!form.full_name.trim()) return setError('Please add your name.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Add an email or phone so Ryan can follow up.');
    setStatus('running');
    setError('');
    try {
      await base44.functions.invoke('submitLead', {
        ...form,
        request_type: 'campaign_followup',
        campaign_name: campaignName,
        campaign_id: campaignId,
        need: campaignName ? `Follow-up requested on: ${campaignName}` : 'Lead-generation follow-up request',
        source_page: 'lead generation preview',
      });
      setStatus('done');
      setForm(EMPTY);
    } catch (err) {
      setError(err?.response?.data?.error || 'That did not send. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="panel p-6">
        <CheckCircle2 className="text-volt" />
        <h3 className="mt-4 font-display text-lg font-bold">Request sent to Ryan.</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your details were saved to the lead engine and Ryan will follow up. This does not create a campaign or draft.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-5 !py-2 text-sm">
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="panel p-6">
      <span className="kicker">Follow-up request</span>
      <h3 className="mt-3 font-display text-lg font-bold">
        {campaignName ? `Ask about ${campaignName}` : 'Ask Ryan to follow up'}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Your request is emailed to ryan@demoretechnologysolutions.com and saved in the lead engine.
      </p>

      <div className={`mt-5 grid gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <input value={form.full_name} onChange={set('full_name')} placeholder="Full name" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
        <input value={form.company} onChange={set('company')} placeholder="Company" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
        <input value={form.email} onChange={set('email')} placeholder="Email" type="email" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
        <input value={form.phone} onChange={set('phone')} placeholder="Phone" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
      </div>
      <textarea
        value={form.message}
        onChange={set('message')}
        placeholder="What would you like Ryan to look at?"
        rows={3}
        className="mt-3 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
      />

      {error && <p className="mt-3 text-sm text-hot">{error}</p>}

      <button type="submit" disabled={status === 'running'} className="btn-volt mt-5 w-full justify-center disabled:opacity-60">
        {status === 'running' ? <Loader2 size={16} className="animate-spin" /> : null}
        {status === 'running' ? 'Sending' : 'Request a follow-up'}
      </button>
      <p className="mt-3 text-xs text-faint">
        Need the full intake instead? <Link to="/contact" className="text-volt underline underline-offset-4">File a project brief</Link>
      </p>
    </form>
  );
}