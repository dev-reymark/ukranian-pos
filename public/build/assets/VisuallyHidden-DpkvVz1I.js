import{d,e as p}from"./chunk-XHQUSKIE-B4ClOMq7.js";import{e as u,r as c}from"./app-CG3hSCCP.js";const a={border:0,clip:"rect(0 0 0 0)",clipPath:"inset(50%)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"absolute",width:"1px",whiteSpace:"nowrap"};function f(t={}){let{style:e,isFocusable:s}=t,[i,l]=c.useState(!1),{focusWithinProps:o}=p({isDisabled:!s,onFocusWithinChange:n=>l(n)}),r=c.useMemo(()=>i?e:e?{...a,...e}:a,[i]);return{visuallyHiddenProps:{...o,style:r}}}function h(t){let{children:e,elementType:s="div",isFocusable:i,style:l,...o}=t,{visuallyHiddenProps:r}=f(t);return u.createElement(s,d(o,r),e)}export{h as $};
