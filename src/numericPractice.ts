import type {ExtendedFunction} from './extendedFunctions';
import {evaluateExtended} from './extendedFunctions';
export type NumericTask={id:string;prompt:string;answer:number;explanation:string};
export function numericTasks(fn:ExtendedFunction,round=0):NumericTask[]{
 const offsets=[2,-3,4,-2,3];
 const x=fn.h+offsets[((round%offsets.length)+offsets.length)%offsets.length];
 const y=evaluateExtended(fn,x);
 if(y===null)throw new Error('A kiválasztott pont nem értelmezhető.');
 const tasks:NumericTask[]=[
 {id:'value',prompt:'Mennyi f('+formatNumber(x)+') értéke?',answer:y,explanation:'Helyettesítsd be az x = '+formatNumber(x)+' értéket a függvény képletébe. Az eredmény '+formatNumber(y)+'.'},
 {id:'horizontal',prompt:fn.kind==='reciprocal'?'Hol van a függőleges aszimptota? Add meg az x értékét.':fn.kind==='absolute'?'Mi a csúcspont x koordinátája?':'Mi az inflexiós pont x koordinátája?',answer:fn.h,explanation:'Az x − h alakból h = '+formatNumber(fn.h)+' olvasható le.'},
 {id:'vertical',prompt:fn.kind==='reciprocal'?'Hol van a vízszintes aszimptota? Add meg az y értékét.':fn.kind==='absolute'?'Mi a csúcspont y koordinátája?':'Mi az inflexiós pont y koordinátája?',answer:fn.k,explanation:'A függőleges eltolás k = '+formatNumber(fn.k)+'.'}
 ];
 return tasks;
}
export function parseNumericAnswer(raw:string):number|null{
 const s=raw.trim().replace(/−/g,'-').replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))return null;
 const value=Number(s);
 return Number.isFinite(value)?value:null;
}
export function checkNumericAnswer(raw:string,expected:number):'empty'|'invalid'|'correct'|'incorrect'{
 if(!raw.trim())return 'empty';
 const value=parseNumericAnswer(raw);
 if(value===null)return 'invalid';
 return Math.abs(value-expected)<=Math.max(0.005,Math.abs(expected)*1e-8)?'correct':'incorrect';
}
export function formatNumber(value:number):string{return Number(value.toFixed(3)).toLocaleString('hu-HU');}

/** Pedagogical feedback is deterministic and based only on the selected task and answer. */
export type NumericFeedback={category:'correct'|'invalid'|'sign'|'shift'|'calculation';hint:string;worked:string};
export function explainNumericAnswer(fn:ExtendedFunction,task:NumericTask,raw:string):NumericFeedback{
 const status=checkNumericAnswer(raw,task.answer);
 const x=fn.h+2;
 const dx=x-fn.h;
 const core=fn.kind==='absolute'?Math.abs(dx):fn.kind==='cubic'?dx**3:1/dx;
 const operation=fn.kind==='absolute'?'|'+formatNumber(x)+' − '+formatNumber(fn.h)+'|':fn.kind==='cubic'?'('+formatNumber(x)+' − '+formatNumber(fn.h)+')³':'1 / ('+formatNumber(x)+' − '+formatNumber(fn.h)+')';
 const worked=task.id==='value'
  ?'1. x = '+formatNumber(x)+'. 2. Belső kifejezés: '+operation+' = '+formatNumber(core)+'. 3. Szorozd meg a = '+formatNumber(fn.a)+' értékkel: '+formatNumber(fn.a*core)+'. 4. Add hozzá k = '+formatNumber(fn.k)+': '+formatNumber(task.answer)+'.'
  :task.id==='horizontal'
  ?'A képlet belsejében x − h szerepel. Az eltolás előjele fordított: x − ('+formatNumber(fn.h)+'), ezért h = '+formatNumber(fn.h)+'.'
  :'A képleten kívüli + k tag függőlegesen tol. Itt k = '+formatNumber(fn.k)+', tehát az y koordináta '+formatNumber(task.answer)+'.';
 if(status==='correct')return {category:'correct',hint:'A helyettesítés és az eltolás eredménye megfelelő.',worked};
 if(status==='empty'||status==='invalid')return {category:'invalid',hint:'Egyetlen számot írj be. Például: 1,5 vagy −2. Képletet ne írj a mezőbe.',worked};
 const answer=parseNumericAnswer(raw)!;
 if(task.id==='horizontal'&&Math.abs(answer+fn.h)<0.005&&Math.abs(fn.h)>0.005)
  return {category:'sign',hint:'Az x − h alaknál könnyű az eltolás előjelét felcserélni. Keresd meg, mikor lesz a belső kifejezés nulla.',worked};
 if(task.id==='value'){
  if(Math.abs(answer-(fn.a*core))<0.005&&Math.abs(fn.k)>0.005)
   return {category:'shift',hint:'A belső kifejezést és az a szorzót jól számoltad, de a függőleges eltolás (+ k) kimaradhatott.',worked};
  if(Math.abs(answer-(core+fn.k))<0.005&&Math.abs(fn.a-1)>0.005)
   return {category:'calculation',hint:'Az alapfüggvény értéke után még az a együtthatóval is szorozni kell.',worked};
 }
 return {category:'calculation',hint:task.id==='value'?'Haladj sorrendben: először x − h, majd alapfüggvény, utána szorzás a-val, végül + k.':'Nézd meg, hogy a keresett koordináta a belső (h) vagy a külső (k) eltolásból adódik.',worked};
}

export function numericHint(fn:ExtendedFunction,task:NumericTask,level:1|2):string{
 if(task.id==='horizontal')return level===1?'Keresd meg a belső x − h kifejezést.':'Az x − h = 0 egyenletet oldd meg; az x koordinátát kapod.';
 if(task.id==='vertical')return level===1?'Keresd a függvény végén álló, kívül hozzáadott számot.':'A + k tag függőlegesen tol: az y koordináta k.';
 if(level===1)return 'Helyettesítsd be a feladatban megadott x értéket. Először a zárójelen belül számolj!';
 return fn.kind==='absolute'?'Sorrend: x − h, abszolútérték, szorzás a-val, végül + k.':fn.kind==='cubic'?'Sorrend: x − h, köbre emelés, szorzás a-val, végül + k.':'Sorrend: x − h, reciprok képzése, szorzás a-val, végül + k.';
}
