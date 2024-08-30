import{r as i,e as E,j as n,Y as Xe,a as ae}from"./app-BYi9tuF7.js";import{S as Ye}from"./sweetalert2.all-CTmfw0jT.js";import{F as Ge}from"./PumpDelivery-C8rgAp5Q.js";import qe from"./MOPCard-s0IcKNg0.js";import Qe,{buttons as We}from"./POSKeyboard-CR2_mGO0.js";import{PumpCard as Ke}from"./PumpCard-DJ-_97QN.js";import{CustomerDetails as Ze}from"./CustomerDetails-Cjr1g3XQ.js";import{PrinterStatus as et}from"./PrinterStatus-eOyPZqCp.js";import{GetCashier as tt}from"./GetCashier-qUjpQqBs.js";import{GetDateTime as st}from"./GetDateTime-BEt1Fd8D.js";import{ThemeSwitcher as at}from"./ThemeSwitcher-DQ-Jpy8i.js";import ot from"./Index-BL1FAs1b.js";import{CardDetails as nt}from"./CardDetails-MxBSW66s.js";import{S as rt,t as it,a as ce}from"./SaleWindowTabs-DxazKthQ.js";import lt from"./ReportsIndex-DESOqvyf.js";import{c as de}from"./chunk-H4VOEXHF-D8hGIvgC.js";import{c as ct}from"./chunk-J333S7JQ-Cxk5UjpG.js";import{c as dt}from"./chunk-5ALFRFZW-DWeaAOkY.js";import{s as ut}from"./chunk-IXXDDLGU-D3vfhPpI.js";import{i as Ce}from"./chunk-GQQM5TNQ-DVzymyfw.js";import"./iconBase-B62i2Whz.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-DcgP4m1g.js";import"./chunk-YRZGWF2W-KIFfQ5oN.js";import"./chunk-RQNQ5XFG-B478yn5k.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-XHQUSKIE-C0RpEu3F.js";import"./index-Bl3w9zLl.js";import"./FocusScope-BDx0lyY5.js";import"./useFocusable-CLUzAn8J.js";import"./useControlledState--ZzFRhQU.js";import"./index-Du5ZOa_8.js";import"./useToggleState-Dn7xOeo0.js";import"./useFormReset-BrJWIjys.js";import"./chunk-CAFRINWI-CcU5yOMx.js";import"./useFormValidationState-BtddyxEJ.js";import"./VisuallyHidden-DhxpZ2h2.js";import"./chunk-DBLREEYE-DcM24RjU.js";import"./chunk-6NL67ZRH-CBRxC36I.js";import"./index-DACJo6SB.js";import"./chunk-P2T5LMDM-CWhZwe9K.js";import"./useLabels-DH8MqdYW.js";import"./chunk-44JHHBS2-B1X7hIzv.js";import"./useLabel-D9HjlwO3.js";import"./useListState-CETM4wSq.js";import"./Icon-jT0sHoOM.js";import"./PumpStatus-5SYFXcQO.js";import"./index-CVdcG2D0.js";import"./chunk-4WFLSIHH-gmfPKLzN.js";import"./index-snb_Qqja.js";import"./chunk-M3MASYO7-BYPWylsw.js";import"./chunk-JHUBASYZ-9Uw73AKK.js";import"./ElectricJournal-Cq7j8IFR.js";import"./index-X92CTFGl.js";import"./AboutSoftware-P68TTCL3.js";import"./ApplicationLogo-Ink6fB3v.js";import"./chunk-NK4BRF7C-BS7y_hwM.js";function Pe(e){var t,a,s="";if(typeof e=="string"||typeof e=="number")s+=e;else if(typeof e=="object")if(Array.isArray(e)){var l=e.length;for(t=0;t<l;t++)e[t]&&(a=Pe(e[t]))&&(s&&(s+=" "),s+=a)}else for(a in e)e[a]&&(s&&(s+=" "),s+=a);return s}function ee(){for(var e,t,a=0,s="",l=arguments.length;a<l;a++)(e=arguments[a])&&(t=Pe(e))&&(s&&(s+=" "),s+=t);return s}const ie=e=>typeof e=="number"&&!isNaN(e),oe=e=>typeof e=="string",H=e=>typeof e=="function",me=e=>oe(e)||H(e)?e:null,Ee=e=>i.isValidElement(e)||oe(e)||H(e)||ie(e);function pt(e,t,a){a===void 0&&(a=300);const{scrollHeight:s,style:l}=e;requestAnimationFrame(()=>{l.minHeight="initial",l.height=s+"px",l.transition=`all ${a}ms`,requestAnimationFrame(()=>{l.height="0",l.padding="0",l.margin="0",setTimeout(t,a)})})}function ge(e){let{enter:t,exit:a,appendPosition:s=!1,collapse:l=!0,collapseDuration:g=300}=e;return function(o){let{children:T,position:v,preventExitTransition:N,done:m,nodeRef:w,isIn:C,playToast:O}=o;const h=s?`${t}--${v}`:t,f=s?`${a}--${v}`:a,S=i.useRef(0);return i.useLayoutEffect(()=>{const y=w.current,u=h.split(" "),c=b=>{b.target===w.current&&(O(),y.removeEventListener("animationend",c),y.removeEventListener("animationcancel",c),S.current===0&&b.type!=="animationcancel"&&y.classList.remove(...u))};y.classList.add(...u),y.addEventListener("animationend",c),y.addEventListener("animationcancel",c)},[]),i.useEffect(()=>{const y=w.current,u=()=>{y.removeEventListener("animationend",u),l?pt(y,m,g):m()};C||(N?u():(S.current=1,y.className+=` ${f}`,y.addEventListener("animationend",u)))},[C]),E.createElement(E.Fragment,null,T)}}function we(e,t){return e!=null?{content:e.content,containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,status:t}:{}}const R=new Map;let le=[];const Te=new Set,mt=e=>Te.forEach(t=>t(e)),Oe=()=>R.size>0;function je(e,t){var a;if(t)return!((a=R.get(t))==null||!a.isToastActive(e));let s=!1;return R.forEach(l=>{l.isToastActive(e)&&(s=!0)}),s}function De(e,t){Ee(e)&&(Oe()||le.push({content:e,options:t}),R.forEach(a=>{a.buildToast(e,t)}))}function _e(e,t){R.forEach(a=>{t!=null&&t!=null&&t.containerId?(t==null?void 0:t.containerId)===a.id&&a.toggle(e,t==null?void 0:t.id):a.toggle(e,t==null?void 0:t.id)})}function ft(e){const{subscribe:t,getSnapshot:a,setProps:s}=i.useRef(function(g){const o=g.containerId||1;return{subscribe(T){const v=function(m,w,C){let O=1,h=0,f=[],S=[],y=[],u=w;const c=new Map,b=new Set,B=()=>{y=Array.from(c.values()),b.forEach(p=>p())},z=p=>{S=p==null?[]:S.filter(I=>I!==p),B()},j=p=>{const{toastId:I,onOpen:k,updateId:U,children:X}=p.props,Q=U==null;p.staleId&&c.delete(p.staleId),c.set(I,p),S=[...S,p.props.toastId].filter(Y=>Y!==p.staleId),B(),C(we(p,Q?"added":"updated")),Q&&H(k)&&k(i.isValidElement(X)&&X.props)};return{id:m,props:u,observe:p=>(b.add(p),()=>b.delete(p)),toggle:(p,I)=>{c.forEach(k=>{I!=null&&I!==k.props.toastId||H(k.toggle)&&k.toggle(p)})},removeToast:z,toasts:c,clearQueue:()=>{h-=f.length,f=[]},buildToast:(p,I)=>{if((F=>{let{containerId:M,toastId:$,updateId:A}=F;const q=M?M!==m:m!==1,se=c.has($)&&A==null;return q||se})(I))return;const{toastId:k,updateId:U,data:X,staleId:Q,delay:Y}=I,W=()=>{z(k)},te=U==null;te&&h++;const V={...u,style:u.toastStyle,key:O++,...Object.fromEntries(Object.entries(I).filter(F=>{let[M,$]=F;return $!=null})),toastId:k,updateId:U,data:X,closeToast:W,isIn:!1,className:me(I.className||u.toastClassName),bodyClassName:me(I.bodyClassName||u.bodyClassName),progressClassName:me(I.progressClassName||u.progressClassName),autoClose:!I.isLoading&&(G=I.autoClose,K=u.autoClose,G===!1||ie(G)&&G>0?G:K),deleteToast(){const F=c.get(k),{onClose:M,children:$}=F.props;H(M)&&M(i.isValidElement($)&&$.props),C(we(F,"removed")),c.delete(k),h--,h<0&&(h=0),f.length>0?j(f.shift()):B()}};var G,K;V.closeButton=u.closeButton,I.closeButton===!1||Ee(I.closeButton)?V.closeButton=I.closeButton:I.closeButton===!0&&(V.closeButton=!Ee(u.closeButton)||u.closeButton);let Z=p;i.isValidElement(p)&&!oe(p.type)?Z=i.cloneElement(p,{closeToast:W,toastProps:V,data:X}):H(p)&&(Z=p({closeToast:W,toastProps:V,data:X}));const J={content:Z,props:V,staleId:Q};u.limit&&u.limit>0&&h>u.limit&&te?f.push(J):ie(Y)?setTimeout(()=>{j(J)},Y):j(J)},setProps(p){u=p},setToggle:(p,I)=>{c.get(p).toggle=I},isToastActive:p=>S.some(I=>I===p),getSnapshot:()=>u.newestOnTop?y.reverse():y}}(o,g,mt);R.set(o,v);const N=v.observe(T);return le.forEach(m=>De(m.content,m.options)),le=[],()=>{N(),R.delete(o)}},setProps(T){var v;(v=R.get(o))==null||v.setProps(T)},getSnapshot(){var T;return(T=R.get(o))==null?void 0:T.getSnapshot()}}}(e)).current;s(e);const l=i.useSyncExternalStore(t,a,a);return{getToastToRender:function(g){if(!l)return[];const o=new Map;return l.forEach(T=>{const{position:v}=T.props;o.has(v)||o.set(v,[]),o.get(v).push(T)}),Array.from(o,T=>g(T[0],T[1]))},isToastActive:je,count:l==null?void 0:l.length}}function gt(e){const[t,a]=i.useState(!1),[s,l]=i.useState(!1),g=i.useRef(null),o=i.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:T,pauseOnHover:v,closeToast:N,onClick:m,closeOnClick:w}=e;var C,O;function h(){a(!0)}function f(){a(!1)}function S(c){const b=g.current;o.canDrag&&b&&(o.didMove=!0,t&&f(),o.delta=e.draggableDirection==="x"?c.clientX-o.start:c.clientY-o.start,o.start!==c.clientX&&(o.canCloseOnClick=!1),b.style.transform=`translate3d(${e.draggableDirection==="x"?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`},0)`,b.style.opacity=""+(1-Math.abs(o.delta/o.removalDistance)))}function y(){document.removeEventListener("pointermove",S),document.removeEventListener("pointerup",y);const c=g.current;if(o.canDrag&&o.didMove&&c){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance)return l(!0),e.closeToast(),void e.collapseAll();c.style.transition="transform 0.2s, opacity 0.2s",c.style.removeProperty("transform"),c.style.removeProperty("opacity")}}(O=R.get((C={id:e.toastId,containerId:e.containerId,fn:a}).containerId||1))==null||O.setToggle(C.id,C.fn),i.useEffect(()=>{if(e.pauseOnFocusLoss)return document.hasFocus()||f(),window.addEventListener("focus",h),window.addEventListener("blur",f),()=>{window.removeEventListener("focus",h),window.removeEventListener("blur",f)}},[e.pauseOnFocusLoss]);const u={onPointerDown:function(c){if(e.draggable===!0||e.draggable===c.pointerType){o.didMove=!1,document.addEventListener("pointermove",S),document.addEventListener("pointerup",y);const b=g.current;o.canCloseOnClick=!0,o.canDrag=!0,b.style.transition="none",e.draggableDirection==="x"?(o.start=c.clientX,o.removalDistance=b.offsetWidth*(e.draggablePercent/100)):(o.start=c.clientY,o.removalDistance=b.offsetHeight*(e.draggablePercent===80?1.5*e.draggablePercent:e.draggablePercent)/100)}},onPointerUp:function(c){const{top:b,bottom:B,left:z,right:j}=g.current.getBoundingClientRect();c.nativeEvent.type!=="touchend"&&e.pauseOnHover&&c.clientX>=z&&c.clientX<=j&&c.clientY>=b&&c.clientY<=B?f():h()}};return T&&v&&(u.onMouseEnter=f,e.stacked||(u.onMouseLeave=h)),w&&(u.onClick=c=>{m&&m(c),o.canCloseOnClick&&N()}),{playToast:h,pauseToast:f,isRunning:t,preventExitTransition:s,toastRef:g,eventHandlers:u}}function ht(e){let{delay:t,isRunning:a,closeToast:s,type:l="default",hide:g,className:o,style:T,controlledProgress:v,progress:N,rtl:m,isIn:w,theme:C}=e;const O=g||v&&N===0,h={...T,animationDuration:`${t}ms`,animationPlayState:a?"running":"paused"};v&&(h.transform=`scaleX(${N})`);const f=ee("Toastify__progress-bar",v?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${C}`,`Toastify__progress-bar--${l}`,{"Toastify__progress-bar--rtl":m}),S=H(o)?o({rtl:m,type:l,defaultClassName:f}):ee(f,o),y={[v&&N>=1?"onTransitionEnd":"onAnimationEnd"]:v&&N<1?null:()=>{w&&s()}};return E.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":O},E.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${C} Toastify__progress-bar--${l}`}),E.createElement("div",{role:"progressbar","aria-hidden":O?"true":"false","aria-label":"notification timer",className:S,style:h,...y}))}let yt=1;const Le=()=>""+yt++;function vt(e){return e&&(oe(e.toastId)||ie(e.toastId))?e.toastId:Le()}function re(e,t){return De(e,t),t.toastId}function fe(e,t){return{...t,type:t&&t.type||e,toastId:vt(t)}}function ue(e){return(t,a)=>re(t,fe(e,a))}function d(e,t){return re(e,fe("default",t))}d.loading=(e,t)=>re(e,fe("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...t})),d.promise=function(e,t,a){let s,{pending:l,error:g,success:o}=t;l&&(s=oe(l)?d.loading(l,a):d.loading(l.render,{...a,...l}));const T={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},v=(m,w,C)=>{if(w==null)return void d.dismiss(s);const O={type:m,...T,...a,data:C},h=oe(w)?{render:w}:w;return s?d.update(s,{...O,...h}):d(h.render,{...O,...h}),C},N=H(e)?e():e;return N.then(m=>v("success",o,m)).catch(m=>v("error",g,m)),N},d.success=ue("success"),d.info=ue("info"),d.error=ue("error"),d.warning=ue("warning"),d.warn=d.warning,d.dark=(e,t)=>re(e,fe("default",{theme:"dark",...t})),d.dismiss=function(e){(function(t){var a;if(Oe()){if(t==null||oe(a=t)||ie(a))R.forEach(s=>{s.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){const s=R.get(t.containerId);s?s.removeToast(t.id):R.forEach(l=>{l.removeToast(t.id)})}}else le=le.filter(s=>t!=null&&s.options.toastId!==t)})(e)},d.clearWaitingQueue=function(e){e===void 0&&(e={}),R.forEach(t=>{!t.props.limit||e.containerId&&t.id!==e.containerId||t.clearQueue()})},d.isActive=je,d.update=function(e,t){t===void 0&&(t={});const a=((s,l)=>{var g;let{containerId:o}=l;return(g=R.get(o||1))==null?void 0:g.toasts.get(s)})(e,t);if(a){const{props:s,content:l}=a,g={delay:100,...s,...t,toastId:t.toastId||e,updateId:Le()};g.toastId!==e&&(g.staleId=e);const o=g.render||l;delete g.render,re(o,g)}},d.done=e=>{d.update(e,{progress:1})},d.onChange=function(e){return Te.add(e),()=>{Te.delete(e)}},d.play=e=>_e(!0,e),d.pause=e=>_e(!1,e);const bt=typeof window<"u"?i.useLayoutEffect:i.useEffect,pe=e=>{let{theme:t,type:a,isLoading:s,...l}=e;return E.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${a})`,...l})},xe={info:function(e){return E.createElement(pe,{...e},E.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return E.createElement(pe,{...e},E.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return E.createElement(pe,{...e},E.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return E.createElement(pe,{...e},E.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return E.createElement("div",{className:"Toastify__spinner"})}},xt=e=>{const{isRunning:t,preventExitTransition:a,toastRef:s,eventHandlers:l,playToast:g}=gt(e),{closeButton:o,children:T,autoClose:v,onClick:N,type:m,hideProgressBar:w,closeToast:C,transition:O,position:h,className:f,style:S,bodyClassName:y,bodyStyle:u,progressClassName:c,progressStyle:b,updateId:B,role:z,progress:j,rtl:p,toastId:I,deleteToast:k,isIn:U,isLoading:X,closeOnClick:Q,theme:Y}=e,W=ee("Toastify__toast",`Toastify__toast-theme--${Y}`,`Toastify__toast--${m}`,{"Toastify__toast--rtl":p},{"Toastify__toast--close-on-click":Q}),te=H(f)?f({rtl:p,position:h,type:m,defaultClassName:W}):ee(W,f),V=function(J){let{theme:F,type:M,isLoading:$,icon:A}=J,q=null;const se={theme:F,type:M};return A===!1||(H(A)?q=A({...se,isLoading:$}):i.isValidElement(A)?q=i.cloneElement(A,se):$?q=xe.spinner():(ye=>ye in xe)(M)&&(q=xe[M](se))),q}(e),G=!!j||!v,K={closeToast:C,type:m,theme:Y};let Z=null;return o===!1||(Z=H(o)?o(K):i.isValidElement(o)?i.cloneElement(o,K):function(J){let{closeToast:F,theme:M,ariaLabel:$="close"}=J;return E.createElement("button",{className:`Toastify__close-button Toastify__close-button--${M}`,type:"button",onClick:A=>{A.stopPropagation(),F(A)},"aria-label":$},E.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},E.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}(K)),E.createElement(O,{isIn:U,done:k,position:h,preventExitTransition:a,nodeRef:s,playToast:g},E.createElement("div",{id:I,onClick:N,"data-in":U,className:te,...l,style:S,ref:s},E.createElement("div",{...U&&{role:z},className:H(y)?y({type:m}):ee("Toastify__toast-body",y),style:u},V!=null&&E.createElement("div",{className:ee("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!X})},V),E.createElement("div",null,T)),Z,E.createElement(ht,{...B&&!G?{key:`pb-${B}`}:{},rtl:p,theme:Y,delay:v,isRunning:t,isIn:U,closeToast:C,hide:w,type:m,style:b,className:c,controlledProgress:G,progress:j||0})))},he=function(e,t){return t===void 0&&(t=!1),{enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:t}},Et=ge(he("bounce",!0));ge(he("slide",!0));const Tt=ge(he("zoom"));ge(he("flip"));const Nt={position:"top-right",transition:Et,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};function St(e){let t={...Nt,...e};const a=e.stacked,[s,l]=i.useState(!0),g=i.useRef(null),{getToastToRender:o,isToastActive:T,count:v}=ft(t),{className:N,style:m,rtl:w,containerId:C}=t;function O(f){const S=ee("Toastify__toast-container",`Toastify__toast-container--${f}`,{"Toastify__toast-container--rtl":w});return H(N)?N({position:f,rtl:w,defaultClassName:S}):ee(S,me(N))}function h(){a&&(l(!0),d.play())}return bt(()=>{if(a){var f;const S=g.current.querySelectorAll('[data-in="true"]'),y=12,u=(f=t.position)==null?void 0:f.includes("top");let c=0,b=0;Array.from(S).reverse().forEach((B,z)=>{const j=B;j.classList.add("Toastify__toast--stacked"),z>0&&(j.dataset.collapsed=`${s}`),j.dataset.pos||(j.dataset.pos=u?"top":"bot");const p=c*(s?.2:1)+(s?0:y*z);j.style.setProperty("--y",`${u?p:-1*p}px`),j.style.setProperty("--g",`${y}`),j.style.setProperty("--s",""+(1-(s?b:0))),c+=j.offsetHeight,b+=.025})}},[s,v,a]),E.createElement("div",{ref:g,className:"Toastify",id:C,onMouseEnter:()=>{a&&(l(!1),d.pause())},onMouseLeave:h},o((f,S)=>{const y=S.length?{...m}:{...m,pointerEvents:"none"};return E.createElement("div",{className:O(f),style:y,key:`container-${f}`},S.map(u=>{let{content:c,props:b}=u;return E.createElement(xt,{...b,stacked:a,collapseAll:h,isIn:T(b.toastId,b.containerId),style:b.style,key:`toast-${b.key}`},c)}))}))}function Ps(){const[e,t]=i.useState([]),[a,s]=i.useState(""),[l,g]=i.useState([]),[o,T]=i.useState([]),[v,N]=i.useState(!1),[m,w]=i.useState(()=>{const r=localStorage.getItem("deliveryData");return r?JSON.parse(r):[]}),[C,O]=i.useState(null),[h,f]=i.useState(!1),[S,y]=i.useState(!1),u=i.useRef(null),[c,b]=i.useState([]),[B,z]=i.useState(0),[j,p]=i.useState(!1),[I,k]=i.useState(0),[U,X]=i.useState(!1),[Q,Y]=i.useState(""),[W,te]=i.useState(""),[V,G]=i.useState(""),[K,Z]=i.useState(""),[J,F]=i.useState(""),[M,$]=i.useState(""),[A,q]=i.useState(""),se=async()=>{if((await Ye.fire({title:"Are you sure?",text:"You are about to log out and you won't be able to recover this session!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, log out!"})).isConfirmed)try{await ae.post("/logout"),window.location.href="/"}catch(x){console.error("Error logging out:",x)}},ye=()=>{X(!0)},Ne=()=>{X(!1)},Me=()=>{Ne()},ke=r=>{w(x=>{const D=[...x,r];return localStorage.setItem("deliveryData",JSON.stringify(D)),D})},Ae=()=>{s("")},Re=()=>{s(`Subtotal: ₱${ne}`)},$e=()=>{if(m.length===0){d.error("No transactions to void");return}w([]),localStorage.removeItem("transaction"),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),d.success("All transactions voided."),z(0),s(""),window.dispatchEvent(new Event("disabledIdsUpdated"))},Be=()=>{if(console.log("Selected Row:",C),C!==null){const r=m.filter(P=>P.Delivery_ID!==C);w(r),localStorage.setItem("deliveryData",JSON.stringify(r)),d.success("Transaction voided"),O(null);const x=r.reduce((P,L)=>P+parseFloat(L.Amount||0),0).toFixed(2),D=Math.max(0,B-x).toFixed(2);z(B),s(D);const _=localStorage.getItem("disabledIds");if(_){const P=new Set(JSON.parse(_));P.delete(C),localStorage.setItem("disabledIds",JSON.stringify(Array.from(P))),window.dispatchEvent(new Event("disabledIdsUpdated"))}}else d.error("No transaction selected")},Se=()=>{y(!0),window.removeEventListener("click",Se)};i.useEffect(()=>{window.addEventListener("click",Se);const r=()=>{ae.get("/get-pump-status").then(_=>{const P=_.data;g(P);const L=P.some(be=>be.Data.NozzleUp);S&&(L&&!h?(u.current&&(u.current.loop=!0,u.current.play().catch(be=>{console.error("Error playing sound:",be)})),f(!0)):!L&&h&&(u.current&&(u.current.pause(),u.current.currentTime=0),f(!1)))}).catch(_=>{console.error("Error fetching pump status:",_)})},x=()=>{ae.get("/get-mop").then(_=>{T(_.data.data);const P=e.some(L=>L.MOP_Ref==="3");N(P)}).catch(_=>{console.error("Error fetching MOP list:",_)})};r(),x();const D=setInterval(r,500);return()=>clearInterval(D)},[h,S]);const ze=r=>{s(x=>x+r),z(x=>x+r)},Fe=async()=>{try{const r=await ae.post("/stop-all-pumps");d.success("All pumps stopped successfully"),console.log("All pumps stopped:",r.data)}catch(r){d.error("Error stopping all pumps"),console.error("Error stopping all pumps:",r)}},Ie=async r=>{if(!r){d.error("Transaction ID is undefined");return}try{const D=(await ae.get(`/print-receipt/${r}`)).data}catch(x){d.error("Error fetching receipt data"),console.error("Error fetching receipt data:",x)}},He={handleLogout:se,handleVoid:Be,handleVoidAll:$e,setInputValue:s,handleClear:Ae,handleSubTotal:Re,handlePrintReceipt:Ie,handleStopAllPumps:Fe,handleOpenCustomerDetails:ye,handleOpenDrawer:async()=>{try{const r=await ae.get("/open-cash-drawer");d.success("Drawer opened successfully"),console.log("Drawer opened:",r.data)}catch(r){d.error("Error opening drawer"),console.error("Error opening drawer:",r.response?r.response.data:r.message)}}},Ve=async r=>{console.log("MOP selected:",r);const x=parseFloat(a.replace("₱","").replace(",",""));if(a===""||x<=0){d.error("Please enter an amount before selecting a method of payment.");return}const D=JSON.parse(localStorage.getItem("transaction"))||{subtotal:parseFloat(ne),payments:[],remainingBalance:parseFloat(ne)},_=D.remainingBalance-x;if(_>=0)D.payments.push({mopName:r.MOP_Name,amount:x}),D.remainingBalance=_,localStorage.setItem("transaction",JSON.stringify(D)),r.MOP_Ref==="3"?N(!0):_===0?await ve():s(`Amount Due: ₱${_.toFixed(2)}`);else{const P=Math.abs(_).toFixed(2);d.success(`Change: ₱${P}`),D.payments.push({mopName:r.MOP_Name,amount:x}),D.remainingBalance=0,localStorage.setItem("transaction",JSON.stringify(D)),s(`Change: ₱${P}`),s(`Change: ₱${P}`),r.MOP_Ref==="3"?N(!0):await ve()}},ne=m.reduce((r,x)=>r+parseFloat(x.Amount||0),0).toFixed(2),[Je,Ue]=i.useState({change:0,mopNames:[],mopPayments:[]}),ve=async()=>{const r=JSON.parse(localStorage.getItem("transaction"));if(!r){d.error("No transaction data found");return}if(c&&c.MOP_Ref==="3"&&(!J||!M||!A)){d.error("Please provide complete card details."),N(!0);return}const x=r.payments.reduce((_,P)=>_+P.amount,0),D=Math.max(0,x-r.subtotal).toFixed(2);try{const P=(await ae.post("/store-transactions",{subtotal:r.subtotal,taxTotal:r.subtotal/1.12*.12,change:parseFloat(D),mopNames:r.payments.map(L=>L.mopName.trim()),mopPayments:r.payments,deliveryIds:m.map(L=>({Delivery_ID:L.Delivery_ID,Pump:L.Pump,Nozzle:L.Nozzle,Volume:L.Volume,Price:L.Price,Amount:L.Amount,FuelGradeName:L.FuelGradeName})),customer:{name:Q,address:W,tin:V,businessStyle:K},cardDetails:{name:A,code:M,number:J}})).data.transaction;P?(localStorage.setItem("transactionId",P),d.success("Transaction saved successfully"),p(!0),k(0),s("Transaction Complete"),Ue({change:parseFloat(D),mopNames:r.payments.map(L=>L.mopName),mopPayments:r.payments}),localStorage.removeItem("transaction"),F(""),$(""),q(""),Ie(P)):d.error("Error retrieving transaction ID")}catch(_){d.error("Error saving transaction"),console.error("Error saving transaction:",_)}};return n.jsxs(n.Fragment,{children:[n.jsx(Xe,{title:"Home"}),n.jsx("audio",{ref:u,src:"assets/audio/nozzle-status-sound.wav"}),n.jsxs("main",{className:"grid grid-cols-2 gap-2 p-2 h-[100vh]",children:[n.jsxs(de,{className:"dark:bg-gray-900 p-2",children:[n.jsx("div",{className:"flex-none",children:n.jsxs(de,{className:"max-w-full h-full",children:[n.jsxs(ct,{className:"justify-between",children:[n.jsx(tt,{}),n.jsx(st,{})]}),n.jsx(dt,{className:"justify-between",children:n.jsxs("div",{className:"flex gap-4",children:[n.jsx("div",{className:"w-[70%] h-[70px] bg-slate-200 rounded-lg shadow-sm relative",children:n.jsx(St,{position:"top-right",autoClose:2e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"light",transition:Tt,style:{position:"absolute",top:0,right:0,bottom:0,left:0,width:"100%",height:"50%"}})}),n.jsx(et,{}),n.jsx(at,{})]})})]})}),n.jsx(ut,{y:3}),n.jsx("div",{className:"flex-grow",children:n.jsx(rt,{deliveryData:m,setSelectedRow:O,subtotal:ne,transactionSaved:j,transactionSummary:Je})}),n.jsx("div",{className:"flex-none",children:n.jsxs(de,{className:"w-full gap-2 p-2",children:[n.jsxs("div",{className:"flex gap-2",children:[n.jsx(Ce,{variant:"bordered",label:n.jsx("p",{className:"font-bold text-xl",children:"SUBTOTAL"}),size:"lg",value:`₱${ne}`,labelPlacement:"outside-left",className:"w-[40%]",classNames:{input:["text-black text-xl font-bold text-right"]},isReadOnly:!0}),n.jsx(Ce,{variant:"bordered",className:"w-[60%]",classNames:{input:["text-black text-2xl font-bold text-right"]},value:a,isReadOnly:!0,size:"lg"})]}),n.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-1",children:n.jsx(Qe,{handleButtonClick:ze,buttons:We,buttonClickHandlers:He,setInputValue:s})})]})})]}),n.jsx(de,{className:"dark:bg-gray-900 p-2",children:n.jsx("div",{className:"flex w-full flex-col",children:n.jsxs(it,{"aria-label":"Pumps",fullWidth:!0,children:[n.jsx(ce,{title:n.jsx("p",{className:"font-extrabold",children:"PUMPS"}),children:n.jsx(i.Suspense,{fallback:n.jsx("div",{children:"Loading..."}),children:l.length===0?n.jsx("div",{className:"flex items-center justify-center min-h-screen",children:n.jsxs("div",{className:"flex flex-col items-center mt-6",children:[n.jsx(Ge,{className:"w-12 h-12 text-danger"}),n.jsx("span",{className:"font-bold text-xl mt-4",children:"No pumps found!"})]})}):n.jsx("div",{className:"overflow-y-auto scrollbar-hide max-h-screen p-1",children:n.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2",children:l.map(r=>n.jsx(Ke,{pump:r,handleAppendDeliveryData:ke},r.Id))})})})},"pumps"),n.jsx(ce,{title:n.jsx("p",{className:"font-extrabold",children:"MOP"}),children:n.jsx(qe,{mopList:o,onSelectMOP:Ve})},"mop"),n.jsx(ce,{title:n.jsx("p",{className:"font-extrabold",children:"REPORTS"}),children:n.jsx(lt,{})},"reports"),n.jsx(ce,{title:n.jsx("p",{className:"font-extrabold",children:"CONFIG"}),children:n.jsx(ot,{})},"config")]})})})]}),n.jsx(Ze,{isOpen:U,onClose:Ne,onCustomerDataChange:(r,x)=>{switch(r){case"name":Y(x);break;case"address":te(x);break;case"tin":G(x);break;case"businessStyle":Z(x);break}},customerName:Q,customerAddress:W,customerTIN:V,customerBusinessStyle:K,onSave:Me,setCustomerName:Y,setCustomerAddress:te,setCustomerTIN:G,setCustomerBusinessStyle:Z}),n.jsx(nt,{isOpen:v,onOpenChange:N,cardNumber:J,setCardNumber:F,approvalCode:M,setApprovalCode:$,cardHolderName:A,setCardHolderName:q,onSave:async()=>{if(!J||!M||!A){d.error("Please fill in all card details.");return}N(!1),await ve()}})]})}export{Ps as default};
