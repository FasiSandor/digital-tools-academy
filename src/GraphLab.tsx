import {useMemo,useState} from 'react';

const fmt=(n:number)=>Number(n.toFixed(3)).toLocaleString('hu-HU');
const xPx=(x:number)=>170+x*32;
const yPx=(y:number)=>125-y*18;
export default function GraphLab(){
 const[a,setA]=useState(1),[b,setB]=useState(0),[c,setC]=useState(-2),[probe,setProbe]=useState(1);
 const points=useMemo(()=>Array.from({length:321},(_,i)=>{const x=(i-160)/32;return (i?'L':'M')+xPx(x)+' '+yPx(a*x*x+b*x+c)}).join(' '),[a,b,c]);
 const vertex=a!==0?{x:-b/(2*a),y:c-b*b/(4*a)}:null;
 const delta=b*b-4*a*c;
 const roots=a!==0?(delta<0?[]:delta===0?[-b/(2*a)]:[(-b-Math.sqrt(delta))/(2*a),(-b+Math.sqrt(delta))/(2*a)]):b!==0?[-c/b]:[];
 const probeY=a*probe*probe+b*probe+c;
 const slope=2*a*probe+b;
 const tangent=useMemo(()=>Array.from({length:321},(_,i)=>{const x=(i-160)/32;return (i?'L':'M')+xPx(x)+' '+yPx(probeY+slope*(x-probe))}).join(' '),[probe,probeY,slope]);
 const isConstant=a===0&&b===0;
 const turning=a!==0?(a>0?'minimuma':'maximuma'):null;
 const direction=a>0?'felfelé':a<0?'lefelé':'egyik irányba sem';
 const interceptText=c===0?'az origón halad át':c>0?'a pozitív y-tengelyt metszi':'a negatív y-tengelyt metszi';
 const marker=(x:number,y:number,label:string)=>Number.isFinite(x)&&Number.isFinite(y)&&x>=-5&&x<=5&&y>=-6.9&&y<=6.9?<g key={label}><circle cx={xPx(x)} cy={yPx(y)} r="5" fill="#ff8500" stroke="#ffffff" strokeWidth="2"/><text x={xPx(x)+8} y={yPx(y)-8} fill="#005dff" fontSize="11">{label}</text></g>:null;
 return <section className="panel graphlab">
 <h2>Interaktív függvénylabor</h2>
 <p>Változtasd az együtthatókat, és figyeld a függvény alakját, zérushelyeit és csúcspontját! A grafikon saját szemléltető eszköz.</p>
 <div className="graphlayout">
 <svg viewBox="0 0 340 250" role="img" aria-label={`A függvény grafikonja: ${a} x négyzet plusz ${b} x plusz ${c}`} className="graphsvg">
 <defs><clipPath id="graph-clip"><rect width="340" height="250"/></clipPath></defs>
 {Array.from({length:17},(_,i)=><line key={'v'+i} x1={10+i*20} y1="0" x2={10+i*20} y2="250" stroke="#d6dee8" strokeWidth=".6"/>)}
 {Array.from({length:13},(_,i)=><line key={'h'+i} x1="0" y1={5+i*20} x2="340" y2={5+i*20} stroke="#d6dee8" strokeWidth=".6"/>)}
 <line x1="170" y1="0" x2="170" y2="250" stroke="#263142"/>
 <line x1="0" y1="125" x2="340" y2="125" stroke="#263142"/>
 <g clipPath="url(#graph-clip)"><path d={points} stroke="#ff1736" strokeWidth="3" fill="none"/><path d={tangent} stroke="#005dff" strokeWidth="2" strokeDasharray="7 4" fill="none"/>{marker(probe,probeY,'P')}{marker(0,c,'Y')}{vertex&&marker(vertex.x,vertex.y,'C')}{roots.map((x,i)=>marker(x,0,'Z'+(i+1)))}</g>
 <text x="323" y="119" fill="#111827" fontSize="11">x</text><text x="177" y="13" fill="#111827" fontSize="11">y</text>
 </svg>
 <div className="controls"><div className="lab-legend"><span><i className="legend-curve"/> Függvény</span><span><i className="legend-tangent"/> Érintő</span></div>
 {([{name:'a – másodfokú tag',value:a,fn:setA},{name:'b – elsőfokú tag',value:b,fn:setB},{name:'c – konstans tag',value:c,fn:setC}]).map(s=><label key={s.name}><span>{s.name}: <b>{fmt(s.value)}</b></span><input aria-label={s.name} type="range" min="-4" max="4" step=".5" value={s.value} onChange={e=>s.fn(Number(e.target.value))}/></label>)}
 <label className="probe-slider"><span>Vizsgált x: <b>{fmt(probe)}</b></span><input aria-label="Vizsgált x koordináta" type="range" min="-5" max="5" step=".25" value={probe} onChange={e=>setProbe(Number(e.target.value))}/></label><p className="probe-result"><b>f({fmt(probe)}) = {fmt(probeY)}</b><span> Érintő meredeksége: <b>{fmt(slope)}</b></span></p><strong>f(x) = {fmt(a)}x² {b<0?'−':'+'} {fmt(Math.abs(b))}x {c<0?'−':'+'} {fmt(Math.abs(c))}</strong>
 <p>{a===0?(b===0?'Konstans függvény.':'Lineáris függvény.'):a>0?'A parabola felfelé nyílik.':'A parabola lefelé nyílik.'}</p>
 <p><b>Y-tengelymetszet:</b> (0; {fmt(c)})</p>
 {vertex&&<p><b>Csúcspont:</b> ({fmt(vertex.x)}; {fmt(vertex.y)})</p>}
 <p><b>Valós zérushelyek:</b> {roots.length?roots.map(fmt).join('; '):a===0&&b===0&&c===0?'minden valós szám':'nincsenek'}</p>
 <button onClick={()=>{setA(1);setB(0);setC(-2);setProbe(1)}}>Alaphelyzet</button>
 </div></div><section className="guided-explanation" aria-live="polite">
 <h3>Miért ilyen a grafikon? – lépésről lépésre</h3>
 <ol>
 <li><b>Az a együttható:</b> {a===0?'Most a = 0, ezért eltűnik az x²-es tag.':`Az a = ${fmt(a)} miatt a parabola ${direction} nyílik.`} {a!==0?'Az |a| növelése keskenyebbé, csökkentése szélesebbé teszi.':''}</li>
 <li><b>A b együttható:</b> {a===0?(b===0?'A b is 0: vízszintes egyenest kapsz.':`A b = ${fmt(b)} a lineáris függvény meredeksége.`):`A b = ${fmt(b)} a csúcspont vízszintes helyzetét is befolyásolja: x = −b/(2a) = ${fmt(vertex!.x)}.`}</li>
 <li><b>A c együttható:</b> { `c = ${fmt(c)}, ezért f(0) = ${fmt(c)}; a grafikon ${interceptText}.` } Ha csak c-t változtatod, az egész grafikon függőlegesen tolódik.</li>
 <li><b>A mozgó pont:</b> { `x = ${fmt(probe)} helyen f(x) = ${fmt(probeY)}. A kék érintő meredeksége f′(x) = 2ax+b = ${fmt(slope)}.` } {slope===0?(isConstant?'A függvény állandó, ezért az érintő vízszintes.':'Itt az érintő vízszintes, tehát a függvénynek helyi szélsőértéke van.'):slope>0?'A pozitív meredekség azt jelzi, hogy a függvény itt növekszik.':'A negatív meredekség azt jelzi, hogy a függvény itt csökken.'}</li>
 <li><b>Összefoglalás:</b> {vertex?`A parabola ${turning} a C(${fmt(vertex.x)}; ${fmt(vertex.y)}) pontban van.`:isConstant?'A grafikon vízszintes egyenes.':'A grafikon egyenes, ezért nincs parabolacsúcsa.'} {roots.length?`Valós zérushelyek: ${roots.map(fmt).join('; ')}.`:isConstant&&c===0?'Minden valós szám zérushely.':'Nincs valós zérushely.'}</li>
 </ol>
 </section></section>;
}
