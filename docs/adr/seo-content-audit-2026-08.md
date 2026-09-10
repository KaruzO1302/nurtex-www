# Audyt SEO i Content Gap — Sierpień 2026

## Kontekst i problem do rozwiązania
Domena `nurtex.pl` jest technicznie zoptymalizowana (wdrożone schema.org, hub-and-spoke, poprawne tagi title/H1, brak kanibalizacji), jednak według audytu Ahrefs z 26.07.2026 posiada 0 fraz w TOP100. Domena jest młoda, co oznacza, że Google trzyma ją w "piaskownicy" (sandbox) lub brakuje jej Topical Authority oraz profilu linków zwrotnych.

Głównym problemem nie jest struktura techniczna, lecz **luki w contencie lokalnym (brakujące dzielnice dla części usług)** oraz **brak artykułów blogowych wspierających usługi B2B i pompy ciepła**.

## Audyt Money Pages (Analiza intencji i treści)
Wszystkie strony ofertowe są wyczerpujące, posiadają cenniki, FAQ i tabele porównawcze. Pokrywają intencje transakcyjne i edukacyjne.
1. **`/montaz-klimatyzacji-wroclaw`**: Wzorcowa strona. Pokrywa intencje B2C i B2B. Długość i jakość treści przewyższa konkurencję.
2. **`/serwis-klimatyzacji-wroclaw`**: Bardzo dobra struktura (SLA, cennik, troubleshooting). Pokrywa intencje awaryjne (szybka naprawa) i B2B (umowy).
3. **`/pompy-ciepla-wroclaw`**: Treść wyczerpująca, ale kategoria pomp ciepła jest bardzo konkurencyjna. Wymaga silnego wsparcia z bloga (dotacje, opłacalność).
4. **`/wentylacja-mechaniczna-rekuperacja-wroclaw`**: Świetnie wyjaśnia różnice między wentylacją a rekuperacją.
5. **`/przeglad-wentylacji-wroclaw`**: Skupiona na prawie budowlanym (art. 62). Dobrze trafia w intencje zarządców nieruchomości.
6. **`/czyszczenie-kanalow-wentylacji-wroclaw`**: Mocny nacisk na standard NADCA i B2B.
7. **`/monitoring-iaq-bms-wroclaw`**: Wysoce specjalistyczna (EPBD, ESG, KNX). Wymaga edukowania rynku przez bloga, bo świadomość tych dyrektyw dopiero rośnie.

## Luki w podstronach dzielnicowych (Content Gap Lokalny)
Obecnie posiadamy podstrony dla 5 dzielnic (Fabryczna, Krzyki, Psie Pole, Śródmieście, Stare Miasto) dla montażu klimatyzacji i pomp ciepła. **Korekta:** `serwis-klimatyzacji-wroclaw` jest dalej niż reszta — ma **10 podstron**, nie 5: te same 5 dzielnic **plus 5 miejscowości satelickich** (Kąty Wrocławskie, Kobierzyce, Oława, Siechnice, Trzebnica). To gotowy, sprawdzony wzorzec do powielenia — nie tylko dzielnice, ale też okoliczne gminy — szczególnie dla usług B2B, gdzie klient (biuro, zarządca, zakład) częściej siedzi poza granicami miasta niż klient indywidualny.

**Brakujące podstrony dzielnicowe (do utworzenia):**
- `/wentylacja-mechaniczna-rekuperacja-wroclaw/` (brak 5 dzielnic)
- `/przeglad-wentylacji-wroclaw/` (brak 5 dzielnic)
- `/czyszczenie-kanalow-wentylacji-wroclaw/` (brak 5 dzielnic + wzorem serwisu: dodać miejscowości satelickie — usługa mocno B2B/gastronomia poza miastem)
- `/monitoring-iaq-bms-wroclaw/` (brak 5 dzielnic — miejscowości satelickie tu mniej priorytetowe, BMS to głównie duże biurowce śródmiejskie)

