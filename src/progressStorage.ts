/** Local progress storage. Never silently claim persistence when browser storage fails. */
export const PROGRESS_KEY='dta-progress';
export type ProgressLoad={completed:string[];warning:string};
export function readProgress(storage:Pick<Storage,'getItem'>,validIds:ReadonlySet<string>):ProgressLoad{
 try{
  const raw=storage.getItem(PROGRESS_KEY);
  if(raw===null)return {completed:[],warning:''};
  let parsed:unknown;
  try{parsed=JSON.parse(raw)}catch{return {completed:[],warning:'A helyi haladás adatai hibásak. A korábbi adatot nem írtuk felül; exportálás vagy helyreállítás előtt ellenőrizd a böngésző tárhelyét.'}}
  if(!Array.isArray(parsed)||!parsed.every((id:unknown)=>typeof id==='string')){
   return {completed:[],warning:'A helyi haladás adatai hibásak. A korábbi adatot nem írtuk felül; exportálás vagy helyreállítás előtt ellenőrizd a böngésző tárhelyét.'};
  }
  const completed=[...new Set((parsed as string[]).filter(id=>validIds.has(id)))];
  return {completed,warning:''};
 }catch{
  return {completed:[],warning:'A böngésző helyi tárhelye nem olvasható. A haladás nem biztos, hogy visszaállítható.'};
 }
}
export function writeProgress(storage:Pick<Storage,'setItem'>,completed:string[]):string{
 try{storage.setItem(PROGRESS_KEY,JSON.stringify(completed));return '';}
 catch{return 'A böngésző nem engedte elmenteni a haladást. Exportáld a jelenlegi adatokat JSON-fájlba, mielőtt bezárod az alkalmazást.';}
}
