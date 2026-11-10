import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Orbs from '@/components/site/Orbs';

export default function PageHero({ kicker, title, lead, primary, secondary, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Orbs />
      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{lead}</p>}
        {(primary || secondary) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {primary && (
              <Link to={primary.to} className="btn-volt">
                {primary.label}
                <ArrowRight size={16} />
              </Link>
            )}
            {secondary && secondary.to && (
              <Link to={secondary.to} className="btn-ghost">
                {secondary.label}
                <ArrowUpRight size={15} />
              </Link>
            )}
            {secondary && !secondary.to && (
              <a href={secondary.href || '#'} className="btn-ghost">
                {secondary.label}
                <ArrowUpRight size={15} />
              </a>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}