import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import BrandMark from '@/components/site/BrandMark';
import { NAV } from '@/lib/site';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" aria-label="Demore Technology Solutions home">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-3 py-2 text-sm transition-colors ${
                isActive(item.to) ? 'bg-elevated text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/workspace" className="text-sm text-muted-foreground hover:text-foreground">
            Team sign in
          </Link>
          <Link to="/contact" className="btn-volt !px-4 !py-2 text-sm">
            Start a project
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line p-2 text-foreground lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3 sm:px-8" aria-label="Mobile">
            {NAV.concat([{ to: '/process', label: 'Process' }]).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`border-b border-line/70 py-3 text-[15px] ${
                  isActive(item.to) ? 'text-volt' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/workspace" onClick={() => setOpen(false)} className="py-3 text-[15px] text-muted-foreground">
              Team sign in
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-volt my-4 justify-center">
              Start a project
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}