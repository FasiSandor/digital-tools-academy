# TELJES KÉSZÜLTSÉGI AUDIT – Digitális Alkalmazások / Digital Tools Academy
Dátum: 2026-10-30 · Állapot: **fejlesztési csomag, nem végleges kiadás**

## Vizsgálat alapja és korlátja
GitHub-forrás: `FasiSandor/digital-tools-academy`, `development/graphlab-guided-explanations-20261030`, PR #4. Ellenőrzött fájlok: README, APP_STATUS, MANUAL_QA, package.json, main.tsx, GraphLab/ExtendedGraphLab, extendedFunctions, functionAnalysis, numericPractice, practiceSummary, backup, progressStorage, curriculum, három leckekiegészítő, PWA manifest, CI workflow. A központi WEB APPOK szabályzat kötelező. Ez forrás- és automatikus tesztekre alapozott audit, **nem** helyettesíti az iPhone/iPad/Android valós eszközös próbáját, a pedagógiai szaklektorálást és az éles Vercel állapot újraellenőrzését.

## Vezetői döntés
**NEM teljes, NEM kiadáskész.** A működő tanulási alap és a függvénylabor jelentős része elkészült; a teljes, eredeti célként megjelölt háromplatformos tananyag, a tanári műhely és a teljes minőségbiztosítás még nem. A `main` és production változatlan; a fejlesztési PR draft marad. Élesítésre nincs automatikus felhatalmazás.

## Ténylegesen meglévő funkciók
| Terület | Forrás / bizonyíték | Állapot |
|---|---|---|
| GeoGebra, Desmos, Wolfram Alpha navigáció | `src/main.tsx` | Működő alap |
| 35 lecke, megőrzött leckeazonosítók | `main.tsx` + `extraLessons`, `moreLessons`, `phaseTwoLessons`; `APP_STATUS` | Kidolgozott kezdő készlet, nem teljes tananyag |
| Leckekeresés, egyszerű szöveges válaszellenőrzés, helyi haladás | `main.tsx`, `progressStorage.ts` | Működő alap |
| Első- és másodfokú grafikonlabor, magyarázatok, érintő/szelő | `GraphLab.tsx` és tesztek | Fejlesztési ágon |
| Abszolútérték, harmadfok, reciprok; korlátozott biztonságos képletparser | `extendedFunctions.ts`, `ExtendedGraphLab.tsx` | Fejlesztési ágon, nem általános CAS |
| Függvényvizsgálat, feleletválasztás, számolás, öt kör, hibamagyarázat, segítség | `functionAnalysis.ts`, `FunctionInvestigation.tsx`, `numericPractice.ts` | Fejlesztési ágon |
| Munkameneti statisztika és másolható szöveges összesítő | `practiceSummary.ts` | Csak ideiglenes; nem tanári napló |
| JSON mentés: SHA-256, előnézet, merge/replace, régi v1 kompatibilitás, sérült tároló védelme | `backup.ts`, `progressStorage.ts`, `main.tsx` | Csak leckehaladás; eszközök közt nincs szinkron |
| PWA manifest és 180/192/512 ikon | `index.html`, `public/manifest.webmanifest`, PR fájllista | Fejlesztési ágon; offline service worker nincs |
| Automatikus Node + TypeScript/Vite + mobil Chromium | `.github/workflows/verify.yml` | Elérhető, nem teljes kézi QA |

## Hiányok és kiadási blokkolók
### P0 – kötelező kiadás előtt
1. **Teljes mentési visszaállítás valós eszközön:** export, módosított haladás, merge, teljes visszaállítás, sérült JSON, ismeretlen ID és frissítés utáni állapot. Az automatizált teszt nem helyettesíti.
2. **Valódi mobil és hozzáférhetőségi QA:** iPhone Safari, iPad, Android; PWA telepítés, ikon, mobilmenü, grafikonvezérlés, billentyűzet, képernyőolvasó, túlcsordulás. A `docs/MANUAL_QA.md` tételei még nem tekinthetők kipipáltnak.
3. **Vercel Git-integráció és preview-build hatás hiteles ellenőrzése:** a korábbi státuszjegyzet szerint ez nem volt igazolható. További pushok előtt ellenőrizendő, hogy a fejlesztési ág nem fogyaszt-e nem kívánt deployt.
4. **Matematikai szélsőesetek és feladatbank szakmai auditja:** nullával szorzott reciprok, a=0 konstans esetek, zérushelyek, monotónia, szimmetria, hibás válaszlehetőségek és numerikus tűrés; minden feladatnak egyértelmű helyes megoldása legyen.
5. **Release-fegyelem:** PR #4 draft, nincs merge/deploy; stabil visszaállítási pont, teljes CI és kézi elfogadás szükséges.

