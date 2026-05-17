# NURTEX - porzadek infrastruktury

Data: 2026-05-17

## Aktualna produkcja

- Projekt Vercel: `nurtex-www-production`
- Repo GitHub: `https://github.com/KaruzO1302/nurtex-www.git`
- Domena glowna: `https://wentylacja-nurtex-klimatyzacja.pl`
- Alias Vercel: `https://nurtex-www.vercel.app`
- Typ strony: statyczny HTML/CSS/JS
- Blog: `/blog`
- Podstrona uslugowa: `/montaz-klimatyzacji-wroclaw/`
- Podstrona uslugowa: `/wentylacja-mechaniczna-rekuperacja-wroclaw/`

## Backupi lokalne

- Aktualna produkcja z GitHuba: `/Users/leszek/Documents/Codex/nurtex-www-production`
- Starsza wersja Next.js: `/Users/leszek/Documents/Codex/nurtex-www`
- Branch backup starej wersji Next.js: `backup/next-js-2026-05-17`
- Branch backup statycznej produkcji: `backup/github-static-2026-05-17`

## Priorytety

- Nie ruszac bez potrzeby: `wodociagi-kanalizacja.com`
- Nie ruszac bez potrzeby: `ziebud-expert.pl`
- NURTEX rozwijac na bazie aktualnej produkcji statycznej albo swiadomie przeniesc do Next.js po decyzji.

## Uwaga

Stara wersja Next.js miala blog pod `/wiedza`. Aktualna produkcja ma blog pod `/blog`.
W `vercel.json` dodano przekierowania ze starego `/wiedza` na `/blog`.

## Jak pracujemy dalej

1. Edycje NURTEX robimy w katalogu:
   `/Users/leszek/Documents/Codex/nurtex-www-production`
2. Lokalny podglad:
   `http://127.0.0.1:4174`
3. Produkcja:
   `https://wentylacja-nurtex-klimatyzacja.pl`
4. Po zmianach testujemy minimum:
   - `/`
   - `/montaz-klimatyzacji-wroclaw/`
   - `/wentylacja-mechaniczna-rekuperacja-wroclaw/`
   - `/blog`
   - `/blog/jak-dziala-klimatyzator`
   - `/wiedza` jako przekierowanie do `/blog`
5. GitHub i Vercel sa synchronizowane z katalogu produkcyjnego po kazdej zamknietej zmianie.
