// =============================================================================
// NURTEX — LEAD ENDPOINT: FORMULARZ WYCENY
// Stack: Vercel Serverless + Resend (TYLKO MAIL — bez bazy danych)
// Endpoint: POST /api/lead-wycena
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://nurtex.pl',
  'https://www.nurtex.pl',
  'https://wentylacja-nurtex-klimatyzacja.pl',
  'https://www.wentylacja-nurtex-klimatyzacja.pl',
  'https://nurtex-www.vercel.app',
  'http://localhost:4174',
  'http://127.0.0.1:4174'
];

const DEFAULT_TO = 'kontakt@nurtex.pl';

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
    .trim() || req.headers['x-real-ip'] || 'n/a';
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

function renderInternalEmail(data, req) {
  const ip = getClientIp(req);
  const ua = req.headers['user-agent'] || 'n/a';
  return `
    <div style="font-family:Arial,sans-serif;color:#111;padding:24px;max-width:680px;margin:0 auto;background:#f6f7f9">
      <div style="background:#fff;border:1px solid #e3e5ea;border-radius:14px;padding:28px">
        <p style="letter-spacing:2px;color:#e8503a;font-size:11px;text-transform:uppercase;margin:0 0 16px;font-weight:700">NURTEX · Nowy lead z formularza</p>
        <h1 style="font-size:22px;margin:0 0 6px;color:#0a0c10">Wycena: ${escapeHtml(data.service || 'Klimatyzacja')} · ${escapeHtml(data.name)}</h1>
        <p style="color:#666;font-size:13px;margin:0 0 22px">Wpłynęło z formularza /#wycena na <strong>${escapeHtml(data.url || 'wentylacja-nurtex-klimatyzacja.pl')}</strong></p>

        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee;width:35%">Imię i nazwisko</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">Telefon</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="tel:${escapeHtml(data.phone || '')}" style="color:#e8503a;text-decoration:none;font-weight:700">${escapeHtml(data.phone || 'brak')}</a></td></tr>
          <tr><td style="padding:10px 0;color:#666;border-bottom:1px solid #eee">E-mail</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${escapeHtml(data.email || '')}" style="color:#e8503a;text-decoration:none">${escapeHtml(data.email || 'brak')}</a></td></tr>
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
          ${data.phone ? `<a href="tel:${escapeHtml(data.phone)}" style="display:inline-block;background:#e8503a;color:#fff;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">📞 Zadzwoń teraz</a>` : ''}
          ${data.email ? `<a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#f3f4f7;color:#0a0c10;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">✉️ Odpisz</a>` : ''}
          ${data.phone ? `<a href="https://wa.me/${escapeHtml(data.phone.replace(/[^\d]/g, ''))}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;border-radius:999px;padding:11px 18px;font-weight:700;font-size:13px">💬 WhatsApp</a>` : ''}
        </div>

        <p style="margin-top:24px;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:14px">
          IP: ${escapeHtml(ip)} · UA: ${escapeHtml(ua.substring(0, 100))}<br>
          ${new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}
        </p>
      </div>
    </div>
  `;
}

function renderClientEmail(data) {
  const firstName = String(data.name || '').split(' ')[0] || 'Kliencie';
  return `
    <div style="font-family:Arial,sans-serif;background:#07080b;color:#f7f7f8;padding:32px">
      <div style="max-width:680px;margin:0 auto;background:#111217;border:1px solid #2b2d36;border-radius:18px;padding:28px">
        <p style="letter-spacing:4px;color:#e8503a;font-size:12px;text-transform:uppercase;margin:0 0 16px">NURTEX · Wrocław</p>
        <h1 style="font-size:30px;line-height:1.15;margin:0 0 16px">Dziękujemy, ${escapeHtml(firstName)}!</h1>
        <p style="color:#b7bac6;font-size:16px;line-height:1.6;margin:0 0 18px">
          Otrzymaliśmy Twoje zapytanie o <strong style="color:#fff">${escapeHtml(data.service || 'usługę')}</strong>.
          Zadzwonimy w ciągu <strong style="color:#e8503a">24 godzin</strong> (zwykle szybciej) i umówimy bezpłatną wizję lokalną.
        </p>
        <p style="color:#b7bac6;font-size:15px;line-height:1.6;margin:0 0 24px">
          Ostateczna cena ustalana jest po wizji — dopiero wtedy oceniamy metraż, trasę instalacji, materiały i specyfikę obiektu.
        </p>

        <div style="background:#16181f;border-radius:14px;padding:20px;margin:24px 0">
          <p style="margin:0;color:#8f93a3;font-size:12px;text-transform:uppercase;letter-spacing:2px">Twoje zgłoszenie</p>
          <p style="margin:8px 0 4px;color:#fff;font-size:15px"><strong>Usługa:</strong> ${escapeHtml(data.service || '—')}</p>
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

// =============================================================================
// RESEND API
// =============================================================================

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

// =============================================================================
// HANDLER
// =============================================================================

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  let data;
  try {
    data = parseBody(req);
  } catch (error) {
    return res.status(400).json({ success: false, error: 'Nieprawidłowy JSON.' });
  }

  // === HONEYPOT — bot wypełni 'website', człowiek nie ===
  if (data.website && String(data.website).trim() !== '') {
    return res.status(200).json({ success: true, message: 'OK' });
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

  // === Konfiguracja Resend ===
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || DEFAULT_TO;
  const internalTo = process.env.TO_EMAIL || DEFAULT_TO;

  if (!apiKey) {
    console.error('[lead-wycena] BRAK RESEND_API_KEY w Vercel env!');
    return res.status(503).json({
      success: false,
      error: 'Konfiguracja serwera niekompletna. Zadzwoń bezpośrednio: 662 070 695'
    });
  }

  const payload = { ...data, name, phone, email };
  const subject = `🔥 Nowa wycena NURTEX: ${payload.service || 'Klimatyzacja'} — ${payload.name}${payload.district ? ' (' + payload.district + ')' : ''}`;

  // === 1. Email do NURTEX (priorytetowy — TO MUSI ZADZIAŁAĆ) ===
  let internalEmail = null;
  let internalEmailError = null;

  try {
    internalEmail = await sendResendEmail({
      apiKey,
      from,
      to: internalTo,
      replyTo: email || undefined,
      subject,
      html: renderInternalEmail(payload, req)
    });
  } catch (error) {
    internalEmailError = error.message;
    console.error('[lead-wycena] Email do NURTEX padł:', error.message);
  }

  // === 2. Auto-reply do klienta (opcjonalny — tylko jeśli podał email) ===
  let clientEmail = null;
  let clientEmailError = null;

  if (email && internalEmail) {
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
      console.error('[lead-wycena] Auto-reply do klienta padł:', error.message);
    }
  }

  // === Response ===
  if (!internalEmail) {
    return res.status(503).json({
      success: false,
      error: 'Nie udało się wysłać zgłoszenia. Zadzwoń: 662 070 695',
      detail: internalEmailError
    });
  }

  return res.status(200).json({
    success: true,
    leadId: internalEmail?.id || null,
    clientReplyId: clientEmail?.id || null,
    clientReplyError: clientEmailError
  });
};
