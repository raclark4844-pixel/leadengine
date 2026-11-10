import { createClientFromRequest } from "npm:@base44/sdk@0.8.54";
import { adminGuard, batchDataPost, collectContacts } from "../../shared/batchdata.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await adminGuard(base44);
    if (denied) return denied;

    const payload = await req.json().catch(() => ({}));
    const city = String(payload.city || "").trim();
    const state = String(payload.state || "").trim();
    const limit = Math.min(Math.max(Number(payload.limit) || 10, 1), 25);

    if (!city || !state) {
      return Response.json({ error: "Enter both a city and a state to search." }, { status: 400 });
    }

    const data = await batchDataPost("/property/search", {
      searchCriteria: { query: city + ", " + state },
      datasets: ["basic"],
      options: { take: limit, skip: 0 },
    });

    const results =
      data?.results?.properties ??
      data?.results?.result ??
      data?.response?.results?.result ??
      data?.response?.results ??
      (Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []);
    const items = results.slice(0, limit).map((record) => {
      const contacts = collectContacts(record);
      return {
        name: record?.owner?.fullName || record?.owner?.name?.full || contacts.names[0] || "",
        phones: contacts.phones,
        emails: contacts.emails,
        addresses: contacts.addresses,
        raw: record,
      };
    });

    return Response.json({
      totalCount: data?.results?.totalCount ?? data?.meta?.results?.totalCount ?? data?.totalCount ?? items.length,
      items,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}