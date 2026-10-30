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
export function practiceFor(f:ExtendedFunction):PracticeQuestion[]{
 const analysis=analyzeExtended(f);
 const options=(correct:string,wrong:string,other:string):string[]=>[correct,wrong,other];
 const q:PracticeQuestion[]=[
 {prompt:'Melyik állítás igaz az értelmezési tartományra?',options:options(analysis.domain,'Csak pozitív x értékek','Csak egész x értékek'),correct:0,explanation:`A képletből következik: ${analysis.domain}.`},
 {prompt:'Melyik szimmetria jellemzi a függvényt?',options:options('Nincs szimmetriája',analysis.symmetry,'Az x-tengelyre szimmetrikus'),correct:1,explanation:analysis.symmetry},
 {prompt:'Hogyan változik a függvény?',options:options('Mindig szigorúan növekvő','Mindig szigorúan csökkenő',analysis.monotonic.join('; ')),correct:2,explanation:analysis.monotonic.join('; ')},
 ];
 return q;
}
