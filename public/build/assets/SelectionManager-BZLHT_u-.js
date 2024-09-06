import{r as y,k as ne,l as re,$ as oe,f as se,d as Z,m as ce,n as ae,e as J}from"./app-C7tOZ9mb.js";import{$ as ue}from"./FocusScope-BYVYjJmQ.js";import{b as W}from"./useFocusable-BwCCJFar.js";import{v as fe,f as ie,d as j,o as Q}from"./chunk-XHQUSKIE-DH6WFa3x.js";import{$ as de,a as he,b as ye,c as X}from"./scrollIntoView-DvDgV4U_.js";import{$ as pe}from"./useControlledState-Cpz1NFEK.js";const ge=500;function Ke(i){let{isDisabled:e,onLongPressStart:t,onLongPressEnd:l,onLongPress:s,threshold:o=ge,accessibilityDescription:c}=i;const d=y.useRef();let{addGlobalListener:a,removeGlobalListener:v}=fe(),{pressProps:g}=ie({isDisabled:e,onPressStart(f){if(f.continuePropagation(),(f.pointerType==="mouse"||f.pointerType==="touch")&&(t&&t({...f,type:"longpressstart"}),d.current=setTimeout(()=>{f.target.dispatchEvent(new PointerEvent("pointercancel",{bubbles:!0})),s&&s({...f,type:"longpress"}),d.current=void 0},o),f.pointerType==="touch")){let h=F=>{F.preventDefault()};a(f.target,"contextmenu",h,{once:!0}),a(window,"pointerup",()=>{setTimeout(()=>{v(f.target,"contextmenu",h)},30)},{once:!0})}},onPressEnd(f){d.current&&clearTimeout(d.current),l&&(f.pointerType==="mouse"||f.pointerType==="touch")&&l({...f,type:"longpressend"})}}),b=de(s&&!e?c:void 0);return{longPressProps:j(g,b)}}function H(i){return ne()?i.altKey:i.ctrlKey}function O(i){return re()?i.metaKey:i.ctrlKey}const ve=1e3;function be(i){let{keyboardDelegate:e,selectionManager:t,onTypeSelect:l}=i,s=y.useRef({search:"",timeout:null}).current,o=c=>{let d=Se(c.key);if(!d||c.ctrlKey||c.metaKey||!c.currentTarget.contains(c.target))return;d===" "&&s.search.trim().length>0&&(c.preventDefault(),"continuePropagation"in c||c.stopPropagation()),s.search+=d;let a=e.getKeyForSearch(s.search,t.focusedKey);a==null&&(a=e.getKeyForSearch(s.search)),a!=null&&(t.setFocusedKey(a),l&&l(a)),clearTimeout(s.timeout),s.timeout=setTimeout(()=>{s.search=""},ve)};return{typeSelectProps:{onKeyDownCapture:e.getKeyForSearch?o:null}}}function Se(i){return i.length===1||!/^[A-Z]/i.test(i)?i:""}function Me(i){let{selectionManager:e,keyboardDelegate:t,ref:l,autoFocus:s=!1,shouldFocusWrap:o=!1,disallowEmptySelection:c=!1,disallowSelectAll:d=!1,selectOnFocus:a=e.selectionBehavior==="replace",disallowTypeAhead:v=!1,shouldUseVirtualFocus:g,allowsTabNavigation:b=!1,isVirtualized:f,scrollRef:h=l,linkBehavior:F="action"}=i,{direction:w}=oe(),p=se(),D=n=>{if(n.altKey&&n.key==="Tab"&&n.preventDefault(),!l.current.contains(n.target))return;const K=(u,L)=>{if(u!=null){if(e.isLink(u)&&F==="selection"&&a&&!H(n)){ce.flushSync(()=>{e.setFocusedKey(u,L)});let R=h.current.querySelector(`[data-key="${CSS.escape(u.toString())}"]`),Y=e.getItemProps(u);p.open(R,n,Y.href,Y.routerOptions);return}if(e.setFocusedKey(u,L),e.isLink(u)&&F==="override")return;n.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(u):a&&!H(n)&&e.replaceSelection(u)}};switch(n.key){case"ArrowDown":if(t.getKeyBelow){var x,$;n.preventDefault();let u=e.focusedKey!=null?t.getKeyBelow(e.focusedKey):(x=t.getFirstKey)===null||x===void 0?void 0:x.call(t);u==null&&o&&(u=($=t.getFirstKey)===null||$===void 0?void 0:$.call(t,e.focusedKey)),K(u)}break;case"ArrowUp":if(t.getKeyAbove){var E,I;n.preventDefault();let u=e.focusedKey!=null?t.getKeyAbove(e.focusedKey):(E=t.getLastKey)===null||E===void 0?void 0:E.call(t);u==null&&o&&(u=(I=t.getLastKey)===null||I===void 0?void 0:I.call(t,e.focusedKey)),K(u)}break;case"ArrowLeft":if(t.getKeyLeftOf){var U,r;n.preventDefault();let u=t.getKeyLeftOf(e.focusedKey);u==null&&o&&(u=w==="rtl"?(U=t.getFirstKey)===null||U===void 0?void 0:U.call(t,e.focusedKey):(r=t.getLastKey)===null||r===void 0?void 0:r.call(t,e.focusedKey)),K(u,w==="rtl"?"first":"last")}break;case"ArrowRight":if(t.getKeyRightOf){var A,V;n.preventDefault();let u=t.getKeyRightOf(e.focusedKey);u==null&&o&&(u=w==="rtl"?(A=t.getLastKey)===null||A===void 0?void 0:A.call(t,e.focusedKey):(V=t.getFirstKey)===null||V===void 0?void 0:V.call(t,e.focusedKey)),K(u,w==="rtl"?"last":"first")}break;case"Home":if(t.getFirstKey){n.preventDefault();let u=t.getFirstKey(e.focusedKey,O(n));e.setFocusedKey(u),O(n)&&n.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(u):a&&e.replaceSelection(u)}break;case"End":if(t.getLastKey){n.preventDefault();let u=t.getLastKey(e.focusedKey,O(n));e.setFocusedKey(u),O(n)&&n.shiftKey&&e.selectionMode==="multiple"?e.extendSelection(u):a&&e.replaceSelection(u)}break;case"PageDown":if(t.getKeyPageBelow){n.preventDefault();let u=t.getKeyPageBelow(e.focusedKey);K(u)}break;case"PageUp":if(t.getKeyPageAbove){n.preventDefault();let u=t.getKeyPageAbove(e.focusedKey);K(u)}break;case"a":O(n)&&e.selectionMode==="multiple"&&d!==!0&&(n.preventDefault(),e.selectAll());break;case"Escape":!c&&e.selectedKeys.size!==0&&(n.stopPropagation(),n.preventDefault(),e.clearSelection());break;case"Tab":if(!b){if(n.shiftKey)l.current.focus();else{let u=ue(l.current,{tabbable:!0}),L,R;do R=u.lastChild(),R&&(L=R);while(R);L&&!L.contains(document.activeElement)&&Z(L)}break}}},S=y.useRef({top:0,left:0});he(h,"scroll",f?null:()=>{S.current={top:h.current.scrollTop,left:h.current.scrollLeft}});let m=n=>{if(e.isFocused){n.currentTarget.contains(n.target)||e.setFocused(!1);return}if(n.currentTarget.contains(n.target)){if(e.setFocused(!0),e.focusedKey==null){let $=I=>{I!=null&&(e.setFocusedKey(I),a&&e.replaceSelection(I))},E=n.relatedTarget;var K,x;E&&n.currentTarget.compareDocumentPosition(E)&Node.DOCUMENT_POSITION_FOLLOWING?$((K=e.lastSelectedKey)!==null&&K!==void 0?K:t.getLastKey()):$((x=e.firstSelectedKey)!==null&&x!==void 0?x:t.getFirstKey())}else f||(h.current.scrollTop=S.current.top,h.current.scrollLeft=S.current.left);if(!f&&e.focusedKey!=null){let $=h.current.querySelector(`[data-key="${CSS.escape(e.focusedKey.toString())}"]`);$&&($.contains(document.activeElement)||Z($),Q()==="keyboard"&&X($,{containingElement:l.current}))}}},T=n=>{n.currentTarget.contains(n.relatedTarget)||e.setFocused(!1)};const k=y.useRef(s);y.useEffect(()=>{if(k.current){let n=null;s==="first"&&(n=t.getFirstKey()),s==="last"&&(n=t.getLastKey());let K=e.selectedKeys;if(K.size){for(let x of K)if(e.canSelectItem(x)){n=x;break}}e.setFocused(!0),e.setFocusedKey(n),n==null&&!g&&W(l.current)}},[]);let M=y.useRef(e.focusedKey);y.useEffect(()=>{let n=Q();if(e.isFocused&&e.focusedKey!=null&&(h!=null&&h.current)){let K=h.current.querySelector(`[data-key="${CSS.escape(e.focusedKey.toString())}"]`);K&&(n==="keyboard"||k.current)&&(f||ye(h.current,K),n!=="virtual"&&X(K,{containingElement:l.current}))}e.isFocused&&e.focusedKey==null&&M.current!=null&&W(l.current),M.current=e.focusedKey,k.current=!1},[f,h,e.focusedKey,e.isFocused,l]);let C={onKeyDown:D,onFocus:m,onBlur:T,onMouseDown(n){h.current===n.target&&n.preventDefault()}},{typeSelectProps:z}=be({keyboardDelegate:t,selectionManager:e});v||(C=j(z,C));let B;return g||(B=e.focusedKey==null?0:-1),{collectionProps:{...C,tabIndex:B}}}function Ce(i){let{selectionManager:e,key:t,ref:l,shouldSelectOnPressUp:s,shouldUseVirtualFocus:o,focus:c,isDisabled:d,onAction:a,allowsDifferentPressOrigin:v,linkBehavior:g="action"}=i,b=se(),f=r=>{if(r.pointerType==="keyboard"&&H(r))e.toggleSelection(t);else{if(e.selectionMode==="none")return;if(e.isLink(t)){if(g==="selection"){let A=e.getItemProps(t);b.open(l.current,r,A.href,A.routerOptions),e.setSelectedKeys(e.selectedKeys);return}else if(g==="override"||g==="none")return}e.selectionMode==="single"?e.isSelected(t)&&!e.disallowEmptySelection?e.toggleSelection(t):e.replaceSelection(t):r&&r.shiftKey?e.extendSelection(t):e.selectionBehavior==="toggle"||r&&(O(r)||r.pointerType==="touch"||r.pointerType==="virtual")?e.toggleSelection(t):e.replaceSelection(t)}};y.useEffect(()=>{t===e.focusedKey&&e.isFocused&&!o&&(c?c():document.activeElement!==l.current&&W(l.current))},[l,t,e.focusedKey,e.childFocusStrategy,e.isFocused,o]),d=d||e.isDisabled(t);let h={};!o&&!d?h={tabIndex:t===e.focusedKey?0:-1,onFocus(r){r.target===l.current&&e.setFocusedKey(t)}}:d&&(h.onMouseDown=r=>{r.preventDefault()});let F=e.isLink(t)&&g==="override",w=e.isLink(t)&&g!=="selection"&&g!=="none",p=!d&&e.canSelectItem(t)&&!F,D=(a||w)&&!d,S=D&&(e.selectionBehavior==="replace"?!p:!p||e.isEmpty),m=D&&p&&e.selectionBehavior==="replace",T=S||m,k=y.useRef(null),M=T&&p,C=y.useRef(!1),z=y.useRef(!1),B=r=>{if(a&&a(),w){let A=e.getItemProps(t);b.open(l.current,r,A.href,A.routerOptions)}},n={};s?(n.onPressStart=r=>{k.current=r.pointerType,C.current=M,r.pointerType==="keyboard"&&(!T||_())&&f(r)},v?(n.onPressUp=S?null:r=>{r.pointerType!=="keyboard"&&p&&f(r)},n.onPress=S?B:null):n.onPress=r=>{if(S||m&&r.pointerType!=="mouse"){if(r.pointerType==="keyboard"&&!N())return;B(r)}else r.pointerType!=="keyboard"&&p&&f(r)}):(n.onPressStart=r=>{k.current=r.pointerType,C.current=M,z.current=S,p&&(r.pointerType==="mouse"&&!S||r.pointerType==="keyboard"&&(!D||_()))&&f(r)},n.onPress=r=>{(r.pointerType==="touch"||r.pointerType==="pen"||r.pointerType==="virtual"||r.pointerType==="keyboard"&&T&&N()||r.pointerType==="mouse"&&z.current)&&(T?B(r):p&&f(r))}),h["data-key"]=t,n.preventFocusOnPress=o;let{pressProps:K,isPressed:x}=ie(n),$=m?r=>{k.current==="mouse"&&(r.stopPropagation(),r.preventDefault(),B(r))}:void 0,{longPressProps:E}=Ke({isDisabled:!M,onLongPress(r){r.pointerType==="touch"&&(f(r),e.setSelectionBehavior("toggle"))}}),I=r=>{k.current==="touch"&&C.current&&r.preventDefault()},U=e.isLink(t)?r=>{ae.isOpening||r.preventDefault()}:void 0;return{itemProps:j(h,p||S?K:{},M?E:{},{onDoubleClick:$,onDragStartCapture:I,onClick:U}),isPressed:x,isSelected:e.isSelected(t),isFocused:e.isFocused&&e.focusedKey===t,isDisabled:d,allowsSelection:p,hasAction:T}}function N(){let i=window.event;return(i==null?void 0:i.key)==="Enter"}function _(){let i=window.event;return(i==null?void 0:i.key)===" "||(i==null?void 0:i.code)==="Space"}class P extends Set{constructor(e,t,l){super(e),e instanceof P?(this.anchorKey=t||e.anchorKey,this.currentKey=l||e.currentKey):(this.anchorKey=t,this.currentKey=l)}}function me(i,e){if(i.size!==e.size)return!1;for(let t of i)if(!e.has(t))return!1;return!0}function Be(i){let{selectionMode:e="none",disallowEmptySelection:t,allowDuplicateSelectionEvents:l,selectionBehavior:s="toggle",disabledBehavior:o="all"}=i,c=y.useRef(!1),[,d]=y.useState(!1),a=y.useRef(null),v=y.useRef(null),[,g]=y.useState(null),b=y.useMemo(()=>ee(i.selectedKeys),[i.selectedKeys]),f=y.useMemo(()=>ee(i.defaultSelectedKeys,new P),[i.defaultSelectedKeys]),[h,F]=pe(b,f,i.onSelectionChange),w=y.useMemo(()=>i.disabledKeys?new Set(i.disabledKeys):new Set,[i.disabledKeys]),[p,D]=y.useState(s);s==="replace"&&p==="toggle"&&typeof h=="object"&&h.size===0&&D("replace");let S=y.useRef(s);return y.useEffect(()=>{s!==S.current&&(D(s),S.current=s)},[s]),{selectionMode:e,disallowEmptySelection:t,selectionBehavior:p,setSelectionBehavior:D,get isFocused(){return c.current},setFocused(m){c.current=m,d(m)},get focusedKey(){return a.current},get childFocusStrategy(){return v.current},setFocusedKey(m,T="first"){a.current=m,v.current=T,g(m)},selectedKeys:h,setSelectedKeys(m){(l||!me(m,h))&&F(m)},disabledKeys:w,disabledBehavior:o}}function ee(i,e){return i?i==="all"?"all":new P(i):e}class $e{build(e,t){return this.context=t,te(()=>this.iterateCollection(e))}*iterateCollection(e){let{children:t,items:l}=e;if(typeof t=="function"){if(!l)throw new Error("props.children was a function but props.items is missing");for(let s of e.items)yield*this.getFullNode({value:s},{renderer:t})}else{let s=[];J.Children.forEach(t,c=>{s.push(c)});let o=0;for(let c of s){let d=this.getFullNode({element:c,index:o},{});for(let a of d)o++,yield a}}}getKey(e,t,l,s){if(e.key!=null)return e.key;if(t.type==="cell"&&t.key!=null)return`${s}${t.key}`;let o=t.value;if(o!=null){var c;let d=(c=o.key)!==null&&c!==void 0?c:o.id;if(d==null)throw new Error("No key found for item");return d}return s?`${s}.${t.index}`:`$.${t.index}`}getChildState(e,t){return{renderer:t.renderer||e.renderer}}*getFullNode(e,t,l,s){let o=e.element;if(!o&&e.value&&t&&t.renderer){let a=this.cache.get(e.value);if(a&&(!a.shouldInvalidate||!a.shouldInvalidate(this.context))){a.index=e.index,a.parentKey=s?s.key:null,yield a;return}o=t.renderer(e.value)}if(J.isValidElement(o)){let a=o.type;if(typeof a!="function"&&typeof a.getCollectionNode!="function"){let f=typeof o.type=="function"?o.type.name:o.type;throw new Error(`Unknown element <${f}> in collection.`)}let v=a.getCollectionNode(o.props,this.context),g=e.index,b=v.next();for(;!b.done&&b.value;){let f=b.value;e.index=g;let h=f.key;h||(h=f.element?null:this.getKey(o,e,t,l));let w=[...this.getFullNode({...f,key:h,index:g,wrapper:we(e.wrapper,f.wrapper)},this.getChildState(t,f),l?`${l}${o.key}`:o.key,s)];for(let p of w){if(p.value=f.value||e.value,p.value&&this.cache.set(p.value,p),e.type&&p.type!==e.type)throw new Error(`Unsupported type <${q(p.type)}> in <${q(s.type)}>. Only <${q(e.type)}> is supported.`);g++,yield p}b=v.next(w)}return}if(e.key==null)return;let c=this,d={type:e.type,props:e.props,key:e.key,parentKey:s?s.key:null,value:e.value,level:s?s.level+1:0,index:e.index,rendered:e.rendered,textValue:e.textValue,"aria-label":e["aria-label"],wrapper:e.wrapper,shouldInvalidate:e.shouldInvalidate,hasChildNodes:e.hasChildNodes,childNodes:te(function*(){if(!e.hasChildNodes)return;let a=0;for(let v of e.childNodes()){v.key!=null&&(v.key=`${d.key}${v.key}`),v.index=a;let g=c.getFullNode(v,c.getChildState(t,v),d.key,d);for(let b of g)a++,yield b}})};yield d}constructor(){this.cache=new WeakMap}}function te(i){let e=[],t=null;return{*[Symbol.iterator](){for(let l of e)yield l;t||(t=i());for(let l of t)e.push(l),yield l}}}function we(i,e){if(i&&e)return t=>i(e(t));if(i)return i;if(e)return e}function q(i){return i[0].toUpperCase()+i.slice(1)}function Le(i,e,t){let l=y.useMemo(()=>new $e,[]),{children:s,items:o,collection:c}=i;return y.useMemo(()=>{if(c)return c;let a=l.build({children:s,items:o},t);return e(a)},[l,s,o,c,t,e])}function xe(i,e){return typeof e.getChildren=="function"?e.getChildren(i.key):i.childNodes}function Pe(i){return Fe(i,0)}function Fe(i,e){if(e<0)return;let t=0;for(let l of i){if(t===e)return l;t++}}function Re(i){let e;for(let t of i)e=t;return e}function G(i,e,t){if(e.parentKey===t.parentKey)return e.index-t.index;let l=[...le(i,e),e],s=[...le(i,t),t],o=l.slice(0,s.length).findIndex((c,d)=>c!==s[d]);return o!==-1?(e=l[o],t=s[o],e.index-t.index):l.findIndex(c=>c===t)>=0?1:(s.findIndex(c=>c===e)>=0,-1)}function le(i,e){let t=[];for(;(e==null?void 0:e.parentKey)!=null;)e=i.getItem(e.parentKey),t.unshift(e);return t}class Oe{get selectionMode(){return this.state.selectionMode}get disallowEmptySelection(){return this.state.disallowEmptySelection}get selectionBehavior(){return this.state.selectionBehavior}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}get isFocused(){return this.state.isFocused}setFocused(e){this.state.setFocused(e)}get focusedKey(){return this.state.focusedKey}get childFocusStrategy(){return this.state.childFocusStrategy}setFocusedKey(e,t){(e==null||this.collection.getItem(e))&&this.state.setFocusedKey(e,t)}get selectedKeys(){return this.state.selectedKeys==="all"?new Set(this.getSelectAllKeys()):this.state.selectedKeys}get rawSelection(){return this.state.selectedKeys}isSelected(e){return this.state.selectionMode==="none"?!1:(e=this.getKey(e),this.state.selectedKeys==="all"?this.canSelectItem(e):this.state.selectedKeys.has(e))}get isEmpty(){return this.state.selectedKeys!=="all"&&this.state.selectedKeys.size===0}get isSelectAll(){if(this.isEmpty)return!1;if(this.state.selectedKeys==="all")return!0;if(this._isSelectAll!=null)return this._isSelectAll;let e=this.getSelectAllKeys(),t=this.state.selectedKeys;return this._isSelectAll=e.every(l=>t.has(l)),this._isSelectAll}get firstSelectedKey(){let e=null;for(let t of this.state.selectedKeys){let l=this.collection.getItem(t);(!e||l&&G(this.collection,l,e)<0)&&(e=l)}return e==null?void 0:e.key}get lastSelectedKey(){let e=null;for(let t of this.state.selectedKeys){let l=this.collection.getItem(t);(!e||l&&G(this.collection,l,e)>0)&&(e=l)}return e==null?void 0:e.key}get disabledKeys(){return this.state.disabledKeys}get disabledBehavior(){return this.state.disabledBehavior}extendSelection(e){if(this.selectionMode==="none")return;if(this.selectionMode==="single"){this.replaceSelection(e);return}e=this.getKey(e);let t;if(this.state.selectedKeys==="all")t=new P([e],e,e);else{let l=this.state.selectedKeys,s=l.anchorKey||e;t=new P(l,s,e);for(let o of this.getKeyRange(s,l.currentKey||e))t.delete(o);for(let o of this.getKeyRange(e,s))this.canSelectItem(o)&&t.add(o)}this.state.setSelectedKeys(t)}getKeyRange(e,t){let l=this.collection.getItem(e),s=this.collection.getItem(t);return l&&s?G(this.collection,l,s)<=0?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){let l=[],s=e;for(;s;){let o=this.collection.getItem(s);if((o&&o.type==="item"||o.type==="cell"&&this.allowsCellSelection)&&l.push(s),s===t)return l;s=this.collection.getKeyAfter(s)}return[]}getKey(e){let t=this.collection.getItem(e);if(!t||t.type==="cell"&&this.allowsCellSelection)return e;for(;t.type!=="item"&&t.parentKey!=null;)t=this.collection.getItem(t.parentKey);return!t||t.type!=="item"?null:t.key}toggleSelection(e){if(this.selectionMode==="none")return;if(this.selectionMode==="single"&&!this.isSelected(e)){this.replaceSelection(e);return}if(e=this.getKey(e),e==null)return;let t=new P(this.state.selectedKeys==="all"?this.getSelectAllKeys():this.state.selectedKeys);t.has(e)?t.delete(e):this.canSelectItem(e)&&(t.add(e),t.anchorKey=e,t.currentKey=e),!(this.disallowEmptySelection&&t.size===0)&&this.state.setSelectedKeys(t)}replaceSelection(e){if(this.selectionMode==="none"||(e=this.getKey(e),e==null))return;let t=this.canSelectItem(e)?new P([e],e,e):new P;this.state.setSelectedKeys(t)}setSelectedKeys(e){if(this.selectionMode==="none")return;let t=new P;for(let l of e)if(l=this.getKey(l),l!=null&&(t.add(l),this.selectionMode==="single"))break;this.state.setSelectedKeys(t)}getSelectAllKeys(){let e=[],t=l=>{for(;l;){if(this.canSelectItem(l)){let s=this.collection.getItem(l);s.type==="item"&&e.push(l),s.hasChildNodes&&(this.allowsCellSelection||s.type!=="item")&&t(Pe(xe(s,this.collection)).key)}l=this.collection.getKeyAfter(l)}};return t(this.collection.getFirstKey()),e}selectAll(){!this.isSelectAll&&this.selectionMode==="multiple"&&this.state.setSelectedKeys("all")}clearSelection(){!this.disallowEmptySelection&&(this.state.selectedKeys==="all"||this.state.selectedKeys.size>0)&&this.state.setSelectedKeys(new P)}toggleSelectAll(){this.isSelectAll?this.clearSelection():this.selectAll()}select(e,t){this.selectionMode!=="none"&&(this.selectionMode==="single"?this.isSelected(e)&&!this.disallowEmptySelection?this.toggleSelection(e):this.replaceSelection(e):this.selectionBehavior==="toggle"||t&&(t.pointerType==="touch"||t.pointerType==="virtual")?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys)return!0;let t=this.selectedKeys;if(e.size!==t.size)return!1;for(let l of e)if(!t.has(l))return!1;for(let l of t)if(!e.has(l))return!1;return!0}canSelectItem(e){var t;if(this.state.selectionMode==="none"||this.state.disabledKeys.has(e))return!1;let l=this.collection.getItem(e);return!(!l||!(l==null||(t=l.props)===null||t===void 0)&&t.isDisabled||l.type==="cell"&&!this.allowsCellSelection)}isDisabled(e){var t,l;return this.state.disabledBehavior==="all"&&(this.state.disabledKeys.has(e)||!!(!((l=this.collection.getItem(e))===null||l===void 0||(t=l.props)===null||t===void 0)&&t.isDisabled))}isLink(e){var t,l;return!!(!((l=this.collection.getItem(e))===null||l===void 0||(t=l.props)===null||t===void 0)&&t.href)}getItemProps(e){var t;return(t=this.collection.getItem(e))===null||t===void 0?void 0:t.props}constructor(e,t,l){this.collection=e,this.state=t;var s;this.allowsCellSelection=(s=l==null?void 0:l.allowsCellSelection)!==null&&s!==void 0?s:!1,this._isSelectAll=null}}export{Be as $,Le as a,Oe as b,Me as c,xe as d,Ce as e,Fe as f,Re as g,Pe as h};
