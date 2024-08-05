import{r as n,j as e,Y as w,a as C}from"./app-B4BG-zsf.js";import _ from"./ApplicationLogo-a1VD8DSV.js";import{I as P,_ as f}from"./index-CTtetcYR.js";import{EyeSlashFilledIcon as I,EyeFilledIcon as S}from"./Icon-DJHGUTBe.js";import{c as E,a as D}from"./chunk-H4VOEXHF-KXDKSMRY.js";import{c as L,i as g,a as R}from"./chunk-GQQM5TNQ-MgHbtYIT.js";import{f as V}from"./useHover-BpzbR3dc.js";import{t as M,f as T}from"./chunk-N2KXC5ZE-BW_RAGKI.js";import{s as x}from"./chunk-IXXDDLGU-YwwyhbHd.js";import{b as k}from"./chunk-DBLREEYE-BMCo4_kI.js";import"./index-BCtTUkCw.js";import"./index-pdR8Wy-p.js";import"./chunk-XHQUSKIE-DypDiBrP.js";import"./index-Bz6CY5HX.js";import"./chunk-6NL67ZRH-C8eIUKNI.js";import"./useControlledState-8q6f39f1.js";import"./useLabels-QLp2ZEbS.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";var A=M({base:"shrink-0 bg-divider border-none",variants:{orientation:{horizontal:"w-full h-divider",vertical:"h-full w-divider"}},defaultVariants:{orientation:"horizontal"}});function F(r){let i=V(r,{enabled:typeof r.elementType=="string"}),t;return r.orientation==="vertical"&&(t="vertical"),r.elementType!=="hr"?{separatorProps:{...i,role:"separator","aria-orientation":t}}:{separatorProps:i}}function O(r){const{as:i,className:t,orientation:s,...d}=r;let o=i||"hr";o==="hr"&&s==="vertical"&&(o="div");const{separatorProps:l}=F({elementType:typeof o=="string"?o:"hr",orientation:s}),c=n.useMemo(()=>A({orientation:s,className:t}),[s,t]),m=n.useCallback((u={})=>({className:c,role:"separator","data-orientation":s,...l,...d,...u}),[c,s,l,d]);return{Component:o,getDividerProps:m}}var j=T((r,i)=>{const{Component:t,getDividerProps:s}=O({...r});return e.jsx(t,{ref:i,...s()})});j.displayName="NextUI.Divider";var q=j;function ie(){const[r,i]=n.useState(""),[t,s]=n.useState(""),[d,o]=n.useState(!1),[l,c]=n.useState(!1),[m,u]=n.useState(""),[h,v]=n.useState(""),b=()=>c(!l),y=()=>{let a=!0;return u(""),v(""),r.trim()===""&&(u("Invalid Cashier Number"),a=!1),t.trim()===""&&(v("Invalid Password"),a=!1),a},N=async a=>{if(a.preventDefault(),!!y()){o(!0);try{await C.post("/login",{Cashier_Number:r,Cashier_Psw:t}),f.success("Login successful! Redirecting..."),setTimeout(()=>{window.location.href="/home"},1e3)}catch(p){s(""),p.response&&p.response.data?f.error(p.response.data.error||"An error occurred"):f.error("An error occurred")}finally{o(!1)}}};return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Login"}),e.jsx(P,{position:"top-right"}),e.jsx("div",{className:"flex items-center justify-center min-h-screen p-3",children:e.jsxs(E,{className:"max-w-md w-full",children:[e.jsxs(L,{className:"flex gap-3",children:[e.jsx(_,{}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("p",{className:"text-md",children:"POS WEB"}),e.jsx("p",{className:"text-small text-default-500",children:"Datalogic Systems Corporation"})]})]}),e.jsx(q,{}),e.jsx(x,{y:4}),e.jsx(D,{className:"p-5",children:e.jsxs("form",{onSubmit:N,children:[e.jsx(g,{id:"Cashier_Number",value:r,onChange:a=>i(a.target.value),label:"Cashier Number",isRequired:!0,isInvalid:!!m,errorMessage:m}),e.jsx(x,{y:6}),e.jsx(g,{id:"Cashier_Psw",endContent:e.jsx("button",{className:"focus:outline-none",type:"button",onClick:b,"aria-label":"toggle password visibility",children:l?e.jsx(I,{className:"text-2xl text-default-400 pointer-events-none"}):e.jsx(S,{className:"text-2xl text-default-400 pointer-events-none"})}),value:t,onChange:a=>s(a.target.value),label:"Password",type:l?"text":"password",isRequired:!0,isInvalid:!!h,errorMessage:h}),e.jsx(x,{y:4}),e.jsx(R,{className:"flex justify-end",children:e.jsx(k,{color:"primary",variant:"shadow",type:"submit",isLoading:d,children:d?"Logging in...":"Login"})})]})})]})})]})}export{ie as default};
