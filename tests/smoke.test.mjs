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
 for(const token of ['a!==0','delta<0','delta===0','b!==0','vertex','roots','setA(1)']) assert.ok(graph.includes(token),token);
});
test('roadmap and backup features remain available',()=>{
 for(const token of ['curriculum[course]','exportData','importData','dta-progress','setDone','<GraphLab/>']) assert.ok(main.includes(token),token);
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
 for(const token of ['Array.isArray(saved)','new Set(saved.filter','dta-progress','inspectBackup','confirm(']) assert.ok(main.includes(token),token);
});

const phaseTwo=read('../src/phaseTwoLessons.ts');
test('second phase has six unique lessons and is wired into course catalog',()=>{const ids=[...phaseTwo.matchAll(/id:'([^']+)'/g)].map(x=>x[1]);assert.equal(ids.length,6);assert.equal(new Set(ids).size,6);assert.ok(ids.every(id=>!extra.includes("id:'"+id+"'")&&!more.includes("id:'"+id+"'")));assert.ok(main.includes('phaseTwoLessons[course.name]'));});

test('graph lab includes probe point and tangent slope',()=>{for(const token of ['setProbe(1)','2*a*probe+b','probeY+slope*(x-probe)','strokeDasharray','Vizsgált x koordináta'])assert.ok(graph.includes(token),token);});

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
 const preview=mod.inspectBackup({...data,completed:['gg1','gg1','ghost','ds1']},valid);
 assert.equal(preview.unknown,1);assert.equal(preview.duplicates,1);
 assert.deepEqual(mod.restoreProgress(['gg2'],preview,'merge'),['gg2','gg1','ds1']);
 assert.deepEqual(mod.restoreProgress(['gg2'],preview,'replace'),['gg1','ds1']);
 assert.throws(()=>mod.inspectBackup({...data,app:'other'},valid));
 assert.throws(()=>mod.inspectBackup({...data,version:2},valid));
 assert.throws(()=>mod.inspectBackup({...data,completed:[null]},valid));
 assert.throws(()=>mod.inspectBackup({...data,exportedAt:'invalid'},valid));
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
