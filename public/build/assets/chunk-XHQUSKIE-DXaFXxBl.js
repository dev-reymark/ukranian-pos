import{R as ve,r as f,w as Oe,p as be,l as $e,k as R,m as me,o as ue,s as Ie}from"./app-CU-WO1ha.js";function Ke(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}function De(e,t,r){Ke(e,t),t.set(e,r)}const A=typeof document<"u"?ve.useLayoutEffect:()=>{};function k(e){const t=f.useRef(null);return A(()=>{t.current=e},[e]),f.useCallback((...r)=>{const i=t.current;return i==null?void 0:i(...r)},[])}function _e(e){let[t,r]=f.useState(e),i=f.useRef(null),o=k(()=>{if(!i.current)return;let l=i.current.next();if(l.done){i.current=null;return}t===l.value?o():r(l.value)});A(()=>{i.current&&o()});let c=k(l=>{i.current=l(t),o()});return[t,c]}let He=!!(typeof window<"u"&&window.document&&window.document.createElement),Y=new Map;function We(e){let[t,r]=f.useState(e),i=f.useRef(null),o=Oe(t),c=f.useCallback(l=>{i.current=l},[]);return He&&Y.set(o,c),A(()=>{let l=o;return()=>{Y.delete(l)}},[o]),f.useEffect(()=>{let l=i.current;l&&(i.current=null,r(l))}),o}function Ae(e,t){if(e===t)return e;let r=Y.get(e);if(r)return r(t),t;let i=Y.get(t);return i?(i(e),e):t}function lt(e=[]){let t=We(),[r,i]=_e(t),o=f.useCallback(()=>{i(function*(){yield t,yield document.getElementById(t)?t:void 0})},[t,i]);return A(o,[t,o,...e]),r}function ye(...e){return(...t)=>{for(let r of e)typeof r=="function"&&r(...t)}}const T=e=>{var t;return(t=e==null?void 0:e.ownerDocument)!==null&&t!==void 0?t:document},P=e=>e&&"window"in e&&e.window===e?e:T(e).defaultView||window;function Te(e){var t,r,i="";if(typeof e=="string"||typeof e=="number")i+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(r=Te(e[t]))&&(i&&(i+=" "),i+=r)}else for(r in e)e[r]&&(i&&(i+=" "),i+=r);return i}function Ue(){for(var e,t,r=0,i="",o=arguments.length;r<o;r++)(e=arguments[r])&&(t=Te(e))&&(i&&(i+=" "),i+=t);return i}function he(...e){let t={...e[0]};for(let r=1;r<e.length;r++){let i=e[r];for(let o in i){let c=t[o],l=i[o];typeof c=="function"&&typeof l=="function"&&o[0]==="o"&&o[1]==="n"&&o.charCodeAt(2)>=65&&o.charCodeAt(2)<=90?t[o]=ye(c,l):(o==="className"||o==="UNSAFE_className")&&typeof c=="string"&&typeof l=="string"?t[o]=Ue(c,l):o==="id"&&c&&l?t.id=Ae(c,l):t[o]=l!==void 0?l:c}}return t}let H=new Map,te=new Set;function le(){if(typeof window>"u")return;function e(i){return"propertyName"in i}let t=i=>{if(!e(i)||!i.target)return;let o=H.get(i.target);o||(o=new Set,H.set(i.target,o),i.target.addEventListener("transitioncancel",r,{once:!0})),o.add(i.propertyName)},r=i=>{if(!e(i)||!i.target)return;let o=H.get(i.target);if(o&&(o.delete(i.propertyName),o.size===0&&(i.target.removeEventListener("transitioncancel",r),H.delete(i.target)),H.size===0)){for(let c of te)c();te.clear()}};document.body.addEventListener("transitionrun",t),document.body.addEventListener("transitionend",r)}typeof document<"u"&&(document.readyState!=="loading"?le():document.addEventListener("DOMContentLoaded",le));function Ve(e){requestAnimationFrame(()=>{H.size===0?e():te.add(e)})}function Be(){let e=f.useRef(new Map),t=f.useCallback((o,c,l,v)=>{let p=v!=null&&v.once?(...$)=>{e.current.delete(l),l(...$)}:l;e.current.set(l,{type:c,eventTarget:o,fn:p,options:v}),o.addEventListener(c,l,v)},[]),r=f.useCallback((o,c,l,v)=>{var p;let $=((p=e.current.get(l))===null||p===void 0?void 0:p.fn)||l;o.removeEventListener(c,$,v),e.current.delete(l)},[]),i=f.useCallback(()=>{e.current.forEach((o,c)=>{r(o.eventTarget,o.type,c,o.options)})},[r]);return f.useEffect(()=>i,[i]),{addGlobalListener:t,removeGlobalListener:r,removeAllGlobalListeners:i}}function Re(e,t){A(()=>{if(e&&e.ref&&t)return e.ref.current=t.current,()=>{e.ref&&(e.ref.current=null)}})}function re(e){return e.mozInputSource===0&&e.isTrusted?!0:be()&&e.pointerType?e.type==="click"&&e.buttons===1:e.detail===0&&!e.pointerType}function Ge(e){return!be()&&e.width===0&&e.height===0||e.width===1&&e.height===1&&e.pressure===0&&e.detail===0&&e.pointerType==="mouse"}let W="default",ne="",z=new WeakMap;function ce(e){if($e()){if(W==="default"){const t=T(e);ne=t.documentElement.style.webkitUserSelect,t.documentElement.style.webkitUserSelect="none"}W="disabled"}else(e instanceof HTMLElement||e instanceof SVGElement)&&(z.set(e,e.style.userSelect),e.style.userSelect="none")}function G(e){if($e()){if(W!=="disabled")return;W="restoring",setTimeout(()=>{Ve(()=>{if(W==="restoring"){const t=T(e);t.documentElement.style.webkitUserSelect==="none"&&(t.documentElement.style.webkitUserSelect=ne||""),ne="",W="default"}})},300)}else if((e instanceof HTMLElement||e instanceof SVGElement)&&e&&z.has(e)){let t=z.get(e);e.style.userSelect==="none"&&(e.style.userSelect=t),e.getAttribute("style")===""&&e.removeAttribute("style"),z.delete(e)}}const Ee=ve.createContext({register:()=>{}});Ee.displayName="PressResponderContext";function je(e,t){return t.get?t.get.call(e):t.value}function Pe(e,t,r){if(!t.has(e))throw new TypeError("attempted to "+r+" private field on non-instance");return t.get(e)}function Ne(e,t){var r=Pe(e,t,"get");return je(e,r)}function ze(e,t,r){if(t.set)t.set.call(e,r);else{if(!t.writable)throw new TypeError("attempted to set read only private field");t.value=r}}function fe(e,t,r){var i=Pe(e,t,"set");return ze(e,i,r),r}function Ye(e){let t=f.useContext(Ee);if(t){let{register:r,...i}=t;e=he(i,e),r()}return Re(t,e.ref),e}var j=new WeakMap;class N{continuePropagation(){fe(this,j,!1)}get shouldStopPropagation(){return Ne(this,j)}constructor(t,r,i){De(this,j,{writable:!0,value:void 0}),fe(this,j,!0),this.type=t,this.pointerType=r,this.target=i.currentTarget,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.ctrlKey=i.ctrlKey,this.altKey=i.altKey}}const de=Symbol("linkClicked");function ct(e){let{onPress:t,onPressChange:r,onPressStart:i,onPressEnd:o,onPressUp:c,isDisabled:l,isPressed:v,preventFocusOnPress:p,shouldCancelOnPointerExit:$,allowTextSelectionOnPress:h,ref:ae,...Q}=Ye(e),[C,se]=f.useState(!1),O=f.useRef({isPressed:!1,ignoreEmulatedMouseEvents:!1,ignoreClickAfterPress:!1,didFirePressStart:!1,isTriggeringEvent:!1,activePointerId:null,target:null,isOverTarget:!1,pointerType:null}),{addGlobalListener:x,removeAllGlobalListeners:I}=Be(),w=k((n,d)=>{let E=O.current;if(l||E.didFirePressStart)return!1;let u=!0;if(E.isTriggeringEvent=!0,i){let g=new N("pressstart",d,n);i(g),u=g.shouldStopPropagation}return r&&r(!0),E.isTriggeringEvent=!1,E.didFirePressStart=!0,se(!0),u}),m=k((n,d,E=!0)=>{let u=O.current;if(!u.didFirePressStart)return!1;u.ignoreClickAfterPress=!0,u.didFirePressStart=!1,u.isTriggeringEvent=!0;let g=!0;if(o){let a=new N("pressend",d,n);o(a),g=a.shouldStopPropagation}if(r&&r(!1),se(!1),t&&E&&!l){let a=new N("press",d,n);t(a),g&&(g=a.shouldStopPropagation)}return u.isTriggeringEvent=!1,g}),K=k((n,d)=>{let E=O.current;if(l)return!1;if(c){E.isTriggeringEvent=!0;let u=new N("pressup",d,n);return c(u),E.isTriggeringEvent=!1,u.shouldStopPropagation}return!0}),F=k(n=>{let d=O.current;d.isPressed&&d.target&&(d.isOverTarget&&d.pointerType!=null&&m(L(d.target,n),d.pointerType,!1),d.isPressed=!1,d.isOverTarget=!1,d.activePointerId=null,d.pointerType=null,I(),h||G(d.target))}),B=k(n=>{$&&F(n)}),Ce=f.useMemo(()=>{let n=O.current,d={onKeyDown(u){if(Z(u.nativeEvent,u.currentTarget)&&u.currentTarget.contains(u.target)){var g;ge(u.target,u.key)&&u.preventDefault();let a=!0;if(!n.isPressed&&!u.repeat){n.target=u.currentTarget,n.isPressed=!0,a=w(u,"keyboard");let s=u.currentTarget,b=D=>{Z(D,s)&&!D.repeat&&s.contains(D.target)&&n.target&&K(L(n.target,D),"keyboard")};x(T(u.currentTarget),"keyup",ye(b,E),!0)}a&&u.stopPropagation(),u.metaKey&&me()&&((g=n.metaKeyEvents)===null||g===void 0||g.set(u.key,u.nativeEvent))}else u.key==="Meta"&&(n.metaKeyEvents=new Map)},onClick(u){if(!(u&&!u.currentTarget.contains(u.target))&&u&&u.button===0&&!n.isTriggeringEvent&&!ue.isOpening){let g=!0;if(l&&u.preventDefault(),!n.ignoreClickAfterPress&&!n.ignoreEmulatedMouseEvents&&!n.isPressed&&(n.pointerType==="virtual"||re(u.nativeEvent))){!l&&!p&&R(u.currentTarget);let a=w(u,"virtual"),s=K(u,"virtual"),b=m(u,"virtual");g=a&&s&&b}n.ignoreEmulatedMouseEvents=!1,n.ignoreClickAfterPress=!1,g&&u.stopPropagation()}}},E=u=>{var g;if(n.isPressed&&n.target&&Z(u,n.target)){var a;ge(u.target,u.key)&&u.preventDefault();let b=u.target;m(L(n.target,u),"keyboard",n.target.contains(b)),I(),u.key!=="Enter"&&oe(n.target)&&n.target.contains(b)&&!u[de]&&(u[de]=!0,ue(n.target,u,!1)),n.isPressed=!1,(a=n.metaKeyEvents)===null||a===void 0||a.delete(u.key)}else if(u.key==="Meta"&&(!((g=n.metaKeyEvents)===null||g===void 0)&&g.size)){var s;let b=n.metaKeyEvents;n.metaKeyEvents=void 0;for(let D of b.values())(s=n.target)===null||s===void 0||s.dispatchEvent(new KeyboardEvent("keyup",D))}};if(typeof PointerEvent<"u"){d.onPointerDown=s=>{if(s.button!==0||!s.currentTarget.contains(s.target))return;if(Ge(s.nativeEvent)){n.pointerType="virtual";return}ee(s.currentTarget)&&s.preventDefault(),n.pointerType=s.pointerType;let b=!0;n.isPressed||(n.isPressed=!0,n.isOverTarget=!0,n.activePointerId=s.pointerId,n.target=s.currentTarget,!l&&!p&&R(s.currentTarget),h||ce(n.target),b=w(s,n.pointerType),x(T(s.currentTarget),"pointermove",u,!1),x(T(s.currentTarget),"pointerup",g,!1),x(T(s.currentTarget),"pointercancel",a,!1)),b&&s.stopPropagation()},d.onMouseDown=s=>{s.currentTarget.contains(s.target)&&s.button===0&&(ee(s.currentTarget)&&s.preventDefault(),s.stopPropagation())},d.onPointerUp=s=>{!s.currentTarget.contains(s.target)||n.pointerType==="virtual"||s.button===0&&_(s,s.currentTarget)&&K(s,n.pointerType||s.pointerType)};let u=s=>{s.pointerId===n.activePointerId&&(n.target&&_(s,n.target)?!n.isOverTarget&&n.pointerType!=null&&(n.isOverTarget=!0,w(L(n.target,s),n.pointerType)):n.target&&n.isOverTarget&&n.pointerType!=null&&(n.isOverTarget=!1,m(L(n.target,s),n.pointerType,!1),B(s)))},g=s=>{s.pointerId===n.activePointerId&&n.isPressed&&s.button===0&&n.target&&(_(s,n.target)&&n.pointerType!=null?m(L(n.target,s),n.pointerType):n.isOverTarget&&n.pointerType!=null&&m(L(n.target,s),n.pointerType,!1),n.isPressed=!1,n.isOverTarget=!1,n.activePointerId=null,n.pointerType=null,I(),h||G(n.target))},a=s=>{F(s)};d.onDragStart=s=>{s.currentTarget.contains(s.target)&&F(s)}}else{d.onMouseDown=a=>{if(a.button!==0||!a.currentTarget.contains(a.target))return;if(ee(a.currentTarget)&&a.preventDefault(),n.ignoreEmulatedMouseEvents){a.stopPropagation();return}n.isPressed=!0,n.isOverTarget=!0,n.target=a.currentTarget,n.pointerType=re(a.nativeEvent)?"virtual":"mouse",!l&&!p&&R(a.currentTarget),w(a,n.pointerType)&&a.stopPropagation(),x(T(a.currentTarget),"mouseup",u,!1)},d.onMouseEnter=a=>{if(!a.currentTarget.contains(a.target))return;let s=!0;n.isPressed&&!n.ignoreEmulatedMouseEvents&&n.pointerType!=null&&(n.isOverTarget=!0,s=w(a,n.pointerType)),s&&a.stopPropagation()},d.onMouseLeave=a=>{if(!a.currentTarget.contains(a.target))return;let s=!0;n.isPressed&&!n.ignoreEmulatedMouseEvents&&n.pointerType!=null&&(n.isOverTarget=!1,s=m(a,n.pointerType,!1),B(a)),s&&a.stopPropagation()},d.onMouseUp=a=>{a.currentTarget.contains(a.target)&&!n.ignoreEmulatedMouseEvents&&a.button===0&&K(a,n.pointerType||"mouse")};let u=a=>{if(a.button===0){if(n.isPressed=!1,I(),n.ignoreEmulatedMouseEvents){n.ignoreEmulatedMouseEvents=!1;return}n.target&&_(a,n.target)&&n.pointerType!=null?m(L(n.target,a),n.pointerType):n.target&&n.isOverTarget&&n.pointerType!=null&&m(L(n.target,a),n.pointerType,!1),n.isOverTarget=!1}};d.onTouchStart=a=>{if(!a.currentTarget.contains(a.target))return;let s=Xe(a.nativeEvent);if(!s)return;n.activePointerId=s.identifier,n.ignoreEmulatedMouseEvents=!0,n.isOverTarget=!0,n.isPressed=!0,n.target=a.currentTarget,n.pointerType="touch",!l&&!p&&R(a.currentTarget),h||ce(n.target),w(a,n.pointerType)&&a.stopPropagation(),x(P(a.currentTarget),"scroll",g,!0)},d.onTouchMove=a=>{if(!a.currentTarget.contains(a.target))return;if(!n.isPressed){a.stopPropagation();return}let s=pe(a.nativeEvent,n.activePointerId),b=!0;s&&_(s,a.currentTarget)?!n.isOverTarget&&n.pointerType!=null&&(n.isOverTarget=!0,b=w(a,n.pointerType)):n.isOverTarget&&n.pointerType!=null&&(n.isOverTarget=!1,b=m(a,n.pointerType,!1),B(a)),b&&a.stopPropagation()},d.onTouchEnd=a=>{if(!a.currentTarget.contains(a.target))return;if(!n.isPressed){a.stopPropagation();return}let s=pe(a.nativeEvent,n.activePointerId),b=!0;s&&_(s,a.currentTarget)&&n.pointerType!=null?(K(a,n.pointerType),b=m(a,n.pointerType)):n.isOverTarget&&n.pointerType!=null&&(b=m(a,n.pointerType,!1)),b&&a.stopPropagation(),n.isPressed=!1,n.activePointerId=null,n.isOverTarget=!1,n.ignoreEmulatedMouseEvents=!0,n.target&&!h&&G(n.target),I()},d.onTouchCancel=a=>{a.currentTarget.contains(a.target)&&(a.stopPropagation(),n.isPressed&&F(a))};let g=a=>{n.isPressed&&a.target.contains(n.target)&&F({currentTarget:n.target,shiftKey:!1,ctrlKey:!1,metaKey:!1,altKey:!1})};d.onDragStart=a=>{a.currentTarget.contains(a.target)&&F(a)}}return d},[x,l,p,I,h,F,B,m,w,K]);return f.useEffect(()=>()=>{var n;h||G((n=O.current.target)!==null&&n!==void 0?n:void 0)},[h]),{isPressed:v||C,pressProps:he(Q,Ce)}}function oe(e){return e.tagName==="A"&&e.hasAttribute("href")}function Z(e,t){const{key:r,code:i}=e,o=t,c=o.getAttribute("role");return(r==="Enter"||r===" "||r==="Spacebar"||i==="Space")&&!(o instanceof P(o).HTMLInputElement&&!we(o,r)||o instanceof P(o).HTMLTextAreaElement||o.isContentEditable)&&!((c==="link"||!c&&oe(o))&&r!=="Enter")}function Xe(e){const{targetTouches:t}=e;return t.length>0?t[0]:null}function pe(e,t){const r=e.changedTouches;for(let i=0;i<r.length;i++){const o=r[i];if(o.identifier===t)return o}return null}function L(e,t){return{currentTarget:e,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,metaKey:t.metaKey,altKey:t.altKey}}function qe(e){let t=0,r=0;return e.width!==void 0?t=e.width/2:e.radiusX!==void 0&&(t=e.radiusX),e.height!==void 0?r=e.height/2:e.radiusY!==void 0&&(r=e.radiusY),{top:e.clientY-r,right:e.clientX+t,bottom:e.clientY+r,left:e.clientX-t}}function Je(e,t){return!(e.left>t.right||t.left>e.right||e.top>t.bottom||t.top>e.bottom)}function _(e,t){let r=t.getBoundingClientRect(),i=qe(e);return Je(r,i)}function ee(e){return!(e instanceof HTMLElement)||!e.hasAttribute("draggable")}function ge(e,t){return e instanceof HTMLInputElement?!we(e,t):e instanceof HTMLButtonElement?e.type!=="submit"&&e.type!=="reset":!oe(e)}const Qe=new Set(["checkbox","radio","range","color","file","image","button","submit","reset"]);function we(e,t){return e.type==="checkbox"||e.type==="radio"?t===" ":Qe.has(e.type)}class Ze{isDefaultPrevented(){return this.nativeEvent.defaultPrevented}preventDefault(){this.defaultPrevented=!0,this.nativeEvent.preventDefault()}stopPropagation(){this.nativeEvent.stopPropagation(),this.isPropagationStopped=()=>!0}isPropagationStopped(){return!1}persist(){}constructor(t,r){this.nativeEvent=r,this.target=r.target,this.currentTarget=r.currentTarget,this.relatedTarget=r.relatedTarget,this.bubbles=r.bubbles,this.cancelable=r.cancelable,this.defaultPrevented=r.defaultPrevented,this.eventPhase=r.eventPhase,this.isTrusted=r.isTrusted,this.timeStamp=r.timeStamp,this.type=t}}function Le(e){let t=f.useRef({isFocused:!1,observer:null});A(()=>{const i=t.current;return()=>{i.observer&&(i.observer.disconnect(),i.observer=null)}},[]);let r=k(i=>{e==null||e(i)});return f.useCallback(i=>{if(i.target instanceof HTMLButtonElement||i.target instanceof HTMLInputElement||i.target instanceof HTMLTextAreaElement||i.target instanceof HTMLSelectElement){t.current.isFocused=!0;let o=i.target,c=l=>{t.current.isFocused=!1,o.disabled&&r(new Ze("blur",l)),t.current.observer&&(t.current.observer.disconnect(),t.current.observer=null)};o.addEventListener("focusout",c,{once:!0}),t.current.observer=new MutationObserver(()=>{if(t.current.isFocused&&o.disabled){var l;(l=t.current.observer)===null||l===void 0||l.disconnect();let v=o===document.activeElement?null:document.activeElement;o.dispatchEvent(new FocusEvent("blur",{relatedTarget:v})),o.dispatchEvent(new FocusEvent("focusout",{bubbles:!0,relatedTarget:v}))}}),t.current.observer.observe(o,{attributes:!0,attributeFilter:["disabled"]})}},[r])}function et(e){let{isDisabled:t,onFocus:r,onBlur:i,onFocusChange:o}=e;const c=f.useCallback(p=>{if(p.target===p.currentTarget)return i&&i(p),o&&o(!1),!0},[i,o]),l=Le(c),v=f.useCallback(p=>{const $=T(p.target);p.target===p.currentTarget&&$.activeElement===p.target&&(r&&r(p),o&&o(!0),l(p))},[o,r,l]);return{focusProps:{onFocus:!t&&(r||o||i)?v:void 0,onBlur:!t&&(i||o)?c:void 0}}}let S=null,V=new Set,U=new Map,M=!1,ie=!1;const tt={Tab:!0,Escape:!0};function J(e,t){for(let r of V)r(e,t)}function rt(e){return!(e.metaKey||!me()&&e.altKey||e.ctrlKey||e.key==="Control"||e.key==="Shift"||e.key==="Meta")}function X(e){M=!0,rt(e)&&(S="keyboard",J("keyboard",e))}function y(e){S="pointer",(e.type==="mousedown"||e.type==="pointerdown")&&(M=!0,J("pointer",e))}function Se(e){re(e)&&(M=!0,S="virtual")}function ke(e){e.target===window||e.target===document||(!M&&!ie&&(S="virtual",J("virtual",e)),M=!1,ie=!1)}function xe(){M=!1,ie=!0}function q(e){if(typeof window>"u"||U.get(P(e)))return;const t=P(e),r=T(e);let i=t.HTMLElement.prototype.focus;t.HTMLElement.prototype.focus=function(){M=!0,i.apply(this,arguments)},r.addEventListener("keydown",X,!0),r.addEventListener("keyup",X,!0),r.addEventListener("click",Se,!0),t.addEventListener("focus",ke,!0),t.addEventListener("blur",xe,!1),typeof PointerEvent<"u"?(r.addEventListener("pointerdown",y,!0),r.addEventListener("pointermove",y,!0),r.addEventListener("pointerup",y,!0)):(r.addEventListener("mousedown",y,!0),r.addEventListener("mousemove",y,!0),r.addEventListener("mouseup",y,!0)),t.addEventListener("beforeunload",()=>{Fe(e)},{once:!0}),U.set(t,{focus:i})}const Fe=(e,t)=>{const r=P(e),i=T(e);t&&i.removeEventListener("DOMContentLoaded",t),U.has(r)&&(r.HTMLElement.prototype.focus=U.get(r).focus,i.removeEventListener("keydown",X,!0),i.removeEventListener("keyup",X,!0),i.removeEventListener("click",Se,!0),r.removeEventListener("focus",ke,!0),r.removeEventListener("blur",xe,!1),typeof PointerEvent<"u"?(i.removeEventListener("pointerdown",y,!0),i.removeEventListener("pointermove",y,!0),i.removeEventListener("pointerup",y,!0)):(i.removeEventListener("mousedown",y,!0),i.removeEventListener("mousemove",y,!0),i.removeEventListener("mouseup",y,!0)),U.delete(r))};function nt(e){const t=T(e);let r;return t.readyState!=="loading"?q(e):(r=()=>{q(e)},t.addEventListener("DOMContentLoaded",r)),()=>Fe(e,r)}typeof document<"u"&&nt();function Me(){return S!=="pointer"}function ft(){return S}function dt(e){S=e,J(e,null)}function pt(){q();let[e,t]=f.useState(S);return f.useEffect(()=>{let r=()=>{t(S)};return V.add(r),()=>{V.delete(r)}},[]),Ie()?null:e}const it=new Set(["checkbox","radio","range","color","file","image","button","submit","reset"]);function ot(e,t,r){var i;const o=typeof window<"u"?P(r==null?void 0:r.target).HTMLInputElement:HTMLInputElement,c=typeof window<"u"?P(r==null?void 0:r.target).HTMLTextAreaElement:HTMLTextAreaElement,l=typeof window<"u"?P(r==null?void 0:r.target).HTMLElement:HTMLElement,v=typeof window<"u"?P(r==null?void 0:r.target).KeyboardEvent:KeyboardEvent;return e=e||(r==null?void 0:r.target)instanceof o&&!it.has(r==null||(i=r.target)===null||i===void 0?void 0:i.type)||(r==null?void 0:r.target)instanceof c||(r==null?void 0:r.target)instanceof l&&(r==null?void 0:r.target.isContentEditable),!(e&&t==="keyboard"&&r instanceof v&&!tt[r.key])}function at(e,t,r){q(),f.useEffect(()=>{let i=(o,c)=>{ot(!!(r!=null&&r.isTextInput),o,c)&&e(Me())};return V.add(i),()=>{V.delete(i)}},t)}function st(e){let{isDisabled:t,onBlurWithin:r,onFocusWithin:i,onFocusWithinChange:o}=e,c=f.useRef({isFocusWithin:!1}),l=f.useCallback($=>{c.current.isFocusWithin&&!$.currentTarget.contains($.relatedTarget)&&(c.current.isFocusWithin=!1,r&&r($),o&&o(!1))},[r,o,c]),v=Le(l),p=f.useCallback($=>{!c.current.isFocusWithin&&document.activeElement===$.target&&(i&&i($),o&&o(!0),c.current.isFocusWithin=!0,v($))},[i,o,v]);return t?{focusWithinProps:{onFocus:void 0,onBlur:void 0}}:{focusWithinProps:{onFocus:p,onBlur:l}}}function gt(e={}){let{autoFocus:t=!1,isTextInput:r,within:i}=e,o=f.useRef({isFocused:!1,isFocusVisible:t||Me()}),[c,l]=f.useState(!1),[v,p]=f.useState(()=>o.current.isFocused&&o.current.isFocusVisible),$=f.useCallback(()=>p(o.current.isFocused&&o.current.isFocusVisible),[]),h=f.useCallback(C=>{o.current.isFocused=C,l(C),$()},[$]);at(C=>{o.current.isFocusVisible=C,$()},[],{isTextInput:r});let{focusProps:ae}=et({isDisabled:i,onFocusChange:h}),{focusWithinProps:Q}=st({isDisabled:!i,onFocusWithinChange:h});return{isFocused:c,isFocusVisible:v,focusProps:i?Q:ae}}var vt=["outline-none","data-[focus-visible=true]:z-10","data-[focus-visible=true]:outline-2","data-[focus-visible=true]:outline-focus","data-[focus-visible=true]:outline-offset-2"],bt=["outline-none","group-data-[focus-visible=true]:z-10","group-data-[focus-visible=true]:ring-2","group-data-[focus-visible=true]:ring-focus","group-data-[focus-visible=true]:ring-offset-2","group-data-[focus-visible=true]:ring-offset-background"],$t=["outline-none","ring-2","ring-focus","ring-offset-2","ring-offset-background"],mt=["absolute","top-1/2","left-1/2","-translate-x-1/2","-translate-y-1/2"],yt={default:["[&+.border-medium.border-default]:ms-[calc(theme(borderWidth.medium)*-1)]"],primary:["[&+.border-medium.border-primary]:ms-[calc(theme(borderWidth.medium)*-1)]"],secondary:["[&+.border-medium.border-secondary]:ms-[calc(theme(borderWidth.medium)*-1)]"],success:["[&+.border-medium.border-success]:ms-[calc(theme(borderWidth.medium)*-1)]"],warning:["[&+.border-medium.border-warning]:ms-[calc(theme(borderWidth.medium)*-1)]"],danger:["[&+.border-medium.border-danger]:ms-[calc(theme(borderWidth.medium)*-1)]"]};export{gt as $,De as _,he as a,ct as b,We as c,vt as d,ye as e,A as f,bt as g,lt as h,ft as i,st as j,k,Be as l,pt as m,Me as n,P as o,dt as p,Ee as q,$t as r,T as s,mt as t,yt as u,Ve as v,et as w,Re as x};