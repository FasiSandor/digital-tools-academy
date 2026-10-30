# Kézi regressziós ellenőrzés – Digital Tools Academy

A tesztet a fejlesztési preview-n kell elvégezni, **nem** az éles oldalon. A GitHub Actions nem helyettesíti a böngészős ellenőrzést.

## 1. Mobil (iPhone Safari és keskeny asztali nézet)
- [ ] A menü nyitható és csukható, a tartalom nem lóg ki vízszintesen.
- [ ] A GeoGebra / Desmos / Wolfram|Alpha váltás után helyes a leckelista.
- [ ] A keresés megtartja a lecke valódi sorszámát; nincs találat állapot működik.
- [ ] A grafikon csúszkái ujjal működnek, a jelmagyarázat olvasható.
- [ ] Az öt grafikonkísérlet mindegyike visszaállítja az együtthatókat és a vizsgált pontot.
- [ ] A kék érintő elrejthető és újra megjeleníthető.

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

## 4. PWA telepítés iPhone-on és Androidon
- [ ] iPhone Safari: Megosztás → Hozzáadás a főképernyőhöz; a Digitális Akadémia név és a Σ ikon jelenik meg.
- [ ] A főképernyőről indítva a webapp külön alkalmazásablakban nyílik meg, nem a Safari címsoros lapján.
- [ ] iPadOS és Android esetén az ikon nem vágódik le, nem torzul, a felirat olvasható.
- [ ] Beállítások → Alkalmazás adatai: ugyanaz az ikon, az eredeti alkalmazásnév és a technikai linkek láthatók.
- [ ] Telepítés előtt a haladást JSON-exporttal menteni kell; főképernyőről törlés vagy böngészőadat-törlés helyi adatvesztést okozhat.
- [ ] Offline állapotban nincs garantált tananyag-elérés: az app még nem tartalmaz service workert.

## 5. Release-kapu
- [ ] GitHub Actions Node tesztek és Vite/TypeScript build sikeres.
- [ ] A Vercel preview ellenőrzött, production deploy nem történt.
- [ ] Mobilos és mentési ellenőrzés sikeres.
- [ ] `docs/APP_STATUS.md` frissítve, szükség esetén visszaállítási tag létrehozva.
- [ ] Csak ezután PR #4 merge és egy összevont production deploy.

**Megjegyzés:** a jelenlegi helyi tárolás böngészőhöz kötött. A böngészőadatok törlése, PWA újratelepítése vagy eszközváltás adatvesztést okozhat ellenőrzött export nélkül.
