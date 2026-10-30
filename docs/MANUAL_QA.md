# Kézi regressziós ellenőrzés – Digital Tools Academy

A tesztet a fejlesztési preview-n kell elvégezni, **nem** az éles oldalon. A GitHub Actions nem helyettesíti a böngészős ellenőrzést.

## 1. Mobil (iPhone Safari és keskeny asztali nézet)
- [ ] A menü nyitható és csukható, a tartalom nem lóg ki vízszintesen.
- [ ] A GeoGebra / Desmos / Wolfram|Alpha váltás után helyes a leckelista.
- [ ] A keresés megtartja a lecke valódi sorszámát; nincs találat állapot működik.
- [ ] A grafikon csúszkái ujjal működnek, a jelmagyarázat olvasható.
- [ ] Az öt grafikonkísérlet mindegyike visszaállítja az együtthatókat és a vizsgált pontot.
- [ ] A kék érintő elrejthető és újra megjeleníthető.
- [ ] Az öt soros értéktáblázat együtt változik a csúszkákkal, a vizsgált pont sora kiemelt.
- [ ] Az `a=1, b=-2, c=1, x=1` beállításnál a középső sor `f(x)=0`, `f′(x)=0`.
- [ ] Keskeny képernyőn a táblázat vízszintesen görgethető, a grafikon nem vágódik le.
- [ ] Billentyűzettel a csúszkák, a példagombok és a táblázat körüli vezérlők elérhetők.

## 2. Tanulási haladás
- [ ] Hibás válasz nem jelöl teljesítettnek.
- [ ] Helyes válasz jelöli a leckét; frissítés után is megmarad.
- [ ] A segítő tipp nyitható és zárható; a próbálkozások száma nő.
- [ ] Leckeváltáskor a korábbi válasz és visszajelzés nem marad látható.
- [ ] A magyar tizedesvesszővel írt szám elfogadása egyezik a tizedespontos változattal.

## 3. Mentés és visszaállítás – adatvesztés elleni sorrend
1. Készíts JSON-exportot és őrizd meg.
2. Teljesíts egy további leckét.
3. Importáld a korábbi mentést; **csak az előnézet** jelenjen meg, a haladás még ne változzon.
4. Válaszd az **Egyesítés** lehetőséget: a később teljesített lecke is maradjon meg.
5. Importáld ismét a korábbi mentést; válaszd a **Teljes visszaállítás** opciót, majd erősítsd meg: csak a mentésbeli leckék maradjanak.
6. Módosított, ismeretlen azonosítót tartalmazó mentésnél a teljes visszaállítás legyen letiltva.
7. A friss exportban legyen `manifest` és 64 karakteres hexadecimális `checksum`; az előnézetben „SHA-256 ellenőrzött” jelenjen meg.
8. Egy teljesített leckeazonosítót kézzel módosíts a JSON-ban az ellenőrzőösszeg változtatása nélkül: az importot utasítsa el az alkalmazás.
9. Egy régi, ellenőrzőösszeg nélküli v1 mentésnél jelenjen meg az erre figyelmeztető jelzés, és a korábbi kompatibilis import maradjon használható.
10. Hibás JSON és idegen alkalmazás mentése esetén hiba jelenjen meg, a haladás ne változzon.
8. Végül állítsd vissza a **legfrissebb** exportodat.

## 4. Helyi tárhely hibakezelése
- [ ] Ha a böngésző blokkolja a localStorage mentést (pl. kvóta), az alkalmazás látható figyelmeztetést ad, nem állítja, hogy a haladás biztonságosan megmaradt.
- [ ] Hibás helyi JSON esetén a rendszer nem írja azonnal felül az eredeti adatot üres tömbbel; hibaüzenetet ad.
- [ ] Hibamentes helyi haladás frissítés után változatlanul megmarad.
- [ ] Hiba esetén az exportálás továbbra is elérhető, a felhasználó saját JSON-mentést készíthet.

## 5. PWA telepítés iPhone-on és Androidon
- [ ] iPhone Safari: Megosztás → Hozzáadás a főképernyőhöz; a Digitális Akadémia név és a Σ ikon jelenik meg.
- [ ] A főképernyőről indítva a webapp külön alkalmazásablakban nyílik meg, nem a Safari címsoros lapján.
- [ ] iPadOS és Android esetén az ikon nem vágódik le, nem torzul, a felirat olvasható.
- [ ] Beállítások → Alkalmazás adatai: ugyanaz az ikon, az eredeti alkalmazásnév és a technikai linkek láthatók.
- [ ] Telepítés előtt a haladást JSON-exporttal menteni kell; főképernyőről törlés vagy böngészőadat-törlés helyi adatvesztést okozhat.
- [ ] Offline állapotban nincs garantált tananyag-elérés: az app még nem tartalmaz service workert.

## 6. Release-kapu
- [ ] GitHub Actions Node tesztek és Vite/TypeScript build sikeres.
- [ ] A Vercel preview ellenőrzött, production deploy nem történt.
- [ ] Mobilos és mentési ellenőrzés sikeres.
- [ ] `docs/APP_STATUS.md` frissítve, szükség esetén visszaállítási tag létrehozva.
- [ ] Csak ezután PR #4 merge és egy összevont production deploy.

**Megjegyzés:** a jelenlegi helyi tárolás böngészőhöz kötött. A böngészőadatok törlése, PWA újratelepítése vagy eszközváltás adatvesztést okozhat ellenőrzött export nélkül.

