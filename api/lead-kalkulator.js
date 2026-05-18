const ALLOWED_ORIGINS = [
  'https://wentylacja-nurtex-klimatyzacja.pl',
  'https://www.wentylacja-nurtex-klimatyzacja.pl',
  'http://localhost:4174',
  'http://127.0.0.1:4174'
];

const DEFAULT_TO = 'kontakt@nurtex.pl';
const SUPABASE_TABLE = 'leads_kalkulator';

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

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('pl-PL').replace(/,/g, ' ')} zł`;
}

function investmentLabel(value) {
  const labels = {
    pompaPow: 'Pompa ciepła powietrze/woda',
    pompaPowEff: 'Pompa powietrzna podwyższonej efektywności',
    pompaGrunt: 'Pompa ciepła gruntowa',
    kompleks: 'Kompleksowa termomodernizacja',
    pv: 'Fotowoltaika'
  };
  return labels[value] || value || 'Nie podano';
}

function levelLabel(value) {
  const labels = {
    podstawowy: 'Poziom podstawowy',
    podwyzszony: 'Poziom podwyższony',
    najwyzszy: 'Poziom najwyższy'
  };
  return labels[value] || value || 'Nie podano';
}

function boilerLabel(value) {
  const labels = {
    wegiel: 'Kocioł węglowy',
    gaz: 'Kocioł gazowy',
    olej: 'Kocioł olejowy',
    brak: 'Brak starego źródła / inne'
  };
  return labels[value] || value || 'Nie podano';
}

function renderClientEmail(data) {
  return `
    <div style="font-family:Arial,sans-serif;background:#07080b;color:#f7f7f8;padding:32px">
      <div style="max-width:680px;margin:0 auto;background:#111217;border:1px solid #2b2d36;border-radius:18px;padding:28px">
        <p style="letter-spacing:4px;color:#e8503a;font-size:12px;text-transform:uppercase;margin:0 0 16px">NURTEX · Kalkulator Czyste Powietrze</p>
        <h1 style="font-size:30px;line-height:1.1;margin:0 0 16px">Twój wstępny wynik dotacji</h1>
        <p style="color:#b7bac6;font-size:16px;line-height:1.6">To orientacyjna kalkulacja na podstawie odpowiedzi z formularza. Finalną kwotę potwierdzimy po sprawdzeniu dokumentów i parametrów budynku.</p>
        <div style="background:#16181f;border-radius:16px;padding:22px;margin:24px 0">
          <p style="margin:0;color:#8f93a3;font-size:13px;text-transform:uppercase;letter-spacing:2px">Maksymalna dotacja</p>
          <p style="margin:6px 0 0;color:#e8503a;font-size:42px;font-weight:800">${formatMoney(data.wynikDotacja)}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;color:#f7f7f8">
          <tr><td style="padding:10px 0;color:#8f93a3">Poziom dotacji</td><td style="padding:10px 0;text-align:right">${escapeHtml(levelLabel(data.poziom))}</td></tr>
          <tr><td style="padding:10px 0;color:#8f93a3">Źródło ciepła</td><td style="padding:10px 0;text-align:right">${escapeHtml(boilerLabel(data.staryKociol))}</td></tr>
          <tr><td style="padding:10px 0;color:#8f93a3">Inwestycja</td><td style="padding:10px 0;text-align:right">${escapeHtml(investmentLabel(data.inwestycja))}</td></tr>
          <tr><td style="padding:10px 0;color:#8f93a3">Szacowany koszt</td><td style="padding:10px 0;text-align:right">${formatMoney(data.wynikKoszt)}</td></tr>
          <tr><td style="padding:10px 0;color:#8f93a3">Koszt po dotacji</td><td style="padding:10px 0;text-align:right">${formatMoney(data.wynikKosztPoDotacji)}</td></tr>
        </table>
        <p style="color:#b7bac6;line-height:1.6;margin-top:24px">Odezwiemy się w ciągu 24h i przygotujemy techniczną wycenę dla Twojego domu.</p>
        <p style="margin:24px 0 0">
          <a href="tel:+48662070695" style="display:inline-block;background:#e8503a;color:#fff;text-decoration:none;border-radius:999px;padding:13px 18px;font-weight:700">Zadzwoń: 662 070 695</a>
        </p>
      </div>
    </div>
  `;
}

function renderInternalEmail(data) {
  return `
    <div style="font-family:Arial,sans-serif;color:#111;padding:24px">
      <h1>Nowy lead z kalkulatora Czyste Powietrze</h1>
      <p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Telefon:</strong> ${escapeHtml(data.telefon || 'brak')}</p>
      <p><strong>Poziom:</strong> ${escapeHtml(levelLabel(data.poziom))}</p>
      <p><strong>Źródło:</strong> ${escapeHtml(boilerLabel(data.staryKociol))}</p>
      <p><strong>Inwestycja:</strong> ${escapeHtml(investmentLabel(data.inwestycja))}</p>
      <p><strong>Dotacja:</strong> ${formatMoney(data.wynikDotacja)}</p>
      <p><strong>Koszt:</strong> ${formatMoney(data.wynikKoszt)}</p>
      <p><strong>Koszt po dotacji:</strong> ${formatMoney(data.wynikKosztPoDotacji)}</p>
      <p><strong>URL:</strong> ${escapeHtml(data.url || '')}</p>
      <p>
        <a href="tel:${escapeHtml(data.telefon || '')}">Zadzwoń</a>
        ·
        <a href="mailto:${escapeHtml(data.email)}">Odpisz</a>
      </p>
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

function getClientIp(req) {
  return String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim() || req.headers['x-real-ip'] || null;
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
    email: data.email,
    telefon: data.telefon || null,
    poziom: data.poziom,
    stary_kociol: data.staryKociol || null,
    inwestycja: data.inwestycja,
    wynik_dotacja: Number(data.wynikDotacja || 0),
    wynik_koszt: Number(data.wynikKoszt || 0),
    wynik_koszt_po_dotacji: Number(data.wynikKosztPoDotacji || 0),
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

    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${SUPABASE_TABLE}`, {
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

  const email = String(data.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Nieprawidłowy adres e-mail.' });
  }

  if (!data.consent) {
    return res.status(400).json({ success: false, error: 'Brak zgody na kontakt.' });
  }

  const payload = { ...data, email };
  const subject = `Kalkulator Czyste Powietrze: ${email} · ${formatMoney(payload.wynikDotacja)}`;

  let internalEmail = null;
  let internalEmailError = null;
  let clientEmail = null;
  let clientEmailError = null;

  if (apiKey) {
    try {
      internalEmail = await sendResendEmail({
        apiKey,
        from,
        to: internalTo,
        replyTo: email,
        subject,
        html: renderInternalEmail(payload)
      });
    } catch (error) {
      internalEmailError = error.message;
    }

    try {
      clientEmail = await sendResendEmail({
        apiKey,
        from,
        to: email,
        replyTo: internalTo,
        subject: 'Twój wynik kalkulatora Czyste Powietrze · NURTEX',
        html: renderClientEmail(payload)
      });
    } catch (error) {
      clientEmailError = error.message;
    }
  } else {
    internalEmailError = 'Brak konfiguracji RESEND_API_KEY w Vercel.';
    clientEmailError = 'Brak konfiguracji RESEND_API_KEY w Vercel.';
  }

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
      error: 'Lead nie został zapisany ani wysłany. Brakuje konfiguracji Resend/Supabase lub wystąpił błąd integracji.',
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
