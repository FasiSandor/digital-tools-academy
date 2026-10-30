import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
const more=read('../src/moreLessons.ts');const main=read('../src/main.tsx'),extra=read('../src/extraLessons.ts'),graph=read('../src/GraphLab.tsx'),curriculum=read('../src/curriculum.ts');
test('three learning platforms and stable initial lesson IDs',()=>{
 for(const id of ['gg1','gg2','gg3','gg4','gg5','ds1','ds2','ds3','wa1','wa2','wa3']) assert.match(main,new RegExp("id:'"+id+"'"));
 for(const platform of ['GeoGebra','Desmos','Wolfram|Alpha']) assert.ok(main.includes("name:'"+platform+"'"));
});
test('12 additional lessons use distinct IDs',()=>{
 const ids=[...extra.matchAll(/id:'([^']+)'/g)].map(x=>x[1]);
 assert.equal(ids.length,12);assert.equal(new Set(ids).size,12);
 assert.ok(ids.every(x=>!main.includes("id:'"+x+"'")));
});
test('graph lab includes critical mathematical cases',()=>{
 for(const token of ['a!==0','delta>0','delta===0','realRoots(a,b,c)','vertex','roots','setA(1)']) assert.ok(graph.includes(token),token);
});
test('roadmap and backup features remain available',()=>{
 for(const token of ['curriculum[course]','exportData','importData','readProgress(localStorage','setDone','<GraphLab/>']) assert.ok(main.includes(token),token);
 for(const token of ['GeoGebra','Desmos','Wolfram|Alpha']) assert.ok(curriculum.includes(token));
});

