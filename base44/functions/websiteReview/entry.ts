import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { fetchSignals, signalsToText } from '../../shared/siteSignals.ts';
import { appUrlFrom, clean, notifyAdmins } from '../../shared/notify.ts';

const APP_FALLBACK_URL = 'https://roaring-data-sync-link.base44.app';

const SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    summary: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: { type: 'string' },
          status: { type: 'string' },
          detail: { type: 'string' },
        },
        required: ['label', 'status', 'detail'],
      },
    },
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          area: { type: 'string' },
          title: { type: 'string' },
          detail: { type: 'string' },
        },
        required: ['area', 'title', 'detail'],
      },
    },
    competitors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          note: { type: 'string' },
        },
        required: ['name', 'note'],
      },
    },
  },
  required: ['score', 'summary', 'findings', 'recommendations'],
};

export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode === 'comparison' ? 'comparison' : 'review';
    const rawUrl = clean(body.url, 300);
    if (!rawUrl) return Response.json({ error: 'Enter your website address.' }, { status: 400 });

    const competitors = Array.isArray(body.competitors)
      ? body.competitors.map((value: unknown) => clean(value, 300)).filter(Boolean).slice(0, 3)
      : [];

    const signals = await fetchSignals(rawUrl);
    const competitorBlocks: string[] = [];
    for (const competitor of competitors) {
      try {
        const competitorSignals = await fetchSignals(competitor);
        competitorBlocks.push(signalsToText(competitorSignals));
      } catch (error) {
        competitorBlocks.push(`Competitor "${competitor}" could not be read.`);
      }
    }

    const base44 = createClientFromRequest(req);
    const cityLine = clean(body.target_city, 160);
    const prompt = [
      'You are the Demore Technology Solutions website reviewer. Demore builds websites, search and AI-answer visibility (SEO, GEO, AEO), conversion improvements (CRO), analytics, lead capture, and automation.',
      `Write a plain, nontechnical review a business owner can act on. ${
        mode === 'comparison' ? 'This is a comparison against named competitors.' : ''
      }`,
      cityLine ? `The business serves: ${cityLine}.` : '',
      'Rules: use only the signals below plus what you can verify from public information. Never invent traffic, rankings, revenue, citations, or lead numbers. When something cannot be verified, label the status "review" and say it is worth confirming.',
      'Findings: give 5 to 8 items with status exactly one of "detected" (working signal), "missing" (not found in the page source), or "review" (needs a human check). Keep each detail to one or two sentences.',
      'Recommendations: give 4 to 6 items, each with a short area (for example "Conversion path", "Search visibility", "Local proof", "Measurement"), a title, and a specific detail.',
      'Score: a 0 to 100 readiness score for turning visitors into inquiries, explained in the summary. Be fair, not flattering.',
      mode === 'comparison'
        ? 'Competitors: for each named competitor, add one honest note about what their public pages show. If you cannot verify something, say so instead of guessing.'
        : '',
      '',
      '=== Website signals ===',
      signalsToText(signals),
      competitorBlocks.length ? '\n=== Competitor signals ===\n' + competitorBlocks.join('\n\n') : '',
    ]
      .filter(Boolean)
      .join('\n');

    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: SCHEMA,
      model: mode === 'comparison' ? 'gemini_3_8_flash' : undefined,
      add_context_from_internet: mode === 'comparison',
    });

    const result = {
      url: signals.url,
      kind: mode,
      target_city: cityLine,
      full_name: clean(body.full_name, 120),
      email: clean(body.email, 160),
      phone: clean(body.phone, 40),
      company: clean(body.company, 160),
      competitors,
      score: Number(analysis?.score) || 0,
      summary: clean(analysis?.summary, 1500),
      findings: Array.isArray(analysis?.findings) ? analysis.findings.slice(0, 10) : [],
      recommendations: Array.isArray(analysis?.recommendations) ? analysis.recommendations.slice(0, 8) : [],
      competitor_notes: Array.isArray(analysis?.competitors) ? analysis.competitors.slice(0, 4) : [],
      status: 'completed',
    };

    const review = await base44.entities.WebsiteReview.create(result);

    if (result.email || result.phone) {
      try {
        await base44.entities.Lead.create({
          full_name: result.full_name || 'Website review request',
          email: result.email,
          phone: result.phone,
          company: result.company,
          website: result.url,
          request_type: mode === 'comparison' ? 'comparison' : 'website_review',
          need: mode === 'comparison' ? 'Compared their site against competitors' : 'Requested a website improvement review',
          message: result.summary,
          target_city: result.target_city,
          source_page: 'website review tool',
          review_id: review?.id || '',
          status: 'new',
        });
      } catch (error) {
        // The review is saved even if the lead record cannot be written.
      }
    }

    if (result.email || result.phone) {
      try {
        await notifyAdmins(base44, {
          lead_name: result.full_name || 'Website review request',
          lead_company: result.company || 'Not provided',
          lead_email: result.email || 'Not provided',
          lead_phone: result.phone || 'Not provided',
          lead_interest: mode === 'comparison' ? 'Site comparison' : 'Website improvement review',
          lead_website: result.url,
          lead_location: result.target_city || 'Not provided',
          lead_timeline: 'Not provided',
          lead_message: `${result.summary} (Readiness score: ${result.score}/100)`,
          request_label: mode === 'comparison' ? 'comparison request' : 'website review request',
          source_page: `${mode} tool`,
          submitted_at: new Date().toUTCString(),
          workspace_url: `${appUrlFrom(req, APP_FALLBACK_URL)}/workspace`,
        });
      } catch (error) {
        // Notification is best effort; the review and lead are already stored.
      }
    }

    return Response.json({ review_id: review?.id || null, ...result });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'We could not read that website. Check the address and try again.' },
      { status: 500 }
    );
  }
}