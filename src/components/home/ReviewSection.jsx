import Section from '@/components/site/Section';
import WebsiteReviewTool from '@/components/tools/WebsiteReviewTool';

export default function ReviewSection() {
  return (
    <Section
      kicker="Your website, with a next step"
      title="See how Demore could improve your website."
      lead="Add your website below for a downloadable PDF with practical recommendations for design, search visibility, measurement, and customer inquiries. Then ask Demore to help you understand the findings."
    >
      <WebsiteReviewTool mode="review" />
    </Section>
  );
}