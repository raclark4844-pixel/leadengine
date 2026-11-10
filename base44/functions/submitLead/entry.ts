import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { appUrlFrom, clean, notifyAdmins } from '../../shared/notify.ts';

const APP_FALLBACK_URL = 'https://roaring-data-sync-link.base44.app';

const LABELS: Record<string, string> = {
  project_brief: 'project brief',
  contact: 'website request',
  campaign_followup: 'campaign follow-up request',
  website_review: 'website review request',
  comparison: 'comparison request',
};

export default async function (req: Request): Promise<Response> {
  try {
    const body = await req.json().catch(() => ({}));

    const lead = {
      full_name: clean(body.full_name, 120),
      email: clean(body.email, 160),
      phone: clean(body.phone, 40),
      company: clean(body.company, 160),
      website: clean(body.website, 300),
      industry: clean(body.industry, 120),
      request_type: LABELS[body.request_type] ? body.request_type : 'contact',
      need: clean(body.need, 300),
      message: clean(body.message, 4000),
      budget: clean(body.budget, 80),
      timeline: clean(body.timeline, 80),
      target_city: clean(body.target_city, 160),
      source_page: clean(body.source_page, 200),
      campaign_id: clean(body.campaign_id, 80),
      campaign_name: clean(body.campaign_name, 200),
      review_id: clean(body.review_id, 80),
      status: 'new',
    };

    if (!lead.full_name) return Response.json({ error: 'Please add your name.' }, { status: 400 });
    if (!lead.email && !lead.phone) {
      return Response.json({ error: 'Please add an email or phone number so we can reply.' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const created = await base44.entities.Lead.create(lead);

    let notified = 0;
    try {
      const result = await notifyAdmins(base44, {
        lead_name: lead.full_name,
        lead_company: lead.company || 'Not provided',
        lead_email: lead.email || 'Not provided',
        lead_phone: lead.phone || 'Not provided',
        lead_interest: lead.need || lead.industry || LABELS[lead.request_type],
        lead_website: lead.website || 'Not provided',
        lead_location: lead.target_city || 'Not provided',
        lead_timeline: lead.timeline || 'Not provided',
        lead_message: lead.message || 'No additional message.',
        request_label: LABELS[lead.request_type],
        source_page: lead.source_page || 'website',
        submitted_at: new Date().toUTCString(),
        workspace_url: `${appUrlFrom(req, APP_FALLBACK_URL)}/workspace`,
      });
      notified = result.sent;
    } catch (error) {
      notified = 0;
    }

    return Response.json({ ok: true, lead_id: created?.id || null, notified });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : 'Request failed' }, { status: 500 });
  }
}