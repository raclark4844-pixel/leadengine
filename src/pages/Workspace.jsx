import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, LogOut } from 'lucide-react';
import BrandMark from '@/components/site/BrandMark';
import OverviewPanel from '@/components/workspace/OverviewPanel';
import LeadsPanel from '@/components/workspace/LeadsPanel';
import CampaignsPanel from '@/components/workspace/CampaignsPanel';
import InboxPanel from '@/components/workspace/InboxPanel';
import CustomersPanel from '@/components/workspace/CustomersPanel';
import ReviewsPanel from '@/components/workspace/ReviewsPanel';
import SourcingPanel from '@/components/workspace/SourcingPanel';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'inbox', label: 'Inbox' },
  { key: 'leads', label: 'Leads & follow-up' },
  { key: 'sourcing', label: 'Lead sourcing' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'customers', label: 'Customers' },
  { key: 'reviews', label: 'Website reviews' },
];

export default function Workspace() {
  const [tab, setTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) => active && setUser(me))
      .catch(() => active && setUser(null))
      .finally(() => active && setChecked(true));
    return () => {
      active = false;
    };
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-dvh bg-ink">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <BrandMark />
            <span className="hidden rounded-full border border-volt/40 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-volt sm:inline">
              Lead engine
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-faint sm:inline">{user?.email}</span>
            <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={15} />
              Site
            </Link>
            <button
              type="button"
              onClick={() => base44.auth.logout('/')}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {!checked ? (
          <div className="panel p-8 text-sm text-muted-foreground">Loading the workspace…</div>
        ) : !isAdmin ? (
          <div className="panel p-8">
            <h1 className="font-display text-xl font-bold">This workspace is limited to administrators.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Leads contain customer contact details, so access is restricted to the administrator role. Ask Ryan to grant
              admin access from App Users, then sign in again.
            </p>
            <Link to="/" className="btn-ghost mt-6 !py-2.5 text-sm">Back to the site</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="kicker">Authorized workspace</span>
                <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">Demore Lead Engine</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  Customers, campaigns, lead review, follow-up, and website reviews in one place.
                </p>
              </div>
            </div>

            <nav className="mt-7 flex flex-wrap gap-2 border-b border-line pb-4">
              {TABS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    tab === item.key ? 'border-volt text-volt' : 'border-line text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-7">
              {tab === 'overview' && <OverviewPanel onNavigate={setTab} />}
              {tab === 'inbox' && <InboxPanel />}
              {tab === 'leads' && <LeadsPanel />}
              {tab === 'sourcing' && <SourcingPanel />}
              {tab === 'campaigns' && <CampaignsPanel />}
              {tab === 'customers' && <CustomersPanel />}
              {tab === 'reviews' && <ReviewsPanel />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}