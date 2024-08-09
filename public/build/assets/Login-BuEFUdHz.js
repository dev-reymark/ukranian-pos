import{r as n,j as e,Y as w,a as C}from"./app-CZL9chFl.js";import _ from"./ApplicationLogo-CvUjkNwh.js";import{I as P,_ as f}from"./index-BQye7--Q.js";import{EyeSlashFilledIcon as I,EyeFilledIcon as S}from"./Icon-Yd2M5erF.js";import{c as E,a as D,b as L}from"./chunk-H4VOEXHF-Di3Z_Bs5.js";import{c as R}from"./chunk-J333S7JQ-CwmjM8Ow.js";import{f as V}from"./useHover-Cn_Qs2ce.js";import{t as M,f as T}from"./chunk-N2KXC5ZE-DfxA9TNT.js";import{s as x}from"./chunk-IXXDDLGU-HU1QgMOq.js";import{i as g}from"./chunk-GQQM5TNQ-Cnr-i4s3.js";import{b as k}from"./chunk-DBLREEYE-CtPbsGHj.js";import"./chunk-NK4BRF7C-dghsNpkO.js";import"./index-DJhsGy01.js";import"./index-DlIxkoSw.js";import"./chunk-XHQUSKIE-CRTs_YlA.js";import"./index-C4dpBN_I.js";import"./chunk-6NL67ZRH-CDLHZ7fz.js";import"./useFormValidationState-p9Ei66cx.js";import"./useControlledState-ooh80znK.js";import"./useLabels-tDIuDQ55.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";var A=M({base:"shrink-0 bg-divider border-none",variants:{orientation:{horizontal:"w-full h-divider",vertical:"h-full w-divider"}},defaultVariants:{orientation:"horizontal"}});function F(r){let i=V(r,{enabled:typeof r.elementType=="string"}),t;return r.orientation==="vertical"&&(t="vertical"),r.elementType!=="hr"?{separatorProps:{...i,role:"separator","aria-orientation":t}}:{separatorProps:i}}function O(r){const{as:i,className:t,orientation:s,...d}=r;let o=i||"hr";o==="hr"&&s==="vertical"&&(o="div");const{separatorProps:l}=F({elementType:typeof o=="string"?o:"hr",orientation:s}),c=n.useMemo(()=>A({orientation:s,className:t}),[s,t]),m=n.useCallback((u={})=>({className:c,role:"separator","data-orientation":s,...l,...d,...u}),[c,s,l,d]);return{Component:o,getDividerProps:m}}var b=T((r,i)=>{const{Component:t,getDividerProps:s}=O({...r});return e.jsx(t,{ref:i,...s()})});b.displayName="NextUI.Divider";var q=b;function le(){const[r,i]=n.useState(""),[t,s]=n.useState(""),[d,o]=n.useState(!1),[l,c]=n.useState(!1),[m,u]=n.useState(""),[h,v]=n.useState(""),j=()=>c(!l),y=()=>{let a=!0;return u(""),v(""),r.trim()===""&&(u("Invalid Cashier Number"),a=!1),t.trim()===""&&(v("Invalid Password"),a=!1),a},N=async a=>{if(a.preventDefault(),!!y()){o(!0);try{await C.post("/login",{Cashier_Number:r,Cashier_Psw:t}),f.success("Login successful! Redirecting..."),setTimeout(()=>{window.location.href="/home"},1e3)}catch(p){s(""),p.response&&p.response.data?f.error(p.response.data.error||"An error occurred"):f.error("An error occurred")}finally{o(!1)}}};return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Login"}),e.jsx(P,{position:"top-right"}),e.jsx("div",{className:"flex items-center justify-center min-h-screen p-3",children:e.jsxs(E,{className:"max-w-md w-full",children:[e.jsxs(R,{className:"flex gap-3",children:[e.jsx(_,{}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("p",{className:"text-md",children:"POS WEB"}),e.jsx("p",{className:"text-small text-default-500",children:"Datalogic Systems Corporation"})]})]}),e.jsx(q,{}),e.jsx(x,{y:4}),e.jsx(D,{className:"p-5",children:e.jsxs("form",{onSubmit:N,children:[e.jsx(g,{id:"Cashier_Number",value:r,onChange:a=>i(a.target.value),label:"Cashier Number",isRequired:!0,isInvalid:!!m,errorMessage:m}),e.jsx(x,{y:6}),e.jsx(g,{id:"Cashier_Psw",endContent:e.jsx("button",{className:"focus:outline-none",type:"button",onClick:j,"aria-label":"toggle password visibility",children:l?e.jsx(I,{className:"text-2xl text-default-400 pointer-events-none"}):e.jsx(S,{className:"text-2xl text-default-400 pointer-events-none"})}),value:t,onChange:a=>s(a.target.value),label:"Password",type:l?"text":"password",isRequired:!0,isInvalid:!!h,errorMessage:h}),e.jsx(x,{y:4}),e.jsx(L,{className:"flex justify-end",children:e.jsx(k,{color:"primary",variant:"shadow",type:"submit",isLoading:d,children:d?"Logging in...":"Login"})})]})})]})})]})}export{le as default};
