# Alkalmazásspecifikus fejlesztési állapot

## Azonosítók
- Eredeti név: Digitális Alkalmazások – Digital Tools Academy
- GitHub: https://github.com/FasiSandor/digital-tools-academy
- Alapág: main
- Production/Vercel: nincs létrehozva, URL nem ismert
- Adattárolás: localStorage (csak az adott böngészőben)
- Változat: 0.1.0, fejlesztés alatt

## Megőrzendő működés
- Három platform szerinti tanulás: GeoGebra, Desmos, Wolfram|Alpha
- Magyar nyelv, Dark Tech színvilág, mobil-first
- Feladatellenőrzés és teljesített leckék tárolása
- JSON export és import megerősítéssel
- Külső platformok linkjei; nincs beágyazott harmadik fél fiókhozzáférés
- Interaktív függvénylabor és tématérkép

## Minőségi kapuk
- GitHub Actions: TypeScript + Vite build
- Kézi ellenőrzés: mobilos megjelenés, csúszkák, navigáció, válaszellenőrzés, mentés-visszaállítás
- Vercel: NEM telepítendő külön mérföldkő és ellenőrzés előtt
- Visszaállítási pont: az egyes Git commitok; stabil release tag csak teszt után

## Tartalomfejlesztési követelmények
Minden kidolgozott leckéhez: cél, előfeltétel, lépések, kipróbálható példa, feladat, helyes válasz, hibamagyarázat, külső alkalmazáslink, tanári alkalmazás.
A tématérkép elemei nem automatikusan kidolgozott leckék.
A Wolfram|Alpha esetén a fizetős funkciókat külön kell jelölni.
A három külső alkalmazás aktuális funkcióit hivatalos dokumentációval kell ellenőrizni.

## Következő mérföldkő
- Tartalombank adatszerkezete, több feladat/lecke
- Feladatok külön típusokkal, véletlen kérdésvariációkkal
- Függvénylabor fejlesztése (csúcspont, gyökök, tengelymetszet)
- Valódi PWA ikonok és manifest, offline alapok
- Biztonsági mentés integritásvizsgálata és visszaállítási teszt
- Build + manuális teszt, csak utána Vercel-import
