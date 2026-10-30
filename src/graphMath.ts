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

/** Slope of the secant through x and x+h; h must be nonzero. */
export function secantSlope(a:number,b:number,c:number,x:number,h:number):number{
 if(!Number.isFinite(h)||h===0)throw new RangeError('A szelőhöz nem nulla h szükséges.');
 return 2*a*x+b+a*h;
}

/** A sequence of positive steps showing how a secant approaches the derivative. */
export function secantConvergence(a:number,b:number,c:number,x:number,steps:readonly number[]=[2,1,0.5,0.1]):{h:number;secant:number;tangent:number;difference:number}[]{
 const tangent=derivativeAt(a,b,x);
 return steps.map(h=>{
  const secant=secantSlope(a,b,c,x,h);
  return {h,secant,tangent,difference:Math.abs(secant-tangent)};
 });
}

/** Finite viewport, with visible intercept, real roots, vertex and selected point. */
export type GraphViewport={xMin:number;xMax:number;yMin:number;yMax:number};
export function graphViewport(a:number,b:number,c:number,probe:number,zoom=1):GraphViewport{
 const roots=realRoots(a,b,c).filter(Number.isFinite);
 const vertexX=a===0?null:-b/(2*a);
 const anchors=[-2,0,2,probe,...roots];
 if(vertexX!==null&&Number.isFinite(vertexX))anchors.push(vertexX);
 const rawMin=Math.min(...anchors),rawMax=Math.max(...anchors);
 const centerX=(rawMin+rawMax)/2;
 const halfX=Math.max(3,(rawMax-rawMin)*0.65)*zoom;
 const xMin=centerX-halfX,xMax=centerX+halfX;
 const ys=[evaluateQuadratic(a,b,c,xMin),evaluateQuadratic(a,b,c,xMax),evaluateQuadratic(a,b,c,0),evaluateQuadratic(a,b,c,probe),0];
 if(vertexX!==null&&vertexX>=xMin&&vertexX<=xMax)ys.push(evaluateQuadratic(a,b,c,vertexX));
 const minY=Math.min(...ys),maxY=Math.max(...ys);
 const centerY=(minY+maxY)/2;
 const halfY=Math.max(3,(maxY-minY)*0.65);
 return {xMin,xMax,yMin:centerY-halfY,yMax:centerY+halfY};
}
export function graphTicks(min:number,max:number):number[]{
 const span=max-min;
 const rough=span/7;
 const power=Math.pow(10,Math.floor(Math.log10(rough)));
 const step=[1,2,5,10].map(x=>x*power).find(x=>x>=rough)??10*power;
 const first=Math.ceil(min/step)*step;
 const result:number[]=[];
 for(let i=0;i<20;i++){const x=Number((first+i*step).toPrecision(12));if(x>max+step*1e-8)break;result.push(x);}
 return result;
}
