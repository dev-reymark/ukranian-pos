import{$ as s}from"./FocusScope-CpJfrh8k.js";import{r as u}from"./app-CG3hSCCP.js";import{a as c}from"./chunk-XHQUSKIE-B4ClOMq7.js";function f(e,t){let a=t==null?void 0:t.isDisabled,[d,i]=u.useState(!1);return c(()=>{if(e!=null&&e.current&&!a){let r=()=>{if(e.current){let l=s(e.current,{tabbable:!0});i(!!l.nextNode())}};r();let b=new MutationObserver(r);return b.observe(e.current,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["tabIndex","disabled"]}),()=>{b.disconnect()}}}),a?!1:d}export{f as $};
