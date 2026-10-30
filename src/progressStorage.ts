/** Local progress storage. Never silently claim persistence when browser storage fails. */
export const PROGRESS_KEY='dta-progress';
export type ProgressLoad={completed:string[];warning:string;requiresRecovery:boolean};
export function readProgress(storage:Pick<Storage,'getItem'>,validIds:ReadonlySet<string>):ProgressLoad{
 try{
  const raw=storage.getItem(PROGRESS_KEY);
  if(raw===null)return {completed:[],warning:'',requiresRecovery:false};
  let parsed:unknown;
  try{parsed=JSON.parse(raw)}catch{return {completed:[],warning:'A helyi haladás adatai hibásak. A korábbi adatot nem írtuk felül; exportálás vagy helyreállítás előtt ellenőrizd a böngésző tárhelyét.',requiresRecovery:true}}
  if(!Array.isArray(parsed)||!parsed.every((id:unknown)=>typeof id==='string')){
   return {completed:[],warning:'A helyi haladás adatai hibásak. A korábbi adatot nem írtuk felül; exportálás vagy helyreállítás előtt ellenőrizd a böngésző tárhelyét.',requiresRecovery:true};
  }
  const unknown=(parsed as string[]).filter(id=>!validIds.has(id));
  const completed=[...new Set((parsed as string[]).filter(id=>validIds.has(id)))];
  if(unknown.length)return {completed,warning:`A helyi haladás ${unknown.length} jelenleg ismeretlen leckeazonosítót tartalmaz. Az eredeti adatokat nem írtuk felül. A mentés és az új eredmények mentése zárolva van, amíg helyre nem állítod az adatokat vagy meg nem erősíted az újrakezdést.`,requiresRecovery:true};
  return {completed,warning:'',requiresRecovery:false};
 }catch{
  return {completed:[],warning:'A böngésző helyi tárhelye nem olvasható. A haladás nem biztos, hogy visszaállítható.',requiresRecovery:true};
 }
}
export function writeProgress(storage:Pick<Storage,'setItem'>,completed:string[]):string{
 try{storage.setItem(PROGRESS_KEY,JSON.stringify(completed));return '';}
 catch{return 'A böngésző nem engedte elmenteni a haladást. Exportáld a jelenlegi adatokat JSON-fájlba, mielőtt bezárod az alkalmazást.';}
}
