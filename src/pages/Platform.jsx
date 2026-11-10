import OfferPage from '@/components/offers/OfferPage';
import Section from '@/components/site/Section';
import ComparisonTable from '@/components/site/ComparisonTable';

export default function Platform() {
  return (
    <OfferPage slug="platform">
      <Section
        kicker="Why the connection matters"
        title="A connected growth system, not a website surrounded by tools."
        lead="The website is the conversion hub. Search, content, campaigns, lead capture, measurement, and follow-up are designed around it as one system."
      >
        <ComparisonTable />
      </Section>
    </OfferPage>
  );
}