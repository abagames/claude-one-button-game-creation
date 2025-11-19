(function(){const k=document.createElement("link").relList;if(k&&k.supports&&k.supports("modulepreload"))return;for(const v of document.querySelectorAll('link[rel="modulepreload"]'))W(v);new MutationObserver(v=>{for(const L of v)if(L.type==="childList")for(const ul of L.addedNodes)ul.tagName==="LINK"&&ul.rel==="modulepreload"&&W(ul)}).observe(document,{childList:!0,subtree:!0});function X(v){const L={};return v.integrity&&(L.integrity=v.integrity),v.referrerPolicy&&(L.referrerPolicy=v.referrerPolicy),v.crossOrigin==="use-credentials"?L.credentials="include":v.crossOrigin==="anonymous"?L.credentials="omit":L.credentials="same-origin",L}function W(v){if(v.ep)return;v.ep=!0;const L=X(v);fetch(v.href,L)}})();var vi={},Mi;function oo(){return Mi||(Mi=1,(function(s){function k(l,e=0,t=1){return Math.max(e,Math.min(l,t))}function X(l,e,t){const i=t-e,n=l-e;if(n>=0)return n%i+e;{let o=i+n%i+e;return o>=t&&(o-=i),o}}function W(l,e,t){return e<=l&&l<t}function v(l){return[...Array(l).keys()]}function L(l,e){return v(l).map(t=>e(t))}function ul(l,e){let t=[];for(let i=0,n=0;i<l.length;n++)e(l[i],n)?(t.push(l[i]),l.splice(i,1)):i++;return t}function Yl(l){return[...l].reduce((e,[t,i])=>(e[t]=i,e),{})}function E(l){return Object.keys(l).map(e=>[e,l[e]])}function _(l,e){return String.fromCharCode(l.charCodeAt(0)+e)}function B(l){return l.x!=null&&l.y!=null}class f{constructor(e,t){this.x=0,this.y=0,this.set(e,t)}set(e=0,t=0){return B(e)?(this.x=e.x,this.y=e.y,this):(this.x=e,this.y=t,this)}add(e,t){return B(e)?(this.x+=e.x,this.y+=e.y,this):(this.x+=e,this.y+=t,this)}sub(e,t){return B(e)?(this.x-=e.x,this.y-=e.y,this):(this.x-=e,this.y-=t,this)}mul(e){return this.x*=e,this.y*=e,this}div(e){return this.x/=e,this.y/=e,this}clamp(e,t,i,n){return this.x=k(this.x,e,t),this.y=k(this.y,i,n),this}wrap(e,t,i,n){return this.x=X(this.x,e,t),this.y=X(this.y,i,n),this}addWithAngle(e,t){return this.x+=Math.cos(e)*t,this.y+=Math.sin(e)*t,this}swapXy(){const e=this.x;return this.x=this.y,this.y=e,this}normalize(){return this.div(this.length),this}rotate(e){if(e===0)return this;const t=this.x;return this.x=t*Math.cos(e)-this.y*Math.sin(e),this.y=t*Math.sin(e)+this.y*Math.cos(e),this}angleTo(e,t){return B(e)?Math.atan2(e.y-this.y,e.x-this.x):Math.atan2(t-this.y,e-this.x)}distanceTo(e,t){let i,n;return B(e)?(i=e.x-this.x,n=e.y-this.y):(i=e-this.x,n=t-this.y),Math.sqrt(i*i+n*n)}isInRect(e,t,i,n){return W(this.x,e,e+i)&&W(this.y,t,t+n)}equals(e){return this.x===e.x&&this.y===e.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const Y=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],Oi="twrgybpclRGYBPCL";let dl,fl;const Fi=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function Ii(l,e){const[t,i,n]=Oe(0,l);if(dl=Yl(Y.map((o,r)=>{if(r<1)return[o,{r:0,g:0,b:0,a:0}];if(r<9){const[p,m,g]=Oe(r-1,l);return[o,{r:p,g:m,b:g,a:1}]}const[c,u,d]=Oe(r-9+1,l);return[o,{r:Math.floor(l?c*.5:t-(t-c)*.5),g:Math.floor(l?u*.5:n-(n-u)*.5),b:Math.floor(l?d*.5:i-(i-d)*.5),a:1}]})),l){const o=dl.blue;dl.white={r:Math.floor(o.r*.15),g:Math.floor(o.g*.15),b:Math.floor(o.b*.15),a:1}}e!=null&&Li(e)}function Li(l){fl=l.map(e=>({r:e[0],g:e[1],b:e[2],a:1}));for(let e=0;e<Y.length;e++){let t=1/0,i=-1;for(let n=0;n<fl.length;n++){const o=Ai(fl[n],dl[Y[e]]);o<t&&(t=o,i=n)}dl[Y[e]]=fl[i]}}function Ai(l,e){const t={r:.299,g:.587,b:.114},i=l.r-e.r,n=l.g-e.g,o=l.b-e.b,r=e.r===e.g&&e.g===e.b;let c=Math.sqrt(i*i*t.r+n*n*t.g+o*o*t.b);return r&&!(e.r===0&&e.g===0&&e.b===0)&&(c*=1.5),c}function Oe(l,e){e&&(l===0?l=7:l===7&&(l=0));const t=Fi[l];return[(t&16711680)>>16,(t&65280)>>8,t&255]}function bl(l,e=1){const t=xt(l);return Math.floor(t.r*e)<<16|Math.floor(t.g*e)<<8|Math.floor(t.b*e)}function Sl(l,e=1){const t=xt(l),i=Math.floor(t.r*e),n=Math.floor(t.g*e),o=Math.floor(t.b*e);return t.a<1?`rgba(${i},${n},${o},${t.a})`:`rgb(${i},${n},${o})`}function xt(l){if(typeof l=="number"){if(fl==null)throw new Error(`color(${l}) is invalid because no custom color palette is defined.`);const t=fl[l];if(t==null)throw new Error(`color(${l}) is out of bounds for the current color palette (length: ${fl.length}).`);return t}if(dl==null)throw new Error(`color("${l}") was used before the color system was initialized.`);const e=dl[l];if(e==null)throw new Error(`Unknown color "${l}". Supported colors: ${Y.join(", ")}.`);return e}const ki=`
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
`;function Di(l,e){return new PIXI.Filter(void 0,ki,{width:l,height:e})}const x=new f;let P,Q,S,T=new f;const vt=5;document.createElement("img");let M,Fl,Il=1,Fe="black",A,Mt,Cl=!1,y,Et;function Ui(l,e,t,i,n,o,r,c){x.set(l),y=c,Fe=t;const u=`
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
`,p=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=u,T.set(x),y.isUsingPixi){T.mul(vt);const g=new PIXI.Application({width:T.x,height:T.y});if(P=g.view,S=new PIXI.Graphics,S.scale.x=S.scale.y=vt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,g.stage.addChild(S),S.filters=[],y.name==="crt"&&S.filters.push(Et=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),y.name==="pixel"&&S.filters.push(Di(T.x,T.y)),y.name==="pixel"||y.name==="shapeDark"){const h=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:y.name==="pixel"?1.5:1,brightness:y.name==="pixel"?1.5:1,blur:8});S.filters.push(h)}S.lineStyle(0),P.style.cssText=d}else P=document.createElement("canvas"),P.width=T.x,P.height=T.y,Q=P.getContext("2d"),Q.imageSmoothingEnabled=!1,P.style.cssText=d+p;document.body.appendChild(P);const m=()=>{const h=innerWidth/innerHeight,C=T.x/T.y,w=h<C,F=w?.95*innerWidth:.95*innerHeight*C,R=w?.95*innerWidth/C:.95*innerHeight;P.style.width=`${F}px`,P.style.height=`${R}px`};if(window.addEventListener("resize",m),m(),i){M=document.createElement("canvas");let g;n?(M.width=T.x,M.height=T.y,g=o):(T.x<=T.y*2?(M.width=T.y*2,M.height=T.y):(M.width=T.x,M.height=T.x/2),M.width>400&&(Il=400/M.width,M.width=400,M.height*=Il),g=Math.round(400/M.width)),Fl=M.getContext("2d"),Fl.fillStyle=e,gcc.setOptions({scale:g,capturingFps:60,isSmoothingEnabled:!1,durationSec:r})}}function Ll(){if(y.isUsingPixi){S.clear(),S.beginFill(bl(Fe,y.isDarkColor?.15:1)),S.drawRect(0,0,x.x,x.y),S.endFill(),S.beginFill(bl(A)),Cl=!0;return}Q.fillStyle=Sl(Fe,y.isDarkColor?.15:1),Q.fillRect(0,0,x.x,x.y),Q.fillStyle=Sl(A)}function N(l){if(l===A){y.isUsingPixi&&!Cl&&Ql(bl(A));return}if(A=l,y.isUsingPixi){Cl&&S.endFill(),Ql(bl(A));return}Q.fillStyle=Sl(l)}function Ql(l){Zl(),S.beginFill(l),Cl=!0}function Zl(){Cl&&(S.endFill(),Cl=!1)}function $l(){Mt=A}function le(){N(Mt)}function xl(l,e,t,i){if(y.isUsingPixi){y.name==="shape"||y.name==="shapeDark"?S.drawRoundedRect(l,e,t,i,2):S.drawRect(l,e,t,i);return}Q.fillRect(l,e,t,i)}function Bi(l,e,t,i,n){const o=bl(A);Ql(o),S.drawCircle(l,e,n*.5),S.drawCircle(t,i,n*.5),Zl(),S.lineStyle(n,o),S.moveTo(l,e),S.lineTo(t,i),S.lineStyle(0)}function _i(){Et.time+=.2}function Ni(){if(Fl.fillRect(0,0,M.width,M.height),Il===1)Fl.drawImage(P,(M.width-P.width)/2,(M.height-P.height)/2);else{const l=P.width*Il,e=P.height*Il;Fl.drawImage(P,(M.width-l)/2,(M.height-e)/2,l,e)}gcc.capture(M)}const Rt=[`
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

`];let vl,ee;function zi(){vl=[],ee=[]}function Pt(){vl=vl.concat(ee),ee=[]}function Tt(l){let e={isColliding:{rect:{},text:{},char:{}}};return vl.forEach(t=>{Gi(l,t)&&(e=Object.assign(Object.assign(Object.assign({},e),Ie(t.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},e.isColliding.rect),t.collision.isColliding.rect),text:Object.assign(Object.assign({},e.isColliding.text),t.collision.isColliding.text),char:Object.assign(Object.assign({},e.isColliding.char),t.collision.isColliding.char)}}))}),e}function Gi(l,e){const t=e.pos.x-l.pos.x,i=e.pos.y-l.pos.y;return-e.size.x<t&&t<l.size.x&&-e.size.y<i&&i<l.size.y}function Ie(l){if(l==null)return{};const e={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let t={};return E(l).forEach(([i,n])=>{const o=e[i];n&&o!=null&&(t[o]=!0)}),t}function Ot(l,e,t,i){return Ft(!1,l,e,t,i)}function Vi(l,e,t,i){return Ft(!0,l,e,t,i)}function Ft(l,e,t,i,n){if(typeof t=="number"){if(typeof i=="number")return V(e,t,i,Object.assign({isCharacter:l,isCheckingCollision:!0,color:A},n));throw new Error(`${l?"char":"text"}(): expected numeric y when x is a number.`)}else return V(e,t.x,t.y,Object.assign({isCharacter:l,isCheckingCollision:!0,color:A},i))}const Al=6,Ki=4,G=1,b=Al*G,sl=Ki*G;let Le,Ae,te,ke,De=!1,Ml,Ue,kl,ie;const Be={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function Ji(){Ml=document.createElement("canvas"),Ml.width=Ml.height=b,Ue=Ml.getContext("2d"),kl=document.createElement("canvas"),ie=kl.getContext("2d"),Le=Rt.map((l,e)=>ne(l,String.fromCharCode(33+e),!1)),Ae=ji.map((l,e)=>ne(l,String.fromCharCode(33+e),!1)),te=Rt.map((l,e)=>ne(l,String.fromCharCode(33+e),!0)),ke={}}function Hi(l,e){const t=e.charCodeAt(0)-33;l.forEach((i,n)=>{te[t+n]=ne(i,String.fromCharCode(33+t+n),!0)})}function qi(){De=!0}function V(l,e,t,i={}){const n=At(i);let o=l,r=e,c=t,u,d={isColliding:{rect:{},text:{},char:{}}};const p=n.isSmallText?sl:b;for(let m=0;m<o.length;m++){if(m===0){const C=o.charCodeAt(0);if(C<33||C>126)r=Math.floor(r-b/2*n.scale.x),c=Math.floor(c-b/2*n.scale.y);else{const w=C-33,F=n.isCharacter?te[w]:n.isSmallText?Ae[w]:Le[w];r=Math.floor(r-F.size.x/2*n.scale.x),c=Math.floor(c-F.size.y/2*n.scale.y)}u=r}const g=o[m];if(g===`
`){r=u,c+=b*n.scale.y;continue}const h=Xi(g,r,c,n);n.isCheckingCollision&&(d={isColliding:{rect:Object.assign(Object.assign({},d.isColliding.rect),h.isColliding.rect),text:Object.assign(Object.assign({},d.isColliding.text),h.isColliding.text),char:Object.assign(Object.assign({},d.isColliding.char),h.isColliding.char)}}),r+=p*n.scale.x}return d}function Xi(l,e,t,i){const n=l.charCodeAt(0);if(n<32||n>126)return{isColliding:{rect:{},text:{},char:{}}};const o=At(i);if(o.backgroundColor!=="transparent"){const R=o.isSmallText?sl:b,Me=o.isSmallText?2:1;$l(),N(o.backgroundColor),xl(e+Me,t,R*o.scale.x,b*o.scale.y),le()}if(n<=32)return{isColliding:{rect:{},text:{},char:{}}};const r=n-33,c=o.isCharacter?te[r]:o.isSmallText?Ae[r]:Le[r],u=X(o.rotation,0,4);if(o.color==="black"&&u===0&&o.mirror.x===1&&o.mirror.y===1&&o.edgeColor==null&&(!y.isUsingPixi||o.scale.x===1&&o.scale.y===1))return _e(c,e,t,o.scale,o.isCheckingCollision,!0);const d=JSON.stringify({c:l,options:o}),p=ke[d];if(p!=null)return _e(p,e,t,o.scale,o.isCheckingCollision,o.color!=="transparent");let m=!1;const g=new f(b,b);let h=Ml,C=Ue;if(c.size.x>b||c.size.y>b){if(u===0||u===2)g.set(c.size.x,c.size.y);else{const R=Math.max(c.size.x,c.size.y);g.set(R,R)}h=document.createElement("canvas"),h.width=g.x,h.height=g.y,C=h.getContext("2d"),C.imageSmoothingEnabled=!1}y.isUsingPixi&&(o.scale.x!==1||o.scale.y!==1)&&(kl.width=g.x*o.scale.x,kl.height=g.y*o.scale.y,ie.imageSmoothingEnabled=!1,ie.scale(o.scale.x,o.scale.y),It(ie,u,o,c.image,g),m=!0),C.clearRect(0,0,g.x,g.y),It(C,u,o,c.image,g);const w=Ne(C,g,l,o.isCharacter);o.edgeColor!=null&&(h=Wi(C,g,o.edgeColor),g.x+=2,g.y+=2);let F;if(De||y.isUsingPixi){const R=document.createElement("img");if(R.src=h.toDataURL(),y.isUsingPixi){const Me=document.createElement("img");Me.src=(m?kl:h).toDataURL(),F=PIXI.Texture.from(Me)}De&&(ke[d]={image:R,texture:F,hitBox:w,size:g})}return _e({image:h,texture:F,hitBox:w,size:g},e,t,o.scale,o.isCheckingCollision,o.color!=="transparent")}function Wi(l,e,t){const i=e.x+2,n=e.y+2,o=[[0,-1],[1,0],[0,1],[-1,0]],r=document.createElement("canvas");r.width=i,r.height=n;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(l.canvas,1,1);const d=c.getImageData(0,0,i,n).data;c.fillStyle=Sl(t);for(let p=0;p<n;p++)for(let m=0;m<i;m++){const g=(p*i+m)*4;if(d[g+3]===0)for(const[h,C]of o){const w=m+h,F=p+C;if(w>=0&&w<i&&F>=0&&F<n){const R=(F*i+w)*4;if(d[R+3]>0){c.fillRect(m,p,1,1);break}}}}return r}function It(l,e,t,i,n){e===0&&t.mirror.x===1&&t.mirror.y===1?l.drawImage(i,0,0):(l.save(),l.translate(n.x/2,n.y/2),l.rotate(Math.PI/2*e),(t.mirror.x===-1||t.mirror.y===-1)&&l.scale(t.mirror.x,t.mirror.y),l.drawImage(i,-n.x/2,-n.y/2),l.restore()),t.color!=="black"&&(l.globalCompositeOperation="source-in",l.fillStyle=Sl(t.color==="transparent"?"black":t.color),l.fillRect(0,0,n.x,n.y),l.globalCompositeOperation="source-over")}function _e(l,e,t,i,n,o){if(o&&(i.x===1&&i.y===1?Lt(l,e,t):Lt(l,e,t,l.size.x*i.x,l.size.y*i.y)),!n)return;const r={pos:{x:e+l.hitBox.pos.x*i.x,y:t+l.hitBox.pos.y*i.y},size:{x:l.hitBox.size.x*i.x,y:l.hitBox.size.y*i.y},collision:l.hitBox.collision},c=Tt(r);return o&&vl.push(r),c}function Lt(l,e,t,i,n){if(y.isUsingPixi){Zl(),S.beginTextureFill({texture:l.texture,matrix:new PIXI.Matrix().translate(e,t)}),S.drawRect(e,t,i??l.size.x,n??l.size.y),Ql(bl(A));return}i==null?Q.drawImage(l.image,e,t):Q.drawImage(l.image,e,t,i,n)}function ne(l,e,t){if(l.indexOf(".")>=0||l.indexOf("data:image/")==0)return Yi(l,e);let i=l.split(`
`);i=i.slice(1,i.length-1);let n=0;i.forEach(h=>{n=Math.max(h.length,n)});const o=Math.max(Math.ceil((Al-n)/2),0),r=i.length,c=Math.max(Math.ceil((Al-r)/2),0),u=new f(Math.max(Al,n)*G,Math.max(Al,r)*G);let d=Ml,p=Ue;(u.x>b||u.y>b)&&(d=document.createElement("canvas"),d.width=u.x,d.height=u.y,p=d.getContext("2d"),p.imageSmoothingEnabled=!1),p.clearRect(0,0,u.x,u.y),i.forEach((h,C)=>{for(let w=0;w<n;w++){const F=h.charAt(w);let R=Oi.indexOf(F);F!==""&&R>=1&&(p.fillStyle=Sl(Y[R]),p.fillRect((w+o)*G,(C+c)*G,G,G))}});const m=document.createElement("img");m.src=d.toDataURL();const g=Ne(p,u,e,t);return y.isUsingPixi?{image:m,texture:PIXI.Texture.from(m),size:u,hitBox:g}:{image:m,size:u,hitBox:g}}function Yi(l,e){const t=document.createElement("img");t.src=l;const i=new f,n={pos:new f,size:new f,collision:{isColliding:{char:{},text:{}}}};let o;return y.isUsingPixi?o={image:t,texture:PIXI.Texture.from(t),size:new f,hitBox:n}:o={image:t,size:i,hitBox:n},t.onload=()=>{o.size.set(t.width*G,t.height*G);const r=document.createElement("canvas");r.width=o.size.x,r.height=o.size.y;const c=r.getContext("2d");c.imageSmoothingEnabled=!1,c.drawImage(t,0,0,o.size.x,o.size.y);const u=document.createElement("img");u.src=r.toDataURL(),o.image=u,o.hitBox=Ne(c,o.size,e,!0),y.isUsingPixi&&(o.texture=PIXI.Texture.from(u))},o}function Ne(l,e,t,i){const n={pos:new f(b,b),size:new f,collision:{isColliding:{char:{},text:{}}}};i?n.collision.isColliding.char[t]=!0:n.collision.isColliding.text[t]=!0;const o=l.getImageData(0,0,e.x,e.y).data;let r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u<n.pos.x&&(n.pos.x=u),c<n.pos.y&&(n.pos.y=c)),r+=4;r=0;for(let c=0;c<e.y;c++)for(let u=0;u<e.x;u++)o[r+3]>0&&(u>n.pos.x+n.size.x-1&&(n.size.x=u-n.pos.x+1),c>n.pos.y+n.size.y-1&&(n.size.y=c-n.pos.y+1)),r+=4;return n}function At(l){let e=Object.assign(Object.assign({},Be),l);return l.scale!=null&&(e.scale=Object.assign(Object.assign({},Be.scale),l.scale)),l.mirror!=null&&(e.mirror=Object.assign(Object.assign({},Be.mirror),l.mirror)),e}let El=!1,se=!1,je=!1;const kt=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let ze;const Qi={onKeyDown:void 0};let Ge,Ve=!1,Ke=!1,Je=!1,He={},qe={},Xe={};function Dt(l){Ge=Object.assign(Object.assign({},Qi),l),ze=Yl(kt.map(e=>[e,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",e=>{Ve=Ke=!0,He[e.code]=qe[e.code]=!0,Ge.onKeyDown!=null&&Ge.onKeyDown(),(e.code==="AltLeft"||e.code==="AltRight"||e.code==="ArrowRight"||e.code==="ArrowDown"||e.code==="ArrowLeft"||e.code==="ArrowUp")&&e.preventDefault()}),document.addEventListener("keyup",e=>{Ve=!1,Je=!0,He[e.code]=!1,Xe[e.code]=!0})}function Ut(){se=!El&&Ke,je=El&&Je,Ke=Je=!1,El=Ve,E(ze).forEach(([l,e])=>{e.isJustPressed=!e.isPressed&&qe[l],e.isJustReleased=e.isPressed&&Xe[l],e.isPressed=!!He[l]}),qe={},Xe={}}function Bt(){se=!1,El=!0}var Zi=Object.freeze({__proto__:null,clearJustPressed:Bt,get code(){return ze},codes:kt,init:Dt,get isJustPressed(){return se},get isJustReleased(){return je},get isPressed(){return El},update:Ut});class Dl{constructor(e=null){this.setSeed(e)}get(e=1,t){return t==null&&(t=e,e=0),this.next()/4294967295*(t-e)+e}getInt(e,t){t==null&&(t=e,e=0);const i=Math.floor(e),n=Math.floor(t);return n===i?i:this.next()%(n-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(e){return e[this.getInt(e.length)]}setSeed(e,t=123456789,i=362436069,n=521288629,o=32){this.w=e!=null?e>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=t>>>0,this.y=i>>>0,this.z=n>>>0;for(let r=0;r<o;r++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const e=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(e^e>>>8))>>>0,this.w}}const Ul=new f;let Z=!1,Rl=!1,Bl=!1,$i={isDebugMode:!1,anchor:new f,padding:new f,onPointerDownOrUp:void 0},D,j,I;const _l=new Dl,gl=new f,$=new f;let Nl=!1,jl=new f,We=!1,Ye=!1,Qe=!1;function _t(l,e,t){I=Object.assign(Object.assign({},$i),t),D=l,j=new f(e.x+I.padding.x*2,e.y+I.padding.y*2),jl.set(D.offsetLeft+D.clientWidth*(.5-I.anchor.x),D.offsetTop+D.clientWidth*(.5-I.anchor.y)),I.isDebugMode&&gl.set(D.offsetLeft+D.clientWidth*(.5-I.anchor.x),D.offsetTop+D.clientWidth*(.5-I.anchor.y)),document.addEventListener("mousedown",i=>{zt(i.pageX,i.pageY)}),document.addEventListener("touchstart",i=>{zt(i.touches[0].pageX,i.touches[0].pageY)}),document.addEventListener("mousemove",i=>{Gt(i.pageX,i.pageY)}),document.addEventListener("touchmove",i=>{i.preventDefault(),Gt(i.touches[0].pageX,i.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",i=>{Vt()}),document.addEventListener("touchend",i=>{i.preventDefault(),i.target.click(),Vt()},{passive:!1})}function Nt(){ln(jl.x,jl.y,Ul),I.isDebugMode&&!Ul.isInRect(0,0,j.x,j.y)?(en(),Ul.set(gl),Rl=!Z&&Nl,Bl=Z&&!Nl,Z=Nl):(Rl=!Z&&Ye,Bl=Z&&Qe,Z=We),Ye=Qe=!1}function jt(){Rl=!1,Z=!0}function ln(l,e,t){D!=null&&(t.x=Math.round(((l-D.offsetLeft)/D.clientWidth+I.anchor.x)*j.x-I.padding.x),t.y=Math.round(((e-D.offsetTop)/D.clientHeight+I.anchor.y)*j.y-I.padding.y))}function en(){$.length>0?(gl.add($),!W(gl.x,-j.x*.1,j.x*1.1)&&gl.x*$.x>0&&($.x*=-1),!W(gl.y,-j.y*.1,j.y*1.1)&&gl.y*$.y>0&&($.y*=-1),_l.get()<.05&&$.set(0)):_l.get()<.1&&($.set(0),$.addWithAngle(_l.get(Math.PI*2),(j.x+j.y)*_l.get(.01,.03))),_l.get()<.05&&(Nl=!Nl)}function zt(l,e){jl.set(l,e),We=Ye=!0,I.onPointerDownOrUp!=null&&I.onPointerDownOrUp()}function Gt(l,e){jl.set(l,e)}function Vt(l){We=!1,Qe=!0,I.onPointerDownOrUp!=null&&I.onPointerDownOrUp()}var tn=Object.freeze({__proto__:null,clearJustPressed:jt,init:_t,get isJustPressed(){return Rl},get isJustReleased(){return Bl},get isPressed(){return Z},pos:Ul,update:Nt});let ll=new f,el=!1,K=!1,ol=!1;function Kt(l){Dt({onKeyDown:l}),_t(P,x,{onPointerDownOrUp:l,anchor:new f(.5,.5)})}function Jt(){Ut(),Nt(),ll=Ul,el=El||Z,K=se||Rl,ol=je||Bl}function Ht(){Bt(),jt()}function zl(l){ll.set(l.pos),el=l.isPressed,K=l.isJustPressed,ol=l.isJustReleased}var nn=Object.freeze({__proto__:null,clearJustPressed:Ht,init:Kt,get isJustPressed(){return K},get isJustReleased(){return ol},get isPressed(){return el},get pos(){return ll},set:zl,update:Jt});const sn={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"};let O,oe=!1,rl,Gl,Ze=!1,re;s.algoChipSession=void 0;let $e,qt,lt={},Xt,tl=!1,ae,et,Pl=!1,tt=!1,Vl,Wt,it,il={},ce,nt;async function on(l){if(rl=l.audioSeed,Gl=l.audioVolume,ce=l.bgmName,nt=l.bgmVolume,typeof AlgoChip<"u"&&AlgoChip!==null&&typeof AlgoChipUtil<"u"&&AlgoChipUtil!==null?Ze=oe=!0:typeof sss<"u"&&sss!==null&&(tl=oe=!0),typeof audioFiles<"u"&&audioFiles!=null&&(Pl=oe=!0),!oe)return!1;if(O=new(window.AudioContext||window.webkitAudioContext),Pl){document.addEventListener("visibilitychange",()=>{document.hidden?O.suspend():O.resume()}),hn(),$t(.1*Gl),Zt(l.audioTempo);for(let e in audioFiles){const t=mn(e,audioFiles[e]);e===ce&&(t.isLooping=!0,tt=!0)}}return Ze&&(re=O.createGain(),re.connect(O.destination),s.algoChipSession=AlgoChipUtil.createAudioSession({audioContext:O,gainNode:re,workletBasePath:"https://abagames.github.io/algo-chip/worklets/"}),await s.algoChipSession.ensureReady(),s.algoChipSession.setBgmVolume(.5*Gl),Xt=AlgoChipUtil.createVisibilityController(s.algoChipSession)),tl&&(ae=O.createGain(),ae.connect(O.destination),sss.init(rl,O,ae),sss.setVolume(.1*Gl),sss.setTempo(l.audioTempo)),!0}function rn(l,e){if(!(Pl&&Yt(l,e!=null&&e.volume!=null?e.volume:1)))if(s.algoChipSession!=null){let t=l,i=rl;t==="powerUp"?t="powerup":(t==="random"||t==="lucky")&&(t="explosion",i++);let n;e?.freq!=null?n=e.freq:e?.pitch!=null&&(n=2**((e.pitch-69)/12)*440);const o={seed:i,type:t,baseFrequency:n},r=JSON.stringify(o);lt[r]==null&&(lt[r]=s.algoChipSession.generateSe(o)),s.algoChipSession.playSe(lt[r],{volume:Gl*(e?.volume!=null?e?.volume:1)*.7,duckingDb:-8,quantize:{loopAware:!0,phase:"next",quantizeTo:"half_beat",fallbackTempo:120}})}else tl&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(l,e):tl&&sss.play(sn[l])}function an(l){rl=l,tl&&sss.setSeed(l)}async function st(){if(!(tt&&Yt(ce,nt)))if(s.algoChipSession!=null){if($e==null||qt!=rl){qt=rl;const l=new Dl;l.setSeed(rl);const e=l.get(-.9,.9),t=l.get(-.9,.9);$e=await s.algoChipSession.generateBgm({seed:rl,lengthInMeasures:32,twoAxisStyle:{calmEnergetic:e,percussiveMelodic:t},overrides:{tempo:"medium"}})}s.algoChipSession.playBgm($e,{loop:!0})}else tl&&typeof sss.generateMml=="function"?et=sss.playMml(sss.generateMml(),{volume:nt}):tl&&sss.playBgm()}function Kl(){tt?Qt(ce):s.algoChipSession!=null?s.algoChipSession.stopBgm():et!=null?sss.stopMml(et):tl&&sss.stopBgm()}function cn(){Pl&&fn(),tl&&sss.update()}function un(){O?.resume(),s.algoChipSession!=null&&s.algoChipSession.resumeAudioContext()}function dn(){Pl&&gn(),Ze&&(Xt(),s.algoChipSession!=null&&s.algoChipSession.close())}function Yt(l,e=1){const t=il[l];return t==null?!1:(t.gainNode.gain.value=e,t.isPlaying=!0,!0)}function fn(){const l=O.currentTime;for(const e in il){const t=il[e];if(!t.isReady||!t.isPlaying)continue;t.isPlaying=!1;const i=Sn(l);(t.playedTime==null||i>t.playedTime)&&(yn(t,i),t.playedTime=i)}}function Qt(l,e=void 0){const t=il[l];t.source!=null&&(e==null?t.source.stop():t.source.stop(e),t.source=void 0)}function gn(l=void 0){if(il){for(const e in il)Qt(e,l);il={}}}function hn(){Pl=!0,Vl=O.createGain(),Vl.connect(O.destination),Zt(),pn(),$t()}function mn(l,e){return il[l]=wn(e),il[l]}function Zt(l=120){Wt=60/l}function pn(l=8){it=l>0?4/l:void 0}function $t(l=.1){Vl.gain.value=l}function yn(l,e){const t=O.createBufferSource();l.source=t,t.buffer=l.buffer,t.loop=l.isLooping,t.start=t.start||t.noteOn,t.connect(l.gainNode),t.start(e)}function wn(l){const e={buffer:void 0,source:void 0,gainNode:O.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return e.gainNode.connect(Vl),bn(l).then(t=>{e.buffer=t,e.isReady=!0}),e}async function bn(l){const t=await(await fetch(l)).arrayBuffer();return await O.decodeAudioData(t)}function Sn(l){if(it==null)return l;const e=Wt*it;return e>0?Math.ceil(l/e)*e:l}let li,ei;const ti=68,ot=1e3/ti;let Jl=0,ii=10,ue,ni;async function Cn(l,e,t){li=l,ei=e,ni=t,await li(),si()}function si(){ue=requestAnimationFrame(si);const l=window.performance.now();l<Jl-ti/12||(Jl+=ot,(Jl<l||Jl>l+ot*2)&&(Jl=l+ot),cn(),Jt(),ei(),ni&&Ni(),ii--,ii===0&&qi())}function xn(){ue&&(cancelAnimationFrame(ue),ue=void 0)}let de;const fe=new Dl;function rt(){de=[]}function oi(l,e=16,t=1,i=0,n=Math.PI*2,o=void 0){if(e<1){if(fe.get()>e)return;e=1}for(let r=0;r<e;r++){const c=i+fe.get(n)-n/2,u={pos:new f(l),vel:new f(t*fe.get(.5,1),0).rotate(c),color:A,ticks:k(fe.get(10,20)*Math.sqrt(Math.abs(t)),10,60),edgeColor:o};de.push(u)}}function ge(){$l(),de=de.filter(l=>{if(l.ticks--,l.ticks<0)return!1;l.pos.add(l.vel),l.vel.mul(.98);const e=Math.floor(l.pos.x),t=Math.floor(l.pos.y);return l.edgeColor!=null&&(N(l.edgeColor),xl(e-1,t-1,3,3)),N(l.color),xl(e,t,1,1),!0}),le()}function at(l,e,t,i){return ri(!1,l,e,t,i,"rect")}function vn(l,e,t,i){return ri(!0,l,e,t,i,"box")}function Mn(l,e,t,i,n=.5,o=.5){typeof l!="number"&&(o=n,n=i,i=t,t=e,e=l.y,l=l.x);const r=new f(t).rotate(n),c=new f(l-r.x*o,e-r.y*o);return ut(c,r,i)}function En(l,e,t=3,i=3,n=3){const o=new f,r=new f;return typeof l=="number"?typeof e=="number"?typeof t=="number"?(o.set(l,e),r.set(t,i)):(o.set(l,e),r.set(t),n=i):ct("when x1 is a number, y1 must also be a number."):typeof e=="number"?typeof t=="number"?(o.set(l),r.set(e,t),n=i):ct("when x1 is a Vector and y1 is a number, x2 must be a number representing the new y-coordinate."):typeof t=="number"?(o.set(l),r.set(e),n=t):ct("when both endpoints are Vectors, the last argument must be the thickness (number)."),ut(o,r.sub(o),n)}function Rn(l,e,t,i,n,o){let r=new f;typeof l=="number"?r.set(l,e):(r.set(l),o=n,n=i,i=t,t=e),i==null&&(i=3),n==null&&(n=0),o==null&&(o=Math.PI*2);let c,u;if(n>o?(c=o,u=n-o):(c=n,u=o-n),u=k(u,0,Math.PI*2),u<.01)return;const d=k(Math.ceil(u*Math.sqrt(t*.25)),1,36),p=u/d;let m=c,g=new f(t).rotate(m).add(r),h=new f,C=new f,w={isColliding:{rect:{},text:{},char:{}}};for(let F=0;F<d;F++){m+=p,h.set(t).rotate(m).add(r),C.set(h).sub(g);const R=ut(g,C,i,!0);w=Object.assign(Object.assign(Object.assign({},w),Ie(R.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},w.isColliding.rect),R.isColliding.rect),text:Object.assign(Object.assign({},w.isColliding.text),R.isColliding.text),char:Object.assign(Object.assign({},w.isColliding.char),R.isColliding.char)}}),g.set(h)}return Pt(),w}function ri(l,e,t,i,n,o="rect"){if(typeof e=="number"){if(typeof t=="number")return typeof i=="number"?n==null?hl(l,e,t,i,i):hl(l,e,t,i,n):hl(l,e,t,i.x,i.y);ai(o,"when x is a number, y must also be a number.")}else if(typeof t=="number"){if(i==null)return hl(l,e.x,e.y,t,t);if(typeof i=="number")return hl(l,e.x,e.y,t,i);ai(o,"when x is a Vector and y is a number, width must be a number.")}else return hl(l,e.x,e.y,t.x,t.y)}function ct(l){throw new Error(`line(): ${l}`)}function ai(l,e){throw new Error(`${l}(): ${e}`)}function ut(l,e,t,i=!1){let n=!0;(y.name==="shape"||y.name==="shapeDark")&&(A!=="transparent"&&Bi(l.x,l.y,l.x+e.x,l.y+e.y,t),n=!1);const o=Math.floor(k(t,3,10)),r=Math.abs(e.x),c=Math.abs(e.y),u=k(Math.ceil(r>c?r/o:c/o)+1,3,99);e.div(u-1);let d={isColliding:{rect:{},text:{},char:{}}};for(let p=0;p<u;p++){const m=hl(!0,l.x,l.y,t,t,!0,n);d=Object.assign(Object.assign(Object.assign({},d),Ie(m.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},d.isColliding.rect),m.isColliding.rect),text:Object.assign(Object.assign({},d.isColliding.text),m.isColliding.text),char:Object.assign(Object.assign({},d.isColliding.char),m.isColliding.char)}}),l.add(e)}return i||Pt(),d}function hl(l,e,t,i,n,o=!1,r=!0){let c=r;(y.name==="shape"||y.name==="shapeDark")&&c&&A!=="transparent"&&(l?xl(e-i/2,t-n/2,i,n):xl(e,t,i,n),c=!1);let u=l?{x:Math.floor(e-i/2),y:Math.floor(t-n/2)}:{x:Math.floor(e),y:Math.floor(t)};const d={x:Math.trunc(i),y:Math.trunc(n)};if(d.x===0||d.y===0)return{isColliding:{rect:{},text:{},char:{}}};d.x<0&&(u.x+=d.x,d.x*=-1),d.y<0&&(u.y+=d.y,d.y*=-1);const p={pos:u,size:d,collision:{isColliding:{rect:{}}}};p.collision.isColliding.rect[A]=!0;const m=Tt(p);return A!=="transparent"&&((o?ee:vl).push(p),c&&xl(u.x,u.y,d.x,d.y)),m}function dt({pos:l,size:e,text:t,isToggle:i=!1,onClick:n=()=>{},isSmallText:o=!0}){return{pos:l,size:e,text:t,isToggle:i,onClick:n,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:o}}function ft(l){const e=new f(ll).sub(l.pos);l.isHovered=e.isInRect(0,0,l.size.x,l.size.y),l.isHovered&&Rl&&(l.isPressed=!0),l.isPressed&&!l.isHovered&&(l.isPressed=!1),l.isPressed&&Bl&&(l.onClick(),l.isPressed=!1,l.isToggle&&(l.toggleGroup.length===0?l.isSelected=!l.isSelected:(l.toggleGroup.forEach(t=>{t.isSelected=!1}),l.isSelected=!0))),he(l)}function he(l){$l(),N(l.isPressed?"blue":"light_blue"),at(l.pos.x,l.pos.y,l.size.x,l.size.y),l.isToggle&&!l.isSelected&&(N("white"),at(l.pos.x+1,l.pos.y+1,l.size.x-2,l.size.y-2)),N(l.isHovered?"black":"blue"),Ot(l.text,l.pos.x+3,l.pos.y+3,{isSmallText:l.isSmallText}),le()}let J,Hl,ml,gt;function Pn(l){J={randomSeed:l,inputs:[]}}function Tn(l){J.inputs.push(l)}function ci(){return J!=null}function On(l){Hl=0,l.setSeed(J.randomSeed)}function Fn(){Hl>=J.inputs.length||(zl(J.inputs[Hl]),Hl++)}function In(){ml=[]}function Ln(l,e,t){ml.push({randomState:t.getState(),gameState:cloneDeep(l),baseState:cloneDeep(e)})}function An(l){const e=ml.pop(),t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),gt={pos:new f(ll),isPressed:el,isJustPressed:K,isJustReleased:ol},zl(J.inputs.pop()),e}function kn(l){const e=ml[ml.length-1],t=e.randomState;return l.setSeed(t.w,t.x,t.y,t.z,0),gt={pos:new f(ll),isPressed:el,isJustPressed:K,isJustReleased:ol},zl(J.inputs[J.inputs.length-1]),e}function Dn(){zl(gt)}function Un(){return ml.length===0}function Bn(){const l=Hl-1;if(!(l>=J.inputs.length))return ml[l]}const ht=4,_n=60,Nn="video/webm;codecs=vp8,opus",jn="video/webm",zn="recording.webm",Gn=1e5*ht,Vn=.7;let z,me;function Kn(l,e,t,i){if(z!=null)return;const n=document.createElement("canvas");n.width=i.x*ht,n.height=i.y*ht;const o=n.getContext("2d");o.imageSmoothingEnabled=!1;const r=()=>{o.drawImage(l,0,0,l.width,l.height,0,0,n.width,n.height),me=requestAnimationFrame(r)};r();const c=n.captureStream(_n),u=e.createMediaStreamDestination(),d=e.createGain();d.gain.value=Vn,t.forEach(h=>{h?.connect(d)}),d.connect(u);const p=u.stream,m=new MediaStream([...c.getVideoTracks(),...p.getAudioTracks()]);z=new MediaRecorder(m,{mimeType:Nn,videoBitsPerSecond:Gn});let g=[];z.ondataavailable=h=>{h.data.size>0&&g.push(h.data)},z.onstop=()=>{const h=new Blob(g,{type:jn}),C=URL.createObjectURL(h),w=document.createElement("a");w.href=C,w.download=zn,w.click(),URL.revokeObjectURL(C),g=[]},z.start()}function Jn(){z!=null&&z.state!=="inactive"&&(z.stop(),z=void 0),me&&(cancelAnimationFrame(me),me=void 0)}function Hn(){return z!=null&&z.state==="recording"}const qn=Math.PI,Xn=Math.abs,Wn=Math.sin,Yn=Math.cos,Qn=Math.atan2,Zn=Math.sqrt,$n=Math.pow,ls=Math.floor,es=Math.round,ts=Math.ceil,is=Math.min,ns=Math.max;s.ticks=0,s.difficulty=void 0,s.score=0,s.time=void 0,s.isReplaying=!1;function ss(l=1,e){return nl.get(l,e)}function os(l=2,e){return nl.getInt(l,e)}function rs(l=1,e){return nl.get(l,e)*nl.getPlusOrMinus()}function mt(l="GAME OVER"){Ce=l,a.isShowingTime&&(s.time=void 0),pi()}function as(l="COMPLETE"){Ce=l,pi()}function cs(l,e,t){if(s.isReplaying||(s.score+=l,e==null))return;const i=`${l>=1?"+":""}${Math.floor(l)}`;let n=new f;typeof e=="number"?n.set(e,t):n.set(e),n.x-=i.length*(a.isUsingSmallText?sl:b)/2,n.y-=b/2,be.push({str:i,pos:n,vy:-2,ticks:30})}function ui(l){N(l)}function us(l,e,t,i,n,o){let r=new f;typeof l=="number"?(r.set(l,e),c(r,t,i,n,o)):(r.set(l),c(r,e,t,i,n));function c(u,d,p,m,g){if(ks(d)){const h=d;oi(u,h.count,h.speed,h.angle,h.angleWidth,h.edgeColor)}else oi(u,d,p,m,g)}}function di(l,e){return new f(l,e)}function fi(l,e){!Xl&&!pl&&rn(l,e)}function gi(){Kn(P,O,[Vl,re,ae],x)}function pt(){Jn()}function ds(l){if(Xl){const e=kn(nl),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,cloneDeep(e.gameState)}else if(pl){const e=An(nl),t=e.baseState;return s.score=t.score,s.ticks=t.ticks,e.gameState}else{if(s.isReplaying)return Bn().gameState;if(H==="inGame"){const e={score:s.score,ticks:s.ticks};Ln(l,e,nl)}}return l}function fs(){pl||(!s.isReplaying&&a.isRewindEnabled?xs():mt())}const pe={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},gs=new Dl,nl=new Dl;let H,hs={title:Ss,inGame:bs,gameOver:Cs,rewind:vs,error:ve},ql=0,ye,we=!0,a,be,Xl=!1,pl=!1,Wl,Se,Ce,yt,xe,yl;function ms(l){window.update=l.update,window.title=l.title,window.description=l.description,window.characters=l.characters,window.options=l.options,window.audioFiles=l.audioFiles,hi()}function hi(){typeof options<"u"&&options!=null?a=Object.assign(Object.assign({},pe),options):a=pe,a.isMinifying&&Us(),Cn(ys,ws,a.isCapturing)}function ps(){xn(),pt(),dn(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}async function ys(){const l={name:a.theme,isUsingPixi:!1,isDarkColor:!1};a.theme!=="simple"&&a.theme!=="dark"&&(l.isUsingPixi=!0),(a.theme==="pixel"||a.theme==="shapeDark"||a.theme==="crt"||a.theme==="dark")&&(l.isDarkColor=!0);const e=l.isDarkColor?"#101010":"#e0e0e0",t=l.isDarkColor?"blue":"white";Ii(l.isDarkColor,a.colorPalette),Ui(a.viewSize,e,t,a.isCapturing,a.isCapturingGameCanvasOnly,a.captureCanvasScale,a.captureDurationSec,l),Kt(()=>{un()}),Ji();let i=a.audioSeed+a.seed;typeof description<"u"&&description!=null&&description.trim().length>0&&(we=!1,i+=Ci(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(we=!1,document.title=title,i+=Ci(title),xe=`crisp-game-${encodeURIComponent(title)}-${i}`,ql=As()),typeof characters<"u"&&characters!=null&&Hi(characters,"a"),a.isSoundEnabled&&(a.isSoundEnabled=await on({audioSeed:i,audioVolume:a.audioVolume,audioTempo:a.audioTempo,bgmName:a.bgmName,bgmVolume:a.bgmVolume})),N("black"),we?(wt(),s.ticks=0):mi()}function ws(){if(H==="error"){ve();return}s.df=s.difficulty=s.ticks/3600+1,s.tc=s.ticks;const l=s.score,e=s.time;s.sc=s.score;const t=s.sc;s.inp={p:ll,ip:el,ijp:K,ijr:ol},zi();try{hs[H]()}catch(i){Es(i);return}y.isUsingPixi&&(Zl(),y.name==="crt"&&_i()),s.ticks++,s.isReplaying?(s.score=l,s.time=e):s.sc!==t&&(s.score=s.sc)}function wt(){H="inGame",s.ticks=-1,rt();const l=Math.floor(s.score);l>ql&&(ql=l),a.isShowingTime&&s.time!=null&&(ye==null||ye>s.time)&&(ye=s.time),s.score=0,s.time=0,be=[],a.isPlayingBgm&&a.isSoundEnabled&&st();const e=gs.getInt(999999999);nl.setSeed(e),(a.isReplayEnabled||a.isRewindEnabled)&&(Pn(e),In(),s.isReplaying=!1)}function bs(){Ll(),a.isDrawingParticleFront||ge(),a.isDrawingScoreFront||Si(),(a.isReplayEnabled||a.isRewindEnabled)&&Tn({pos:di(ll),isPressed:el,isJustPressed:K,isJustReleased:ol}),typeof update=="function"&&update(),a.isDrawingParticleFront&&ge(),a.isDrawingScoreFront&&Si(),bt(),a.isShowingTime&&s.time!=null&&s.time++,a.isRecording&&!Hn()&&gi()}function mi(){H="title",s.ticks=-1,rt(),Ll(),ci()&&(On(nl),s.isReplaying=!0)}function Ss(){if(K){wt();return}if(Ll(),a.isReplayEnabled&&ci()&&(Fn(),s.inp={p:ll,ip:el,ijp:K,ijr:ol},a.isDrawingParticleFront||ge(),update(),a.isDrawingParticleFront&&ge()),bt(),typeof title<"u"&&title!=null){let l=0;title.split(`
`).forEach(t=>{t.length>l&&(l=t.length)});const e=Math.floor((x.x-l*b)/2);title.split(`
`).forEach((t,i)=>{V(t,e,Math.floor(x.y*.25)+i*b,{edgeColor:a.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let l=0;description.split(`
`).forEach(i=>{i.length>l&&(l=i.length)});const e=a.isUsingSmallText?sl:b,t=Math.floor((x.x-l*e)/2);description.split(`
`).forEach((i,n)=>{V(i,t,Math.floor(x.y/2)+n*b,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.description})})}}function pi(){H="gameOver",s.isReplaying||Ht(),s.ticks=-1,wi(),a.isPlayingBgm&&a.isSoundEnabled&&Kl();const l=Math.floor(s.score);l>ql&&Ls(l)}function Cs(){s.ticks===0&&!y.isUsingPixi&&wi(),(s.isReplaying||s.ticks>20)&&K?(yi(),wt()):s.ticks===(a.isReplayEnabled?120:300)&&!we&&(yi(),mi())}function yi(){!a.isRecording||s.isReplaying||pt()}function wi(){s.isReplaying||V(Ce,Math.floor((x.x-Ce.length*b)/2),Math.floor(x.y/2),{edgeColor:a.textEdgeColor.gameOver})}function xs(){H="rewind",Xl=!0,Wl=dt({pos:{x:x.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:a.isUsingSmallText}),Se=dt({pos:{x:x.x-39,y:x.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:a.isUsingSmallText}),a.isPlayingBgm&&a.isSoundEnabled&&Kl(),y.isUsingPixi&&(he(Wl),he(Se))}function vs(){Ll(),update(),bt(),Dn(),pl?(he(Wl),(Un()||!el)&&Ms()):(ft(Wl),ft(Se),Wl.isPressed&&(pl=!0,Xl=!1)),Se.isPressed&&(Xl=pl=!1,mt()),a.isShowingTime&&s.time!=null&&s.time++}function Ms(){pl=!1,H="inGame",rt(),a.isPlayingBgm&&a.isSoundEnabled&&st()}function bt(){if(a.isShowingTime)bi(s.time,3,3),bi(ye,x.x-7*(a.isUsingSmallText?sl:b),3);else if(a.isShowingScore){V(`${Math.floor(s.score)}`,3,3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score});const l=`HI ${ql}`;V(l,x.x-l.length*(a.isUsingSmallText?sl:b),3,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}}function Es(l){if(console.error("Error inside update():",l),H==="error"&&yl!=null){ve();return}yl=Ts(l),H="error",Ps(),ve()}function ve(){(yl==null||yl.length===0)&&(yl=["UPDATE ERROR","See console for details."]);const l=a??pe,e=l.isUsingSmallText?sl:b,t=yl.length*b,i=Math.max(0,Math.floor((x.y-t)/2));Rs(),Ll(),yl.forEach((n,o)=>{const r=Math.max(0,Math.floor((x.x-n.length*e)/2));V(n,r,i+o*b,{isSmallText:l.isUsingSmallText,edgeColor:l.textEdgeColor.gameOver})})}function Rs(){try{N("black")}catch{}}function Ps(){a?.isPlayingBgm&&a.isSoundEnabled&&typeof Kl=="function"&&Kl()}function Ts(l){const e=Os(l),i=["UPDATE ERROR",...Fs(e)];return i.push("See console for details."),i}function Os(l){var e,t;if(l instanceof Error){const i=(e=l.message)===null||e===void 0?void 0:e.trim();return l.name&&i&&i.length>0?`${l.name}: ${i}`:(t=i??l.name)!==null&&t!==void 0?t:"Unknown error"}if(typeof l=="string")return l;try{return JSON.stringify(l)}catch{return"Unknown error"}}function Fs(l){const t=(a??pe).isUsingSmallText?sl:b,i=Math.max(6,Math.floor(x.x/t)-2),n=4,o=l.split(/\r?\n/).map(c=>c.trim()).filter(c=>c.length>0);o.length===0&&o.push("Unknown error");const r=[];return o.forEach(c=>{r.length>=n||r.push(...Is(c,i,n-r.length))}),r}function Is(l,e,t){if(l.length<=e)return[l];const i=[];let n=l;for(;n.length>0&&i.length<t;){if(n.length<=e){i.push(n),n="";break}let o=n.lastIndexOf(" ",e);o<=0&&(o=e),i.push(n.slice(0,o).trim()),n=n.slice(o).trim()}return n.length>0&&i.length<t&&i.push(n),i}function bi(l,e,t){if(l==null)return;let i=Math.floor(l*100/50);i>=600*100&&(i=600*100-1);const n=St(Math.floor(i/6e3),1)+"'"+St(Math.floor(i%6e3/100),2)+'"'+St(Math.floor(i%100),2);V(n,e,t,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.score})}function St(l,e){return("0000"+l).slice(-e)}function Si(){$l(),N("black"),be=be.filter(l=>(V(l.str,l.pos.x,l.pos.y,{isSmallText:a.isUsingSmallText,edgeColor:a.textEdgeColor.floatingScore}),l.pos.y+=l.vy,l.vy*=.9,l.ticks--,l.ticks>0)),le()}function Ci(l){let e=0;for(let t=0;t<l.length;t++){const i=l.charCodeAt(t);e=(e<<5)-e+i,e|=0}return e}function Ls(l){if(xe!=null)try{const e={highScore:l};localStorage.setItem(xe,JSON.stringify(e))}catch(e){console.warn("Unable to save high score:",e)}}function As(){try{const l=localStorage.getItem(xe);if(l)return JSON.parse(l).highScore}catch(l){console.warn("Unable to load high score:",l)}return 0}function ks(l){return l!=null&&l.constructor===Object}function Ds(){let l=window.location.search.substring(1);if(l=l.replace(/[^A-Za-z0-9_-]/g,""),l.length===0)return;const e=document.createElement("script");yt=`${l}/main.js`,e.setAttribute("src",yt),document.head.appendChild(e)}function Us(){fetch(yt).then(l=>l.text()).then(l=>{const e=Terser.minify(l+"update();",{toplevel:!0}).code,t="function(){",i=e.indexOf(t),n="options={",o=e.indexOf(n);let r=e;if(i>=0)r=e.substring(e.indexOf(t)+t.length,e.length-4);else if(o>=0){let c=1,u;for(let d=o+n.length;d<e.length;d++){const p=e.charAt(d);if(p==="{")c++;else if(p==="}"&&(c--,c===0)){u=d+2;break}}c===0&&(r=e.substring(u))}xi.forEach(([c,u])=>{r=r.split(c).join(u)}),console.log(r),console.log(`${r.length} letters`)})}s.inp=void 0;function Bs(...l){return ui.apply(this,l)}function _s(...l){return fi.apply(this,l)}function Ns(...l){return L.apply(this,l)}function js(...l){return ul.apply(this.args)}s.tc=void 0,s.df=void 0,s.sc=void 0;const zs="transparent",Gs="white",Vs="red",Ks="green",Js="yellow",Hs="blue",qs="purple",Xs="cyan",Ws="black",Ys="coin",Qs="laser",Zs="explosion",$s="powerUp",lo="hit",eo="jump",to="select",io="lucky";let xi=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];function no(l){}function so(l){}s.PI=qn,s.__testInitOptions=so,s.__testSetReplaying=no,s.abs=Xn,s.addGameScript=Ds,s.addScore=cs,s.addWithCharCode=_,s.arc=Rn,s.atan2=Qn,s.bar=Mn,s.bl=Hs,s.box=vn,s.ceil=ts,s.char=Vi,s.clamp=k,s.clr=Bs,s.cn=Ys,s.color=ui,s.complete=as,s.cos=Yn,s.cy=Xs,s.end=mt,s.ex=Zs,s.floor=ls,s.frameState=ds,s.getButton=dt,s.gr=Ks,s.ht=lo,s.init=ms,s.input=nn,s.jm=eo,s.keyboard=Zi,s.lc=Ws,s.line=En,s.ls=Qs,s.max=ns,s.min=is,s.minifyReplaces=xi,s.onLoad=hi,s.onUnload=ps,s.particle=us,s.play=fi,s.playBgm=st,s.ply=_s,s.pointer=tn,s.pow=$n,s.pr=qs,s.pw=$s,s.range=v,s.rd=Vs,s.rect=at,s.remove=ul,s.rewind=fs,s.rmv=js,s.rnd=ss,s.rndi=os,s.rnds=rs,s.round=es,s.setAudioSeed=an,s.sin=Wn,s.sl=to,s.sqrt=Zn,s.startRecording=gi,s.stopBgm=Kl,s.stopRecording=pt,s.text=Ot,s.times=L,s.tms=Ns,s.tr=zs,s.uc=io,s.updateButton=ft,s.vec=di,s.wh=Gs,s.wrap=X,s.yl=Js})(window||{})),vi}oo();const ro=`MAGNETIC
PENDULUM`,ao=`
[Hold] Shorten rope
Collect falling magnets
`,co=[`
 rrrr
rRlllr
rlRRRr
rlllRr
rRRRlr
rlllRr
 rrrr
  rr
  `,`
 bbbb
blBBlb
bllBlb
blBllb
blBBlb
 bbbb
  bb
  `],uo={isPlayingBgm:!0,isReplayEnabled:!0,audioSeed:1},Ei=66,fo=10,Ri=1,go=3,Ee=50,Re=5,ho=4,mo=.3,Pi=90,po=.15,Ct=30,yo=.1,wo=.99,bo=.02,So=.5,Ti=.3,Co=.3,xo=.2,vo=10,Mo=.01,Eo=.5,Ro=2,Po=9,To=1;let U,q,wl,Pe,Tl,Te,al,cl,Ol;function Oo(){ticks||(q=Ei,wl=0,Pe=bo*(1+difficulty*xo),U={pos:vec(Ee,Re+q),velocity:vec(0,0)},Tl=[],Te=Pi/(1+difficulty*Ti),al=100,cl=100,Ol=1),cl=Math.min(100,cl+Mo);const s=cl-al;if(al+=s*Eo,input.isPressed?q=Math.max(fo,q-Ri):q=Math.min(Ei,q+Ri),Te--,Te<=0){const E=rnd(15,85),_=mo*(1+difficulty*So);Tl.push({pos:vec(E,0),velocity:vec(0,_)}),Te=Pi/(1+difficulty*Ti)}color("light_black"),box(Ee,Re,4,2),color("black"),text(`x${Ol}`,3,9,{isSmallText:!0}),al<100&&(color("black"),rect(0,al,100,100-al));let k=0,X=0;Tl.forEach(E=>{const _=E.pos.x-U.pos.x,B=E.pos.y-U.pos.y,f=Math.sqrt(_*_+B*B);if(f<Ct&&f>0){const Y=po*(1-f/Ct);k+=_/f*Y,X+=B/f*Y}});const W=Math.cos(wl),v=-Math.sin(wl),L=k*W+X*v,Yl=-(yo*(1+difficulty*Co)*Math.sin(wl))/q+L/q;Pe+=Yl,Pe*=wo,wl+=Pe,U.pos.x=Ee+Math.sin(wl)*q,U.pos.y=Re+Math.cos(wl)*q,color("light_red"),Tl.forEach(E=>{const _=E.pos.x-U.pos.x,B=E.pos.y-U.pos.y,f=Math.sqrt(_*_+B*B);f<Ct&&f>0&&line(U.pos.x,U.pos.y,E.pos.x,E.pos.y,1)}),color("light_blue"),line(Ee,Re,U.pos.x,U.pos.y,2),color("black"),char("b",U.pos),U.pos.y+go>al&&(play("explosion"),end()),color("black"),Tl=Tl.filter(E=>(E.pos.add(E.velocity),char("a",E.pos).isColliding.char?.b?(play("coin"),particle(E.pos,10,2),addScore(To*Ol,E.pos),Ol=Math.min(Po,Ol+1),cl=Math.min(100,cl+Ro),!1):E.pos.y+ho>al?(play("hit"),cl=Math.max(0,cl-vo),Ol=1,!1):!0))}init({options:uo,title:ro,description:ao,characters:co,update:Oo});
