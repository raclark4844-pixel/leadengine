import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqList({ items }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.q} value={item.q} className="border-line">
          <AccordionTrigger className="text-left font-display text-base font-bold hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}