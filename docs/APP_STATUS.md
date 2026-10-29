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

## Fejlesztési napló – 2026-10-29
- A függvénylabor megjeleníti a csúcspontot, a zérushelyeket és az Y-tengelymetszetet.
- 12 új vezetett lecke került a három platformhoz (összesen 23).
- A korábbi leckeazonosítók változatlanok; a helyi haladás megőrizhető.
- A build GitHub Actions munkafolyamat konfigurálva, de sikeres futás ebben a munkamenetben nem lett igazolva.
- A futtatási környezetből a GitHub klónozása hálózati DNS-hiba miatt nem sikerült; helyi npm build nem történt.
- Vercel-deploy nem történt.

## Fejlesztési ág – élénk arculat (2026-10-29)
- Ág: development/vibrant-redesign-20261029. A main/production nem módosult.
- Felhasználó által elfogadott új referencia: fekete oldalsáv, fehér tartalmi felület, élénk piros, narancs, kék, zöld; pasztell színek tiltva.
- Mobilon kompakt menü, színes fejléc, haladáskártya; megmarad a mentés, leckeazonosító és grafikonlabor.
- Hat új kidolgozott gyakorlólecke, összesen 29.
- GitHub Actions build ellenőrzés szükséges; Vercelre automatikus deploy nem kért, a fejlesztés külön ágon történik.
- Production URL a felhasználó képernyőképe alapján: https://digital-tools-academy.vercel.app
