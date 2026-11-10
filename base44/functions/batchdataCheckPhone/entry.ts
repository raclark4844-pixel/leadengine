import { createClientFromRequest } from "npm:@base44/sdk@0.8.54";
import { adminGuard, batchDataPost, findValue } from "../../shared/batchdata.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await adminGuard(base44);
    if (denied) return denied;

    const payload = await req.json().catch(() => ({}));
    const phone = String(payload.phone || "").trim();
    if (phone.replace(/\D/g, "").length < 10) {
      return Response.json({ error: "Provide a valid 10-digit phone number to check." }, { status: 400 });
    }

    const [verification, dnc, tcpa] = await Promise.allSettled([
      batchDataPost("/phone/verification", { requests: [phone] }),
      batchDataPost("/phone/dnc", { requests: [phone] }),
      batchDataPost("/phone/tcpa", { requests: [phone] }),
    ]);

    const value = (settled) =>
      settled.status === "fulfilled" ? settled.value : { error: settled.reason?.message || "Lookup failed" };

    const verificationData = value(verification);
    const dncData = value(dnc);
    const tcpaData = value(tcpa);

    const phoneEntry = verificationData?.results?.phoneNumbers?.[0];
    if (phoneEntry?.error) {
      return Response.json({ error: String(phoneEntry.error) }, { status: 400 });
    }

    return Response.json({
      phone,
      lineType: findValue(verificationData, /line.?type|phone.?type|^type$/i),
      carrier: findValue(verificationData, /carrier/i),
      dnc: findValue(dncData, /dnc|do.?not.?call/i),
      litigator: findValue(tcpaData, /litig/i),
      verification: verificationData,
      dncResult: dncData,
      tcpaResult: tcpaData,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}