import{e as K,r as o}from"./app-n36vVTPw.js";import{$ as k,a as M,b as p}from"./SelectionManager-Mzy0TgGM.js";function x(i){return null}x.getCollectionNode=function*(t,e){let{childItems:s,title:f,children:n}=t,l=t.title||t.children,u=t.textValue||(typeof l=="string"?l:"")||t["aria-label"]||"";!u&&!(e!=null&&e.suppressTextValueWarning)&&console.warn("<Item> with non-plain text contents is unsupported by type to select for accessibility. Please add a `textValue` prop."),yield{type:"item",props:t,rendered:l,textValue:u,"aria-label":t["aria-label"],hasChildNodes:I(t),*childNodes(){if(s)for(let a of s)yield{type:"item",value:a};else if(f){let a=[];K.Children.forEach(n,r=>{a.push({type:"item",element:r})}),yield*a}}}};function I(i){return i.hasChildItems!=null?i.hasChildItems:!!(i.childItems||i.title&&K.Children.count(i.children)>0)}let C=x;class b{*[Symbol.iterator](){yield*this.iterable}get size(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(t){let e=this.keyMap.get(t);return e?e.prevKey:null}getKeyAfter(t){let e=this.keyMap.get(t);return e?e.nextKey:null}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(t){return this.keyMap.get(t)}at(t){const e=[...this.getKeys()];return this.getItem(e[t])}getChildren(t){let e=this.keyMap.get(t);return(e==null?void 0:e.childNodes)||[]}constructor(t){this.keyMap=new Map,this.iterable=t;let e=n=>{if(this.keyMap.set(n.key,n),n.childNodes&&n.type==="section")for(let l of n.childNodes)e(l)};for(let n of t)e(n);let s,f=0;for(let[n,l]of this.keyMap)s?(s.nextKey=n,l.prevKey=s.key):(this.firstKey=n,l.prevKey=void 0),l.type==="item"&&(l.index=f++),s=l,s.nextKey=void 0;this.lastKey=s==null?void 0:s.key}}function w(i){let{filter:t}=i,e=k(i),s=o.useMemo(()=>i.disabledKeys?new Set(i.disabledKeys):new Set,[i.disabledKeys]),f=o.useCallback(r=>t?new b(t(r)):new b(r),[t]),n=o.useMemo(()=>({suppressTextValueWarning:i.suppressTextValueWarning}),[i.suppressTextValueWarning]),l=M(i,f,n),u=o.useMemo(()=>new p(l,e),[l,e]);const a=o.useRef(null);return o.useEffect(()=>{if(e.focusedKey!=null&&!l.getItem(e.focusedKey)){const r=a.current.getItem(e.focusedKey),$=[...a.current.getKeys()].map(c=>{const h=a.current.getItem(c);return h.type==="item"?h:null}).filter(c=>c!==null),y=[...l.getKeys()].map(c=>{const h=l.getItem(c);return h.type==="item"?h:null}).filter(c=>c!==null),g=$.length-y.length;let d=Math.min(g>1?Math.max(r.index-g+1,0):r.index,y.length-1),m;for(;d>=0;){if(!u.isDisabled(y[d].key)){m=y[d];break}d<y.length-1?d++:(d>r.index&&(d=r.index),d--)}e.setFocusedKey(m?m.key:null)}a.current=l},[l,u,e,e.focusedKey]),{collection:l,disabledKeys:s,selectionManager:u}}export{w as $,C as a};