test('six additional lessons retain distinct stable IDs',()=>{const ids=[...more.matchAll(/id:'([^']+)'/g)].map(m=>m[1]);assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);assert.ok(ids.every(id=>!main.includes("id:'"+id+"'")&&!extra.includes("id:'"+id+"'")));});
test('approved vibrant design and mobile menu exist',()=>{const css=read('../src/style.css');for(const hex of ['#ff1736','#ff8500','#005dff','#00b84a'])assert.ok(css.includes(hex));assert.ok(main.includes('mobile-menu-toggle'));assert.ok(main.includes('hero-progress'));});

test('mobile layout stacks sidebar and content',()=>{
 const css=read('../src/style.css');
 assert.ok(css.includes('.app{display:block;min-width:0}'));
 assert.ok(css.includes('aside.menu-open'));
});
test('lesson search keeps original lesson indices',()=>{
 assert.ok(main.includes('visibleLessons.map(({j,...l})'));
 assert.ok(main.includes('onClick={()=>choose(course,j)}'));
 assert.ok(main.includes('Nincs találat'));
});
test('backup validation and progress persistence are present',()=>{
 for(const token of ['readProgress(localStorage','writeProgress(localStorage','inspectBackup','confirm(']) assert.ok(main.includes(token),token);
});

const phaseTwo=read('../src/phaseTwoLessons.ts');
test('second phase has six unique lessons and is wired into course catalog',()=>{const ids=[...phaseTwo.matchAll(/id:'([^']+)'/g)].map(x=>x[1]);assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);assert.ok(ids.every(id=>!extra.includes("id:'"+id+"'")&&!more.includes("id:'"+id+"'")));assert.ok(main.includes('phaseTwoLessons[course.name]'));});

test('graph lab includes probe point and tangent slope',()=>{for(const token of ['setProbe(1)','derivativeAt(a,b,probe)','probeY+slope*(x-probe)','strokeDasharray','Vizsgált x koordináta'])assert.ok(graph.includes(token),token);});

test('guided graph explanations cover all coefficients and tangent',()=>{for(const token of ['guided-explanation','Az a együttható','A b együttható','A c együttható','A mozgó pont','f′(x) = 2ax+b'])assert.ok(graph.includes(token),token);});

test('guided graph lab offers five reproducible mathematical experiments',()=>{
 for(const token of ['applyPreset(1,0,-2,1)','applyPreset(-1,0,3,1)','applyPreset(0,2,1,1)','applyPreset(0,0,2,1)','applyPreset(1,-2,1,1)'])assert.ok(graph.includes(token),token);
});
test('graph lab supports tangent visibility and immediate prediction feedback',()=>{
 for(const token of ['setShowTangent','showTangent&&','expectedTrend','checkPrediction','role="status"','setPredictionResult(\'\')','type="radio"'])assert.ok(graph.includes(token),token);
 const css=read('../src/style.css');for(const token of ['.graph-presets','.graph-challenge','.graph-choices','@media(max-width:600px)'])assert.ok(css.includes(token),token);
});

test('lesson self-check provides hints, attempt feedback and decimal normalization',()=>{
 for(const token of ['normalizeAnswer','quiz-support','quiz-hint','Segítő tipp','próbálkozás','setAttempts(0)','setShowHint(false)'])assert.ok(main.includes(token),token);
});

test('backup module performs real validation, merge and replace',async()=>{
 const ts=await import('typescript');
 const source=read('../src/backup.ts');
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const mod=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 const valid=new Set(['gg1','gg2','ds1']);
 const data=mod.makeBackup(['gg1','gg1','ds1']);
 assert.deepEqual(data.completed,['gg1','ds1']);
 const preview=await mod.inspectBackup({...data,completed:['gg1','gg1','ghost','ds1']},valid);
 assert.equal(preview.unknown,1);assert.equal(preview.duplicates,1);assert.equal(preview.integrity,'legacy');
 assert.deepEqual(mod.restoreProgress(['gg2'],preview,'merge'),['gg2','gg1','ds1']);
 assert.deepEqual(mod.restoreProgress(['gg2'],preview,'replace'),['gg1','ds1']);
 const signed=await mod.makeVerifiedBackup(['gg1','ds1']);
 assert.match(signed.checksum,/^[0-9a-f]{64}$/);
 assert.equal(signed.manifest.count,2);
 assert.equal((await mod.inspectBackup(signed,valid)).integrity,'verified');
 await assert.rejects(()=>mod.inspectBackup({...signed,completed:['gg1']},valid),/állományjegyzék/);
 await assert.rejects(()=>mod.inspectBackup({...signed,completed:['ds1','gg1']},valid),/ellenőrzőösszege/);
 await assert.rejects(()=>mod.inspectBackup({...signed,checksum:'bad'},valid),/ellenőrzőösszeg/);
 await assert.rejects(()=>mod.inspectBackup({...data,app:'other'},valid));
 await assert.rejects(()=>mod.inspectBackup({...data,version:2},valid));
 await assert.rejects(()=>mod.inspectBackup({...data,completed:[null]},valid));
 await assert.rejects(()=>mod.inspectBackup({...data,exportedAt:'invalid'},valid));
});
test('backup preview and both restoration modes are available in settings',()=>{
 for(const token of ['inspectBackup','restoreProgress','Mentés előnézete','Haladás egyesítése','Teljes visszaállítás','backupError'])assert.ok(main.includes(token),token);
});

test('unknown lesson IDs block destructive restore and merge',()=>{
 for(const token of ["if(backupPreview.unknown>0){setBackupError(","disabled={recoveryRequired||backupPreview.unknown>0}","Az egyesítés és a teljes felülírás tiltva van."])assert.ok(main.includes(token),token);
});

test('settings exposes clickable production and Vercel project links',()=>{
 for(const token of ['href="https://digital-tools-academy.vercel.app"','href="https://vercel.com/fasi-sandor-s-projects/digital-tools-academy"'])assert.ok(main.includes(token),token);
});

test('course switches clear search and answer edits clear stale feedback',()=>{
 assert.ok(main.includes("if(i!==course)setSearch('')"));
 assert.ok(main.includes("setAnswer(e.target.value);setFeedback('')"));
});

test('graph explains discriminant and line/constant edge cases',()=>{
 for(const token of ['Diszkrimináns és zérushelyek','D = b² − 4ac','delta>0','delta===0','Lineáris esetben','Minden x értéknél f(x)=0'])assert.ok(graph.includes(token),token);
});

test('new export and import await checksum verification',()=>{
 for(const token of ['await makeVerifiedBackup(done)','await inspectBackup(raw,valid)','SHA-256 ellenőrzött','Régi mentés, ellenőrzőösszeg nélkül'])assert.ok(main.includes(token),token);
});

test('all 35 published lessons have unique IDs and nonempty learning elements',()=>{
 const sources=[main,extra,more,phaseTwo];
 const ids=sources.flatMap(src=>[...src.matchAll(/id:'([^']+)'/g)].map(m=>m[1]));
 assert.equal(ids.length,35,'lesson count changed unexpectedly');
 assert.equal(new Set(ids).size,ids.length,'duplicate lesson ID would corrupt progress');
 for(const src of [extra,more,phaseTwo]){
  const lessons=[...src.matchAll(/\{id:'([^']+)',title:'([^']+)',summary:'([^']+)',steps:\[([\s\S]*?)\],task:'([^']+)',answer:'([^']+)',url:'(https:\/\/[^']+)'/g)];
  assert.ok(lessons.length>0,'lesson bank must remain parseable');
  for(const l of lessons){assert.ok(l[2].trim()&&l[3].trim()&&l[4].trim()&&l[5].trim()&&l[6].trim()&&l[7].trim(),l[1]);}
 }
});

test('PWA manifest, install links and branded PNG icons are valid',()=>{
 const manifest=JSON.parse(read('../public/manifest.webmanifest'));
 assert.equal(manifest.id,'/');
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.lang,'hu');
 for(const size of [192,512]){
  const icon=readFileSync(new URL('../public/icons/dta-'+size+'.png',import.meta.url));
  assert.equal(icon.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  assert.equal(icon.readUInt32BE(16),size);
  assert.equal(icon.readUInt32BE(20),size);
  assert.ok(manifest.icons.some(i=>i.src==='/icons/dta-'+size+'.png'&&i.sizes===size+'x'+size));
 }
 const apple=readFileSync(new URL('../public/icons/dta-180.png',import.meta.url));
 assert.equal(apple.readUInt32BE(16),180);
 assert.equal(apple.readUInt32BE(20),180);
 const html=read('../index.html');
 for(const token of ['rel="manifest"','rel="apple-touch-icon"','/icons/dta-180.png'])assert.ok(html.includes(token),token);
 assert.ok(main.includes('settings-app-icon'));
});

test('pure graph math: parabola, line, constant and exact root cases',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/graphMath.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 assert.equal(m.evaluateQuadratic(1,0,-2,3),7);
 assert.equal(m.derivativeAt(1,0,2),4);
 assert.deepEqual(m.realRoots(1,-2,1),[1]);
 assert.deepEqual(m.realRoots(1,0,1),[]);
 assert.deepEqual(m.realRoots(0,2,4),[-2]);
 assert.deepEqual(m.realRoots(0,0,3),[]);
 assert.deepEqual(m.realRoots(0,0,0),[]);
 const roots=m.realRoots(1,0,-4);assert.deepEqual(roots,[-2,2]);
 const samples=m.sampleAround(1,-2,1,1);
 assert.equal(samples.length,5);
 assert.deepEqual(samples[2],{x:1,y:0,derivative:0,offset:0});
 assert.deepEqual(samples.map(s=>s.x),[0,0.5,1,1.5,2]);
 assert.deepEqual(samples.map(s=>s.y),[1,0.25,0,0.25,1]);
});
test('live graph has a readable table with highlighted probe row',()=>{
 for(const token of ['sampleAround(a,b,c,probe)','graph-values','graph-table-scroll','scope="col"','scope="row"','graph-current-row'])assert.ok(graph.includes(token),token);
 const css=read('../src/style.css');for(const token of ['.graph-values','.graph-table-scroll','.graph-current-row'])assert.ok(css.includes(token),token);
});

test('local progress storage preserves corrupt data and reports quota failures',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/progressStorage.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 const valid=new Set(['gg1','gg2']);
 assert.deepEqual(m.readProgress({getItem:()=>null},valid),{completed:[],warning:'',requiresRecovery:false});
 assert.deepEqual(m.readProgress({getItem:()=>JSON.stringify(['gg1','gg1'])},valid),{completed:['gg1'],warning:'',requiresRecovery:false});
 const foreign=m.readProgress({getItem:()=>JSON.stringify(['gg1','gg1','obsolete'])},valid);
 assert.deepEqual(foreign.completed,['gg1']);
 assert.equal(foreign.requiresRecovery,true);
 assert.match(foreign.warning,/ismeretlen leckeazonosítót/);
 assert.equal(m.readProgress({getItem:()=>JSON.stringify(['obsolete'])},valid).requiresRecovery,true);
 assert.match(m.readProgress({getItem:()=>'{not json'},valid).warning,/hibásak/);
 assert.match(m.readProgress({getItem:()=>JSON.stringify({completed:['gg1']})},valid).warning,/hibásak/);
 assert.match(m.readProgress({getItem:()=>{throw Error('SecurityError')}},valid).warning,/nem olvasható/);
 let persisted='';
 assert.equal(m.writeProgress({setItem:(k,v)=>{assert.equal(k,'dta-progress');persisted=v}},['gg1']),'');
 assert.equal(persisted,'["gg1"]');
 assert.match(m.writeProgress({setItem:()=>{throw Error('QuotaExceededError')}},['gg1']),/nem engedte elmenteni/);
});
test('storage warning is visible and invalid initial state is not immediately overwritten',()=>{
 assert.ok(main.includes('if(recoveryRequired)return;'));
 assert.ok(main.includes('role="alert" className="backup-error">{storageWarning}'));
});

test('recovery gate protects damaged browser progress',()=>{
 assert.ok(main.includes('recoveryRequired?setStorageWarning'));
 assert.ok(main.includes('setRecoveryRequired(false);setDone(next)'));
 assert.ok(main.includes('setRecoveryRequired(false);setDone([])'));
});

test('corrupted local progress cannot be merged into a backup',()=>{
 assert.ok(main.includes("if(recoveryRequired&&mode==='merge')"));
 assert.ok(main.includes("disabled={recoveryRequired}"));
 assert.ok(main.includes('Az egyesítés nem használható'));
 assert.ok(main.includes("setRecoveryRequired(false);setDone(next)"));
});

test('graph grid uses the same mathematical scale as the plotted curve',()=>{
 assert.ok(graph.includes("x1={xPx(x)}"));
 assert.ok(graph.includes("y1={yPx(y)}"));
 assert.ok(graph.includes("key={'xt'+x}"));
 assert.ok(graph.includes("key={'yt'+y}"));
 assert.equal(graph.includes("x1={10+i*20}"),false);
 assert.equal(graph.includes("y1={5+i*20}"),false);
});

test('secant slope converges to the tangent and handles all function types',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/graphMath.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 assert.equal(m.secantSlope(1,0,-2,1,2),4);
 assert.equal(m.secantSlope(1,0,-2,1,0.1),2.1);
 assert.ok(Math.abs(m.secantSlope(1,0,-2,1,0.0001)-m.derivativeAt(1,0,1))<0.001);
 assert.equal(m.secantSlope(0,2,1,3,0.1),2);
 assert.equal(m.secantSlope(0,0,2,3,0.1),0);
 assert.throws(()=>m.secantSlope(1,0,0,0,0),RangeError);
 assert.ok(graph.includes('aria-label="Szelő lépésköze h"'));
 assert.ok(graph.includes('showSecant&&<path d={secantPath}'));
 assert.ok(graph.includes("showSecant&&marker(probe+stepH,secantY,'Q')"));
});

test('unreadable local progress cannot be exported as a misleading empty backup',()=>{
 assert.ok(main.includes("if(recoveryRequired){setBackupError('A helyi haladás sérült"));
 assert.ok(main.includes("onClick={exportData} disabled={recoveryRequired}"));
 assert.ok(main.includes('Az exportálás zárolva van'));
});

test('backups with unknown lesson IDs cannot be partially merged or restored',()=>{
 assert.ok(main.includes("if(backupPreview.unknown>0){setBackupError("));
 assert.ok(main.includes("disabled={recoveryRequired||backupPreview.unknown>0}"));
 assert.ok(main.includes("Az egyesítés és a teljes felülírás tiltva van."));
});

test('recovery offers a raw text snapshot without pretending it is a verified backup',()=>{
 assert.ok(main.includes("const exportRawRecovery=()=>{if(!recoveryRequired)return;"));
 assert.ok(main.includes("localStorage.getItem('dta-progress')"));
 assert.ok(main.includes("digital-tools-academy-eredeti-helyi-adat.txt"));
 assert.ok(main.includes("Ez nem ellenőrzött alkalmazásmentés"));
 assert.ok(main.includes("{recoveryRequired&&<button onClick={exportRawRecovery}>"));
});

test('secant convergence table is mathematically correct for quadratic, linear and constant cases',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/graphMath.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 const rows=m.secantConvergence(1,0,-2,1);
 assert.deepEqual(rows.map(r=>r.h),[2,1,0.5,0.1]);
 assert.deepEqual(rows.map(r=>r.secant),[4,3,2.5,2.1]);
 assert.deepEqual(rows.map(r=>r.tangent),[2,2,2,2]);
 assert.ok(rows.every((r,i)=>i===0||r.difference<rows[i-1].difference));
 for(const [a,b,c] of [[0,2,1],[0,0,2]]){
  assert.ok(m.secantConvergence(a,b,c,1).every(r=>r.difference===0));
 }
 for(const token of ['secantConvergence(a,b,c,probe)','Hogyan lesz a szelőből érintő?','A szelő meredekségének közelítése a deriválthoz','|ah|'])assert.ok(graph.includes(token),token);
});

test('user polynomial input parses safely and handles negative and decimal coefficients',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/functionInput.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 for(const [input,expected] of [
  ['f(x)=2x²-3x+1',[2,-3,1]],
  ['-x^2+2x+3',[-1,2,3]],
  ['y=3',[0,0,3]],
  ['2x-1',[0,2,-1]],
  ['x²-4',[1,0,-4]],
  ['0,5x²+1,5x-2',[0.5,1.5,-2]],
  ['-x', [0,-1,0]]
 ]){const {a,b,c}=m.parsePolynomial(input);assert.deepEqual([a,b,c],expected,input);}
 for(const invalid of ['sin(x)','x^3','x/x','x²+x²','x++2','2*(x+1)','', 'x;alert(1)'])assert.throws(()=>m.parsePolynomial(invalid),undefined,invalid);
 for(const token of ['Saját függvényem – ábrázolás lépésről lépésre','Ábrázolás indítása','Következő lépés','parsePolynomial(functionText)','guidedSteps[guidedStep]'])assert.ok(graph.includes(token),token);
});

test('automatic viewport includes roots, vertex, probe and readable axis ticks',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/graphMath.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 for(const [a,b,c,x] of [[1,0,-2,1],[2,-3,1,0],[1,-20,0,10],[0,0,300,1],[0,2,-100,0],[-1,2,3,1]]){
  const v=m.graphViewport(a,b,c,x);
  assert.ok(Object.values(v).every(Number.isFinite),JSON.stringify(v));
  assert.ok(v.xMin<=x&&v.xMax>=x);
  assert.ok(v.yMin<=m.evaluateQuadratic(a,b,c,x)&&v.yMax>=m.evaluateQuadratic(a,b,c,x));
  for(const root of m.realRoots(a,b,c))assert.ok(root>=v.xMin&&root<=v.xMax);
  if(a!==0){const vertex=-b/(2*a);assert.ok(vertex>=v.xMin&&vertex<=v.xMax);}
  for(const [lo,hi] of [[v.xMin,v.xMax],[v.yMin,v.yMax]]){const ticks=m.graphTicks(lo,hi);assert.ok(ticks.length>=2&&ticks.length<=12);assert.ok(ticks.every((t,i)=>t>=lo&&t<=hi&&(i===0||t>ticks[i-1])));}
 }
 const normal=m.graphViewport(1,0,-2,1);
 const close=m.graphViewport(1,0,-2,1,0.5);
 const far=m.graphViewport(1,0,-2,1,2);
 assert.ok(close.xMax-close.xMin<normal.xMax-normal.xMin);
 assert.ok(far.xMax-far.xMin>normal.xMax-normal.xMin);
 for(const token of ['graphViewport(a,b,c,probe,zoom)','graphTicks(viewport.xMin,viewport.xMax)','Nagyítás +','Kicsinyítés −','Automatikus nézet'])assert.ok(graph.includes(token),token);
});

