import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { INDUSTRIES } from '@/lib/industries';

const SERVICES = [
  'Website design or redesign',
  'Ecommerce store',
  'SEO / GEO / AEO visibility',
  'Conversion improvement (CRO)',
  'Analytics & conversion tracking',
  'Lead-generation system',
  'Bots & business automation',
  'Content & social workflows',
  'Custom platform or dashboard',
];

const BUDGETS = ['Not sure yet', 'Under $5k', '$5k – $15k', '$15k – $40k', '$40k+', 'Ongoing retainer'];
const TIMELINES = ['As soon as possible', 'This quarter', 'Next quarter', 'Just exploring'];

const EMPTY = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  website: '',
  industry: '',
  target_city: '',
  need: '',
  message: '',
  budget: BUDGETS[0],
  timeline: TIMELINES[0],
};

export default function ProjectBriefForm() {
  const [form, setForm] = useState(EMPTY);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function toggleService(service) {
    setServices((prev) => (prev.includes(service) ? prev.filter((item) => item !== service) : [...prev, service]));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.full_name.trim()) return setError('Please add your name.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Add an email or phone so we can reply.');
    if (!form.need.trim() && services.length === 0) return setError('Tell us what you want built, or pick at least one service.');
    setStatus('running');
    setError('');
    try {
      const message = [
        services.length ? `Services of interest: ${services.join(', ')}` : '',
        form.message ? `Notes: ${form.message}` : '',
      ]
        .filter(Boolean)
        .join('\n');
      await base44.functions.invoke('submitLead', {
        ...form,
        message,
        request_type: 'project_brief',
        need: form.need,
        source_page: 'project brief',
      });
      setStatus('done');
    } catch (err) {
      setError(err?.response?.data?.error || 'That did not send. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="panel p-7">
        <CheckCircle2 className="text-volt" />
        <h3 className="mt-4 font-display text-xl font-bold">Brief received.</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          Your brief is saved in the lead engine and emailed to Ryan. He reviews the offer, audience, conversion path, and
          current tools before recommending build priorities. This is a project brief, not a contract.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setServices([]);
            setStatus('idle');
          }}
          className="btn-ghost mt-6 !py-2.5 text-sm"
        >
          Send another brief
        </button>
      </div>
    );
  }

  const field = 'h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt';

  return (
    <form onSubmit={submit} className="panel p-6 sm:p-7">
      <span className="kicker">Step 1 · About you</span>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input value={form.full_name} onChange={set('full_name')} placeholder="Full name" className={field} />
        <input value={form.company} onChange={set('company')} placeholder="Company name" className={field} />
        <input value={form.email} onChange={set('email')} type="email" placeholder="Email" className={field} />
        <input value={form.phone} onChange={set('phone')} placeholder="Phone" className={field} />
        <input value={form.website} onChange={set('website')} placeholder="Current website" className={field} />
        <input value={form.target_city} onChange={set('target_city')} placeholder="City or service area" className={field} />
      </div>

      <span className="kicker mt-7 block">Step 2 · What you need</span>
      <div className="mt-4 flex flex-wrap gap-2">
        {SERVICES.map((service) => (
          <button
            key={service}
            type="button"
            onClick={() => toggleService(service)}
            className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
              services.includes(service) ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
            }`}
          >
            {service}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select value={form.industry} onChange={set('industry')} className={field}>
          <option value="">Industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry.slug} value={industry.name}>
              {industry.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        <select value={form.timeline} onChange={set('timeline')} className={field}>
          {TIMELINES.map((timeline) => (
            <option key={timeline} value={timeline}>
              {timeline}
            </option>
          ))}
        </select>
      </div>

      <span className="kicker mt-7 block">Step 3 · The outcome</span>
      <textarea
        value={form.need}
        onChange={set('need')}
        rows={3}
        placeholder="What needs to change? For example: more qualified estimate requests from our service area."
        className="mt-4 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
      />
      <select value={form.budget} onChange={set('budget')} className={`${field} mt-3`}>
        {BUDGETS.map((budget) => (
          <option key={budget} value={budget}>
            Budget: {budget}
          </option>
        ))}
      </select>
      <textarea
        value={form.message}
        onChange={set('message')}
        rows={3}
        placeholder="Current tools, what is working, what is broken, anything else worth knowing."
        className="mt-3 w-full rounded-xl border border-line bg-ink p-3 text-sm outline-none focus:border-volt"
      />

      {error && <p className="mt-4 text-sm text-hot">{error}</p>}

      <button type="submit" disabled={status === 'running'} className="btn-volt mt-5 w-full justify-center disabled:opacity-60">
        {status === 'running' && <Loader2 size={16} className="animate-spin" />}
        {status === 'running' ? 'Sending your brief' : 'Send the project brief'}
      </button>
      <p className="mt-3 text-xs text-faint">
        Submitting a brief does not create a contract or a campaign. Your details are stored in the lead engine and emailed
        to Ryan.
      </p>
    </form>
  );
}