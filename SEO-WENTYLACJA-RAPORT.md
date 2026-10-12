# SEO wentylacji – raport wdrożeniowy (gałąź `seo/wentylacja-wroclaw`)

> Plik roboczy. **Nie trafia na produkcję**: wykluczony w `.vercelignore` (Vercel deployuje katalog główny repo, `outputDirectory: "."`).
> Data przygotowania: 11.10.2026. Nic nie zostało wypchnięte ani wdrożone (brak `git push`, PR, deployu).

## 1. Rozpoznany stack

- **Czysty statyczny HTML**, bez generatora i bez builda: `vercel.json` → `buildCommand: null`, `framework: null`, `outputDirectory: "."`, `cleanUrls: true`, `trailingSlash: false`. Brak `package.json`.
- Każda strona to ręcznie utrzymywany plik `<ścieżka>/index.html`. **Header, stopka, JSON-LD firmy i FAQ są kopiowane w każdym pliku** (brak partiali/szablonów). Trzy „szablony” (A: strona główna + klimatyzacja, B: wentylacja z CSS `/css/wentylacja-b2b.css`, C: blog z CSS inline) to po prostu trzy rodziny plików.
- `sitemap.xml` i `robots.txt` – pliki statyczne, edytowane ręcznie (`robots.txt` wskazuje sitemap i niczego nie blokuje – bez zmian).
- Testy w repo: `python3 tests/seo-integrity.test.py` (integralność SEO stron z sitemap) i `node tests/lead-form.test.cjs` (formularz). Podgląd lokalny: `npx serve@14 -l 4173 .` (obsługuje cleanUrls i `404.html` z kodem 404, tak jak Vercel).
- **Jedno źródło prawdy dla encji firmy**: ponieważ nie ma szablonów, ujednolicenie zrobiono skryptem (poza repo: `/workspace/seo-tools/task5.py`). Skrypt: (1) na `/` poprawia pełny węzeł `HVACBusiness` (telefon `+48 662 070 695`, usunięty `https://www.nurtex.pl/` z `sameAs`, usunięty `SearchAction`), (2) w każdym `Service`/`Article`/`CollectionPage` zamienia `provider`/`author`/`publisher` na `{"@id":"https://nurtex.pl/#business"}`, (3) na każdej stronie z taką referencją dokłada skrócony węzeł `HVACBusiness` (identyczny na wszystkich stronach, dane zgodne co do wartości z węzłem na `/`), (4) na 20 stronach lokalnych zamienia `LocalBusiness` na `Service` (`@id <url>#service`, `provider` przez `@id`, `areaServed` bez zmian, bez `priceRange`). Przy kolejnych zmianach stopki/encji trzeba pilnować wszystkich plików (brak include).

## 2. Lista [DO POTWIERDZENIA] (numeracja z sekcji 2.3 planu)

Wszystkie wpisy są **tylko komentarzami HTML** – nie ma ich w treści widocznej ani w JSON-LD (sprawdzone skryptem).

| # | Pytanie | Miejsce w kodzie |
|---|---|---|
| 1 | Czy NURTEX wykonuje **kontrolę okresową z art. 62 PB** i wystawia protokół (uprawnienia budowlane, specjalność instalacyjna)? | `wentylacja-mechaniczna-rekuperacja-wroclaw/index.html` sekcja `#kontrola-okresowa` + FAQ; `przeglad-wentylacji-wroclaw/index.html` sekcja `#kontrola-okresowa`; `blog/przeglad-wentylacji-wroclaw/index.html` koniec `<main>` (usunięty akapit „nasi uprawnieni inżynierowie… wystawimy ważny protokół”) |
| 2 | **Dojazd** przy usługach wentylacyjnych (strona główna: „bez opłaty w obrębie Wrocławia / do 30 km”, strony wentylacji: „ustalamy w wycenie”) | `wentylacja-mechaniczna-rekuperacja-wroclaw/index.html` sekcja `#cennik` |
| 3 | **Warunki SLA / umowy serwisowej**: czasy reakcji, częstotliwość, forma raportu | serwis: sekcja `#stala-obsluga` i FAQ „Czy podpisujecie stałą umowę serwisową?” |
| 4 | **Marki i typy central** | serwis: komentarz w FAQ (pytanie „Czy serwisujecie centrale wszystkich producentów?”) |
| 5 | Czy przegląd obejmuje **pomiar przepływów** i jakim sprzętem | przegląd: komentarz w FAQ („Czy mierzycie przepływy powietrza?”) |
| 6 | **Zgłoszenia awaryjne poza godzinami** pn–pt 8–17 / prace poza godzinami lokalu | naprawa: sekcja `#zgloszenie`; serwis: karta „Gastronomia” w `#organizacja` i FAQ |
| 7 | **Montaż rekuperacji / nowych instalacji** (wpis o projektowaniu vs „nie składamy instalacji pod klucz”) | serwis: sekcja `#rekuperacja` |
| 8 | **Ceny z wpisu blogowego** – czy aktualne i czy mają gdzieś wrócić | `blog/przeglad-wentylacji-wroclaw/index.html` koniec `<main>`; kwoty poniżej |
| 9 | Współrzędne **geo** 51.0582136, 17.042428 – zgodność z adresem i wizytówką | `index.html` komentarz nad blokiem JSON-LD `HVACBusiness` |

