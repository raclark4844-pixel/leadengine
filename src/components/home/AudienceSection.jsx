import { Link } from 'react-router-dom';
import Section from '@/components/site/Section';
import { AUDIENCES, SITE } from '@/lib/site';

export default function AudienceSection() {
  return (
    <Section
      kicker="Who it is for"
      title="Who is Demore Technology Solutions for?"
      lead="Growing companies that need a connected digital growth system instead of disconnected tactics."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <div key={audience.title} className="panel p-6">
            <h3 className="font-display text-lg font-bold">{audience.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{audience.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <Link to="/industries" className="text-volt underline underline-offset-4">
          See how the workflow fits your industry
        </Link>
        <span>{SITE.disclaimer}</span>
      </div>
    </Section>
  );
}