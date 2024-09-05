import{r as y,k as ce,l as ae,$ as ue,f as ne,d as J,m as fe,n as de,e as Q}from"./app-BUG5qQgz.js";import{a as he,$ as ye}from"./FocusScope-C6FvHQAC.js";import{b as j}from"./useFocusable-DwsmypTm.js";import{a as pe,c as be,v as ve,f as re,d as X,o as V}from"./chunk-XHQUSKIE-Bem5Pt0d.js";import{$ as ge}from"./useControlledState-B_gnQ3BU.js";function Ke(s,e){const t=[];for(;s&&s!==document.documentElement;)he(s,e)&&t.push(s),s=s.parentElement;return t}let $e=0;const H=new Map;function Se(s){let[e,t]=y.useState();return pe(()=>{if(!s)return;let l=H.get(s);if(l)t(l.element.id);else{let i=`react-aria-description-${$e++}`;t(i);let n=document.createElement("div");n.id=i,n.style.display="none",n.textContent=s,document.body.appendChild(n),l={refCount:0,element:n},H.set(s,l)}return l.refCount++,()=>{l&&--l.refCount===0&&(l.element.remove(),H.delete(s))}},[s]),{"aria-describedby":s?e:void 0}}function me(s,e,t,l){let i=be(t),n=t==null;y.useEffect(()=>{if(n||!s.current)return;let c=s.current;return c.addEventListener(e,i,l),()=>{c.removeEventListener(e,i,l)}},[s,e,l,n,i])}function oe(s,e){let t=N(s,e,"left"),l=N(s,e,"top"),i=e.offsetWidth,n=e.offsetHeight,c=s.scrollLeft,d=s.scrollTop,{borderTopWidth:a,borderLeftWidth:p}=getComputedStyle(s),b=s.scrollLeft+parseInt(p,10),g=s.scrollTop+parseInt(a,10),u=b+s.clientWidth,h=g+s.clientHeight;t<=c?c=t-parseInt(p,10):t+i>u&&(c+=t+i-u),l<=g?d=l-parseInt(a,10):l+n>h&&(d+=l+n-h),s.scrollLeft=c,s.scrollTop=d}function N(s,e,t){const l=t==="left"?"offsetLeft":"offsetTop";let i=0;for(;e.offsetParent&&(i+=e[l],e.offsetParent!==s);){if(e.offsetParent.contains(s)){i-=s[l];break}e=e.offsetParent}return i}function _(s,e){if(document.contains(s)){let c=document.scrollingElement||document.documentElement;if(window.getComputedStyle(c).overflow==="hidden"){let a=Ke(s);for(let p of a)oe(p,s)}else{var t;let{left:a,top:p}=s.getBoundingClientRect();s==null||(t=s.scrollIntoView)===null||t===void 0||t.call(s,{block:"nearest"});let{left:b,top:g}=s.getBoundingClientRect();if(Math.abs(a-b)>1||Math.abs(p-g)>1){var l,i,n;e==null||(i=e.containingElement)===null||i===void 0||(l=i.scrollIntoView)===null||l===void 0||l.call(i,{block:"center",inline:"center"}),(n=s.scrollIntoView)===null||n===void 0||n.call(s,{block:"nearest"})}}}}const we=500;function xe(s){let{isDisabled:e,onLongPressStart:t,onLongPressEnd:l,onLongPress:i,threshold:n=we,accessibilityDescription:c}=s;const d=y.useRef();let{addGlobalListener:a,removeGlobalListener:p}=ve(),{pressProps:b}=re({isDisabled:e,onPressStart(u){if(u.continuePropagation(),(u.pointerType==="mouse"||u.pointerType==="touch")&&(t&&t({...u,type:"longpressstart"}),d.current=setTimeout(()=>{u.target.dispatchEvent(new PointerEvent("pointercancel",{bubbles:!0})),i&&i({...u,type:"longpress"}),d.current=void 0},n),u.pointerType==="touch")){let h=F=>{F.preventDefault()};a(u.target,"contextmenu",h,{once:!0}),a(window,"pointerup",()=>{setTimeout(()=>{p(u.target,"contextmenu",h)},30)},{once:!0})}},onPressEnd(u){d.current&&clearTimeout(d.current),l&&(u.pointerType==="mouse"||u.pointerType==="touch")&&l({...u,type:"longpressend"})}}),g=Se(i&&!e?c:void 0);return{longPressProps:X(b,g)}}function Y(s){return ce()?s.altKey:s.ctrlKey}function O(s){return ae()?s.metaKey:s.ctrlKey}const Pe=1e3;function Fe(s){let{keyboardDelegate:e,selectionManager:t,onTypeSelect:l}=s,i=y.useRef({search:"",timeout:null}).current,n=c=>{let d=Te(c.key);if(!d||c.ctrlKey||c.metaKey||!c.currentTarget.contains(c.target))return;d===" "&&i.search.trim().length>0&&(c.preventDefault(),"continuePropagation"in c||c.stopPropagation()),i.search+=d;let a=e.getKeyForSearch(i.search,t.focusedKey);a==null&&(a=e.getKeyForSearch(i.search)),a!=null&&(t.setFocusedKey(a),l&&l(a)),clearTimeout(i.timeout),i.timeout=setTimeout(()=>{i.search=""},Pe)};return{typeSelectProps:{onKeyDownCapture:e.getKeyForSearch?n:null}}}function Te(s){return s.length===1||!/^[A-Z]/i.test(s)?s:""}function Ue(s){let{selectionManager:e,keyboardDelegate:t,ref:l,autoFocus:i=!1,shouldFocusWrap:n=!1,disallowEmptySelection:c=!1,disallowSelectAll:d=!1,selectOnFocus:a=e.selectionBehavior==="replace",disallowTypeAhead:p=!1,shouldUseVirtualFocus:b,allowsTabNavigation:g=!1,isVirtualized:u,scrollRef:h=l,linkBehavior:F="action"}=s,{direction:w}=ue(),v=ne(),T=r=>{if(r.altKey&&r.key==="Tab"&&r.preventDefault(),!l.current.contains(r.target))return;const K=(f,B)=>{if(f!=null){if(e.isLink(f)&&F==="selection"&&a&&!Y(r)){fe.flushSync(()=>{e.setFocusedKey(f,B)});let R=h.current.querySelector(`[data-key="${CSS.escape(f.toString())}"]`),Z=e.getItemProps(f);v.open(R,r,Z.href,Z.routerOptions);return}if(e.setFocusedKey(f,B),e.isLink(f)&&F==="override")return;r.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(f):a&&!Y(r)&&e.replaceSelection(f)}};switch(r.key){case"ArrowDown":if(t.getKeyBelow){var x,m;r.preventDefault();let f=e.focusedKey!=null?t.getKeyBelow(e.focusedKey):(x=t.getFirstKey)===null||x===void 0?void 0:x.call(t);f==null&&n&&(f=(m=t.getFirstKey)===null||m===void 0?void 0:m.call(t,e.focusedKey)),K(f)}break;case"ArrowUp":if(t.getKeyAbove){var I,A;r.preventDefault();let f=e.focusedKey!=null?t.getKeyAbove(e.focusedKey):(I=t.getLastKey)===null||I===void 0?void 0:I.call(t);f==null&&n&&(f=(A=t.getLastKey)===null||A===void 0?void 0:A.call(t,e.focusedKey)),K(f)}break;case"ArrowLeft":if(t.getKeyLeftOf){var U,o;r.preventDefault();let f=t.getKeyLeftOf(e.focusedKey);f==null&&n&&(f=w==="rtl"?(U=t.getFirstKey)===null||U===void 0?void 0:U.call(t,e.focusedKey):(o=t.getLastKey)===null||o===void 0?void 0:o.call(t,e.focusedKey)),K(f,w==="rtl"?"first":"last")}break;case"ArrowRight":if(t.getKeyRightOf){var k,W;r.preventDefault();let f=t.getKeyRightOf(e.focusedKey);f==null&&n&&(f=w==="rtl"?(k=t.getLastKey)===null||k===void 0?void 0:k.call(t,e.focusedKey):(W=t.getFirstKey)===null||W===void 0?void 0:W.call(t,e.focusedKey)),K(f,w==="rtl"?"last":"first")}break;case"Home":if(t.getFirstKey){r.preventDefault();let f=t.getFirstKey(e.focusedKey,O(r));e.setFocusedKey(f),O(r)&&r.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(f):a&&e.replaceSelection(f)}break;case"End":if(t.getLastKey){r.preventDefault();let f=t.getLastKey(e.focusedKey,O(r));e.setFocusedKey(f),O(r)&&r.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(f):a&&e.replaceSelection(f)}break;case"PageDown":if(t.getKeyPageBelow){r.preventDefault();let f=t.getKeyPageBelow(e.focusedKey);K(f)}break;case"PageUp":if(t.getKeyPageAbove){r.preventDefault();let f=t.getKeyPageAbove(e.focusedKey);K(f)}break;case"a":O(r)&&e.selectionMode==="multiple"&&d!==!0&&(r.preventDefault(),e.selectAll());break;case"Escape":!c&&e.selectedKeys.size!==0&&(r.stopPropagation(),r.preventDefault(),e.clearSelection());break;case"Tab":if(!g){if(r.shiftKey)l.current.focus();else{let f=ye(l.current,{tabbable:!0}),B,R;do R=f.lastChild(),R&&(B=R);while(R);B&&!B.contains(document.activeElement)&&J(B)}break}}},$=y.useRef({top:0,left:0});me(h,"scroll",u?null:()=>{$.current={top:h.current.scrollTop,left:h.current.scrollLeft}});let S=r=>{if(e.isFocused){r.currentTarget.contains(r.target)||e.setFocused(!1);return}if(r.currentTarget.contains(r.target)){if(e.setFocused(!0),e.focusedKey==null){let m=A=>{A!=null&&(e.setFocusedKey(A),a&&e.replaceSelection(A))},I=r.relatedTarget;var K,x;I&&r.currentTarget.compareDocumentPosition(I)&Node.DOCUMENT_POSITION_FOLLOWING?m((K=e.lastSelectedKey)!==null&&K!==void 0?K:t.getLastKey()):m((x=e.firstSelectedKey)!==null&&x!==void 0?x:t.getFirstKey())}else u||(h.current.scrollTop=$.current.top,h.current.scrollLeft=$.current.left);if(!u&&e.focusedKey!=null){let m=h.current.querySelector(`[data-key="${CSS.escape(e.focusedKey.toString())}"]`);m&&(m.contains(document.activeElement)||J(m),V()==="keyboard"&&_(m,{containingElement:l.current}))}}},D=r=>{r.currentTarget.contains(r.relatedTarget)||e.setFocused(!1)};const C=y.useRef(i);y.useEffect(()=>{if(C.current){let r=null;i==="first"&&(r=t.getFirstKey()),i==="last"&&(r=t.getLastKey());let K=e.selectedKeys;if(K.size){for(let x of K)if(e.canSelectItem(x)){r=x;break}}e.setFocused(!0),e.setFocusedKey(r),r==null&&!b&&j(l.current)}},[]);let M=y.useRef(e.focusedKey);y.useEffect(()=>{let r=V();if(e.isFocused&&e.focusedKey!=null&&(h!=null&&h.current)){let K=h.current.querySelector(`[data-key="${CSS.escape(e.focusedKey.toString())}"]`);K&&(r==="keyboard"||C.current)&&(u||oe(h.current,K),r!=="virtual"&&_(K,{containingElement:l.current}))}e.isFocused&&e.focusedKey==null&&M.current!=null&&j(l.current),M.current=e.focusedKey,C.current=!1},[u,h,e.focusedKey,e.isFocused,l]);let E={onKeyDown:T,onFocus:S,onBlur:D,onMouseDown(r){h.current===r.target&&r.preventDefault()}},{typeSelectProps:z}=Fe({keyboardDelegate:t,selectionManager:e});p||(E=X(z,E));let L;return b||(L=e.focusedKey==null?0:-1),{collectionProps:{...E,tabIndex:L}}}function ze(s){let{selectionManager:e,key:t,ref:l,shouldSelectOnPressUp:i,shouldUseVirtualFocus:n,focus:c,isDisabled:d,onAction:a,allowsDifferentPressOrigin:p,linkBehavior:b="action"}=s,g=ne(),u=o=>{if(o.pointerType==="keyboard"&&Y(o))e.toggleSelection(t);else{if(e.selectionMode==="none")return;if(e.isLink(t)){if(b==="selection"){let k=e.getItemProps(t);g.open(l.current,o,k.href,k.routerOptions),e.setSelectedKeys(e.selectedKeys);return}else if(b==="override"||b==="none")return}e.selectionMode==="single"?e.isSelected(t)&&!e.disallowEmptySelection?e.toggleSelection(t):e.replaceSelection(t):o&&o.shiftKey?e.extendSelection(t):e.selectionBehavior==="toggle"||o&&(O(o)||o.pointerType==="touch"||o.pointerType==="virtual")?e.toggleSelection(t):e.replaceSelection(t)}};y.useEffect(()=>{t===e.focusedKey&&e.isFocused&&!n&&(c?c():document.activeElement!==l.current&&j(l.current))},[l,t,e.focusedKey,e.childFocusStrategy,e.isFocused,n]),d=d||e.isDisabled(t);let h={};!n&&!d?h={tabIndex:t===e.focusedKey?0:-1,onFocus(o){o.target===l.current&&e.setFocusedKey(t)}}:d&&(h.onMouseDown=o=>{o.preventDefault()});let F=e.isLink(t)&&b==="override",w=e.isLink(t)&&b!=="selection"&&b!=="none",v=!d&&e.canSelectItem(t)&&!F,T=(a||w)&&!d,$=T&&(e.selectionBehavior==="replace"?!v:!v||e.isEmpty),S=T&&v&&e.selectionBehavior==="replace",D=$||S,C=y.useRef(null),M=D&&v,E=y.useRef(!1),z=y.useRef(!1),L=o=>{if(a&&a(),w){let k=e.getItemProps(t);g.open(l.current,o,k.href,k.routerOptions)}},r={};i?(r.onPressStart=o=>{C.current=o.pointerType,E.current=M,o.pointerType==="keyboard"&&(!D||te())&&u(o)},p?(r.onPressUp=$?null:o=>{o.pointerType!=="keyboard"&&v&&u(o)},r.onPress=$?L:null):r.onPress=o=>{if($||S&&o.pointerType!=="mouse"){if(o.pointerType==="keyboard"&&!ee())return;L(o)}else o.pointerType!=="keyboard"&&v&&u(o)}):(r.onPressStart=o=>{C.current=o.pointerType,E.current=M,z.current=$,v&&(o.pointerType==="mouse"&&!$||o.pointerType==="keyboard"&&(!T||te()))&&u(o)},r.onPress=o=>{(o.pointerType==="touch"||o.pointerType==="pen"||o.pointerType==="virtual"||o.pointerType==="keyboard"&&D&&ee()||o.pointerType==="mouse"&&z.current)&&(D?L(o):v&&u(o))}),h["data-key"]=t,r.preventFocusOnPress=n;let{pressProps:K,isPressed:x}=re(r),m=S?o=>{C.current==="mouse"&&(o.stopPropagation(),o.preventDefault(),L(o))}:void 0,{longPressProps:I}=xe({isDisabled:!M,onLongPress(o){o.pointerType==="touch"&&(u(o),e.setSelectionBehavior("toggle"))}}),A=o=>{C.current==="touch"&&E.current&&o.preventDefault()},U=e.isLink(t)?o=>{de.isOpening||o.preventDefault()}:void 0;return{itemProps:X(h,v||$?K:{},M?I:{},{onDoubleClick:m,onDragStartCapture:A,onClick:U}),isPressed:x,isSelected:e.isSelected(t),isFocused:e.isFocused&&e.focusedKey===t,isDisabled:d,allowsSelection:v,hasAction:D}}function ee(){let s=window.event;return(s==null?void 0:s.key)==="Enter"}function te(){let s=window.event;return(s==null?void 0:s.key)===" "||(s==null?void 0:s.code)==="Space"}class P extends Set{constructor(e,t,l){super(e),e instanceof P?(this.anchorKey=t||e.anchorKey,this.currentKey=l||e.currentKey):(this.anchorKey=t,this.currentKey=l)}}function De(s,e){if(s.size!==e.size)return!1;for(let t of s)if(!e.has(t))return!1;return!0}function We(s){let{selectionMode:e="none",disallowEmptySelection:t,allowDuplicateSelectionEvents:l,selectionBehavior:i="toggle",disabledBehavior:n="all"}=s,c=y.useRef(!1),[,d]=y.useState(!1),a=y.useRef(null),p=y.useRef(null),[,b]=y.useState(null),g=y.useMemo(()=>le(s.selectedKeys),[s.selectedKeys]),u=y.useMemo(()=>le(s.defaultSelectedKeys,new P),[s.defaultSelectedKeys]),[h,F]=ge(g,u,s.onSelectionChange),w=y.useMemo(()=>s.disabledKeys?new Set(s.disabledKeys):new Set,[s.disabledKeys]),[v,T]=y.useState(i);i==="replace"&&v==="toggle"&&typeof h=="object"&&h.size===0&&T("replace");let $=y.useRef(i);return y.useEffect(()=>{i!==$.current&&(T(i),$.current=i)},[i]),{selectionMode:e,disallowEmptySelection:t,selectionBehavior:v,setSelectionBehavior:T,get isFocused(){return c.current},setFocused(S){c.current=S,d(S)},get focusedKey(){return a.current},get childFocusStrategy(){return p.current},setFocusedKey(S,D="first"){a.current=S,p.current=D,b(S)},selectedKeys:h,setSelectedKeys(S){(l||!De(S,h))&&F(S)},disabledKeys:w,disabledBehavior:n}}function le(s,e){return s?s==="all"?"all":new P(s):e}class Ie{build(e,t){return this.context=t,se(()=>this.iterateCollection(e))}*iterateCollection(e){let{children:t,items:l}=e;if(typeof t=="function"){if(!l)throw new Error("props.children was a function but props.items is missing");for(let i of e.items)yield*this.getFullNode({value:i},{renderer:t})}else{let i=[];Q.Children.forEach(t,c=>{i.push(c)});let n=0;for(let c of i){let d=this.getFullNode({element:c,index:n},{});for(let a of d)n++,yield a}}}getKey(e,t,l,i){if(e.key!=null)return e.key;if(t.type==="cell"&&t.key!=null)return`${i}${t.key}`;let n=t.value;if(n!=null){var c;let d=(c=n.key)!==null&&c!==void 0?c:n.id;if(d==null)throw new Error("No key found for item");return d}return i?`${i}.${t.index}`:`$.${t.index}`}getChildState(e,t){return{renderer:t.renderer||e.renderer}}*getFullNode(e,t,l,i){let n=e.element;if(!n&&e.value&&t&&t.renderer){let a=this.cache.get(e.value);if(a&&(!a.shouldInvalidate||!a.shouldInvalidate(this.context))){a.index=e.index,a.parentKey=i?i.key:null,yield a;return}n=t.renderer(e.value)}if(Q.isValidElement(n)){let a=n.type;if(typeof a!="function"&&typeof a.getCollectionNode!="function"){let u=typeof n.type=="function"?n.type.name:n.type;throw new Error(`Unknown element <${u}> in collection.`)}let p=a.getCollectionNode(n.props,this.context),b=e.index,g=p.next();for(;!g.done&&g.value;){let u=g.value;e.index=b;let h=u.key;h||(h=u.element?null:this.getKey(n,e,t,l));let w=[...this.getFullNode({...u,key:h,index:b,wrapper:Ae(e.wrapper,u.wrapper)},this.getChildState(t,u),l?`${l}${n.key}`:n.key,i)];for(let v of w){if(v.value=u.value||e.value,v.value&&this.cache.set(v.value,v),e.type&&v.type!==e.type)throw new Error(`Unsupported type <${q(v.type)}> in <${q(i.type)}>. Only <${q(e.type)}> is supported.`);b++,yield v}g=p.next(w)}return}if(e.key==null)return;let c=this,d={type:e.type,props:e.props,key:e.key,parentKey:i?i.key:null,value:e.value,level:i?i.level+1:0,index:e.index,rendered:e.rendered,textValue:e.textValue,"aria-label":e["aria-label"],wrapper:e.wrapper,shouldInvalidate:e.shouldInvalidate,hasChildNodes:e.hasChildNodes,childNodes:se(function*(){if(!e.hasChildNodes)return;let a=0;for(let p of e.childNodes()){p.key!=null&&(p.key=`${d.key}${p.key}`),p.index=a;let b=c.getFullNode(p,c.getChildState(t,p),d.key,d);for(let g of b)a++,yield g}})};yield d}constructor(){this.cache=new WeakMap}}function se(s){let e=[],t=null;return{*[Symbol.iterator](){for(let l of e)yield l;t||(t=s());for(let l of t)e.push(l),yield l}}}function Ae(s,e){if(s&&e)return t=>s(e(t));if(s)return s;if(e)return e}function q(s){return s[0].toUpperCase()+s.slice(1)}function He(s,e,t){let l=y.useMemo(()=>new Ie,[]),{children:i,items:n,collection:c}=s;return y.useMemo(()=>{if(c)return c;let a=l.build({children:i,items:n},t);return e(a)},[l,i,n,c,t,e])}function ke(s,e){return typeof e.getChildren=="function"?e.getChildren(s.key):s.childNodes}function Ce(s){return Me(s,0)}function Me(s,e){if(e<0)return;let t=0;for(let l of s){if(t===e)return l;t++}}function qe(s){let e;for(let t of s)e=t;return e}function G(s,e,t){if(e.parentKey===t.parentKey)return e.index-t.index;let l=[...ie(s,e),e],i=[...ie(s,t),t],n=l.slice(0,i.length).findIndex((c,d)=>c!==i[d]);return n!==-1?(e=l[n],t=i[n],e.index-t.index):l.findIndex(c=>c===t)>=0?1:(i.findIndex(c=>c===e)>=0,-1)}function ie(s,e){let t=[];for(;(e==null?void 0:e.parentKey)!=null;)e=s.getItem(e.parentKey),t.unshift(e);return t}class Ge{get selectionMode(){return this.state.selectionMode}get disallowEmptySelection(){return this.state.disallowEmptySelection}get selectionBehavior(){return this.state.selectionBehavior}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}get isFocused(){return this.state.isFocused}setFocused(e){this.state.setFocused(e)}get focusedKey(){return this.state.focusedKey}get childFocusStrategy(){return this.state.childFocusStrategy}setFocusedKey(e,t){(e==null||this.collection.getItem(e))&&this.state.setFocusedKey(e,t)}get selectedKeys(){return this.state.selectedKeys==="all"?new Set(this.getSelectAllKeys()):this.state.selectedKeys}get rawSelection(){return this.state.selectedKeys}isSelected(e){return this.state.selectionMode==="none"?!1:(e=this.getKey(e),this.state.selectedKeys==="all"?this.canSelectItem(e):this.state.selectedKeys.has(e))}get isEmpty(){return this.state.selectedKeys!=="all"&&this.state.selectedKeys.size===0}get isSelectAll(){if(this.isEmpty)return!1;if(this.state.selectedKeys==="all")return!0;if(this._isSelectAll!=null)return this._isSelectAll;let e=this.getSelectAllKeys(),t=this.state.selectedKeys;return this._isSelectAll=e.every(l=>t.has(l)),this._isSelectAll}get firstSelectedKey(){let e=null;for(let t of this.state.selectedKeys){let l=this.collection.getItem(t);(!e||l&&G(this.collection,l,e)<0)&&(e=l)}return e==null?void 0:e.key}get lastSelectedKey(){let e=null;for(let t of this.state.selectedKeys){let l=this.collection.getItem(t);(!e||l&&G(this.collection,l,e)>0)&&(e=l)}return e==null?void 0:e.key}get disabledKeys(){return this.state.disabledKeys}get disabledBehavior(){return this.state.disabledBehavior}extendSelection(e){if(this.selectionMode==="none")return;if(this.selectionMode==="single"){this.replaceSelection(e);return}e=this.getKey(e);let t;if(this.state.selectedKeys==="all")t=new P([e],e,e);else{let l=this.state.selectedKeys,i=l.anchorKey||e;t=new P(l,i,e);for(let n of this.getKeyRange(i,l.currentKey||e))t.delete(n);for(let n of this.getKeyRange(e,i))this.canSelectItem(n)&&t.add(n)}this.state.setSelectedKeys(t)}getKeyRange(e,t){let l=this.collection.getItem(e),i=this.collection.getItem(t);return l&&i?G(this.collection,l,i)<=0?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){let l=[],i=e;for(;i;){let n=this.collection.getItem(i);if((n&&n.type==="item"||n.type==="cell"&&this.allowsCellSelection)&&l.push(i),i===t)return l;i=this.collection.getKeyAfter(i)}return[]}getKey(e){let t=this.collection.getItem(e);if(!t||t.type==="cell"&&this.allowsCellSelection)return e;for(;t.type!=="item"&&t.parentKey!=null;)t=this.collection.getItem(t.parentKey);return!t||t.type!=="item"?null:t.key}toggleSelection(e){if(this.selectionMode==="none")return;if(this.selectionMode==="single"&&!this.isSelected(e)){this.replaceSelection(e);return}if(e=this.getKey(e),e==null)return;let t=new P(this.state.selectedKeys==="all"?this.getSelectAllKeys():this.state.selectedKeys);t.has(e)?t.delete(e):this.canSelectItem(e)&&(t.add(e),t.anchorKey=e,t.currentKey=e),!(this.disallowEmptySelection&&t.size===0)&&this.state.setSelectedKeys(t)}replaceSelection(e){if(this.selectionMode==="none"||(e=this.getKey(e),e==null))return;let t=this.canSelectItem(e)?new P([e],e,e):new P;this.state.setSelectedKeys(t)}setSelectedKeys(e){if(this.selectionMode==="none")return;let t=new P;for(let l of e)if(l=this.getKey(l),l!=null&&(t.add(l),this.selectionMode==="single"))break;this.state.setSelectedKeys(t)}getSelectAllKeys(){let e=[],t=l=>{for(;l;){if(this.canSelectItem(l)){let i=this.collection.getItem(l);i.type==="item"&&e.push(l),i.hasChildNodes&&(this.allowsCellSelection||i.type!=="item")&&t(Ce(ke(i,this.collection)).key)}l=this.collection.getKeyAfter(l)}};return t(this.collection.getFirstKey()),e}selectAll(){!this.isSelectAll&&this.selectionMode==="multiple"&&this.state.setSelectedKeys("all")}clearSelection(){!this.disallowEmptySelection&&(this.state.selectedKeys==="all"||this.state.selectedKeys.size>0)&&this.state.setSelectedKeys(new P)}toggleSelectAll(){this.isSelectAll?this.clearSelection():this.selectAll()}select(e,t){this.selectionMode!=="none"&&(this.selectionMode==="single"?this.isSelected(e)&&!this.disallowEmptySelection?this.toggleSelection(e):this.replaceSelection(e):this.selectionBehavior==="toggle"||t&&(t.pointerType==="touch"||t.pointerType==="virtual")?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys)return!0;let t=this.selectedKeys;if(e.size!==t.size)return!1;for(let l of e)if(!t.has(l))return!1;for(let l of t)if(!e.has(l))return!1;return!0}canSelectItem(e){var t;if(this.state.selectionMode==="none"||this.state.disabledKeys.has(e))return!1;let l=this.collection.getItem(e);return!(!l||!(l==null||(t=l.props)===null||t===void 0)&&t.isDisabled||l.type==="cell"&&!this.allowsCellSelection)}isDisabled(e){var t,l;return this.state.disabledBehavior==="all"&&(this.state.disabledKeys.has(e)||!!(!((l=this.collection.getItem(e))===null||l===void 0||(t=l.props)===null||t===void 0)&&t.isDisabled))}isLink(e){var t,l;return!!(!((l=this.collection.getItem(e))===null||l===void 0||(t=l.props)===null||t===void 0)&&t.href)}getItemProps(e){var t;return(t=this.collection.getItem(e))===null||t===void 0?void 0:t.props}constructor(e,t,l){this.collection=e,this.state=t;var i;this.allowsCellSelection=(i=l==null?void 0:l.allowsCellSelection)!==null&&i!==void 0?i:!1,this._isSelectAll=null}}export{We as $,He as a,Ge as b,Ue as c,ke as d,ze as e,Me as f,qe as g,Ce as h,Se as i,_ as j};