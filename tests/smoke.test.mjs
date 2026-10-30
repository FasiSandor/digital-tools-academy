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

test('unknown lesson IDs block destructive restore but allow merge',()=>{
 for(const token of ["mode==='replace'&&backupPreview.unknown>0","disabled={backupPreview.unknown>0}","A teljes felülírás tiltva van."])assert.ok(main.includes(token),token);
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
 assert.deepEqual(m.readProgress({getItem:()=>null},valid),{completed:[],warning:''});
 assert.deepEqual(m.readProgress({getItem:()=>JSON.stringify(['gg1','gg1','obsolete'])},valid),{completed:['gg1'],warning:''});
 assert.match(m.readProgress({getItem:()=>'{not json'},valid).warning,/hibásak/);
 assert.match(m.readProgress({getItem:()=>JSON.stringify({completed:['gg1']})},valid).warning,/hibásak/);
 assert.match(m.readProgress({getItem:()=>{throw Error('SecurityError')}},valid).warning,/nem olvasható/);
 let persisted='';
 assert.equal(m.writeProgress({setItem:(k,v)=>{assert.equal(k,'dta-progress');persisted=v}},['gg1']),'');
 assert.equal(persisted,'["gg1"]');
 assert.match(m.writeProgress({setItem:()=>{throw Error('QuotaExceededError')}},['gg1']),/nem engedte elmenteni/);
});
test('storage warning is visible and invalid initial state is not immediately overwritten',()=>{
 assert.ok(main.includes('initialProgress.warning&&done.length===0'));
 assert.ok(main.includes('role="alert" className="backup-error">{storageWarning}'));
});
