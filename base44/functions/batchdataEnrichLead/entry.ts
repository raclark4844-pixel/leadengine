import { createClientFromRequest } from "npm:@base44/sdk@0.8.54";
import { adminGuard, batchDataPost, collectContacts } from "../../shared/batchdata.ts";

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const denied = await adminGuard(base44);
    if (denied) return denied;

    const payload = await req.json().catch(() => ({}));
    const fullName = String(payload.full_name || "").trim();
    const address = String(payload.address || "").trim();
    const city = String(payload.city || "").trim();
    const phone = String(payload.phone || "").trim();
    const email = String(payload.email || "").trim();

    if (!phone && !email && !address && !city) {
      return Response.json(
        { error: "This lead needs a phone, email, or address before BatchData can look for contacts." },
        { status: 400 }
      );
    }

    let data = null;
    let mode = "";
    if (phone || email) {
      mode = "reverse";
      const request = phone ? { phone } : { email };
      data = await batchDataPost("/property/reverse-skip-trace", { requests: [request] });
    } else {
      mode = "property";
      let street = address;
      let cityPart = city;
      let statePart = "";
      if (address.includes(",")) {
        const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
        if (parts.length >= 2) {
          street = parts[0];
          cityPart = parts[1];
          if (parts.length >= 3) {
            statePart = parts[2].split(/\s+/)[0];
          }
        }
      }
      if (cityPart.includes(",")) {
        const [cityName, stateName] = cityPart.split(",").map((part) => part.trim());
        if (!address.includes(",") || street === address) cityPart = cityName;
        statePart = statePart || stateName;
      }
      const propertyAddress = { street: street || cityPart, city: cityPart, state: statePart };
      data = await batchDataPost("/property/skip-trace", {
        requests: [{ propertyAddress }],
      });
    }

    const contacts = collectContacts(data);
    return Response.json({
      mode,
      phones: contacts.phones,
      emails: contacts.emails,
      names: contacts.names,
      addresses: contacts.addresses,
      raw: data,
      summary:
        "BatchData " +
        (mode === "reverse" ? "reverse skip trace" : "skip trace") +
        ": " +
        contacts.phones.length +
        " phone(s), " +
        contacts.emails.length +
        " email(s) found.",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}