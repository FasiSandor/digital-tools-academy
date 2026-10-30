import type {ExtendedFunction} from './extendedFunctions';
import {evaluateExtended} from './extendedFunctions';
export type NumericTask={id:string;prompt:string;answer:number;explanation:string};
export function numericTasks(fn:ExtendedFunction):NumericTask[]{
 const x=fn.h+2;
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
