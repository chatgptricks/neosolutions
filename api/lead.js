import { put } from "@vercel/blob";

const EMAIL_TO = process.env.LEAD_EMAIL_TO || "hello@neosolutions.ai";
const EMAIL_FROM = process.env.LEAD_EMAIL_FROM || "Neo Solutions <hello@neosolutions.ai>";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CALENDAR_URL = "https://cal.com/neosolutions";

const MAX_FIELD_LENGTH = 1200;

const clampText = (value = "", maxLength = MAX_FIELD_LENGTH) =>
  String(value).replace(/\s+/g, " ").trim().slice(0, maxLength);

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseBody = (req) => {
  if (typeof req.body === "object" && req.body !== null) {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return Object.fromEntries(new URLSearchParams(req.body));
    }
  }

  return {};
};

const json = (res, statusCode, payload) => {
  res.status(statusCode).json(payload);
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildLeadRecord = (body, req) => {
  const lead = {
    name: clampText(body.name, 160),
    email: clampText(body.email, 240).toLowerCase(),
    company: clampText(body.company, 180),
    phone: clampText(body.phone, 120),
    leadVolume: clampText(body.lead_volume, 80),
    channel: clampText(body.channel, 120),
    automationGoal: clampText(body.automation_goal || body.message, 1600),
  };

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    source: "neosolutions.ai",
    calendarUrl: CALENDAR_URL,
    lead,
    request: {
      userAgent: clampText(req.headers["user-agent"], 500),
      referer: clampText(req.headers.referer, 500),
      ip:
        clampText(req.headers["x-forwarded-for"]?.split(",")[0], 120) ||
        clampText(req.socket?.remoteAddress, 120),
    },
  };
};

const buildEmail = (record) => {
  const rows = [
    ["Nombre", record.lead.name],
    ["Email", record.lead.email],
    ["Empresa", record.lead.company],
    ["Teléfono / WhatsApp", record.lead.phone],
    ["Volumen mensual de leads", record.lead.leadVolume],
    ["Canal principal", record.lead.channel],
    ["Qué debería automatizar Neo primero", record.lead.automationGoal],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e8edf7;color:#546174;font-weight:700;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8edf7;color:#111827;">${escapeHtml(value || "No indicado")}</td>
        </tr>
      `
    )
    .join("");

  const textRows = rows
    .map(([label, value]) => `${label}: ${value || "No indicado"}`)
    .join("\n");

  return {
    subject: `Nuevo lead de Neo Solutions: ${record.lead.name || record.lead.email}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#111827;">
        <h1 style="margin:0 0 8px;font-size:24px;">Nuevo lead de Neo Solutions</h1>
        <p style="margin:0 0 18px;color:#546174;">Recibido el ${escapeHtml(record.createdAt)}</p>
        <table style="width:100%;max-width:680px;border-collapse:collapse;border:1px solid #e8edf7;border-radius:12px;overflow:hidden;">
          ${tableRows}
        </table>
        <p style="margin:18px 0 0;">
          <a href="${CALENDAR_URL}" style="color:#183ee0;font-weight:700;">Ver calendario de Neo</a>
        </p>
      </div>
    `,
    text: `Nuevo lead de Neo Solutions\nRecibido: ${record.createdAt}\n\n${textRows}\n\nCalendario: ${CALENDAR_URL}`,
  };
};

const saveLead = async (record) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { saved: false, reason: "BLOB_READ_WRITE_TOKEN is not configured" };
  }

  try {
    const date = record.createdAt.slice(0, 10);
    const pathname = `leads/${date}/${record.createdAt.replace(/[:.]/g, "-")}-${record.id}.json`;

    const blob = await put(pathname, JSON.stringify(record, null, 2), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    });

    return { saved: true, url: blob.url, pathname };
  } catch (error) {
    console.error("Lead storage failed:", error);
    return { saved: false, reason: "Lead storage failed" };
  }
};

const sendLeadEmail = async (record) => {
  if (!RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY is not configured" };
  }

  const email = buildEmail(record);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [EMAIL_TO],
      reply_to: record.lead.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend failed with ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return { sent: true, id: data.id };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, message: "Method not allowed" });
  }

  try {
    const body = parseBody(req);

    if (clampText(body.website) || clampText(body._gotcha)) {
      return json(res, 200, { ok: true, message: "Thanks." });
    }

    const record = buildLeadRecord(body, req);

    if (!record.lead.name || !isValidEmail(record.lead.email)) {
      return json(res, 400, {
        ok: false,
        message: "Please include a valid name and business email.",
      });
    }

    const [storage, email] = await Promise.all([saveLead(record), sendLeadEmail(record)]);

    if (!email.sent) {
      return json(res, 200, {
        ok: true,
        message: "Lead received locally (Email service pending configuration).",
        storage,
        email,
      });
    }

    return json(res, 200, {
      ok: true,
      message: "Lead received.",
      storage,
      email,
      next: CALENDAR_URL,
    });
  } catch (error) {
    console.error(error);
    return json(res, 500, {
      ok: false,
      message: "Something went wrong. Please try again or email hello@neosolutions.ai.",
    });
  }
}
