import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Orbs from '@/components/site/Orbs';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Orbs />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <span className="kicker">Demore Technology Solutions · Mentor, Ohio · Nationwide</span>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold tracking-[-0.035em] sm:text-6xl lg:text-7xl">
          Websites. Bots. Growth. <span className="text-volt">Custom AI platforms.</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Demore Technology Solutions designs custom websites, builds AI bots, grows your digital presence, and creates
          AI-assisted platforms that connect marketing with everyday business. Start with one service or bring them
          together in a complete system.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to="/contact" className="btn-volt">
            Tell us what you want to build
            <ArrowRight size={16} />
          </Link>
          <Link to="/platform" className="btn-ghost">
            See how the platform works
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link to="/compare" className="inline-flex items-center gap-2 text-volt">
            <Sparkles size={16} />
            Ask Demore AI: improve my website
          </Link>
          <Link
            to="/lead-generation"
            className="text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Preview a campaign
          </Link>
        </div>
      </div>
    </section>
  );
}