### Usunięte kwoty z `/blog/przeglad-wentylacji-wroclaw` (sekcja 04, pkt 8)

| Typ obiektu / instalacja | Średni koszt brutto (było) | Zakres dokumentacji (było) |
|---|---|---|
| Mieszkanie w bloku (grawitacyjna, roczna) | od 250 zł / lokal | Wpis do protokołu zbiorczego wspólnoty |
| Dom jednorodzinny (grawitacyjna) | od 350 zł | Indywidualny protokół okresowy wentylacji |
| Dom jednorodzinny (mechaniczna z rekuperacją) | od 450 zł | Protokół pomiarowy + ocena techniczna centrali |
| Lokal gastronomiczny / restauracja | od 800 zł | Protokół bilansu powietrza dla Sanepidu i PPOŻ |
| Biurowiec / obiekt B2B (>500 m²) | wycena indywidualna | Pełny raport techniczny z pomiarami central dachowych |

Sekcję zastąpiono „Od czego zależy koszt kontroli i przeglądu” (bez kwot) z linkiem do strony usługi.

### Poprawki prawne we wpisie (wg `/workspace/przepisy-wentylacja.md`, stan 10.10.2026)

- t.j. Prawa budowlanego **Dz.U. 2025 poz. 418** (było: 2023 poz. 682).
- art. 62 ust. 1 pkt 1 lit. c opisany jako **kontrola stanu technicznego**, nie obowiązek czyszczenia.
- dodane: wg GUNB dotyczy też przewodów wentylacji mechanicznej; **art. 62 ust. 6** (kominiarz – przewody grawitacyjne; uprawnienia budowlane instalacyjne – wszystkie); **art. 64 / c-KOB**.
- sankcja: **art. 93 pkt 8**, wykroczenie (mandat co do zasady do 500 zł, sąd do 5000 zł) – w treści dopisane zalecenie weryfikacji w ISAP. **Do weryfikacji prawnej przed wdrożeniem.**
- usunięte kategoryczne „Brak protokołu = zero odszkodowania”, „odpowiedzialność karna”, „PINB grzywna do 5000 zł / natychmiastowe wstrzymanie” – zastąpione sformułowaniem warunkowym („ubezpieczyciel może badać, czy…”).

## 3. Wariant dla linków do domen hydraulicznych (zad. 7.3 – NIE wdrożony, czeka na decyzję)

Stan: 5 domen (`wuko-wroclaw.pl`, `ziebud-expert.pl`, `serwis-kanalizacji.com`, `sekor.com.pl`, `wodociagi-kanalizacja.com`) linkowanych z `rel="noopener"` (bez `nofollow`) w stopkach **25 plików**: `index.html`, `montaz-klimatyzacji-wroclaw/index.html` (+5 dzielnic), `pompy-ciepla-wroclaw/index.html` (+5 dzielnic), `serwis-klimatyzacji-wroclaw/index.html` (+10 dzielnic/miejscowości), `monitoring-iaq-bms-wroclaw/index.html`. Na stronach lokalnych linkowane są 3 domeny (WUKO, ZIĘBUD, Serwis kanalizacji), na 5 stronach głównych sekcji – wszystkie 5 (kolumna „Firmy z naszej grupy”).

**Wariant A (zalecany, minimalny):** we wszystkich 25 plikach `rel="noopener"` → `rel="nofollow noopener"` dla tych 5 domen. Jednolinijkowa zmiana:
```bash
sed -i -E 's#(href="https://(wuko-wroclaw\.pl|ziebud-expert\.pl|serwis-kanalizacji\.com|sekor\.com\.pl|wodociagi-kanalizacja\.com)/"[^>]*rel=")noopener"#\1nofollow noopener"#g' $(grep -rlE 'wuko-wroclaw\.pl|ziebud-expert\.pl|serwis-kanalizacji\.com|sekor\.com\.pl|wodociagi-kanalizacja\.com' --include=*.html .)
```
**Wariant B:** usunąć kolumnę/linki ze stopek 24 plików i zostawić blok „Firmy z naszej grupy” tylko na stronie głównej (lub tylko w stopce `/`), z `rel="nofollow noopener"`.

