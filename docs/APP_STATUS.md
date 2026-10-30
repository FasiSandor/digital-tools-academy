# Alkalmazásspecifikus fejlesztési állapot

## Azonosítók
- Eredeti név: Digitális Alkalmazások – Digital Tools Academy
- GitHub: https://github.com/FasiSandor/digital-tools-academy
- Alapág: main
- Production/Vercel: https://digital-tools-academy.vercel.app (GitHub-integráció)
- Adattárolás: localStorage (csak az adott böngészőben)
- Csomagverzió: 0.1.0 (a package.json szerint); éles funkciók: 35 lecke, függvénylabor

## Megőrzendő működés
- Három platform szerinti tanulás: GeoGebra, Desmos, Wolfram|Alpha
- Magyar nyelv, felhasználó által jóváhagyott élénk piros/narancs/kék/zöld arculat, fekete oldalsáv, fehér felületek, mobil-first
- Feladatellenőrzés és teljesített leckék tárolása
- JSON export és import megerősítéssel
- Külső platformok linkjei; nincs beágyazott harmadik fél fiókhozzáférés
- Interaktív függvénylabor és tématérkép

## Minőségi kapuk
- GitHub Actions: TypeScript + Vite build
- Kézi ellenőrzés: mobilos megjelenés, csúszkák, navigáció, válaszellenőrzés, mentés-visszaállítás
- Vercel: új production deploy csak ellenőrzött, összevont mérföldkőnél; automatikus preview deployok beállítása külön ellenőrzendő
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
- Build + manuális teszt, csak utána összevont production merge (Vercel-projekt már létezik)

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

## Ellenőrzés – fejlesztési változat
- A cb5e9ddea25a38d29946c88afb19cf4a458ea03b commit GitHub Vercel státusza: success.
- Ez a Vercel státusz nem bizonyít teljes manuális funkcionalitást, a GitHub Actions teszt sikerét vagy a production élesítést.
- A fejlesztési ág továbbra is külön van a main ágtól, PR #1 draft állapotban.
- Élesítés előtt ellenőrizendő: mobilmenü, leckekeresés, 29 lecke, függvénylabor, válaszellenőrzés, JSON export/import, konzolhibák.

## Állapotfrissítés – 2026-10-30
- Production: https://digital-tools-academy.vercel.app
- Éles kiadások: PR #1 élénk arculat és 29 lecke; PR #2 összesen 35 lecke; PR #3 mozgatható pont és érintő. A GitHub/Vercel automatikus státuszok ezeknél sikeresek voltak; ez nem helyettesíti a kézi böngészős tesztet.
- Aktuális fejlesztési ág: `development/graphlab-guided-explanations-20261030`, PR #4 (draft).
- PR #4 csomag: öt élő matematikai magyarázati lépés; öt visszaállítható grafikonkísérlet (pozitív/negatív parabola, lineáris, konstans, csúcsponti érintő); érintő ki-be kapcsolása; aktuális meredekségre épülő önellenőrző feladat és azonnali visszajelzés; leckénkénti segítő tipp, próbálkozásszámláló, magyar tizedesvessző támogatása; mobilos CSS; automatikus smoke tesztek.
- Megőrzés: a 35 lecke azonosítója, a `dta-progress` localStorage-adatok és a JSON export/import változatlanok.
- Ismert korlát: a smoke tesztek részben forrásszöveg-alapúak; valódi mobilos interakciós, képernyőolvasós és export-visszaállítási teszt még szükséges. A Vercel-projekt beállításait az aktuális csatlakozással nem sikerült kiolvasni (404), ezért a preview deployok kizárása nem igazolt.
- Következő nagy csomag: többfeladatos leckék és differenciált hibamagyarázat; mentés előnézete, integritás és visszaállítási teszt; böngészős regressziótesztek.

## Ellenőrzés – 2026-10-30, összevont fejlesztési csomag
- GitHub Actions `Verify application (no deploy)`: **success** a `9870c7c54080fd5f36a84b8e506107e95f5d35c9` commiton (smoke tesztek + TypeScript/Vite build).
- Vercel státusz: **success** ugyanazon a fejlesztési commiton, de a preview telepítések letiltása nincs igazolva.
- A PR #4 draft állapotban marad; nincs production merge, mert böngészős manuális regressziós teszt és a deploy-beállítások ellenőrzése még hiányzik.
