import{r as p,j as e,c as b,a as v,b as I,d as n}from"./app-DQR8ouMN.js";import{P as S}from"./PumpDelivery-CZ3XJysT.js";import{CheckIcon as C}from"./Icon-CX6EwYYu.js";import{G as h}from"./iconBase-ClxmNH_N.js";import{getPumpStatusColor as D}from"./PumpStatus-5SYFXcQO.js";import{a as _}from"./chunk-QXREVWCS-C8Ky7r9k.js";import{c as L}from"./chunk-4WFLSIHH-cEutGiMt.js";import{i as r}from"./chunk-GQQM5TNQ-BZdn_sLp.js";import{c as R}from"./chunk-JHUBASYZ-sQ9hRzsO.js";import{b as i}from"./chunk-DBLREEYE-CoXvdbmO.js";import{m as F,a as w,b as T,c as U,d as k}from"./chunk-P2T5LMDM-MUOmPblZ.js";import{d as f}from"./chunk-44JHHBS2-BSFQFpH5.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-YRZGWF2W-Db8dcd_Q.js";import"./scrollIntoView-B1mZhU84.js";import"./FocusScope-DMt3cHMA.js";import"./getScrollParent-CSIo9Hxx.js";import"./SelectionManager-yDbbLw-S.js";import"./useControlledState-DsOKAyM-.js";import"./chunk-KBN3H6OQ-nz5roQ3_.js";import"./useToggleState-alzNwMpt.js";import"./useFormReset-DweNStx9.js";import"./index-goXRPerO.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-BGLjVBHh.js";import"./VisuallyHidden-DiWMGts7.js";import"./LiveAnnouncer-C2oPZAHC.js";import"./useCollator-5Zmd5rxj.js";import"./useHasTabbableChild-BQh_kJOy.js";import"./chunk-IXXDDLGU-BtRYqgzk.js";import"./chunk-M3MASYO7-DJpgnKTJ.js";import"./useLabel-BpByWgep.js";import"./useLabels-CSRCNtbm.js";function M(s){return h({tag:"svg",attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm75.31 260.69a16 16 0 1 1-22.62 22.62L256 278.63l-52.69 52.68a16 16 0 0 1-22.62-22.62L233.37 256l-52.68-52.69a16 16 0 0 1 22.62-22.62L256 233.37l52.69-52.68a16 16 0 0 1 22.62 22.62L278.63 256z"},child:[]}]})(s)}function A(s){return h({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",strokeWidth:"2",d:"M3,3 L21,21 M3,21 L21,3"},child:[]}]})(s)}const ze=({pump:s,handleAppendDeliveryData:x,onToast:l})=>{const g=s.Data.NozzleUp||s.Type==="PumpFillingStatus"||s.Type===!s.Data.NozzleUp,c={fontFamily:"'Roboto Mono', monospace",fontSize:"1rem",fontWeight:"bold"},[d,o]=p.useState(!1),[B,u]=p.useState([]),y=async a=>{try{const t=await n.post("/authorize-pump",a);return l("Pump authorized","success"),console.log("Authorization successful:",t.data),!0}catch(t){return l("Error authorizing pump:",t),console.error("Error authorizing pump:",t),!1}},j=async a=>{const t={Pump:a.Id,Nozzle:a.Data.NozzleUp,Type:"FullTank",Dose:a.Data.Dose,Price:a.Data.Price};await y(t)&&u(O=>({...O,[a.Id]:!0}))},P=a=>{n.post("/stop-pump",{Pump:a}).then(t=>{l("Pump stopped","success"),console.log("Pump stopped successfully:",t.data),u(m=>({...m,[a]:!1})),o(!1)}).catch(t=>{l("Error stopping pump:",t),console.error("Error stopping pump:",t)})},z=a=>{n.post("/suspend",{Pump:a}).then(t=>{l("Pump suspended","success"),console.log("Pump suspended successfully:",t.data),o(!1)}).catch(t=>{l("Error suspending pump:",t),console.error("Error suspending pump:",t)})},N=a=>{n.post("/resume",{Pump:a}).then(t=>{l("Pump resumed","success"),console.log("Pump resumed successfully:",t.data),o(!1)}).catch(t=>{l("Error resumed pump:",t),console.error("Error resuming pump:",t)})},E=a=>{n.post("/emergency-stop",{Pump:a}).then(t=>{l("Emergency stop activated","success"),console.log("Emergency stop activated:",t.data),o(!1)}).catch(t=>{l("Error performing emergency stop:",t),console.error("Error performing emergency stop:",t)})};return e.jsxs(e.Fragment,{children:[e.jsxs(b,{children:[e.jsxs(v,{className:"flex items-center justify-between",children:[e.jsx(S,{pumpId:s.Id,onAppend:x,disabled:s.Type==="PumpOfflineStatus"}),e.jsx(L,{color:D(s.Type,s.Data.NozzleUp),avatar:e.jsx(_,{name:s.Data.Pump.toString(),getInitials:a=>a.slice(0,2)}),children:s.Data.NozzleUp?"NOZZLE":s.Type==="PumpIdleStatus"?"IDLE":s.Type==="PumpFillingStatus"?"FILLING":s.Type==="PumpEndOfTransactionStatus"?"DONE":s.Type==="PumpOfflineStatus"?"OFFLINE":""})]}),e.jsx(I,{className:"flex gap-2",children:s.Data.NozzleUp?e.jsx(r,{color:"success",size:"lg",value:s.Data.FuelGradeName,isReadOnly:!0}):s.Type==="PumpIdleStatus"?e.jsx(e.Fragment,{children:e.jsx(r,{color:"success",size:"lg",value:"ONLINE",isReadOnly:!0,startContent:e.jsx(C,{})})}):s.Type==="PumpFillingStatus"?e.jsxs(e.Fragment,{children:[e.jsx(r,{size:"sm",label:"AMOUNT",value:`₱ ${s.Data.Amount}`,isReadOnly:!0,style:c}),e.jsx(r,{size:"sm",label:"VOLUME",value:`L ${s.Data.Volume}`,isReadOnly:!0,style:c}),e.jsx(r,{size:"sm",label:"PRICE",value:s.Data.Price,isReadOnly:!0,style:c})]}):s.Type==="PumpEndOfTransactionStatus"?e.jsxs(e.Fragment,{children:[e.jsx(r,{size:"sm",label:"AMOUNT",value:s.Data.Amount,isReadOnly:!0,style:c}),e.jsx(r,{size:"sm",label:"VOLUME",value:s.Data.Volume,isReadOnly:!0,style:c}),e.jsx(r,{size:"sm",label:"PRICE",value:s.Data.Price,isReadOnly:!0,style:c})]}):s.Type==="PumpOfflineStatus"?e.jsx(r,{color:"danger",size:"lg",value:"OFFLINE",isReadOnly:!0,startContent:e.jsx(M,{className:"w-6 h-6"})}):null}),g&&e.jsxs(R,{className:"flex gap-2",children:[e.jsx(i,{size:"sm",color:"success",onClick:()=>j(s),className:"w-full",children:"AUTHORIZE"}),e.jsx(i,{size:"sm",onClick:()=>o(!d),className:"w-full",children:"CONTROLS"})]})]},s.Id),e.jsx(F,{hideCloseButton:!0,placement:"center",classNames:{backdrop:"bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"},isOpen:d,onClose:()=>o(!1),size:"2xl",className:"bg-gray-200",children:e.jsxs(w,{children:[e.jsxs(T,{className:"text-xl font-extrabold",children:["Pump (",s.Id,") Controls"," "]}),e.jsx(f,{}),e.jsx(U,{children:e.jsxs("div",{className:"grid grid-cols-2 gap-4 p-4",children:[e.jsx(i,{variant:"shadow",size:"lg",color:"warning",onClick:()=>z(s.Id),className:"h-[100px]",children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"SUSPEND"})})}),e.jsx(i,{size:"lg",onClick:()=>P(s.Id),className:"h-[100px] bg-red-600",children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"STOP"})})}),e.jsx(i,{size:"lg",color:"success",onClick:()=>N(s.Id),className:"h-[100px]",children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"RESUME"})})}),e.jsx(i,{size:"lg",className:"bg-red-400 h-[100px]",onClick:()=>E(s.Id),children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:"EMERGENCY STOP"})})})]})}),e.jsx(f,{}),e.jsx(k,{children:e.jsx(i,{isIconOnly:!0,color:"danger",variant:"flat",onClick:()=>o(!1),children:e.jsx(A,{className:"w-5 h-5"})})})]})})]})};export{ze as PumpCard};