*Decyzja:* Należy wygenerować minimum 20 podstron dzielnicowych (4 usługi × 5 dzielnic), a dla czyszczenia kanałów rozważyć dodatkowo komplet miejscowości satelickich na wzór serwisu klimatyzacji. Zachować zasadę "jedna fraza - jedna strona" (np. `Czyszczenie kanałów wentylacji Wrocław Krzyki`), aby szybko złapać ruch z długiego ogona, gdzie konkurencja jest zerowa.

## Luki w tematach blogowych (Topical Authority)
Obecny blog świetnie wspiera klimatyzację. Brakuje klastrów tematycznych dla pomp ciepła i usług B2B.

**KOREKTA — dwie pozycje z pierwszej wersji tego audytu okazały się duplikatami istniejących wpisów, sprawdzone bezpośrednio w kodzie:**
- ~~*Dofinansowanie do pomp ciepła... Czyste Powietrze i Moje Ciepło*~~ — **już obszernie pokryte** w `blog/klimatyzacja-czy-pompa-ciepla/` (Czyste Powietrze, Moje Ciepło, dotacje, link do `/pompy-ciepla-wroclaw` już jest). Nowy artykuł na ten temat = kanibalizacja. Zamiast tego: **rozbudować istniejący post** o świeże stawki dotacji 2026, nie tworzyć nowej strony.
- ~~*Kary za brak przeglądu wentylacji (Art. 62 Prawa Budowlanego)*~~ — **już obszernie pokryte** w `blog/przeglad-wentylacji-wroclaw/` (Art. 62, kary, grzywny, prawo budowlane — wielokrotnie w treści). Ten sam problem, ta sama poprawka: rozbudować istniejący post, nie duplikować.

**Lista tematów do napisania (zweryfikowane jako faktyczne luki — nie duplikują istniejącego contentu):**
1. **Pompy ciepła:**
   - *Serwis i przegląd pompy ciepła — co ile, ile kosztuje* (wspiera: `/pompy-ciepla-wroclaw`; kąt serwisowy, odmienny od istniejącego porównania klima vs pompa)
   - *Pompa ciepła w starym domu (nieocieplonym) — czy to ma sens?* (wspiera: `/pompy-ciepla-wroclaw`)
   - *Koszty ogrzewania pompą ciepła vs gaz we Wrocławiu — kalkulacja 2026* (wspiera: `/pompy-ciepla-wroclaw`)
2. **Wentylacja i Czyszczenie (B2B/B2C):**
   - *Protokół z przeglądu wentylacji — co musi zawierać dla ubezpieczyciela i PINB* (wspiera: `/przeglad-wentylacji-wroclaw`; kąt proceduralny/praktyczny, odmienny od istniejącego artykułu o Art. 62)
   - *Wymogi Sanepidu i PPOŻ dla wentylacji w gastronomii* (wspiera: `/czyszczenie-kanalow-wentylacji-wroclaw`)
   - *Rekuperacja w starym domu — koszty, opłacalność i montaż* (wspiera: `/wentylacja-mechaniczna-rekuperacja-wroclaw`)
3. **BMS i IAQ (B2B):**
   - *Dyrektywa EPBD 2026 a automatyka budynkowa — czy Twój biurowiec jest gotowy?* (wspiera: `/monitoring-iaq-bms-wroclaw`)
   - *Raportowanie ESG w nieruchomościach komercyjnych — jak BMS dostarcza dane* (wspiera: `/monitoring-iaq-bms-wroclaw`)

## Rozważane opcje i decyzje
- **Opcja 1: Agresywny link building.** Odrzucona na tym etapie. Domena jest za młoda, nagły przyrost linków bez pełnego pokrycia Topical Authority wygląda nienaturalnie.
- **Opcja 2: Rozbudowa Topical Authority i struktury lokalnej (Wybrana).** Najpierw zamykamy architekturę silosów (dzielnice dla wszystkich usług) i budujemy eksperckość blogiem. Linki pozyskujemy powoli (wizytówki NAP, lokalne portale).

