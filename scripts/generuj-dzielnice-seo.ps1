# NURTEX — generator podstron dzielnic (montaż, wymiana, serwis wentylacji)
$Root = Split-Path $PSScriptRoot -Parent

$CssBlock = @'
<link rel="stylesheet" href="/style.css" />
<style>
:root { --bg:#07080c; --bg-card:#0d1015; --border:rgba(255,255,255,0.08); --fg:#f7f8fb; --fg-dim:#9ca3af; --accent:#ff3b30; --maxw:1200px; }
* { box-sizing:border-box; margin:0; padding:0; }
body { background:var(--bg); color:var(--fg); font-family:'Geist','Inter',system-ui,sans-serif; line-height:1.6; -webkit-font-smoothing:antialiased; min-height:100vh; }
.container { max-width:var(--maxw); margin:0 auto; padding:0 32px; }
a { color:inherit; text-decoration:none; }
.dz-hero { padding:60px 0 40px; border-bottom:1px solid var(--border); }
.dz-breadcrumbs { font-family:'Geist Mono',monospace; font-size:14px; color:var(--fg-dim); letter-spacing:0.04em; margin-bottom:24px; line-height:1.5; }
.dz-breadcrumbs a { color:var(--fg-dim); transition:color .2s; }
.dz-breadcrumbs a:hover { color:var(--accent); }
.dz-breadcrumbs span { margin:0 8px; opacity:.5; }
.dz-hero h1 { font-size:clamp(36px,5vw,64px); font-weight:800; letter-spacing:-0.02em; line-height:1.05; margin-bottom:20px; }
.dz-hero h1 em { color:var(--accent); font-style:normal; }
.dz-hero p.lead { font-size:18px; color:var(--fg-dim); line-height:1.7; max-width:720px; margin-bottom:32px; }
.dz-hero-cta { display:flex; gap:16px; flex-wrap:wrap; }
.dz-btn { display:inline-flex; align-items:center; gap:8px; padding:14px 24px; border-radius:10px; font-family:'Geist Mono',monospace; font-size:14px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; transition:all .3s; }
.dz-btn-primary { background:var(--accent); color:#fff; border:1px solid var(--accent); }
.dz-btn-primary:hover { background:#b91c1c; }
.dz-btn-ghost { background:transparent; color:var(--fg); border:1px solid var(--border); }
.dz-btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
section { padding:60px 0; border-bottom:1px solid var(--border); }
.eyebrow { font-family:'Geist Mono',monospace; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; color:var(--accent); margin-bottom:16px; }
h2 { font-size:clamp(28px,4vw,44px); font-weight:800; letter-spacing:-0.02em; line-height:1.1; margin-bottom:16px; }
h2 em { color:var(--accent); font-style:normal; }
.section-lead { font-size:17px; color:var(--fg-dim); line-height:1.7; max-width:760px; margin-bottom:32px; }
.osiedla-grid { display:flex; flex-wrap:wrap; gap:10px; margin-top:24px; }
.osiedle-tag { padding:10px 18px; border-radius:100px; background:rgba(255,255,255,0.04); border:1px solid var(--border); font-family:'Geist Mono',monospace; font-size:13px; font-weight:600; letter-spacing:0.04em; }
.specyfika-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin-top:32px; }
.spec-card { padding:28px; background:var(--bg-card); border:1px solid var(--border); border-radius:16px; transition:all .3s; }
.spec-card:hover { border-color:rgba(220,38,38,0.4); transform:translateY(-2px); }
.spec-card h3 { font-size:18px; font-weight:700; margin-bottom:12px; }
.spec-card p { font-size:14px; color:var(--fg-dim); line-height:1.7; }
.spec-card p strong { color:var(--fg); }
.realizacje-box { padding:32px; background:linear-gradient(180deg,rgba(220,38,38,0.08) 0%,transparent 80%); border:1px solid rgba(220,38,38,0.25); border-radius:16px; margin-top:32px; }
.realizacje-box p { font-size:17px; line-height:1.7; }
.realizacje-box strong { color:var(--accent); font-weight:800; }
.dz-others { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; margin-top:24px; }
.dz-other-link { padding:16px 20px; border-radius:10px; background:rgba(255,255,255,0.04); border:1px solid var(--border); font-family:'Geist Mono',monospace; font-size:13px; font-weight:600; letter-spacing:0.04em; display:block; transition:all .25s; }
.dz-other-link:hover { background:rgba(220,38,38,0.08); border-color:var(--accent); color:var(--accent); transform:translateX(4px); }
.dz-other-link span { display:block; font-size:11px; color:var(--fg-dim); margin-top:4px; font-weight:400; }
.dz-cta { background:var(--bg-card); text-align:center; padding:60px 0; }
.dz-cta h2 { font-size:clamp(28px,4vw,40px); margin-bottom:16px; }
.dz-cta p { font-size:16px; color:var(--fg-dim); max-width:600px; margin:0 auto 28px; }
.dz-cta-row { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
.dz-footer { background:var(--bg); border-top:1px solid var(--border); padding:40px 0 20px; color:var(--fg-dim); font-size:14px; }
.dz-footer-grid { display:grid; grid-template-columns:2fr repeat(3,1fr); gap:32px; margin-bottom:32px; }
.dz-footer-brand h4 { font-size:16px; font-weight:700; color:var(--fg); margin-bottom:12px; }
.dz-footer-col h5 { font-family:'Geist Mono',monospace; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:16px; }
.dz-footer-col ul { list-style:none; display:grid; gap:8px; }
.dz-footer-col a:hover { color:var(--accent); }
.dz-footer-bottom { border-top:1px solid var(--border); padding-top:20px; margin-top:24px; display:flex; justify-content:space-between; font-family:'Geist Mono',monospace; font-size:12px; flex-wrap:wrap; gap:12px; }
.sticky-mobile { display:none; position:fixed; bottom:0; left:0; right:0; background:rgba(7,8,12,0.95); backdrop-filter:blur(10px); border-top:1px solid var(--border); padding:12px 16px; z-index:100; grid-template-columns:1.4fr 1fr 1fr; gap:8px; }
.sticky-mobile a { padding:14px 8px; border-radius:10px; text-align:center; font-family:'Geist Mono',monospace; font-size:13px; font-weight:800; color:#fff; min-height:56px; display:flex; align-items:center; justify-content:center; }
.sticky-mobile a.call { background:var(--accent); }
.sticky-mobile a.wa { background:#25D366; }
.sticky-mobile a.quote { background:rgba(255,255,255,0.08); border:1px solid var(--border); }
@media (max-width:768px) { .sticky-mobile { display:grid; } body { padding-bottom:80px; } .dz-footer-grid { grid-template-columns:1fr; } .container { padding:0 20px; } }
</style>
<link rel="stylesheet" href="/css/mobile-fix.css?v=2026-07-12" />
'@

$Locations = @(
  @{ slug='krzyki'; name='Krzyki'; label='Krzyki Wrocław'; kind='dzielnica'; geo='51.0613;17.0466'; osiedla=@('Borek','Klecina','Brochów','Tarnogaj','Wojszyce','Ołtaszyn'); leadMontaz='Krzyki to największa dzielnica — apartamentowce, kamienice i domy jednorodzinne. Montujemy split i multi split od 4 200 zł, F-gaz, gwarancja 5 lat.'; leadWymiana='Wymiana starej klimatyzacji na Krzykach — demontaż, nowy split lub multi split, próżnia R32, protokół F-gaz. Marki Daikin, Mitsubishi, Samsung.'; leadWent='Serwis wentylacji mechanicznej na Krzykach — przeglądy roczne art. 62, pomiary ciągu, protokoły dla wspólnot i ubezpieczyciela. Od 250 zł.'; realizacje='45+'; dojazd='10–25 min' }
  @{ slug='fabryczna'; name='Fabryczna'; label='Fabryczna Wrocław'; kind='dzielnica'; geo='51.0844;16.9658'; osiedla=@('Maślice','Stabłowice','Pilczyce','Kozanów','Leśnica','Nowy Dwór'); leadMontaz='Fabryczna — nowe osiedla i bloki z wielkiej płyty. Montaż klimatyzacji z agregatem na balkonie lub elewacji, wycena 24h.'; leadWymiana='Wymiana klimatyzacji na Fabrycznej — wymiana jednostek po 8–12 latach eksploatacji, modernizacja multi split w domach na Maślicach.'; leadWent='Serwis wentylacji mechanicznej Fabryczna — kontrola kanałów, central wentylacyjnych w nowym budownictwie, balansowanie nawiewów.'; realizacje='35+'; dojazd='15–30 min' }
  @{ slug='psie-pole'; name='Psie Pole'; label='Psie Pole Wrocław'; kind='dzielnica'; geo='51.1294;17.0619'; osiedla=@('Sołtysowice','Karłowice','Pawłowice','Widawa','Sępolno','Zakrzów'); leadMontaz='Psie Pole — domy jednorodzinne i mieszkania. Montaż multi split 2–4 strefy, ciche jednostki do sypialni, dojazd tego samego dnia.'; leadWymiana='Wymiana klimatyzacji Psie Pole — wymiana splitów w domach na Karłowicach, demontaż starego czynnika R410A, montaż R32.'; leadWent='Serwis wentylacji mechanicznej Psie Pole — przegląd wentylacji grawitacyjnej i mechanicznej w domach, rekuperatory, protokół PINB.'; realizacje='30+'; dojazd='15–25 min' }
  @{ slug='stare-miasto'; name='Stare Miasto'; label='Stare Miasto Wrocław'; kind='dzielnica'; geo='51.1069;17.0325'; osiedla=@('Rynek','Nadodrze','Ołbin','Szczepin','Kleczków'); leadMontaz='Stare Miasto — kamienice i lofty. Montaż z zgodą konserwatora, dyskretne koryta, agregat od podwórza gdy trzeba.'; leadWymiana='Wymiana klimatyzacji Stare Miasto — wymiana w hotelach, restauracjach i mieszkaniach w zabytkowych kamienicach bez naruszania elewacji.'; leadWent='Serwis wentylacji mechanicznej Stare Miasto — wentylacja gastronomii, biur w kamienicach, okresowe kontrole i czyszczenie kanałów NADCA.'; realizacje='25+'; dojazd='10–20 min' }
  @{ slug='srodmiescie'; name='Śródmieście'; label='Śródmieście Wrocław'; kind='dzielnica'; geo='51.1019;17.0581'; osiedla=@('Plac Grunwaldzki','Biskupin','Sępolno','Dąbie','Zacisze','Gaj'); leadMontaz='Śródmieście — apartamenty premium i biura. Montaż klimatyzacji ściennej i kanałowej, niski poziom hałasu, wycena w 24h.'; leadWymiana='Wymiana klimatyzacji Śródmieście — modernizacja systemów w biurowcach i mieszkaniach przy Politechnice, wymiana na inwertery A+++' ; leadWent='Serwis wentylacji mechanicznej Śródmieście — przeglądy instalacji w budynkach użyteczności publicznej, pomiary wydajności central.'; realizacje='20+'; dojazd='10–20 min' }
  @{ slug='siechnice'; name='Siechnice'; label='Siechnice'; kind='okolica'; geo='51.0300;17.1350'; osiedla=@('Siechnice centrum','Os. Słoneczne','Cieszków','Ozorzyce','Iwin','Żerniki Wrocławskie'); leadMontaz='Siechnice — 15 km od Wrocławia, nowe osiedla i domy. Montaż split i multi split dla mieszkań deweloperskich i domów jednorodzinnych od 4 200 zł.'; leadWymiana='Wymiana klimatyzacji Siechnice — wymiana urządzeń zamontowanych 3–5 lat temu przez dewelopera na nowe modele z grzaniem do -25°C.'; leadWent='Serwis wentylacji mechanicznej Siechnice — przeglądy rekuperacji w nowych domach, kontrola filtrów F7, protokoły dla inwestora.'; realizacje='18+'; dojazd='30 min' }
  @{ slug='olawa'; name='Oława'; label='Oława'; kind='okolica'; geo='50.9467;17.2926'; osiedla=@('Oława centrum','Zaodrze','Jelcz-Laskowice','Męcin','Bystrzyca'); leadMontaz='Oława — 30 km DK94. Montaż klimatyzacji w mieszkaniach, domach i firmach. Dojazd z Wrocławia w 35 min, wycena bezpłatna.'; leadWymiana='Wymiana klimatyzacji Oława — demontaż starego splitu, montaż nowego z certyfikatem F-gaz, utylizacja czynnika zgodnie z przepisami.'; leadWent='Serwis wentylacji mechanicznej Oława — okresowe przeglądy wentylacji w domach i lokalach usługowych, pomiar ciągu kominowego.'; realizacje='15+'; dojazd='35 min' }
  @{ slug='katy-wroclawskie'; name='Kąty Wrocławskie'; label='Kąty Wrocławskie'; kind='okolica'; geo='51.0239;16.7736'; osiedla=@('Kąty centrum','Bielany Wrocławskie','Smolec','Dobków','Bielany'); leadMontaz='Kąty Wrocławskie — domy jednorodzinne przy A4. Montaż multi split i pomp ciepła powietrznych, integracja z fotowoltaiką.'; leadWymiana='Wymiana klimatyzacji Kąty Wrocławskie — wymiana starych jednostek na energooszczędne inwertery, często łączymy z rekuperacją.'; leadWent='Serwis wentylacji mechanicznej Kąty Wrocławskie — przegląd wentylacji i rekuperacji w nowych osiedlach, wymiana filtrów HEPA.'; realizacje='12+'; dojazd='25 min' }
  @{ slug='kobierzyce'; name='Kobierzyce'; label='Kobierzyce'; kind='okolica'; geo='51.0200;16.9750'; osiedla=@('Kobierzyce','Bielany Wrocławskie','Księginice','Pełczyce','Chrząstawa Mała'); leadMontaz='Kobierzyce — luksusowe domy i osiedla premium. Montaż klimatyzacji Daikin, Mitsubishi — dyskretne jednostki, niski hałas.'; leadWymiana='Wymiana klimatyzacji Kobierzyce — upgrade systemów premium, wymiana na WindFree / Stylish, zachowanie istniejących tras miedzianych gdy możliwe.'; leadWent='Serwis wentylacji mechanicznej Kobierzyce — rekuperacja w domach pasywnych, balansowanie, przegląd roczny central 350 m³/h.'; realizacje='14+'; dojazd='20 min' }
  @{ slug='trzebnica'; name='Trzebnica'; label='Trzebnica'; kind='okolica'; geo='51.3106;17.0614'; osiedla=@('Trzebnica centrum','Michałów','Wszedni','Prusice','Żmigród'); leadMontaz='Trzebnica — 25 km na północ od Wrocławia. Montaż klimatyzacji w domach, firmach i urzędach. Dojazd 30 min, montaż w 1 dzień.'; leadWymiana='Wymiana klimatyzacji Trzebnica — wymiana splitów w domach jednorodzinnych, nowe urządzenia z funkcją grzania zimą.'; leadWent='Serwis wentylacji mechanicznej Trzebnica — przeglądy wentylacji mechanicznej i grawitacyjnej, protokoły dla ubezpieczycieli.'; realizacje='10+'; dojazd='30 min' }
)

function Get-Footer($ctaUrl, $ctaLabel) {
@"
<footer class="dz-footer">
  <div class="container">
    <div class="dz-footer-grid">
      <div class="dz-footer-brand"><h4>NURTEX — HVAC Wrocław</h4><p>Montaż i wymiana klimatyzacji · wentylacja mechaniczna · rekuperacja.<br>Wrocław i okolice do 30 km.</p></div>
      <div class="dz-footer-col"><h5>Usługi</h5><ul>
        <li><a href="/montaz-klimatyzacji-wroclaw">Montaż klimatyzacji</a></li>
        <li><a href="/wymiana-klimatyzacji-wroclaw">Wymiana klimatyzacji</a></li>
        <li><a href="/przeglad-wentylacji-wroclaw/">Serwis wentylacji</a></li>
        <li><a href="/wentylacja-mechaniczna-rekuperacja-wroclaw">Rekuperacja</a></li>
      </ul></div>
      <div class="dz-footer-col"><h5>Grupa</h5><ul>
        <li><a href="https://wuko-wroclaw.pl/" target="_blank" rel="noopener">WUKO Wrocław</a></li>
        <li><a href="https://ziebud-expert.pl/" target="_blank" rel="noopener">ZIĘBUD Expert</a></li>
      </ul></div>
      <div class="dz-footer-col"><h5>Kontakt</h5><ul>
        <li><a href="tel:+48662070695">662 070 695</a></li>
        <li><a href="mailto:kontakt@nurtex.pl">kontakt@nurtex.pl</a></li>
      </ul></div>
    </div>
    <div class="dz-footer-bottom"><span>© 2026 NURTEX</span><span>NIP 899-281-81-26</span></div>
  </div>
</footer>
<div class="sticky-mobile">
  <a href="tel:+48662070695" class="call">📞 662 070 695</a>
  <a href="https://wa.me/48662070695" class="wa">WhatsApp</a>
  <a href="$ctaUrl" class="quote">$ctaLabel</a>
</div>
<script src="/js/consent.js" defer></script>
"@
}

function Get-OsiedlaTags($osiedla) {
  ($osiedla | ForEach-Object { "<span class=`"osiedle-tag`">$_</span>" }) -join "`n      "
}

function Get-OtherLinks($service, $currentSlug) {
  $base = switch ($service) {
    'montaz' { '/montaz-klimatyzacji-wroclaw' }
    'wymiana' { '/wymiana-klimatyzacji-wroclaw' }
    'wentylacja' { '/przeglad-wentylacji-wroclaw' }
  }
  $links = $Locations | Where-Object { $_.slug -ne $currentSlug } | Select-Object -First 8
  ($links | ForEach-Object {
    $sub = if ($service -eq 'wentylacja') { "$base/$($_.slug)" } else { "$base/$($_.slug)" }
    "<a href=`"$sub`" class=`"dz-other-link`">$($_.name) <span>$($_.kind)</span></a>"
  }) -join "`n      "
}

function Write-DistrictPage($service, $loc) {
  $slug = $loc.slug
  $name = $loc.name
  $label = $loc.label
  $geo = $loc.geo
  $icbm = $geo -replace ';', ', '

  switch ($service) {
    'montaz' {
      $dir = Join-Path $Root "montaz-klimatyzacji-wroclaw\$slug"
      $url = "https://nurtex.pl/montaz-klimatyzacji-wroclaw/$slug"
      $parent = 'Montaż klimatyzacji Wrocław'
      $parentUrl = '/montaz-klimatyzacji-wroclaw'
      $title = "Montaż klimatyzacji $label — split i multi split | NURTEX"
      $desc = "Montaż klimatyzacji w $label. Split od 4 200 zł, multi split, F-gaz, gwarancja 5 lat. Wycena 24h. ☎ 662 070 695"
      $h1 = "Montaż klimatyzacji <em>$name</em>"
      if ($loc.kind -eq 'dzielnica') { $h1 += "<br/>— split i multi split" } else { $h1 += "<br/>— nowa instalacja od 4 200 zł" }
      $lead = $loc.leadMontaz
      $ctaPrimary = '/montaz-klimatyzacji-wroclaw#kalkulator'
      $ctaPrimaryText = 'Policz cenę w 10s →'
      $priceRange = '4200-35000 PLN'
      $bizName = "NURTEX — Montaż klimatyzacji $label"
      $faq1q = "Ile kosztuje montaż klimatyzacji w $name?"
      $faq1a = "Montaż split zaczyna się od 4 200 zł brutto z urządzeniem. Multi split w domu to typowo 12 000–22 000 zł. Dokładną wycenę podajemy w 24h po oględzinach lub zdjęciach."
      $realizacje = $loc.realizacje
      $sticky = 'Wycena'
      $stickyUrl = '/montaz-klimatyzacji-wroclaw#formularz'
    }
    'wymiana' {
      $dir = Join-Path $Root "wymiana-klimatyzacji-wroclaw\$slug"
      $url = "https://nurtex.pl/wymiana-klimatyzacji-wroclaw/$slug"
      $parent = 'Wymiana klimatyzacji Wrocław'
      $parentUrl = '/wymiana-klimatyzacji-wroclaw'
      $title = "Wymiana klimatyzacji $label — demontaż i montaż | NURTEX"
      $desc = "Wymiana starej klimatyzacji w $label. Demontaż, nowy split lub multi split, R32, F-gaz. Wycena 24h. ☎ 662 070 695"
      $h1 = "Wymiana klimatyzacji <em>$name</em><br/>— demontaż i nowa instalacja"
      $lead = $loc.leadWymiana
      $ctaPrimary = '/wymiana-klimatyzacji-wroclaw#wycena'
      $ctaPrimaryText = 'Wycena wymiany →'
      $priceRange = '3500-28000 PLN'
      $bizName = "NURTEX — Wymiana klimatyzacji $label"
      $faq1q = "Ile kosztuje wymiana klimatyzacji w $name?"
      $faq1a = "Wymiana splitu (demontaż starego + montaż nowego z urządzeniem) to zwykle 5 500–9 500 zł brutto. Gdy wykorzystujemy istniejącą trasę miedzianą — taniej. Wycena po wizji."
      $realizacje = $loc.realizacje
      $sticky = 'Wycena'
      $stickyUrl = '/wymiana-klimatyzacji-wroclaw#wycena'
    }
    'wentylacja' {
      $dir = Join-Path $Root "przeglad-wentylacji-wroclaw\$slug"
      $url = "https://nurtex.pl/przeglad-wentylacji-wroclaw/$slug"
      $parent = 'Serwis wentylacji mechanicznej Wrocław'
      $parentUrl = '/przeglad-wentylacji-wroclaw/'
      $title = "Serwis wentylacji mechanicznej $label — przegląd od 250 zł | NURTEX"
      $desc = "Serwis i przegląd wentylacji mechanicznej w $label. Art. 62 Prawa budowlanego, pomiary, protokoły. Od 250 zł. ☎ 662 070 695"
      $h1 = "Serwis wentylacji mechanicznej <em>$name</em><br/>— przegląd i pomiary od 250 zł"
      $lead = $loc.leadWent
      $ctaPrimary = '/przeglad-wentylacji-wroclaw/#wycena'
      $ctaPrimaryText = 'Umów przegląd →'
      $priceRange = '250-3500 PLN'
      $bizName = "NURTEX — Serwis wentylacji $label"
      $faq1q = "Ile kosztuje przegląd wentylacji w $name?"
      $faq1a = "Przegląd mieszkania lub domu od 250 zł brutto. Rekuperacja z pomiarami od 450 zł. Protokół dla PINB i ubezpieczyciela w cenie."
      $realizacje = $loc.realizacje
      $sticky = 'Przegląd'
      $stickyUrl = '/przeglad-wentylacji-wroclaw/#wycena'
    }
  }

  New-Item -ItemType Directory -Path $dir -Force | Out-Null
  $osiedlaTags = Get-OsiedlaTags $loc.osiedla
  $otherLinks = Get-OtherLinks $service $slug
  $footer = Get-Footer $stickyUrl $sticky
  $placename = if ($loc.kind -eq 'dzielnica') { 'Wrocław' } else { $name }

  $related = switch ($service) {
    'montaz' { @(
      '<a href="/wymiana-klimatyzacji-wroclaw" class="dz-other-link">Wymiana klimatyzacji <span>modernizacja starej instalacji</span></a>'
      '<a href="/przeglad-wentylacji-wroclaw/" class="dz-other-link">Serwis wentylacji <span>przeglądy od 250 zł</span></a>'
      '<a href="/wentylacja-mechaniczna-rekuperacja-wroclaw" class="dz-other-link">Rekuperacja <span>wentylacja z odzyskiem</span></a>'
      '<a href="/pompy-ciepla-wroclaw" class="dz-other-link">Pompy ciepła <span>ogrzewanie + chłodzenie</span></a>'
    ) -join "`n      " }
    'wymiana' { @(
      '<a href="/montaz-klimatyzacji-wroclaw" class="dz-other-link">Montaż klimatyzacji <span>nowa instalacja od 4 200 zł</span></a>'
      '<a href="/przeglad-wentylacji-wroclaw/" class="dz-other-link">Serwis wentylacji <span>przeglądy roczne</span></a>'
      '<a href="/wentylacja-mechaniczna-rekuperacja-wroclaw" class="dz-other-link">Rekuperacja <span>wentylacja mechaniczna</span></a>'
    ) -join "`n      " }
    'wentylacja' { @(
      '<a href="/czyszczenie-kanalow-wentylacji-wroclaw" class="dz-other-link">Czyszczenie kanałów <span>standard NADCA</span></a>'
      '<a href="/wentylacja-mechaniczna-rekuperacja-wroclaw" class="dz-other-link">Rekuperacja <span>montaż i serwis</span></a>'
      '<a href="/montaz-klimatyzacji-wroclaw" class="dz-other-link">Montaż klimatyzacji <span>split i multi split</span></a>'
    ) -join "`n      " }
  }

  $html = @"
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<title>$title</title>
<meta name="description" content="$desc" />
<link rel="canonical" href="$url" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="geo.region" content="PL-DS" />
<meta name="geo.placename" content="$placename" />
<meta name="geo.position" content="$geo" />
<meta name="ICBM" content="$icbm" />
<meta property="og:type" content="website" />
<meta property="og:url" content="$url" />
<meta property="og:title" content="$title" />
<meta property="og:description" content="$desc" />
<meta property="og:locale" content="pl_PL" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Geist+Mono:wght@400;600&family=Geist:wght@400;600;700;800&display=swap" rel="stylesheet" />
$CssBlock
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"LocalBusiness","name":"$bizName","telephone":"+48662070695","url":"$url","priceRange":"$priceRange","address":{"@type":"PostalAddress","addressLocality":"$placename","addressRegion":"dolnośląskie","addressCountry":"PL"},"geo":{"@type":"GeoCoordinates","latitude":"$($geo.Split(';')[0])","longitude":"$($geo.Split(';')[1])"}}
</script>
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Strona główna","item":"https://nurtex.pl/"},{"@type":"ListItem","position":2,"name":"$parent","item":"https://nurtex.pl$($parentUrl.TrimEnd('/'))"},{"@type":"ListItem","position":3,"name":"$name","item":"$url"}]}
</script>
</head>
<body>
<section class="dz-hero">
  <div class="container">
    <nav class="dz-breadcrumbs">
      <a href="/">Strona główna</a><span>/</span>
      <a href="$parentUrl">$parent</a><span>/</span>
      <span style="color:var(--fg)">$name</span>
    </nav>
    <h1>$h1</h1>
    <p class="lead">$lead Dojazd z bazy NURTEX we Wrocławiu: <strong>$($loc.dojazd)</strong>. Certyfikat F-gaz, faktura VAT.</p>
    <div class="dz-hero-cta">
      <a href="$ctaPrimary" class="dz-btn dz-btn-primary">$ctaPrimaryText</a>
      <a href="tel:+48662070695" class="dz-btn dz-btn-ghost">📞 662 070 695</a>
    </div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">01 · Obszar</div>
    <h2>Obsługujemy <em>$name</em> i okolicę</h2>
    <div class="osiedla-grid">$osiedlaTags</div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">02 · Specyfika</div>
    <h2>Co robimy w <em>$name</em>?</h2>
    <div class="specyfika-grid">
      <div class="spec-card"><h3>Domy i mieszkania</h3><p>Instalacje dla klientów indywidualnych — <strong>wycena w 24h</strong>, montaż zwykle w 1 dzień roboczy.</p></div>
      <div class="spec-card"><h3>Firmy i biura</h3><p>Systemy VRF i multi split dla lokali usługowych. <strong>Protokół i dokumentacja F-gaz</strong> po zakończeniu.</p></div>
      <div class="spec-card"><h3>Nowe budownictwo</h3><p>Współpraca z deweloperami i inwestorami — <strong>harmonogram zgodny z oddaniem budynku</strong>.</p></div>
      <div class="spec-card"><h3>Dojazd $name</h3><p>Z Smardzowskiej 83B: <strong>$($loc.dojazd)</strong>. Bez dopłaty za dojazd w promieniu 30 km od Wrocławia.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">03 · Doświadczenie</div>
    <h2>Realizacje w <em>$name</em></h2>
    <div class="realizacje-box"><p>Wykonaliśmy <strong>$realizacje realizacji</strong> w rejonie $name — gwarancja 5 lat, certyfikat F-gaz, opinie 5,0★ na Google.</p></div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">04 · FAQ</div>
    <h2>Najczęstsze pytania — <em>$name</em></h2>
    <div class="specyfika-grid">
      <div class="spec-card"><h3>$faq1q</h3><p>$faq1a</p></div>
      <div class="spec-card"><h3>Czy dojeżdżacie do $name?</h3><p>Tak — <strong>$($loc.dojazd)</strong> od bazy we Wrocławiu. Termin zwykle w ciągu 2–5 dni roboczych, pilne zgłoszenia tego samego dnia.</p></div>
      <div class="spec-card"><h3>Jakie marki obsługujecie?</h3><p><strong>Daikin, Mitsubishi, Samsung, LG, Gree, Haier, Toshiba</strong> — dobór pod budżet i wymagania akustyczne.</p></div>
      <div class="spec-card"><h3>Czy wystawiacie fakturę VAT?</h3><p>Tak — faktura VAT, raty 0% Santander/PEKAO, protokół szczelności i wpis do bazy F-gaz.</p></div>
    </div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">05 · Powiązane usługi</div>
    <h2>Sprawdź też</h2>
    <div class="dz-others">$related</div>
  </div>
</section>
<section>
  <div class="container">
    <div class="eyebrow">06 · Inne lokalizacje</div>
    <h2>Inne <em>rejon</em></h2>
    <div class="dz-others">$otherLinks</div>
  </div>
</section>
<section class="dz-cta">
  <div class="container">
    <h2>Wycena w <em>$name</em> — 24h</h2>
    <p>Zadzwoń lub wyślij zapytanie. Bez zobowiązań, bez opłaty za dojazd do 30 km.</p>
    <div class="dz-cta-row">
      <a href="$ctaPrimary" class="dz-btn dz-btn-primary">$ctaPrimaryText</a>
      <a href="tel:+48662070695" class="dz-btn dz-btn-ghost">📞 662 070 695</a>
    </div>
  </div>
</section>
$footer
</body>
</html>
"@

  $out = Join-Path $dir 'index.html'
  [System.IO.File]::WriteAllText($out, $html, [System.Text.UTF8Encoding]::new($false))
  return $out
}

# --- Montaż: tylko 5 nowych okolic (dzielnice już są) ---
$montazNew = $Locations | Where-Object { $_.kind -eq 'okolica' }
foreach ($loc in $montazNew) {
  Write-DistrictPage 'montaz' $loc
  Write-Host "montaz: $($loc.slug)"
}

# --- Wymiana: wszystkie 10 lokalizacji ---
foreach ($loc in $Locations) {
  Write-DistrictPage 'wymiana' $loc
  Write-Host "wymiana: $($loc.slug)"
}

# --- Serwis wentylacji: wszystkie 10 lokalizacji ---
foreach ($loc in $Locations) {
  Write-DistrictPage 'wentylacja' $loc
  Write-Host "wentylacja: $($loc.slug)"
}

Write-Host "DONE: $($montazNew.Count + $Locations.Count * 2) pages"