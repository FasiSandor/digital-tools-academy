/** Pure numeric helpers shared by the interactive graph and regression tests. */
export type FunctionSample={x:number;y:number;derivative:number;offset:number};
export function evaluateQuadratic(a:number,b:number,c:number,x:number):number{return a*x*x+b*x+c}
export function derivativeAt(a:number,b:number,x:number):number{return 2*a*x+b}
export function sampleAround(a:number,b:number,c:number,probe:number):FunctionSample[]{
 return [-1,-0.5,0,0.5,1].map(offset=>{
  const x=Number((probe+offset).toFixed(2));
  return {x,y:evaluateQuadratic(a,b,c,x),derivative:derivativeAt(a,b,x),offset};
 });
}
export function realRoots(a:number,b:number,c:number):number[]{
 if(a===0)return b===0?[]:[-c/b];
 const d=b*b-4*a*c;
 if(d<0)return [];
 if(d===0)return [-b/(2*a)];
 const sqrt=Math.sqrt(d);
 return [(-b-sqrt)/(2*a),(-b+sqrt)/(2*a)];
}
