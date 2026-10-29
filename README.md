# Digitális Alkalmazások – Digital Tools Academy

Magyar nyelvű, mobil-first oktatóalkalmazás GeoGebra, Desmos és Wolfram|Alpha használatához.

## Fejlesztői indítás

```bash
npm install
npm run dev
npm run build
```

## Állapot

0.1.0 – első működő tanulási alap: 11 bevezető lecke, feladatellenőrzés, helyi haladáskövetés, JSON export/import. Nem teljes tananyag; a három rendszer haladó részei későbbi mérföldkövek.

## Fejlesztési szabályok

- A WEBAPPOK_KOZPONTI_SZABALYOK.md kötelező.
- Vercel deploy csak ellenőrzött, összevont mérföldkőnél.
- A felhasználói adatok és elfogadott funkciók megőrzendők.
- A haladás jelenleg localStorage-ban tárolódik, nincs felhőszinkron.
- Külső oldalak funkciói és előfizetési feltételei változhatnak.

## Következő feladatok

Teljes modulstruktúra, valós interaktív grafikonmotor, részletes feladattár, tanári műhely, akadálymentesség, PWA ikonok és offline működés, automatikus tesztek, mentésellenőrzés.
