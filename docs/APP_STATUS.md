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

## Biztonsági mentés és visszaállítás – fejlesztési ág
- Új `src/backup.ts`: a JSON-mentés alkalmazásazonosító-, verzió-, dátum- és azonosítótípus-ellenőrzése; ismeretlen leckeazonosítók és duplikációk számlálása.
- Importnál 2 MB-os fájlméretkorlát, előnézet, felhasználói jóváhagyás és két mód: egyesítés / teljes visszaállítás. A korábbi `dta-progress` kulcs és az 1-es exportformátum megmaradt.
- Új futtatható Node-teszt a backup modulon: export, hibás metaadatok, duplikációk, ismeretlen ID-k, egyesítés és felülírás.
- Korlát: a JSON formátum nem tartalmaz kriptográfiai ellenőrzőösszeget, és csak a helyi leckekészültséget menti. A felhasználói beállítások és egyéb állományok nem részei a jelenlegi adatsémának.
- Kézi böngészős visszaállítási teszt még szükséges, az automatizált modulvizsgálat nem helyettesíti.

## Folytatás – 2026-10-30, adatvédelmi és regressziós kapu
- A `4ad3c473` commiton GitHub Actions sikeres: futtatható mentési tesztek és TypeScript/Vite build.
- Biztonsági javítás: ismeretlen leckeazonosítót tartalmazó mentés nem írhatja felül teljesen a haladást; egyesítés megengedett. A production/Vercel hivatkozások kattinthatók.
- Navigációs javítás: platformváltáskor keresés törlése; válaszmódosításkor elavult visszajelzés törlése.
- Kézi tesztprotokoll: `docs/MANUAL_QA.md`.
- Aktuális csomag továbbra is PR #4 draft. A teljes böngészős/mobilos teszt és a legfrissebb commit GitHub Actions visszaigazolása még hátravan; production merge nincs.

## Új matematikai ellenőrzési szakasz – 2026-10-30
- A korábbi fejlesztési állapot `554583a1` commitja GitHub Actions szerint **success**.
- A függvénylabor magyarázata kiegészült a diszkrimináns (D=b²−4ac) tényleges számolásával és a gyökök számának értelmezésével; a lineáris és konstans szélsőesetek külön szöveget kapnak.
- A `327c6bc6` commit új ellenőrzése még nem igazolt; ne olvasszuk be CI nélkül.
- PWA-manifest és 192/512/180 PNG ikon jelenleg hiányzik: a központi szabályzat szerinti következő összevont csomagban pótolandó, nem állítható késznek.
- Vercel preview-deployok kikapcsolását nem sikerült hitelesen ellenőrizni; a Git-integráció automatikusan indíthat preview-t, ezért a deploytakarékosság teljesülése nem igazolt.

## Mentési integritás – 2026-10-30
- Új export: a meglévő `version: 1` formátumot megtartva `manifest` (állományjegyzék) és SHA-256 `checksum` mezőkkel egészül ki. A kanonikus JSON a `app`, `version`, `exportedAt`, `completed` mezőkből áll.
- Import: az ellenőrzőösszeges mentés módosítását/sérülését elutasítja; a régi v1 mentés változatlanul importálható, de „ellenőrzőösszeg nélkül” jelölést kap.
- Az integritás nem digitális aláírás és nem titkosítás: a mentés helyi felhasználói fájl, az SHA-256 véletlen sérülés észlelésére szolgál, nem bizonyítja a készítő személyét.
- A mentésben továbbra is kizárólag a helyi teljesített leckeazonosítók szerepelnek; nem tartalmaz fiókadatot, jelszót vagy API-kulcsot.
- Automatizált teszt: valós SHA-256 generálás, visszaolvasás, módosított és sérült állományjegyzék elutasítása, régi formátum elfogadása.

## PWA ikon és telepíthetőség – 2026-10-30
- Elkészült az alkalmazás saját, az elfogadott arculathoz igazított Σ-jelű ikonja: `public/icons/dta-180.png`, `dta-192.png`, `dta-512.png` és SVG-változat.
- `public/manifest.webmanifest`: eredeti appnév, rövid név, `id: /`, `start_url: /`, `scope: /`, magyar nyelv, standalone, PNG és SVG ikonhivatkozások.
- `index.html`: manifest, Apple Touch Icon, SVG favicon, iOS főképernyős metaadatok.
- A Beállítások → Alkalmazás adatai panelen az ikon is látható.
- Automatizált teszt ellenőrzi a manifestet, a PNG-aláírást és a 180/192/512 méreteket; a valódi iPhone/iPad/Android főképernyős megjelenés **még nincs manuálisan ellenőrizve**.
- Ez egy telepíthető webapp-alap, **nem** offline PWA: nincs service worker vagy offline tananyag-cache. Offline működést nem szabad ígérni.

## Függvénylabor – ellenőrizhető értéktáblázat
- Új `src/graphMath.ts`: tiszta, külön tesztelhető másodfokú/lineáris függvényérték-, derivált-, valós gyök- és mintapontszámítás.
- A függvénylabor élő öt soros értéktáblázatot kapott: x, f(x), f′(x), helyi irány; a vizsgált pont kiemelve, keskeny képernyőn görgethető.
- A regressziós tesztek konkrét numerikus eredményeket vizsgálnak, köztük kettős gyök, negatív diszkrimináns, lineáris/konstans eset és a parabola csúcspontja.
- Vercel ellenőrzés: a projektlistában a `digital-tools-academy` látható (`prj_7xmgcrBv7kAqsadLMIHXaF8XHb50`, `team_XukoYO5JkeumfIaEpGdPaFz9`), de a projekt részletes lekérdezése ugyanebben a scope-ban 404-et adott. A Preview Git-integráció tényleges beállítása továbbra sem hitelesített; emiatt nem módosítottuk a projektbeállításokat, nem indítottunk kézi deployt.
- A kézi mobilos regresszió, tényleges telepítés és mentés-visszaállítás továbbra is nyitott release-kapu.

## Helyi tárhely hibabiztonsága – 2026-10-30
- `src/progressStorage.ts` külön kezeli a haladás betöltését és mentését. A `dta-progress` kulcs és a régi JSON-tömb formátuma változatlan.
- Hibás helyi JSON vagy blokkolt böngészőtárhely esetén az alkalmazás látható figyelmeztetést ad; a sérült kezdeti adatot nem írja azonnal felül üres haladással.
- Sikertelen mentésnél a felhasználó figyelmeztetést kap, hogy exportáljon; sikeres újrapróbálkozáskor a figyelmeztetés eltűnik.
- Valódi Node-tesztek: hiányzó, duplikált, ismeretlen, sérült és blokkolt tárhely; sikeres írás és kvótahiba.
- A böngészős hibainjektálás és az iPhone Safari kézi tesztje még nem történt meg. A PR továbbra is draft, production merge/deploy nincs.
