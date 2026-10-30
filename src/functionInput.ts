/** Safe polynomial input parser: no eval or arbitrary JavaScript execution. */
export type ParsedPolynomial={a:number;b:number;c:number;normalized:string};
export function parsePolynomial(input:string):ParsedPolynomial{
 let expression=input.trim().replace(/\s+/g,'').replace(/−/g,'-').replace(/²/g,'^2').replace(/,/g,'.').replace(/\*/g,'').toLowerCase();
 expression=expression.replace(/^f\(x\)=/,'').replace(/^y=/,'');
 if(!expression||expression.length>120)throw new Error('Adj meg egy legfeljebb 120 karakteres függvényt.');
 if(!/^[0-9.x+\-^]+$/.test(expression))throw new Error('Most az ax² + bx + c alakot támogatjuk. Ne használj zárójelet, osztást vagy függvénynevet.');
 if(!/^[+-]/.test(expression))expression='+'+expression;
 const terms=expression.match(/[+-][^+-]+/g);
 if(!terms||terms.join('')!==expression)throw new Error('Ellenőrizd az előjeleket és a tagok alakját.');
 let a=0,b=0,c=0;
 const seen=new Set<string>();
 for(const term of terms){
  const sign=term[0]==='-'?-1:1;
  const body=term.slice(1);
  let kind:'a'|'b'|'c';let value:number;
  if(/^(?:\d+(?:\.\d*)?|\.\d+)?x\^2$/.test(body)){kind='a';const prefix=body.slice(0,-3);value=prefix?Number(prefix):1;}
  else if(/^(?:\d+(?:\.\d*)?|\.\d+)?x$/.test(body)){kind='b';const prefix=body.slice(0,-1);value=prefix?Number(prefix):1;}
  else if(/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(body)){kind='c';value=Number(body);}
  else throw new Error('Nem értelmezhető tag: '+term+'. Példa: f(x)=2x²-3x+1');
  if(seen.has(kind))throw new Error('Azonos fokszámú tagok összevonását még nem támogatjuk. Írd fel ax² + bx + c alakban.');
  seen.add(kind);
  const signed=sign*value;
  if(!Number.isFinite(signed)||Math.abs(signed)>1000)throw new Error('Az együtthatók abszolút értéke legfeljebb 1000 lehet.');
  if(kind==='a')a=signed;else if(kind==='b')b=signed;else c=signed;
 }
 return {a,b,c,normalized:expression.slice(1)};
}
