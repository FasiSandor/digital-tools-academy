import type {ExtendedFunction} from './extendedFunctions';
import {evaluateExtended} from './extendedFunctions';
export type FunctionAnalysis={zeros:number[];intercept:number|null;criticalPoint:{x:number;y:number;type:string}|null;monotonic:string[];symmetry:string;asymptotes:string[];domain:string;range:string};
const near=(x:number,y:number)=>Math.abs(x-y)<1e-10;
export function analyzeExtended(f:ExtendedFunction):FunctionAnalysis{
 const {kind,a,h,k}=f;
 const intercept=evaluateExtended(f,0);
 if(kind==='absolute'){
  const zeros=a===0?(near(k,0)?[]:[]):(-k/a>=0?[-k/a+h,k/a+h].sort((x,y)=>x-y).filter((x,i,arr)=>i===0||!near(x,arr[i-1])):[]);
  return {zeros,intercept,criticalPoint:{x:h,y:k,type:a>0?'minimum':a<0?'maximum':'állandó érték'},monotonic:a>0?[`Csökken: x < ${h}`,`Nő: x > ${h}`]:a<0?[`Nő: x < ${h}`,`Csökken: x > ${h}`]:['Állandó'],symmetry:`Tengelyes szimmetria: x = ${h}`,asymptotes:[],domain:'Minden valós szám',range:a>0?`y ≥ ${k}`:a<0?`y ≤ ${k}`:`y = ${k}`};
 }
 if(kind==='cubic'){
  const zero=a===0?[]:[h+Math.cbrt(-k/a)];
  return {zeros:zero,intercept,criticalPoint:a===0?null:{x:h,y:k,type:'vízszintes érintőjű inflexiós pont, nem szélsőérték'},monotonic:[a>0?'Szigorúan növekvő mindenütt':a<0?'Szigorúan csökkenő mindenütt':'Állandó'],symmetry:`Középpontos szimmetria: (${h}; ${k})`,asymptotes:[],domain:'Minden valós szám',range:a===0?`y = ${k}`:'Minden valós szám'};
 }
 const zero=a===0?[]:!near(k,0)?[h-a/k]:[];
 return {zeros:zero,intercept,criticalPoint:null,monotonic:a>0?[`Csökken: x < ${h}`,`Csökken: x > ${h}`]:a<0?[`Nő: x < ${h}`,`Nő: x > ${h}`]:['Állandó az értelmezési tartományban'],symmetry:`Középpontos szimmetria: (${h}; ${k})`,asymptotes:[`Függőleges: x = ${h}`,a===0?'Nincs vízszintes aszimptota':`Vízszintes: y = ${k}`],domain:`Minden valós szám, kivéve x = ${h}`,range:a===0?`y = ${k}`:`Minden valós szám, kivéve y = ${k}`};
}
export type PracticeQuestion={prompt:string;options:string[];correct:number;explanation:string};
function choose(correct:string,distractors:string[],seed:number):{options:string[];correct:number}{
 const unique=[correct,...distractors.filter(x=>x!==correct)].filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,3);
 if(unique.length!==3)throw new Error('A gyakorlókérdés válaszai nem különböznek.');
 const shift=((seed%3)+3)%3;
 const options=[...unique.slice(shift),...unique.slice(0,shift)];
 return {options,correct:options.indexOf(correct)};
}
export function practiceFor(f:ExtendedFunction):PracticeQuestion[]{
 const a=analyzeExtended(f);
 const domain=choose(a.domain,['Minden valós szám','Minden valós szám, kivéve x = '+f.h,'Csak pozitív x értékek','Csak egész x értékek'],Math.round(f.h+f.k+3));
 const symmetry=choose(a.symmetry,['Az y-tengelyre szimmetrikus','Az x-tengelyre szimmetrikus','Nincs szimmetriája'],Math.round(f.a+7));
 const correctTrend=a.monotonic.join('; ');
 const trends=['Szigorúan növekvő mindenütt','Szigorúan csökkenő mindenütt','Állandó','Csökken: x < '+f.h+'; Nő: x > '+f.h,'Nő: x < '+f.h+'; Csökken: x > '+f.h,'Csökken: x < '+f.h+'; Csökken: x > '+f.h,'Nő: x < '+f.h+'; Nő: x > '+f.h];
 const monotonic=choose(correctTrend,trends,Math.round(f.a+f.h+11));
 return [
 {prompt:'Melyik állítás igaz az értelmezési tartományra?',...domain,explanation:'A képletből következik: '+a.domain+'.'},
 {prompt:'Melyik szimmetria jellemzi a függvényt?',...symmetry,explanation:a.symmetry},
 {prompt:'Hogyan változik a függvény?',...monotonic,explanation:correctTrend}
 ];
}