## 4. Co zrobiono poza literą planu (do wiadomości)

- **FAQPage tylko z widocznymi pytaniami (zad. 5 pkt 8):** skrypt kontrolny wykrył już na `main` 38 pytań w FAQPage, których nie ma w widocznej treści (14 stron: `/`, `/pompy-ciepla-wroclaw`, `/serwis-klimatyzacji-wroclaw`, `/monitoring-iaq-bms-wroclaw`, 3 strony lokalne montażu, 7 wpisów blogowych). Usunięto je z JSON-LD; na 5 wpisach blogowych blok FAQPage był w całości niewidoczny i został usunięty. Treść widoczna bez zmian. Osobny commit – łatwy do cofnięcia.
- Box „Szukasz usługi?” na początku wpisu blogowego ma anchor opisowy („przegląd central i rekuperacji NURTEX”), żeby jedynym exact-match „przegląd wentylacji Wrocław” we wpisie był link w sekcji 04; CTA końcowe ma wariant „przegląd wentylacji we Wrocławiu”.
- Hero wpisu i `og:image`/`image` wpisu: zamiast hero innego wpisu użyto istniejącego zdjęcia `/img/realizacje-2026-09/centrala-wentylacyjna-1280.webp`.
- Dodane do `/css/wentylacja-b2b.css` style tabeli `.decision` (tabela wyboru usługi na serwisie, tabela objawów na naprawie) z widokiem kartowym < 620 px; wersja CSS na zmienionych stronach `?v=2026-10-11`.
- `lastmod` w sitemap ustawiony na **2026-10-11** (data przygotowania) – **przy faktycznym wdrożeniu podmienić na datę deployu**. Zmienione 44/45 URL-i (wszystkie miały zmianę treści lub JSON-LD); bez zmian tylko `/polityka-prywatnosci`.
- Strona serwisu ma ~1600 słów w `<main>` (cel w planie 1200–1400; kryterium ≥ 1200 spełnione).

## 5. Weryfikacja (wyniki 11.10.2026)

- Build: brak (czysty statyk). `tests/seo-integrity.test.py`: OK. `tests/lead-form.test.cjs`: OK.
- `check_seo.py` (na `npx serve`): 45/45 URL-i z sitemap = 200; `/serwis-wentylacji-wroclaw` i losowy URL = **404 z własną stroną**; zbiór `@id` LocalBusiness/HVACBusiness = `{"https://nurtex.pl/#business"}`, jedna nazwa „NURTEX Klimatyzacja i Wentylacja”, jeden telefon „+48 662 070 695”; każdy `Service`, `author`, `publisher` przez `@id`; FAQPage = widoczne FAQ; brak „[DO POTWIERDZENIA]” w treści i JSON-LD; **0 błędów**. Ostrzeżenia: 30 title > 60 zn. i 21 description > 155 zn. na stronach spoza zakresu (było 31 / 25).
- Lista URL-i w sitemap: **identyczna** przed i po (45).
- Podobieństwo (5-gramy słów, Jaccard) serwis vs przegląd / naprawa / czyszczenie: **3,1% / 0,7% / 3,6%** (przed: 35,2% / 0,9% / 24,9%).
- Walidacja schema.org: brak walidatora offline – **sprawdzić 3 strony docelowe, `/` i 1 stronę lokalną w Rich Results Test / validator.schema.org po deployu podglądowym**.
- Mobile 375 px: zrzuty headless Chrome stron serwisu, przeglądu, naprawy, wpisu i 404 – menu, tabele (widok kartowy) i stopka bez rozjazdów. Strony głównej (nowy trzeci przycisk w sekcji „Centrale pod opieką”) nie oglądano na 375 px – do rzutu oka na preview.

## 6. Poza zakresem – dalsze kroki

- skrócenie pozostałych 30 title > 60 zn. i 21 description > 155 zn.,
- rozbudowa `/realizacje` (~150 słów),
- kompresja obrazów,
- skrócenie H1 strony głównej (142 zn.),
- decyzja o linkach hydraulicznych (sekcja 3),
- potwierdzenie pkt 1–9 i ewentualne odkomentowanie treści.
