(function(){const d=document.createElement("link").relList;if(d&&d.supports&&d.supports("modulepreload"))return;for(const E of document.querySelectorAll('link[rel="modulepreload"]'))U(E);new MutationObserver(E=>{for(const D of E)if(D.type==="childList")for(const cl of D.addedNodes)cl.tagName==="LINK"&&cl.rel==="modulepreload"&&U(cl)}).observe(document,{childList:!0,subtree:!0});function j(E){const D={};return E.integrity&&(D.integrity=E.integrity),E.referrerPolicy&&(D.referrerPolicy=E.referrerPolicy),E.crossOrigin==="use-credentials"?D.credentials="include":E.crossOrigin==="anonymous"?D.credentials="omit":D.credentials="same-origin",D}function U(E){if(E.ep)return;E.ep=!0;const D=j(E);fetch(E.href,D)}})();var vi={},xi;function so(){return xi||(xi=1,(function(s){function d(l,e=0,t=1){return Math.max(e,Math.min(l,t))}function j(l,e,t){const i=t-e,n=l-e;if(n>=0)return n%i+e;{let o=i+n%i+e;return o>=t&&(o-=i),o}}function U(l,e,t){return e<=l&&l<t}function E(l){return[...Array(l).keys()]}function D(l,e){return E(l).map(t=>e(t))}function cl(l,e){let t=[];for(let i=0,n=0;i<l.length;n++)e(l[i],n)?(t.push(l[i]),l.splice(i,1)):i++;return t}function St(l){return[...l].reduce((e,[t,i])=>(e[t]=i,e),{})}function bt(l){return Object.keys(l).map(e=>[e,l[e]])}function Ri(l,e){return String.fromCharCode(l.charCodeAt(0)+e)}function Cl(l){return l.x!=null&&l.y!=null}class y{constructor(e,t){this.x=0,this.y=0,this.set(e,t)}set(e=0,t=0){return Cl(e)?(this.x=e.x,this.y=e.y,this):(this.x=e,this.y=t,this)}add(e,t){return Cl(e)?(this.x+=e.x,this.y+=e.y,this):(this.x+=e,this.y+=t,this)}sub(e,t){return Cl(e)?(this.x-=e.x,this.y-=e.y,this):(this.x-=e,this.y-=t,this)}mul(e){return this.x*=e,this.y*=e,this}div(e){return this.x/=e,this.y/=e,this}clamp(e,t,i,n){return this.x=d(this.x,e,t),this.y=d(this.y,i,n),this}wrap(e,t,i,n){return this.x=j(this.x,e,t),this.y=j(this.y,i,n),this}addWithAngle(e,t){return this.x+=Math.cos(e)*t,this.y+=Math.sin(e)*t,this}swapXy(){const e=this.x;return this.x=this.y,this.y=e,this}normalize(){return this.div(this.length),this}rotate(e){if(e===0)return this;const t=this.x;return this.x=t*Math.cos(e)-this.y*Math.sin(e),this.y=t*Math.sin(e)+this.y*Math.cos(e),this}angleTo(e,t){return Cl(e)?Math.atan2(e.y-this.y,e.x-this.x):Math.atan2(t-this.y,e-this.x)}distanceTo(e,t){let i,n;return Cl(e)?(i=e.x-this.x,n=e.y-this.y):(i=e-this.x,n=t-this.y),Math.sqrt(i*i+n*n)}isInRect(e,t,i,n){return U(this.x,e,e+i)&&U(this.y,t,t+n)}equals(e){return this.x===e.x&&this.y===e.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const ul=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],Ti="twrgybpclRGYBPCL";let tl,il;const Oi=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function Ii(l,e){const[t,i,n]=Ee(0,l);if(tl=St(ul.map((o,r)=>{if(r<1)return[o,{r:0,g:0,b:0,a:0}];if(r<9){const[p,m,g]=Ee(r-1,l);return[o,{r:p,g:m,b:g,a:1}]}const[c,u,f]=Ee(r-9+1,l);return[o,{r:Math.floor(l?c*.5:t-(t-c)*.5),g:Math.floor(l?u*.5:n-(n-u)*.5),b:Math.floor(l?f*.5:i-(i-f)*.5),a:1}]})),l){const o=tl.blue;tl.white={r:Math.floor(o.r*.15),g:Math.floor(o.g*.15),b:Math.floor(o.b*.15),a:1}}e!=null&&Fi(e)}function Fi(l){il=l.map(e=>({r:e[0],g:e[1],b:e[2],a:1}));for(let e=0;e<ul.length;e++){let t=1/0,i=-1;for(let n=0;n<il.length;n++){const o=ki(il[n],tl[ul[e]]);o<t&&(t=o,i=n)}tl[ul[e]]=il[i]}}function ki(l,e){const t={r:.299,g:.587,b:.114},i=l.r-e.r,n=l.g-e.g,o=l.b-e.b,r=e.r===e.g&&e.g===e.b;let c=Math.sqrt(i*i*t.r+n*n*t.g+o*o*t.b);return r&&!(e.r===0&&e.g===0&&e.b===0)&&(c*=1.5),c}function Ee(l,e){e&&(l===0?l=7:l===7&&(l=0));const t=Oi[l];return[(t&16711680)>>16,(t&65280)>>8,t&255]}function dl(l,e=1){const t=Ct(l);return Math.floor(t.r*e)<<16|Math.floor(t.g*e)<<8|Math.floor(t.b*e)}function fl(l,e=1){const t=Ct(l),i=Math.floor(t.r*e),n=Math.floor(t.g*e),o=Math.floor(t.b*e);return t.a<1?`rgba(${i},${n},${o},${t.a})`:`rgb(${i},${n},${o})`}function Ct(l){if(typeof l=="number"){if(il==null)throw new Error(`color(${l}) is invalid because no custom color palette is defined.`);const t=il[l];if(t==null)throw new Error(`color(${l}) is out of bounds for the current color palette (length: ${il.length}).`);return t}if(tl==null)throw new Error(`color("${l}") was used before the color system was initialized.`);const e=tl[l];if(e==null)throw new Error(`Unknown color "${l}". Supported colors: ${ul.join(", ")}.`);return e}const Di=`
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
`;function Li(l,e){return new PIXI.Filter(void 0,Di,{width:l,height:e})}const x=new y;let R,J,C,T=new y;const vt=5;document.createElement("img");let M,vl,xl=1,Me="black",k,xt,gl=!1,w,Et;function Ui(l,e,t,i,n,o,r,c){x.set(l),w=c,Me=t;const u=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${e};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${e};
color: #888;
`,f=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,p=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=u,T.set(x),w.isUsingPixi){T.mul(vt);const g=new PIXI.Application({width:T.x,height:T.y});if(R=g.view,C=new PIXI.Graphics,C.scale.x=C.scale.y=vt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,g.stage.addChild(C),C.filters=[],w.name==="crt"&&C.filters.push(Et=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),w.name==="pixel"&&C.filters.push(Li(T.x,T.y)),w.name==="pixel"||w.name==="shapeDark"){const h=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:w.name==="pixel"?1.5:1,brightness:w.name==="pixel"?1.5:1,blur:8});C.filters.push(h)}C.lineStyle(0),R.style.cssText=f}else R=document.createElement("canvas"),R.width=T.x,R.height=T.y,J=R.getContext("2d"),J.imageSmoothingEnabled=!1,R.style.cssText=f+p;document.body.appendChild(R);const m=()=>{const h=innerWidth/innerHeight,v=T.x/T.y,S=h<v,I=S?.95*innerWidth:.95*innerHeight*v,P=S?.95*innerWidth/v:.95*innerHeight;R.style.width=`${I}px`,R.style.height=`${P}px`};if(window.addEventListener("resize",m),m(),i){M=document.createElement("canvas");let g;n?(M.width=T.x,M.height=T.y,g=o):(T.x<=T.y*2?(M.width=T.y*2,M.height=T.y):(M.width=T.x,M.height=T.x/2),M.width>400&&(xl=400/M.width,M.width=400,M.height*=xl),g=Math.round(400/M.width)),vl=M.getContext("2d"),vl.fillStyle=e,gcc.setOptions({scale:g,capturingFps:60,isSmoothingEnabled:!1,durationSec:r})}}function El(){if(w.isUsingPixi){C.clear(),C.beginFill(dl(Me,w.isDarkColor?.15:1)),C.drawRect(0,0,x.x,x.y),C.endFill(),C.beginFill(dl(k)),gl=!0;return}J.fillStyle=fl(Me,w.isDarkColor?.15:1),J.fillRect(0,0,x.x,x.y),J.fillStyle=fl(k)}function A(l){if(l===k){w.isUsingPixi&&!gl&&Jl(dl(k));return}if(k=l,w.isUsingPixi){gl&&C.endFill(),Jl(dl(k));return}J.fillStyle=fl(l)}function Jl(l){Wl(),C.beginFill(l),gl=!0}function Wl(){gl&&(C.endFill(),gl=!1)}function ql(){xt=k}function Hl(){A(xt)}function hl(l,e,t,i){if(w.isUsingPixi){w.name==="shape"||w.name==="shapeDark"?C.drawRoundedRect(l,e,t,i,2):C.drawRect(l,e,t,i);return}J.fillRect(l,e,t,i)}function Ai(l,e,t,i,n){const o=dl(k);Jl(o),C.drawCircle(l,e,n*.5),C.drawCircle(t,i,n*.5),Wl(),C.lineStyle(n,o),C.moveTo(l,e),C.lineTo(t,i),C.lineStyle(0)}function Bi(){Et.time+=.2}function zi(){if(vl.fillRect(0,0,M.width,M.height),xl===1)vl.drawImage(R,(M.width-R.width)/2,(M.height-R.height)/2);else{const l=R.width*xl,e=R.height*xl;vl.drawImage(R,(M.width-l)/2,(M.height-e)/2,l,e)}gcc.capture(M)}const Mt=[`
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

`],ji=[`
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

`];let ml,Xl;function Ni(){ml=[],Xl=[]}function Pt(){ml=ml.concat(Xl),Xl=[]}function Rt(l){let e={isColliding:{rect:{},text:{},char:{}}};return ml.forEach(t=>{_i(l,t)&&(e=Object.assign(Object.assign(Object.assign({},e),Pe(t.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},e.isColliding.rect),t.collision.isColliding.rect),text:Object.assign(Object.assign({},e.isColliding.text),t.collision.isColliding.text),char:Object.assign(Object.assign({},e.isColliding.char),t.collision.isColliding.char)}}))}),e}function _i(l,e){const t=e.pos.x-l.pos.x,i=e.pos.y-l.pos.y;return-e.size.x<t&&t<l.size.x&&-e.size.y<i&&i<l.size.y}function Pe(l){if(l==null)return{};const e={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let t={};return bt(l).forEach(([i,n])=>{const o=e[i];n&&o!=null&&(t[o]=!0)}),t}function Tt(l,e,t,i){return Ot(!1,l,e,t,i)}function Ki(l,e,t,i){return Ot(!0,l,e,t,i)}function Ot(l,e,t,i,n){if(typeof t=="number"){if(typeof i=="number")return _(e,t,i,Object.assign({isCharacter:l,isCheckingCollision:!0,color:k},n));throw new Error(`${l?"char":"text"}(): expected numeric y when x is a number.`)}else return _(e,t.x,t.y,Object.assign({isCharacter:l,isCheckingCollision:!0,color:k},i))}const Ml=6,Vi=4,N=1,b=Ml*N,$=Vi*N;let Re,Te,Yl,Oe,Ie=!1,pl,Fe,Pl,Ql;const ke={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function Gi(){pl=document.createElement("canvas"),pl.width=pl.height=b,Fe=pl.getContext("2d"),Pl=document.createElement("canvas"),Ql=Pl.getContext("2d"),Re=Mt.map((l,e)=>Zl(l,String.fromCharCode(33+e),!1)),Te=ji.map((l,e)=>Zl(l,String.fromCharCode(33+e),!1)),Yl=Mt.map((l,e)=>Zl(l,String.fromCharCode(33+e),!0)),Oe={}}function Ji(l,e){const t=e.charCodeAt(0)-33;l.forEach((i,n)=>{Yl[t+n]=Zl(i,String.fromCharCode(33+t+n),!0)})}function Wi(){Ie=!0}function _(l,e,t,i={}){const n=kt(i);let o=l,r=e,c=t,u,f={isColliding:{rect:{},text:{},char:{}}};const p=n.isSmallText?$:b;for(let m=0;m<o.length;m++){if(m===0){const v=o.charCodeAt(0);if(v<33||v>126)r=Math.floor(r-b/2*n.scale.x),c=Math.floor(c-b/2*n.scale.y);else{const S=v-33,I=n.isCharacter?Yl[S]:n.isSmallText?Te[S]:Re[S];r=Math.floor(r-I.size.x/2*n.scale.x),c=Math.floor(c-I.size.y/2*n.scale.y)}u=r}const g=o[m];if(g===`
`){r=u,c+=b*n.scale.y;continue}const h=qi(g,r,c,n);n.isCheckingCollision&&(f={isColliding:{rect:Object.assign(Object.assign({},f.isColliding.rect),h.isColliding.rect),text:Object.assign(Object.assign({},f.isColliding.text),h.isColliding.text),char:Object.assign(Object.assign({},f.isColliding.char),h.isColliding.char)}}),r+=p*n.scale.x}return f}function qi(l,e,t,i){const n=l.charCodeAt(0);if(n<32||n>126)return{isColliding:{rect:{},text:{},char:{}}};const o=kt(i);if(o.backgroundColor!=="transparent"){const P=o.isSmallText?$:b,we=o.isSmallText?2:1;ql(),A(o.backgroundColor),hl(e+we,t,P*o.scale.x,b*o.scale.y),Hl()}if(n<=32)return{isColliding:{rect:{},text:{},char:{}}};const r=n-33,c=o.isCharacter?Yl[r]:o.isSmallText?Te[r]:Re[r],u=j(o.rotation,0,4);if(o.color==="black"&&u===0&&o.mirror.x===1&&o.mirror.y===1&&o.edgeColor==null&&(!w.isUsingPixi||o.scale.x===1&&o.scale.y===1))return De(c,e,t,o.scale,o.isCheckingCollision,!0);const f=JSON.stringify({c:l,options:o}),p=Oe[f];if(p!=null)return De(p,e,t,o.scale,o.isCheckingCollision,o.color!=="transparent");let m=!1;const g=new y(b,b);let h=pl,v=Fe;if(c.size.x>b||c.size.y>b){if(u===0||u===2)g.set(c.size.x,c.size.y);else{const P=Math.max(c.size.x,c.size.y);g.set(P,P)}h=document.createElement("canvas"),h.width=g.x,h.height=g.y,v=h.getContext("2d"),v.imageSmoothingEnabled=!1}w.isUsingPixi&&(o.scale.x!==1||o.scale.y!==1)&&(Pl.width=g.x*o.scale.x,Pl.height=g.y*o.scale.y,Ql.imageSmoothingEnabled=!1,Ql.scale(o.scale.x,o.scale.y),It(Ql,u,o,c.image,g),m=!0),v.clearRect(0,0,g.x,g.y),It(v,u,o,c.image,g);const S=Le(v,g,l,o.isCharacter);o.edgeColor!=null&&(h=Hi(v,g,o.edgeColor),g.x+=2,g.y+=2);let I;if(Ie||w.isUsingPixi){const P=document.createElement("img");if(P.src=h.toDataURL(),w.isUsingPixi){const we=document.createElement("img");we.src=(m?Pl:h).toDataURL(),I=PIXI.Texture.from(we)}Ie&&(Oe[f]={image:P,texture:I,hitBox:S,size:g})}return De({image:h,texture:I,hitBox:S,size:g},e,t,o.scale,o.isCheckingCollision,o.color!=="transparent")}function Hi(l,e,t){const i=e.x+2,n=e.y+2,o=[[0,-1],[1,0],[0,1],[-1,0]],r=document.createElement("canvas");r.width=i,r.height=n;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(l.canvas,1,1);const f=c.getImageData(0,0,i,n).data;c.fillStyle=fl(t);for(let p=0;p<n;p++)for(let m=0;m<i;m++){const g=(p*i+m)*4;if(f[g+3]===0)for(const[h,v]of o){const S=m+h,I=p+v;if(S>=0&&S<i&&I>=0&&I<n){const P=(I*i+S)*4;if(f[P+3]>0){c.fillRect(m,p,1,1);break}}}}return r}function It(l,e,t,i,n){e===0&&t.mirror.x===1&&t.mirror.y===1?l.drawImage(i,0,0):(l.save(),l.translate(n.x/2,n.y/2),l.rotate(Math.PI/2*e),(t.mirror.x===-1||t.mirror.y===-1)&&l.scale(t.mirror.x,t.mirror.y),l.drawImage(i,-n.x/2,-n.y/2),l.restore()),t.color!=="black"&&(l.globalCompositeOperation="source-in",l.fillStyle=fl(t.color==="transparent"?"black":t.color),l.fillRect(0,0,n.x,n.y),l.globalCompositeOperation="source-over")}function De(l,e,t,i,n,o){if(o&&(i.x===1&&i.y===1?Ft(l,e,t):Ft(l,e,t,l.size.x*i.x,l.size.y*i.y)),!n)return;const r={pos:{x:e+l.hitBox.pos.x*i.x,y:t+l.hitBox.pos.y*i.y},size:{x:l.hitBox.size.x*i.x,y:l.hitBox.size.y*i.y},collision:l.hitBox.collision},c=Rt(r);return o&&ml.push(r),c}function Ft(l,e,t,i,n){if(w.isUsingPixi){Wl(),C.beginTextureFill({texture:l.texture,matrix:new PIXI.Matrix().translate(e,t)}),C.drawRect(e,t,i??l.size.x,n??l.size.y),Jl(dl(k));return}i==null?J.drawImage(l.image,e,t):J.drawImage(l.image,e,t,i,n)}function Zl(l,e,t){if(l.indexOf(".")>=0||l.indexOf("data:image/")==0)return Xi(l,e);let i=l.split(`
`);i=i.slice(1,i.length-1);let n=0;i.forEach(h=>{n=Math.max(h.length,n)});const o=Math.max(Math.ceil((Ml-n)/2),0),r=i.length,c=Math.max(Math.ceil((Ml-r)/2),0),u=new y(Math.max(Ml,n)*N,Math.max(Ml,r)*N);let f=pl,p=Fe;(u.x>b||u.y>b)&&(f=document.createElement("canvas"),f.width=u.x,f.height=u.y,p=f.getContext("2d"),p.imageSmoothingEnabled=!1),p.clearRect(0,0,u.x,u.y),i.forEach((h,v)=>{for(let S=0;S<n;S++){const I=h.charAt(S);let P=Ti.indexOf(I);I!==""&&P>=1&&(p.fillStyle=fl(ul[P]),p.fillRect((S+o)*N,(v+c)*N,N,N))}});const m=document.createElement("img");m.src=f.toDataURL();const g=Le(p,u,e,t);return w.isUsingPixi?{image:m,texture:PIXI.Texture.from(m),size:u,hitBox:g}:{image:m,size:u,hitBox:g}}function Xi(l,e){const t=document.createElement("img");t.src=l;const i=new y,n={pos:new y,size:new y,collision:{isColliding:{char:{},text:{}}}};let o;return w.isUsingPixi?o={image:t,texture:PIXI.Texture.from(t),size:new y,hitBox:n}:o={image:t,size:i,hitBox:n},t.onload=()=>{o.size.set(t.width*N,t.height*N);const r=document.createElement("canvas");r.width=o.size.x,r.height=o.size.y;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(t,0,0,o.size.x,o.size.y);const u=document.createElement("img");u.src=r.toDataURL(),o.image=u,o.hitBox=Le(c,o.size,e,!0),w.isUsingPixi&&(o.texture=PIXI.Texture.from(u))},o}function Le(l,e,t,i){const n={pos:new y(b,b),size:new y,collision:{isColliding:{char:{},text:{}}}};i?n.collision.isColliding.char[t]=!0:n.collision.isColliding.text[t]=!0;const o=l.getImageData(0,0,e.x,e.y).data;let r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u<n.pos.x&&(n.pos.x=u),c<n.pos.y&&(n.pos.y=c)),r+=4;r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u>n.pos.x+n.size.x-1&&(n.size.x=u-n.pos.x+1),c>n.pos.y+n.size.y-1&&(n.size.y=c-n.pos.y+1)),r+=4;return n}function kt(l){let e=Object.assign(Object.assign({},ke),l);return l.scale!=null&&(e.scale=Object.assign(Object.assign({},ke.scale),l.scale)),l.mirror!=null&&(e.mirror=Object.assign(Object.assign({},ke.mirror),l.mirror)),e}let yl=!1,$l=!1,Ue=!1;const Dt=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Ae;const Yi={onKeyDown:void 0};let Be,ze=!1,je=!1,Ne=!1,_e={},Ke={},Ve={};function Lt(l){Be=Object.assign(Object.assign({},Yi),l),Ae=St(Dt.map(e=>[e,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",e=>{ze=je=!0,_e[e.code]=Ke[e.code]=!0,Be.onKeyDown!=null&&Be.onKeyDown(),(e.code==="AltLeft"||e.code==="AltRight"||e.code==="ArrowRight"||e.code==="ArrowDown"||e.code==="ArrowLeft"||e.code==="ArrowUp")&&e.preventDefault()}),document.addEventListener("keyup",e=>{ze=!1,Ne=!0,_e[e.code]=!1,Ve[e.code]=!0})}function Ut(){$l=!yl&&je,Ue=yl&&Ne,je=Ne=!1,yl=ze,bt(Ae).forEach(([l,e])=>{e.isJustPressed=!e.isPressed&&Ke[l],e.isJustReleased=e.isPressed&&Ve[l],e.isPressed=!!_e[l]}),Ke={},Ve={}}function At(){$l=!1,yl=!0}var Qi=Object.freeze({__proto__:null,clearJustPressed:At,get code(){return Ae},codes:Dt,init:Lt,get isJustPressed(){return $l},get isJustReleased(){return Ue},get isPressed(){return yl},update:Ut});class Rl{constructor(e=null){this.setSeed(e)}get(e=1,t){return t==null&&(t=e,e=0),this.next()/4294967295*(t-e)+e}getInt(e,t){t==null&&(t=e,e=0);const i=Math.floor(e),n=Math.floor(t);return n===i?i:this.next()%(n-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(e){return e[this.getInt(e.length)]}setSeed(e,t=123456789,i=362436069,n=521288629,o=32){this.w=e!=null?e>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=t>>>0,this.y=i>>>0,this.z=n>>>0;for(let r=0;r<o;r++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const e=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(e^e>>>8))>>>0,this.w}}const Tl=new y;let W=!1,wl=!1,Ol=!1,Zi={isDebugMode:!1,anchor:new y,padding:new y,onPointerDownOrUp:void 0},L,B,F;const Il=new Rl,nl=new y,q=new y;let Fl=!1,kl=new y,Ge=!1,Je=!1,We=!1;function Bt(l,e,t){F=Object.assign(Object.assign({},Zi),t),L=l,B=new y(e.x+F.padding.x*2,e.y+F.padding.y*2),kl.set(L.offsetLeft+L.clientWidth*(.5-F.anchor.x),L.offsetTop+L.clientWidth*(.5-F.anchor.y)),F.isDebugMode&&nl.set(L.offsetLeft+L.clientWidth*(.5-F.anchor.x),L.offsetTop+L.clientWidth*(.5-F.anchor.y)),document.addEventListener("mousedown",i=>{Nt(i.pageX,i.pageY)}),document.addEventListener("touchstart",i=>{Nt(i.touches[0].pageX,i.touches[0].pageY)}),document.addEventListener("mousemove",i=>{_t(i.pageX,i.pageY)}),document.addEventListener("touchmove",i=>{i.preventDefault(),_t(i.touches[0].pageX,i.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",i=>{Kt()}),document.addEventListener("touchend",i=>{i.preventDefault(),i.target.click(),Kt()},{passive:!1})}function zt(){$i(kl.x,kl.y,Tl),F.isDebugMode&&!Tl.isInRect(0,0,B.x,B.y)?(ln(),Tl.set(nl),wl=!W&&Fl,Ol=W&&!Fl,W=Fl):(wl=!W&&Je,Ol=W&&We,W=Ge),Je=We=!1}function jt(){wl=!1,W=!0}function $i(l,e,t){L!=null&&(t.x=Math.round(((l-L.offsetLeft)/L.clientWidth+F.anchor.x)*B.x-F.padding.x),t.y=Math.round(((e-L.offsetTop)/L.clientHeight+F.anchor.y)*B.y-F.padding.y))}function ln(){q.length>0?(nl.add(q),!U(nl.x,-B.x*.1,B.x*1.1)&&nl.x*q.x>0&&(q.x*=-1),!U(nl.y,-B.y*.1,B.y*1.1)&&nl.y*q.y>0&&(q.y*=-1),Il.get()<.05&&q.set(0)):Il.get()<.1&&(q.set(0),q.addWithAngle(Il.get(Math.PI*2),(B.x+B.y)*Il.get(.01,.03))),Il.get()<.05&&(Fl=!Fl)}function Nt(l,e){kl.set(l,e),Ge=Je=!0,F.onPointerDownOrUp!=null&&F.onPointerDownOrUp()}function _t(l,e){kl.set(l,e)}function Kt(l){Ge=!1,We=!0,F.onPointerDownOrUp!=null&&F.onPointerDownOrUp()}var en=Object.freeze({__proto__:null,clearJustPressed:jt,init:Bt,get isJustPressed(){return wl},get isJustReleased(){return Ol},get isPressed(){return W},pos:Tl,update:zt});let H=new y,X=!1,K=!1,ll=!1;function Vt(l){Lt({onKeyDown:l}),Bt(R,x,{onPointerDownOrUp:l,anchor:new y(.5,.5)})}function Gt(){Ut(),zt(),H=Tl,X=yl||W,K=$l||wl,ll=Ue||Ol}function Jt(){At(),jt()}function Dl(l){H.set(l.pos),X=l.isPressed,K=l.isJustPressed,ll=l.isJustReleased}var tn=Object.freeze({__proto__:null,clearJustPressed:Jt,init:Vt,get isJustPressed(){return K},get isJustReleased(){return ll},get isPressed(){return X},get pos(){return H},set:Dl,update:Gt});const nn={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"};let O,le=!1,el,Ll,qe=!1,ee;s.algoChipSession=void 0;let He,Wt,Xe={},qt,Y=!1,te,Ye,Sl=!1,Qe=!1,Ul,Ht,Ze,Q={},ie,$e;async function sn(l){if(el=l.audioSeed,Ll=l.audioVolume,ie=l.bgmName,$e=l.bgmVolume,typeof AlgoChip<"u"&&AlgoChip!==null&&typeof AlgoChipUtil<"u"&&AlgoChipUtil!==null?qe=le=!0:typeof sss<"u"&&sss!==null&&(Y=le=!0),typeof audioFiles<"u"&&audioFiles!=null&&(Sl=le=!0),!le)return!1;if(O=new(window.AudioContext||window.webkitAudioContext),Sl){document.addEventListener("visibilitychange",()=>{document.hidden?O.suspend():O.resume()}),gn(),Zt(.1*Ll),Qt(l.audioTempo);for(let e in audioFiles){const t=hn(e,audioFiles[e]);e===ie&&(t.isLooping=!0,Qe=!0)}}return qe&&(ee=O.createGain(),ee.connect(O.destination),s.algoChipSession=AlgoChipUtil.createAudioSession({audioContext:O,gainNode:ee,workletBasePath:"https://abagames.github.io/algo-chip/worklets/"}),await s.algoChipSession.ensureReady(),s.algoChipSession.setBgmVolume(.5*Ll),qt=AlgoChipUtil.createVisibilityController(s.algoChipSession)),Y&&(te=O.createGain(),te.connect(O.destination),sss.init(el,O,te),sss.setVolume(.1*Ll),sss.setTempo(l.audioTempo)),!0}function on(l,e){if(!(Sl&&Xt(l,e!=null&&e.volume!=null?e.volume:1)))if(s.algoChipSession!=null){let t=l,i=el;t==="powerUp"?t="powerup":(t==="random"||t==="lucky")&&(t="explosion",i++);let n;e?.freq!=null?n=e.freq:e?.pitch!=null&&(n=2**((e.pitch-69)/12)*440);const o={seed:i,type:t,baseFrequency:n},r=JSON.stringify(o);Xe[r]==null&&(Xe[r]=s.algoChipSession.generateSe(o)),s.algoChipSession.playSe(Xe[r],{volume:Ll*(e?.volume!=null?e?.volume:1)*.7,duckingDb:-8,quantize:{loopAware:!0,phase:"next",quantizeTo:"half_beat",fallbackTempo:120}})}else Y&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(l,e):Y&&sss.play(nn[l])}function rn(l){el=l,Y&&sss.setSeed(l)}async function lt(){if(!(Qe&&Xt(ie,$e)))if(s.algoChipSession!=null){if(He==null||Wt!=el){Wt=el;const l=new Rl;l.setSeed(el);const e=l.get(-.9,.9),t=l.get(-.9,.9);He=await s.algoChipSession.generateBgm({seed:el,lengthInMeasures:32,twoAxisStyle:{calmEnergetic:e,percussiveMelodic:t},overrides:{tempo:"medium"}})}s.algoChipSession.playBgm(He,{loop:!0})}else Y&&typeof sss.generateMml=="function"?Ye=sss.playMml(sss.generateMml(),{volume:$e}):Y&&sss.playBgm()}function Al(){Qe?Yt(ie):s.algoChipSession!=null?s.algoChipSession.stopBgm():Ye!=null?sss.stopMml(Ye):Y&&sss.stopBgm()}function an(){Sl&&dn(),Y&&sss.update()}function cn(){O?.resume(),s.algoChipSession!=null&&s.algoChipSession.resumeAudioContext()}function un(){Sl&&fn(),qe&&(qt(),s.algoChipSession!=null&&s.algoChipSession.close())}function Xt(l,e=1){const t=Q[l];return t==null?!1:(t.gainNode.gain.value=e,t.isPlaying=!0,!0)}function dn(){const l=O.currentTime;for(const e in Q){const t=Q[e];if(!t.isReady||!t.isPlaying)continue;t.isPlaying=!1;const i=Sn(l);(t.playedTime==null||i>t.playedTime)&&(pn(t,i),t.playedTime=i)}}function Yt(l,e=void 0){const t=Q[l];t.source!=null&&(e==null?t.source.stop():t.source.stop(e),t.source=void 0)}function fn(l=void 0){if(Q){for(const e in Q)Yt(e,l);Q={}}}function gn(){Sl=!0,Ul=O.createGain(),Ul.connect(O.destination),Qt(),mn(),Zt()}function hn(l,e){return Q[l]=yn(e),Q[l]}function Qt(l=120){Ht=60/l}function mn(l=8){Ze=l>0?4/l:void 0}function Zt(l=.1){Ul.gain.value=l}function pn(l,e){const t=O.createBufferSource();l.source=t,t.buffer=l.buffer,t.loop=l.isLooping,t.start=t.start||t.noteOn,t.connect(l.gainNode),t.start(e)}function yn(l){const e={buffer:void 0,source:void 0,gainNode:O.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return e.gainNode.connect(Ul),wn(l).then(t=>{e.buffer=t,e.isReady=!0}),e}async function wn(l){const t=await(await fetch(l)).arrayBuffer();return await O.decodeAudioData(t)}function Sn(l){if(Ze==null)return l;const e=Ht*Ze;return e>0?Math.ceil(l/e)*e:l}let $t,li;const ei=68,et=1e3/ei;let Bl=0,ti=10,ne,ii;async function bn(l,e,t){$t=l,li=e,ii=t,await $t(),ni()}function ni(){ne=requestAnimationFrame(ni);const l=window.performance.now();l<Bl-ei/12||(Bl+=et,(Bl<l||Bl>l+et*2)&&(Bl=l+et),an(),Gt(),li(),ii&&zi(),ti--,ti===0&&Wi())}function Cn(){ne&&(cancelAnimationFrame(ne),ne=void 0)}let se;const oe=new Rl;function tt(){se=[]}function si(l,e=16,t=1,i=0,n=Math.PI*2,o=void 0){if(e<1){if(oe.get()>e)return;e=1}for(let r=0;r<e;r++){const c=i+oe.get(n)-n/2,u={pos:new y(l),vel:new y(t*oe.get(.5,1),0).rotate(c),color:k,ticks:d(oe.get(10,20)*Math.sqrt(Math.abs(t)),10,60),edgeColor:o};se.push(u)}}function re(){ql(),se=se.filter(l=>{if(l.ticks--,l.ticks<0)return!1;l.pos.add(l.vel),l.vel.mul(.98);const e=Math.floor(l.pos.x),t=Math.floor(l.pos.y);return l.edgeColor!=null&&(A(l.edgeColor),hl(e-1,t-1,3,3)),A(l.color),hl(e,t,1,1),!0}),Hl()}function it(l,e,t,i){return oi(!1,l,e,t,i,"rect")}function vn(l,e,t,i){return oi(!0,l,e,t,i,"box")}function xn(l,e,t,i,n=.5,o=.5){typeof l!="number"&&(o=n,n=i,i=t,t=e,e=l.y,l=l.x);const r=new y(t).rotate(n),c=new y(l-r.x*o,e-r.y*o);return st(c,r,i)}function En(l,e,t=3,i=3,n=3){const o=new y,r=new y;return typeof l=="number"?typeof e=="number"?typeof t=="number"?(o.set(l,e),r.set(t,i)):(o.set(l,e),r.set(t),n=i):nt("when x1 is a number, y1 must also be a number."):typeof e=="number"?typeof t=="number"?(o.set(l),r.set(e,t),n=i):nt("when x1 is a Vector and y1 is a number, x2 must be a number representing the new y-coordinate."):typeof t=="number"?(o.set(l),r.set(e),n=t):nt("when both endpoints are Vectors, the last argument must be the thickness (number)."),st(o,r.sub(o),n)}function Mn(l,e,t,i,n,o){let r=new y;typeof l=="number"?r.set(l,e):(r.set(l),o=n,n=i,i=t,t=e),i==null&&(i=3),n==null&&(n=0),o==null&&(o=Math.PI*2);let c,u;if(n>o?(c=o,u=n-o):(c=n,u=o-n),u=d(u,0,Math.PI*2),u<.01)return;const f=d(Math.ceil(u*Math.sqrt(t*.25)),1,36),p=u/f;let m=c,g=new y(t).rotate(m).add(r),h=new y,v=new y,S={isColliding:{rect:{},text:{},char:{}}};for(let I=0;I<f;I++){m+=p,h.set(t).rotate(m).add(r),v.set(h).sub(g);const P=st(g,v,i,!0);S=Object.assign(Object.assign(Object.assign({},S),Pe(P.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},S.isColliding.rect),P.isColliding.rect),text:Object.assign(Object.assign({},S.isColliding.text),P.isColliding.text),char:Object.assign(Object.assign({},S.isColliding.char),P.isColliding.char)}}),g.set(h)}return Pt(),S}function oi(l,e,t,i,n,o="rect"){if(typeof e=="number"){if(typeof t=="number")return typeof i=="number"?n==null?sl(l,e,t,i,i):sl(l,e,t,i,n):sl(l,e,t,i.x,i.y);ri(o,"when x is a number, y must also be a number.")}else if(typeof t=="number"){if(i==null)return sl(l,e.x,e.y,t,t);if(typeof i=="number")return sl(l,e.x,e.y,t,i);ri(o,"when x is a Vector and y is a number, width must be a number.")}else return sl(l,e.x,e.y,t.x,t.y)}function nt(l){throw new Error(`line(): ${l}`)}function ri(l,e){throw new Error(`${l}(): ${e}`)}function st(l,e,t,i=!1){let n=!0;(w.name==="shape"||w.name==="shapeDark")&&(k!=="transparent"&&Ai(l.x,l.y,l.x+e.x,l.y+e.y,t),n=!1);const o=Math.floor(d(t,3,10)),r=Math.abs(e.x),c=Math.abs(e.y),u=d(Math.ceil(r>c?r/o:c/o)+1,3,99);e.div(u-1);let f={isColliding:{rect:{},text:{},char:{}}};for(let p=0;p<u;p++){const m=sl(!0,l.x,l.y,t,t,!0,n);f=Object.assign(Object.assign(Object.assign({},f),Pe(m.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},f.isColliding.rect),m.isColliding.rect),text:Object.assign(Object.assign({},f.isColliding.text),m.isColliding.text),char:Object.assign(Object.assign({},f.isColliding.char),m.isColliding.char)}}),l.add(e)}return i||Pt(),f}function sl(l,e,t,i,n,o=!1,r=!0){let c=r;(w.name==="shape"||w.name==="shapeDark")&&c&&k!=="transparent"&&(l?hl(e-i/2,t-n/2,i,n):hl(e,t,i,n),c=!1);let u=l?{x:Math.floor(e-i/2),y:Math.floor(t-n/2)}:{x:Math.floor(e),y:Math.floor(t)};const f={x:Math.trunc(i),y:Math.trunc(n)};if(f.x===0||f.y===0)return{isColliding:{rect:{},text:{},char:{}}};f.x<0&&(u.x+=f.x,f.x*=-1),f.y<0&&(u.y+=f.y,f.y*=-1);const p={pos:u,size:f,collision:{isColliding:{rect:{}}}};p.collision.isColliding.rect[k]=!0;const m=Rt(p);return k!=="transparent"&&((o?Xl:ml).push(p),c&&hl(u.x,u.y,f.x,f.y)),m}function ot({pos:l,size:e,text:t,isToggle:i=!1,onClick:n=()=>{},isSmallText:o=!0}){return{pos:l,size:e,text:t,isToggle:i,onClick:n,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:o}}function rt(l){const e=new y(H).sub(l.pos);l.isHovered=e.isInRect(0,0,l.size.x,l.size.y),l.isHovered&&wl&&(l.isPressed=!0),l.isPressed&&!l.isHovered&&(l.isPressed=!1),l.isPressed&&Ol&&(l.onClick(),l.isPressed=!1,l.isToggle&&(l.toggleGroup.length===0?l.isSelected=!l.isSelected:(l.toggleGroup.forEach(t=>{t.isSelected=!1}),l.isSelected=!0))),ae(l)}function ae(l){ql(),A(l.isPressed?"blue":"light_blue"),it(l.pos.x,l.pos.y,l.size.x,l.size.y),l.isToggle&&!l.isSelected&&(A("white"),it(l.pos.x+1,l.pos.y+1,l.size.x-2,l.size.y-2)),A(l.isHovered?"black":"blue"),Tt(l.text,l.pos.x+3,l.pos.y+3,{isSmallText:l.isSmallText}),Hl()}let V,zl,ol,at;function Pn(l){V={randomSeed:l,inputs:[]}}function Rn(l){V.inputs.push(l)}function ai(){return V!=null}function Tn(l){zl=0,l.setSeed(V.randomSeed)}function On(){zl>=V.inputs.length||(Dl(V.inputs[zl]),zl++)}function In(){ol=[]}function Fn(l,e,t){ol.push({randomState:t.getState(),gameState:cloneDeep(l),baseState:cloneDeep(e)})}function kn(l){const e=ol.pop(),t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),at={pos:new y(H),isPressed:X,isJustPressed:K,isJustReleased:ll},Dl(V.inputs.pop()),e}function Dn(l){const e=ol[ol.length-1],t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),at={pos:new y(H),isPressed:X,isJustPressed:K,isJustReleased:ll},Dl(V.inputs[V.inputs.length-1]),e}function Ln(){Dl(at)}function Un(){return ol.length===0}function An(){const l=zl-1;if(!(l>=V.inputs.length))return ol[l]}const ct=4,Bn=60,zn="video/webm;codecs=vp8,opus",jn="video/webm",Nn="recording.webm",_n=1e5*ct,Kn=.7;let z,ce;function Vn(l,e,t,i){if(z!=null)return;const n=document.createElement("canvas");n.width=i.x*ct,n.height=i.y*ct;const o=n.getContext("2d");o.imageSmoothingEnabled=!1;const r=()=>{o.drawImage(l,0,0,l.width,l.height,0,0,n.width,n.height),ce=requestAnimationFrame(r)};r();const c=n.captureStream(Bn),u=e.createMediaStreamDestination(),f=e.createGain();f.gain.value=Kn,t.forEach(h=>{h?.connect(f)}),f.connect(u);const p=u.stream,m=new MediaStream([...c.getVideoTracks(),...p.getAudioTracks()]);z=new MediaRecorder(m,{mimeType:zn,videoBitsPerSecond:_n});let g=[];z.ondataavailable=h=>{h.data.size>0&&g.push(h.data)},z.onstop=()=>{const h=new Blob(g,{type:jn}),v=URL.createObjectURL(h),S=document.createElement("a");S.href=v,S.download=Nn,S.click(),URL.revokeObjectURL(v),g=[]},z.start()}function Gn(){z!=null&&z.state!=="inactive"&&(z.stop(),z=void 0),ce&&(cancelAnimationFrame(ce),ce=void 0)}function Jn(){return z!=null&&z.state==="recording"}const Wn=Math.PI,qn=Math.abs,Hn=Math.sin,Xn=Math.cos,Yn=Math.atan2,Qn=Math.sqrt,Zn=Math.pow,$n=Math.floor,ls=Math.round,es=Math.ceil,ts=Math.min,is=Math.max;s.ticks=0,s.difficulty=void 0,s.score=0,s.time=void 0,s.isReplaying=!1;function ns(l=1,e){return Z.get(l,e)}function ss(l=2,e){return Z.getInt(l,e)}function os(l=1,e){return Z.get(l,e)*Z.getPlusOrMinus()}function ut(l="GAME OVER"){me=l,a.isShowingTime&&(s.time=void 0),mi()}function rs(l="COMPLETE"){me=l,mi()}function as(l,e,t){if(s.isReplaying||(s.score+=l,e==null))return;const i=`${l>=1?"+":""}${Math.floor(l)}`;let n=new y;typeof e=="number"?n.set(e,t):n.set(e),n.x-=i.length*(a.isUsingSmallText?$:b)/2,n.y-=b/2,ge.push({str:i,pos:n,vy:-2,ticks:30})}function ci(l){A(l)}function cs(l,e,t,i,n,o){let r=new y;typeof l=="number"?(r.set(l,e),c(r,t,i,n,o)):(r.set(l),c(r,e,t,i,n));function c(u,f,p,m,g){if(Ds(f)){const h=f;si(u,h.count,h.speed,h.angle,h.angleWidth,h.edgeColor)}else si(u,f,p,m,g)}}function ui(l,e){return new y(l,e)}function di(l,e){!Nl&&!rl&&on(l,e)}function fi(){Vn(R,O,[Ul,ee,te],x)}function dt(){Gn()}function us(l){if(Nl){const e=Dn(Z),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,cloneDeep(e.gameState)}else if(rl){const e=kn(Z),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,e.gameState}else{if(s.isReplaying)return An().gameState;if(G==="inGame"){const e={score:s.score,ticks:s.ticks};Fn(l,e,Z)}}return l}function ds(){rl||(!s.isReplaying&&a.isRewindEnabled?Cs():ut())}const ue={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},fs=new Rl,Z=new Rl;let G,gs={title:Ss,inGame:ws,gameOver:bs,rewind:vs,error:ye},jl=0,de,fe=!0,a,ge,Nl=!1,rl=!1,_l,he,me,ft,pe,al;function hs(l){window.update=l.update,window.title=l.title,window.description=l.description,window.characters=l.characters,window.options=l.options,window.audioFiles=l.audioFiles,gi()}function gi(){typeof options<"u"&&options!=null?a=Object.assign(Object.assign({},ue),options):a=ue,a.isMinifying&&Us(),bn(ps,ys,a.isCapturing)}function ms(){Cn(),dt(),un(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}async function ps(){const l={name:a.theme,isUsingPixi:!1,isDarkColor:!1};a.theme!=="simple"&&a.theme!=="dark"&&(l.isUsingPixi=!0),(a.theme==="pixel"||a.theme==="shapeDark"||a.theme==="crt"||a.theme==="dark")&&(l.isDarkColor=!0);const e=l.isDarkColor?"#101010":"#e0e0e0",t=l.isDarkColor?"blue":"white";Ii(l.isDarkColor,a.colorPalette),Ui(a.viewSize,e,t,a.isCapturing,a.isCapturingGameCanvasOnly,a.captureCanvasScale,a.captureDurationSec,l),Vt(()=>{cn()}),Gi();let i=a.audioSeed+a.seed;typeof description<"u"&&description!=null&&description.trim().length>0&&(fe=!1,i+=bi(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(fe=!1,document.title=title,i+=bi(title),pe=`crisp-game-${encodeURIComponent(title)}-${i}`,jl=ks()),typeof characters<"u"&&characters!=null&&Ji(characters,"a"),a.isSoundEnabled&&(a.isSoundEnabled=await sn({audioSeed:i,audioVolume:a.audioVolume,audioTempo:a.audioTempo,bgmName:a.bgmName,bgmVolume:a.bgmVolume})),A("black"),fe?(gt(),s.ticks=0):hi()}function ys(){if(G==="error"){ye();return}s.df=s.difficulty=s.ticks/3600+1,s.tc=s.ticks;const l=s.score,e=s.time;s.sc=s.score;const t=s.sc;s.inp={p:H,ip:X,ijp:K,ijr:ll},Ni();try{gs[G]()}catch(i){Es(i);return}w.isUsingPixi&&(Wl(),w.name==="crt"&&Bi()),s.ticks++,s.isReplaying?(s.score=l,s.time=e):s.sc!==t&&(s.score=s.sc)}function gt(){G="inGame",s.ticks=-1,tt();const l=Math.floor(s.score);l>jl&&(jl=l),a.isShowingTime&&s.time!=null&&(de==null||de>s.time)&&(de=s.time),s.score=0,s.time=0,ge=[],a.isPlayingBgm&&a.isSoundEnabled&&lt();const e=fs.getInt(999999999);Z.setSeed(e),(a.isReplayEnabled||a.isRewindEnabled)&&(Pn(e),In(),s.isReplaying=!1)}function ws(){El(),a.isDrawingParticleFront||re(),a.isDrawingScoreFront||Si(),(a.isReplayEnabled||a.isRewindEnabled)&&Rn({pos:ui(H),isPressed:X,isJustPressed:K,isJustReleased:ll}),typeof update=="function"&&update(),a.isDrawingParticleFront&&re(),a.isDrawingScoreFront&&Si(),ht(),a.isShowingTime&&s.time!=null&&s.time++,a.isRecording&&!Jn()&&fi()}function hi(){G="title",s.ticks=-1,tt(),El(),ai()&&(Tn(Z),s.isReplaying=!0)}function Ss(){if(K){gt();return}if(El(),a.isReplayEnabled&&ai()&&(On(),s.inp={p:H,ip:X,ijp:K,ijr:ll},a.isDrawingParticleFront||re(),update(),a.isDrawingParticleFront&&re()),ht(),typeof title<"u"&&title!=null){let l=0;title.split(`
`).forEach(t=>{t.length>l&&(l=t.length)});const e=Math.floor((x.x-l*b)/2);title.split(`
`).forEach((t,i)=>{_(t,e,Math.floor(x.y*.25)+i*b,{edgeColor:a.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let l=0;description.split(`
`).forEach(i=>{i.length>l&&(l=i.length)});const e=a.isUsingSmallText?$:b,t=Math.floor((x.x-l*e)/2);description.split(`
`).forEach((i,n)=>{_(i,t,Math.floor(x.y/2)+n*b,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.description})})}}function mi(){G="gameOver",s.isReplaying||Jt(),s.ticks=-1,yi(),a.isPlayingBgm&&a.isSoundEnabled&&Al();const l=Math.floor(s.score);l>jl&&Fs(l)}function bs(){s.ticks===0&&!w.isUsingPixi&&yi(),(s.isReplaying||s.ticks>20)&&K?(pi(),gt()):s.ticks===(a.isReplayEnabled?120:300)&&!fe&&(pi(),hi())}function pi(){!a.isRecording||s.isReplaying||dt()}function yi(){s.isReplaying||_(me,Math.floor((x.x-me.length*b)/2),Math.floor(x.y/2),{edgeColor:a.textEdgeColor.gameOver})}function Cs(){G="rewind",Nl=!0,_l=ot({pos:{x:x.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:a.isUsingSmallText}),he=ot({pos:{x:x.x-39,y:x.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:a.isUsingSmallText}),a.isPlayingBgm&&a.isSoundEnabled&&Al(),w.isUsingPixi&&(ae(_l),ae(he))}function vs(){El(),update(),ht(),Ln(),rl?(ae(_l),(Un()||!X)&&xs()):(rt(_l),rt(he),_l.isPressed&&(rl=!0,Nl=!1)),he.isPressed&&(Nl=rl=!1,ut()),a.isShowingTime&&s.time!=null&&s.time++}function xs(){rl=!1,G="inGame",tt(),a.isPlayingBgm&&a.isSoundEnabled&&lt()}function ht(){if(a.isShowingTime)wi(s.time,3,3),wi(de,x.x-7*(a.isUsingSmallText?$:b),3);else if(a.isShowingScore){_(`${Math.floor(s.score)}`,3,3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score});const l=`HI ${jl}`;_(l,x.x-l.length*(a.isUsingSmallText?$:b),3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}}function Es(l){if(console.error("Error inside update():",l),G==="error"&&al!=null){ye();return}al=Rs(l),G="error",Ps(),ye()}function ye(){(al==null||al.length===0)&&(al=["UPDATE ERROR","See console for details."]);const l=a??ue,e=l.isUsingSmallText?$:b,t=al.length*b,i=Math.max(0,Math.floor((x.y-t)/2));Ms(),El(),al.forEach((n,o)=>{const r=Math.max(0,Math.floor((x.x-n.length*e)/2));_(n,r,i+o*b,{isSmallText:l.isUsingSmallText,edgeColor:l.textEdgeColor.gameOver})})}function Ms(){try{A("black")}catch{}}function Ps(){a?.isPlayingBgm&&a.isSoundEnabled&&typeof Al=="function"&&Al()}function Rs(l){const e=Ts(l),i=["UPDATE ERROR",...Os(e)];return i.push("See console for details."),i}function Ts(l){var e,t;if(l instanceof Error){const i=(e=l.message)===null||e===void 0?void 0:e.trim();return l.name&&i&&i.length>0?`${l.name}: ${i}`:(t=i??l.name)!==null&&t!==void 0?t:"Unknown error"}if(typeof l=="string")return l;try{return JSON.stringify(l)}catch{return"Unknown error"}}function Os(l){const t=(a??ue).isUsingSmallText?$:b,i=Math.max(6,Math.floor(x.x/t)-2),n=4,o=l.split(/\r?\n/).map(c=>c.trim()).filter(c=>c.length>0);o.length===0&&o.push("Unknown error");const r=[];return o.forEach(c=>{r.length>=n||r.push(...Is(c,i,n-r.length))}),r}function Is(l,e,t){if(l.length<=e)return[l];const i=[];let n=l;for(;n.length>0&&i.length<t;){if(n.length<=e){i.push(n),n="";break}let o=n.lastIndexOf(" ",e);o<=0&&(o=e),i.push(n.slice(0,o).trim()),n=n.slice(o).trim()}return n.length>0&&i.length<t&&i.push(n),i}function wi(l,e,t){if(l==null)return;let i=Math.floor(l*100/50);i>=600*100&&(i=600*100-1);const n=mt(Math.floor(i/6e3),1)+"'"+mt(Math.floor(i%6e3/100),2)+'"'+mt(Math.floor(i%100),2);_(n,e,t,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}function mt(l,e){return("0000"+l).slice(-e)}function Si(){ql(),A("black"),ge=ge.filter(l=>(_(l.str,l.pos.x,l.pos.y,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.floatingScore}),l.pos.y+=l.vy,l.vy*=.9,l.ticks--,l.ticks>0)),Hl()}function bi(l){let e=0;for(let t=0;t<l.length;t++){const i=l.charCodeAt(t);e=(e<<5)-e+i,e|=0}return e}function Fs(l){if(pe!=null)try{const e={highScore:l};localStorage.setItem(pe,JSON.stringify(e))}catch(e){console.warn("Unable to save high score:",e)}}function ks(){try{const l=localStorage.getItem(pe);if(l)return JSON.parse(l).highScore}catch(l){console.warn("Unable to load high score:",l)}return 0}function Ds(l){return l!=null&&l.constructor===Object}function Ls(){let l=window.location.search.substring(1);if(l=l.replace(/[^A-Za-z0-9_-]/g,""),l.length===0)return;const e=document.createElement("script");ft=`${l}/main.js`,e.setAttribute("src",ft),document.head.appendChild(e)}function Us(){fetch(ft).then(l=>l.text()).then(l=>{const e=Terser.minify(l+"update();",{toplevel:!0}).code,t="function(){",i=e.indexOf(t),n="options={",o=e.indexOf(n);let r=e;if(i>=0)r=e.substring(e.indexOf(t)+t.length,e.length-4);else if(o>=0){let c=1,u;for(let f=o+n.length;f<e.length;f++){const p=e.charAt(f);if(p==="{")c++;else if(p==="}"&&(c--,c===0)){u=f+2;break}}c===0&&(r=e.substring(u))}Ci.forEach(([c,u])=>{r=r.split(c).join(u)}),console.log(r),console.log(`${r.length} letters`)})}s.inp=void 0;function As(...l){return ci.apply(this,l)}function Bs(...l){return di.apply(this,l)}function zs(...l){return D.apply(this,l)}function js(...l){return cl.apply(this.args)}s.tc=void 0,s.df=void 0,s.sc=void 0;const Ns="transparent",_s="white",Ks="red",Vs="green",Gs="yellow",Js="blue",Ws="purple",qs="cyan",Hs="black",Xs="coin",Ys="laser",Qs="explosion",Zs="powerUp",$s="hit",lo="jump",eo="select",to="lucky";let Ci=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];function io(l){}function no(l){}s.PI=Wn,s.__testInitOptions=no,s.__testSetReplaying=io,s.abs=qn,s.addGameScript=Ls,s.addScore=as,s.addWithCharCode=Ri,s.arc=Mn,s.atan2=Yn,s.bar=xn,s.bl=Js,s.box=vn,s.ceil=es,s.char=Ki,s.clamp=d,s.clr=As,s.cn=Xs,s.color=ci,s.complete=rs,s.cos=Xn,s.cy=qs,s.end=ut,s.ex=Qs,s.floor=$n,s.frameState=us,s.getButton=ot,s.gr=Vs,s.ht=$s,s.init=hs,s.input=tn,s.jm=lo,s.keyboard=Qi,s.lc=Hs,s.line=En,s.ls=Ys,s.max=is,s.min=ts,s.minifyReplaces=Ci,s.onLoad=gi,s.onUnload=ms,s.particle=cs,s.play=di,s.playBgm=lt,s.ply=Bs,s.pointer=en,s.pow=Zn,s.pr=Ws,s.pw=Zs,s.range=E,s.rd=Ks,s.rect=it,s.remove=cl,s.rewind=ds,s.rmv=js,s.rnd=ns,s.rndi=ss,s.rnds=os,s.round=ls,s.setAudioSeed=rn,s.sin=Hn,s.sl=eo,s.sqrt=Qn,s.startRecording=fi,s.stopBgm=Al,s.stopRecording=dt,s.text=Tt,s.times=D,s.tms=zs,s.tr=Ns,s.uc=to,s.updateButton=rt,s.vec=ui,s.wh=_s,s.wrap=j,s.yl=Gs})(window||{})),vi}so();const oo="WIND RANG",ro=`
[Tap] Toggle wind
`,ao=[`
llllll
llllll
llllll
llllll
 l  l
 l  l
  `,`
llllll
llllll
llllll
llllll
ll  ll
  `,`
    ll
    ll
    ll
    ll
llllll
llllll
  `,`
  lll
ll l l
 llll
  ll
 l  l
 l  l
`,`
  lll
ll l l
 llll
 l  l
ll  ll
`],co={viewSize:{x:100,y:100},isPlayingBgm:!0,isReplayEnabled:!0,audioSeed:2},Se=.08,uo=.5,be=.05,Kl=15,fo=1,Ei=1.5,Mi=18,Pi=77,go=.25,ho=8,Ce=98;let pt,ve,yt,xe,bl,Vl,Gl,wt;function mo(){ticks||(pt=[],ve=Mi,yt=[],xe=Pi,bl="right",Vl=1,Gl=50,wt=[],times(5,d=>{wt.push({pos:vec(rnd(100),20+d*15),vel:vec(uo,rnd(-.2,.2))})})),input.isJustPressed&&(bl=bl==="left"?"right":"left",play("select")),color("light_blue"),wt.forEach(d=>{bl==="left"?d.vel.x-=be:d.vel.x+=be,d.vel.y+=rnd(-be,be)*.2,d.vel.x*=.98,d.vel.y*=.98,d.pos.add(d.vel),d.pos.x<-Kl?d.pos.x=100+Kl:d.pos.x>100+Kl&&(d.pos.x=-Kl),d.pos.y<0?d.pos.y=100:d.pos.y>100&&(d.pos.y=0),box(d.pos,Kl,fo)}),color("black");const s=addWithCharCode("a",floor(ticks/15)%2);char(s,Gl,Ce),ve--,ve<=0&&(pt.push({pos:vec(Gl,Ce),vel:vec(0,-Ei),state:"out",angle:0}),ve=Mi,play("click",{pitch:60})),remove(pt,d=>{const j=bl==="left"?-Se:Se;d.vel.x+=j,d.pos.add(d.vel),d.angle+=.2,d.state==="out"&&d.pos.y<10&&(d.state="return",d.vel.y=Ei),color("blue");const U=floor(d.angle/(PI/2)%4);if(char("c",d.pos,{rotation:U}),d.state==="return"&&d.pos.y>Ce-5){if(abs(d.pos.x-Gl)<ho)return play("powerUp"),Vl++,addScore(10*Vl,d.pos),particle(d.pos,{count:10,speed:2}),!0;if(d.pos.y>105)return!0}return d.pos.x<-5||d.pos.x>105||d.pos.y>105}),xe--,xe<=0&&(yt.push({pos:vec(rnd(10,90),0),vel:vec(0,go*rnd(1,difficulty)),charBase:"d"}),xe=Pi*rnd(.5,2)/difficulty),remove(yt,d=>{const j=bl==="left"?-Se*.25:Se*.25;d.vel.x+=j,d.pos.add(d.vel),d.pos.x<0?d.pos.x=100:d.pos.x>100&&(d.pos.x=0),d.pos.y>100&&(play("explosion"),end()),color("red");const U=addWithCharCode(d.charBase,floor(ticks/15)%2);return char(U,d.pos).isColliding.char?.c?(play("coin"),particle(d.pos,{count:10,speed:3}),addScore(1*Vl,d.pos),!0):(d.pos.y>Ce-5&&abs(d.pos.x-Gl)<5&&(play("explosion"),end()),!1)}),color("black"),text("x"+Vl,3,9,{isSmallText:!0})}init({update:mo,title:oo,description:ro,characters:ao,options:co});
