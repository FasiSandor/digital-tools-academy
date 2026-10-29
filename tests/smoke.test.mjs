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