test('extended functions safely parse, evaluate and explain three families',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/extendedFunctions.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 for(const [input,kind,a,h,k] of [
 ['|x−2|+1','absolute',1,2,1],
 ['−2|x+1|+3','absolute',-2,-1,3],
 ['x³−2','cubic',1,0,-2],
 ['(x−1)³+2','cubic',1,1,2],
 ['1/(x−2)+1','reciprocal',1,2,1],
 ['-1/x','reciprocal',-1,0,0],
 ['-x³','cubic',-1,0,0]
 ]){const fn=m.parseExtendedFunction(input);assert.deepEqual([fn.kind,fn.a,fn.h,fn.k],[kind,a,h,k],input);assert.equal(m.extendedFacts(fn).steps.length,6);}
 const abs=m.parseExtendedFunction('|x−2|+1');
 assert.equal(m.evaluateExtended(abs,2),1);assert.equal(m.evaluateExtended(abs,0),3);
 const cubic=m.parseExtendedFunction('(x−1)³+2');
 assert.equal(m.evaluateExtended(cubic,1),2);assert.equal(m.evaluateExtended(cubic,3),10);
 const reciprocal=m.parseExtendedFunction('1/(x−2)+1');
 assert.equal(m.evaluateExtended(reciprocal,2),null);
 assert.equal(m.evaluateExtended(reciprocal,3),2);
 assert.match(m.extendedFacts(reciprocal).domain,/kivéve x = 2/);
 for(const bad of ['sin(x)','x^4','eval(1)','x/x','1/(x-2)^2','2x³+3x',''])assert.throws(()=>m.parseExtendedFunction(bad),undefined,bad);
 const ui=read('../src/ExtendedGraphLab.tsx');
 for(const token of ['Értéktáblázat a nevezetes pont körül','Nincs értelmezve','extended-clip','Következő lépés','parseExtendedFunction(value)'])assert.ok(ui.includes(token),token);
 assert.ok(graph.includes('<ExtendedGraphLab/>'));
});

