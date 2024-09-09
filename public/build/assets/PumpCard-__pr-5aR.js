import{r as h,j as e,a as d}from"./app-n36vVTPw.js";import{P as E}from"./PumpDelivery-DPgFqETz.js";import{CheckIcon as S}from"./Icon-CaRdxmHi.js";import{G as n}from"./iconBase-BVOvUb33.js";import{getPumpStatusColor as O}from"./PumpStatus-5SYFXcQO.js";import{c as I,a as b}from"./chunk-4WFLSIHH-1_MoSqrP.js";import{c as D}from"./chunk-H4VOEXHF-CIerkNbz.js";import{c as w}from"./chunk-J333S7JQ-B_k3DFh5.js";import{c as _}from"./chunk-5ALFRFZW-3YVjzm4v.js";import{i as l}from"./chunk-GQQM5TNQ-C-BqKqXC.js";import{c as L}from"./chunk-JHUBASYZ-DNTxmmb6.js";import{b as i}from"./chunk-DBLREEYE-DsyCbxuc.js";import{m as R,a as F,b as M,c as T,d as U}from"./chunk-P2T5LMDM-DZ2omyt5.js";import{d as f}from"./chunk-44JHHBS2-B2yHAC2s.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-Dvubd9oX.js";import"./chunk-YRZGWF2W-OP-Elgo8.js";import"./chunk-RQNQ5XFG-BUtyfjwu.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-XHQUSKIE-DurFZmLo.js";import"./scrollIntoView-DeP1hHqy.js";import"./FocusScope--R9rqcsT.js";import"./useFocusable-BSFbFbJ7.js";import"./getScrollParent-PAEJV1DV.js";import"./SelectionManager-Mzy0TgGM.js";import"./useControlledState-pJW3fiyf.js";import"./useToggleState-B3OkkGos.js";import"./useFormReset-WRUJvgzs.js";import"./index-Cxc5vKLe.js";import"./index-DADyRLNe.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-B1Ysygky.js";import"./VisuallyHidden-DMb5cN1n.js";import"./LiveAnnouncer-DpCDz5B5.js";import"./useCollator-CBdADFcE.js";import"./useHasTabbableChild-lRWXv8zI.js";import"./chunk-IXXDDLGU-BkBBYKg5.js";import"./index-DnYwqSG1.js";import"./chunk-M3MASYO7-yQGwqfJu.js";import"./chunk-6NL67ZRH-DSizpE0E.js";import"./useLabel-Cq0GkGCJ.js";import"./useLabels-BYFFHVAx.js";function k(t){return n({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"},child:[]}]})(t)}function B(t){return n({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-32 272a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0zm96 0a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0z"},child:[]}]})(t)}function A(t){return n({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm74.77 217.3-114.45 69.14a10.78 10.78 0 0 1-16.32-9.31V186.87a10.78 10.78 0 0 1 16.32-9.31l114.45 69.14a10.89 10.89 0 0 1 0 18.6z"},child:[]}]})(t)}function V(t){return n({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 288H176V176h160z"},child:[]}]})(t)}function G(t){return n({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm80 262.4a25.62 25.62 0 0 1-25.6 25.6H201.6a25.62 25.62 0 0 1-25.6-25.6V201.6a25.62 25.62 0 0 1 25.6-25.6h108.8a25.62 25.62 0 0 1 25.6 25.6z"},child:[]}]})(t)}function H(t){return n({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",strokeWidth:"2",d:"M3,3 L21,21 M3,21 L21,3"},child:[]}]})(t)}const Re=({pump:t,handleAppendDeliveryData:x,onToast:r})=>{const g=t.Data.NozzleUp||t.Type==="PumpFillingStatus"||t.Type===!t.Data.NozzleUp,c={fontFamily:"'Roboto Mono', monospace",fontSize:"1rem",fontWeight:"bold"},[m,o]=h.useState(!1),[Z,u]=h.useState([]),j=async a=>{try{const s=await d.post("/authorize-pump",a);return r("Pump authorized","success"),console.log("Authorization successful:",s.data),!0}catch(s){return r("Error authorizing pump:",s),console.error("Error authorizing pump:",s),!1}},y=async a=>{const s={Pump:a.Id,Nozzle:a.Data.NozzleUp,Type:"FullTank",Dose:a.Data.Dose,Price:a.Data.Price};await j(s)&&u(v=>({...v,[a.Id]:!0}))},z=a=>{d.post("/stop-pump",{Pump:a}).then(s=>{r("Pump stopped","success"),console.log("Pump stopped successfully:",s.data),u(p=>({...p,[a]:!1})),o(!1)}).catch(s=>{r("Error stopping pump:",s),console.error("Error stopping pump:",s)})},P=a=>{d.post("/suspend",{Pump:a}).then(s=>{r("Pump suspended","success"),console.log("Pump suspended successfully:",s.data),o(!1)}).catch(s=>{r("Error suspending pump:",s),console.error("Error suspending pump:",s)})},N=a=>{d.post("/resume",{Pump:a}).then(s=>{r("Pump resumed","success"),console.log("Pump resumed successfully:",s.data),o(!1)}).catch(s=>{r("Error resumed pump:",s),console.error("Error resuming pump:",s)})},C=a=>{d.post("/emergency-stop",{Pump:a}).then(s=>{r("Emergency stop activated","success"),console.log("Emergency stop activated:",s.data),o(!1)}).catch(s=>{r("Error performing emergency stop:",s),console.error("Error performing emergency stop:",s)})};return e.jsxs(e.Fragment,{children:[e.jsxs(D,{children:[e.jsxs(w,{className:"flex items-center justify-between",children:[e.jsx(E,{pumpId:t.Id,onAppend:x,disabled:t.Type==="PumpOfflineStatus"}),e.jsx(I,{size:"lg",color:O(t.Type,t.Data.NozzleUp),avatar:e.jsx(b,{name:t.Data.Pump.toString(),getInitials:a=>a.slice(0,2)}),children:t.Data.NozzleUp?"NOZZLE":t.Type==="PumpIdleStatus"?"IDLE":t.Type==="PumpFillingStatus"?"FILLING":t.Type==="PumpEndOfTransactionStatus"?"DONE":t.Type==="PumpOfflineStatus"?"OFFLINE":""})]}),e.jsx(_,{className:"flex gap-2",children:t.Data.NozzleUp?e.jsx(l,{color:"success",size:"lg",value:t.Data.FuelGradeName,isReadOnly:!0}):t.Type==="PumpIdleStatus"?e.jsx(e.Fragment,{children:e.jsx(l,{color:"success",size:"lg",value:"ONLINE",isReadOnly:!0,startContent:e.jsx(S,{})})}):t.Type==="PumpFillingStatus"?e.jsxs(e.Fragment,{children:[e.jsx(l,{size:"sm",label:"AMOUNT",value:`₱ ${t.Data.Amount}`,isReadOnly:!0,style:c}),e.jsx(l,{size:"sm",label:"VOLUME",value:`L ${t.Data.Volume}`,isReadOnly:!0,style:c}),e.jsx(l,{size:"sm",label:"PRICE",value:t.Data.Price,isReadOnly:!0,style:c})]}):t.Type==="PumpEndOfTransactionStatus"?e.jsxs(e.Fragment,{children:[e.jsx(l,{size:"sm",label:"AMOUNT",value:t.Data.Amount,isReadOnly:!0,style:c}),e.jsx(l,{size:"sm",label:"VOLUME",value:t.Data.Volume,isReadOnly:!0,style:c}),e.jsx(l,{size:"sm",label:"PRICE",value:t.Data.Price,isReadOnly:!0,style:c})]}):t.Type==="PumpOfflineStatus"?e.jsx(l,{color:"danger",size:"lg",value:"OFFLINE",isReadOnly:!0,startContent:e.jsx(k,{className:"w-6 h-6"})}):null}),g&&e.jsxs(L,{className:"flex gap-2",children:[e.jsx(i,{size:"sm",color:"success",onClick:()=>y(t),className:"w-full",children:"AUTHORIZE"}),e.jsx(i,{size:"sm",onClick:()=>o(!m),className:"w-full",children:"CONTROLS"})]})]},t.Id),e.jsx(R,{hideCloseButton:!0,placement:"center",classNames:{backdrop:"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"},isOpen:m,onClose:()=>o(!1),size:"2xl",className:"bg-gray-200",children:e.jsxs(F,{children:[e.jsxs(M,{className:"text-xl font-extrabold",children:["Pump (",t.Id,") Controls"," "]}),e.jsx(f,{}),e.jsx(T,{children:e.jsxs("div",{className:"grid grid-cols-2 gap-4 p-4",children:[e.jsx(i,{variant:"shadow",size:"lg",color:"warning",onClick:()=>P(t.Id),className:"h-[100px]",startContent:e.jsx(B,{className:"w-10 h-10 text-default"}),children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"SUSPEND"})})}),e.jsx(i,{size:"lg",onClick:()=>z(t.Id),className:"h-[100px] bg-red-600",startContent:e.jsx(G,{className:"w-10 h-10 text-default"}),children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"STOP"})})}),e.jsx(i,{size:"lg",color:"success",onClick:()=>N(t.Id),className:"h-[100px]",startContent:e.jsx(A,{className:"w-10 h-10 text-default"}),children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"RESUME"})})}),e.jsx(i,{size:"lg",className:"bg-red-400 h-[100px]",onClick:()=>C(t.Id),startContent:e.jsx(V,{className:"w-10 h-10 text-default"}),children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"EMERGENCY STOP"})})})]})}),e.jsx(f,{}),e.jsx(U,{children:e.jsx(i,{isIconOnly:!0,color:"danger",variant:"flat",onClick:()=>o(!1),children:e.jsx(H,{className:"w-5 h-5"})})})]})})]})};export{Re as PumpCard};
