import {useMemo,useState} from 'react';
import type {ExtendedFunction} from './extendedFunctions';
import {analyzeExtended,practiceFor} from './functionAnalysis';
const fmt=(x:number)=>Number(x.toFixed(3)).toLocaleString('hu-HU');
export default function FunctionInvestigation({fn}:{fn:ExtendedFunction}){
 const [answers,setAnswers]=useState<Record<number,number>>({});
 const [reveal,setReveal]=useState(false);
 const [checked,setChecked]=useState(false);
 const analysis=useMemo(()=>analyzeExtended(fn),[fn]);
 const questions=useMemo(()=>practiceFor(fn),[fn]);
 const score=questions.filter((q,i)=>answers[i]===q.correct).length;
 const currentKey=fn.kind+':'+fn.a+':'+fn.h+':'+fn.k;
 const [lastKey,setLastKey]=useState(currentKey);
 if(lastKey!==currentKey){setLastKey(currentKey);setAnswers({});setReveal(false);setChecked(false);}
 return <section className="function-investigation" aria-label="Függvényvizsgálat és önálló gyakorlás">
 <h4>Függvényvizsgálat – gondolkodj, majd ellenőrizz!</h4>
 <p>Próbáld meg először önállóan megállapítani a zérushelyeket, a monotonitást és a szimmetriát. Ezután nyisd meg a részletes megoldást.</p>
 <button type="button" className="investigation-reveal" onClick={()=>setReveal(v=>!v)} aria-expanded={reveal}>{reveal?'Részletes megoldás elrejtése':'Részletes megoldás megjelenítése'}</button>
 {reveal&&<div className="investigation-results">
 <p><b>Értelmezési tartomány:</b> {analysis.domain}</p><p><b>Értékkészlet:</b> {analysis.range}</p>
 <p><b>Zérushelyek:</b> {analysis.zeros.length?analysis.zeros.map(fmt).join('; '):fn.a===0&&fn.k===0?'Minden értelmezési tartománybeli pont zérushely.':'Nincs zérushely.'}</p>
 <p><b>y-tengelymetszet:</b> {analysis.intercept===null?'Nem létezik, mert x = 0 nincs az értelmezési tartományban.':'(0; '+fmt(analysis.intercept)+')'}</p>
 {analysis.criticalPoint&&<p><b>Nevezetes pont:</b> ({fmt(analysis.criticalPoint.x)}; {fmt(analysis.criticalPoint.y)}) – {analysis.criticalPoint.type}</p>}
 <p><b>Monotonitás:</b> {analysis.monotonic.join('; ')}</p><p><b>Szimmetria:</b> {analysis.symmetry}</p>
 {analysis.asymptotes.length>0&&<p><b>Aszimptoták:</b> {analysis.asymptotes.join('; ')}</p>}
 </div>}
 <h4>Önálló ellenőrző kérdések</h4>
 {questions.map((q,i)=><fieldset className="investigation-question" key={i}><legend>{i+1}. {q.prompt}</legend>{q.options.map((option,j)=><label key={j}><input type="radio" name={'extended-question-'+i} checked={answers[i]===j} onChange={()=>{setAnswers(v=>({...v,[i]:j}));setChecked(false)}}/>{option}</label>)}{checked&&answers[i]!==undefined&&<p className={answers[i]===q.correct?'practice-correct':'practice-incorrect'} role="status">{answers[i]===q.correct?'Helyes!':'Még nem jó.'} {q.explanation}</p>}</fieldset>)}
 <p className="practice-score" aria-live="polite">{checked?`Eredmény: ${score} / ${questions.length} helyes válasz.`:`Megválaszolva: ${Object.keys(answers).length} / ${questions.length}`}</p>
 <button type="button" disabled={Object.keys(answers).length!==questions.length} onClick={()=>setChecked(true)}>Válaszok ellenőrzése</button>
 <button type="button" onClick={()=>{setAnswers({});setChecked(false)}}>Gyakorlás újrakezdése</button>
 </section>;
}
