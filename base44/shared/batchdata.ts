import { secrets } from "base44:runtime";

export const BATCHDATA_BASE = "https://api.batchdata.com/api/v1";

export function getBatchDataToken() {
  const token = secrets.get("DLG2");
  if (!token) {
    throw new Error("The BatchData API token is not configured. Add it as the DLG2 secret on the Secrets page.");
  }
  return token;
}

export async function adminGuard(base44Client) {
  const user = await base44Client.auth.me();
  if (!user) return Response.json({ error: "Sign in required." }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "Administrator access required." }, { status: 403 });
  return null;
}

export async function batchDataPost(path, body, timeoutMs = 25000) {
  const token = getBatchDataToken();
  const response = await fetch(BATCHDATA_BASE + path, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!response.ok) {
    if (response.status === 403 && /does not have permission/i.test(text)) {
      throw new Error(
        "Your BatchData token is missing permission for " +
          path +
          ". Edit the token in BatchData and enable that API, then try again."
      );
    }
    const detail =
      (data && (data.error?.detail || data.detail || data.message || data.title)) ||
      (text || "").slice(0, 300) ||
      String(response.status);
    throw new Error("BatchData " + path + " failed (" + response.status + "): " + detail);
  }
  return data;
}

export function collectContacts(node) {
  const acc = { phones: [], emails: [], names: [], addresses: [] };
  const seen = new Set();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const push = (list, value) => {
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(value);
    }
  };
  const walk = (value, depth) => {
    if (!value || depth > 7) return;
    if (Array.isArray(value)) {
      value.forEach((item) => walk(item, depth + 1));
      return;
    }
    if (typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      const lower = String(key).toLowerCase();
      if (typeof child === "string" && child.trim()) {
        const text = child.trim();
        if (emailRe.test(text)) {
          push(acc.emails, text);
        } else if (/phone|mobile|cell|tel/i.test(lower) && text.replace(/\D/g, "").length >= 10) {
          push(acc.phones, text);
        } else if (
          /name|owner|person|buyer/i.test(lower) &&
          !/subdivision|plat|street|legal|city|county|state|company|business/i.test(lower) &&
          text.length < 80 &&
          !/^\d+$/.test(text)
        ) {
          push(acc.names, text);
        } else if (/address|street|mailing/i.test(lower) && text.length > 5) {
          push(acc.addresses, text);
        }
      } else if (typeof child === "object" && child !== null) {
        if (/phone|mobile|cell|tel/i.test(lower)) {
          const items = Array.isArray(child) ? child : [child];
          items.forEach((item) => {
            const num = typeof item === "string" ? item : item && (item.number || item.phone);
            if (typeof num === "string" && num.replace(/\D/g, "").length >= 10) {
              push(acc.phones, num);
            } else if (typeof item === "object") {
              walk(item, depth + 1);
            }
          });
        } else if (/^(name|fullname|full_name|owner|person)$/i.test(lower) && (child.first || child.last)) {
          const full = child.full || [child.first, child.middle, child.last].filter(Boolean).join(" ");
          if (full) push(acc.names, full);
        } else {
          walk(child, depth + 1);
        }
      }
    }
  };
  walk(node, 0);
  return acc;
}

export function findValue(node, keyPattern, depth = 0) {
  if (!node || depth > 7) return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findValue(item, keyPattern, depth + 1);
      if (found !== null) return found;
    }
    return null;
  }
  if (typeof node !== "object") return null;
  for (const [key, child] of Object.entries(node)) {
    if (keyPattern.test(key) && (typeof child === "boolean" || typeof child === "string" || typeof child === "number")) {
      return child;
    }
    if (typeof child === "object" && child !== null) {
      const found = findValue(child, keyPattern, depth + 1);
      if (found !== null) return found;
    }
  }
  return null;
}