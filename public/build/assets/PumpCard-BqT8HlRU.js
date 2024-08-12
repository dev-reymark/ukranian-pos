import{r as u,j as e,a as c}from"./app-B13YKW_w.js";import{G as O,P as D}from"./PumpDelivery-CdsU7QiW.js";import{CheckIcon as I}from"./Icon-CWR4-TFG.js";import{getPumpStatusColor as S}from"./PumpStatus-5SYFXcQO.js";import{_ as r}from"./index-5pSfNWbF.js";import{c as C,a as T}from"./chunk-4WFLSIHH-DviHhCtR.js";import{m as _}from"./chunk-QY5NICTW-tAdxUi2F.js";import{m as b,a as v,b as R,c as F}from"./chunk-P2T5LMDM-Dvy91txP.js";import{c as U,a as L}from"./chunk-H4VOEXHF-C77IdC6V.js";import{c as k}from"./chunk-J333S7JQ-CEV_D6Sy.js";import{i as a}from"./chunk-GQQM5TNQ-b06q-Slb.js";import{c as A}from"./chunk-JHUBASYZ-CHOOix6D.js";import{b as l}from"./chunk-DBLREEYE-_M-jC6rp.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-DbcteAkG.js";import"./chunk-YRZGWF2W-BNPvVFkT.js";import"./chunk-RQNQ5XFG-BEO_Vy4a.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-XHQUSKIE-BJttt81n.js";import"./useFocusable-CJx9Sf83.js";import"./FocusScope-wBr34Col.js";import"./useToggleState-D0ujZHwj.js";import"./useFormReset-CyswiiAq.js";import"./useControlledState-BAe95iGj.js";import"./index-BRN5hi7g.js";import"./index-kbMzUDjs.js";import"./useHover-CT5Nd7gs.js";import"./chunk-CAFRINWI-CcU5yOMx.js";import"./useFormValidationState-DmX75uRy.js";import"./VisuallyHidden-Q2esyisB.js";import"./chunk-IXXDDLGU-DLqbFj8l.js";import"./index-C9vh_wYu.js";import"./chunk-M3MASYO7-C86nU8Eu.js";import"./useLabels-B481ciqs.js";import"./features-animation-illd0dSo.js";import"./index-Bu8MEbox.js";import"./chunk-6NL67ZRH-DeX_NuNZ.js";import"./useField-C_qj4B-W.js";function w(s){return O({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"},child:[]}]})(s)}const De=({pump:s,handleAppendDeliveryData:f})=>{const g=s.Data.NozzleUp||s.Type==="PumpFillingStatus"||s.Type===!s.Data.NozzleUp,i={fontFamily:"'Roboto Mono', monospace",fontSize:"1rem",fontWeight:"bold"},[m,n]=u.useState(!1),[M,d]=u.useState([]),h=o=>{r.success(`Nozzle is up for Pump ${o}`)};u.useEffect(()=>{s.Data.NozzleUp&&h(s.Id)},[s.Data.NozzleUp]);const y=async o=>{try{const t=await c.post("/authorize-pump",o);return r.success("Pump authorized successfully"),console.log("Authorization successful:",t.data),!0}catch(t){return r.error("Error authorizing pump"),console.error("Error authorizing pump:",t),!1}},z=async o=>{const t={Pump:o.Id,Nozzle:o.Data.NozzleUp,Type:"FullTank",Dose:o.Data.Dose,Price:o.Data.Price};await y(t)&&d(N=>({...N,[o.Id]:!0}))},P=o=>{c.post("/stop-pump",{Pump:o}).then(t=>{r.success("Pump stopped successfully"),console.log("Pump stopped successfully:",t.data),d(p=>({...p,[o]:!1}))}).catch(t=>{r.error("Error stopping pump"),console.error("Error stopping pump:",t)})},x=o=>{c.post("/suspend",{Pump:o}).then(t=>{r.success("Pump suspended successfully"),console.log("Pump suspended successfully:",t.data)}).catch(t=>{r.error("Error suspending pump"),console.error("Error suspending pump:",t)})},j=o=>{c.post("/resume",{Pump:o}).then(t=>{r.success("Pump resumed successfully"),console.log("Pump resumed successfully:",t.data)}).catch(t=>{r.error("Error resuming pump"),console.error("Error resuming pump:",t)})},E=o=>{c.post("/emergency-stop",{Pump:o}).then(t=>{r.success("Emergency stop activated"),console.log("Emergency stop activated:",t.data)}).catch(t=>{r.error("Error performing emergency stop"),console.error("Error performing emergency stop:",t)})};return e.jsxs(e.Fragment,{children:[e.jsxs(U,{className:"p-2",children:[e.jsxs(k,{className:"flex items-center justify-between",children:[e.jsx(D,{pumpId:s.Id,onAppend:f,disabled:s.Type==="PumpOfflineStatus"}),e.jsx(C,{size:"lg",color:S(s.Type,s.Data.NozzleUp),avatar:e.jsx(T,{name:s.Data.Pump.toString(),getInitials:o=>o.charAt(0)}),children:s.Data.NozzleUp?"NOZZLE":s.Type==="PumpIdleStatus"?"IDLE":s.Type==="PumpFillingStatus"?"FILLING":s.Type==="PumpEndOfTransactionStatus"?"DONE":s.Type==="PumpOfflineStatus"?"OFFLINE":""})]}),e.jsx(L,{className:"flex gap-2",children:s.Data.NozzleUp?e.jsx(a,{color:"success",size:"lg",value:s.Data.FuelGradeName,isReadOnly:!0}):s.Type==="PumpIdleStatus"?e.jsx(e.Fragment,{children:e.jsx(a,{color:"success",size:"lg",value:"ONLINE",isReadOnly:!0,startContent:e.jsx(I,{})})}):s.Type==="PumpFillingStatus"?e.jsxs(e.Fragment,{children:[e.jsx(a,{size:"sm",label:"AMOUNT",value:`₱ ${s.Data.Amount}`,isReadOnly:!0,style:i}),e.jsx(a,{size:"sm",label:"VOLUME",value:`L ${s.Data.Volume}`,isReadOnly:!0,style:i}),e.jsx(a,{size:"sm",label:"PRICE",value:s.Data.Price,isReadOnly:!0,style:i})]}):s.Type==="PumpEndOfTransactionStatus"?e.jsxs(e.Fragment,{children:[e.jsx(a,{size:"sm",label:"AMOUNT",value:s.Data.Amount,isReadOnly:!0,style:i}),e.jsx(a,{size:"sm",label:"VOLUME",value:s.Data.Volume,isReadOnly:!0,style:i}),e.jsx(a,{size:"sm",label:"PRICE",value:s.Data.Price,isReadOnly:!0,style:i})]}):s.Type==="PumpOfflineStatus"?e.jsx(a,{color:"danger",size:"lg",value:"OFFLINE",isReadOnly:!0,startContent:e.jsx(w,{className:"w-6 h-6"})}):null}),g&&e.jsxs(A,{className:"flex gap-2",children:[e.jsx(l,{size:"sm",color:"success",onClick:()=>z(s),children:"AUTHORIZE"}),e.jsx(l,{size:"sm",onClick:()=>n(!m),children:"CONTROLS"})]})]},s.Id),e.jsx(b,{placement:"center",classNames:{backdrop:"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"},isOpen:m,onClose:()=>n(!1),children:e.jsxs(v,{children:[e.jsxs(R,{children:["Pump (",s.Id,") Controls "]}),e.jsx(F,{children:e.jsxs("div",{className:"grid grid-cols-2 gap-4 p-4",children:[e.jsx(l,{size:"lg",color:"danger",onClick:()=>P(s.Id),children:"STOP"}),e.jsx(l,{size:"lg",color:"warning",onClick:()=>x(s.Id),children:"SUSPEND"}),e.jsx(l,{size:"lg",color:"primary",onClick:()=>j(s.Id),children:"RESUME"}),e.jsx(l,{size:"lg",className:"bg-red-500",onClick:()=>E(s.Id),children:"EMERGENCY STOP"})]})}),e.jsx(_,{children:e.jsx(l,{color:"danger",variant:"flat",onClick:()=>n(!1),children:"Close"})})]})})]})};export{De as PumpCard};