# NURTEX — Resend + Supabase Lead Backup

## Vercel Environment Variables

Add these in Vercel Project Settings → Environment Variables for Production, Preview and Development:

```txt
RESEND_API_KEY=...
FROM_EMAIL=kontakt@nurtex.pl
TO_EMAIL=kontakt@nurtex.pl
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

Never commit these values to Git.

## Resend

1. Add `nurtex.pl` in Resend Domains.
2. Add Resend DNS records in Cloudflare as DNS only.
3. Verify the domain in Resend.
4. Create a sending-only API key for `nurtex.pl`.
5. Add `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` to Vercel.
6. Redeploy the project.

## Supabase

1. Create or choose a Supabase project for NURTEX leads.
2. Run `supabase/migrations/20260518063000_create_leads_kalkulator.sql` in Supabase SQL Editor.
3. Copy Project URL to `SUPABASE_URL`.
4. Copy a server-only secret key (`sb_secret_...`) or legacy service role key to `SUPABASE_SERVICE_ROLE_KEY`.
5. Redeploy the project.

## Smoke Test

Use a real email you control:

```bash
curl -X POST https://wentylacja-nurtex-klimatyzacja.pl/api/lead-kalkulator \
  -H "Content-Type: application/json" \
  -d '{
    "email":"twoj-email@example.com",
    "telefon":"662070695",
    "consent":true,
    "poziom":"podwyzszony",
    "staryKociol":"wegiel",
    "inwestycja":"pompaPowEff",
    "wynikDotacja":35200,
    "wynikKoszt":45000,
    "wynikKosztPoDotacji":9800,
    "url":"https://wentylacja-nurtex-klimatyzacja.pl/kalkulator-czyste-powietrze"
  }'
```

Expected after full setup:

```json
{
  "success": true,
  "leadId": "...",
  "supabaseSaved": true,
  "internalEmailSent": true,
  "clientEmailSent": true
}
```

If Resend is not configured but Supabase is configured, the API can still save the lead and return `clientEmailSent: false`.
