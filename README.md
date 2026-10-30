# Digitális Alkalmazások – Digital Tools Academy

Magyar nyelvű, mobil-first oktatóalkalmazás GeoGebra, Desmos és Wolfram|Alpha használatához.

## Fejlesztői indítás

```bash
npm install
npm run dev
npm run build
```

## Állapot

0.1.0 (csomagverzió) – a jelenlegi alkalmazás 35 leckés tanulási alapot tartalmaz. A külön fejlesztési PR #4 kibővített függvénylaborral, függvényvizsgálattal, számolási gyakorlással és mentési biztonsági fejlesztésekkel készül. **A teljes alkalmazás még nincs kész; a PR nincs élesítve.**

Részletes készültségi és hiányaudit: [2026-10-30 teljes készültségi audit](docs/TELJES_KESZULTSEGI_AUDIT_2026-10-30.md).

## Fejlesztési szabályok

- A WEBAPPOK_KOZPONTI_SZABALYOK.md kötelező.
- Vercel deploy csak ellenőrzött, összevont mérföldkőnél.
- A felhasználói adatok és elfogadott funkciók megőrzendők.
- A haladás jelenleg localStorage-ban tárolódik, nincs felhőszinkron.
- Külső oldalak funkciói és előfizetési feltételei változhatnak.

## Következő feladatok

Teljes modulstruktúra, valós interaktív grafikonmotor, részletes feladattár, tanári műhely, akadálymentesség, PWA ikonok és offline működés, automatikus tesztek, mentésellenőrzés.
