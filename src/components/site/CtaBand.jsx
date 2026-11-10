import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';

export default function CtaBand({
  kicker = 'Next step',
  title = 'Tell us what you want to build.',
  lead = 'Send a project brief and we will review the offer, audience, conversion path, and the growth systems that fit your business.',
  primary = { to: '/contact', label: 'Start a project' },
  secondary = { to: '/compare', label: 'Run a free comparison' },
}) {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <span className="kicker">{kicker}</span>
        <h2 className="mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{lead}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to={primary.to} className="btn-volt">
            {primary.label}
            <ArrowRight size={16} />
          </Link>
          <Link to={secondary.to} className="btn-ghost">
            {secondary.label}
          </Link>
        </div>
        <p className="mt-6 text-sm text-faint">
          Prefer email? <a className="text-volt underline underline-offset-4" href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>
      </div>
    </section>
  );
}