var xe=Object.defineProperty;var et=(e,t,n)=>t in e?xe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var B=(e,t,n)=>(et(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))i(u);new MutationObserver(u=>{for(const l of u)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(u){const l={};return u.integrity&&(l.integrity=u.integrity),u.referrerpolicy&&(l.referrerPolicy=u.referrerpolicy),u.crossorigin==="use-credentials"?l.credentials="include":u.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(u){if(u.ep)return;u.ep=!0;const l=n(u);fetch(u.href,l)}})();function ne(){}function ie(e,t){for(const n in t)e[n]=t[n];return e}function Ge(e){return e()}function Me(){return Object.create(null)}function Q(e){e.forEach(Ge)}function Re(e){return typeof e=="function"}function $(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let pe;function Oe(e,t){return pe||(pe=document.createElement("a")),pe.href=t,e===pe.href}function tt(e){return Object.keys(e).length===0}function ae(e){const t={};for(const n in e)n[0]!=="$"&&(t[n]=e[n]);return t}function Ae(e,t){const n={};t=new Set(t);for(const i in e)!t.has(i)&&i[0]!=="$"&&(n[i]=e[i]);return n}function le(e){return e==null?"":e}function nt(e){return e&&Re(e.destroy)?e.destroy:ne}function f(e,t){e.appendChild(t)}function V(e,t,n){e.insertBefore(t,n||null)}function I(e){e.parentNode&&e.parentNode.removeChild(e)}function We(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function m(e){return document.createElement(e)}function ue(e){return document.createTextNode(e)}function N(){return ue(" ")}function W(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function d(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function Ie(e,t){const n=Object.getOwnPropertyDescriptors(e.__proto__);for(const i in t)t[i]==null?e.removeAttribute(i):i==="style"?e.style.cssText=t[i]:i==="__value"?e.value=e[i]=t[i]:n[i]&&n[i].set?e[i]=t[i]:d(e,i,t[i])}function it(e){return Array.from(e.childNodes)}function be(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function re(e,t,n,i){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}function oe(e,t,n){e.classList[n?"add":"remove"](t)}function rt(e,t,{bubbles:n=!1,cancelable:i=!1}={}){const u=document.createEvent("CustomEvent");return u.initCustomEvent(e,n,i,t),u}let de;function fe(e){de=e}function st(){if(!de)throw new Error("Function called outside component initialization");return de}function Je(){const e=st();return(t,n,{cancelable:i=!1}={})=>{const u=e.$$.callbacks[t];if(u){const l=rt(t,n,{cancelable:i});return u.slice().forEach(o=>{o.call(e,l)}),!l.defaultPrevented}return!0}}function ut(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach(i=>i.call(this,t))}const ce=[],G=[],ge=[],Ce=[],lt=Promise.resolve();let Pe=!1;function ot(){Pe||(Pe=!0,lt.then(Qe))}function Ne(e){ge.push(e)}function X(e){Ce.push(e)}const Te=new Set;let _e=0;function Qe(){const e=de;do{for(;_e<ce.length;){const t=ce[_e];_e++,fe(t),ct(t.$$)}for(fe(null),ce.length=0,_e=0;G.length;)G.pop()();for(let t=0;t<ge.length;t+=1){const n=ge[t];Te.has(n)||(Te.add(n),n())}ge.length=0}while(ce.length);for(;Ce.length;)Ce.pop()();Pe=!1,Te.clear(),fe(e)}function ct(e){if(e.fragment!==null){e.update(),Q(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(Ne)}}const ve=new Set;let se;function we(){se={r:0,c:[],p:se}}function ke(){se.r||Q(se.c),se=se.p}function M(e,t){e&&e.i&&(ve.delete(e),e.i(t))}function A(e,t,n,i){if(e&&e.o){if(ve.has(e))return;ve.add(e),se.c.push(()=>{ve.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}function Xe(e,t){const n={},i={},u={$$scope:1};let l=e.length;for(;l--;){const o=e[l],r=t[l];if(r){for(const s in o)s in r||(i[s]=1);for(const s in r)u[s]||(n[s]=r[s],u[s]=1);e[l]=r}else for(const s in o)u[s]=1}for(const o in i)o in n||(n[o]=void 0);return n}function ft(e){return typeof e=="object"&&e!==null?e:{}}function Z(e,t,n){const i=e.$$.props[t];i!==void 0&&(e.$$.bound[i]=n,n(e.$$.ctx[i]))}function Y(e){e&&e.c()}function H(e,t,n,i){const{fragment:u,after_update:l}=e.$$;u&&u.m(t,n),i||Ne(()=>{const o=e.$$.on_mount.map(Ge).filter(Re);e.$$.on_destroy?e.$$.on_destroy.push(...o):Q(o),e.$$.on_mount=[]}),l.forEach(Ne)}function F(e,t){const n=e.$$;n.fragment!==null&&(Q(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function at(e,t){e.$$.dirty[0]===-1&&(ce.push(e),ot(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function x(e,t,n,i,u,l,o,r=[-1]){const s=de;fe(e);const c=e.$$={fragment:null,ctx:[],props:l,update:ne,not_equal:u,bound:Me(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(s?s.$$.context:[])),callbacks:Me(),dirty:r,skip_bound:!1,root:t.target||s.$$.root};o&&o(c.root);let h=!1;if(c.ctx=n?n(e,t.props||{},(p,T,...y)=>{const R=y.length?y[0]:T;return c.ctx&&u(c.ctx[p],c.ctx[p]=R)&&(!c.skip_bound&&c.bound[p]&&c.bound[p](R),h&&at(e,p)),T}):[],c.update(),h=!0,Q(c.before_update),c.fragment=i?i(c.ctx):!1,t.target){if(t.hydrate){const p=it(t.target);c.fragment&&c.fragment.l(p),p.forEach(I)}else c.fragment&&c.fragment.c();t.intro&&M(e.$$.fragment),H(e,t.target,t.anchor,t.customElement),Qe()}fe(s)}class ee{$destroy(){F(this,1),this.$destroy=ne}$on(t,n){if(!Re(n))return ne;const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const u=i.indexOf(n);u!==-1&&i.splice(u,1)}}$set(t){this.$$set&&!tt(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const dt="/timecard/assets/icon.110bac24.png";function Ze(e){const t=e.getUTCHours().toString().padStart(2,"0"),n=e.getUTCMinutes().toString().padStart(2,"0"),i=e.getUTCSeconds().toString().padStart(2,"0");return`${t}:${n}:${i}`}function ye(e){return!isNaN(parseInt(e.hour)+parseInt(e.minute)+parseInt(e.second))}function ze(e){if(e.hour<0||e.hour>23||e.minute<0||e.minute>59||e.second<0||e.second>59)return;const t=new Date("1970-01-01");if(t.setUTCHours(e.hour),t.setUTCMinutes(e.minute),t.setUTCSeconds(e.second),!isNaN(t.valueOf()))return t}class mt{constructor(){B(this,"tests",[])}get score(){let t=0;for(let n of this.tests)t+=n.score;return t}get scoreString(){return Ze(new Date(this.score*1e3))}}class Ee{constructor(){B(this,"enter");B(this,"exit")}static fromTimes(t,n){const i=ze(t),u=ze(n);if(!i||!u||u<i)return;const l=new Ee;return l.enter=i,l.exit=u,l}get score(){return(this.exit.valueOf()-this.enter.valueOf())/1e3}get scoreString(){return Ze(new Date(this.exit.valueOf()-this.enter.valueOf()))}}function ht(e){let t,n,i,u,l,o=[{class:n=e[3]+" "+e[5].class},{pattern:i=e[0].numeric?"[0-9]*":null},{type:"number"},e[0],{value:e[1]}],r={};for(let s=0;s<o.length;s+=1)r=ie(r,o[s]);return{c(){t=m("input"),Ie(t,r),oe(t,"svelte-8hu0a",!0)},m(s,c){V(s,t,c),t.autofocus&&t.focus(),u||(l=[W(t,"input",e[4]),nt(e[2].call(null,t))],u=!0)},p(s,[c]){Ie(t,r=Xe(o,[c&40&&n!==(n=s[3]+" "+s[5].class)&&{class:n},c&1&&i!==(i=s[0].numeric?"[0-9]*":null)&&{pattern:i},{type:"number"},c&1&&s[0],c&2&&t.value!==s[1]&&{value:s[1]}])),oe(t,"svelte-8hu0a",!0)},i:ne,o:ne,d(s){s&&I(t),u=!1,Q(l)}}}function pt(e,t,n){let i,{attrs:u}=t,{value:l}=t,{initRow:o=()=>{}}=t;const r=Je();function s(h){r("value",{value:h.target.value})}function c(h){const p=parseInt(h);return!(isNaN(p)||u.min!==void 0&&p<u.min||u.max!==void 0&&p>u.max)}return e.$$set=h=>{n(5,t=ie(ie({},t),ae(h))),"attrs"in h&&n(0,u=h.attrs),"value"in h&&n(1,l=h.value),"initRow"in h&&n(2,o=h.initRow)},e.$$.update=()=>{e.$$.dirty&2&&n(3,i=c(l)?"":"error")},t=ae(t),[u,l,o,i,s,t]}class Se extends ee{constructor(t){super(),x(this,t,pt,ht,$,{attrs:0,value:1,initRow:2})}}function _t(e){let t,n;const i=[e[1],{attrs:{...e[0],size:"2",style:"width:1.75em",numeric:!0}}];let u={};for(let l=0;l<i.length;l+=1)u=ie(u,i[l]);return t=new Se({props:u}),t.$on("value",e[2]),{c(){Y(t.$$.fragment)},m(l,o){H(t,l,o),n=!0},p(l,[o]){const r=o&3?Xe(i,[o&2&&ft(l[1]),o&1&&{attrs:{...l[0],size:"2",style:"width:1.75em",numeric:!0}}]):{};t.$set(r)},i(l){n||(M(t.$$.fragment,l),n=!0)},o(l){A(t.$$.fragment,l),n=!1},d(l){F(t,l)}}}function gt(e,t,n){const i=["attrs"];let u=Ae(t,i),{attrs:l}=t;function o(r){ut.call(this,e,r)}return e.$$set=r=>{t=ie(ie({},t),ae(r)),n(1,u=Ae(t,i)),"attrs"in r&&n(0,l=r.attrs)},[l,u,o]}class qe extends ee{constructor(t){super(),x(this,t,gt,_t,$,{attrs:0})}}function vt(e){let t,n,i,u,l,o;return t=new qe({props:{attrs:{placeholder:"hh",min:"0",max:"23"},class:e[3].initRow?"enterTime":"exitTime",value:e[0],initRow:e[3].initRow}}),t.$on("value",e[4]),i=new qe({props:{attrs:{placeholder:"mm",min:"0",max:"59"},class:e[3].initRow?"enterTime":"exitTime",value:e[1]}}),i.$on("value",e[5]),l=new qe({props:{attrs:{placeholder:"ss",min:"0",max:"59"},class:e[3].initRow?"enterTime":"exitTime",value:e[2]}}),l.$on("value",e[6]),{c(){Y(t.$$.fragment),n=N(),Y(i.$$.fragment),u=N(),Y(l.$$.fragment)},m(r,s){H(t,r,s),V(r,n,s),H(i,r,s),V(r,u,s),H(l,r,s),o=!0},p(r,[s]){const c={};s&8&&(c.class=r[3].initRow?"enterTime":"exitTime"),s&1&&(c.value=r[0]),s&8&&(c.initRow=r[3].initRow),t.$set(c);const h={};s&8&&(h.class=r[3].initRow?"enterTime":"exitTime"),s&2&&(h.value=r[1]),i.$set(h);const p={};s&8&&(p.class=r[3].initRow?"enterTime":"exitTime"),s&4&&(p.value=r[2]),l.$set(p)},i(r){o||(M(t.$$.fragment,r),M(i.$$.fragment,r),M(l.$$.fragment,r),o=!0)},o(r){A(t.$$.fragment,r),A(i.$$.fragment,r),A(l.$$.fragment,r),o=!1},d(r){F(t,r),r&&I(n),F(i,r),r&&I(u),F(l,r)}}}function bt(e,t,n){let{hour:i}=t,{minute:u}=t,{second:l}=t;const o=c=>{n(0,i=c.detail.value)},r=c=>{n(1,u=c.detail.value)},s=c=>{n(2,l=c.detail.value)};return e.$$set=c=>{n(3,t=ie(ie({},t),ae(c))),"hour"in c&&n(0,i=c.hour),"minute"in c&&n(1,u=c.minute),"second"in c&&n(2,l=c.second)},t=ae(t),[i,u,l,t,o,r,s]}class Le extends ee{constructor(t){super(),x(this,t,bt,vt,$,{hour:0,minute:1,second:2})}}function yt(e){let t,n,i=e[2]+1+"",u,l,o,r,s,c,h,p,T,y,R,C,a,k,v,w,_,b,O,E,S;function q(D){e[5](D)}function g(D){e[6](D)}function j(D){e[7](D)}let U={initRow:wt};e[0].hour!==void 0&&(U.hour=e[0].hour),e[0].minute!==void 0&&(U.minute=e[0].minute),e[0].second!==void 0&&(U.second=e[0].second),c=new Le({props:U}),G.push(()=>Z(c,"hour",q)),G.push(()=>Z(c,"minute",g)),G.push(()=>Z(c,"second",j));function K(D){e[8](D)}function P(D){e[9](D)}function z(D){e[10](D)}let te={};return e[1].hour!==void 0&&(te.hour=e[1].hour),e[1].minute!==void 0&&(te.minute=e[1].minute),e[1].second!==void 0&&(te.second=e[1].second),C=new Le({props:te}),G.push(()=>Z(C,"hour",K)),G.push(()=>Z(C,"minute",P)),G.push(()=>Z(C,"second",z)),{c(){t=m("tr"),n=m("td"),u=ue(i),l=N(),o=m("button"),o.textContent="\u274C",r=N(),s=m("td"),Y(c.$$.fragment),y=N(),R=m("td"),Y(C.$$.fragment),w=N(),_=m("td"),b=ue(e[3]),d(n,"class","svelte-1nqtemt"),d(s,"class","svelte-1nqtemt"),d(R,"class","svelte-1nqtemt"),d(_,"class","svelte-1nqtemt")},m(D,J){V(D,t,J),f(t,n),f(n,u),f(n,l),f(n,o),f(t,r),f(t,s),H(c,s,null),f(t,y),f(t,R),H(C,R,null),f(t,w),f(t,_),f(_,b),O=!0,E||(S=W(o,"click",e[4]),E=!0)},p(D,[J]){(!O||J&4)&&i!==(i=D[2]+1+"")&&be(u,i);const me={};!h&&J&1&&(h=!0,me.hour=D[0].hour,X(()=>h=!1)),!p&&J&1&&(p=!0,me.minute=D[0].minute,X(()=>p=!1)),!T&&J&1&&(T=!0,me.second=D[0].second,X(()=>T=!1)),c.$set(me);const he={};!a&&J&2&&(a=!0,he.hour=D[1].hour,X(()=>a=!1)),!k&&J&2&&(k=!0,he.minute=D[1].minute,X(()=>k=!1)),!v&&J&2&&(v=!0,he.second=D[1].second,X(()=>v=!1)),C.$set(he),(!O||J&8)&&be(b,D[3])},i(D){O||(M(c.$$.fragment,D),M(C.$$.fragment,D),O=!0)},o(D){A(c.$$.fragment,D),A(C.$$.fragment,D),O=!1},d(D){D&&I(t),F(c),F(C),E=!1,S()}}}function wt(e){e.focus()}function kt(e,t,n){let i;const u=Je();function l(){u("delete",{index:o})}let{index:o}=t,{testDatumEnter:r}=t,{testDatumExit:s}=t;function c(a,k){if(ye(a)&&ye(k)){const v=Ee.fromTimes(a,k);if(v)return v.scoreString}return""}function h(a){e.$$.not_equal(r.hour,a)&&(r.hour=a,n(0,r))}function p(a){e.$$.not_equal(r.minute,a)&&(r.minute=a,n(0,r))}function T(a){e.$$.not_equal(r.second,a)&&(r.second=a,n(0,r))}function y(a){e.$$.not_equal(s.hour,a)&&(s.hour=a,n(1,s))}function R(a){e.$$.not_equal(s.minute,a)&&(s.minute=a,n(1,s))}function C(a){e.$$.not_equal(s.second,a)&&(s.second=a,n(1,s))}return e.$$set=a=>{"index"in a&&n(2,o=a.index),"testDatumEnter"in a&&n(0,r=a.testDatumEnter),"testDatumExit"in a&&n(1,s=a.testDatumExit)},e.$$.update=()=>{e.$$.dirty&3&&n(3,i=c(r,s))},[r,s,o,i,l,h,p,T,y,R,C]}class Et extends ee{constructor(t){super(),x(this,t,kt,yt,$,{index:2,testDatumEnter:0,testDatumExit:1})}}function He(e,t,n){const i=e.slice();return i[8]=t[n],i[9]=t,i[10]=n,i}function Fe(e){let t,n,i,u;function l(s){e[5](s,e[8])}function o(s){e[6](s,e[8])}let r={index:e[10]};return e[8].enter!==void 0&&(r.testDatumEnter=e[8].enter),e[8].exit!==void 0&&(r.testDatumExit=e[8].exit),t=new Et({props:r}),G.push(()=>Z(t,"testDatumEnter",l)),G.push(()=>Z(t,"testDatumExit",o)),t.$on("delete",e[4]),{c(){Y(t.$$.fragment)},m(s,c){H(t,s,c),u=!0},p(s,c){e=s;const h={};!n&&c&1&&(n=!0,h.testDatumEnter=e[8].enter,X(()=>n=!1)),!i&&c&1&&(i=!0,h.testDatumExit=e[8].exit,X(()=>i=!1)),t.$set(h)},i(s){u||(M(t.$$.fragment,s),u=!0)},o(s){A(t.$$.fragment,s),u=!1},d(s){F(t,s)}}}function St(e){let t,n,i,u,l,o,r,s,c,h,p,T,y,R,C,a,k,v,w,_=e[0],b=[];for(let E=0;E<_.length;E+=1)b[E]=Fe(He(e,_,E));const O=E=>A(b[E],1,1,()=>{b[E]=null});return{c(){t=m("table"),n=m("thead"),n.innerHTML=`<tr><th class="svelte-1670vm0">Test #</th> 
            <th class="svelte-1670vm0">Time In</th> 
            <th class="svelte-1670vm0">Time Out</th> 
            <th class="svelte-1670vm0">Score</th></tr>`,i=N(),u=m("tbody");for(let E=0;E<b.length;E+=1)b[E].c();l=N(),o=m("tfoot"),r=m("tr"),s=m("th"),c=m("div"),h=ue("Total Score: "),p=m("span"),T=ue(e[1]),y=N(),R=m("button"),R.textContent="Add a Test",C=N(),a=m("button"),a.textContent="Reset",d(p,"class","score"),d(c,"id","overallScore"),d(R,"id","addTest"),d(a,"id","reset"),d(s,"colspan","4"),d(s,"class","svelte-1670vm0"),d(o,"class","svelte-1670vm0"),d(t,"class","svelte-1670vm0")},m(E,S){V(E,t,S),f(t,n),f(t,i),f(t,u);for(let q=0;q<b.length;q+=1)b[q].m(u,null);f(t,l),f(t,o),f(o,r),f(r,s),f(s,c),f(c,h),f(c,p),f(p,T),f(s,y),f(s,R),f(s,C),f(s,a),k=!0,v||(w=[W(R,"click",e[2]),W(a,"click",e[3])],v=!0)},p(E,[S]){if(S&17){_=E[0];let q;for(q=0;q<_.length;q+=1){const g=He(E,_,q);b[q]?(b[q].p(g,S),M(b[q],1)):(b[q]=Fe(g),b[q].c(),M(b[q],1),b[q].m(u,null))}for(we(),q=_.length;q<b.length;q+=1)O(q);ke()}(!k||S&2)&&be(T,E[1])},i(E){if(!k){for(let S=0;S<_.length;S+=1)M(b[S]);k=!0}},o(E){b=b.filter(Boolean);for(let S=0;S<b.length;S+=1)A(b[S]);k=!1},d(E){E&&I(t),We(b,E),v=!1,Q(w)}}}function Ue(e){const t=[];for(let n=0;n<e;n++)t.push({enter:{hour:"",minute:"",second:""},exit:{hour:"",minute:"",second:""}});return t}function Tt(e,t,n){let i,u=Ue(7);function l(){n(0,u[u.length]={enter:{hour:"",minute:"",second:""},exit:{hour:"",minute:"",second:""}},u)}function o(){window.confirm("Are you sure you want to reset the Sprint Enduro?")&&n(0,u=Ue(7))}function r(){let p=new mt;for(let T of u)if(ye(T.enter)&&ye(T.exit)){const y=Ee.fromTimes(T.enter,T.exit);y&&p.tests.push(y)}return p.scoreString}function s(p){window.confirm(`You sure you want to delete test ${p.detail.index+1}?`)&&n(0,u=u.filter((T,y)=>y!==p.detail.index))}function c(p,T){e.$$.not_equal(T.enter,p)&&(T.enter=p,n(0,u))}function h(p,T){e.$$.not_equal(T.exit,p)&&(T.exit=p,n(0,u))}return e.$$.update=()=>{e.$$.dirty&1&&n(1,i=r())},[u,i,l,o,s,c,h]}class qt extends ee{constructor(t){super(),x(this,t,Tt,St,$,{})}}var L=(e=>(e[e.Start=0]="Start",e[e.Known=1]="Known",e[e.Secret=2]="Secret",e[e.Emergency=3]="Emergency",e))(L||{});class De{constructor(t){B(this,"type",0);B(this,"minute",0);B(this,"seconds",0);this.minute=t}points(t){let n=0;return this.minute>=t&&(n=this.minute-t),n}disqualified(t){return!1}}class $e extends De{constructor(n){super(n);B(this,"type",1)}disqualified(n){return n-this.minute>15}}class je{constructor(t){B(this,"type",2);B(this,"minute",0);B(this,"seconds",0);this.minute=t}points(t){let n=0;return this.minute>=t?n=this.minute-t:n=5*(t-this.minute)-3,n}disqualified(t){return!1}}class Ke extends je{constructor(n,i){super(n);B(this,"type",3);this.seconds=i}emergencyPoints(n){return this.minute===n?Math.abs(this.seconds-30):this.minute>n?30+this.seconds+60*(this.minute-n-1):30+(60-this.seconds)+60*(n-this.minute-1)}}class Ct{constructor(t){B(this,"riderMinute",1);B(this,"checkpoints",[]);console.assert(t>=1),this.riderMinute=t}get points(){return this.checkpoints.map(t=>t.points(this.riderMinute)).reduce((t,n)=>t+n,0)}get emergencyPoints(){return this.checkpoints.map(t=>t instanceof Ke?t.emergencyPoints(this.riderMinute):0).reduce((t,n)=>t+n,0)}get disqualified(){return this.checkpoints.some(t=>t.disqualified(this.riderMinute))}}function Be(e){let t,n;return t=new Se({props:{value:e[0].seconds,class:e[2],attrs:{size:"2",style:"width:2em",min:"0",max:"59",defaultValue:"30",numeric:!0}}}),t.$on("value",e[9]),{c(){Y(t.$$.fragment)},m(i,u){H(t,i,u),n=!0},p(i,u){const l={};u&1&&(l.value=i[0].seconds),u&4&&(l.class=i[2]),t.$set(l)},i(i){n||(M(t.$$.fragment,i),n=!0)},o(i){A(t.$$.fragment,i),n=!1},d(i){F(t,i)}}}function Pt(e){let t,n,i,u,l,o,r=e[1]+1+"",s,c,h,p,T,y,R,C,a,k,v,w,_,b,O,E,S,q,g,j,U;p=new Se({props:{initRow:Nt,value:e[0].minute,class:e[2],attrs:{size:"3",style:"width:2em"}}}),p.$on("value",e[8]);let K=e[0].type===L.Emergency&&Be(e);return{c(){t=m("tr"),n=m("td"),i=m("img"),l=N(),o=m("td"),s=ue(r),c=N(),h=m("td"),Y(p.$$.fragment),T=N(),y=m("td"),K&&K.c(),R=N(),C=m("td"),a=m("input"),v=N(),w=m("td"),_=m("input"),O=N(),E=m("td"),S=m("input"),Oe(i.src,u=e[3])||d(i,"src",u),d(i,"alt","Flag"),d(i,"class","svelte-1ym5x0u"),d(n,"class","svelte-1ym5x0u"),d(o,"class","svelte-1ym5x0u"),d(h,"class","svelte-1ym5x0u"),d(y,"class","svelte-1ym5x0u"),d(a,"class",k=le(e[2])+" svelte-1ym5x0u"),a.disabled=!0,a.value=e[5],d(a,"size","3"),re(a,"width","2em"),d(C,"class","svelte-1ym5x0u"),d(_,"class",b=le(e[2])+" svelte-1ym5x0u"),_.disabled=!0,_.value=e[4],d(_,"size","4"),re(_,"width","3em"),d(w,"class","svelte-1ym5x0u"),d(S,"type","checkbox"),d(S,"class","svelte-1ym5x0u"),d(E,"class","svelte-1ym5x0u"),d(t,"class",q=le(e[2])+" svelte-1ym5x0u")},m(P,z){V(P,t,z),f(t,n),f(n,i),f(t,l),f(t,o),f(o,s),f(t,c),f(t,h),H(p,h,null),f(t,T),f(t,y),K&&K.m(y,null),f(t,R),f(t,C),f(C,a),f(t,v),f(t,w),f(w,_),f(t,O),f(t,E),f(E,S),S.checked=e[0].drop,g=!0,j||(U=[W(i,"click",e[6]),W(i,"keydown",Rt),W(S,"change",e[10])],j=!0)},p(P,[z]){(!g||z&8&&!Oe(i.src,u=P[3]))&&d(i,"src",u),(!g||z&2)&&r!==(r=P[1]+1+"")&&be(s,r);const te={};z&1&&(te.value=P[0].minute),z&4&&(te.class=P[2]),p.$set(te),P[0].type===L.Emergency?K?(K.p(P,z),z&1&&M(K,1)):(K=Be(P),K.c(),M(K,1),K.m(y,null)):K&&(we(),A(K,1,1,()=>{K=null}),ke()),(!g||z&4&&k!==(k=le(P[2])+" svelte-1ym5x0u"))&&d(a,"class",k),(!g||z&32&&a.value!==P[5])&&(a.value=P[5]),(!g||z&4&&b!==(b=le(P[2])+" svelte-1ym5x0u"))&&d(_,"class",b),(!g||z&16&&_.value!==P[4])&&(_.value=P[4]),z&1&&(S.checked=P[0].drop),(!g||z&4&&q!==(q=le(P[2])+" svelte-1ym5x0u"))&&d(t,"class",q)},i(P){g||(M(p.$$.fragment,P),M(K),g=!0)},o(P){A(p.$$.fragment,P),A(K),g=!1},d(P){P&&I(t),F(p),K&&K.d(),j=!1,Q(U)}}}function Nt(e){e.focus()}const Rt=()=>{};function Dt(e,t,n){let i,u,l,o,{check:r}=t,{index:s}=t,{riderMinute:c}=t;function h(v){const w=parseInt(v.minute);if(isNaN(w))return null;switch(v.type){case L.Emergency:const _=parseInt(v.seconds);if(!isNaN(_))return new Ke(w,_);break;case L.Known:return new $e(w);case L.Secret:return new je(w);case L.Start:return new De(w)}return null}function p(v,w){const _=h(v);return _?_.points(w):0}function T(v,w){const _=h(v);return _&&_.type===L.Emergency?_.emergencyPoints(w):0}function y(v){return{[L.Start]:"./images/start.gif",[L.Known]:"./images/known.gif",[L.Secret]:"./images/secret.gif",[L.Emergency]:"./images/emergency.gif"}[v.type]}function R(){n(0,r.type=(r.type+1)%4,r)}const C=v=>{n(0,r.minute=v.detail.value,r)},a=v=>{n(0,r.seconds=v.detail.value,r)};function k(){r.drop=this.checked,n(0,r)}return e.$$set=v=>{"check"in v&&n(0,r=v.check),"index"in v&&n(1,s=v.index),"riderMinute"in v&&n(7,c=v.riderMinute)},e.$$.update=()=>{e.$$.dirty&129&&n(5,i=p(r,c)),e.$$.dirty&129&&n(4,u=T(r,c)),e.$$.dirty&1&&n(3,l=y(r)),e.$$.dirty&1&&n(2,o=r.drop?"dropped":"")},[r,s,o,l,u,i,R,c,C,a,k]}class jt extends ee{constructor(t){super(),x(this,t,Dt,Pt,$,{check:0,index:1,riderMinute:7})}}function Kt(e){let t,n,i,u,l,o,r,s,c,h,p,T,y,R,C,a;return{c(){t=m("table"),n=m("tbody"),i=m("tr"),i.innerHTML=`<th class="svelte-l64quj">Checks</th> 
            <th class="svelte-l64quj">Points</th> 
            <th class="svelte-l64quj">Emergency<br/>Points</th> 
            <th class="svelte-l64quj">Disqualified</th>`,u=N(),l=m("tr"),o=m("td"),r=m("input"),s=N(),c=m("td"),h=m("input"),p=N(),T=m("td"),y=m("input"),R=N(),C=m("td"),a=m("input"),d(r,"id","checks"),r.disabled=!0,r.value=e[0],d(r,"size","2"),re(r,"width","2em"),d(r,"class","svelte-l64quj"),d(o,"class","svelte-l64quj"),d(h,"id","points"),h.disabled=!0,h.value=e[1],d(h,"size","4"),re(h,"width","3em"),d(h,"class","svelte-l64quj"),d(c,"class","svelte-l64quj"),d(y,"id","emergencyPoints"),y.disabled=!0,y.value=e[2],d(y,"size","4"),re(y,"width","3em"),d(y,"class","svelte-l64quj"),d(T,"class","svelte-l64quj"),d(a,"id","disqualified"),a.disabled=!0,a.value=e[3],d(a,"size","4"),re(a,"width","3em"),d(a,"class","svelte-l64quj"),d(C,"class","svelte-l64quj"),re(t,"margin","auto")},m(k,v){V(k,t,v),f(t,n),f(n,i),f(n,u),f(n,l),f(l,o),f(o,r),f(l,s),f(l,c),f(c,h),f(l,p),f(l,T),f(T,y),f(l,R),f(l,C),f(C,a)},p(k,[v]){v&1&&r.value!==k[0]&&(r.value=k[0]),v&2&&h.value!==k[1]&&(h.value=k[1]),v&4&&y.value!==k[2]&&(y.value=k[2]),v&8&&a.value!==k[3]&&(a.value=k[3])},i:ne,o:ne,d(k){k&&I(t)}}}function Mt(e,t,n){let{totalChecks:i}=t,{points:u}=t,{emergencyPoints:l}=t,{disqualified:o}=t;return e.$$set=r=>{"totalChecks"in r&&n(0,i=r.totalChecks),"points"in r&&n(1,u=r.points),"emergencyPoints"in r&&n(2,l=r.emergencyPoints),"disqualified"in r&&n(3,o=r.disqualified)},[i,u,l,o]}class Ot extends ee{constructor(t){super(),x(this,t,Mt,Kt,$,{totalChecks:0,points:1,emergencyPoints:2,disqualified:3})}}function Ve(e,t,n){const i=e.slice();return i[16]=t[n],i[17]=t,i[18]=n,i}function Ye(e){let t,n,i;function u(o){e[9](o,e[16],e[17],e[18])}let l={riderMinute:e[0],index:e[18]};return e[16]!==void 0&&(l.check=e[16]),t=new jt({props:l}),G.push(()=>Z(t,"check",u)),{c(){Y(t.$$.fragment)},m(o,r){H(t,o,r),i=!0},p(o,r){e=o;const s={};r&1&&(s.riderMinute=e[0]),!n&&r&2&&(n=!0,s.check=e[16],X(()=>n=!1)),t.$set(s)},i(o){i||(M(t.$$.fragment,o),i=!0)},o(o){A(t.$$.fragment,o),i=!1},d(o){F(t,o)}}}function At(e){let t,n,i,u,l,o,r,s,c,h,p,T,y,R,C,a,k,v,w,_,b,O;i=new Se({props:{value:e[0],attrs:{size:"3",min:"1",style:"width:3em",numeric:!0}}}),i.$on("value",e[8]);let E=e[1],S=[];for(let g=0;g<E.length;g+=1)S[g]=Ye(Ve(e,E,g));const q=g=>A(S[g],1,1,()=>{S[g]=null});return y=new Ot({props:{totalChecks:e[3],points:e[5],emergencyPoints:e[4],disqualified:e[2]}}),{c(){t=m("div"),n=ue("Rider Minute: "),Y(i.$$.fragment),u=N(),l=m("table"),o=m("thead"),o.innerHTML=`<tr><th class="svelte-1976845"></th> 
            <th class="svelte-1976845">#</th> 
            <th class="svelte-1976845">Minute</th> 
            <th class="svelte-1976845">Second</th> 
            <th class="svelte-1976845">Points</th> 
            <th class="svelte-1976845">Emergency<br/>Points</th> 
            <th class="svelte-1976845">Drop</th></tr>`,r=N(),s=m("tbody");for(let g=0;g<S.length;g+=1)S[g].c();c=N(),h=m("tfoot"),p=m("tr"),T=m("td"),Y(y.$$.fragment),R=N(),C=m("tr"),a=m("th"),k=m("button"),k.textContent="Add a Check",v=N(),w=m("button"),w.textContent="Reset",d(t,"id","riderMinute"),d(t,"class","svelte-1976845"),d(T,"colspan","7"),d(k,"id","addCheck"),d(w,"id","reset"),d(a,"colspan","7"),d(a,"class","svelte-1976845"),d(h,"class","svelte-1976845"),d(l,"class","svelte-1976845")},m(g,j){V(g,t,j),f(t,n),H(i,t,null),V(g,u,j),V(g,l,j),f(l,o),f(l,r),f(l,s);for(let U=0;U<S.length;U+=1)S[U].m(s,null);f(l,c),f(l,h),f(h,p),f(p,T),H(y,T,null),f(h,R),f(h,C),f(C,a),f(a,k),f(a,v),f(a,w),_=!0,b||(O=[W(k,"click",e[6]),W(w,"click",e[7])],b=!0)},p(g,[j]){const U={};if(j&1&&(U.value=g[0]),i.$set(U),j&3){E=g[1];let P;for(P=0;P<E.length;P+=1){const z=Ve(g,E,P);S[P]?(S[P].p(z,j),M(S[P],1)):(S[P]=Ye(z),S[P].c(),M(S[P],1),S[P].m(s,null))}for(we(),P=E.length;P<S.length;P+=1)q(P);ke()}const K={};j&8&&(K.totalChecks=g[3]),j&32&&(K.points=g[5]),j&16&&(K.emergencyPoints=g[4]),j&4&&(K.disqualified=g[2]),y.$set(K)},i(g){if(!_){M(i.$$.fragment,g);for(let j=0;j<E.length;j+=1)M(S[j]);M(y.$$.fragment,g),_=!0}},o(g){A(i.$$.fragment,g),S=S.filter(Boolean);for(let j=0;j<S.length;j+=1)A(S[j]);A(y.$$.fragment,g),_=!1},d(g){g&&I(t),F(i),g&&I(u),g&&I(l),We(S,g),F(y),b=!1,Q(O)}}}function It(e){return e.length-e.filter(t=>t.drop).length}function zt(e,t,n){let i,u,l,o,r=1,s=c(1);function c(w){const _=[];for(let b=0;b<w;b++)_.push({type:L.Secret,minute:r,seconds:30,drop:!1});return _}function h(){console.log(r),n(1,s[s.length]={type:L.Secret,minute:r,seconds:30,drop:!1},s)}function p(){window.confirm("Are you sure you want to reset the score card?")&&(n(0,r=1),n(1,s=c(1)))}function T(w){const _=parseInt(w.minute);if(isNaN(_))return null;switch(w.type){case L.Emergency:const b=parseInt(w.seconds);if(!isNaN(b))return new Ke(_,b);break;case L.Known:return new $e(_);case L.Secret:return new je(_);case L.Start:return new De(_)}return null}function y(w,_){if(w<1)return null;const b=new Ct(w);for(let O of _){const E=T(O);!O.drop&&E&&b.checkpoints.push(E)}return b}function R(w,_){const b=y(w,_);return b?b.points:"0"}function C(w,_){const b=y(w,_);return b?b.emergencyPoints:"0"}function a(w,_){const b=y(w,_);return b&&b.disqualified?"YES":"NO"}const k=w=>{n(0,r=w.detail.value)};function v(w,_,b,O){b[O]=w,n(1,s)}return e.$$.update=()=>{e.$$.dirty&3&&n(5,i=R(r,s)),e.$$.dirty&3&&n(4,u=C(r,s)),e.$$.dirty&2&&n(3,l=It(s)),e.$$.dirty&3&&n(2,o=a(r,s))},[r,s,o,l,u,i,h,p,k,v]}class Lt extends ee{constructor(t){super(),x(this,t,zt,At,$,{})}}function Ht(e){let t,n,i,u,l,o,r;return o=new Lt({}),{c(){t=m("div"),n=m("h2"),n.textContent="Time Keeper Enduro",i=N(),u=m("p"),u.textContent="Tap Flags to change check type.",l=N(),Y(o.$$.fragment),d(t,"id","timeKeeper")},m(s,c){V(s,t,c),f(t,n),f(t,i),f(t,u),f(t,l),H(o,t,null),r=!0},i(s){r||(M(o.$$.fragment,s),r=!0)},o(s){A(o.$$.fragment,s),r=!1},d(s){s&&I(t),F(o)}}}function Ft(e){let t,n,i,u,l,o,r;return o=new qt({}),{c(){t=m("div"),n=m("h2"),n.textContent="Sprint Enduro",i=N(),u=m("p"),u.innerHTML="Enter <b>Hours</b> in 24 Hour Time, e.g. 2PM == 14",l=N(),Y(o.$$.fragment),d(t,"id","sprint")},m(s,c){V(s,t,c),f(t,n),f(t,i),f(t,u),f(t,l),H(o,t,null),r=!0},i(s){r||(M(o.$$.fragment,s),r=!0)},o(s){A(o.$$.fragment,s),r=!1},d(s){s&&I(t),F(o)}}}function Ut(e){let t,n,i,u,l,o,r,s,c,h,p,T,y,R,C,a,k,v,w,_,b;const O=[Ft,Ht],E=[];function S(q,g){return q[0]==="sprint"?0:1}return k=S(e),v=E[k]=O[k](e),{c(){t=m("meta"),n=m("meta"),i=m("link"),u=m("meta"),l=m("link"),o=N(),r=m("main"),s=m("center"),c=m("h1"),c.textContent="Enduro Time Card",h=N(),p=m("p"),p.textContent=`You can verify your Enduro score cards using this tool. Why would
      you do that?  Because races are busy places and with hundreds of riders,
      those hard working club members sometimes enter something incorrectly.`,T=N(),y=m("button"),y.textContent="Sprint",R=N(),C=m("button"),C.textContent="Time Keeper",a=N(),v.c(),d(t,"name","apple-mobile-web-app-capable"),d(t,"content","yes"),d(n,"name","viewport"),d(n,"content","width=device-width, initial-scale=1, maximum-scale=1"),d(i,"rel","apple-touch-icon"),d(i,"href",dt),d(u,"name","apple-mobile-web-app-title"),d(u,"content","Enduro Time Card"),d(l,"red","manifest"),d(l,"crossorigin","use-credentials"),d(l,"href","manifest.json"),d(y,"class","svelte-py93mz"),oe(y,"selected",e[0]==="sprint"),d(C,"class","svelte-py93mz"),oe(C,"selected",e[0]==="timeKeeper")},m(q,g){f(document.head,t),f(document.head,n),f(document.head,i),f(document.head,u),f(document.head,l),V(q,o,g),V(q,r,g),f(r,s),f(s,c),f(s,h),f(s,p),f(s,T),f(s,y),f(s,R),f(s,C),f(s,a),E[k].m(s,null),w=!0,_||(b=[W(y,"click",e[2]),W(C,"click",e[3])],_=!0)},p(q,[g]){(!w||g&1)&&oe(y,"selected",q[0]==="sprint"),(!w||g&1)&&oe(C,"selected",q[0]==="timeKeeper");let j=k;k=S(q),k!==j&&(we(),A(E[j],1,1,()=>{E[j]=null}),ke(),v=E[k],v||(v=E[k]=O[k](q),v.c()),M(v,1),v.m(s,null))},i(q){w||(M(v),w=!0)},o(q){A(v),w=!1},d(q){I(t),I(n),I(i),I(u),I(l),q&&I(o),q&&I(r),E[k].d(),_=!1,Q(b)}}}function Bt(e,t,n){let i="sprint";function u(r){i!==r&&window.confirm("Switching time cards will lose all data. Are you sure?")&&n(0,i=r)}return[i,u,()=>u("sprint"),()=>u("timeKeeper")]}class Vt extends ee{constructor(t){super(),x(this,t,Bt,Ut,$,{})}}new Vt({target:document.getElementById("app")});
