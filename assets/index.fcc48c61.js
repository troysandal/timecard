var et=Object.defineProperty;var tt=(e,t,n)=>t in e?et(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var W=(e,t,n)=>(tt(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))i(u);new MutationObserver(u=>{for(const o of u)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function n(u){const o={};return u.integrity&&(o.integrity=u.integrity),u.referrerpolicy&&(o.referrerPolicy=u.referrerpolicy),u.crossorigin==="use-credentials"?o.credentials="include":u.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(u){if(u.ep)return;u.ep=!0;const o=n(u);fetch(u.href,o)}})();function re(){}function oe(e,t){for(const n in t)e[n]=t[n];return e}function Qe(e){return e()}function Oe(){return Object.create(null)}function $(e){e.forEach(Qe)}function He(e){return typeof e=="function"}function ee(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let ge;function Ae(e,t){return ge||(ge=document.createElement("a")),ge.href=t,e===ge.href}function nt(e){return Object.keys(e).length===0}function ae(e){const t={};for(const n in e)n[0]!=="$"&&(t[n]=e[n]);return t}function ie(e){return e==null?"":e}function it(e){return e&&He(e.destroy)?e.destroy:re}function c(e,t){e.appendChild(t)}function J(e,t,n){e.insertBefore(t,n||null)}function B(e){e.parentNode&&e.parentNode.removeChild(e)}function Xe(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function b(e){return document.createElement(e)}function fe(e){return document.createTextNode(e)}function D(){return fe(" ")}function Z(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function d(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function rt(e){return Array.from(e.childNodes)}function we(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function Le(e,t){e.value=t==null?"":t}function se(e,t,n,i){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}function ce(e,t,n){e.classList[n?"add":"remove"](t)}function ut(e,t,{bubbles:n=!1,cancelable:i=!1}={}){const u=document.createEvent("CustomEvent");return u.initCustomEvent(e,n,i,t),u}let _e;function pe(e){_e=e}function st(){if(!_e)throw new Error("Function called outside component initialization");return _e}function lt(){const e=st();return(t,n,{cancelable:i=!1}={})=>{const u=e.$$.callbacks[t];if(u){const o=ut(t,n,{cancelable:i});return u.slice().forEach(l=>{l.call(e,o)}),!o.defaultPrevented}return!0}}const he=[],O=[],ve=[],Re=[],ot=Promise.resolve();let Me=!1;function ft(){Me||(Me=!0,ot.then(Ze))}function De(e){ve.push(e)}function F(e){Re.push(e)}const Ce=new Set;let be=0;function Ze(){const e=_e;do{for(;be<he.length;){const t=he[be];be++,pe(t),ct(t.$$)}for(pe(null),he.length=0,be=0;O.length;)O.pop()();for(let t=0;t<ve.length;t+=1){const n=ve[t];Ce.has(n)||(Ce.add(n),n())}ve.length=0}while(he.length);for(;Re.length;)Re.pop()();Me=!1,Ce.clear(),pe(e)}function ct(e){if(e.fragment!==null){e.update(),$(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(De)}}const ye=new Set;let le;function Se(){le={r:0,c:[],p:le}}function Ee(){le.r||$(le.c),le=le.p}function I(e,t){e&&e.i&&(ye.delete(e),e.i(t))}function z(e,t,n,i){if(e&&e.o){if(ye.has(e))return;ye.add(e),le.c.push(()=>{ye.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function at(e,t){const n={},i={},u={$$scope:1};let o=e.length;for(;o--;){const l=e[o],r=t[o];if(r){for(const s in l)s in r||(i[s]=1);for(const s in r)u[s]||(n[s]=r[s],u[s]=1);e[o]=r}else for(const s in l)u[s]=1}for(const l in i)l in n||(n[l]=void 0);return n}function dt(e){return typeof e=="object"&&e!==null?e:{}}function U(e,t,n){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function Q(e){e&&e.c()}function Y(e,t,n,i){const{fragment:u,after_update:o}=e.$$;u&&u.m(t,n),i||De(()=>{const l=e.$$.on_mount.map(Qe).filter(He);e.$$.on_destroy?e.$$.on_destroy.push(...l):$(l),e.$$.on_mount=[]}),o.forEach(De)}function G(e,t){const n=e.$$;n.fragment!==null&&($(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function mt(e,t){e.$$.dirty[0]===-1&&(he.push(e),ft(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function te(e,t,n,i,u,o,l,r=[-1]){const s=_e;pe(e);const f=e.$$={fragment:null,ctx:[],props:o,update:re,not_equal:u,bound:Oe(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(s?s.$$.context:[])),callbacks:Oe(),dirty:r,skip_bound:!1,root:t.target||s.$$.root};l&&l(f.root);let y=!1;if(f.ctx=n?n(e,t.props||{},(p,k,...S)=>{const q=S.length?S[0]:k;return f.ctx&&u(f.ctx[p],f.ctx[p]=q)&&(!f.skip_bound&&f.bound[p]&&f.bound[p](q),y&&mt(e,p)),k}):[],f.update(),y=!0,$(f.before_update),f.fragment=i?i(f.ctx):!1,t.target){if(t.hydrate){const p=rt(t.target);f.fragment&&f.fragment.l(p),p.forEach(B)}else f.fragment&&f.fragment.c();t.intro&&I(e.$$.fragment),Y(e,t.target,t.anchor,t.customElement),Ze()}pe(s)}class ne{$destroy(){G(this,1),this.$destroy=re}$on(t,n){if(!He(n))return re;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const u=i.indexOf(n);u!==-1&&i.splice(u,1)}}$set(t){this.$$set&&!nt(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ht="/timecard/assets/icon.110bac24.png";function xe(e){const t=e.getUTCHours().toString().padStart(2,"0"),n=e.getUTCMinutes().toString().padStart(2,"0"),i=e.getUTCSeconds().toString().padStart(2,"0");return`${t}:${n}:${i}`}function ke(e){return!isNaN(parseInt(e.hour)+parseInt(e.minute)+parseInt(e.second))}function ze(e){if(e.hour<0||e.hour>23||e.minute<0||e.minute>59||e.second<0||e.second>59)return;const t=new Date("1970-01-01");if(t.setUTCHours(e.hour),t.setUTCMinutes(e.minute),t.setUTCSeconds(e.second),!isNaN(t.valueOf()))return t}class pt{constructor(){W(this,"tests",[])}get score(){let t=0;for(let n of this.tests)t+=n.score;return t}get scoreString(){return xe(new Date(this.score*1e3))}}class Te{constructor(){W(this,"enter");W(this,"exit")}static fromTimes(t,n){const i=ze(t),u=ze(n);if(!i||!u||u<i)return;const o=new Te;return o.enter=i,o.exit=u,o}get score(){return(this.exit.valueOf()-this.enter.valueOf())/1e3}get scoreString(){return xe(new Date(this.exit.valueOf()-this.enter.valueOf()))}}function _t(e){let t,n,i,u;return{c(){t=b("input"),d(t,"class",n=ie(e[10].class)+" svelte-8hu0a"),d(t,"style",e[5]),d(t,"placeholder",e[2]),d(t,"maxlength",e[3]),d(t,"pattern",e[4]),d(t,"inputmode",e[7]),ce(t,"error",!e[8](e[0]))},m(o,l){J(o,t,l),Le(t,e[0]),e[14](t),i||(u=[Z(t,"input",e[13]),Z(t,"blur",e[9]),it(e[6].call(null,t))],i=!0)},p(o,[l]){l&1024&&n!==(n=ie(o[10].class)+" svelte-8hu0a")&&d(t,"class",n),l&32&&d(t,"style",o[5]),l&4&&d(t,"placeholder",o[2]),l&8&&d(t,"maxlength",o[3]),l&16&&d(t,"pattern",o[4]),l&128&&d(t,"inputmode",o[7]),l&1&&t.value!==o[0]&&Le(t,o[0]),l&1281&&ce(t,"error",!o[8](o[0]))},i:re,o:re,d(o){o&&B(t),e[14](null),i=!1,$(u)}}}function gt(e,t,n){let{placeholder:i=""}=t,{value:u=""}=t,{ref:o=null}=t,{pad:l=null}=t,{maxlength:r=null}=t,{pattern:s="[0-9]*"}=t,{validator:f=()=>!0}=t,{style:y}=t,{initRow:p=()=>{}}=t,{inputmode:k}=t;function S(a){return f(a)}function q(){l>0&&u&&S(u)&&u.length===1&&n(0,u=u.padStart(l,"0"))}function T(){u=this.value,n(0,u)}function C(a){O[a?"unshift":"push"](()=>{o=a,n(1,o)})}return e.$$set=a=>{n(10,t=oe(oe({},t),ae(a))),"placeholder"in a&&n(2,i=a.placeholder),"value"in a&&n(0,u=a.value),"ref"in a&&n(1,o=a.ref),"pad"in a&&n(11,l=a.pad),"maxlength"in a&&n(3,r=a.maxlength),"pattern"in a&&n(4,s=a.pattern),"validator"in a&&n(12,f=a.validator),"style"in a&&n(5,y=a.style),"initRow"in a&&n(6,p=a.initRow),"inputmode"in a&&n(7,k=a.inputmode)},t=ae(t),[u,o,i,r,s,y,p,k,S,q,t,l,f,T,C]}class qe extends ne{constructor(t){super(),te(this,t,gt,_t,ee,{placeholder:2,value:0,ref:1,pad:11,maxlength:3,pattern:4,validator:12,style:5,initRow:6,inputmode:7})}}function bt(e){let t,n,i,u;const o=[e[2],{pad:"2"},{maxlength:"2"},{style:"width:1.75em"}];function l(f){e[3](f)}function r(f){e[4](f)}let s={};for(let f=0;f<o.length;f+=1)s=oe(s,o[f]);return e[0]!==void 0&&(s.value=e[0]),e[1]!==void 0&&(s.ref=e[1]),t=new qe({props:s}),O.push(()=>U(t,"value",l)),O.push(()=>U(t,"ref",r)),{c(){Q(t.$$.fragment)},m(f,y){Y(t,f,y),u=!0},p(f,[y]){const p=y&4?at(o,[dt(f[2]),o[1],o[2],o[3]]):{};!n&&y&1&&(n=!0,p.value=f[0],F(()=>n=!1)),!i&&y&2&&(i=!0,p.ref=f[1],F(()=>i=!1)),t.$set(p)},i(f){u||(I(t.$$.fragment,f),u=!0)},o(f){z(t.$$.fragment,f),u=!1},d(f){G(t,f)}}}function vt(e,t,n){let{value:i}=t,{ref:u=null}=t;function o(r){i=r,n(0,i)}function l(r){u=r,n(1,u)}return e.$$set=r=>{n(2,t=oe(oe({},t),ae(r))),"value"in r&&n(0,i=r.value),"ref"in r&&n(1,u=r.ref)},t=ae(t),[i,u,t,o,l]}class Ne extends ne{constructor(t){super(),te(this,t,vt,bt,ee,{value:0,ref:1})}}function yt(e){let t,n,i,u,o,l,r,s,f,y,p,k;function S(v){e[11](v)}function q(v){e[12](v)}let T={placeholder:"hh",class:e[9].initRow?"enterTime":"exitTime",validator:e[6],initRow:e[9].initRow};e[3]!==void 0&&(T.ref=e[3]),e[0]!==void 0&&(T.value=e[0]),t=new Ne({props:T}),O.push(()=>U(t,"ref",S)),O.push(()=>U(t,"value",q));function C(v){e[13](v)}function a(v){e[14](v)}let g={placeholder:"mm",class:e[9].initRow?"enterTime":"exitTime",validator:e[7]};e[4]!==void 0&&(g.ref=e[4]),e[1]!==void 0&&(g.value=e[1]),o=new Ne({props:g}),O.push(()=>U(o,"ref",C)),O.push(()=>U(o,"value",a));function m(v){e[15](v)}function h(v){e[16](v)}let _={placeholder:"ss",class:e[9].initRow?"enterTime":"exitTime",validator:e[8]};return e[5]!==void 0&&(_.ref=e[5]),e[2]!==void 0&&(_.value=e[2]),f=new Ne({props:_}),O.push(()=>U(f,"ref",m)),O.push(()=>U(f,"value",h)),{c(){Q(t.$$.fragment),u=D(),Q(o.$$.fragment),s=D(),Q(f.$$.fragment)},m(v,w){Y(t,v,w),J(v,u,w),Y(o,v,w),J(v,s,w),Y(f,v,w),k=!0},p(v,[w]){const H={};w&512&&(H.class=v[9].initRow?"enterTime":"exitTime"),w&512&&(H.initRow=v[9].initRow),!n&&w&8&&(n=!0,H.ref=v[3],F(()=>n=!1)),!i&&w&1&&(i=!0,H.value=v[0],F(()=>i=!1)),t.$set(H);const E={};w&512&&(E.class=v[9].initRow?"enterTime":"exitTime"),!l&&w&16&&(l=!0,E.ref=v[4],F(()=>l=!1)),!r&&w&2&&(r=!0,E.value=v[1],F(()=>r=!1)),o.$set(E);const K={};w&512&&(K.class=v[9].initRow?"enterTime":"exitTime"),!y&&w&32&&(y=!0,K.ref=v[5],F(()=>y=!1)),!p&&w&4&&(p=!0,K.value=v[2],F(()=>p=!1)),f.$set(K)},i(v){k||(I(t.$$.fragment,v),I(o.$$.fragment,v),I(f.$$.fragment,v),k=!0)},o(v){z(t.$$.fragment,v),z(o.$$.fragment,v),z(f.$$.fragment,v),k=!1},d(v){G(t,v),v&&B(u),G(o,v),v&&B(s),G(f,v)}}}function Pe(e,t){return n=>n===void 0||n===""?!0:!isNaN(parseInt(n))&&n>=e&&n<=t}function Fe(e,t,n=()=>!0){e&&e.length==2&&n(e)&&t.focus()}function wt(e,t,n){let{hour:i}=t,{minute:u}=t,{second:o}=t,{onSeconds:l=()=>{}}=t,{refHour:r}=t,s,f;const y=Pe(0,23),p=Pe(0,59),k=Pe(0,59);function S(){o&&o.length==2&&k(o)&&l()}function q(h){r=h,n(3,r)}function T(h){i=h,n(0,i)}function C(h){s=h,n(4,s)}function a(h){u=h,n(1,u)}function g(h){f=h,n(5,f)}function m(h){o=h,n(2,o)}return e.$$set=h=>{n(9,t=oe(oe({},t),ae(h))),"hour"in h&&n(0,i=h.hour),"minute"in h&&n(1,u=h.minute),"second"in h&&n(2,o=h.second),"onSeconds"in h&&n(10,l=h.onSeconds),"refHour"in h&&n(3,r=h.refHour)},e.$$.update=()=>{e.$$.dirty&17&&Fe(i,s,y),e.$$.dirty&34&&Fe(u,f,p),e.$$.dirty&4&&S(),e.$$.dirty&7},t=ae(t),[i,u,o,r,s,f,y,p,k,t,l,q,T,C,a,g,m]}class Ue extends ne{constructor(t){super(),te(this,t,wt,yt,ee,{hour:0,minute:1,second:2,onSeconds:10,refHour:3})}}function kt(e){let t,n,i=e[2]+1+"",u,o,l,r,s,f,y,p,k,S,q,T,C,a,g,m,h,_,v,w,H,E;function K(M){e[7](M)}function R(M){e[8](M)}function ue(M){e[9](M)}let N={initRow:St,onSeconds:e[6]};e[0].hour!==void 0&&(N.hour=e[0].hour),e[0].minute!==void 0&&(N.minute=e[0].minute),e[0].second!==void 0&&(N.second=e[0].second),f=new Ue({props:N}),O.push(()=>U(f,"hour",K)),O.push(()=>U(f,"minute",R)),O.push(()=>U(f,"second",ue));function A(M){e[10](M)}function x(M){e[11](M)}function j(M){e[12](M)}function P(M){e[13](M)}let L={};return e[3]!==void 0&&(L.refHour=e[3]),e[1].hour!==void 0&&(L.hour=e[1].hour),e[1].minute!==void 0&&(L.minute=e[1].minute),e[1].second!==void 0&&(L.second=e[1].second),T=new Ue({props:L}),O.push(()=>U(T,"refHour",A)),O.push(()=>U(T,"hour",x)),O.push(()=>U(T,"minute",j)),O.push(()=>U(T,"second",P)),{c(){t=b("tr"),n=b("td"),u=fe(i),o=D(),l=b("button"),l.textContent="\u274C",r=D(),s=b("td"),Q(f.$$.fragment),S=D(),q=b("td"),Q(T.$$.fragment),h=D(),_=b("td"),v=fe(e[4]),d(n,"class","svelte-1nqtemt"),d(s,"class","svelte-1nqtemt"),d(q,"class","svelte-1nqtemt"),d(_,"class","svelte-1nqtemt")},m(M,X){J(M,t,X),c(t,n),c(n,u),c(n,o),c(n,l),c(t,r),c(t,s),Y(f,s,null),c(t,S),c(t,q),Y(T,q,null),c(t,h),c(t,_),c(_,v),w=!0,H||(E=Z(l,"click",e[5]),H=!0)},p(M,[X]){(!w||X&4)&&i!==(i=M[2]+1+"")&&we(u,i);const de={};X&8&&(de.onSeconds=M[6]),!y&&X&1&&(y=!0,de.hour=M[0].hour,F(()=>y=!1)),!p&&X&1&&(p=!0,de.minute=M[0].minute,F(()=>p=!1)),!k&&X&1&&(k=!0,de.second=M[0].second,F(()=>k=!1)),f.$set(de);const me={};!C&&X&8&&(C=!0,me.refHour=M[3],F(()=>C=!1)),!a&&X&2&&(a=!0,me.hour=M[1].hour,F(()=>a=!1)),!g&&X&2&&(g=!0,me.minute=M[1].minute,F(()=>g=!1)),!m&&X&2&&(m=!0,me.second=M[1].second,F(()=>m=!1)),T.$set(me),(!w||X&16)&&we(v,M[4])},i(M){w||(I(f.$$.fragment,M),I(T.$$.fragment,M),w=!0)},o(M){z(f.$$.fragment,M),z(T.$$.fragment,M),w=!1},d(M){M&&B(t),G(f),G(T),H=!1,E()}}}function St(e){e.focus()}function Et(e,t,n){let i;const u=lt();function o(){u("delete",{index:l})}let{index:l}=t,{testDatumEnter:r}=t,{testDatumExit:s}=t;function f(m,h){if(ke(m)&&ke(h)){const _=Te.fromTimes(m,h);if(_)return _.scoreString}return""}let y;const p=()=>{y.focus()};function k(m){e.$$.not_equal(r.hour,m)&&(r.hour=m,n(0,r))}function S(m){e.$$.not_equal(r.minute,m)&&(r.minute=m,n(0,r))}function q(m){e.$$.not_equal(r.second,m)&&(r.second=m,n(0,r))}function T(m){y=m,n(3,y)}function C(m){e.$$.not_equal(s.hour,m)&&(s.hour=m,n(1,s))}function a(m){e.$$.not_equal(s.minute,m)&&(s.minute=m,n(1,s))}function g(m){e.$$.not_equal(s.second,m)&&(s.second=m,n(1,s))}return e.$$set=m=>{"index"in m&&n(2,l=m.index),"testDatumEnter"in m&&n(0,r=m.testDatumEnter),"testDatumExit"in m&&n(1,s=m.testDatumExit)},e.$$.update=()=>{e.$$.dirty&3&&n(4,i=f(r,s))},[r,s,l,y,i,o,p,k,S,q,T,C,a,g]}class Tt extends ne{constructor(t){super(),te(this,t,Et,kt,ee,{index:2,testDatumEnter:0,testDatumExit:1})}}function Be(e,t,n){const i=e.slice();return i[8]=t[n],i[9]=t,i[10]=n,i}function Ve(e){let t,n,i,u;function o(s){e[5](s,e[8])}function l(s){e[6](s,e[8])}let r={index:e[10]};return e[8].enter!==void 0&&(r.testDatumEnter=e[8].enter),e[8].exit!==void 0&&(r.testDatumExit=e[8].exit),t=new Tt({props:r}),O.push(()=>U(t,"testDatumEnter",o)),O.push(()=>U(t,"testDatumExit",l)),t.$on("delete",e[4]),{c(){Q(t.$$.fragment)},m(s,f){Y(t,s,f),u=!0},p(s,f){e=s;const y={};!n&&f&1&&(n=!0,y.testDatumEnter=e[8].enter,F(()=>n=!1)),!i&&f&1&&(i=!0,y.testDatumExit=e[8].exit,F(()=>i=!1)),t.$set(y)},i(s){u||(I(t.$$.fragment,s),u=!0)},o(s){z(t.$$.fragment,s),u=!1},d(s){G(t,s)}}}function qt(e){let t,n,i,u,o,l,r,s,f,y,p,k,S,q,T,C,a,g,m,h=e[0],_=[];for(let w=0;w<h.length;w+=1)_[w]=Ve(Be(e,h,w));const v=w=>z(_[w],1,1,()=>{_[w]=null});return{c(){t=b("table"),n=b("thead"),n.innerHTML=`<tr><th class="svelte-1670vm0">Test #</th> 
            <th class="svelte-1670vm0">Time In</th> 
            <th class="svelte-1670vm0">Time Out</th> 
            <th class="svelte-1670vm0">Score</th></tr>`,i=D(),u=b("tbody");for(let w=0;w<_.length;w+=1)_[w].c();o=D(),l=b("tfoot"),r=b("tr"),s=b("th"),f=b("div"),y=fe("Total Score: "),p=b("span"),k=fe(e[1]),S=D(),q=b("button"),q.textContent="Add a Test",T=D(),C=b("button"),C.textContent="Reset",d(p,"class","score"),d(f,"id","overallScore"),d(q,"id","addTest"),d(C,"id","reset"),d(s,"colspan","4"),d(s,"class","svelte-1670vm0"),d(l,"class","svelte-1670vm0"),d(t,"class","svelte-1670vm0")},m(w,H){J(w,t,H),c(t,n),c(t,i),c(t,u);for(let E=0;E<_.length;E+=1)_[E].m(u,null);c(t,o),c(t,l),c(l,r),c(r,s),c(s,f),c(f,y),c(f,p),c(p,k),c(s,S),c(s,q),c(s,T),c(s,C),a=!0,g||(m=[Z(q,"click",e[2]),Z(C,"click",e[3])],g=!0)},p(w,[H]){if(H&17){h=w[0];let E;for(E=0;E<h.length;E+=1){const K=Be(w,h,E);_[E]?(_[E].p(K,H),I(_[E],1)):(_[E]=Ve(K),_[E].c(),I(_[E],1),_[E].m(u,null))}for(Se(),E=h.length;E<_.length;E+=1)v(E);Ee()}(!a||H&2)&&we(k,w[1])},i(w){if(!a){for(let H=0;H<h.length;H+=1)I(_[H]);a=!0}},o(w){_=_.filter(Boolean);for(let H=0;H<_.length;H+=1)z(_[H]);a=!1},d(w){w&&B(t),Xe(_,w),g=!1,$(m)}}}function Ye(e){const t=[];for(let n=0;n<e;n++)t.push({enter:{hour:"",minute:"",second:""},exit:{hour:"",minute:"",second:""}});return t}function Ct(e,t,n){let i,u=Ye(1);function o(){n(0,u[u.length]={enter:{hour:"",minute:"",second:""},exit:{hour:"",minute:"",second:""}},u)}function l(){window.confirm("Are you sure you want to reset the Sprint Enduro?")&&n(0,u=Ye(7))}function r(){let p=new pt;for(let k of u)if(ke(k.enter)&&ke(k.exit)){const S=Te.fromTimes(k.enter,k.exit);S&&p.tests.push(S)}return p.scoreString}function s(p){window.confirm(`You sure you want to delete test ${p.detail.index+1}?`)&&n(0,u=u.filter((k,S)=>S!==p.detail.index))}function f(p,k){e.$$.not_equal(k.enter,p)&&(k.enter=p,n(0,u))}function y(p,k){e.$$.not_equal(k.exit,p)&&(k.exit=p,n(0,u))}return e.$$.update=()=>{e.$$.dirty&1&&n(1,i=r())},[u,i,o,l,s,f,y]}class Nt extends ne{constructor(t){super(),te(this,t,Ct,qt,ee,{})}}var V=(e=>(e[e.Start=0]="Start",e[e.Known=1]="Known",e[e.Secret=2]="Secret",e[e.Emergency=3]="Emergency",e))(V||{});class Ke{constructor(t){W(this,"type",0);W(this,"minute",0);W(this,"seconds",0);this.minute=t}points(t){let n=0;return this.minute>=t&&(n=this.minute-t),n}disqualified(t){return!1}}class $e extends Ke{constructor(n){super(n);W(this,"type",1)}disqualified(n){return n-this.minute>15}}class je{constructor(t){W(this,"type",2);W(this,"minute",0);W(this,"seconds",0);this.minute=t}points(t){let n=0;return this.minute>=t?n=this.minute-t:n=5*(t-this.minute)-3,n}disqualified(t){return!1}}class Ie extends je{constructor(n,i){super(n);W(this,"type",3);this.seconds=i}emergencyPoints(n){return this.minute===n?Math.abs(this.seconds-30):this.minute>n?30+this.seconds+60*(this.minute-n-1):30+(60-this.seconds)+60*(n-this.minute-1)}}class Pt{constructor(t){W(this,"riderMinute",1);W(this,"checkpoints",[]);console.assert(t>=1),this.riderMinute=t}get points(){return this.checkpoints.map(t=>t.points(this.riderMinute)).reduce((t,n)=>t+n,0)}get emergencyPoints(){return this.checkpoints.map(t=>t instanceof Ie?t.emergencyPoints(this.riderMinute):0).reduce((t,n)=>t+n,0)}get disqualified(){return this.checkpoints.some(t=>t.disqualified(this.riderMinute))}}function Ge(e){let t,n,i;function u(l){e[9](l)}let o={validator:Ht,class:e[2],size:"2",style:"width:2em"};return e[0].seconds!==void 0&&(o.value=e[0].seconds),t=new qe({props:o}),O.push(()=>U(t,"value",u)),{c(){Q(t.$$.fragment)},m(l,r){Y(t,l,r),i=!0},p(l,r){const s={};r&4&&(s.class=l[2]),!n&&r&1&&(n=!0,s.value=l[0].seconds,F(()=>n=!1)),t.$set(s)},i(l){i||(I(t.$$.fragment,l),i=!0)},o(l){z(t.$$.fragment,l),i=!1},d(l){G(t,l)}}}function Rt(e){let t,n,i,u,o,l,r=e[1]+1+"",s,f,y,p,k,S,q,T,C,a,g,m,h,_,v,w,H,E,K,R,ue,N;function A(P){e[8](P)}let x={pattern:null,validator:Dt,initRow:Mt,class:e[2],size:"3",style:"width:2em"};e[0].minute!==void 0&&(x.value=e[0].minute),p=new qe({props:x}),O.push(()=>U(p,"value",A));let j=e[0].type===V.Emergency&&Ge(e);return{c(){t=b("tr"),n=b("td"),i=b("img"),o=D(),l=b("td"),s=fe(r),f=D(),y=b("td"),Q(p.$$.fragment),S=D(),q=b("td"),j&&j.c(),T=D(),C=b("td"),a=b("input"),m=D(),h=b("td"),_=b("input"),w=D(),H=b("td"),E=b("input"),Ae(i.src,u=e[3])||d(i,"src",u),d(i,"alt","Flag"),d(i,"class","svelte-1ym5x0u"),d(n,"class","svelte-1ym5x0u"),d(l,"class","svelte-1ym5x0u"),d(y,"class","svelte-1ym5x0u"),d(q,"class","svelte-1ym5x0u"),d(a,"class",g=ie(e[2])+" svelte-1ym5x0u"),a.disabled=!0,a.value=e[5],d(a,"size","3"),se(a,"width","2em"),d(C,"class","svelte-1ym5x0u"),d(_,"class",v=ie(e[2])+" svelte-1ym5x0u"),_.disabled=!0,_.value=e[4],d(_,"size","4"),se(_,"width","3em"),d(h,"class","svelte-1ym5x0u"),d(E,"type","checkbox"),d(E,"class","svelte-1ym5x0u"),d(H,"class","svelte-1ym5x0u"),d(t,"class",K=ie(e[2])+" svelte-1ym5x0u")},m(P,L){J(P,t,L),c(t,n),c(n,i),c(t,o),c(t,l),c(l,s),c(t,f),c(t,y),Y(p,y,null),c(t,S),c(t,q),j&&j.m(q,null),c(t,T),c(t,C),c(C,a),c(t,m),c(t,h),c(h,_),c(t,w),c(t,H),c(H,E),E.checked=e[0].drop,R=!0,ue||(N=[Z(i,"click",e[6]),Z(i,"keydown",Kt),Z(E,"change",e[10])],ue=!0)},p(P,[L]){(!R||L&8&&!Ae(i.src,u=P[3]))&&d(i,"src",u),(!R||L&2)&&r!==(r=P[1]+1+"")&&we(s,r);const M={};L&4&&(M.class=P[2]),!k&&L&1&&(k=!0,M.value=P[0].minute,F(()=>k=!1)),p.$set(M),P[0].type===V.Emergency?j?(j.p(P,L),L&1&&I(j,1)):(j=Ge(P),j.c(),I(j,1),j.m(q,null)):j&&(Se(),z(j,1,1,()=>{j=null}),Ee()),(!R||L&4&&g!==(g=ie(P[2])+" svelte-1ym5x0u"))&&d(a,"class",g),(!R||L&32&&a.value!==P[5])&&(a.value=P[5]),(!R||L&4&&v!==(v=ie(P[2])+" svelte-1ym5x0u"))&&d(_,"class",v),(!R||L&16&&_.value!==P[4])&&(_.value=P[4]),L&1&&(E.checked=P[0].drop),(!R||L&4&&K!==(K=ie(P[2])+" svelte-1ym5x0u"))&&d(t,"class",K)},i(P){R||(I(p.$$.fragment,P),I(j),R=!0)},o(P){z(p.$$.fragment,P),z(j),R=!1},d(P){P&&B(t),G(p),j&&j.d(),ue=!1,$(N)}}}function Mt(e){e.focus()}function Dt(e){return console.log(`${e}`),!(e==null||e==="")}function Ht(e){return e===void 0||e===""?!1:!isNaN(parseInt(e))&&e>=0&&e<=59}const Kt=()=>{};function jt(e,t,n){let i,u,o,l,{check:r}=t,{index:s}=t,{riderMinute:f}=t;function y(g){const m=parseInt(g.minute);if(isNaN(m))return null;switch(g.type){case V.Emergency:const h=parseInt(g.seconds);if(!isNaN(h))return new Ie(m,h);break;case V.Known:return new $e(m);case V.Secret:return new je(m);case V.Start:return new Ke(m)}return null}function p(g,m){const h=y(g);return h?h.points(m):0}function k(g,m){const h=y(g);return h&&h.type===V.Emergency?h.emergencyPoints(m):0}function S(g){return{[V.Start]:"./images/start.gif",[V.Known]:"./images/known.gif",[V.Secret]:"./images/secret.gif",[V.Emergency]:"./images/emergency.gif"}[g.type]}function q(){n(0,r.type=(r.type+1)%4,r)}function T(g){e.$$.not_equal(r.minute,g)&&(r.minute=g,n(0,r))}function C(g){e.$$.not_equal(r.seconds,g)&&(r.seconds=g,n(0,r))}function a(){r.drop=this.checked,n(0,r)}return e.$$set=g=>{"check"in g&&n(0,r=g.check),"index"in g&&n(1,s=g.index),"riderMinute"in g&&n(7,f=g.riderMinute)},e.$$.update=()=>{e.$$.dirty&129&&n(5,i=p(r,f)),e.$$.dirty&129&&n(4,u=k(r,f)),e.$$.dirty&1&&n(3,o=S(r)),e.$$.dirty&1&&n(2,l=r.drop?"dropped":"")},[r,s,l,o,u,i,q,f,T,C,a]}class It extends ne{constructor(t){super(),te(this,t,jt,Rt,ee,{check:0,index:1,riderMinute:7})}}function Ot(e){let t,n,i,u,o,l,r,s,f,y,p,k,S,q,T,C;return{c(){t=b("table"),n=b("tbody"),i=b("tr"),i.innerHTML=`<th class="svelte-l64quj">Checks</th> 
            <th class="svelte-l64quj">Points</th> 
            <th class="svelte-l64quj">Emergency<br/>Points</th> 
            <th class="svelte-l64quj">Disqualified</th>`,u=D(),o=b("tr"),l=b("td"),r=b("input"),s=D(),f=b("td"),y=b("input"),p=D(),k=b("td"),S=b("input"),q=D(),T=b("td"),C=b("input"),d(r,"id","checks"),r.disabled=!0,r.value=e[0],d(r,"size","2"),se(r,"width","2em"),d(r,"class","svelte-l64quj"),d(l,"class","svelte-l64quj"),d(y,"id","points"),y.disabled=!0,y.value=e[1],d(y,"size","4"),se(y,"width","3em"),d(y,"class","svelte-l64quj"),d(f,"class","svelte-l64quj"),d(S,"id","emergencyPoints"),S.disabled=!0,S.value=e[2],d(S,"size","4"),se(S,"width","3em"),d(S,"class","svelte-l64quj"),d(k,"class","svelte-l64quj"),d(C,"id","disqualified"),C.disabled=!0,C.value=e[3],d(C,"size","4"),se(C,"width","3em"),d(C,"class","svelte-l64quj"),d(T,"class","svelte-l64quj"),se(t,"margin","auto")},m(a,g){J(a,t,g),c(t,n),c(n,i),c(n,u),c(n,o),c(o,l),c(l,r),c(o,s),c(o,f),c(f,y),c(o,p),c(o,k),c(k,S),c(o,q),c(o,T),c(T,C)},p(a,[g]){g&1&&r.value!==a[0]&&(r.value=a[0]),g&2&&y.value!==a[1]&&(y.value=a[1]),g&4&&S.value!==a[2]&&(S.value=a[2]),g&8&&C.value!==a[3]&&(C.value=a[3])},i:re,o:re,d(a){a&&B(t)}}}function At(e,t,n){let{totalChecks:i}=t,{points:u}=t,{emergencyPoints:o}=t,{disqualified:l}=t;return e.$$set=r=>{"totalChecks"in r&&n(0,i=r.totalChecks),"points"in r&&n(1,u=r.points),"emergencyPoints"in r&&n(2,o=r.emergencyPoints),"disqualified"in r&&n(3,l=r.disqualified)},[i,u,o,l]}class Lt extends ne{constructor(t){super(),te(this,t,At,Ot,ee,{totalChecks:0,points:1,emergencyPoints:2,disqualified:3})}}function We(e,t,n){const i=e.slice();return i[16]=t[n],i[17]=t,i[18]=n,i}function Je(e){let t,n,i;function u(l){e[9](l,e[16],e[17],e[18])}let o={riderMinute:e[0],index:e[18]};return e[16]!==void 0&&(o.check=e[16]),t=new It({props:o}),O.push(()=>U(t,"check",u)),{c(){Q(t.$$.fragment)},m(l,r){Y(t,l,r),i=!0},p(l,r){e=l;const s={};r&1&&(s.riderMinute=e[0]),!n&&r&2&&(n=!0,s.check=e[16],F(()=>n=!1)),t.$set(s)},i(l){i||(I(t.$$.fragment,l),i=!0)},o(l){z(t.$$.fragment,l),i=!1},d(l){G(t,l)}}}function zt(e){let t,n,i,u,o,l,r,s,f,y,p,k,S,q,T,C,a,g,m,h,_,v,w;function H(N){e[8](N)}let E={validator:Ut,size:"3",min:"1",style:"width:3em"};e[0]!==void 0&&(E.value=e[0]),i=new qe({props:E}),O.push(()=>U(i,"value",H));let K=e[1],R=[];for(let N=0;N<K.length;N+=1)R[N]=Je(We(e,K,N));const ue=N=>z(R[N],1,1,()=>{R[N]=null});return q=new Lt({props:{totalChecks:e[3],points:e[5],emergencyPoints:e[4],disqualified:e[2]}}),{c(){t=b("div"),n=fe("Rider Minute: "),Q(i.$$.fragment),o=D(),l=b("table"),r=b("thead"),r.innerHTML=`<tr><th class="svelte-1976845"></th> 
            <th class="svelte-1976845">#</th> 
            <th class="svelte-1976845">Minute</th> 
            <th class="svelte-1976845">Second</th> 
            <th class="svelte-1976845">Points</th> 
            <th class="svelte-1976845">Emergency<br/>Points</th> 
            <th class="svelte-1976845">Drop</th></tr>`,s=D(),f=b("tbody");for(let N=0;N<R.length;N+=1)R[N].c();y=D(),p=b("tfoot"),k=b("tr"),S=b("td"),Q(q.$$.fragment),T=D(),C=b("tr"),a=b("th"),g=b("button"),g.textContent="Add a Check",m=D(),h=b("button"),h.textContent="Reset",d(t,"id","riderMinute"),d(t,"class","svelte-1976845"),d(S,"colspan","7"),d(g,"id","addCheck"),d(h,"id","reset"),d(a,"colspan","7"),d(a,"class","svelte-1976845"),d(p,"class","svelte-1976845"),d(l,"class","svelte-1976845")},m(N,A){J(N,t,A),c(t,n),Y(i,t,null),J(N,o,A),J(N,l,A),c(l,r),c(l,s),c(l,f);for(let x=0;x<R.length;x+=1)R[x].m(f,null);c(l,y),c(l,p),c(p,k),c(k,S),Y(q,S,null),c(p,T),c(p,C),c(C,a),c(a,g),c(a,m),c(a,h),_=!0,v||(w=[Z(g,"click",e[6]),Z(h,"click",e[7])],v=!0)},p(N,[A]){const x={};if(!u&&A&1&&(u=!0,x.value=N[0],F(()=>u=!1)),i.$set(x),A&3){K=N[1];let P;for(P=0;P<K.length;P+=1){const L=We(N,K,P);R[P]?(R[P].p(L,A),I(R[P],1)):(R[P]=Je(L),R[P].c(),I(R[P],1),R[P].m(f,null))}for(Se(),P=K.length;P<R.length;P+=1)ue(P);Ee()}const j={};A&8&&(j.totalChecks=N[3]),A&32&&(j.points=N[5]),A&16&&(j.emergencyPoints=N[4]),A&4&&(j.disqualified=N[2]),q.$set(j)},i(N){if(!_){I(i.$$.fragment,N);for(let A=0;A<K.length;A+=1)I(R[A]);I(q.$$.fragment,N),_=!0}},o(N){z(i.$$.fragment,N),R=R.filter(Boolean);for(let A=0;A<R.length;A+=1)z(R[A]);z(q.$$.fragment,N),_=!1},d(N){N&&B(t),G(i),N&&B(o),N&&B(l),Xe(R,N),G(q),v=!1,$(w)}}}function Ft(e){return e.length-e.filter(t=>t.drop).length}function Ut(e){return e===void 0||e===""?!1:!isNaN(parseInt(e))&&e>=1}function Bt(e,t,n){let i,u,o,l,r=1,s=f(1);function f(m){const h=[];for(let _=0;_<m;_++)h.push({type:V.Secret,minute:r,seconds:30,drop:!1});return h}function y(){console.log(r),n(1,s[s.length]={type:V.Secret,minute:r,seconds:30,drop:!1},s)}function p(){window.confirm("Are you sure you want to reset the score card?")&&(n(0,r=1),n(1,s=f(1)))}function k(m){const h=parseInt(m.minute);if(isNaN(h))return null;switch(m.type){case V.Emergency:const _=parseInt(m.seconds);if(!isNaN(_))return new Ie(h,_);break;case V.Known:return new $e(h);case V.Secret:return new je(h);case V.Start:return new Ke(h)}return null}function S(m,h){if(m<1)return null;const _=new Pt(m);for(let v of h){const w=k(v);!v.drop&&w&&_.checkpoints.push(w)}return _}function q(m,h){const _=S(m,h);return _?_.points:"0"}function T(m,h){const _=S(m,h);return _?_.emergencyPoints:"0"}function C(m,h){const _=S(m,h);return _&&_.disqualified?"YES":"NO"}function a(m){r=m,n(0,r)}function g(m,h,_,v){_[v]=m,n(1,s)}return e.$$.update=()=>{e.$$.dirty&3&&n(5,i=q(r,s)),e.$$.dirty&3&&n(4,u=T(r,s)),e.$$.dirty&2&&n(3,o=Ft(s)),e.$$.dirty&3&&n(2,l=C(r,s))},[r,s,l,o,u,i,y,p,a,g]}class Vt extends ne{constructor(t){super(),te(this,t,Bt,zt,ee,{})}}function Yt(e){let t,n,i,u,o,l,r;return l=new Vt({}),{c(){t=b("div"),n=b("h2"),n.textContent="Time Keeper Enduro",i=D(),u=b("p"),u.textContent="Tap Flags to change check type.",o=D(),Q(l.$$.fragment),d(t,"id","timeKeeper")},m(s,f){J(s,t,f),c(t,n),c(t,i),c(t,u),c(t,o),Y(l,t,null),r=!0},i(s){r||(I(l.$$.fragment,s),r=!0)},o(s){z(l.$$.fragment,s),r=!1},d(s){s&&B(t),G(l)}}}function Gt(e){let t,n,i,u,o,l,r;return l=new Nt({}),{c(){t=b("div"),n=b("h2"),n.textContent="Sprint Enduro",i=D(),u=b("p"),u.innerHTML="Enter <b>Hours</b> in 24 Hour Time, e.g. 2PM == 14",o=D(),Q(l.$$.fragment),d(t,"id","sprint")},m(s,f){J(s,t,f),c(t,n),c(t,i),c(t,u),c(t,o),Y(l,t,null),r=!0},i(s){r||(I(l.$$.fragment,s),r=!0)},o(s){z(l.$$.fragment,s),r=!1},d(s){s&&B(t),G(l)}}}function Wt(e){let t,n,i,u,o,l,r,s,f,y,p,k,S,q,T,C,a,g,m,h,_;const v=[Gt,Yt],w=[];function H(E,K){return E[0]==="sprint"?0:1}return a=H(e),g=w[a]=v[a](e),{c(){t=b("meta"),n=b("meta"),i=b("link"),u=b("meta"),o=b("link"),l=D(),r=b("main"),s=b("center"),f=b("h1"),f.textContent="Enduro Time Card",y=D(),p=b("p"),p.textContent=`You can verify your Enduro score cards using this tool. Why would
      you do that?  Because races are busy places and with hundreds of riders,
      those hard working club members sometimes enter something incorrectly.`,k=D(),S=b("button"),S.textContent="Sprint",q=D(),T=b("button"),T.textContent="Time Keeper",C=D(),g.c(),d(t,"name","apple-mobile-web-app-capable"),d(t,"content","yes"),d(n,"name","viewport"),d(n,"content","width=device-width, initial-scale=1, maximum-scale=1"),d(i,"rel","apple-touch-icon"),d(i,"href",ht),d(u,"name","apple-mobile-web-app-title"),d(u,"content","Enduro Time Card"),d(o,"red","manifest"),d(o,"crossorigin","use-credentials"),d(o,"href","manifest.json"),d(S,"class","svelte-py93mz"),ce(S,"selected",e[0]==="sprint"),d(T,"class","svelte-py93mz"),ce(T,"selected",e[0]==="timeKeeper")},m(E,K){c(document.head,t),c(document.head,n),c(document.head,i),c(document.head,u),c(document.head,o),J(E,l,K),J(E,r,K),c(r,s),c(s,f),c(s,y),c(s,p),c(s,k),c(s,S),c(s,q),c(s,T),c(s,C),w[a].m(s,null),m=!0,h||(_=[Z(S,"click",e[2]),Z(T,"click",e[3])],h=!0)},p(E,[K]){(!m||K&1)&&ce(S,"selected",E[0]==="sprint"),(!m||K&1)&&ce(T,"selected",E[0]==="timeKeeper");let R=a;a=H(E),a!==R&&(Se(),z(w[R],1,1,()=>{w[R]=null}),Ee(),g=w[a],g||(g=w[a]=v[a](E),g.c()),I(g,1),g.m(s,null))},i(E){m||(I(g),m=!0)},o(E){z(g),m=!1},d(E){B(t),B(n),B(i),B(u),B(o),E&&B(l),E&&B(r),w[a].d(),h=!1,$(_)}}}function Jt(e,t,n){let i="sprint";function u(r){i!==r&&window.confirm("Switching time cards will lose all data. Are you sure?")&&n(0,i=r)}return[i,u,()=>u("sprint"),()=>u("timeKeeper")]}class Qt extends ne{constructor(t){super(),te(this,t,Jt,Wt,ee,{})}}new Qt({target:document.getElementById("app")});