### Helyreállítási zárolás külön próbája
- [ ] Sérült `dta-progress` JSON mellett egy helyes feladatmegoldás sem írhatja felül a korábbi sérült adatot; a felület ne jelezzen elmentett teljesítést.
- [ ] A Beállításokban a megerősített JSON-visszaállítás feloldja a zárolást, és a visszaállított lecke megmarad frissítés után.
- [ ] A kifejezett újrakezdés figyelmeztet az esetleges adatvesztésre, és csak jóváhagyás után hoz létre új üres haladást.

- [ ] Sérült helyi haladás esetén a mentés előnézetében az „Egyesítés” gomb inaktív, az indok olvasható; csak megfelelő, teljes mentéssel lehessen visszaállítani.
- [ ] Ismeretlen leckeazonosítót tartalmazó mentés és sérült helyi adat együttes fennállásakor sem az egyesítés, sem a teljes felülírás nem engedélyezett.

### Automatikus Chromium regresszió
- A `tests/browser-e2e.mjs` mobil méretű Chromiumot futtat helyi Vite preview-n: manifest, ikon, menü, export/import, SHA-256, frissítés utáni adatmegmaradás és sérült tároló helyreállítása.
- Az automatizált Chromium sikeressége **nem** helyettesíti az iPhone Safari, iPad és Android eszközös telepítési próbát.
- GitHub Actions futás végén az E2E lépésnek külön sikeresnek kell lennie; az egyszerű Node smoke + build önmagában nem elegendő e mérföldkő lezárásához.

### Függvénylabor tengelyskálájának ellenőrzése
- [ ] Az x tengelyen az egységnyi távolság mindenütt azonos; a rácsvonalak a megjelenített x feliratokhoz igazodnak.
- [ ] Az y tengely rácsvonalai az y feliratokkal egybeesnek, a két tengely skálája eltérő lehet, de egyik sem megtévesztő.
- [ ] A `f(x)=x²−2` esetben a (0;−2), (1;−1), (2;2) pontok leolvasása egyezik a táblázattal.
- [ ] Mobilon a tengelyfeliratok, a jelölők és az értéktáblázat olvashatók maradnak.

### Szelő és derivált szemléltetése
- [ ] A zöld szelő kapcsolható, a kék érintő kapcsolója továbbra is önállóan működik.
- [ ] `a=1,b=0,c=-2,x=1,h=1` esetben a szelő meredeksége 3, az érintőé 2; `h=0,1` esetén a szelő 2,1.
- [ ] A h csökkentésével a szelő az érintőhöz közelít, és az eltérés a számokban is csökken.
- [ ] Lineáris és konstans függvény esetén a szelő és az érintő meredeksége megegyezik.
- [ ] Mobilon a h csúszka és a P/Q jelölők használhatók, a korábbi grafikon és táblázat olvasható.

### Sérült helyi haladás exportálása
- [ ] Sérült `dta-progress` esetén az „Exportálás (JSON)” gomb letiltott, és a felület megmagyarázza, hogy az üres export elfedhetné a korábbi adatokat.
- [ ] Érvényes mentés teljes visszaállítása után az export gomb újra működik, a visszaállított azonosítók az új mentésben szerepelnek.
- [ ] A helyi adatok kifejezett törlése után az új üres mentés készítése megengedett.

### Ismeretlen leckeazonosítók megőrzése
- [ ] Ha a helyi `dta-progress` lista ismert és ismeretlen azonosítókat is tartalmaz, az ismert teljesítések megjelennek, de a teljes eredeti JSON változatlan marad újratöltés után.
- [ ] A figyelmeztetés jelzi az ismeretlen azonosítók számát; az export és az új teljesítés mentése zárolt.
- [ ] Kifejezett teljes visszaállítás vagy újrakezdés nélkül a rendszer nem törölheti a nem ismert azonosítókat.

### Ismeretlen leckeazonosítók a mentésfájlban
- [ ] Ismert és ismeretlen azonosítókat vegyesen tartalmazó mentés előnézetében mind az egyesítés, mind a teljes visszaállítás letiltott.
- [ ] A figyelmeztetés megmagyarázza az adatvesztés veszélyét; a helyi haladás nem változik.
- [ ] Kizárólag ismert azonosítókat tartalmazó mentés esetén az eddigi egyesítés és megerősített visszaállítás továbbra is működik.

### Nyers mentés helyreállítás előtt
- [ ] Sérült helyi haladásnál a szabványos JSON-export tiltott, de az „Eredeti adat mentése (.txt)” elérhető.
- [ ] A letöltött `.txt` pontosan a helyi `dta-progress` eredeti szövege; a mentés után a böngésző tárhelye nem változik.
- [ ] A felület jelzi, hogy a nyers szöveg nem ellenőrzött mentés és nem importálható közvetlenül.
- [ ] Ha a helyi tárhely nem olvasható, a nyers mentés hibát jelez, nem állítja, hogy sikeres volt.

### Ismert leckék egyesítésének regressziója
- [ ] Ismert `gg1` haladáshoz `gg1, gg2, gg2` mentés egyesítése pontosan `gg1, gg2` eredményt ad, újratöltés után is.
- [ ] Ismeretlen azonosítót tartalmazó mentésnél továbbra is mindkét importgomb tiltott.
- [ ] Ismeretlen azonosítót tartalmazó helyi haladásból a nyers `.txt` mentés a teljes eredeti szöveget tartalmazza, változatlanul.

### Szelő közelítési táblázata
- [ ] Az alap parabola x=1 esetén h=2;1;0,5;0,1 sorokban 4;3;2,5;2,1 szelőmeredekség jelenik meg, az érintőé végig 2.
- [ ] Az a/b/c/x csúszkák módosítására a táblázat frissül; lineáris és konstans esetben minden eltérés nulla.
- [ ] Mobilon a táblázat vízszintesen görgethető, a képernyőolvasó számára címe és oszlopfejlécei vannak.