### P1 – a teljes eredeti alkalmazáscélhoz
1. **Tananyagfedettség:** a `curriculum.ts` sok témát tartalmaz, de a tématérkép nem kidolgozott lecke. A három platform minden vállalt moduljához cél, előfeltétel, lépések, példa, több feladat, magyarázat, külső link és tanári felhasználás szükséges.
2. **Tanári műhely:** saját feladat- és óravázlatkészítés, tartalom-összeállítás, tanári export, tanulói eredmények értelmezése; jelenleg nem azonosítható teljes értékű műhelyként.
3. **Valódi differenciált feladatbank:** leckénként több kérdéstípus, ismétlés, véletlen variáció, célzott hibamagyarázat és önálló gyakorlás, nem csupán egy fix válasz.
4. **GeoGebra / Desmos / Wolfram Alpha funkciók naprakész, hivatalos forrású ellenőrzése**, különösen Wolfram fizetős funkciók és hozzáférés.
5. **Oktatási minőség:** előfeltétel-rendszer, fokozatos nehézség, diagnosztika, tanári kipróbálás, valós tanulói teszt.

### P2 – bővítés, nem automatikus kiadási feltétel
- Offline működés service workerrel és biztonságos cache-frissítéssel; jelenleg nincs offline garancia.
- Tartós, eszközök közti szinkron, felhasználói fiókok, tanári csoportkezelés: jelenleg nincs backend. Bevezetésük külön adatvédelmi és migrációs döntés.
- Export további formátumokba és tartalombank; a jelenlegi JSON csak helyi leckehaladást ment.

## Műszaki megállapítások
- `package.json` verzió: **0.1.0**, ez nem készültségi százalék és nem release-készségi bizonyíték.
- `README.md` 11 leckét említ: **elavult dokumentáció**, a kód és státusz 35 leckét jelez.
- A `main.tsx` jelentős részben egyetlen nagy komponens; a tananyag és UI modularizálása szükséges a biztonságos skálázáshoz, de a régi leckeazonosítókat változatlanul kell hagyni.
- A quiz és hibadiagnosztika jelenleg szabályalapú; nem AI-tanár, nem általános matematikai rendszer.
- A mentési checksum integritásvizsgálat, nem titkosítás vagy hiteles digitális aláírás.
- A helyi haladás böngészőhöz kötött, és a munkameneti gyakorlási statisztika oldalbezáráskor elveszik.
- A nullás reciprok együttható `0/(x-h)+k` esetén x=h lyuk, **nem függőleges aszimptota**. A fejlesztési ágon a vizsgálati/ábrázolási megjelenítés javítása elkezdődött; a kapcsolódó leírások és tesztek egységesítése kötelező.
- Az automatikus Chromium teszt egyetlen motor és egyetlen mobil viewport; nem bizonyítja az iOS/Android valós működést.

## Következő, kontrollált munkacsomagok
1. **A – Matematika és regresszió lezárása:** szélsőesetek egységes kezelése, kérdésválaszok szakmai ellenőrzése, determinisztikus tesztmátrix. Nincs deploy.
2. **B – Tartalombank és tananyagfedettség:** az eredeti `curriculum.ts` témáit leképezni kidolgozott leckeazonosítókra; prioritásos hiánylista; 35 régi ID megőrzése. Nincs deploy.
3. **C – Tanári műhely MVP:** tanári feladat-összeállítás, nyomtatható/kimenthető óravázlat, tanulói változat; adatok és jogosultságok tisztázása. Nincs deploy.
4. **D – QA és kiadási kapu:** teljes CI, valós eszközös ellenőrzés, export/import visszaállítás, Vercel preview beállítások, rollback pont; csak külön elfogadott összevont élesítés.

## Késznek nyilvánítás feltétele
Az alkalmazás csak akkor nevezhető teljesnek, ha a vállalt témakörök nem pusztán tématérképként, hanem használható leckékként szerepelnek; a tanári célok megvalósultak; a mentési és mobilos ellenőrzés bizonyított; az alkalmazás saját dokumentációja és release-azonosítói naprakészek. **Ezt a feltételt a jelenlegi PR #4 még nem teljesíti.**
