export const BACKUP_APP='digital-tools-academy';
export type BackupMode='replace'|'merge';
export type BackupData={app:string;version:1;exportedAt:string;completed:string[]};
export type BackupPreview={completed:string[];unknown:number;duplicates:number;date:string};
export function makeBackup(completed:string[]):BackupData{
 return {app:BACKUP_APP,version:1,exportedAt:new Date().toISOString(),completed:[...new Set(completed)]};
}
export function inspectBackup(raw:unknown,validIds:ReadonlySet<string>):BackupPreview{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('A mentés nem megfelelő JSON-objektum.');
 const d=raw as Record<string,unknown>;
 if(d.app!==BACKUP_APP||d.version!==1||typeof d.exportedAt!=='string'||!Number.isFinite(Date.parse(d.exportedAt)))throw Error('Nem támogatott alkalmazás, verzió vagy dátum.');
 if(!Array.isArray(d.completed)||!d.completed.every((id:unknown)=>typeof id==='string'))throw Error('Hibás leckeazonosítók.');
 if(d.completed.length>100000)throw Error('Túl nagy mentés.');
 const ids=d.completed as string[];
 return {completed:[...new Set(ids.filter(id=>validIds.has(id)))],unknown:ids.filter(id=>!validIds.has(id)).length,duplicates:ids.length-new Set(ids).size,date:d.exportedAt};
}
export function restoreProgress(current:string[],preview:BackupPreview,mode:BackupMode):string[]{
 return mode==='merge'?[...new Set([...current,...preview.completed])]:[...preview.completed];
}
