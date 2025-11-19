(function(){const L=document.createElement("link").relList;if(L&&L.supports&&L.supports("modulepreload"))return;for(const v of document.querySelectorAll('link[rel="modulepreload"]'))M(v);new MutationObserver(v=>{for(const R of v)if(R.type==="childList")for(const q of R.addedNodes)q.tagName==="LINK"&&q.rel==="modulepreload"&&M(q)}).observe(document,{childList:!0,subtree:!0});function w(v){const R={};return v.integrity&&(R.integrity=v.integrity),v.referrerPolicy&&(R.referrerPolicy=v.referrerPolicy),v.crossOrigin==="use-credentials"?R.credentials="include":v.crossOrigin==="anonymous"?R.credentials="omit":R.credentials="same-origin",R}function M(v){if(v.ep)return;v.ep=!0;const R=w(v);fetch(v.href,R)}})();var bi={},Si;function io(){return Si||(Si=1,(function(s){function L(l,e=0,t=1){return Math.max(e,Math.min(l,t))}function w(l,e,t){const i=t-e,n=l-e;if(n>=0)return n%i+e;{let o=i+n%i+e;return o>=t&&(o-=i),o}}function M(l,e,t){return e<=l&&l<t}function v(l){return[...Array(l).keys()]}function R(l,e){return v(l).map(t=>e(t))}function q(l,e){let t=[];for(let i=0,n=0;i<l.length;n++)e(l[i],n)?(t.push(l[i]),l.splice(i,1)):i++;return t}function pt(l){return[...l].reduce((e,[t,i])=>(e[t]=i,e),{})}function yt(l){return Object.keys(l).map(e=>[e,l[e]])}function Pi(l,e){return String.fromCharCode(l.charCodeAt(0)+e)}function El(l){return l.x!=null&&l.y!=null}class p{constructor(e,t){this.x=0,this.y=0,this.set(e,t)}set(e=0,t=0){return El(e)?(this.x=e.x,this.y=e.y,this):(this.x=e,this.y=t,this)}add(e,t){return El(e)?(this.x+=e.x,this.y+=e.y,this):(this.x+=e,this.y+=t,this)}sub(e,t){return El(e)?(this.x-=e.x,this.y-=e.y,this):(this.x-=e,this.y-=t,this)}mul(e){return this.x*=e,this.y*=e,this}div(e){return this.x/=e,this.y/=e,this}clamp(e,t,i,n){return this.x=L(this.x,e,t),this.y=L(this.y,i,n),this}wrap(e,t,i,n){return this.x=w(this.x,e,t),this.y=w(this.y,i,n),this}addWithAngle(e,t){return this.x+=Math.cos(e)*t,this.y+=Math.sin(e)*t,this}swapXy(){const e=this.x;return this.x=this.y,this.y=e,this}normalize(){return this.div(this.length),this}rotate(e){if(e===0)return this;const t=this.x;return this.x=t*Math.cos(e)-this.y*Math.sin(e),this.y=t*Math.sin(e)+this.y*Math.cos(e),this}angleTo(e,t){return El(e)?Math.atan2(e.y-this.y,e.x-this.x):Math.atan2(t-this.y,e-this.x)}distanceTo(e,t){let i,n;return El(e)?(i=e.x-this.x,n=e.y-this.y):(i=e-this.x,n=t-this.y),Math.sqrt(i*i+n*n)}isInRect(e,t,i,n){return M(this.x,e,e+i)&&M(this.y,t,t+n)}equals(e){return this.x===e.x&&this.y===e.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const hl=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],Mi="twrgybpclRGYBPCL";let sl,ol;const Ri=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function Ti(l,e){const[t,i,n]=ve(0,l);if(sl=pt(hl.map((o,r)=>{if(r<1)return[o,{r:0,g:0,b:0,a:0}];if(r<9){const[m,h,f]=ve(r-1,l);return[o,{r:m,g:h,b:f,a:1}]}const[c,u,d]=ve(r-9+1,l);return[o,{r:Math.floor(l?c*.5:t-(t-c)*.5),g:Math.floor(l?u*.5:n-(n-u)*.5),b:Math.floor(l?d*.5:i-(i-d)*.5),a:1}]})),l){const o=sl.blue;sl.white={r:Math.floor(o.r*.15),g:Math.floor(o.g*.15),b:Math.floor(o.b*.15),a:1}}e!=null&&Oi(e)}function Oi(l){ol=l.map(e=>({r:e[0],g:e[1],b:e[2],a:1}));for(let e=0;e<hl.length;e++){let t=1/0,i=-1;for(let n=0;n<ol.length;n++){const o=Fi(ol[n],sl[hl[e]]);o<t&&(t=o,i=n)}sl[hl[e]]=ol[i]}}function Fi(l,e){const t={r:.299,g:.587,b:.114},i=l.r-e.r,n=l.g-e.g,o=l.b-e.b,r=e.r===e.g&&e.g===e.b;let c=Math.sqrt(i*i*t.r+n*n*t.g+o*o*t.b);return r&&!(e.r===0&&e.g===0&&e.b===0)&&(c*=1.5),c}function ve(l,e){e&&(l===0?l=7:l===7&&(l=0));const t=Ri[l];return[(t&16711680)>>16,(t&65280)>>8,t&255]}function ml(l,e=1){const t=wt(l);return Math.floor(t.r*e)<<16|Math.floor(t.g*e)<<8|Math.floor(t.b*e)}function pl(l,e=1){const t=wt(l),i=Math.floor(t.r*e),n=Math.floor(t.g*e),o=Math.floor(t.b*e);return t.a<1?`rgba(${i},${n},${o},${t.a})`:`rgb(${i},${n},${o})`}function wt(l){if(typeof l=="number"){if(ol==null)throw new Error(`color(${l}) is invalid because no custom color palette is defined.`);const t=ol[l];if(t==null)throw new Error(`color(${l}) is out of bounds for the current color palette (length: ${ol.length}).`);return t}if(sl==null)throw new Error(`color("${l}") was used before the color system was initialized.`);const e=sl[l];if(e==null)throw new Error(`Unknown color "${l}". Supported colors: ${hl.join(", ")}.`);return e}const Ii=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float width;
uniform float height;

float gridValue(vec2 uv, float res) {
  vec2 grid = fract(uv * res);
  return (step(res, grid.x) * step(res, grid.y));
}

void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);  
  vec2 grid_uv = vTextureCoord.xy * vec2(width, height);
  float v = gridValue(grid_uv, 0.2);
  gl_FragColor.rgba = color * v;
}
`;function ki(l,e){return new PIXI.Filter(void 0,Ii,{width:l,height:e})}const E=new p;let O,H,C,F=new p;const bt=5;document.createElement("img");let P,Pl,Ml=1,xe="black",A,St,yl=!1,y,Ct;function Di(l,e,t,i,n,o,r,c){E.set(l),y=c,xe=t;const u=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${e};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${e};
color: #888;
`,d=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,m=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=u,F.set(E),y.isUsingPixi){F.mul(bt);const f=new PIXI.Application({width:F.x,height:F.y});if(O=f.view,C=new PIXI.Graphics,C.scale.x=C.scale.y=bt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,f.stage.addChild(C),C.filters=[],y.name==="crt"&&C.filters.push(Ct=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),y.name==="pixel"&&C.filters.push(ki(F.x,F.y)),y.name==="pixel"||y.name==="shapeDark"){const g=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:y.name==="pixel"?1.5:1,brightness:y.name==="pixel"?1.5:1,blur:8});C.filters.push(g)}C.lineStyle(0),O.style.cssText=d}else O=document.createElement("canvas"),O.width=F.x,O.height=F.y,H=O.getContext("2d"),H.imageSmoothingEnabled=!1,O.style.cssText=d+m;document.body.appendChild(O);const h=()=>{const g=innerWidth/innerHeight,x=F.x/F.y,b=g<x,k=b?.95*innerWidth:.95*innerHeight*x,T=b?.95*innerWidth/x:.95*innerHeight;O.style.width=`${k}px`,O.style.height=`${T}px`};if(window.addEventListener("resize",h),h(),i){P=document.createElement("canvas");let f;n?(P.width=F.x,P.height=F.y,f=o):(F.x<=F.y*2?(P.width=F.y*2,P.height=F.y):(P.width=F.x,P.height=F.x/2),P.width>400&&(Ml=400/P.width,P.width=400,P.height*=Ml),f=Math.round(400/P.width)),Pl=P.getContext("2d"),Pl.fillStyle=e,gcc.setOptions({scale:f,capturingFps:60,isSmoothingEnabled:!1,durationSec:r})}}function Rl(){if(y.isUsingPixi){C.clear(),C.beginFill(ml(xe,y.isDarkColor?.15:1)),C.drawRect(0,0,E.x,E.y),C.endFill(),C.beginFill(ml(A)),yl=!0;return}H.fillStyle=pl(xe,y.isDarkColor?.15:1),H.fillRect(0,0,E.x,E.y),H.fillStyle=pl(A)}function j(l){if(l===A){y.isUsingPixi&&!yl&&Jl(ml(A));return}if(A=l,y.isUsingPixi){yl&&C.endFill(),Jl(ml(A));return}H.fillStyle=pl(l)}function Jl(l){ql(),C.beginFill(l),yl=!0}function ql(){yl&&(C.endFill(),yl=!1)}function Hl(){St=A}function Wl(){j(St)}function wl(l,e,t,i){if(y.isUsingPixi){y.name==="shape"||y.name==="shapeDark"?C.drawRoundedRect(l,e,t,i,2):C.drawRect(l,e,t,i);return}H.fillRect(l,e,t,i)}function Ai(l,e,t,i,n){const o=ml(A);Jl(o),C.drawCircle(l,e,n*.5),C.drawCircle(t,i,n*.5),ql(),C.lineStyle(n,o),C.moveTo(l,e),C.lineTo(t,i),C.lineStyle(0)}function Ui(){Ct.time+=.2}function Li(){if(Pl.fillRect(0,0,P.width,P.height),Ml===1)Pl.drawImage(O,(P.width-O.width)/2,(P.height-O.height)/2);else{const l=O.width*Ml,e=O.height*Ml;Pl.drawImage(O,(P.width-l)/2,(P.height-e)/2,l,e)}gcc.capture(P)}const vt=[`
l
l
l

l
`,`
l l
l l



`,`
 l l
lllll
 l l
lllll
 l l
`,`
 lll
l l
 lll
  l l
 lll
`,`
l   l
l  l
  l
 l  l
l   l
`,`
 l
l l
 ll l
l  l
 ll l
`,`
l
l



`,`
 l
l
l
l
 l
`,`
l
 l
 l
 l
l
`,`
  l
l l l
 lll
l l l
  l
`,`
  l
  l
lllll
  l
  l
`,`



 l
l
`,`


lllll


`,`




l
`,`
    l
   l
  l
 l
l
`,`
 lll
l  ll
l l l
ll  l
 lll
`,`
 ll
l l
  l
  l
lllll
`,`
 lll
l   l
  ll
 l
lllll
`,`
llll
    l
  ll
    l
llll
`,`
  ll
 l l
l  l
lllll
   l
`,`
lllll
l
llll
    l
llll
`,`
 lll
l
llll
l   l
 lll
`,`
lllll
l   l
   l
  l
 l
`,`
 lll
l   l
 lll
l   l
 lll
`,`
 lll
l   l
 llll
    l
 lll
`,`

l

l

`,`

 l

 l
l
`,`
   ll
 ll
l
 ll
   ll
`,`

lllll

lllll

`,`
ll
  ll
    l
  ll
ll
`,`
 lll
l   l
  ll

  l
`,`
 lll
l   l
l lll
l
 lll
`,`
 lll
l   l
lllll
l   l
l   l
`,`
llll
l   l
llll
l   l
llll
`,`
 llll
l
l
l
 llll
`,`
llll
l   l
l   l
l   l
llll
`,`
lllll
l
llll
l
lllll
`,`
lllll
l
llll
l
l
`,`
 lll
l
l  ll
l   l
 llll
`,`
l   l
l   l
lllll
l   l
l   l
`,`
lllll
  l
  l
  l
lllll
`,`
  lll
   l
   l
   l
lll
`,`
l   l
l  l
lll
l  l
l   l
`,`
l
l
l
l
lllll
`,`
l   l
ll ll
l l l
l   l
l   l
`,`
l   l
ll  l
l l l
l  ll
l   l
`,`
 lll
l   l
l   l
l   l
 lll
`,`
llll
l   l
llll
l
l
`,`
 lll
l   l
l   l
l  ll
 llll
`,`
llll
l   l
llll
l   l
l   l
`,`
 llll
l
 lll
    l
llll
`,`
lllll
  l
  l
  l
  l
`,`
l   l
l   l
l   l
l   l
 lll
`,`
l   l
l   l
l   l
 l l
  l
`,`
l   l
l l l
l l l
l l l
 l l
`,`
l   l
 l l
  l
 l l
l   l
`,`
l   l
 l l
  l
  l
  l
`,`
lllll
   l
  l
 l
lllll
`,`
  ll
  l
  l
  l
  ll
`,`
l
 l
  l
   l
    l
`,`
 ll
  l
  l
  l
 ll
`,`
  l
 l l



`,`




lllll
`,`
 l
  l



`,`

 lll
l  l
l  l
 lll
`,`
l
l
lll
l  l
lll
`,`

 lll
l  
l
 lll
`,`
   l
   l
 lll
l  l
 lll
`,`

 ll
l ll
ll
 ll
`,`
  l
 l 
lll
 l
 l
`,`
 ll
l  l
 lll
   l
 ll
`,`
l
l
ll
l l
l l
`,`

l

l
l
`,`
 l

 l
 l
l
`,`
l
l
l l
ll
l l
`,`
ll
 l
 l
 l
lll
`,`

llll
l l l
l l l
l   l
`,`

lll
l  l
l  l
l  l
`,`

 ll
l  l
l  l
 ll
`,`

lll
l  l
lll
l
`,`

 lll
l  l
 lll
   l
`,`

l ll
ll
l
l
`,`

 lll
ll
  ll
lll
`,`

 l
lll
 l
  l
`,`

l  l
l  l
l  l
 lll
`,`

l  l
l  l
 ll
 ll
`,`

l   l
l l l
l l l
 l l
`,`

l  l
 ll
 ll
l  l
`,`

l  l
 ll
 l
l
`,`

llll
  l
 l
llll
`,`
 ll
 l
l
 l
 ll
`,`
l
l
l
l
l
`,`
ll
 l
  l
 l
ll
`,`

 l
l l l
   l

`],zi=[`
 l
 l
 l

 l
`,`
l l
l l



`,`
l l
lll
l l
lll
l l
`,`
 ll
ll
lll
 ll
ll
`,`
l l
  l
 l
l
l l
`,`
ll
ll
lll
l 
lll
`,`
 l
 l



`,`
  l
 l
 l
 l
  l
`,`
l
 l
 l
 l
l
`,`
 l
lll
 l
lll
 l
`,`
 l
 l
lll
 l
 l
`,`



 l
l
`,`


lll


`,`




 l
`,`
  l
 l
 l
 l
l
`,`
lll
l l
l l
l l
lll
`,`
  l
  l
  l
  l
  l
`,`
lll
  l
lll
l
lll
`,`
lll
  l
lll
  l
lll
`,`
l l
l l
lll
  l
  l
`,`
lll
l
lll
  l
lll
`,`
l
l
lll
l l
lll
`,`
lll
  l
  l
  l
  l
`,`
lll
l l
lll
l l
lll
`,`
lll
l l
lll
  l
  l
`,`

 l

 l

`,`

 l

 l
l
`,`
  l
 l
l
 l
  l
`,`

lll

lll

`,`
l
 l
  l
 l
l
`,`
lll
  l
 ll

 l
`,`

lll
l l
l
 ll
`,`
lll
l l
lll
l l
l l
`,`
ll
l l
lll
l l
ll
`,`
lll
l
l
l
lll
`,`
ll
l l
l l
l l
ll
`,`
lll
l
lll
l
lll
`,`
lll
l
lll
l
l
`,`
lll
l
l l
l l
 ll
`,`
l l
l l
lll
l l
l l
`,`
 l
 l
 l
 l
 l
`,`
  l
  l
  l
  l
ll
`,`
l l
l l
ll
l l
l l
`,`
l
l
l
l
lll
`,`
l l
lll
l l
l l
l l
`,`
l l
lll
lll
lll
l l
`,`
lll
l l
l l
l l
lll
`,`
lll
l l
lll
l
l
`,`
lll
l l
l l
lll
lll
`,`
ll
l l
ll
l l
l l
`,`
lll
l
lll
  l
lll
`,`
lll
 l
 l
 l
 l
`,`
l l
l l
l l
l l
lll
`,`
l l
l l
l l
l l
 l
`,`
l l
l l
lll
lll
l l
`,`
l l
l l
 l
l l
l l
`,`
l l
l l
lll
 l
 l
`,`
lll
  l
 l
l
lll
`,`
 ll
 l
 l
 l
 ll
`,`
l
 l
 l
 l
  l
`,`
ll
 l
 l
 l
ll
`,`
 l
l l



`,`




lll
`,`
l
 l



`,`


 ll
l l
 ll
`,`

l
lll
l l
lll
`,`


lll
l
lll
`,`

  l
lll
l l
lll
`,`


lll
l
 ll
`,`

 ll
 l
lll
 l
`,`

lll
lll
  l
ll
`,`

l
l
lll
l l
`,`

 l

 l
 l
`,`

 l

 l
ll
`,`

l
l l
ll
l l
`,`

 l
 l
 l
 l
`,`


lll
lll
l l
`,`


ll
l l
l l
`,`


lll
l l
lll
`,`


lll
lll
l
`,`


lll
lll
  l
`,`


lll
l
l
`,`


 ll
lll
ll
`,`


lll
 l
 l
`,`


l l
l l
lll
`,`


l l
l l
 l
`,`


l l
lll
l l
`,`


l l
 l
l l
`,`


l l
 l
l
`,`


lll
 l
lll
`,`
 ll
 l
l
 l
 ll
`,`
 l
 l
 l
 l
 l
`,`
ll
 l
  l
 l
ll
`,`

l
lll
  l

`];let bl,Xl;function ji(){bl=[],Xl=[]}function xt(){bl=bl.concat(Xl),Xl=[]}function Et(l){let e={isColliding:{rect:{},text:{},char:{}}};return bl.forEach(t=>{Bi(l,t)&&(e=Object.assign(Object.assign(Object.assign({},e),Ee(t.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},e.isColliding.rect),t.collision.isColliding.rect),text:Object.assign(Object.assign({},e.isColliding.text),t.collision.isColliding.text),char:Object.assign(Object.assign({},e.isColliding.char),t.collision.isColliding.char)}}))}),e}function Bi(l,e){const t=e.pos.x-l.pos.x,i=e.pos.y-l.pos.y;return-e.size.x<t&&t<l.size.x&&-e.size.y<i&&i<l.size.y}function Ee(l){if(l==null)return{};const e={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let t={};return yt(l).forEach(([i,n])=>{const o=e[i];n&&o!=null&&(t[o]=!0)}),t}function Pt(l,e,t,i){return Mt(!1,l,e,t,i)}function Ni(l,e,t,i){return Mt(!0,l,e,t,i)}function Mt(l,e,t,i,n){if(typeof t=="number"){if(typeof i=="number")return K(e,t,i,Object.assign({isCharacter:l,isCheckingCollision:!0,color:A},n));throw new Error(`${l?"char":"text"}(): expected numeric y when x is a number.`)}else return K(e,t.x,t.y,Object.assign({isCharacter:l,isCheckingCollision:!0,color:A},i))}const Tl=6,_i=4,_=1,S=Tl*_,tl=_i*_;let Pe,Me,Yl,Re,Te=!1,Sl,Oe,Ol,Ql;const Fe={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function Ki(){Sl=document.createElement("canvas"),Sl.width=Sl.height=S,Oe=Sl.getContext("2d"),Ol=document.createElement("canvas"),Ql=Ol.getContext("2d"),Pe=vt.map((l,e)=>Zl(l,String.fromCharCode(33+e),!1)),Me=zi.map((l,e)=>Zl(l,String.fromCharCode(33+e),!1)),Yl=vt.map((l,e)=>Zl(l,String.fromCharCode(33+e),!0)),Re={}}function Vi(l,e){const t=e.charCodeAt(0)-33;l.forEach((i,n)=>{Yl[t+n]=Zl(i,String.fromCharCode(33+t+n),!0)})}function Gi(){Te=!0}function K(l,e,t,i={}){const n=Ot(i);let o=l,r=e,c=t,u,d={isColliding:{rect:{},text:{},char:{}}};const m=n.isSmallText?tl:S;for(let h=0;h<o.length;h++){if(h===0){const x=o.charCodeAt(0);if(x<33||x>126)r=Math.floor(r-S/2*n.scale.x),c=Math.floor(c-S/2*n.scale.y);else{const b=x-33,k=n.isCharacter?Yl[b]:n.isSmallText?Me[b]:Pe[b];r=Math.floor(r-k.size.x/2*n.scale.x),c=Math.floor(c-k.size.y/2*n.scale.y)}u=r}const f=o[h];if(f===`
`){r=u,c+=S*n.scale.y;continue}const g=Ji(f,r,c,n);n.isCheckingCollision&&(d={isColliding:{rect:Object.assign(Object.assign({},d.isColliding.rect),g.isColliding.rect),text:Object.assign(Object.assign({},d.isColliding.text),g.isColliding.text),char:Object.assign(Object.assign({},d.isColliding.char),g.isColliding.char)}}),r+=m*n.scale.x}return d}function Ji(l,e,t,i){const n=l.charCodeAt(0);if(n<32||n>126)return{isColliding:{rect:{},text:{},char:{}}};const o=Ot(i);if(o.backgroundColor!=="transparent"){const T=o.isSmallText?tl:S,we=o.isSmallText?2:1;Hl(),j(o.backgroundColor),wl(e+we,t,T*o.scale.x,S*o.scale.y),Wl()}if(n<=32)return{isColliding:{rect:{},text:{},char:{}}};const r=n-33,c=o.isCharacter?Yl[r]:o.isSmallText?Me[r]:Pe[r],u=w(o.rotation,0,4);if(o.color==="black"&&u===0&&o.mirror.x===1&&o.mirror.y===1&&o.edgeColor==null&&(!y.isUsingPixi||o.scale.x===1&&o.scale.y===1))return Ie(c,e,t,o.scale,o.isCheckingCollision,!0);const d=JSON.stringify({c:l,options:o}),m=Re[d];if(m!=null)return Ie(m,e,t,o.scale,o.isCheckingCollision,o.color!=="transparent");let h=!1;const f=new p(S,S);let g=Sl,x=Oe;if(c.size.x>S||c.size.y>S){if(u===0||u===2)f.set(c.size.x,c.size.y);else{const T=Math.max(c.size.x,c.size.y);f.set(T,T)}g=document.createElement("canvas"),g.width=f.x,g.height=f.y,x=g.getContext("2d"),x.imageSmoothingEnabled=!1}y.isUsingPixi&&(o.scale.x!==1||o.scale.y!==1)&&(Ol.width=f.x*o.scale.x,Ol.height=f.y*o.scale.y,Ql.imageSmoothingEnabled=!1,Ql.scale(o.scale.x,o.scale.y),Rt(Ql,u,o,c.image,f),h=!0),x.clearRect(0,0,f.x,f.y),Rt(x,u,o,c.image,f);const b=ke(x,f,l,o.isCharacter);o.edgeColor!=null&&(g=qi(x,f,o.edgeColor),f.x+=2,f.y+=2);let k;if(Te||y.isUsingPixi){const T=document.createElement("img");if(T.src=g.toDataURL(),y.isUsingPixi){const we=document.createElement("img");we.src=(h?Ol:g).toDataURL(),k=PIXI.Texture.from(we)}Te&&(Re[d]={image:T,texture:k,hitBox:b,size:f})}return Ie({image:g,texture:k,hitBox:b,size:f},e,t,o.scale,o.isCheckingCollision,o.color!=="transparent")}function qi(l,e,t){const i=e.x+2,n=e.y+2,o=[[0,-1],[1,0],[0,1],[-1,0]],r=document.createElement("canvas");r.width=i,r.height=n;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(l.canvas,1,1);const d=c.getImageData(0,0,i,n).data;c.fillStyle=pl(t);for(let m=0;m<n;m++)for(let h=0;h<i;h++){const f=(m*i+h)*4;if(d[f+3]===0)for(const[g,x]of o){const b=h+g,k=m+x;if(b>=0&&b<i&&k>=0&&k<n){const T=(k*i+b)*4;if(d[T+3]>0){c.fillRect(h,m,1,1);break}}}}return r}function Rt(l,e,t,i,n){e===0&&t.mirror.x===1&&t.mirror.y===1?l.drawImage(i,0,0):(l.save(),l.translate(n.x/2,n.y/2),l.rotate(Math.PI/2*e),(t.mirror.x===-1||t.mirror.y===-1)&&l.scale(t.mirror.x,t.mirror.y),l.drawImage(i,-n.x/2,-n.y/2),l.restore()),t.color!=="black"&&(l.globalCompositeOperation="source-in",l.fillStyle=pl(t.color==="transparent"?"black":t.color),l.fillRect(0,0,n.x,n.y),l.globalCompositeOperation="source-over")}function Ie(l,e,t,i,n,o){if(o&&(i.x===1&&i.y===1?Tt(l,e,t):Tt(l,e,t,l.size.x*i.x,l.size.y*i.y)),!n)return;const r={pos:{x:e+l.hitBox.pos.x*i.x,y:t+l.hitBox.pos.y*i.y},size:{x:l.hitBox.size.x*i.x,y:l.hitBox.size.y*i.y},collision:l.hitBox.collision},c=Et(r);return o&&bl.push(r),c}function Tt(l,e,t,i,n){if(y.isUsingPixi){ql(),C.beginTextureFill({texture:l.texture,matrix:new PIXI.Matrix().translate(e,t)}),C.drawRect(e,t,i??l.size.x,n??l.size.y),Jl(ml(A));return}i==null?H.drawImage(l.image,e,t):H.drawImage(l.image,e,t,i,n)}function Zl(l,e,t){if(l.indexOf(".")>=0||l.indexOf("data:image/")==0)return Hi(l,e);let i=l.split(`
`);i=i.slice(1,i.length-1);let n=0;i.forEach(g=>{n=Math.max(g.length,n)});const o=Math.max(Math.ceil((Tl-n)/2),0),r=i.length,c=Math.max(Math.ceil((Tl-r)/2),0),u=new p(Math.max(Tl,n)*_,Math.max(Tl,r)*_);let d=Sl,m=Oe;(u.x>S||u.y>S)&&(d=document.createElement("canvas"),d.width=u.x,d.height=u.y,m=d.getContext("2d"),m.imageSmoothingEnabled=!1),m.clearRect(0,0,u.x,u.y),i.forEach((g,x)=>{for(let b=0;b<n;b++){const k=g.charAt(b);let T=Mi.indexOf(k);k!==""&&T>=1&&(m.fillStyle=pl(hl[T]),m.fillRect((b+o)*_,(x+c)*_,_,_))}});const h=document.createElement("img");h.src=d.toDataURL();const f=ke(m,u,e,t);return y.isUsingPixi?{image:h,texture:PIXI.Texture.from(h),size:u,hitBox:f}:{image:h,size:u,hitBox:f}}function Hi(l,e){const t=document.createElement("img");t.src=l;const i=new p,n={pos:new p,size:new p,collision:{isColliding:{char:{},text:{}}}};let o;return y.isUsingPixi?o={image:t,texture:PIXI.Texture.from(t),size:new p,hitBox:n}:o={image:t,size:i,hitBox:n},t.onload=()=>{o.size.set(t.width*_,t.height*_);const r=document.createElement("canvas");r.width=o.size.x,r.height=o.size.y;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(t,0,0,o.size.x,o.size.y);const u=document.createElement("img");u.src=r.toDataURL(),o.image=u,o.hitBox=ke(c,o.size,e,!0),y.isUsingPixi&&(o.texture=PIXI.Texture.from(u))},o}function ke(l,e,t,i){const n={pos:new p(S,S),size:new p,collision:{isColliding:{char:{},text:{}}}};i?n.collision.isColliding.char[t]=!0:n.collision.isColliding.text[t]=!0;const o=l.getImageData(0,0,e.x,e.y).data;let r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u<n.pos.x&&(n.pos.x=u),c<n.pos.y&&(n.pos.y=c)),r+=4;r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u>n.pos.x+n.size.x-1&&(n.size.x=u-n.pos.x+1),c>n.pos.y+n.size.y-1&&(n.size.y=c-n.pos.y+1)),r+=4;return n}function Ot(l){let e=Object.assign(Object.assign({},Fe),l);return l.scale!=null&&(e.scale=Object.assign(Object.assign({},Fe.scale),l.scale)),l.mirror!=null&&(e.mirror=Object.assign(Object.assign({},Fe.mirror),l.mirror)),e}let Cl=!1,$l=!1,De=!1;const Ft=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Ae;const Wi={onKeyDown:void 0};let Ue,Le=!1,ze=!1,je=!1,Be={},Ne={},_e={};function It(l){Ue=Object.assign(Object.assign({},Wi),l),Ae=pt(Ft.map(e=>[e,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",e=>{Le=ze=!0,Be[e.code]=Ne[e.code]=!0,Ue.onKeyDown!=null&&Ue.onKeyDown(),(e.code==="AltLeft"||e.code==="AltRight"||e.code==="ArrowRight"||e.code==="ArrowDown"||e.code==="ArrowLeft"||e.code==="ArrowUp")&&e.preventDefault()}),document.addEventListener("keyup",e=>{Le=!1,je=!0,Be[e.code]=!1,_e[e.code]=!0})}function kt(){$l=!Cl&&ze,De=Cl&&je,ze=je=!1,Cl=Le,yt(Ae).forEach(([l,e])=>{e.isJustPressed=!e.isPressed&&Ne[l],e.isJustReleased=e.isPressed&&_e[l],e.isPressed=!!Be[l]}),Ne={},_e={}}function Dt(){$l=!1,Cl=!0}var Xi=Object.freeze({__proto__:null,clearJustPressed:Dt,get code(){return Ae},codes:Ft,init:It,get isJustPressed(){return $l},get isJustReleased(){return De},get isPressed(){return Cl},update:kt});class Fl{constructor(e=null){this.setSeed(e)}get(e=1,t){return t==null&&(t=e,e=0),this.next()/4294967295*(t-e)+e}getInt(e,t){t==null&&(t=e,e=0);const i=Math.floor(e),n=Math.floor(t);return n===i?i:this.next()%(n-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(e){return e[this.getInt(e.length)]}setSeed(e,t=123456789,i=362436069,n=521288629,o=32){this.w=e!=null?e>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=t>>>0,this.y=i>>>0,this.z=n>>>0;for(let r=0;r<o;r++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const e=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(e^e>>>8))>>>0,this.w}}const Il=new p;let W=!1,vl=!1,kl=!1,Yi={isDebugMode:!1,anchor:new p,padding:new p,onPointerDownOrUp:void 0},z,B,D;const Dl=new Fl,rl=new p,X=new p;let Al=!1,Ul=new p,Ke=!1,Ve=!1,Ge=!1;function At(l,e,t){D=Object.assign(Object.assign({},Yi),t),z=l,B=new p(e.x+D.padding.x*2,e.y+D.padding.y*2),Ul.set(z.offsetLeft+z.clientWidth*(.5-D.anchor.x),z.offsetTop+z.clientWidth*(.5-D.anchor.y)),D.isDebugMode&&rl.set(z.offsetLeft+z.clientWidth*(.5-D.anchor.x),z.offsetTop+z.clientWidth*(.5-D.anchor.y)),document.addEventListener("mousedown",i=>{zt(i.pageX,i.pageY)}),document.addEventListener("touchstart",i=>{zt(i.touches[0].pageX,i.touches[0].pageY)}),document.addEventListener("mousemove",i=>{jt(i.pageX,i.pageY)}),document.addEventListener("touchmove",i=>{i.preventDefault(),jt(i.touches[0].pageX,i.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",i=>{Bt()}),document.addEventListener("touchend",i=>{i.preventDefault(),i.target.click(),Bt()},{passive:!1})}function Ut(){Qi(Ul.x,Ul.y,Il),D.isDebugMode&&!Il.isInRect(0,0,B.x,B.y)?(Zi(),Il.set(rl),vl=!W&&Al,kl=W&&!Al,W=Al):(vl=!W&&Ve,kl=W&&Ge,W=Ke),Ve=Ge=!1}function Lt(){vl=!1,W=!0}function Qi(l,e,t){z!=null&&(t.x=Math.round(((l-z.offsetLeft)/z.clientWidth+D.anchor.x)*B.x-D.padding.x),t.y=Math.round(((e-z.offsetTop)/z.clientHeight+D.anchor.y)*B.y-D.padding.y))}function Zi(){X.length>0?(rl.add(X),!M(rl.x,-B.x*.1,B.x*1.1)&&rl.x*X.x>0&&(X.x*=-1),!M(rl.y,-B.y*.1,B.y*1.1)&&rl.y*X.y>0&&(X.y*=-1),Dl.get()<.05&&X.set(0)):Dl.get()<.1&&(X.set(0),X.addWithAngle(Dl.get(Math.PI*2),(B.x+B.y)*Dl.get(.01,.03))),Dl.get()<.05&&(Al=!Al)}function zt(l,e){Ul.set(l,e),Ke=Ve=!0,D.onPointerDownOrUp!=null&&D.onPointerDownOrUp()}function jt(l,e){Ul.set(l,e)}function Bt(l){Ke=!1,Ge=!0,D.onPointerDownOrUp!=null&&D.onPointerDownOrUp()}var $i=Object.freeze({__proto__:null,clearJustPressed:Lt,init:At,get isJustPressed(){return vl},get isJustReleased(){return kl},get isPressed(){return W},pos:Il,update:Ut});let Y=new p,Q=!1,V=!1,il=!1;function Nt(l){It({onKeyDown:l}),At(O,E,{onPointerDownOrUp:l,anchor:new p(.5,.5)})}function _t(){kt(),Ut(),Y=Il,Q=Cl||W,V=$l||vl,il=De||kl}function Kt(){Dt(),Lt()}function Ll(l){Y.set(l.pos),Q=l.isPressed,V=l.isJustPressed,il=l.isJustReleased}var ln=Object.freeze({__proto__:null,clearJustPressed:Kt,init:Nt,get isJustPressed(){return V},get isJustReleased(){return il},get isPressed(){return Q},get pos(){return Y},set:Ll,update:_t});const en={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"};let I,le=!1,nl,zl,Je=!1,ee;s.algoChipSession=void 0;let qe,Vt,He={},Gt,Z=!1,te,We,xl=!1,Xe=!1,jl,Jt,Ye,$={},ie,Qe;async function tn(l){if(nl=l.audioSeed,zl=l.audioVolume,ie=l.bgmName,Qe=l.bgmVolume,typeof AlgoChip<"u"&&AlgoChip!==null&&typeof AlgoChipUtil<"u"&&AlgoChipUtil!==null?Je=le=!0:typeof sss<"u"&&sss!==null&&(Z=le=!0),typeof audioFiles<"u"&&audioFiles!=null&&(xl=le=!0),!le)return!1;if(I=new(window.AudioContext||window.webkitAudioContext),xl){document.addEventListener("visibilitychange",()=>{document.hidden?I.suspend():I.resume()}),dn(),Xt(.1*zl),Wt(l.audioTempo);for(let e in audioFiles){const t=fn(e,audioFiles[e]);e===ie&&(t.isLooping=!0,Xe=!0)}}return Je&&(ee=I.createGain(),ee.connect(I.destination),s.algoChipSession=AlgoChipUtil.createAudioSession({audioContext:I,gainNode:ee,workletBasePath:"https://abagames.github.io/algo-chip/worklets/"}),await s.algoChipSession.ensureReady(),s.algoChipSession.setBgmVolume(.5*zl),Gt=AlgoChipUtil.createVisibilityController(s.algoChipSession)),Z&&(te=I.createGain(),te.connect(I.destination),sss.init(nl,I,te),sss.setVolume(.1*zl),sss.setTempo(l.audioTempo)),!0}function nn(l,e){if(!(xl&&qt(l,e!=null&&e.volume!=null?e.volume:1)))if(s.algoChipSession!=null){let t=l,i=nl;t==="powerUp"?t="powerup":(t==="random"||t==="lucky")&&(t="explosion",i++);let n;e?.freq!=null?n=e.freq:e?.pitch!=null&&(n=2**((e.pitch-69)/12)*440);const o={seed:i,type:t,baseFrequency:n},r=JSON.stringify(o);He[r]==null&&(He[r]=s.algoChipSession.generateSe(o)),s.algoChipSession.playSe(He[r],{volume:zl*(e?.volume!=null?e?.volume:1)*.7,duckingDb:-8,quantize:{loopAware:!0,phase:"next",quantizeTo:"half_beat",fallbackTempo:120}})}else Z&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(l,e):Z&&sss.play(en[l])}function sn(l){nl=l,Z&&sss.setSeed(l)}async function Ze(){if(!(Xe&&qt(ie,Qe)))if(s.algoChipSession!=null){if(qe==null||Vt!=nl){Vt=nl;const l=new Fl;l.setSeed(nl);const e=l.get(-.9,.9),t=l.get(-.9,.9);qe=await s.algoChipSession.generateBgm({seed:nl,lengthInMeasures:32,twoAxisStyle:{calmEnergetic:e,percussiveMelodic:t},overrides:{tempo:"medium"}})}s.algoChipSession.playBgm(qe,{loop:!0})}else Z&&typeof sss.generateMml=="function"?We=sss.playMml(sss.generateMml(),{volume:Qe}):Z&&sss.playBgm()}function Bl(){Xe?Ht(ie):s.algoChipSession!=null?s.algoChipSession.stopBgm():We!=null?sss.stopMml(We):Z&&sss.stopBgm()}function on(){xl&&cn(),Z&&sss.update()}function rn(){I?.resume(),s.algoChipSession!=null&&s.algoChipSession.resumeAudioContext()}function an(){xl&&un(),Je&&(Gt(),s.algoChipSession!=null&&s.algoChipSession.close())}function qt(l,e=1){const t=$[l];return t==null?!1:(t.gainNode.gain.value=e,t.isPlaying=!0,!0)}function cn(){const l=I.currentTime;for(const e in $){const t=$[e];if(!t.isReady||!t.isPlaying)continue;t.isPlaying=!1;const i=yn(l);(t.playedTime==null||i>t.playedTime)&&(hn(t,i),t.playedTime=i)}}function Ht(l,e=void 0){const t=$[l];t.source!=null&&(e==null?t.source.stop():t.source.stop(e),t.source=void 0)}function un(l=void 0){if($){for(const e in $)Ht(e,l);$={}}}function dn(){xl=!0,jl=I.createGain(),jl.connect(I.destination),Wt(),gn(),Xt()}function fn(l,e){return $[l]=mn(e),$[l]}function Wt(l=120){Jt=60/l}function gn(l=8){Ye=l>0?4/l:void 0}function Xt(l=.1){jl.gain.value=l}function hn(l,e){const t=I.createBufferSource();l.source=t,t.buffer=l.buffer,t.loop=l.isLooping,t.start=t.start||t.noteOn,t.connect(l.gainNode),t.start(e)}function mn(l){const e={buffer:void 0,source:void 0,gainNode:I.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return e.gainNode.connect(jl),pn(l).then(t=>{e.buffer=t,e.isReady=!0}),e}async function pn(l){const t=await(await fetch(l)).arrayBuffer();return await I.decodeAudioData(t)}function yn(l){if(Ye==null)return l;const e=Jt*Ye;return e>0?Math.ceil(l/e)*e:l}let Yt,Qt;const Zt=68,$e=1e3/Zt;let Nl=0,$t=10,ne,li;async function wn(l,e,t){Yt=l,Qt=e,li=t,await Yt(),ei()}function ei(){ne=requestAnimationFrame(ei);const l=window.performance.now();l<Nl-Zt/12||(Nl+=$e,(Nl<l||Nl>l+$e*2)&&(Nl=l+$e),on(),_t(),Qt(),li&&Li(),$t--,$t===0&&Gi())}function bn(){ne&&(cancelAnimationFrame(ne),ne=void 0)}let se;const oe=new Fl;function lt(){se=[]}function ti(l,e=16,t=1,i=0,n=Math.PI*2,o=void 0){if(e<1){if(oe.get()>e)return;e=1}for(let r=0;r<e;r++){const c=i+oe.get(n)-n/2,u={pos:new p(l),vel:new p(t*oe.get(.5,1),0).rotate(c),color:A,ticks:L(oe.get(10,20)*Math.sqrt(Math.abs(t)),10,60),edgeColor:o};se.push(u)}}function re(){Hl(),se=se.filter(l=>{if(l.ticks--,l.ticks<0)return!1;l.pos.add(l.vel),l.vel.mul(.98);const e=Math.floor(l.pos.x),t=Math.floor(l.pos.y);return l.edgeColor!=null&&(j(l.edgeColor),wl(e-1,t-1,3,3)),j(l.color),wl(e,t,1,1),!0}),Wl()}function et(l,e,t,i){return ii(!1,l,e,t,i,"rect")}function Sn(l,e,t,i){return ii(!0,l,e,t,i,"box")}function Cn(l,e,t,i,n=.5,o=.5){typeof l!="number"&&(o=n,n=i,i=t,t=e,e=l.y,l=l.x);const r=new p(t).rotate(n),c=new p(l-r.x*o,e-r.y*o);return it(c,r,i)}function vn(l,e,t=3,i=3,n=3){const o=new p,r=new p;return typeof l=="number"?typeof e=="number"?typeof t=="number"?(o.set(l,e),r.set(t,i)):(o.set(l,e),r.set(t),n=i):tt("when x1 is a number, y1 must also be a number."):typeof e=="number"?typeof t=="number"?(o.set(l),r.set(e,t),n=i):tt("when x1 is a Vector and y1 is a number, x2 must be a number representing the new y-coordinate."):typeof t=="number"?(o.set(l),r.set(e),n=t):tt("when both endpoints are Vectors, the last argument must be the thickness (number)."),it(o,r.sub(o),n)}function xn(l,e,t,i,n,o){let r=new p;typeof l=="number"?r.set(l,e):(r.set(l),o=n,n=i,i=t,t=e),i==null&&(i=3),n==null&&(n=0),o==null&&(o=Math.PI*2);let c,u;if(n>o?(c=o,u=n-o):(c=n,u=o-n),u=L(u,0,Math.PI*2),u<.01)return;const d=L(Math.ceil(u*Math.sqrt(t*.25)),1,36),m=u/d;let h=c,f=new p(t).rotate(h).add(r),g=new p,x=new p,b={isColliding:{rect:{},text:{},char:{}}};for(let k=0;k<d;k++){h+=m,g.set(t).rotate(h).add(r),x.set(g).sub(f);const T=it(f,x,i,!0);b=Object.assign(Object.assign(Object.assign({},b),Ee(T.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},b.isColliding.rect),T.isColliding.rect),text:Object.assign(Object.assign({},b.isColliding.text),T.isColliding.text),char:Object.assign(Object.assign({},b.isColliding.char),T.isColliding.char)}}),f.set(g)}return xt(),b}function ii(l,e,t,i,n,o="rect"){if(typeof e=="number"){if(typeof t=="number")return typeof i=="number"?n==null?al(l,e,t,i,i):al(l,e,t,i,n):al(l,e,t,i.x,i.y);ni(o,"when x is a number, y must also be a number.")}else if(typeof t=="number"){if(i==null)return al(l,e.x,e.y,t,t);if(typeof i=="number")return al(l,e.x,e.y,t,i);ni(o,"when x is a Vector and y is a number, width must be a number.")}else return al(l,e.x,e.y,t.x,t.y)}function tt(l){throw new Error(`line(): ${l}`)}function ni(l,e){throw new Error(`${l}(): ${e}`)}function it(l,e,t,i=!1){let n=!0;(y.name==="shape"||y.name==="shapeDark")&&(A!=="transparent"&&Ai(l.x,l.y,l.x+e.x,l.y+e.y,t),n=!1);const o=Math.floor(L(t,3,10)),r=Math.abs(e.x),c=Math.abs(e.y),u=L(Math.ceil(r>c?r/o:c/o)+1,3,99);e.div(u-1);let d={isColliding:{rect:{},text:{},char:{}}};for(let m=0;m<u;m++){const h=al(!0,l.x,l.y,t,t,!0,n);d=Object.assign(Object.assign(Object.assign({},d),Ee(h.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},d.isColliding.rect),h.isColliding.rect),text:Object.assign(Object.assign({},d.isColliding.text),h.isColliding.text),char:Object.assign(Object.assign({},d.isColliding.char),h.isColliding.char)}}),l.add(e)}return i||xt(),d}function al(l,e,t,i,n,o=!1,r=!0){let c=r;(y.name==="shape"||y.name==="shapeDark")&&c&&A!=="transparent"&&(l?wl(e-i/2,t-n/2,i,n):wl(e,t,i,n),c=!1);let u=l?{x:Math.floor(e-i/2),y:Math.floor(t-n/2)}:{x:Math.floor(e),y:Math.floor(t)};const d={x:Math.trunc(i),y:Math.trunc(n)};if(d.x===0||d.y===0)return{isColliding:{rect:{},text:{},char:{}}};d.x<0&&(u.x+=d.x,d.x*=-1),d.y<0&&(u.y+=d.y,d.y*=-1);const m={pos:u,size:d,collision:{isColliding:{rect:{}}}};m.collision.isColliding.rect[A]=!0;const h=Et(m);return A!=="transparent"&&((o?Xl:bl).push(m),c&&wl(u.x,u.y,d.x,d.y)),h}function nt({pos:l,size:e,text:t,isToggle:i=!1,onClick:n=()=>{},isSmallText:o=!0}){return{pos:l,size:e,text:t,isToggle:i,onClick:n,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:o}}function st(l){const e=new p(Y).sub(l.pos);l.isHovered=e.isInRect(0,0,l.size.x,l.size.y),l.isHovered&&vl&&(l.isPressed=!0),l.isPressed&&!l.isHovered&&(l.isPressed=!1),l.isPressed&&kl&&(l.onClick(),l.isPressed=!1,l.isToggle&&(l.toggleGroup.length===0?l.isSelected=!l.isSelected:(l.toggleGroup.forEach(t=>{t.isSelected=!1}),l.isSelected=!0))),ae(l)}function ae(l){Hl(),j(l.isPressed?"blue":"light_blue"),et(l.pos.x,l.pos.y,l.size.x,l.size.y),l.isToggle&&!l.isSelected&&(j("white"),et(l.pos.x+1,l.pos.y+1,l.size.x-2,l.size.y-2)),j(l.isHovered?"black":"blue"),Pt(l.text,l.pos.x+3,l.pos.y+3,{isSmallText:l.isSmallText}),Wl()}let G,_l,cl,ot;function En(l){G={randomSeed:l,inputs:[]}}function Pn(l){G.inputs.push(l)}function si(){return G!=null}function Mn(l){_l=0,l.setSeed(G.randomSeed)}function Rn(){_l>=G.inputs.length||(Ll(G.inputs[_l]),_l++)}function Tn(){cl=[]}function On(l,e,t){cl.push({randomState:t.getState(),gameState:cloneDeep(l),baseState:cloneDeep(e)})}function Fn(l){const e=cl.pop(),t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),ot={pos:new p(Y),isPressed:Q,isJustPressed:V,isJustReleased:il},Ll(G.inputs.pop()),e}function In(l){const e=cl[cl.length-1],t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),ot={pos:new p(Y),isPressed:Q,isJustPressed:V,isJustReleased:il},Ll(G.inputs[G.inputs.length-1]),e}function kn(){Ll(ot)}function Dn(){return cl.length===0}function An(){const l=_l-1;if(!(l>=G.inputs.length))return cl[l]}const rt=4,Un=60,Ln="video/webm;codecs=vp8,opus",zn="video/webm",jn="recording.webm",Bn=1e5*rt,Nn=.7;let N,ce;function _n(l,e,t,i){if(N!=null)return;const n=document.createElement("canvas");n.width=i.x*rt,n.height=i.y*rt;const o=n.getContext("2d");o.imageSmoothingEnabled=!1;const r=()=>{o.drawImage(l,0,0,l.width,l.height,0,0,n.width,n.height),ce=requestAnimationFrame(r)};r();const c=n.captureStream(Un),u=e.createMediaStreamDestination(),d=e.createGain();d.gain.value=Nn,t.forEach(g=>{g?.connect(d)}),d.connect(u);const m=u.stream,h=new MediaStream([...c.getVideoTracks(),...m.getAudioTracks()]);N=new MediaRecorder(h,{mimeType:Ln,videoBitsPerSecond:Bn});let f=[];N.ondataavailable=g=>{g.data.size>0&&f.push(g.data)},N.onstop=()=>{const g=new Blob(f,{type:zn}),x=URL.createObjectURL(g),b=document.createElement("a");b.href=x,b.download=jn,b.click(),URL.revokeObjectURL(x),f=[]},N.start()}function Kn(){N!=null&&N.state!=="inactive"&&(N.stop(),N=void 0),ce&&(cancelAnimationFrame(ce),ce=void 0)}function Vn(){return N!=null&&N.state==="recording"}const Gn=Math.PI,Jn=Math.abs,qn=Math.sin,Hn=Math.cos,Wn=Math.atan2,Xn=Math.sqrt,Yn=Math.pow,Qn=Math.floor,Zn=Math.round,$n=Math.ceil,ls=Math.min,es=Math.max;s.ticks=0,s.difficulty=void 0,s.score=0,s.time=void 0,s.isReplaying=!1;function ts(l=1,e){return ll.get(l,e)}function is(l=2,e){return ll.getInt(l,e)}function ns(l=1,e){return ll.get(l,e)*ll.getPlusOrMinus()}function at(l="GAME OVER"){me=l,a.isShowingTime&&(s.time=void 0),fi()}function ss(l="COMPLETE"){me=l,fi()}function os(l,e,t){if(s.isReplaying||(s.score+=l,e==null))return;const i=`${l>=1?"+":""}${Math.floor(l)}`;let n=new p;typeof e=="number"?n.set(e,t):n.set(e),n.x-=i.length*(a.isUsingSmallText?tl:S)/2,n.y-=S/2,ge.push({str:i,pos:n,vy:-2,ticks:30})}function oi(l){j(l)}function rs(l,e,t,i,n,o){let r=new p;typeof l=="number"?(r.set(l,e),c(r,t,i,n,o)):(r.set(l),c(r,e,t,i,n));function c(u,d,m,h,f){if(Is(d)){const g=d;ti(u,g.count,g.speed,g.angle,g.angleWidth,g.edgeColor)}else ti(u,d,m,h,f)}}function ri(l,e){return new p(l,e)}function ai(l,e){!Vl&&!ul&&nn(l,e)}function ci(){_n(O,I,[jl,ee,te],E)}function ct(){Kn()}function as(l){if(Vl){const e=In(ll),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,cloneDeep(e.gameState)}else if(ul){const e=Fn(ll),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,e.gameState}else{if(s.isReplaying)return An().gameState;if(J==="inGame"){const e={score:s.score,ticks:s.ticks};On(l,e,ll)}}return l}function cs(){ul||(!s.isReplaying&&a.isRewindEnabled?bs():at())}const ue={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},us=new Fl,ll=new Fl;let J,ds={title:ys,inGame:ps,gameOver:ws,rewind:Ss,error:ye},Kl=0,de,fe=!0,a,ge,Vl=!1,ul=!1,Gl,he,me,ut,pe,dl;function fs(l){window.update=l.update,window.title=l.title,window.description=l.description,window.characters=l.characters,window.options=l.options,window.audioFiles=l.audioFiles,ui()}function ui(){typeof options<"u"&&options!=null?a=Object.assign(Object.assign({},ue),options):a=ue,a.isMinifying&&Ds(),wn(hs,ms,a.isCapturing)}function gs(){bn(),ct(),an(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}async function hs(){const l={name:a.theme,isUsingPixi:!1,isDarkColor:!1};a.theme!=="simple"&&a.theme!=="dark"&&(l.isUsingPixi=!0),(a.theme==="pixel"||a.theme==="shapeDark"||a.theme==="crt"||a.theme==="dark")&&(l.isDarkColor=!0);const e=l.isDarkColor?"#101010":"#e0e0e0",t=l.isDarkColor?"blue":"white";Ti(l.isDarkColor,a.colorPalette),Di(a.viewSize,e,t,a.isCapturing,a.isCapturingGameCanvasOnly,a.captureCanvasScale,a.captureDurationSec,l),Nt(()=>{rn()}),Ki();let i=a.audioSeed+a.seed;typeof description<"u"&&description!=null&&description.trim().length>0&&(fe=!1,i+=yi(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(fe=!1,document.title=title,i+=yi(title),pe=`crisp-game-${encodeURIComponent(title)}-${i}`,Kl=Fs()),typeof characters<"u"&&characters!=null&&Vi(characters,"a"),a.isSoundEnabled&&(a.isSoundEnabled=await tn({audioSeed:i,audioVolume:a.audioVolume,audioTempo:a.audioTempo,bgmName:a.bgmName,bgmVolume:a.bgmVolume})),j("black"),fe?(dt(),s.ticks=0):di()}function ms(){if(J==="error"){ye();return}s.df=s.difficulty=s.ticks/3600+1,s.tc=s.ticks;const l=s.score,e=s.time;s.sc=s.score;const t=s.sc;s.inp={p:Y,ip:Q,ijp:V,ijr:il},ji();try{ds[J]()}catch(i){vs(i);return}y.isUsingPixi&&(ql(),y.name==="crt"&&Ui()),s.ticks++,s.isReplaying?(s.score=l,s.time=e):s.sc!==t&&(s.score=s.sc)}function dt(){J="inGame",s.ticks=-1,lt();const l=Math.floor(s.score);l>Kl&&(Kl=l),a.isShowingTime&&s.time!=null&&(de==null||de>s.time)&&(de=s.time),s.score=0,s.time=0,ge=[],a.isPlayingBgm&&a.isSoundEnabled&&Ze();const e=us.getInt(999999999);ll.setSeed(e),(a.isReplayEnabled||a.isRewindEnabled)&&(En(e),Tn(),s.isReplaying=!1)}function ps(){Rl(),a.isDrawingParticleFront||re(),a.isDrawingScoreFront||pi(),(a.isReplayEnabled||a.isRewindEnabled)&&Pn({pos:ri(Y),isPressed:Q,isJustPressed:V,isJustReleased:il}),typeof update=="function"&&update(),a.isDrawingParticleFront&&re(),a.isDrawingScoreFront&&pi(),ft(),a.isShowingTime&&s.time!=null&&s.time++,a.isRecording&&!Vn()&&ci()}function di(){J="title",s.ticks=-1,lt(),Rl(),si()&&(Mn(ll),s.isReplaying=!0)}function ys(){if(V){dt();return}if(Rl(),a.isReplayEnabled&&si()&&(Rn(),s.inp={p:Y,ip:Q,ijp:V,ijr:il},a.isDrawingParticleFront||re(),update(),a.isDrawingParticleFront&&re()),ft(),typeof title<"u"&&title!=null){let l=0;title.split(`
`).forEach(t=>{t.length>l&&(l=t.length)});const e=Math.floor((E.x-l*S)/2);title.split(`
`).forEach((t,i)=>{K(t,e,Math.floor(E.y*.25)+i*S,{edgeColor:a.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let l=0;description.split(`
`).forEach(i=>{i.length>l&&(l=i.length)});const e=a.isUsingSmallText?tl:S,t=Math.floor((E.x-l*e)/2);description.split(`
`).forEach((i,n)=>{K(i,t,Math.floor(E.y/2)+n*S,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.description})})}}function fi(){J="gameOver",s.isReplaying||Kt(),s.ticks=-1,hi(),a.isPlayingBgm&&a.isSoundEnabled&&Bl();const l=Math.floor(s.score);l>Kl&&Os(l)}function ws(){s.ticks===0&&!y.isUsingPixi&&hi(),(s.isReplaying||s.ticks>20)&&V?(gi(),dt()):s.ticks===(a.isReplayEnabled?120:300)&&!fe&&(gi(),di())}function gi(){!a.isRecording||s.isReplaying||ct()}function hi(){s.isReplaying||K(me,Math.floor((E.x-me.length*S)/2),Math.floor(E.y/2),{edgeColor:a.textEdgeColor.gameOver})}function bs(){J="rewind",Vl=!0,Gl=nt({pos:{x:E.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:a.isUsingSmallText}),he=nt({pos:{x:E.x-39,y:E.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:a.isUsingSmallText}),a.isPlayingBgm&&a.isSoundEnabled&&Bl(),y.isUsingPixi&&(ae(Gl),ae(he))}function Ss(){Rl(),update(),ft(),kn(),ul?(ae(Gl),(Dn()||!Q)&&Cs()):(st(Gl),st(he),Gl.isPressed&&(ul=!0,Vl=!1)),he.isPressed&&(Vl=ul=!1,at()),a.isShowingTime&&s.time!=null&&s.time++}function Cs(){ul=!1,J="inGame",lt(),a.isPlayingBgm&&a.isSoundEnabled&&Ze()}function ft(){if(a.isShowingTime)mi(s.time,3,3),mi(de,E.x-7*(a.isUsingSmallText?tl:S),3);else if(a.isShowingScore){K(`${Math.floor(s.score)}`,3,3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score});const l=`HI ${Kl}`;K(l,E.x-l.length*(a.isUsingSmallText?tl:S),3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}}function vs(l){if(console.error("Error inside update():",l),J==="error"&&dl!=null){ye();return}dl=Ps(l),J="error",Es(),ye()}function ye(){(dl==null||dl.length===0)&&(dl=["UPDATE ERROR","See console for details."]);const l=a??ue,e=l.isUsingSmallText?tl:S,t=dl.length*S,i=Math.max(0,Math.floor((E.y-t)/2));xs(),Rl(),dl.forEach((n,o)=>{const r=Math.max(0,Math.floor((E.x-n.length*e)/2));K(n,r,i+o*S,{isSmallText:l.isUsingSmallText,edgeColor:l.textEdgeColor.gameOver})})}function xs(){try{j("black")}catch{}}function Es(){a?.isPlayingBgm&&a.isSoundEnabled&&typeof Bl=="function"&&Bl()}function Ps(l){const e=Ms(l),i=["UPDATE ERROR",...Rs(e)];return i.push("See console for details."),i}function Ms(l){var e,t;if(l instanceof Error){const i=(e=l.message)===null||e===void 0?void 0:e.trim();return l.name&&i&&i.length>0?`${l.name}: ${i}`:(t=i??l.name)!==null&&t!==void 0?t:"Unknown error"}if(typeof l=="string")return l;try{return JSON.stringify(l)}catch{return"Unknown error"}}function Rs(l){const t=(a??ue).isUsingSmallText?tl:S,i=Math.max(6,Math.floor(E.x/t)-2),n=4,o=l.split(/\r?\n/).map(c=>c.trim()).filter(c=>c.length>0);o.length===0&&o.push("Unknown error");const r=[];return o.forEach(c=>{r.length>=n||r.push(...Ts(c,i,n-r.length))}),r}function Ts(l,e,t){if(l.length<=e)return[l];const i=[];let n=l;for(;n.length>0&&i.length<t;){if(n.length<=e){i.push(n),n="";break}let o=n.lastIndexOf(" ",e);o<=0&&(o=e),i.push(n.slice(0,o).trim()),n=n.slice(o).trim()}return n.length>0&&i.length<t&&i.push(n),i}function mi(l,e,t){if(l==null)return;let i=Math.floor(l*100/50);i>=600*100&&(i=600*100-1);const n=gt(Math.floor(i/6e3),1)+"'"+gt(Math.floor(i%6e3/100),2)+'"'+gt(Math.floor(i%100),2);K(n,e,t,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}function gt(l,e){return("0000"+l).slice(-e)}function pi(){Hl(),j("black"),ge=ge.filter(l=>(K(l.str,l.pos.x,l.pos.y,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.floatingScore}),l.pos.y+=l.vy,l.vy*=.9,l.ticks--,l.ticks>0)),Wl()}function yi(l){let e=0;for(let t=0;t<l.length;t++){const i=l.charCodeAt(t);e=(e<<5)-e+i,e|=0}return e}function Os(l){if(pe!=null)try{const e={highScore:l};localStorage.setItem(pe,JSON.stringify(e))}catch(e){console.warn("Unable to save high score:",e)}}function Fs(){try{const l=localStorage.getItem(pe);if(l)return JSON.parse(l).highScore}catch(l){console.warn("Unable to load high score:",l)}return 0}function Is(l){return l!=null&&l.constructor===Object}function ks(){let l=window.location.search.substring(1);if(l=l.replace(/[^A-Za-z0-9_-]/g,""),l.length===0)return;const e=document.createElement("script");ut=`${l}/main.js`,e.setAttribute("src",ut),document.head.appendChild(e)}function Ds(){fetch(ut).then(l=>l.text()).then(l=>{const e=Terser.minify(l+"update();",{toplevel:!0}).code,t="function(){",i=e.indexOf(t),n="options={",o=e.indexOf(n);let r=e;if(i>=0)r=e.substring(e.indexOf(t)+t.length,e.length-4);else if(o>=0){let c=1,u;for(let d=o+n.length;d<e.length;d++){const m=e.charAt(d);if(m==="{")c++;else if(m==="}"&&(c--,c===0)){u=d+2;break}}c===0&&(r=e.substring(u))}wi.forEach(([c,u])=>{r=r.split(c).join(u)}),console.log(r),console.log(`${r.length} letters`)})}s.inp=void 0;function As(...l){return oi.apply(this,l)}function Us(...l){return ai.apply(this,l)}function Ls(...l){return R.apply(this,l)}function zs(...l){return q.apply(this.args)}s.tc=void 0,s.df=void 0,s.sc=void 0;const js="transparent",Bs="white",Ns="red",_s="green",Ks="yellow",Vs="blue",Gs="purple",Js="cyan",qs="black",Hs="coin",Ws="laser",Xs="explosion",Ys="powerUp",Qs="hit",Zs="jump",$s="select",lo="lucky";let wi=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];function eo(l){}function to(l){}s.PI=Gn,s.__testInitOptions=to,s.__testSetReplaying=eo,s.abs=Jn,s.addGameScript=ks,s.addScore=os,s.addWithCharCode=Pi,s.arc=xn,s.atan2=Wn,s.bar=Cn,s.bl=Vs,s.box=Sn,s.ceil=$n,s.char=Ni,s.clamp=L,s.clr=As,s.cn=Hs,s.color=oi,s.complete=ss,s.cos=Hn,s.cy=Js,s.end=at,s.ex=Xs,s.floor=Qn,s.frameState=as,s.getButton=nt,s.gr=_s,s.ht=Qs,s.init=fs,s.input=ln,s.jm=Zs,s.keyboard=Xi,s.lc=qs,s.line=vn,s.ls=Ws,s.max=es,s.min=ls,s.minifyReplaces=wi,s.onLoad=ui,s.onUnload=gs,s.particle=rs,s.play=ai,s.playBgm=Ze,s.ply=Us,s.pointer=$i,s.pow=Yn,s.pr=Gs,s.pw=Ys,s.range=v,s.rd=Ns,s.rect=et,s.remove=q,s.rewind=cs,s.rmv=zs,s.rnd=ts,s.rndi=is,s.rnds=ns,s.round=Zn,s.setAudioSeed=sn,s.sin=qn,s.sl=$s,s.sqrt=Xn,s.startRecording=ci,s.stopBgm=Bl,s.stopRecording=ct,s.text=Pt,s.times=R,s.tms=Ls,s.tr=js,s.uc=lo,s.updateButton=st,s.vec=ri,s.wh=Bs,s.wrap=w,s.yl=Ks})(window||{})),bi}io();const Ci=.005,no=7,vi=.5,so=.2,be=1,Se=10,xi=80,ht=60,oo=45,ro=.15,ao="ARC SPIN",co=`
[Hold]
  Charge shot
[Release]
  Fire arc
`,uo=[],fo={theme:"dark",isPlayingBgm:!0,isReplayEnabled:!0,isShowingScoreFront:!0,audioSeed:47};let fl,el,mt,Ce,U,gl,Ei;function go(){ticks||(fl=0,el=vec(50,50),mt=[],Ce=0,U=null,gl=0,Ei=0),color("light_blue");for(let w=20;w<=60;w+=20)arc(50,50,w,1);for(let w=0;w<8;w++){const M=PI*2*w/8;line(50,50,vec(60).rotate(M).add(50,50),1)}const s=input.isPressed?Ci*no:Ci;fl+=s*difficulty,input.isPressed&&(gl=min(gl+1,ht));const L=input.isPressed?vi*so:vi;if(el.add(vec(L).rotate(fl)),el.clamp(5,95,5,95),color("cyan"),box(el,4,4),color("light_cyan"),line(el,vec(8).rotate(fl).add(el),2),input.isPressed){const w=gl/ht,M=Se+(xi-Se)*w,v=fl-be/2,R=fl+be/2;color("green"),arc(el,M,2,v,R)}if(input.isJustReleased&&gl>0&&!U){const w=gl/ht,M=Se+(xi-Se)*w;U={pos:vec(el),angle:fl,range:M,radius:0,killCount:0},play("laser"),gl=0}if(U){U.radius+=3;const M=U.angle-be/2,v=U.angle+be/2;color("yellow"),arc(U.pos,U.radius,3,M,v),U.radius>=U.range&&(U=null)}if(Ce--,Ce<=0){const w=rnd(PI*2),v=vec(70).rotate(w).add(50,50);mt.push({pos:v,speed:ro*rnd(1,sqrt(difficulty)),id:Ei++}),Ce=oo/sqrt(difficulty)}remove(mt,w=>{const M=vec(el).sub(w.pos).normalize(),v=w.speed;w.pos.add(M.mul(v)),color("red"),line(w.pos,vec(5).rotate(M.angle).add(w.pos),1),color("red");const R=5+sin(ticks*.1+w.id)*.5,q=box(w.pos,R,R).isColliding.rect;if(q?.cyan)return play("explosion"),end(),!0;if(q?.yellow&&U)return U.killCount++,addScore(U.killCount,w.pos),play("powerUp"),particle(w.pos,10,2),!0})}init({update:go,title:ao,description:co,characters:uo,options:fo});