## Plan kroków do wdrożenia (Priorytety na najbliższe 2 tygodnie)
Posortowane wg szacowanego wpływu na ranking i szybkości wdrożenia (Quick Wins):

1. **Utworzenie 20 brakujących podstron dzielnicowych** dla usług: rekuperacja, przeglądy, czyszczenie, BMS — dla czyszczenia kanałów dodatkowo rozważyć komplet miejscowości satelickich na wzór `serwis-klimatyzacji-wroclaw`. (Najszybszy sposób na wejście w TOP50 dla fraz lokalnych).
2. **Napisanie i publikacja 3 priorytetowych artykułów blogowych B2B/Compliance**: Protokół z przeglądu (kąt proceduralny, nie duplikat Art. 62), Wymogi Sanepidu dla gastronomii, Dyrektywa EPBD 2026. Dodatkowo: rozbudować istniejący `blog/przeglad-wentylacji-wroclaw/` o świeże dane zamiast tworzyć nowy wpis o karach. (Zbuduje to autorytet dla najdroższych usług).
3. **Napisanie i publikacja 2 artykułów o pompach ciepła**: Serwis i przegląd pompy ciepła oraz Pompa ciepła w starym domu. Dodatkowo: rozbudować istniejący `blog/klimatyzacja-czy-pompa-ciepla/` o świeże stawki dotacji 2026 zamiast tworzyć nowy wpis o dofinansowaniach. (Wsparcie dla wysoce konkurencyjnej frazy).
4. **Wdrożenie precyzyjnego linkowania wewnętrznego** z nowych wpisów blogowych do odpowiednich money pages (exact match anchors).
5. **Pozyskanie pierwszych 5-10 linków lokalnych (NAP)** (do uzupełnienia przez Leszka) — wizytówki firmowe, katalogi wrocławskie, ew. artykuł sponsorowany na lokalnym portalu (np. wroclaw.pl), aby zdjąć filtr "sandbox" z młodej domeny.

## Ograniczenia kąta (anty-kanibalizacja) — druga weryfikacja, Opus 4.8
Pełna weryfikacja wszystkich 8 zaproponowanych tematów przeciw treści realnej
(nie tylko tytułom) 10 istniejących wpisów blogowych — zweryfikowane cytatami
z linii kodu, spot-checked i potwierdzone. Twardych duplikatów brak, ale 3
tematy mają częściowe pokrycie w istniejących wpisach i wymagają pilnowania
kąta przy pisaniu, inaczej wpadną w kanibalizację:

- **Pompa ciepła w starym domu** — `blog/klimatyzacja-czy-pompa-ciepla`
  (linia ~176) już wspomina pompę powietrze-woda jako wspomaganie w starym
  domu, ale w kontekście klimatyzacji powietrze-powietrze. Nowy wpis MUSI
  trzymać kąt **pompa powietrze-woda** (temp. zasilania grzejników, próg
  opłacalności COP bez termomodernizacji) i linkować do istniejącego wpisu,
  nie powtarzać go.
- **Protokół z przeglądu wentylacji** — `blog/przeglad-wentylacji-wroclaw`
  (linia ~177) już szeroko opisuje PO CO protokół (ubezpieczyciel, PINB,
  likwidator szkody). Nowy wpis ma sens TYLKO jeśli zejdzie na CO ZAWIERA
  dokument (pozycje protokołu, wzór, dane pomiarowe, podpis uprawnionego) —
  intencja "po co" jest już zajęta.
- **Wymogi Sanepidu/PPOŻ w gastronomii** — ten sam wpis ma już wiersz
  tabeli cennikowej o lokalu gastronomicznym/Sanepidzie/PPOŻ. Nowy wpis ma
  sens jako **wymogi techniczne i normy** (krotność wymian powietrza, okapy,
  separatory tłuszczu, HACCP), nie jako powtórka "po co przegląd".

*Gotowe do wdrożenia w trybie Code.*
