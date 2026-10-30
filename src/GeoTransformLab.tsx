import {useState} from 'react';
const coord=(x:number,y:number)=>({x:240+x*28,y:165-y*22});
export default function GeoTransformLab(){
 const [a,setA]=useState(1),[h,setH]=useState(0),[k,setK]=useState(0),[showBase,setShowBase]=useState(true);
 const points:Array<string>=[];let visible=false;
 for(let x=-8;x<=8;x+=0.08){const y=a*(x-h)**2+k;if(Math.abs(y)>7.5){visible=false;continue}const p=coord(x,y);points.push((visible?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1));visible=true}
 const base:Array<string>=[];
 for(let x=-8;x<=8;x+=0.08){const y=x*x;if(y>8)continue;const p=coord(x,y);base.push((base.length?'L':'M')+p.x.toFixed(1)+' '+p.y.toFixed(1))}
 const vertex=coord(h,k);
 return <section className="geo-transform panel" aria-labelledby="geo-transform-title"><h2 id="geo-transform-title">Élő GeoGebra-kísérlet: parabola transzformációja</h2><p>Változtasd az együtthatókat! A grafikon, a csúcs, az értéktáblázat és a magyarázat egyszerre frissül.</p><div className="geo-transform-grid"><div className="geo-transform-controls">
 {[{key:'a',value:a,set:setA,min:-3,max:3,step:0.5},{key:'h',value:h,set:setH,min:-5,max:5,step:0.5},{key:'k',value:k,set:setK,min:-5,max:5,step:0.5}].map(c=><label key={c.key}><span>{c.key} = <strong>{c.value}</strong></span><input type="range" min={c.min} max={c.max} step={c.step} value={c.value} onChange={e=>c.set(Number(e.target.value))}/></label>)}
 <label className="geo-base-toggle"><input type="checkbox" checked={showBase} onChange={e=>setShowBase(e.target.checked)}/>Alapfüggvény (y=x²) mutatása</label>
 <button type="button" onClick={()=>{setA(1);setH(0);setK(0)}}>Alaphelyzet</button>
 <p className="geo-transform-formula"><strong>f(x) = {a}(x − ({h}))² + ({k})</strong></p>
 <p><strong>Csúcs:</strong> ({h}; {k}). {a===0?'A függvény állandó, nincs egyetlen kitüntetett csúcspontja.':a>0?'A parabola felfelé nyílik, minimuma '+k+'.':'A parabola lefelé nyílik, maximuma '+k+'.'} {h===0?'Nincs vízszintes eltolás.':h>0?h+' egységgel jobbra tolódott.':Math.abs(h)+' egységgel balra tolódott.'} {k===0?'Nincs függőleges eltolás.':k>0?k+' egységgel felfelé tolódott.':Math.abs(k)+' egységgel lefelé tolódott.'}</p>
 </div><div className="geo-transform-graph"><svg viewBox="0 0 480 330" role="img" aria-label={`Parabola grafikon, a=${a}, h=${h}, k=${k}`}><rect width="480" height="330" fill="#fff"/>{Array.from({length:17},(_,i)=>{const x=i-8;return <line key={'x'+x} x1={240+x*28} x2={240+x*28} y1="0" y2="330" stroke="#e2e8f0"/>})}{Array.from({length:15},(_,i)=>{const y=i-7;return <line key={'y'+y} x1="0" x2="480" y1={165+y*22} y2={165+y*22} stroke="#e2e8f0"/>})}<path d="M0 165 H480 M240 0 V330" stroke="#334155" strokeWidth="1.5"/>{showBase&&<path d={base.join(' ')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5"/>}<path d={points.join(' ')} fill="none" stroke="#005dff" strokeWidth="3"/>{a!==0&&<circle cx={vertex.x} cy={vertex.y} r="5" fill="#f97316"/>}<text x="455" y="157" fill="#334155">x</text><text x="248" y="14" fill="#334155">y</text></svg><p className="geo-transform-caption">Kék: aktuális függvény. Szaggatott: y=x². Narancs: csúcspont (ha a≠0).</p></div></div>
 <div className="geo-transform-table"><h3>Dinamikus értéktáblázat</h3><table><thead><tr><th>x</th>{[-2,-1,0,1,2].map(dx=><th key={dx}>{h+dx}</th>)}</tr></thead><tbody><tr><th>f(x)</th>{[-2,-1,0,1,2].map(dx=><td key={dx}>{Number((a*dx*dx+k).toFixed(2))}</td>)}</tr></tbody></table></div>
 <p><strong>GeoGebra-próba:</strong> hozz létre <code>a</code>, <code>h</code>, <code>k</code> csúszkákat, majd írd be: <code>f(x)=a*(x-h)^2+k</code>. <a href="https://www.geogebra.org/graphing" target="_blank" rel="noreferrer">GeoGebra megnyitása ↗</a></p>
 </section>;
}
