import {useMemo,useState} from 'react';
import {filterGeoTips,geoCategories} from './geoTips';
export default function GeoTipsLab(){
 const [query,setQuery]=useState(''),[category,setCategory]=useState<string>('Mind'),[selected,setSelected]=useState('zeros'),[method,setMethod]=useState(0),[answer,setAnswer]=useState<number|null>(null),[revealed,setRevealed]=useState(false);
 const filtered=useMemo(()=>filterGeoTips(query,category),[query,category]);
 const active=filtered.find(t=>t.id===selected)??filtered[0];
 const select=(id:string)=>{setSelected(id);setMethod(0);setAnswer(null);setRevealed(false)};
 return <section className="geo-tips panel" aria-labelledby="geo-tips-title"><h2 id="geo-tips-title">GeoGebra műhely – tippek, trükkök, több megoldás</h2>
 <p>Válassz egy problémát, próbálj ki több módszert, majd ellenőrizd a megértésedet. A lépések a GeoGebra eredeti alkalmazásában is kipróbálhatók.</p>
 <div className="geo-tip-filters"><label>Keresés a tippek között<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="pl. érintő, parabola, CAS"/></label><label>Témakör<select value={category} onChange={e=>setCategory(e.target.value)}>{geoCategories.map(c=><option key={c}>{c}</option>)}</select></label></div>
 <p role="status">{filtered.length} gyakorlati téma található</p>
 <div className="geo-tip-layout"><div className="geo-tip-list" aria-label="Gyakorlati témák">{filtered.map(t=><button key={t.id} type="button" aria-pressed={active?.id===t.id} className={active?.id===t.id?'active':''} onClick={()=>select(t.id)}><strong>{t.title}</strong><small>{t.category} · {t.methods.length} módszer</small></button>)}</div>
 {active?<article className="geo-tip-detail" key={active.id}><h3>{active.title}</h3><p>{active.goal}</p><h4>Megoldási utak</h4><div className="geo-method-tabs" role="group" aria-label="Megoldási módszerek">{active.methods.map((m,i)=><button key={m.name} type="button" aria-pressed={method===i} onClick={()=>{setMethod(i);setAnswer(null);setRevealed(false)}}>{i+1}. {m.name}</button>)}</div><ol>{active.methods[Math.min(method,active.methods.length-1)].steps.map((step,i)=><li key={i}>{step}</li>)}</ol><p><strong>Mikor érdemes?</strong> {active.methods[Math.min(method,active.methods.length-1)].when}</p>
 <a href={active.link} target="_blank" rel="noreferrer">Kipróbálás a GeoGebrában ↗</a>
 <div className="geo-tip-quiz"><h4>Önellenőrzés</h4><p>{active.challenge}</p>{active.options.map((o,i)=><label key={i}><input type="radio" name={'geo-'+active.id} checked={answer===i} onChange={()=>{setAnswer(i);setRevealed(false)}}/>{o}</label>)}<button type="button" disabled={answer===null} onClick={()=>setRevealed(true)}>Válasz ellenőrzése</button>{revealed&&<p role="status" className={answer===active.correct?'success':'hint'}>{answer===active.correct?'Helyes! ':'Még nem jó. '}{active.reason}</p>}</div></article>:<p>Nincs találat. Próbálj más keresést vagy témakört!</p>}</div>
 </section>;
}
