import{e as ee,v as ae,g as A,r as u,u as ie,h as se,B as le,i as R,x as re,f as oe,j as h}from"./app-DQR8ouMN.js";import{$ as ne,a as te,C as de}from"./chunk-KBN3H6OQ-nz5roQ3_.js";import{$ as ce}from"./chunk-GQQM5TNQ-BZdn_sLp.js";import{$ as ue,d as ve}from"./useFormValidationState-BGLjVBHh.js";import{$ as fe}from"./useControlledState-DsOKAyM-.js";import{s as be}from"./chunk-CAFRINWI-BTDo8zfp.js";function pe(e,s){let{isDisabled:r,name:d,validationBehavior:v="aria"}=e,{isInvalid:t,validationErrors:a,validationDetails:f}=s.displayValidation,{labelProps:b,fieldProps:i,descriptionProps:l,errorMessageProps:o}=ce({...e,labelElementType:"span",isInvalid:t,errorMessage:e.errorMessage||a});ne.set(s,{name:d,descriptionId:l.id,errorMessageId:o.id,validationBehavior:v});let m=ee(e,{labelable:!0}),{focusWithinProps:p}=ae({onBlurWithin:e.onBlur,onFocusWithin:e.onFocus,onFocusWithinChange:e.onFocusChange});return{groupProps:A(m,{role:"group","aria-disabled":r||void 0,...i,...p}),labelProps:b,descriptionProps:l,errorMessageProps:o,isInvalid:t,validationErrors:a,validationDetails:f}}function ge(e={}){let[s,r]=fe(e.value,e.defaultValue||[],e.onChange),d=!!e.isRequired&&s.length===0,v=u.useRef(new Map),t=ue({...e,value:s}),a=t.displayValidation.isInvalid;var f;return{...t,value:s,setValue(i){e.isReadOnly||e.isDisabled||r(i)},isDisabled:e.isDisabled||!1,isReadOnly:e.isReadOnly||!1,isSelected(i){return s.includes(i)},addValue(i){e.isReadOnly||e.isDisabled||s.includes(i)||r(s.concat(i))},removeValue(i){e.isReadOnly||e.isDisabled||s.includes(i)&&r(s.filter(l=>l!==i))},toggleValue(i){e.isReadOnly||e.isDisabled||(s.includes(i)?r(s.filter(l=>l!==i)):r(s.concat(i)))},setInvalid(i,l){let o=new Map(v.current);l.isInvalid?o.set(i,l):o.delete(i),v.current=o,t.updateValidation(ve(...o.values()))},validationState:(f=e.validationState)!==null&&f!==void 0?f:a?"invalid":null,isInvalid:a,isRequired:d}}function me(e){var s,r;const d=ie(),{as:v,ref:t,classNames:a,children:f,label:b,radius:i,value:l,name:o,defaultValue:m,isInvalid:p,validationState:y,size:V="md",color:k="primary",orientation:P="vertical",lineThrough:N=!1,isDisabled:O=!1,validationBehavior:x=(s=d==null?void 0:d.validationBehavior)!=null?s:"aria",disableAnimation:I=(r=d==null?void 0:d.disableAnimation)!=null?r:!1,isReadOnly:j,isRequired:M,onValueChange:E,description:T,errorMessage:C,className:z,...$}=e,B=v||"div",U=typeof B=="string",G=se(t),S=u.useMemo(()=>({...$,value:l,name:o,"aria-label":be($["aria-label"],b),defaultValue:m,isRequired:M,isReadOnly:j,orientation:P,validationBehavior:x,isInvalid:y==="invalid"||p,onChange:le(e.onChange,E)}),[l,o,b,m,M,j,P,E,p,y,x,$["aria-label"],$]),n=ge(S),{labelProps:W,groupProps:w,descriptionProps:_,errorMessageProps:F,validationErrors:D,validationDetails:H}=pe(S,n),J=u.useMemo(()=>({size:V,color:k,radius:i,lineThrough:N,isInvalid:n.isInvalid,isDisabled:O,disableAnimation:I,validationBehavior:x,groupState:n}),[V,k,i,N,O,I,x,n.value,n.isDisabled,n.isReadOnly,n.isInvalid,n.isSelected]),c=u.useMemo(()=>te({isRequired:M,isInvalid:n.isInvalid,disableAnimation:I}),[M,n.isInvalid,,I]),q=R(a==null?void 0:a.base,z),K=u.useCallback(()=>({ref:G,className:c.base({class:q}),...A(w,re($,{enabled:U}))}),[c,G,q,w,$]),Q=u.useCallback(()=>({className:c.label({class:a==null?void 0:a.label}),...W}),[c,W,a==null?void 0:a.label]),X=u.useCallback(()=>({className:c.wrapper({class:a==null?void 0:a.wrapper}),role:"presentation","data-orientation":P}),[c,P,a==null?void 0:a.wrapper]),Y=u.useCallback((g={})=>({...g,..._,className:c.description({class:R(a==null?void 0:a.description,g==null?void 0:g.className)})}),[c,_,a==null?void 0:a.description]),Z=u.useCallback((g={})=>({...g,...F,className:c.errorMessage({class:R(a==null?void 0:a.errorMessage,g==null?void 0:g.className)})}),[c,F,a==null?void 0:a.errorMessage]);return{Component:B,children:f,label:b,context:J,description:T,isInvalid:n.isInvalid,errorMessage:typeof C=="function"?C({isInvalid:n.isInvalid,validationErrors:D,validationDetails:H}):C||(D==null?void 0:D.join(" ")),getGroupProps:K,getLabelProps:Q,getWrapperProps:X,getDescriptionProps:Y,getErrorMessageProps:Z}}var L=oe((e,s)=>{const{children:r,context:d,label:v,description:t,isInvalid:a,errorMessage:f,getGroupProps:b,getLabelProps:i,getWrapperProps:l,getDescriptionProps:o,getErrorMessageProps:m}=me({...e,ref:s}),p=u.useMemo(()=>f,[a]);return h.jsxs("div",{...b(),children:[v&&h.jsx("span",{...i(),children:v}),h.jsx("div",{...l(),children:h.jsx(de,{value:d,children:r})}),a&&p?h.jsx("div",{...m(),children:p}):t?h.jsx("div",{...o(),children:t}):null]})});L.displayName="NextUI.CheckboxGroup";var Ce=L;export{Ce as c};