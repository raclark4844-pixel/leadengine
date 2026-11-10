import { Outlet } from 'react-router-dom';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import AskDemore from '@/components/assistant/AskDemore';

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <AskDemore />
    </div>
  );
}