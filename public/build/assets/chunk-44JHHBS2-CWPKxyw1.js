import{t as f,x as c,r as l,f as u,j as m}from"./app-DJ0OCxwK.js";var h=f({base:"shrink-0 bg-divider border-none",variants:{orientation:{horizontal:"w-full h-divider",vertical:"h-full w-divider"}},defaultVariants:{orientation:"horizontal"}});function P(e){let a=c(e,{enabled:typeof e.elementType=="string"}),t;return e.orientation==="vertical"&&(t="vertical"),e.elementType!=="hr"?{separatorProps:{...a,role:"separator","aria-orientation":t}}:{separatorProps:a}}function x(e){const{as:a,className:t,orientation:r,...o}=e;let i=a||"hr";i==="hr"&&r==="vertical"&&(i="div");const{separatorProps:n}=P({elementType:typeof i=="string"?i:"hr",orientation:r}),s=l.useMemo(()=>h({orientation:r,className:t}),[r,t]),p=l.useCallback((v={})=>({className:s,role:"separator","data-orientation":r,...n,...o,...v}),[s,r,n,o]);return{Component:i,getDividerProps:p}}var d=u((e,a)=>{const{Component:t,getDividerProps:r}=x({...e});return m.jsx(t,{ref:a,...r()})});d.displayName="NextUI.Divider";var D=d;export{D as d};
