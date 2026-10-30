export const BACKUP_APP='digital-tools-academy';
export type BackupMode='replace'|'merge';
export type BackupData={app:string;version:1;exportedAt:string;completed:string[];checksum?:string;manifest?:{file:string;count:number}};
export type BackupPreview={completed:string[];unknown:number;duplicates:number;date:string;integrity:'verified'|'legacy'};
const canonical=(d:Pick<BackupData,'app'|'version'|'exportedAt'|'completed'>)=>JSON.stringify({app:d.app,version:d.version,exportedAt:d.exportedAt,completed:d.completed});
export async function sha256(text:string):Promise<string>{
 const bytes=new TextEncoder().encode(text);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
}
export function makeBackup(completed:string[]):BackupData{
 return {app:BACKUP_APP,version:1,exportedAt:new Date().toISOString(),completed:[...new Set(completed)]};
}
export async function makeVerifiedBackup(completed:string[]):Promise<BackupData>{
 const data=makeBackup(completed);
 return {...data,manifest:{file:'completed',count:data.completed.length},checksum:await sha256(canonical(data))};
}
export async function inspectBackup(raw:unknown,validIds:ReadonlySet<string>):Promise<BackupPreview>{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('A mentés nem megfelelő JSON-objektum.');
 const d=raw as Record<string,unknown>;
 if(d.app!==BACKUP_APP||d.version!==1||typeof d.exportedAt!=='string'||!Number.isFinite(Date.parse(d.exportedAt)))throw Error('Nem támogatott alkalmazás, verzió vagy dátum.');
 if(!Array.isArray(d.completed)||!d.completed.every((id:unknown)=>typeof id==='string'))throw Error('Hibás leckeazonosítók.');
 if(d.completed.length>100000)throw Error('Túl nagy mentés.');
 let integrity:'verified'|'legacy'='legacy';
 if(d.checksum!==undefined||d.manifest!==undefined){
  if(typeof d.checksum!=='string'||!/^([0-9a-f]{64})$/.test(d.checksum)||!d.manifest||typeof d.manifest!=='object'||Array.isArray(d.manifest))throw Error('Hiányos vagy sérült ellenőrzőösszeg.');
  const m=d.manifest as Record<string,unknown>;
  if(m.file!=='completed'||m.count!==d.completed.length)throw Error('Hibás mentési állományjegyzék.');
  const expected=await sha256(canonical(d as BackupData));
  if(expected!==d.checksum)throw Error('A mentés ellenőrzőösszege nem egyezik. A fájl módosult vagy sérült.');
  integrity='verified';
 }
 const ids=d.completed as string[];
 return {completed:[...new Set(ids.filter(id=>validIds.has(id)))],unknown:ids.filter(id=>!validIds.has(id)).length,duplicates:ids.length-new Set(ids).size,date:d.exportedAt as string,integrity};
}
export function restoreProgress(current:string[],preview:BackupPreview,mode:BackupMode):string[]{
 return mode==='merge'?[...new Set([...current,...preview.completed])]:[...preview.completed];
}
