import { Link } from 'react-router-dom';
import BrandMark from '@/components/site/BrandMark';
import { NAV, OFFERS, SITE } from '@/lib/site';

export default function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A connected growth system — website, bots, search visibility, lead capture, analytics, and automation working
              as one.
            </p>
            <p className="mt-5 text-sm text-muted-foreground">
              <a className="text-volt underline underline-offset-4" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
            </p>
            <p className="mt-2 text-sm text-faint">{SITE.cityLine}</p>
            <p className="text-sm text-faint">{SITE.areaLine}</p>
          </div>

          <div>
            <span className="kicker">Services</span>
            <ul className="mt-4 space-y-2.5 text-sm">
              {OFFERS.map((offer) => (
                <li key={offer.title}>
                  <Link to={offer.to} className="text-muted-foreground transition-colors hover:text-foreground">
                    {offer.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="kicker">Explore</span>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.concat([
                { to: '/industries', label: 'Industries' },
                { to: '/process', label: 'Process' },
                { to: '/workspace', label: 'Team sign in' },
                { to: '/contact', label: 'Project brief' },
              ])
                .filter((item, i, all) => all.findIndex((x) => x.to === item.to && x.label === item.label) === i)
                .map((item) => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. {SITE.cityLine}.</p>
          <p className="max-w-xl">No invented revenue, borrowed logos, fake testimonials, or fabricated traffic and lead numbers.</p>
        </div>
      </div>
    </footer>
  );
}