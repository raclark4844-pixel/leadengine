import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Sparkles } from 'lucide-react';
import ReviewResults from '@/components/tools/ReviewResults';

const EMPTY = { url: '', target_city: '', full_name: '', email: '', phone: '', company: '' };

export default function WebsiteReviewTool({ mode = 'review' }) {
  const isComparison = mode === 'comparison';
  const [form, setForm] = useState(EMPTY);
  const [competitors, setCompetitors] = useState(['', '', '']);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    if (!form.url.trim()) return setError('Add the website you want reviewed.');
    if (!form.email.trim() && !form.phone.trim()) return setError('Add an email or phone so the report can be sent to Ryan.');
    setStatus('running');
    setError('');
    setResult(null);
    try {
      const response = await base44.functions.invoke('websiteReview', {
        mode,
        ...form,
        competitors: isComparison ? competitors.filter((value) => value.trim()) : [],
      });
      setResult(response.data);
      setStatus('done');
    } catch (err) {
      setError(err?.response?.data?.error || 'We could not read that website. Check the address and try again.');
      setStatus('error');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <form onSubmit={submit} className="panel p-6 sm:p-7">
        <label className="block text-sm font-medium">
          Your website
          <input
            value={form.url}
            onChange={set('url')}
            placeholder="yourbusiness.com"
            className="mt-2 h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Target city or region <span className="text-faint">(optional)</span>
          <input
            value={form.target_city}
            onChange={set('target_city')}
            placeholder="Mentor, Ohio"
            className="mt-2 h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt"
          />
        </label>

        {isComparison && (
          <div className="mt-4">
            <span className="text-sm font-medium">Competitors to compare <span className="text-faint">(optional)</span></span>
            <div className="mt-2 space-y-2">
              {competitors.map((value, index) => (
                <input
                  key={index}
                  value={value}
                  onChange={(event) =>
                    setCompetitors((prev) => prev.map((item, i) => (i === index ? event.target.value : item)))
                  }
                  placeholder={`Competitor ${index + 1} website`}
                  className="h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-line pt-5">
          <p className="text-sm text-muted-foreground">
            Your report and contact details are sent to Ryan at Demore Technology Solutions so he can follow up.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={form.full_name} onChange={set('full_name')} placeholder="Full name" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
            <input value={form.company} onChange={set('company')} placeholder="Company name" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
            <input value={form.email} onChange={set('email')} type="email" placeholder="Email" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
            <input value={form.phone} onChange={set('phone')} placeholder="Phone" className="h-11 rounded-xl border border-line bg-ink px-3 text-sm outline-none focus:border-volt" />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-hot">{error}</p>}

        <button type="submit" disabled={status === 'running'} className="btn-volt mt-5 w-full justify-center disabled:opacity-60">
          {status === 'running' ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {status === 'running'
            ? 'Reading the site and writing the report'
            : isComparison
              ? 'Compare my website'
              : 'Create my improvement report'}
        </button>
        <p className="mt-3 text-xs text-faint">
          Reports review public website signals. Recommendations are opportunities to verify and discuss. Chat messages are
          not printed in your PDF.
        </p>
      </form>

      {result ? (
        <ReviewResults result={result} />
      ) : (
        <div className="panel p-6 sm:p-7">
          <span className="kicker">What the report covers</span>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              'Design and mobile structure signals pulled from your live page',
              'Search and AI-answer readiness: metadata, headings, schema, structure',
              'Conversion path: forms, actions, click-to-call, and clear next steps',
              isComparison
                ? 'How your public pages compare with the competitors you name'
                : 'Local and trust signals a visitor looks for before inquiring',
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-volt" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-faint">
            The review reads what is publicly visible. It does not measure live traffic, rankings, AI citations, or revenue,
            and nothing is guaranteed.
          </p>
        </div>
      )}
    </div>
  );
}