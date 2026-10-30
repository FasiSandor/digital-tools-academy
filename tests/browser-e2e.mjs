import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';

const watchdog=setTimeout(()=>{console.error('Browser E2E exceeded 120 seconds');process.exit(1)},120000);
const port=4177,base='http://127.0.0.1:'+port;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'pipe'});
let output='';
server.stdout.on('data',chunk=>{output+=chunk.toString()});
server.stderr.on('data',chunk=>{output+=chunk.toString()});
let browser;
async function ready(){
 for(let i=0;i<60;i++){
  if(server.exitCode!==null)throw Error('Preview server exited: '+output);
  try{const r=await fetch(base);if(r.ok)return}catch{}
  await delay(250);
 }
 throw Error('Preview server did not start: '+output);
}
async function open(context){const page=await context.newPage();await page.goto(base);await page.getByRole('heading',{name:'GeoGebra'}).first().waitFor();return page}
async function settings(page){await page.getByRole('button',{name:'Beállítások'}).click();await page.getByRole('heading',{name:'Adatok és biztonsági mentés'}).waitFor()}
async function upload(page,data){
 await page.locator('input[type=file]').setInputFiles({name:'dta-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
 await page.getByRole('heading',{name:'Mentés előnézete'}).waitFor();
}
const backup=(completed)=>({app:'digital-tools-academy',version:1,exportedAt:'2026-10-30T00:00:00.000Z',completed});
try{
 await ready();
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});
 const page=await open(context);
 await page.getByText('Interaktív függvénylabor megnyitása').click();
 const secantToggle=page.getByRole('checkbox',{name:'Szelő megjelenítése'});
 await secantToggle.check();
 assert.equal(await secantToggle.isChecked(),true);
 const hSlider=page.getByRole('slider',{name:'Szelő lépésköze h'});
 await hSlider.fill('0.1');
 await page.getByText('Szelő meredeksége: 2,1').waitFor();
 assert.match(await page.locator('.graphlab').innerText(),/Eltérés: 0,1/);
 await page.getByRole('button',{name:'Alaphelyzet'}).click();
 assert.equal(await secantToggle.isChecked(),false);
 const manifest=await page.evaluate(async()=>{const r=await fetch('/manifest.webmanifest');return r.json()});
 assert.equal(manifest.display,'standalone');
 assert.equal(manifest.icons.some(i=>i.sizes==='512x512'),true);
 await page.getByRole('button',{name:'Menü megnyitása'}).click();
 await settings(page);
 const icon=page.getByRole('img',{name:'Digitális Akadémia alkalmazásikon'});
 assert.equal(await icon.isVisible(),true);
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:/Exportálás/}).click();
 const download=await downloadPromise;
 const exported=JSON.parse((await (await import('node:fs/promises')).readFile(await download.path())).toString());
 assert.equal(exported.app,'digital-tools-academy');
 assert.match(exported.checksum,/^[a-f0-9]{64}$/);
 assert.equal(exported.manifest.count,0);
 await upload(page,exported);
 assert.equal(await page.getByText('SHA-256 ellenőrzött').count(),1);
 await page.getByRole('button',{name:'Mégse'}).click();
 await upload(page,backup(['gg1']));
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Teljes visszaállítás'}).click();
 await page.reload();
 await page.getByRole('button',{name:'Menü megnyitása'}).click();
 await settings(page);
 assert.match(await page.locator('main').innerText(),/1 \/ 35/);
 const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('dta-progress')));
 assert.deepEqual(persisted,['gg1']);
 await page.evaluate(()=>localStorage.setItem('dta-progress','{corrupt'));
 await page.reload();
 await page.getByRole('button',{name:'Menü megnyitása'}).click();
 await settings(page);
 assert.match(await page.locator('main').innerText(),/helyi haladás adatai hibásak/);
 assert.equal(await page.getByRole('button',{name:/Exportálás/}).isDisabled(),true);
 await upload(page,backup(['gg1']));
 assert.equal(await page.getByRole('button',{name:'Haladás egyesítése'}).isDisabled(),true);
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Teljes visszaállítás'}).click();
 await page.waitForFunction(()=>localStorage.getItem('dta-progress')==='["gg1"]');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('dta-progress'))),['gg1']);
 assert.equal(await page.getByRole('button',{name:/Exportálás/}).isEnabled(),true);
 console.log('Browser E2E passed: mobile menu, PWA manifest/icon, SHA-256 export, import, persisted restore and corrupted-progress recovery.');
}finally{
 if(browser)await browser.close();
 server.kill('SIGTERM');
 clearTimeout(watchdog);
}
