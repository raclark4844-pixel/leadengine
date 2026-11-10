import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { clean } from '../../shared/notify.ts';

const KNOWLEDGE = [
  'Demore Technology Solutions is based in Mentor, Lake County, Ohio, and serves clients nationwide with work delivered remotely. Email: ryan@demoretechnologysolutions.com. Phone is unpublished.',
  'Services: custom websites, landing pages, and ecommerce; AI-assisted digital marketing and lead-generation systems; SEO, GEO, AEO, CRO, technical performance, and UX; Google Analytics, Search Console, and conversion tracking; social publishing and content automation; Google Business Profile and review workflows; lead routing, CRM handoffs, custom bots, and business automation; custom dashboards, portals, and business platforms.',
  'Industries served: contractors and service companies, ecommerce stores, professional practices, restaurants, pubs, pizza shops, other hospitality businesses, landscaping and outdoor-service companies.',
  'The Demore Lead Engine is a private campaign workspace for customers, campaigns, lead review, conversations, qualified handoffs, and campaign costs. Public visitors can preview example campaigns; creating campaigns requires an authorized login.',
  'The free website review tool reads public website signals and returns plain-language findings plus a downloadable PDF. It does not measure live traffic or revenue.',
  'The studio does not invent revenue, testimonials, logos, traffic, lead, ranking, or conversion numbers, and does not guarantee rankings, AI citations, traffic, or leads.',
  'The next step for a visitor is usually the project brief at /contact or an email to Ryan.',
].join('\n');

export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    const history = incoming
      .map((message: any) => `${message?.role === 'user' ? 'Visitor' : 'Ask Demore'}: ${clean(message?.content, 1200)}`)
      .filter((line: string) => line.length > 12)
      .join('\n')
      .slice(-4000);

    if (!history) return Response.json({ error: 'Ask a question to get started.' }, { status: 400 });

    const page = clean(body.page, 120);
    const prompt = [
      'You are "Ask Demore", the assistant on the Demore Technology Solutions website. You help business owners understand what Demore could build or improve for them.',
      'Style: warm, plain English, practical, no jargon dumps. Default to 2 to 5 short sentences or a tight bulleted list. Never promise specific results, rankings, traffic, or lead counts. If a question needs a real audit or pricing, say what the next step is and point to the project brief.',
      'Use only the business facts below. If something is unknown, say you are not sure and suggest asking Ryan directly.',
      'Website content the visitor can use: /websites (website design and ecommerce), /growth (SEO, GEO, AEO, CRO, analytics), /automation (bots, content, business automation), /platform (the complete AI-assisted growth system), /lead-generation (the Lead Engine), /industries, /compare (free website comparison), /contact (project brief).',
      '',
      '=== Business facts ===',
      KNOWLEDGE,
      page ? `\nThe visitor is currently on ${page}.` : '',
      '',
      '=== Conversation so far ===',
      history,
      '',
      'Reply as Ask Demore in under 120 words.',
    ]
      .filter(Boolean)
      .join('\n');

    const base44 = createClientFromRequest(req);
    const reply = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt });

    return Response.json({ reply: typeof reply === 'string' ? reply : String(reply || '') });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'The assistant is unavailable right now.' },
      { status: 500 }
    );
  }
}