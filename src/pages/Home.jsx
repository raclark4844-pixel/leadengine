import Hero from '@/components/home/Hero';
import OfferGrid from '@/components/home/OfferGrid';
import LeadEngineTeaser from '@/components/home/LeadEngineTeaser';
import ReviewSection from '@/components/home/ReviewSection';
import ProofAndComparison from '@/components/home/ProofAndComparison';
import AudienceSection from '@/components/home/AudienceSection';
import Section from '@/components/site/Section';
import FaqList from '@/components/site/FaqList';
import CtaBand from '@/components/site/CtaBand';
import { HOME_FAQS } from '@/lib/site';

export default function Home() {
  return (
    <>
      <Hero />
      <OfferGrid />
      <LeadEngineTeaser />
      <ReviewSection />
      <ProofAndComparison />
      <AudienceSection />
      <Section kicker="Questions" title="Answers before you start.">
        <div className="max-w-3xl">
          <FaqList items={HOME_FAQS} />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}