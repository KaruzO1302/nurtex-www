// =============================================================================
// NURTEX — LEAD ENDPOINT: FORMULARZ WYCENY (główny, na homepage #wycena)
// Stack: Vercel Serverless Function + Resend + Supabase
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://wentylacja-nurtex-klimatyzacja.pl',
  'https://www.wentylacja-nurtex-klimatyzacja.pl',
  'https://nurtex-www.vercel.app',
  'http://localhost:4174',
  'http://127.0.0.1:4174'
];

const DEFAULT_TO = 'kontakt@nurtex.pl';
const SUPABASE_TABLE = 'leads_wycena';

function setCors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  return {};
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim() || req.headers['x-real-ip'] || null;
}

function renderInternalEmail(data) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111;padding:24px;max-width:680px;margin:0 auto;background:#f6f7f9">
      <div style="background:#fff;border:1px solid #e3e5ea;border-radius:14px;padding:28px">
        <p style="letter-spacing:2px;color:#e8503a;font-size:11px;text-transform:uppercase;margin:0 0 16px;font-weight:700">NURTEX · Nowy lead</p>
        <h1 style="font-size:22px;margin:0 0 6px;color:#0a0c10">Wycena: ${escapeHtml(data.service)} · ${escapeHtml(data.name)}</h1>
        <p style="color:#666;font-size:13px;margin:0 0 22px">Wpłynęło z formularza /#wycena na <strong>${escapeHtml(data.url || 'wentylacja-nurtex-klimatyzacja.pl')}</strong></p>
        
        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee;width:35%">Imię i nazwisko</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Telefon</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="tel:${escapeHtml(data.phone || '')}" style="color:#e8503a;text-decoration:none;font-weight:700">${escapeHtml(data.phone || 'brak')}</a></td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${escapeHtml(data.email)}" style="color:#e8503a;text-decoration:none">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Typ obiektu</td><td style="padding:10px 0;border-bottom:1px solid #eee">${escapeHtml(data.type || 'brak')}</td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Metraż</td><td style="padding:10px 0;border-bottom:1px solid #eee">${escapeHtml(data.area || 'brak')}</td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Usługa</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${escapeHtml(data.service || 'brak')}</td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Lokalizacja</td><td style="padding:10px 0;border-bottom:1px solid #eee">${escapeHtml(data.district || 'brak')}</td></tr>
        </table>

        ${data.message ? `
          <div style="margin-top:20px;padding:18px;background:#f8f9fb;border-left:3px solid #e8503a;border-radius:6px">
            <p style="margin:0 0 6px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Wiadomość klienta</p>
            <p style="margin:0;color:#0a0c10;line-height:1.6;white-space:pre-wrap">${escapeHtml(data.message)}</p>
          </div>
        ` : ''}

        <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
          <a href="tel:${escapeHtml(data.phone || '')}" style="display:inline-block;background:#e8503a;color:#fff;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">📞 Zadzwoń teraz</a>
          <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#f3f4f7;color:#0a0c10;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">✉️ Odpisz</a>
          <a href="https://wa.me/${escapeHtml((data.phone || '').replace(/[^\d]/g, ''))}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">💬 WhatsApp</a>
        </div>

        <p style="margin-top:24px;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:14px">
          IP: ${escapeHtml(getClientIp({headers:{}}) || 'n/a')} · UA: ${escapeHtml((data._meta?.userAgent || '').substring(0, 100))}
        </p>
      </div>
    </div>
  `;
}

function renderClientEmail(data) {
  return `
    <div style="font-family:Arial,sans-serif;background:#07080b;color:#f7f7f8;padding:32px">
      <div style="max-width:680px;margin:0 auto;background:#111217;border:1px solid #2b2d36;border-radius:18px;padding:28px">
        <p style="letter-spacing:4px;color:#e8503a;font-size:12px;text-transform:uppercase;margin:0 0 16px">NURTEX · Wrocław</p>
        <h1 style="font-size:30px;line-height:1.15;margin:0 0 16px">Dziękujemy, ${escapeHtml(data.name.split(' ')[0])}!</h1>
        <p style="color:#b7bac6;font-size:16px;line-height:1.6;margin:0 0 18px">
          Otrzymaliśmy Twoje zapytanie o <strong style="color:#fff">${escapeHtml(data.service)}</strong>. 
          Zadzwonimy w ciągu <strong style="color:#e8503a">24 godzin</strong> (zwykle szybciej) i umówimy bezpłatną wizję lokalną.
        </p>
        <p style="color:#b7bac6;font-size:15px;line-height:1.6;margin:0 0 24px">
          Ostateczna cena ustalana jest po wizji — dopiero wtedy oceniamy metraż, trasę instalacji, materiały i specyfikę obiektu.
        </p>

        <div style="background:#16181f;border-radius:14px;padding:20px;margin:24px 0">
          <p style="margin:0;color:#8f93a3;font-size:12px;text-transform:uppercase;letter-spacing:2px">Twoje zgłoszenie</p>
          <p style="margin:8px 0 4px;color:#fff;font-size:15px"><strong>Usługa:</strong> ${escapeHtml(data.service)}</p>
          <p style="margin:0 0 4px;color:#fff;font-size:15px"><strong>Lokalizacja:</strong> ${escapeHtml(data.district || 'Wrocław/okolice')}</p>
          <p style="margin:0;color:#fff;font-size:15px"><strong>Metraż:</strong> ${escapeHtml(data.area || 'do ustalenia')}</p>
        </div>

        <p style="color:#b7bac6;line-height:1.6;margin:18px 0 24px;font-size:14px">
          Pilne? Zadzwoń lub napisz na WhatsApp — odpowiadamy szybciej.
        </p>

        <p style="margin:0">
          <a href="tel:+48662070695" style="display:inline-block;background:#e8503a;color:#fff;text-decoration:none;border-radius:999px;padding:13px 22px;font-weight:700;margin:0 8px 8px 0">📞 662 070 695</a>
          <a href="https://wa.me/48662070695" style="display:inline-block;background:#25D366;color:#07120a;text-decoration:none;border-radius:999px;padding:13px 22px;font-weight:700">💬 WhatsApp</a>
        </p>

        <hr style="border:none;border-top:1px solid #2b2d36;margin:24px 0">
        <p style="color:#666;font-size:12px;line-height:1.5;margin:0">
          NURTEX Wiktor Zięba · ul. Smardzowska 83B, 52-234 Wrocław · NIP 899-281-81-26<br>
          <a href="https://wentylacja-nurtex-klimatyzacja.pl" style="color:#8f93a3;text-decoration:none">wentylacja-nurtex-klimatyzacja.pl</a>
        </p>
      </div>
    </div>
  `;
}

async function sendResendEmail({ apiKey, from, to, replyTo, subject, html }) {
  const body = { from, to, subject, html };
  if (replyTo) body.reply_to = replyTo;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();
  let parsed = {};
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch (error) {
    parsed = { message: text };
  }
  if (!response.ok) {
    const message = parsed?.message || text || `Resend error ${response.status}`;
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }
  return parsed;
}

function buildSupabaseTableUrl(supabaseUrl, table) {
  const baseUrl = String(supabaseUrl || '').trim().replace(/\/+$/, '');
  if (baseUrl.endsWith('/rest/v1')) {
    return `${baseUrl}/${table}`;
  }
  return `${baseUrl}/rest/v1/${table}`;
}

async function saveToSupabase(data, req, emailStatus) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      saved: false,
      id: null,
      error: 'Brak konfiguracji SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY w Vercel.'
    };
  }

  const row = {
    name: data.name,
    phone: data.phone || null,
    email: data.email,
    type: data.type || null,
    area: data.area || null,
    service: data.service || null,
    district: data.district || null,
    message: data.message || null,
    source_url: data.url || null,
    user_agent: req.headers['user-agent'] || null,
    ip_address: getClientIp(req),
    email_sent_to_client: Boolean(emailStatus.clientSent),
    email_sent_to_nurtex: Boolean(emailStatus.internalSent),
    email_error: emailStatus.errors.length ? emailStatus.errors.join('; ') : null
  };

  try {
    const headers = {
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };
    if (!serviceRoleKey.startsWith('sb_secret_')) {
      headers.Authorization = `Bearer ${serviceRoleKey}`;
    }

    const response = await fetch(buildSupabaseTableUrl(supabaseUrl, SUPABASE_TABLE), {
      method: 'POST',
      headers,
      body: JSON.stringify(row)
    });

    const text = await response.text();
    let parsed = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch (error) {
      parsed = text;
    }

    if (!response.ok) {
      const message = parsed?.message || text || `Supabase error ${response.status}`;
      return { saved: false, id: null, error: message };
    }

    const inserted = Array.isArray(parsed) ? parsed[0] : parsed;
    return { saved: true, id: inserted?.id || null, error: null };
  } catch (error) {
    return { saved: false, id: null, error: error.message };
  }
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || DEFAULT_TO;
  const internalTo = process.env.TO_EMAIL || DEFAULT_TO;

  let data;
  try {
    data = parseBody(req);
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Nieprawidłowy JSON.' });
  }

  // === HONEYPOT — bot wypełni 'website', człowiek nie ===
  if (data.website && String(data.website).trim() !== '') {
    // Cicho ignorujemy bota, ale zwracamy 200 żeby nie alarmować
    return res.status(200).json({ success: true, leadId: null, message: 'OK' });
  }

  // === Walidacja ===
  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  const email = String(data.email || '').trim();

  if (!name) {
    return res.status(400).json({ success: false, error: 'Podaj imię i nazwisko.' });
  }

  if (!phone && !email) {
    return res.status(400).json({ success: false, error: 'Podaj telefon lub e-mail.' });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Nieprawidłowy adres e-mail.' });
  }

  const payload = {
    ...data,
    name,
    phone,
    email,
    _meta: { userAgent: req.headers['user-agent'] }
  };
  const subject = `🔥 Nowa wycena NURTEX: ${payload.service || 'Klimatyzacja'} — ${payload.name}${payload.district ? ' (' + payload.district + ')' : ''}`;

  let internalEmail = null;
  let internalEmailError = null;
  let clientEmail = null;
  let clientEmailError = null;

  if (apiKey) {
    // 1. Email do NURTEX (priorytetowy — TO MUSI ZADZIAŁAĆ)
    try {
      internalEmail = await sendResendEmail({
        apiKey,
        from,
        to: internalTo,
        replyTo: email || undefined,
        subject,
        html: renderInternalEmail(payload)
      });
    } catch (error) {
      internalEmailError = error.message;
    }

    // 2. Email do klienta (auto-reply) — opcjonalny
    if (email) {
      try {
        clientEmail = await sendResendEmail({
          apiKey,
          from,
          to: email,
          replyTo: internalTo,
          subject: 'Otrzymaliśmy Twoje zapytanie · NURTEX Wrocław',
          html: renderClientEmail(payload)
        });
      } catch (error) {
        clientEmailError = error.message;
      }
    }
  } else {
    internalEmailError = 'Brak konfiguracji RESEND_API_KEY w Vercel.';
    clientEmailError = 'Brak konfiguracji RESEND_API_KEY w Vercel.';
  }

  // 3. Zapis do Supabase (CRM-ready)
  const emailStatus = {
    internalSent: Boolean(internalEmail),
    clientSent: Boolean(clientEmail),
    errors: [...new Set([internalEmailError, clientEmailError].filter(Boolean))]
  };
  const supabaseLead = await saveToSupabase(payload, req, emailStatus);
  const leadCaptured = Boolean(internalEmail) || supabaseLead.saved;

  if (!leadCaptured) {
    return res.status(503).json({
      success: false,
      error: 'Lead nie został zapisany. Sprawdź konfigurację Resend/Supabase w Vercel.',
      leadId: null,
      supabaseSaved: false,
      supabaseError: supabaseLead.error,
      internalEmailSent: false,
      internalEmailError,
      clientEmailSent: false,
      clientEmailError
    });
  }

  return res.status(200).json({
    success: true,
    leadId: supabaseLead.id,
    supabaseSaved: supabaseLead.saved,
    supabaseError: supabaseLead.error,
    internalEmailSent: Boolean(internalEmail),
    internalEmailId: internalEmail?.id || null,
    clientEmailSent: Boolean(clientEmail),
    clientEmailId: clientEmail?.id || null,
    clientEmailError
  });
};
