import { Link } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Section from '@/components/site/Section';
import { OFFERS } from '@/lib/site';

const ACCENT = {
  volt: 'text-volt',
  hot: 'text-hot',
  flare: 'text-flare',
};

export default function OfferGrid() {
  return (
    <Section
      kicker="Demore services"
      title="Choose the service. Shape the system."
      lead="Website design, bots, growth, and AI platforms each have their own purpose. Explore them individually, then connect the parts that fit your goals."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {OFFERS.map((offer) => (
          <article key={offer.title} className="panel group flex flex-col p-6 transition-colors hover:border-faint sm:p-8">
            <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${ACCENT[offer.accent]}`}>
              {offer.kicker}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold">{offer.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{offer.body}</p>
            <ul className="mt-5 space-y-2.5">
              {offer.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5 text-sm text-muted-foreground">
                  <Check size={16} className={`mt-0.5 shrink-0 ${ACCENT[offer.accent]}`} />
                  {bullet}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-foreground/80">{offer.closing}</p>
            <Link
              to={offer.to}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-volt"
            >
              Explore
              <ArrowUpRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}