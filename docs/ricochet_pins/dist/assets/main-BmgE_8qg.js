(function(){const E=document.createElement("link").relList;if(E&&E.supports&&E.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))z(u);new MutationObserver(u=>{for(const S of u)if(S.type==="childList")for(const B of S.addedNodes)B.tagName==="LINK"&&B.rel==="modulepreload"&&z(B)}).observe(document,{childList:!0,subtree:!0});function D(u){const S={};return u.integrity&&(S.integrity=u.integrity),u.referrerPolicy&&(S.referrerPolicy=u.referrerPolicy),u.crossOrigin==="use-credentials"?S.credentials="include":u.crossOrigin==="anonymous"?S.credentials="omit":S.credentials="same-origin",S}function z(u){if(u.ep)return;u.ep=!0;const S=D(u);fetch(u.href,S)}})();var bi={},Si;function lo(){return Si||(Si=1,(function(s){function E(l,e=0,t=1){return Math.max(e,Math.min(l,t))}function D(l,e,t){const i=t-e,n=l-e;if(n>=0)return n%i+e;{let o=i+n%i+e;return o>=t&&(o-=i),o}}function z(l,e,t){return e<=l&&l<t}function u(l){return[...Array(l).keys()]}function S(l,e){return u(l).map(t=>e(t))}function B(l,e){let t=[];for(let i=0,n=0;i<l.length;n++)e(l[i],n)?(t.push(l[i]),l.splice(i,1)):i++;return t}function _(l){return[...l].reduce((e,[t,i])=>(e[t]=i,e),{})}function L(l){return Object.keys(l).map(e=>[e,l[e]])}function nl(l,e){return String.fromCharCode(l.charCodeAt(0)+e)}function J(l){return l.x!=null&&l.y!=null}class w{constructor(e,t){this.x=0,this.y=0,this.set(e,t)}set(e=0,t=0){return J(e)?(this.x=e.x,this.y=e.y,this):(this.x=e,this.y=t,this)}add(e,t){return J(e)?(this.x+=e.x,this.y+=e.y,this):(this.x+=e,this.y+=t,this)}sub(e,t){return J(e)?(this.x-=e.x,this.y-=e.y,this):(this.x-=e,this.y-=t,this)}mul(e){return this.x*=e,this.y*=e,this}div(e){return this.x/=e,this.y/=e,this}clamp(e,t,i,n){return this.x=E(this.x,e,t),this.y=E(this.y,i,n),this}wrap(e,t,i,n){return this.x=D(this.x,e,t),this.y=D(this.y,i,n),this}addWithAngle(e,t){return this.x+=Math.cos(e)*t,this.y+=Math.sin(e)*t,this}swapXy(){const e=this.x;return this.x=this.y,this.y=e,this}normalize(){return this.div(this.length),this}rotate(e){if(e===0)return this;const t=this.x;return this.x=t*Math.cos(e)-this.y*Math.sin(e),this.y=t*Math.sin(e)+this.y*Math.cos(e),this}angleTo(e,t){return J(e)?Math.atan2(e.y-this.y,e.x-this.x):Math.atan2(t-this.y,e-this.x)}distanceTo(e,t){let i,n;return J(e)?(i=e.x-this.x,n=e.y-this.y):(i=e-this.x,n=t-this.y),Math.sqrt(i*i+n*n)}isInRect(e,t,i,n){return z(this.x,e,e+i)&&z(this.y,t,t+n)}equals(e){return this.x===e.x&&this.y===e.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const yl=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],xi="twrgybpclRGYBPCL";let cl,ul;const Ei=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function Pi(l,e){const[t,i,n]=Me(0,l);if(cl=_(yl.map((o,r)=>{if(r<1)return[o,{r:0,g:0,b:0,a:0}];if(r<9){const[y,p,h]=Me(r-1,l);return[o,{r:y,g:p,b:h,a:1}]}const[c,d,f]=Me(r-9+1,l);return[o,{r:Math.floor(l?c*.5:t-(t-c)*.5),g:Math.floor(l?d*.5:n-(n-d)*.5),b:Math.floor(l?f*.5:i-(i-f)*.5),a:1}]})),l){const o=cl.blue;cl.white={r:Math.floor(o.r*.15),g:Math.floor(o.g*.15),b:Math.floor(o.b*.15),a:1}}e!=null&&Mi(e)}function Mi(l){ul=l.map(e=>({r:e[0],g:e[1],b:e[2],a:1}));for(let e=0;e<yl.length;e++){let t=1/0,i=-1;for(let n=0;n<ul.length;n++){const o=Ri(ul[n],cl[yl[e]]);o<t&&(t=o,i=n)}cl[yl[e]]=ul[i]}}function Ri(l,e){const t={r:.299,g:.587,b:.114},i=l.r-e.r,n=l.g-e.g,o=l.b-e.b,r=e.r===e.g&&e.g===e.b;let c=Math.sqrt(i*i*t.r+n*n*t.g+o*o*t.b);return r&&!(e.r===0&&e.g===0&&e.b===0)&&(c*=1.5),c}function Me(l,e){e&&(l===0?l=7:l===7&&(l=0));const t=Ei[l];return[(t&16711680)>>16,(t&65280)>>8,t&255]}function wl(l,e=1){const t=wt(l);return Math.floor(t.r*e)<<16|Math.floor(t.g*e)<<8|Math.floor(t.b*e)}function bl(l,e=1){const t=wt(l),i=Math.floor(t.r*e),n=Math.floor(t.g*e),o=Math.floor(t.b*e);return t.a<1?`rgba(${i},${n},${o},${t.a})`:`rgb(${i},${n},${o})`}function wt(l){if(typeof l=="number"){if(ul==null)throw new Error(`color(${l}) is invalid because no custom color palette is defined.`);const t=ul[l];if(t==null)throw new Error(`color(${l}) is out of bounds for the current color palette (length: ${ul.length}).`);return t}if(cl==null)throw new Error(`color("${l}") was used before the color system was initialized.`);const e=cl[l];if(e==null)throw new Error(`Unknown color "${l}". Supported colors: ${yl.join(", ")}.`);return e}const Ti=`
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
`;function Oi(l,e){return new PIXI.Filter(void 0,Ti,{width:l,height:e})}const M=new w;let O,Y,x,I=new w;const bt=5;document.createElement("img");let R,Ol,Il=1,Re="black",U,St,Sl=!1,b,Ct;function Ii(l,e,t,i,n,o,r,c){M.set(l),b=c,Re=t;const d=`
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
`,y=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=d,I.set(M),b.isUsingPixi){I.mul(bt);const h=new PIXI.Application({width:I.x,height:I.y});if(O=h.view,x=new PIXI.Graphics,x.scale.x=x.scale.y=bt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,h.stage.addChild(x),x.filters=[],b.name==="crt"&&x.filters.push(Ct=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),b.name==="pixel"&&x.filters.push(Oi(I.x,I.y)),b.name==="pixel"||b.name==="shapeDark"){const m=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:b.name==="pixel"?1.5:1,brightness:b.name==="pixel"?1.5:1,blur:8});x.filters.push(m)}x.lineStyle(0),O.style.cssText=f}else O=document.createElement("canvas"),O.width=I.x,O.height=I.y,Y=O.getContext("2d"),Y.imageSmoothingEnabled=!1,O.style.cssText=f+y;document.body.appendChild(O);const p=()=>{const m=innerWidth/innerHeight,P=I.x/I.y,C=m<P,k=C?.95*innerWidth:.95*innerHeight*P,T=C?.95*innerWidth/P:.95*innerHeight;O.style.width=`${k}px`,O.style.height=`${T}px`};if(window.addEventListener("resize",p),p(),i){R=document.createElement("canvas");let h;n?(R.width=I.x,R.height=I.y,h=o):(I.x<=I.y*2?(R.width=I.y*2,R.height=I.y):(R.width=I.x,R.height=I.x/2),R.width>400&&(Il=400/R.width,R.width=400,R.height*=Il),h=Math.round(400/R.width)),Ol=R.getContext("2d"),Ol.fillStyle=e,gcc.setOptions({scale:h,capturingFps:60,isSmoothingEnabled:!1,durationSec:r})}}function Fl(){if(b.isUsingPixi){x.clear(),x.beginFill(wl(Re,b.isDarkColor?.15:1)),x.drawRect(0,0,M.x,M.y),x.endFill(),x.beginFill(wl(U)),Sl=!0;return}Y.fillStyle=bl(Re,b.isDarkColor?.15:1),Y.fillRect(0,0,M.x,M.y),Y.fillStyle=bl(U)}function N(l){if(l===U){b.isUsingPixi&&!Sl&&Yl(wl(U));return}if(U=l,b.isUsingPixi){Sl&&x.endFill(),Yl(wl(U));return}Y.fillStyle=bl(l)}function Yl(l){Ql(),x.beginFill(l),Sl=!0}function Ql(){Sl&&(x.endFill(),Sl=!1)}function Zl(){St=U}function $l(){N(St)}function Cl(l,e,t,i){if(b.isUsingPixi){b.name==="shape"||b.name==="shapeDark"?x.drawRoundedRect(l,e,t,i,2):x.drawRect(l,e,t,i);return}Y.fillRect(l,e,t,i)}function Fi(l,e,t,i,n){const o=wl(U);Yl(o),x.drawCircle(l,e,n*.5),x.drawCircle(t,i,n*.5),Ql(),x.lineStyle(n,o),x.moveTo(l,e),x.lineTo(t,i),x.lineStyle(0)}function ki(){Ct.time+=.2}function Di(){if(Ol.fillRect(0,0,R.width,R.height),Il===1)Ol.drawImage(O,(R.width-O.width)/2,(R.height-O.height)/2);else{const l=O.width*Il,e=O.height*Il;Ol.drawImage(O,(R.width-l)/2,(R.height-e)/2,l,e)}gcc.capture(R)}const vt=[`
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

`],Ai=[`
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

`];let vl,le;function Li(){vl=[],le=[]}function xt(){vl=vl.concat(le),le=[]}function Et(l){let e={isColliding:{rect:{},text:{},char:{}}};return vl.forEach(t=>{Ui(l,t)&&(e=Object.assign(Object.assign(Object.assign({},e),Te(t.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},e.isColliding.rect),t.collision.isColliding.rect),text:Object.assign(Object.assign({},e.isColliding.text),t.collision.isColliding.text),char:Object.assign(Object.assign({},e.isColliding.char),t.collision.isColliding.char)}}))}),e}function Ui(l,e){const t=e.pos.x-l.pos.x,i=e.pos.y-l.pos.y;return-e.size.x<t&&t<l.size.x&&-e.size.y<i&&i<l.size.y}function Te(l){if(l==null)return{};const e={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let t={};return L(l).forEach(([i,n])=>{const o=e[i];n&&o!=null&&(t[o]=!0)}),t}function Pt(l,e,t,i){return Mt(!1,l,e,t,i)}function zi(l,e,t,i){return Mt(!0,l,e,t,i)}function Mt(l,e,t,i,n){if(typeof t=="number"){if(typeof i=="number")return H(e,t,i,Object.assign({isCharacter:l,isCheckingCollision:!0,color:U},n));throw new Error(`${l?"char":"text"}(): expected numeric y when x is a number.`)}else return H(e,t.x,t.y,Object.assign({isCharacter:l,isCheckingCollision:!0,color:U},i))}const kl=6,Bi=4,G=1,v=kl*G,sl=Bi*G;let Oe,Ie,ee,Fe,ke=!1,xl,De,Dl,te;const Ae={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function ji(){xl=document.createElement("canvas"),xl.width=xl.height=v,De=xl.getContext("2d"),Dl=document.createElement("canvas"),te=Dl.getContext("2d"),Oe=vt.map((l,e)=>ie(l,String.fromCharCode(33+e),!1)),Ie=Ai.map((l,e)=>ie(l,String.fromCharCode(33+e),!1)),ee=vt.map((l,e)=>ie(l,String.fromCharCode(33+e),!0)),Fe={}}function _i(l,e){const t=e.charCodeAt(0)-33;l.forEach((i,n)=>{ee[t+n]=ie(i,String.fromCharCode(33+t+n),!0)})}function Ni(){ke=!0}function H(l,e,t,i={}){const n=Ot(i);let o=l,r=e,c=t,d,f={isColliding:{rect:{},text:{},char:{}}};const y=n.isSmallText?sl:v;for(let p=0;p<o.length;p++){if(p===0){const P=o.charCodeAt(0);if(P<33||P>126)r=Math.floor(r-v/2*n.scale.x),c=Math.floor(c-v/2*n.scale.y);else{const C=P-33,k=n.isCharacter?ee[C]:n.isSmallText?Ie[C]:Oe[C];r=Math.floor(r-k.size.x/2*n.scale.x),c=Math.floor(c-k.size.y/2*n.scale.y)}d=r}const h=o[p];if(h===`
`){r=d,c+=v*n.scale.y;continue}const m=Ki(h,r,c,n);n.isCheckingCollision&&(f={isColliding:{rect:Object.assign(Object.assign({},f.isColliding.rect),m.isColliding.rect),text:Object.assign(Object.assign({},f.isColliding.text),m.isColliding.text),char:Object.assign(Object.assign({},f.isColliding.char),m.isColliding.char)}}),r+=y*n.scale.x}return f}function Ki(l,e,t,i){const n=l.charCodeAt(0);if(n<32||n>126)return{isColliding:{rect:{},text:{},char:{}}};const o=Ot(i);if(o.backgroundColor!=="transparent"){const T=o.isSmallText?sl:v,xe=o.isSmallText?2:1;Zl(),N(o.backgroundColor),Cl(e+xe,t,T*o.scale.x,v*o.scale.y),$l()}if(n<=32)return{isColliding:{rect:{},text:{},char:{}}};const r=n-33,c=o.isCharacter?ee[r]:o.isSmallText?Ie[r]:Oe[r],d=D(o.rotation,0,4);if(o.color==="black"&&d===0&&o.mirror.x===1&&o.mirror.y===1&&o.edgeColor==null&&(!b.isUsingPixi||o.scale.x===1&&o.scale.y===1))return Le(c,e,t,o.scale,o.isCheckingCollision,!0);const f=JSON.stringify({c:l,options:o}),y=Fe[f];if(y!=null)return Le(y,e,t,o.scale,o.isCheckingCollision,o.color!=="transparent");let p=!1;const h=new w(v,v);let m=xl,P=De;if(c.size.x>v||c.size.y>v){if(d===0||d===2)h.set(c.size.x,c.size.y);else{const T=Math.max(c.size.x,c.size.y);h.set(T,T)}m=document.createElement("canvas"),m.width=h.x,m.height=h.y,P=m.getContext("2d"),P.imageSmoothingEnabled=!1}b.isUsingPixi&&(o.scale.x!==1||o.scale.y!==1)&&(Dl.width=h.x*o.scale.x,Dl.height=h.y*o.scale.y,te.imageSmoothingEnabled=!1,te.scale(o.scale.x,o.scale.y),Rt(te,d,o,c.image,h),p=!0),P.clearRect(0,0,h.x,h.y),Rt(P,d,o,c.image,h);const C=Ue(P,h,l,o.isCharacter);o.edgeColor!=null&&(m=Vi(P,h,o.edgeColor),h.x+=2,h.y+=2);let k;if(ke||b.isUsingPixi){const T=document.createElement("img");if(T.src=m.toDataURL(),b.isUsingPixi){const xe=document.createElement("img");xe.src=(p?Dl:m).toDataURL(),k=PIXI.Texture.from(xe)}ke&&(Fe[f]={image:T,texture:k,hitBox:C,size:h})}return Le({image:m,texture:k,hitBox:C,size:h},e,t,o.scale,o.isCheckingCollision,o.color!=="transparent")}function Vi(l,e,t){const i=e.x+2,n=e.y+2,o=[[0,-1],[1,0],[0,1],[-1,0]],r=document.createElement("canvas");r.width=i,r.height=n;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(l.canvas,1,1);const f=c.getImageData(0,0,i,n).data;c.fillStyle=bl(t);for(let y=0;y<n;y++)for(let p=0;p<i;p++){const h=(y*i+p)*4;if(f[h+3]===0)for(const[m,P]of o){const C=p+m,k=y+P;if(C>=0&&C<i&&k>=0&&k<n){const T=(k*i+C)*4;if(f[T+3]>0){c.fillRect(p,y,1,1);break}}}}return r}function Rt(l,e,t,i,n){e===0&&t.mirror.x===1&&t.mirror.y===1?l.drawImage(i,0,0):(l.save(),l.translate(n.x/2,n.y/2),l.rotate(Math.PI/2*e),(t.mirror.x===-1||t.mirror.y===-1)&&l.scale(t.mirror.x,t.mirror.y),l.drawImage(i,-n.x/2,-n.y/2),l.restore()),t.color!=="black"&&(l.globalCompositeOperation="source-in",l.fillStyle=bl(t.color==="transparent"?"black":t.color),l.fillRect(0,0,n.x,n.y),l.globalCompositeOperation="source-over")}function Le(l,e,t,i,n,o){if(o&&(i.x===1&&i.y===1?Tt(l,e,t):Tt(l,e,t,l.size.x*i.x,l.size.y*i.y)),!n)return;const r={pos:{x:e+l.hitBox.pos.x*i.x,y:t+l.hitBox.pos.y*i.y},size:{x:l.hitBox.size.x*i.x,y:l.hitBox.size.y*i.y},collision:l.hitBox.collision},c=Et(r);return o&&vl.push(r),c}function Tt(l,e,t,i,n){if(b.isUsingPixi){Ql(),x.beginTextureFill({texture:l.texture,matrix:new PIXI.Matrix().translate(e,t)}),x.drawRect(e,t,i??l.size.x,n??l.size.y),Yl(wl(U));return}i==null?Y.drawImage(l.image,e,t):Y.drawImage(l.image,e,t,i,n)}function ie(l,e,t){if(l.indexOf(".")>=0||l.indexOf("data:image/")==0)return Ji(l,e);let i=l.split(`
`);i=i.slice(1,i.length-1);let n=0;i.forEach(m=>{n=Math.max(m.length,n)});const o=Math.max(Math.ceil((kl-n)/2),0),r=i.length,c=Math.max(Math.ceil((kl-r)/2),0),d=new w(Math.max(kl,n)*G,Math.max(kl,r)*G);let f=xl,y=De;(d.x>v||d.y>v)&&(f=document.createElement("canvas"),f.width=d.x,f.height=d.y,y=f.getContext("2d"),y.imageSmoothingEnabled=!1),y.clearRect(0,0,d.x,d.y),i.forEach((m,P)=>{for(let C=0;C<n;C++){const k=m.charAt(C);let T=xi.indexOf(k);k!==""&&T>=1&&(y.fillStyle=bl(yl[T]),y.fillRect((C+o)*G,(P+c)*G,G,G))}});const p=document.createElement("img");p.src=f.toDataURL();const h=Ue(y,d,e,t);return b.isUsingPixi?{image:p,texture:PIXI.Texture.from(p),size:d,hitBox:h}:{image:p,size:d,hitBox:h}}function Ji(l,e){const t=document.createElement("img");t.src=l;const i=new w,n={pos:new w,size:new w,collision:{isColliding:{char:{},text:{}}}};let o;return b.isUsingPixi?o={image:t,texture:PIXI.Texture.from(t),size:new w,hitBox:n}:o={image:t,size:i,hitBox:n},t.onload=()=>{o.size.set(t.width*G,t.height*G);const r=document.createElement("canvas");r.width=o.size.x,r.height=o.size.y;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(t,0,0,o.size.x,o.size.y);const d=document.createElement("img");d.src=r.toDataURL(),o.image=d,o.hitBox=Ue(c,o.size,e,!0),b.isUsingPixi&&(o.texture=PIXI.Texture.from(d))},o}function Ue(l,e,t,i){const n={pos:new w(v,v),size:new w,collision:{isColliding:{char:{},text:{}}}};i?n.collision.isColliding.char[t]=!0:n.collision.isColliding.text[t]=!0;const o=l.getImageData(0,0,e.x,e.y).data;let r=0;for(let c=0;c<e.y;c++)for(let d=0;d<e.x;d++)o[r+3]>0&&(d<n.pos.x&&(n.pos.x=d),c<n.pos.y&&(n.pos.y=c)),r+=4;r=0;for(let c=0;c<e.y;c++)for(let d=0;d<e.x;d++)o[r+3]>0&&(d>n.pos.x+n.size.x-1&&(n.size.x=d-n.pos.x+1),c>n.pos.y+n.size.y-1&&(n.size.y=c-n.pos.y+1)),r+=4;return n}function Ot(l){let e=Object.assign(Object.assign({},Ae),l);return l.scale!=null&&(e.scale=Object.assign(Object.assign({},Ae.scale),l.scale)),l.mirror!=null&&(e.mirror=Object.assign(Object.assign({},Ae.mirror),l.mirror)),e}let El=!1,ne=!1,ze=!1;const It=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Be;const Gi={onKeyDown:void 0};let je,_e=!1,Ne=!1,Ke=!1,Ve={},Je={},Ge={};function Ft(l){je=Object.assign(Object.assign({},Gi),l),Be=_(It.map(e=>[e,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",e=>{_e=Ne=!0,Ve[e.code]=Je[e.code]=!0,je.onKeyDown!=null&&je.onKeyDown(),(e.code==="AltLeft"||e.code==="AltRight"||e.code==="ArrowRight"||e.code==="ArrowDown"||e.code==="ArrowLeft"||e.code==="ArrowUp")&&e.preventDefault()}),document.addEventListener("keyup",e=>{_e=!1,Ke=!0,Ve[e.code]=!1,Ge[e.code]=!0})}function kt(){ne=!El&&Ne,ze=El&&Ke,Ne=Ke=!1,El=_e,L(Be).forEach(([l,e])=>{e.isJustPressed=!e.isPressed&&Je[l],e.isJustReleased=e.isPressed&&Ge[l],e.isPressed=!!Ve[l]}),Je={},Ge={}}function Dt(){ne=!1,El=!0}var Hi=Object.freeze({__proto__:null,clearJustPressed:Dt,get code(){return Be},codes:It,init:Ft,get isJustPressed(){return ne},get isJustReleased(){return ze},get isPressed(){return El},update:kt});class Al{constructor(e=null){this.setSeed(e)}get(e=1,t){return t==null&&(t=e,e=0),this.next()/4294967295*(t-e)+e}getInt(e,t){t==null&&(t=e,e=0);const i=Math.floor(e),n=Math.floor(t);return n===i?i:this.next()%(n-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(e){return e[this.getInt(e.length)]}setSeed(e,t=123456789,i=362436069,n=521288629,o=32){this.w=e!=null?e>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=t>>>0,this.y=i>>>0,this.z=n>>>0;for(let r=0;r<o;r++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const e=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(e^e>>>8))>>>0,this.w}}const Ll=new w;let Q=!1,Pl=!1,Ul=!1,qi={isDebugMode:!1,anchor:new w,padding:new w,onPointerDownOrUp:void 0},j,K,A;const zl=new Al,dl=new w,Z=new w;let Bl=!1,jl=new w,He=!1,qe=!1,We=!1;function At(l,e,t){A=Object.assign(Object.assign({},qi),t),j=l,K=new w(e.x+A.padding.x*2,e.y+A.padding.y*2),jl.set(j.offsetLeft+j.clientWidth*(.5-A.anchor.x),j.offsetTop+j.clientWidth*(.5-A.anchor.y)),A.isDebugMode&&dl.set(j.offsetLeft+j.clientWidth*(.5-A.anchor.x),j.offsetTop+j.clientWidth*(.5-A.anchor.y)),document.addEventListener("mousedown",i=>{zt(i.pageX,i.pageY)}),document.addEventListener("touchstart",i=>{zt(i.touches[0].pageX,i.touches[0].pageY)}),document.addEventListener("mousemove",i=>{Bt(i.pageX,i.pageY)}),document.addEventListener("touchmove",i=>{i.preventDefault(),Bt(i.touches[0].pageX,i.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",i=>{jt()}),document.addEventListener("touchend",i=>{i.preventDefault(),i.target.click(),jt()},{passive:!1})}function Lt(){Wi(jl.x,jl.y,Ll),A.isDebugMode&&!Ll.isInRect(0,0,K.x,K.y)?(Xi(),Ll.set(dl),Pl=!Q&&Bl,Ul=Q&&!Bl,Q=Bl):(Pl=!Q&&qe,Ul=Q&&We,Q=He),qe=We=!1}function Ut(){Pl=!1,Q=!0}function Wi(l,e,t){j!=null&&(t.x=Math.round(((l-j.offsetLeft)/j.clientWidth+A.anchor.x)*K.x-A.padding.x),t.y=Math.round(((e-j.offsetTop)/j.clientHeight+A.anchor.y)*K.y-A.padding.y))}function Xi(){Z.length>0?(dl.add(Z),!z(dl.x,-K.x*.1,K.x*1.1)&&dl.x*Z.x>0&&(Z.x*=-1),!z(dl.y,-K.y*.1,K.y*1.1)&&dl.y*Z.y>0&&(Z.y*=-1),zl.get()<.05&&Z.set(0)):zl.get()<.1&&(Z.set(0),Z.addWithAngle(zl.get(Math.PI*2),(K.x+K.y)*zl.get(.01,.03))),zl.get()<.05&&(Bl=!Bl)}function zt(l,e){jl.set(l,e),He=qe=!0,A.onPointerDownOrUp!=null&&A.onPointerDownOrUp()}function Bt(l,e){jl.set(l,e)}function jt(l){He=!1,We=!0,A.onPointerDownOrUp!=null&&A.onPointerDownOrUp()}var Yi=Object.freeze({__proto__:null,clearJustPressed:Ut,init:At,get isJustPressed(){return Pl},get isJustReleased(){return Ul},get isPressed(){return Q},pos:Ll,update:Lt});let $=new w,ll=!1,q=!1,ol=!1;function _t(l){Ft({onKeyDown:l}),At(O,M,{onPointerDownOrUp:l,anchor:new w(.5,.5)})}function Nt(){kt(),Lt(),$=Ll,ll=El||Q,q=ne||Pl,ol=ze||Ul}function Kt(){Dt(),Ut()}function _l(l){$.set(l.pos),ll=l.isPressed,q=l.isJustPressed,ol=l.isJustReleased}var Qi=Object.freeze({__proto__:null,clearJustPressed:Kt,init:_t,get isJustPressed(){return q},get isJustReleased(){return ol},get isPressed(){return ll},get pos(){return $},set:_l,update:Nt});const Zi={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"};let F,se=!1,rl,Nl,Xe=!1,oe;s.algoChipSession=void 0;let Ye,Vt,Qe={},Jt,el=!1,re,Ze,Ml=!1,$e=!1,Kl,Gt,lt,tl={},ae,et;async function $i(l){if(rl=l.audioSeed,Nl=l.audioVolume,ae=l.bgmName,et=l.bgmVolume,typeof AlgoChip<"u"&&AlgoChip!==null&&typeof AlgoChipUtil<"u"&&AlgoChipUtil!==null?Xe=se=!0:typeof sss<"u"&&sss!==null&&(el=se=!0),typeof audioFiles<"u"&&audioFiles!=null&&(Ml=se=!0),!se)return!1;if(F=new(window.AudioContext||window.webkitAudioContext),Ml){document.addEventListener("visibilitychange",()=>{document.hidden?F.suspend():F.resume()}),an(),Xt(.1*Nl),Wt(l.audioTempo);for(let e in audioFiles){const t=cn(e,audioFiles[e]);e===ae&&(t.isLooping=!0,$e=!0)}}return Xe&&(oe=F.createGain(),oe.connect(F.destination),s.algoChipSession=AlgoChipUtil.createAudioSession({audioContext:F,gainNode:oe,workletBasePath:"https://abagames.github.io/algo-chip/worklets/"}),await s.algoChipSession.ensureReady(),s.algoChipSession.setBgmVolume(.5*Nl),Jt=AlgoChipUtil.createVisibilityController(s.algoChipSession)),el&&(re=F.createGain(),re.connect(F.destination),sss.init(rl,F,re),sss.setVolume(.1*Nl),sss.setTempo(l.audioTempo)),!0}function ln(l,e){if(!(Ml&&Ht(l,e!=null&&e.volume!=null?e.volume:1)))if(s.algoChipSession!=null){let t=l,i=rl;t==="powerUp"?t="powerup":(t==="random"||t==="lucky")&&(t="explosion",i++);let n;e?.freq!=null?n=e.freq:e?.pitch!=null&&(n=2**((e.pitch-69)/12)*440);const o={seed:i,type:t,baseFrequency:n},r=JSON.stringify(o);Qe[r]==null&&(Qe[r]=s.algoChipSession.generateSe(o)),s.algoChipSession.playSe(Qe[r],{volume:Nl*(e?.volume!=null?e?.volume:1)*.7,duckingDb:-8,quantize:{loopAware:!0,phase:"next",quantizeTo:"half_beat",fallbackTempo:120}})}else el&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(l,e):el&&sss.play(Zi[l])}function en(l){rl=l,el&&sss.setSeed(l)}async function tt(){if(!($e&&Ht(ae,et)))if(s.algoChipSession!=null){if(Ye==null||Vt!=rl){Vt=rl;const l=new Al;l.setSeed(rl);const e=l.get(-.9,.9),t=l.get(-.9,.9);Ye=await s.algoChipSession.generateBgm({seed:rl,lengthInMeasures:32,twoAxisStyle:{calmEnergetic:e,percussiveMelodic:t},overrides:{tempo:"medium"}})}s.algoChipSession.playBgm(Ye,{loop:!0})}else el&&typeof sss.generateMml=="function"?Ze=sss.playMml(sss.generateMml(),{volume:et}):el&&sss.playBgm()}function Vl(){$e?qt(ae):s.algoChipSession!=null?s.algoChipSession.stopBgm():Ze!=null?sss.stopMml(Ze):el&&sss.stopBgm()}function tn(){Ml&&on(),el&&sss.update()}function nn(){F?.resume(),s.algoChipSession!=null&&s.algoChipSession.resumeAudioContext()}function sn(){Ml&&rn(),Xe&&(Jt(),s.algoChipSession!=null&&s.algoChipSession.close())}function Ht(l,e=1){const t=tl[l];return t==null?!1:(t.gainNode.gain.value=e,t.isPlaying=!0,!0)}function on(){const l=F.currentTime;for(const e in tl){const t=tl[e];if(!t.isReady||!t.isPlaying)continue;t.isPlaying=!1;const i=hn(l);(t.playedTime==null||i>t.playedTime)&&(dn(t,i),t.playedTime=i)}}function qt(l,e=void 0){const t=tl[l];t.source!=null&&(e==null?t.source.stop():t.source.stop(e),t.source=void 0)}function rn(l=void 0){if(tl){for(const e in tl)qt(e,l);tl={}}}function an(){Ml=!0,Kl=F.createGain(),Kl.connect(F.destination),Wt(),un(),Xt()}function cn(l,e){return tl[l]=fn(e),tl[l]}function Wt(l=120){Gt=60/l}function un(l=8){lt=l>0?4/l:void 0}function Xt(l=.1){Kl.gain.value=l}function dn(l,e){const t=F.createBufferSource();l.source=t,t.buffer=l.buffer,t.loop=l.isLooping,t.start=t.start||t.noteOn,t.connect(l.gainNode),t.start(e)}function fn(l){const e={buffer:void 0,source:void 0,gainNode:F.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return e.gainNode.connect(Kl),gn(l).then(t=>{e.buffer=t,e.isReady=!0}),e}async function gn(l){const t=await(await fetch(l)).arrayBuffer();return await F.decodeAudioData(t)}function hn(l){if(lt==null)return l;const e=Gt*lt;return e>0?Math.ceil(l/e)*e:l}let Yt,Qt;const Zt=68,it=1e3/Zt;let Jl=0,$t=10,ce,li;async function mn(l,e,t){Yt=l,Qt=e,li=t,await Yt(),ei()}function ei(){ce=requestAnimationFrame(ei);const l=window.performance.now();l<Jl-Zt/12||(Jl+=it,(Jl<l||Jl>l+it*2)&&(Jl=l+it),tn(),Nt(),Qt(),li&&Di(),$t--,$t===0&&Ni())}function pn(){ce&&(cancelAnimationFrame(ce),ce=void 0)}let ue;const de=new Al;function nt(){ue=[]}function ti(l,e=16,t=1,i=0,n=Math.PI*2,o=void 0){if(e<1){if(de.get()>e)return;e=1}for(let r=0;r<e;r++){const c=i+de.get(n)-n/2,d={pos:new w(l),vel:new w(t*de.get(.5,1),0).rotate(c),color:U,ticks:E(de.get(10,20)*Math.sqrt(Math.abs(t)),10,60),edgeColor:o};ue.push(d)}}function fe(){Zl(),ue=ue.filter(l=>{if(l.ticks--,l.ticks<0)return!1;l.pos.add(l.vel),l.vel.mul(.98);const e=Math.floor(l.pos.x),t=Math.floor(l.pos.y);return l.edgeColor!=null&&(N(l.edgeColor),Cl(e-1,t-1,3,3)),N(l.color),Cl(e,t,1,1),!0}),$l()}function st(l,e,t,i){return ii(!1,l,e,t,i,"rect")}function yn(l,e,t,i){return ii(!0,l,e,t,i,"box")}function wn(l,e,t,i,n=.5,o=.5){typeof l!="number"&&(o=n,n=i,i=t,t=e,e=l.y,l=l.x);const r=new w(t).rotate(n),c=new w(l-r.x*o,e-r.y*o);return rt(c,r,i)}function bn(l,e,t=3,i=3,n=3){const o=new w,r=new w;return typeof l=="number"?typeof e=="number"?typeof t=="number"?(o.set(l,e),r.set(t,i)):(o.set(l,e),r.set(t),n=i):ot("when x1 is a number, y1 must also be a number."):typeof e=="number"?typeof t=="number"?(o.set(l),r.set(e,t),n=i):ot("when x1 is a Vector and y1 is a number, x2 must be a number representing the new y-coordinate."):typeof t=="number"?(o.set(l),r.set(e),n=t):ot("when both endpoints are Vectors, the last argument must be the thickness (number)."),rt(o,r.sub(o),n)}function Sn(l,e,t,i,n,o){let r=new w;typeof l=="number"?r.set(l,e):(r.set(l),o=n,n=i,i=t,t=e),i==null&&(i=3),n==null&&(n=0),o==null&&(o=Math.PI*2);let c,d;if(n>o?(c=o,d=n-o):(c=n,d=o-n),d=E(d,0,Math.PI*2),d<.01)return;const f=E(Math.ceil(d*Math.sqrt(t*.25)),1,36),y=d/f;let p=c,h=new w(t).rotate(p).add(r),m=new w,P=new w,C={isColliding:{rect:{},text:{},char:{}}};for(let k=0;k<f;k++){p+=y,m.set(t).rotate(p).add(r),P.set(m).sub(h);const T=rt(h,P,i,!0);C=Object.assign(Object.assign(Object.assign({},C),Te(T.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},C.isColliding.rect),T.isColliding.rect),text:Object.assign(Object.assign({},C.isColliding.text),T.isColliding.text),char:Object.assign(Object.assign({},C.isColliding.char),T.isColliding.char)}}),h.set(m)}return xt(),C}function ii(l,e,t,i,n,o="rect"){if(typeof e=="number"){if(typeof t=="number")return typeof i=="number"?n==null?fl(l,e,t,i,i):fl(l,e,t,i,n):fl(l,e,t,i.x,i.y);ni(o,"when x is a number, y must also be a number.")}else if(typeof t=="number"){if(i==null)return fl(l,e.x,e.y,t,t);if(typeof i=="number")return fl(l,e.x,e.y,t,i);ni(o,"when x is a Vector and y is a number, width must be a number.")}else return fl(l,e.x,e.y,t.x,t.y)}function ot(l){throw new Error(`line(): ${l}`)}function ni(l,e){throw new Error(`${l}(): ${e}`)}function rt(l,e,t,i=!1){let n=!0;(b.name==="shape"||b.name==="shapeDark")&&(U!=="transparent"&&Fi(l.x,l.y,l.x+e.x,l.y+e.y,t),n=!1);const o=Math.floor(E(t,3,10)),r=Math.abs(e.x),c=Math.abs(e.y),d=E(Math.ceil(r>c?r/o:c/o)+1,3,99);e.div(d-1);let f={isColliding:{rect:{},text:{},char:{}}};for(let y=0;y<d;y++){const p=fl(!0,l.x,l.y,t,t,!0,n);f=Object.assign(Object.assign(Object.assign({},f),Te(p.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},f.isColliding.rect),p.isColliding.rect),text:Object.assign(Object.assign({},f.isColliding.text),p.isColliding.text),char:Object.assign(Object.assign({},f.isColliding.char),p.isColliding.char)}}),l.add(e)}return i||xt(),f}function fl(l,e,t,i,n,o=!1,r=!0){let c=r;(b.name==="shape"||b.name==="shapeDark")&&c&&U!=="transparent"&&(l?Cl(e-i/2,t-n/2,i,n):Cl(e,t,i,n),c=!1);let d=l?{x:Math.floor(e-i/2),y:Math.floor(t-n/2)}:{x:Math.floor(e),y:Math.floor(t)};const f={x:Math.trunc(i),y:Math.trunc(n)};if(f.x===0||f.y===0)return{isColliding:{rect:{},text:{},char:{}}};f.x<0&&(d.x+=f.x,f.x*=-1),f.y<0&&(d.y+=f.y,f.y*=-1);const y={pos:d,size:f,collision:{isColliding:{rect:{}}}};y.collision.isColliding.rect[U]=!0;const p=Et(y);return U!=="transparent"&&((o?le:vl).push(y),c&&Cl(d.x,d.y,f.x,f.y)),p}function at({pos:l,size:e,text:t,isToggle:i=!1,onClick:n=()=>{},isSmallText:o=!0}){return{pos:l,size:e,text:t,isToggle:i,onClick:n,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:o}}function ct(l){const e=new w($).sub(l.pos);l.isHovered=e.isInRect(0,0,l.size.x,l.size.y),l.isHovered&&Pl&&(l.isPressed=!0),l.isPressed&&!l.isHovered&&(l.isPressed=!1),l.isPressed&&Ul&&(l.onClick(),l.isPressed=!1,l.isToggle&&(l.toggleGroup.length===0?l.isSelected=!l.isSelected:(l.toggleGroup.forEach(t=>{t.isSelected=!1}),l.isSelected=!0))),ge(l)}function ge(l){Zl(),N(l.isPressed?"blue":"light_blue"),st(l.pos.x,l.pos.y,l.size.x,l.size.y),l.isToggle&&!l.isSelected&&(N("white"),st(l.pos.x+1,l.pos.y+1,l.size.x-2,l.size.y-2)),N(l.isHovered?"black":"blue"),Pt(l.text,l.pos.x+3,l.pos.y+3,{isSmallText:l.isSmallText}),$l()}let W,Gl,gl,ut;function Cn(l){W={randomSeed:l,inputs:[]}}function vn(l){W.inputs.push(l)}function si(){return W!=null}function xn(l){Gl=0,l.setSeed(W.randomSeed)}function En(){Gl>=W.inputs.length||(_l(W.inputs[Gl]),Gl++)}function Pn(){gl=[]}function Mn(l,e,t){gl.push({randomState:t.getState(),gameState:cloneDeep(l),baseState:cloneDeep(e)})}function Rn(l){const e=gl.pop(),t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),ut={pos:new w($),isPressed:ll,isJustPressed:q,isJustReleased:ol},_l(W.inputs.pop()),e}function Tn(l){const e=gl[gl.length-1],t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),ut={pos:new w($),isPressed:ll,isJustPressed:q,isJustReleased:ol},_l(W.inputs[W.inputs.length-1]),e}function On(){_l(ut)}function In(){return gl.length===0}function Fn(){const l=Gl-1;if(!(l>=W.inputs.length))return gl[l]}const dt=4,kn=60,Dn="video/webm;codecs=vp8,opus",An="video/webm",Ln="recording.webm",Un=1e5*dt,zn=.7;let V,he;function Bn(l,e,t,i){if(V!=null)return;const n=document.createElement("canvas");n.width=i.x*dt,n.height=i.y*dt;const o=n.getContext("2d");o.imageSmoothingEnabled=!1;const r=()=>{o.drawImage(l,0,0,l.width,l.height,0,0,n.width,n.height),he=requestAnimationFrame(r)};r();const c=n.captureStream(kn),d=e.createMediaStreamDestination(),f=e.createGain();f.gain.value=zn,t.forEach(m=>{m?.connect(f)}),f.connect(d);const y=d.stream,p=new MediaStream([...c.getVideoTracks(),...y.getAudioTracks()]);V=new MediaRecorder(p,{mimeType:Dn,videoBitsPerSecond:Un});let h=[];V.ondataavailable=m=>{m.data.size>0&&h.push(m.data)},V.onstop=()=>{const m=new Blob(h,{type:An}),P=URL.createObjectURL(m),C=document.createElement("a");C.href=P,C.download=Ln,C.click(),URL.revokeObjectURL(P),h=[]},V.start()}function jn(){V!=null&&V.state!=="inactive"&&(V.stop(),V=void 0),he&&(cancelAnimationFrame(he),he=void 0)}function _n(){return V!=null&&V.state==="recording"}const Nn=Math.PI,Kn=Math.abs,Vn=Math.sin,Jn=Math.cos,Gn=Math.atan2,Hn=Math.sqrt,qn=Math.pow,Wn=Math.floor,Xn=Math.round,Yn=Math.ceil,Qn=Math.min,Zn=Math.max;s.ticks=0,s.difficulty=void 0,s.score=0,s.time=void 0,s.isReplaying=!1;function $n(l=1,e){return il.get(l,e)}function ls(l=2,e){return il.getInt(l,e)}function es(l=1,e){return il.get(l,e)*il.getPlusOrMinus()}function ft(l="GAME OVER"){Se=l,a.isShowingTime&&(s.time=void 0),fi()}function ts(l="COMPLETE"){Se=l,fi()}function is(l,e,t){if(s.isReplaying||(s.score+=l,e==null))return;const i=`${l>=1?"+":""}${Math.floor(l)}`;let n=new w;typeof e=="number"?n.set(e,t):n.set(e),n.x-=i.length*(a.isUsingSmallText?sl:v)/2,n.y-=v/2,we.push({str:i,pos:n,vy:-2,ticks:30})}function oi(l){N(l)}function ns(l,e,t,i,n,o){let r=new w;typeof l=="number"?(r.set(l,e),c(r,t,i,n,o)):(r.set(l),c(r,e,t,i,n));function c(d,f,y,p,h){if(Ts(f)){const m=f;ti(d,m.count,m.speed,m.angle,m.angleWidth,m.edgeColor)}else ti(d,f,y,p,h)}}function ri(l,e){return new w(l,e)}function ai(l,e){!ql&&!hl&&ln(l,e)}function ci(){Bn(O,F,[Kl,oe,re],M)}function gt(){jn()}function ss(l){if(ql){const e=Tn(il),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,cloneDeep(e.gameState)}else if(hl){const e=Rn(il),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,e.gameState}else{if(s.isReplaying)return Fn().gameState;if(X==="inGame"){const e={score:s.score,ticks:s.ticks};Mn(l,e,il)}}return l}function os(){hl||(!s.isReplaying&&a.isRewindEnabled?ps():ft())}const me={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},rs=new Al,il=new Al;let X,as={title:hs,inGame:gs,gameOver:ms,rewind:ys,error:ve},Hl=0,pe,ye=!0,a,we,ql=!1,hl=!1,Wl,be,Se,ht,Ce,ml;function cs(l){window.update=l.update,window.title=l.title,window.description=l.description,window.characters=l.characters,window.options=l.options,window.audioFiles=l.audioFiles,ui()}function ui(){typeof options<"u"&&options!=null?a=Object.assign(Object.assign({},me),options):a=me,a.isMinifying&&Is(),mn(ds,fs,a.isCapturing)}function us(){pn(),gt(),sn(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}async function ds(){const l={name:a.theme,isUsingPixi:!1,isDarkColor:!1};a.theme!=="simple"&&a.theme!=="dark"&&(l.isUsingPixi=!0),(a.theme==="pixel"||a.theme==="shapeDark"||a.theme==="crt"||a.theme==="dark")&&(l.isDarkColor=!0);const e=l.isDarkColor?"#101010":"#e0e0e0",t=l.isDarkColor?"blue":"white";Pi(l.isDarkColor,a.colorPalette),Ii(a.viewSize,e,t,a.isCapturing,a.isCapturingGameCanvasOnly,a.captureCanvasScale,a.captureDurationSec,l),_t(()=>{nn()}),ji();let i=a.audioSeed+a.seed;typeof description<"u"&&description!=null&&description.trim().length>0&&(ye=!1,i+=yi(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(ye=!1,document.title=title,i+=yi(title),Ce=`crisp-game-${encodeURIComponent(title)}-${i}`,Hl=Rs()),typeof characters<"u"&&characters!=null&&_i(characters,"a"),a.isSoundEnabled&&(a.isSoundEnabled=await $i({audioSeed:i,audioVolume:a.audioVolume,audioTempo:a.audioTempo,bgmName:a.bgmName,bgmVolume:a.bgmVolume})),N("black"),ye?(mt(),s.ticks=0):di()}function fs(){if(X==="error"){ve();return}s.df=s.difficulty=s.ticks/3600+1,s.tc=s.ticks;const l=s.score,e=s.time;s.sc=s.score;const t=s.sc;s.inp={p:$,ip:ll,ijp:q,ijr:ol},Li();try{as[X]()}catch(i){bs(i);return}b.isUsingPixi&&(Ql(),b.name==="crt"&&ki()),s.ticks++,s.isReplaying?(s.score=l,s.time=e):s.sc!==t&&(s.score=s.sc)}function mt(){X="inGame",s.ticks=-1,nt();const l=Math.floor(s.score);l>Hl&&(Hl=l),a.isShowingTime&&s.time!=null&&(pe==null||pe>s.time)&&(pe=s.time),s.score=0,s.time=0,we=[],a.isPlayingBgm&&a.isSoundEnabled&&tt();const e=rs.getInt(999999999);il.setSeed(e),(a.isReplayEnabled||a.isRewindEnabled)&&(Cn(e),Pn(),s.isReplaying=!1)}function gs(){Fl(),a.isDrawingParticleFront||fe(),a.isDrawingScoreFront||pi(),(a.isReplayEnabled||a.isRewindEnabled)&&vn({pos:ri($),isPressed:ll,isJustPressed:q,isJustReleased:ol}),typeof update=="function"&&update(),a.isDrawingParticleFront&&fe(),a.isDrawingScoreFront&&pi(),pt(),a.isShowingTime&&s.time!=null&&s.time++,a.isRecording&&!_n()&&ci()}function di(){X="title",s.ticks=-1,nt(),Fl(),si()&&(xn(il),s.isReplaying=!0)}function hs(){if(q){mt();return}if(Fl(),a.isReplayEnabled&&si()&&(En(),s.inp={p:$,ip:ll,ijp:q,ijr:ol},a.isDrawingParticleFront||fe(),update(),a.isDrawingParticleFront&&fe()),pt(),typeof title<"u"&&title!=null){let l=0;title.split(`
`).forEach(t=>{t.length>l&&(l=t.length)});const e=Math.floor((M.x-l*v)/2);title.split(`
`).forEach((t,i)=>{H(t,e,Math.floor(M.y*.25)+i*v,{edgeColor:a.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let l=0;description.split(`
`).forEach(i=>{i.length>l&&(l=i.length)});const e=a.isUsingSmallText?sl:v,t=Math.floor((M.x-l*e)/2);description.split(`
`).forEach((i,n)=>{H(i,t,Math.floor(M.y/2)+n*v,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.description})})}}function fi(){X="gameOver",s.isReplaying||Kt(),s.ticks=-1,hi(),a.isPlayingBgm&&a.isSoundEnabled&&Vl();const l=Math.floor(s.score);l>Hl&&Ms(l)}function ms(){s.ticks===0&&!b.isUsingPixi&&hi(),(s.isReplaying||s.ticks>20)&&q?(gi(),mt()):s.ticks===(a.isReplayEnabled?120:300)&&!ye&&(gi(),di())}function gi(){!a.isRecording||s.isReplaying||gt()}function hi(){s.isReplaying||H(Se,Math.floor((M.x-Se.length*v)/2),Math.floor(M.y/2),{edgeColor:a.textEdgeColor.gameOver})}function ps(){X="rewind",ql=!0,Wl=at({pos:{x:M.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:a.isUsingSmallText}),be=at({pos:{x:M.x-39,y:M.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:a.isUsingSmallText}),a.isPlayingBgm&&a.isSoundEnabled&&Vl(),b.isUsingPixi&&(ge(Wl),ge(be))}function ys(){Fl(),update(),pt(),On(),hl?(ge(Wl),(In()||!ll)&&ws()):(ct(Wl),ct(be),Wl.isPressed&&(hl=!0,ql=!1)),be.isPressed&&(ql=hl=!1,ft()),a.isShowingTime&&s.time!=null&&s.time++}function ws(){hl=!1,X="inGame",nt(),a.isPlayingBgm&&a.isSoundEnabled&&tt()}function pt(){if(a.isShowingTime)mi(s.time,3,3),mi(pe,M.x-7*(a.isUsingSmallText?sl:v),3);else if(a.isShowingScore){H(`${Math.floor(s.score)}`,3,3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score});const l=`HI ${Hl}`;H(l,M.x-l.length*(a.isUsingSmallText?sl:v),3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}}function bs(l){if(console.error("Error inside update():",l),X==="error"&&ml!=null){ve();return}ml=vs(l),X="error",Cs(),ve()}function ve(){(ml==null||ml.length===0)&&(ml=["UPDATE ERROR","See console for details."]);const l=a??me,e=l.isUsingSmallText?sl:v,t=ml.length*v,i=Math.max(0,Math.floor((M.y-t)/2));Ss(),Fl(),ml.forEach((n,o)=>{const r=Math.max(0,Math.floor((M.x-n.length*e)/2));H(n,r,i+o*v,{isSmallText:l.isUsingSmallText,edgeColor:l.textEdgeColor.gameOver})})}function Ss(){try{N("black")}catch{}}function Cs(){a?.isPlayingBgm&&a.isSoundEnabled&&typeof Vl=="function"&&Vl()}function vs(l){const e=xs(l),i=["UPDATE ERROR",...Es(e)];return i.push("See console for details."),i}function xs(l){var e,t;if(l instanceof Error){const i=(e=l.message)===null||e===void 0?void 0:e.trim();return l.name&&i&&i.length>0?`${l.name}: ${i}`:(t=i??l.name)!==null&&t!==void 0?t:"Unknown error"}if(typeof l=="string")return l;try{return JSON.stringify(l)}catch{return"Unknown error"}}function Es(l){const t=(a??me).isUsingSmallText?sl:v,i=Math.max(6,Math.floor(M.x/t)-2),n=4,o=l.split(/\r?\n/).map(c=>c.trim()).filter(c=>c.length>0);o.length===0&&o.push("Unknown error");const r=[];return o.forEach(c=>{r.length>=n||r.push(...Ps(c,i,n-r.length))}),r}function Ps(l,e,t){if(l.length<=e)return[l];const i=[];let n=l;for(;n.length>0&&i.length<t;){if(n.length<=e){i.push(n),n="";break}let o=n.lastIndexOf(" ",e);o<=0&&(o=e),i.push(n.slice(0,o).trim()),n=n.slice(o).trim()}return n.length>0&&i.length<t&&i.push(n),i}function mi(l,e,t){if(l==null)return;let i=Math.floor(l*100/50);i>=600*100&&(i=600*100-1);const n=yt(Math.floor(i/6e3),1)+"'"+yt(Math.floor(i%6e3/100),2)+'"'+yt(Math.floor(i%100),2);H(n,e,t,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}function yt(l,e){return("0000"+l).slice(-e)}function pi(){Zl(),N("black"),we=we.filter(l=>(H(l.str,l.pos.x,l.pos.y,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.floatingScore}),l.pos.y+=l.vy,l.vy*=.9,l.ticks--,l.ticks>0)),$l()}function yi(l){let e=0;for(let t=0;t<l.length;t++){const i=l.charCodeAt(t);e=(e<<5)-e+i,e|=0}return e}function Ms(l){if(Ce!=null)try{const e={highScore:l};localStorage.setItem(Ce,JSON.stringify(e))}catch(e){console.warn("Unable to save high score:",e)}}function Rs(){try{const l=localStorage.getItem(Ce);if(l)return JSON.parse(l).highScore}catch(l){console.warn("Unable to load high score:",l)}return 0}function Ts(l){return l!=null&&l.constructor===Object}function Os(){let l=window.location.search.substring(1);if(l=l.replace(/[^A-Za-z0-9_-]/g,""),l.length===0)return;const e=document.createElement("script");ht=`${l}/main.js`,e.setAttribute("src",ht),document.head.appendChild(e)}function Is(){fetch(ht).then(l=>l.text()).then(l=>{const e=Terser.minify(l+"update();",{toplevel:!0}).code,t="function(){",i=e.indexOf(t),n="options={",o=e.indexOf(n);let r=e;if(i>=0)r=e.substring(e.indexOf(t)+t.length,e.length-4);else if(o>=0){let c=1,d;for(let f=o+n.length;f<e.length;f++){const y=e.charAt(f);if(y==="{")c++;else if(y==="}"&&(c--,c===0)){d=f+2;break}}c===0&&(r=e.substring(d))}wi.forEach(([c,d])=>{r=r.split(c).join(d)}),console.log(r),console.log(`${r.length} letters`)})}s.inp=void 0;function Fs(...l){return oi.apply(this,l)}function ks(...l){return ai.apply(this,l)}function Ds(...l){return S.apply(this,l)}function As(...l){return B.apply(this.args)}s.tc=void 0,s.df=void 0,s.sc=void 0;const Ls="transparent",Us="white",zs="red",Bs="green",js="yellow",_s="blue",Ns="purple",Ks="cyan",Vs="black",Js="coin",Gs="laser",Hs="explosion",qs="powerUp",Ws="hit",Xs="jump",Ys="select",Qs="lucky";let wi=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];function Zs(l){}function $s(l){}s.PI=Nn,s.__testInitOptions=$s,s.__testSetReplaying=Zs,s.abs=Kn,s.addGameScript=Os,s.addScore=is,s.addWithCharCode=nl,s.arc=Sn,s.atan2=Gn,s.bar=wn,s.bl=_s,s.box=yn,s.ceil=Yn,s.char=zi,s.clamp=E,s.clr=Fs,s.cn=Js,s.color=oi,s.complete=ts,s.cos=Jn,s.cy=Ks,s.end=ft,s.ex=Hs,s.floor=Wn,s.frameState=ss,s.getButton=at,s.gr=Bs,s.ht=Ws,s.init=cs,s.input=Qi,s.jm=Xs,s.keyboard=Hi,s.lc=Vs,s.line=bn,s.ls=Gs,s.max=Zn,s.min=Qn,s.minifyReplaces=wi,s.onLoad=ui,s.onUnload=us,s.particle=ns,s.play=ai,s.playBgm=tt,s.ply=ks,s.pointer=Yi,s.pow=qn,s.pr=Ns,s.pw=qs,s.range=u,s.rd=zs,s.rect=st,s.remove=B,s.rewind=os,s.rmv=As,s.rnd=$n,s.rndi=ls,s.rnds=es,s.round=Xn,s.setAudioSeed=en,s.sin=Vn,s.sl=Ys,s.sqrt=Hn,s.startRecording=ci,s.stopBgm=Vl,s.stopRecording=gt,s.text=Pt,s.times=S,s.tms=Ds,s.tr=Ls,s.uc=Qs,s.updateButton=ct,s.vec=ri,s.wh=Us,s.wrap=D,s.yl=js})(window||{})),bi}lo();const eo="RICOCHET PINS",to=`
[Tap] Shoot pins
and recoil
`,io=[`
  cc
 c cc
cc  cc
 c cc
  cc
  `,`
r rr r
 rrrr
rrrrrr
 rrrr
r rr r
  `,`
  yy
 yggy
ygggyy
 yggy
  yy
  `],no={isPlayingBgm:!0,isReplayEnabled:!0,seed:1,theme:"dark"},so=.5,oo=.98,ro=1,ao=2,Ee=1,co=5,uo=1,fo=1.2,Ci=100,go=25,ho=1,mo=30,po=.008,yo=.4,wo=.3,bo=.05;let g,al,pl,Pe,Rl,Xl,Tl;function So(){ticks||(g={pos:vec(50,50),vel:vec(so,0),heat:0,isOverheated:!1},Pe=co,Rl=1,al=[],pl=null,vi(),Xl=null,Tl=0),g.pos.add(g.vel),g.vel.mul(oo),g.heat>0&&(g.heat-=ho,g.heat<0&&(g.heat=0)),g.isOverheated&&g.heat<=mo&&(g.isOverheated=!1);const s=ro+g.heat*po,E=3*s;if((g.pos.x<E||g.pos.x>100-E)&&(g.vel.x*=-1,g.pos.clamp(E,100-E,g.pos.y,g.pos.y),play("select")),(g.pos.y<E||g.pos.y>100-E)&&(g.vel.y*=-1,g.pos.clamp(g.pos.x,g.pos.x,E,100-E),play("select")),al.forEach(u=>{if(u.isMoving&&u.vel){u.pos.add(u.vel);const L=3*Ee;u.moveDir==="horizontal"?(u.pos.x<L||u.pos.x>100-L)&&(u.vel.x*=-1,u.pos.clamp(L,100-L,u.pos.y,u.pos.y)):(u.pos.y<L||u.pos.y>100-L)&&(u.vel.y*=-1,u.pos.clamp(u.pos.x,u.pos.x,L,100-L))}const S=3*Ee,B=g.pos.distanceTo(u.pos),_=E+S;B<_&&(play("explosion"),end()),B<_+10&&B>=_&&(color("yellow"),ticks%10<5&&arc(u.pos,12,2)),color(u.isMoving?"purple":"red"),char("b",u.pos,{scale:{x:Ee,y:Ee}}),u.isMoving&&(color("light_purple"),u.moveDir==="horizontal"?line(vec(u.pos.x-8,u.pos.y),vec(u.pos.x+8,u.pos.y),1):line(vec(u.pos.x,u.pos.y-8),vec(u.pos.x,u.pos.y+8),1))}),pl)if(g.pos.distanceTo(pl.pos)<7)play("coin"),particle(pl.pos,{count:15,speed:3}),addScore(10*Rl,g.pos),pl=null,Rl++;else{const S=fo+Math.sin(ticks*.15)*.2;color("black"),char("c",pl.pos,{scale:{x:S,y:S}})}let D,z=1/0;for(const u of al){const S=g.pos.distanceTo(u.pos);S<z&&(z=S,D=u)}if(D&&(color("light_black"),line(g.pos,D.pos,1)),g.isOverheated?(color("red"),ticks%5===0&&particle(g.pos,{count:3,speed:1})):g.heat>75?color("yellow"):g.heat>50?color("light_cyan"):color("cyan"),char("a",g.pos,{scale:{x:s,y:s}}),Tl>0){if(Xl){const u=Tl/5;color("white"),line(g.pos,Xl,5*u),color("yellow"),line(g.pos,Xl,3*u),Tl>=5&&(color("black"),box(g.pos,5*u,5*u))}Tl--}if(input.isJustPressed&&D&&!g.isOverheated){const u=D;play("hit"),Xl=vec(u.pos),Tl=9,particle(g.pos,{count:5,speed:2});const S=vec(u.pos).sub(g.pos);times(5,_=>{const L=(_+1)/6,nl=vec(g.pos).add(S.mul(L));particle(nl,{count:3,speed:1})}),particle(u.pos,{count:20,speed:5}),remove(al,_=>_===u);const B=vec(g.pos).sub(u.pos).normalize();g.vel.add(B.mul(ao)),addScore(Rl,u.pos),g.heat+=go,g.heat>=Ci&&(g.heat=Ci,g.isOverheated=!0,play("click")),al.length===0&&(play("powerUp"),Pe+=uo,vi(),addScore(Pe*Rl*2,50,50))}color("black"),text(`x${Rl}`,3,9,{isSmallText:!0})}function vi(){al=[],times(Pe,()=>{let z=0,u=!1,S;for(;!u&&z<50;)S=vec(rnd(15,85),rnd(15,85)),S.distanceTo(g.pos)>30&&(u=!0),z++;const B=S||vec(rnd(15,85),rnd(15,85)),_=rnd()<yo,L=rnd()<.5?"horizontal":"vertical",nl=wo+difficulty*bo;let J;_?L==="horizontal"?J=vec(rnd()<.5?-nl:nl,0):J=vec(0,rnd()<.5?-nl:nl):J=vec(0,0),al.push({pos:vec(B),isMoving:_,moveDir:L,vel:J})});let s=0,E=!1,D;for(;!E&&s<50;){D=vec(rnd(15,85),rnd(15,85));const z=D.distanceTo(g.pos);let u=!0;al.forEach(S=>{D.distanceTo(S.pos)<15&&(u=!1)}),z>20&&u&&(E=!0),s++}pl={pos:D||vec(rnd(15,85),rnd(15,85))}}init({options:no,title:eo,description:to,characters:io,update:So});
