-- =============================================================================
-- NURTEX — TABELA LEADS Z FORMULARZA WYCENY (główny formularz na homepage)
-- Endpoint: /api/lead-wycena
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.leads_wycena (
  id              BIGSERIAL PRIMARY KEY,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Dane kontaktowe
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT NOT NULL,
  
  -- Szczegóły zapytania
  type            TEXT,                       -- typ obiektu: mieszkanie/dom/biuro/komercja
  area            TEXT,                       -- metraż: do50, 50-100, 100-200, 200+
  service         TEXT,                       -- wybrana usługa
  district        TEXT,                       -- dzielnica / miasto
  message         TEXT,                       -- opis dodatkowy
  
  -- Metadane techniczne
  source_url      TEXT,                       -- z jakiego URL przyszedł lead
  user_agent      TEXT,                       -- przeglądarka klienta
  ip_address      TEXT,                       -- IP klienta
  
  -- Status wysłania emaili
  email_sent_to_client   BOOLEAN DEFAULT false,
  email_sent_to_nurtex   BOOLEAN DEFAULT false,
  email_error            TEXT,
  
  -- CRM / Workflow
  status          TEXT DEFAULT 'new',          -- new, contacted, scheduled, won, lost
  notes           TEXT,
  contacted_at    TIMESTAMPTZ,
  won_at          TIMESTAMPTZ
);

-- Indexy pod typowe zapytania CRM
CREATE INDEX IF NOT EXISTS idx_leads_wycena_created_at ON public.leads_wycena (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_wycena_status ON public.leads_wycena (status) WHERE status != 'won' AND status != 'lost';
CREATE INDEX IF NOT EXISTS idx_leads_wycena_email ON public.leads_wycena (email);
CREATE INDEX IF NOT EXISTS idx_leads_wycena_phone ON public.leads_wycena (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_wycena_service ON public.leads_wycena (service);

-- RLS — tabela tylko dla service_role (API endpoint używa service key)
ALTER TABLE public.leads_wycena ENABLE ROW LEVEL SECURITY;

-- Komentarz
COMMENT ON TABLE public.leads_wycena IS 'Leady z głównego formularza wyceny NURTEX (/#wycena). Endpoint: /api/lead-wycena';
