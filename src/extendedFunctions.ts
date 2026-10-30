/** Safe, deliberately limited function families; no dynamic code execution. */
export type ExtendedFunction={kind:'absolute'|'cubic'|'reciprocal';a:number;h:number;k:number;label:string};
const number='(?:\\d+(?:[.,]\\d*)?|[.,]\\d+)';
const signed='[+-]?'+number;
const n=(s:string|undefined,fallback:number)=>s===undefined||s===''?fallback:s==='-'?-1:s==='+'?1:Number(s.replace(',','.'));
export function parseExtendedFunction(raw:string):ExtendedFunction{
 let s=raw.trim().toLowerCase().replace(/\s+/g,'').replace(/−/g,'-').replace(/³/g,'^3').replace(/\*/g,'');
 s=s.replace(/^f\(x\)=/,'').replace(/^y=/,'');
 if(s.length>100||!s)throw new Error('Adj meg egy függvényt.');
 let m:RegExpMatchArray|null;
 // a|x-h|+k, including |x|, -2|x+1|+3
 m=s.match(new RegExp('^('+signed+'|[+-]?)\\|x([+-]'+number+')?\\|([+-]'+number+')?$'));
 if(m){const a=n(m[1],1),h=-n(m[2],0),k=n(m[3],0);return checked('absolute',a,h,k,s);}
 // a(x-h)^3+k and ax^3+k (no arbitrary nested expressions)
 m=s.match(new RegExp('^('+signed+'|[+-]?)x\\^3([+-]'+number+')?$'));
 if(m)return checked('cubic',n(m[1],1),0,n(m[2],0),s);
 m=s.match(new RegExp('^('+signed+'|[+-]?)\\(x([+-]'+number+')\\)\\^3([+-]'+number+')?$'));
 if(m)return checked('cubic',n(m[1],1),-n(m[2],0),n(m[3],0),s);
 // a/(x-h)+k, with explicit parentheses, and 1/x
 m=s.match(new RegExp('^('+signed+')/\\(x([+-]'+number+')\\)([+-]'+number+')?$'));
 if(m)return checked('reciprocal',n(m[1],1),-n(m[2],0),n(m[3],0),s);
 if(s==='1/x'||s==='-1/x')return checked('reciprocal',s[0]==='-'?-1:1,0,0,s);
 throw new Error('Használható alakok: |x−2|+1, 2x³−3, (x−1)³+2, 1/(x−2)+1. Más képletet még nem támogat ez a mód.');
}
function checked(kind:ExtendedFunction['kind'],a:number,h:number,k:number,label:string):ExtendedFunction{
 if(![a,h,k].every(v=>Number.isFinite(v)&&Math.abs(v)<=1000))throw new Error('Az együtthatók abszolút értéke legfeljebb 1000 lehet.');
 return {kind,a,h,k,label};
}
export function evaluateExtended(f:ExtendedFunction,x:number):number|null{
 if(f.kind==='reciprocal'&&Math.abs(x-f.h)<1e-12)return null;
 const y=f.kind==='absolute'?f.a*Math.abs(x-f.h)+f.k:f.kind==='cubic'?f.a*(x-f.h)**3+f.k:f.a/(x-f.h)+f.k;
 return Number.isFinite(y)?y:null;
}
export function extendedFacts(f:ExtendedFunction):{name:string;domain:string;range:string;steps:string[]}{
 const {a,h,k}=f;
 if(f.kind==='absolute')return {name:'Abszolútérték-függvény',domain:'Minden valós szám',range:a>0?'y ≥ '+k:a<0?'y ≤ '+k:'y = '+k,steps:[
 'Az alapfüggvény y = |x|, amely V alakú. A csúcspontja (0; 0).',
 'Az x helyett x − h áll: vízszintes eltolás h = '+h+'.',
 'A függőleges eltolás k = '+k+', ezért a csúcspont ('+h+'; '+k+').',
 'Az a = '+a+' a nyújtást és a tükrözést szabályozza. A két ág meredeksége a csúcsponttól balra és jobbra ellentétes.',
 'Értelmezési tartomány: minden valós szám. Értékkészlet: '+(a>0?'y ≥ '+k:a<0?'y ≤ '+k:'y = '+k)+'.',
 'A grafikonon ellenőrizd a csúcsot, majd olvasd le az értéktáblázatból a két oldali pontokat.'
 ]};
 if(f.kind==='cubic')return {name:'Harmadfokú függvény',domain:'Minden valós szám',range:a===0?'y = '+k:'Minden valós szám',steps:[
 'Az alapfüggvény y = x³: S alakú görbe, amely átmegy az origón.',
 'Az x − h kifejezés h = '+h+' vízszintes eltolást jelent.',
 'A k = '+k+' függőleges eltolás; a szimmetriaközéppont ('+h+'; '+k+').',
 'Az a = '+a+' nyújtja és negatív előjelnél tükrözi a görbét.',
 'A függvény minden valós x értékre értelmezett; '+(a===0?'konstans.':'a görbe folytonos, nincs szakadása.') ,
 'Ellenőrizd az x = h körüli pontokat az értéktáblázatban.'
 ]};
 return {name:'Reciprokfüggvény',domain:'Minden valós szám, kivéve x = '+h,range:a===0?'y = '+k:'Minden valós szám, kivéve y = '+k,steps:[
 'Az alapfüggvény y = 1/x. Két különálló ága van.',
 'A nevező x − h, így x = '+h+' helyen nincs értelmezve.',
 a===0?'Az x = '+h+' helyen a grafikonból egy pont hiányzik; nem függőleges aszimptota. A többi helyen y = '+k+'.':'A függőleges aszimptota x = '+h+'. A vízszintes aszimptota y = '+k+'.',
 a===0?'Az a = 0 miatt a függvény minden megengedett x helyen állandó.':'Az a = '+a+' az ágak irányát és méretét szabályozza.',
 a===0?'Az x = '+h+' helyen üres karikával jelölhető a hiányzó pont.':'A grafikon két ágát nem szabad összekötni az x = '+h+' szakadási helyen.',
 'Közelíts az aszimptotához mindkét oldalról, és hasonlítsd össze a táblázat értékeit.'
 ]};
}
