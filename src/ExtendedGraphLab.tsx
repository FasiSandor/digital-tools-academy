import {useMemo,useState} from 'react';
import {parseExtendedFunction,evaluateExtended,extendedFacts} from './extendedFunctions';
import type {ExtendedFunction} from './extendedFunctions';
import FunctionInvestigation from './FunctionInvestigation';
const fmt=(n:number)=>Number(n.toFixed(3)).toLocaleString('hu-HU');
const presets=['|x−2|+1','−2|x+1|+3','x³−2','(x−1)³+2','1/(x−2)+1','-1/x'];
export default function ExtendedGraphLab(){
 const [input,setInput]=useState('|x−2|+1');
 const [fn,setFn]=useState<ExtendedFunction>(()=>parseExtendedFunction('|x−2|+1'));
 const [error,setError]=useState('');
 const [step,setStep]=useState(0);
 const [zoom,setZoom]=useState(1);
 const facts=useMemo(()=>extendedFacts(fn),[fn]);
 const width=340,height=250;
 const halfX=5*zoom;
 const xMin=fn.h-halfX,xMax=fn.h+halfX;
 const xAt=(x:number)=>10+(x-xMin)*320/(xMax-xMin);
 const anchorYs=[-halfX,0,halfX].map(dx=>evaluateExtended(fn,fn.h+dx)).filter((y):y is number=>y!==null&&Number.isFinite(y));
 const maxDiff=Math.max(3,...anchorYs.map(y=>Math.abs(y-fn.k)));
 const halfY=maxDiff*1.25;
 const yAt=(y:number)=>height/2-(y-fn.k)*112/halfY;
 const paths=useMemo(()=>{
  const parts:string[]=[];let current='';
  const samples=720;
  const gap=fn.kind==='reciprocal'?(xMax-xMin)/samples*1.1:0;
  for(let i=0;i<=samples;i++){
   const x=xMin+(xMax-xMin)*i/samples;
   const y=evaluateExtended(fn,x);
   if(y===null||!Number.isFinite(y)||Math.abs(y-fn.k)>halfY*1.8||Math.abs(x-fn.h)<gap){
    if(current)parts.push(current);
    current='';continue;
   }
   const point=`${xAt(x).toFixed(2)} ${yAt(y).toFixed(2)}`;
   current+=(current?' L':'M')+point;
  }
  if(current)parts.push(current);
  return parts;
 },[fn,xMin,xMax,halfY]);
 const rows=[-2,-1,-0.5,0,0.5,1,2].map(d=>({x:fn.h+d,y:evaluateExtended(fn,fn.h+d)}));
 const submit=(value:string)=>{setInput(value);try{const parsed=parseExtendedFunction(value);setFn(parsed);setError('');setStep(0);setZoom(1);}catch(e){setError(e instanceof Error?e.message:'Nem értelmezhető függvény.')}};
 return <section className="extended-graph" aria-labelledby="extended-title">
 <h3 id="extended-title">További függvények – saját képlettel</h3>
 <p>Abszolútérték, harmadfok és reciprok: írd be a függvényt, nézd meg a görbét, majd haladj végig a hat magyarázó lépésen. Az ábrázolás és a táblázat azonos képletből készül.</p>
 <form className="function-entry-form" onSubmit={e=>{e.preventDefault();submit(input)}}>
 <label htmlFor="extended-function">Függvény képlete</label>
 <div><input id="extended-function" value={input} onChange={e=>{setInput(e.target.value);setError('')}} autoComplete="off" placeholder="például |x−2|+1"/><button type="submit">Ábrázolás indítása</button></div>
 </form>
 <div className="extended-presets" role="group" aria-label="További függvények példái">{presets.map(p=><button type="button" key={p} onClick={()=>submit(p)}>{p}</button>)}</div>
 {error&&<p role="alert" className="backup-error">{error}</p>}
 <p><b>{facts.name}</b> · Értelmezési tartomány: {facts.domain} · Értékkészlet: {facts.range}</p>
 <div className="graphlayout">
 <svg className="graphsvg" viewBox="0 0 340 250" role="img" aria-label={`${facts.name} grafikonja: ${fn.label}`}>
 <defs><clipPath id="extended-clip"><rect x="0" y="0" width="340" height="250"/></clipPath></defs>
 {Array.from({length:9},(_,i)=>i-4).map(i=><line key={'x'+i} x1={xAt(fn.h+i*halfX/4)} x2={xAt(fn.h+i*halfX/4)} y1="0" y2="250" stroke="#d6dee8" strokeWidth=".6"/>)}
 {Array.from({length:9},(_,i)=>i-4).map(i=><line key={'y'+i} x1="0" x2="340" y1={yAt(fn.k+i*halfY/4)} y2={yAt(fn.k+i*halfY/4)} stroke="#d6dee8" strokeWidth=".6"/>)}
 {xMin<=0&&xMax>=0&&<line x1={xAt(0)} x2={xAt(0)} y1="0" y2="250" stroke="#263142"/>}
 {Math.abs(fn.k)<=halfY&&<line x1="0" x2="340" y1={yAt(0)} y2={yAt(0)} stroke="#263142"/>}
 <g clipPath="url(#extended-clip)">{paths.map((p,i)=><path key={i} d={p} fill="none" stroke="#ff1736" strokeWidth="2.8"/>)}{fn.kind==='reciprocal'&&<><line x1={xAt(fn.h)} x2={xAt(fn.h)} y1="0" y2="250" stroke="#005dff" strokeDasharray="5 5"/><line x1="0" x2="340" y1={yAt(fn.k)} y2={yAt(fn.k)} stroke="#005dff" strokeDasharray="5 5"/></>}{fn.kind!=='reciprocal'&&<circle cx={xAt(fn.h)} cy={yAt(fn.k)} r="5" fill="#ff8500"/>}</g>
 <text x="320" y="238" fill="#111827" fontSize="11">x</text><text x="14" y="15" fill="#111827" fontSize="11">y</text>
 </svg>
 <div className="controls"><div className="graph-zoom" role="group" aria-label="További függvények nagyítása"><button type="button" onClick={()=>setZoom(v=>Math.max(0.25,v/1.5))}>Nagyítás +</button><button type="button" onClick={()=>setZoom(v=>Math.min(8,v*1.5))}>Kicsinyítés −</button><button type="button" onClick={()=>setZoom(1)}>Automatikus nézet</button></div>
 <p><b>Vízszintes eltolás (h):</b> {fmt(fn.h)}</p><p><b>Függőleges eltolás (k):</b> {fmt(fn.k)}</p><p><b>Nyújtás és tükrözés (a):</b> {fmt(fn.a)}</p>
 {fn.kind==='reciprocal'&&<p><b>Aszimptoták:</b> x = {fmt(fn.h)} és y = {fmt(fn.k)}. A két ág külön rajzolódik.</p>}
 </div></div>
 <div className="function-guide" aria-live="polite"><p className="function-step-count">Lépés {step+1} / {facts.steps.length}</p><h4>{['Alapfüggvény','Vízszintes eltolás','Függőleges eltolás és nevezetes pont','Nyújtás, tükrözés vagy aszimptoták','Értelmezési tartomány','Grafikus ellenőrzés'][step]}</h4><p>{facts.steps[step]}</p><div className="function-step-actions"><button type="button" disabled={step===0} onClick={()=>setStep(v=>v-1)}>Előző lépés</button><button type="button" disabled={step===facts.steps.length-1} onClick={()=>setStep(v=>v+1)}>Következő lépés</button></div></div>
 <FunctionInvestigation fn={fn}/>
 <div className="graph-table-scroll"><table><caption>Értéktáblázat a nevezetes pont körül</caption><thead><tr><th scope="col">x</th><th scope="col">f(x)</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i}><th scope="row">{fmt(r.x)}</th><td>{r.y===null?'Nincs értelmezve':fmt(r.y)}</td></tr>)}</tbody></table></div>
 </section>;
}
