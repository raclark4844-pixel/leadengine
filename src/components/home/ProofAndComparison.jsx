import Section from '@/components/site/Section';
import ComparisonTable from '@/components/site/ComparisonTable';
import { PROOF } from '@/lib/site';

export default function ProofAndComparison() {
  return (
    <Section
      kicker="Proof, not slogans"
      title="What will this shop refuse to fake?"
      lead="No invented revenue. No borrowed logos. No fake testimonials. No fabricated traffic, lead, ranking, or conversion numbers."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {PROOF.map((point) => (
          <div key={point.kicker} className="panel p-6">
            <span className="kicker">{point.kicker}</span>
            <h3 className="mt-4 font-display text-lg font-bold">{point.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <h3 className="font-display text-xl font-bold sm:text-2xl">
          A connected growth system — not a website surrounded by disconnected tools.
        </h3>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
          The website is the conversion hub. Search, content, campaigns, lead capture, measurement, and follow-up are
          designed around it as one system.
        </p>

        <div className="mt-7">
          <ComparisonTable />
        </div>
      </div>
    </Section>
  );
}