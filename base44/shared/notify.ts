export async function notifyAdmins(base44: any, variables: Record<string, string>) {
  const users = await base44.asServiceRole.entities.User.list();
  const admins = (users || []).filter((user: any) => user && user.role === "admin" && user.email);
  if (!admins.length) return { sent: 0 };

  const results = await Promise.allSettled(
    admins.slice(0, 5).map((admin: any) =>
      base44.asServiceRole.integrations.Core.SendEmail({
        to: admin.email,
        template_name: "LeadNotification",
        variables: {
          ...variables,
          first_name: (admin.full_name || "there").split(" ")[0],
        },
      })
    )
  );

  return { sent: results.filter((result: any) => result.status === "fulfilled").length };
}

export function appUrlFrom(req: Request, fallback: string): string {
  const fromHeader = req.headers.get("X-Base44-App-Url");
  if (fromHeader && fromHeader.startsWith("http")) return fromHeader.replace(/\/$/, "");
  return fallback;
}

export function clean(value: unknown, max = 400): string {
  if (value === null || value === undefined) return "";
  return String(value).trim().slice(0, max);
}