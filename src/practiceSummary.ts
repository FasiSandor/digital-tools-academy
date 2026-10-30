export type PracticeAttempt={round:number;correct:number;total:number;hints:number;timestamp:string};
export type PracticeSummary={attempts:number;best:number;average:number;totalCorrect:number;totalQuestions:number;hintUses:number;completedRounds:number};
export function summarizeAttempts(attempts:PracticeAttempt[]):PracticeSummary{
 const totalCorrect=attempts.reduce((n,a)=>n+a.correct,0);
 const totalQuestions=attempts.reduce((n,a)=>n+a.total,0);
 return {attempts:attempts.length,best:attempts.length?Math.max(...attempts.map(a=>a.correct)):0,average:totalQuestions?Math.round(1000*totalCorrect/totalQuestions)/10:0,totalCorrect,totalQuestions,hintUses:attempts.reduce((n,a)=>n+a.hints,0),completedRounds:new Set(attempts.map(a=>a.round)).size};
}
export function formatPracticeReport(label:string,attempts:PracticeAttempt[]):string{
 const s=summarizeAttempts(attempts);
 const lines=['Digitális Akadémia – saját gyakorlási összesítő','Függvény: '+label,'Ellenőrzött próbálkozások: '+s.attempts,'Összes helyes válasz: '+s.totalCorrect+' / '+s.totalQuestions,'Átlagos eredmény: '+s.average+'%','Legjobb feladatsor: '+s.best+' / 3','Felhasznált segítségek: '+s.hintUses,'Gyakorolt különböző körök: '+s.completedRounds+' / 5'];
 return lines.join('\n');
}