test('function analysis and practice: roots, asymptotes, monotonicity, feedback',async()=>{
 const ts=await import('typescript');
 const extJs=ts.transpileModule(read('../src/extendedFunctions.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const analysisJs=ts.transpileModule(read('../src/functionAnalysis.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replaceAll("from './extendedFunctions'","from 'data:text/javascript;base64,"+Buffer.from(extJs).toString('base64')+"'");
 const e=await import('data:text/javascript;base64,'+Buffer.from(extJs).toString('base64'));
 const a=await import('data:text/javascript;base64,'+Buffer.from(analysisJs).toString('base64'));
 const abs=a.analyzeExtended(e.parseExtendedFunction('|x-2|+1'));
 assert.deepEqual(abs.zeros,[]);assert.equal(abs.criticalPoint.type,'minimum');
 const abs2=a.analyzeExtended(e.parseExtendedFunction('|x|-2'));
 assert.deepEqual(abs2.zeros,[-2,2]);
 const cubic=a.analyzeExtended(e.parseExtendedFunction('(x-1)^3+2'));
 assert.ok(cubic.criticalPoint.type.includes('nem szélsőérték'));
 assert.ok(Math.abs(cubic.zeros[0]-(1-Math.cbrt(2)))<1e-10);
 const recip=a.analyzeExtended(e.parseExtendedFunction('1/(x-2)+1'));
 assert.deepEqual(recip.zeros,[1]);assert.equal(recip.intercept,0.5);
 assert.equal(recip.asymptotes.length,2);
 assert.ok(recip.monotonic.every(s=>s.includes('Csökken')));
 for(const fn of [e.parseExtendedFunction('|x|'),e.parseExtendedFunction('x^3'),e.parseExtendedFunction('1/x')]){
  const qs=a.practiceFor(fn);assert.equal(qs.length,3);assert.ok(qs.every(q=>q.correct>=0&&q.correct<3));assert.ok(qs.every(q=>q.options.length===3&&new Set(q.options).size===3&&q.explanation.length>5));
 }
 const ui=read('../src/FunctionInvestigation.tsx');
 for(const token of ['Részletes megoldás megjelenítése','Gyakorlás újrakezdése','Eredmény:','setAnswers','analysis.monotonic'])assert.ok(ui.includes(token),token);
});

test('numeric exercise generation and Hungarian answer parsing',async()=>{
 const ts=await import('typescript');
 const compilerOptions={target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext};
 const ext=ts.transpileModule(read('../src/extendedFunctions.ts'),{compilerOptions}).outputText;
 const extUri='data:text/javascript;base64,'+Buffer.from(ext).toString('base64');
 const numeric=ts.transpileModule(read('../src/numericPractice.ts'),{compilerOptions}).outputText.replaceAll("from './extendedFunctions'",'from '+JSON.stringify(extUri));
 const e=await import(extUri);
 const n=await import('data:text/javascript;base64,'+Buffer.from(numeric).toString('base64'));
 for(const [expr,expected] of [['|x−2|+1',[3,2,1]],['(x−1)³+2',[10,1,2]],['1/(x−2)+1',[1.5,2,1]]]){
  const tasks=n.numericTasks(e.parseExtendedFunction(expr));
  assert.deepEqual(tasks.map(t=>t.answer),expected,expr);
  assert.equal(tasks.length,3);
  assert.equal(n.checkNumericAnswer(String(expected[0]).replace('.',','),tasks[0].answer),'correct');
 }
 for(const invalid of ['NaN','Infinity','2+2','1e10','0x10','1,2,3','<script>'])assert.equal(n.parseNumericAnswer(invalid),null);
 assert.equal(n.checkNumericAnswer('','2'),'empty');
 assert.equal(n.checkNumericAnswer('abc',2),'invalid');
 assert.equal(n.checkNumericAnswer('2,004',2),'correct');
 assert.equal(n.checkNumericAnswer('2,01',2),'incorrect');
 assert.equal(n.parseNumericAnswer('−2,5'),-2.5);
 const shifted=e.parseExtendedFunction('|x−2|+1');
 const shiftedTasks=n.numericTasks(shifted);
 assert.equal(n.explainNumericAnswer(shifted,shiftedTasks[0],'2').category,'shift');
 assert.match(n.explainNumericAnswer(shifted,shiftedTasks[0],'2').hint,/eltolás/);
 assert.match(n.explainNumericAnswer(shifted,shiftedTasks[0],'2').worked,/3\./);
 assert.equal(n.explainNumericAnswer(shifted,shiftedTasks[1],'-2').category,'sign');
 assert.equal(n.explainNumericAnswer(shifted,shiftedTasks[0],'3').category,'correct');
 assert.equal(n.explainNumericAnswer(shifted,shiftedTasks[0],'abc').category,'invalid');
 const stretched=e.parseExtendedFunction('-2|x+1|+3');
 assert.match(n.explainNumericAnswer(stretched,n.numericTasks(stretched)[0],'5').hint,/együtthatóval/);
 for(const [expr,expected] of [['|x−2|+1',[3,4,5,3,4]],['(x−1)³+2',[10,-25,66,-6,29]],['1/(x−2)+1',[1.5,2/3,1.25,0.5,4/3]]]){
  const fn=e.parseExtendedFunction(expr);
  for(let round=0;round<5;round++){
   const task=n.numericTasks(fn,round)[0];
   assert.ok(Math.abs(task.answer-expected[round])<1e-10,expr+' round '+round);
   assert.ok(n.explainNumericAnswer(fn,task,String(task.answer),round).worked.includes('Belső kifejezés'));
  }
 }
 assert.match(n.numericHint(e.parseExtendedFunction('|x|'),n.numericTasks(e.parseExtendedFunction('|x|'))[0],1),/Helyettesítsd/);
 assert.match(n.numericHint(e.parseExtendedFunction('1/x'),n.numericTasks(e.parseExtendedFunction('1/x'))[0],2),/reciprok/);
 const ui=read('../src/FunctionInvestigation.tsx');
 for(const token of ['Számolási feladatok – saját eredménnyel','Számolási feladatok ellenőrzése','Számolás újrakezdése','inputMode="decimal"','setNumericChecked(false)'])assert.ok(ui.includes(token),token);
});

test('session practice summary is deterministic and does not persist progress',async()=>{
 const ts=await import('typescript');
 const js=ts.transpileModule(read('../src/practiceSummary.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const m=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 assert.deepEqual(m.summarizeAttempts([]),{attempts:0,best:0,average:0,totalCorrect:0,totalQuestions:0,hintUses:0,completedRounds:0});
 const attempts=[{round:1,correct:2,total:3,hints:1,timestamp:'2026-10-30T08:00:00Z'},{round:2,correct:3,total:3,hints:0,timestamp:'2026-10-30T08:05:00Z'},{round:2,correct:1,total:3,hints:2,timestamp:'2026-10-30T08:10:00Z'}];
 const s=m.summarizeAttempts(attempts);
 assert.equal(s.average,66.7);assert.equal(s.completedRounds,2);assert.equal(s.hintUses,3);assert.equal(s.best,3);
 assert.match(m.formatPracticeReport('f(x)',attempts),/6 \/ 9/);
 const ui=read('../src/FunctionInvestigation.tsx');
 for(const token of ['setAttempts','Eredmények törlése','Másolható gyakorlási összesítő','csak ebben a megnyitott munkamenetben'])assert.ok(ui.includes(token),token);
});

test('zero-numerator reciprocal has a hole rather than a vertical asymptote',()=>{
 const analysis=read('../src/functionAnalysis.ts');
 const graph=read('../src/ExtendedGraphLab.tsx');
 assert.ok(analysis.includes("asymptotes:a===0?"),'zero coefficient must have its own asymptote case');
 assert.ok(graph.includes("fn.kind==='reciprocal'&&fn.a!==0"),'no vertical asymptote should be drawn when a=0');
 assert.ok(graph.includes("hiányzó pont, nem függőleges aszimptota"));
});

test('GeoGebra multi-method workshop has stable unique content and is course-scoped',async()=>{
 const ts=await import('typescript');
 const source=read('../src/geoTips.ts');
 const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
 const bank=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 assert.ok(bank.geoTips.length>=15);
 assert.equal(new Set(bank.geoTips.map(t=>t.id)).size,bank.geoTips.length);
 for(const t of bank.geoTips){
  assert.ok(t.title&&t.goal&&t.challenge&&t.reason&&t.link.startsWith('https://www.geogebra.org/'));
  assert.ok(t.methods.length>=2&&t.methods.every(m=>m.steps.length>=2&&m.when));
  assert.ok(t.options.length===3&&t.correct>=0&&t.correct<t.options.length);
 }
 assert.ok(bank.filterGeoTips('érintő','Mind').length>=1);
 assert.ok(bank.filterGeoTips('','CAS').every(t=>t.category==='CAS'));
 const app=read('../src/main.tsx'),ui=read('../src/GeoTipsLab.tsx');
 assert.ok(app.includes('course===0&&<GeoTipsLab/>'));
 for(const token of ['aria-pressed','Válasz ellenőrzése','Kipróbálás a GeoGebrában','type="search"'])assert.ok(ui.includes(token));
});
