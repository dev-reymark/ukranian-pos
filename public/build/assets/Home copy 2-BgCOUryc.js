import{r as s,j as e,Y as de,a as f}from"./app-BYi9tuF7.js";import{S as me}from"./sweetalert2.all-CTmfw0jT.js";import{F as ue}from"./PumpDelivery-C8rgAp5Q.js";import{I as pe,_ as i}from"./index-CVdcG2D0.js";import{S as ge,t as fe,a as P}from"./SaleWindowTabs-DxazKthQ.js";import he from"./MOPCard-s0IcKNg0.js";import xe,{buttons as Se}from"./POSKeyboard-CR2_mGO0.js";import{PumpCard as ve}from"./PumpCard-DJ-_97QN.js";import{CustomerDetails as be}from"./CustomerDetails-Cjr1g3XQ.js";import{PrinterStatus as Ne}from"./PrinterStatus-eOyPZqCp.js";import{GetDateTime as ye}from"./GetDateTime-BEt1Fd8D.js";import{ThemeSwitcher as je}from"./ThemeSwitcher-DQ-Jpy8i.js";import we from"./Index-BL1FAs1b.js";import{c as b}from"./chunk-H4VOEXHF-D8hGIvgC.js";import{c as Ce}from"./chunk-J333S7JQ-Cxk5UjpG.js";import{c as Ie}from"./chunk-5ALFRFZW-DWeaAOkY.js";import{s as De}from"./chunk-IXXDDLGU-D3vfhPpI.js";import{i as x}from"./chunk-GQQM5TNQ-DVzymyfw.js";import{m as Pe,a as Oe,b as _e,c as Ee,d as Te}from"./chunk-P2T5LMDM-CWhZwe9K.js";import{b as $}from"./chunk-DBLREEYE-DcM24RjU.js";import"./iconBase-B62i2Whz.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-DcgP4m1g.js";import"./chunk-YRZGWF2W-KIFfQ5oN.js";import"./chunk-RQNQ5XFG-B478yn5k.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-XHQUSKIE-C0RpEu3F.js";import"./index-Bl3w9zLl.js";import"./FocusScope-BDx0lyY5.js";import"./useFocusable-CLUzAn8J.js";import"./useControlledState--ZzFRhQU.js";import"./index-Du5ZOa_8.js";import"./useToggleState-Dn7xOeo0.js";import"./useFormReset-BrJWIjys.js";import"./chunk-CAFRINWI-CcU5yOMx.js";import"./useFormValidationState-BtddyxEJ.js";import"./VisuallyHidden-DhxpZ2h2.js";import"./useLabels-DH8MqdYW.js";import"./index-X92CTFGl.js";import"./chunk-6NL67ZRH-CBRxC36I.js";import"./useListState-CETM4wSq.js";import"./index-DACJo6SB.js";import"./chunk-44JHHBS2-B1X7hIzv.js";import"./useLabel-D9HjlwO3.js";import"./Icon-jT0sHoOM.js";import"./PumpStatus-5SYFXcQO.js";import"./chunk-4WFLSIHH-gmfPKLzN.js";import"./index-snb_Qqja.js";import"./chunk-M3MASYO7-BYPWylsw.js";import"./chunk-JHUBASYZ-9Uw73AKK.js";import"./ElectricJournal-Cq7j8IFR.js";import"./AboutSoftware-P68TTCL3.js";import"./ApplicationLogo-Ink6fB3v.js";import"./chunk-NK4BRF7C-BS7y_hwM.js";function Bt(){const[p,c]=s.useState(""),[S,N]=s.useState([]),[y,j]=s.useState([]),[w,g]=s.useState(!1),[m,d]=s.useState(()=>{const t=localStorage.getItem("deliveryData");return t?JSON.parse(t):[]}),[v,O]=s.useState(null),[C,_]=s.useState(!1),[E,G]=s.useState(!1),u=s.useRef(null);s.useState([]);const[T,I]=s.useState(0),[Fe,Y]=s.useState(!1),[Me,W]=s.useState(0),[K,A]=s.useState(!1),[F,M]=s.useState(""),[R,B]=s.useState(""),[X,k]=s.useState(""),[z,J]=s.useState(""),[q,Re]=s.useState(0),Q=async()=>{if((await me.fire({title:"Are you sure?",text:"You are about to log out and you won't be able to recover this session!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, log out!"})).isConfirmed)try{await f.post("/logout"),window.location.href="/"}catch(a){console.error("Error logging out:",a)}},Z=()=>{A(!0)},U=()=>{A(!1)},ee=()=>{U()},te=t=>{d(a=>{const n=[...a,t];return localStorage.setItem("deliveryData",JSON.stringify(n)),n})},ae=()=>{c("")},se=()=>{c(`Subtotal: ₱${h}`)},re=()=>{if(m.length===0){i.error("No transactions to void");return}d([]),localStorage.removeItem("transaction"),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),i.success("All transactions voided."),I(0),c(""),window.dispatchEvent(new Event("disabledIdsUpdated"))},oe=()=>{if(console.log("Selected Row:",v),v!==null){const t=m.filter(o=>o.Delivery_ID!==v);d(t),localStorage.setItem("deliveryData",JSON.stringify(t)),i.success("Transaction voided"),O(null);const a=t.reduce((o,l)=>o+parseFloat(l.Amount||0),0).toFixed(2),n=Math.max(0,T-a).toFixed(2);I(T),c(n);const r=localStorage.getItem("disabledIds");if(r){const o=new Set(JSON.parse(r));o.delete(v),localStorage.setItem("disabledIds",JSON.stringify(Array.from(o))),window.dispatchEvent(new Event("disabledIdsUpdated"))}}else i.error("No transaction selected")},L=()=>{G(!0),window.removeEventListener("click",L)};s.useEffect(()=>{window.addEventListener("click",L);const t=()=>{f.get("/get-pump-status").then(r=>{const o=r.data;N(o);const l=o.some(D=>D.Data.NozzleUp);E&&(l&&!C?(u.current&&(u.current.loop=!0,u.current.play().catch(D=>{console.error("Error playing sound:",D)})),_(!0)):!l&&C&&(u.current&&(u.current.pause(),u.current.currentTime=0),_(!1)))}).catch(r=>{console.error("Error fetching pump status:",r)})},a=()=>{f.get("/get-mop").then(r=>{j(r.data.data);const o=data.some(l=>l.MOP_Ref==="3");g(o)}).catch(r=>{console.error("Error fetching MOP list:",r)})};t(),a();const n=setInterval(t,500);return()=>clearInterval(n)},[C,E]);const ne=t=>{c(a=>a+t),I(a=>a+t)},le=async()=>{try{const t=await f.post("/stop-all-pumps");i.success("All pumps stopped successfully"),console.log("All pumps stopped:",t.data)}catch(t){i.error("Error stopping all pumps"),console.error("Error stopping all pumps:",t)}},H=async t=>{if(!t){i.error("Transaction ID is undefined");return}try{const n=(await f.get(`/print-receipt/${t}`)).data}catch(a){i.error("Error fetching receipt data"),console.error("Error fetching receipt data:",a)}},ie={handleLogout:Q,handleVoid:oe,handleVoidAll:re,setInputValue:c,handleClear:ae,handleSubTotal:se,handlePrintReceipt:H,handleStopAllPumps:le,handleOpenCustomerDetails:Z},ce=async t=>{console.log("MOP selected:",t);const a=parseFloat(p.replace("₱","").replace(",",""));if(p===""||a<=0){i.error("Please enter an amount before selecting a method of payment.");return}const n=JSON.parse(localStorage.getItem("transaction"))||{subtotal:parseFloat(h),payments:[],remainingBalance:parseFloat(h)},r=n.remainingBalance-a;if(r>=0)n.payments.push({mopName:t.MOP_Name,amount:a}),n.remainingBalance=r,localStorage.setItem("transaction",JSON.stringify(n)),r===0?await V():c(`Amount Due: ₱${r.toFixed(2)}`);else{const o=Math.abs(r).toFixed(2);i.success(`Payment exceeds the remaining balance. Change: ₱${o}`),n.payments.push({mopName:t.MOP_Name,amount:a}),n.remainingBalance=0,localStorage.setItem("transaction",JSON.stringify(n)),c(`Change: ₱${o}`),await V()}t.MOP_Ref==="3"?g(!0):g(!1)},h=m.reduce((t,a)=>t+parseFloat(a.Amount||0),0).toFixed(2),V=async()=>{const t=JSON.parse(localStorage.getItem("transaction"));if(!t){i.error("No transaction data found");return}const a=t.payments.reduce((r,o)=>r+o.amount,0),n=Math.max(0,a-t.subtotal).toFixed(2);try{const o=(await f.post("/store-transactions",{subtotal:t.subtotal,taxTotal:t.subtotal/1.12*.12,change:parseFloat(n),mopNames:t.payments.map(l=>l.mopName.trim()),mopPayments:t.payments,deliveryIds:m.map(l=>({Delivery_ID:l.Delivery_ID,Pump:l.Pump,Nozzle:l.Nozzle,Volume:l.Volume,Price:l.Price,Amount:l.Amount,FuelGradeName:l.FuelGradeName})),payment:a,customer:{name:F,address:R,tin:X,businessStyle:z}})).data.transaction;o?(localStorage.setItem("transactionId",o),i.success("Transaction saved successfully"),Y(!0),W(0),c("Transaction Complete"),localStorage.removeItem("transaction"),H(o)):i.error("Error retrieving transaction ID")}catch(r){i.error("Error saving transaction"),console.error("Error saving transaction:",r)}};return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:"Home"}),e.jsx("audio",{ref:u,src:"assets/audio/nozzle-status-sound.wav"}),e.jsx("div",{className:"min-h-screen dark:bg-gray-900 p-3",children:e.jsx("main",{className:"w-full h-full mx-auto",children:e.jsxs("div",{className:"grid gap-6 lg:grid-cols-2 lg:gap-4",children:[e.jsxs(b,{className:"dark:bg-gray-800 flex flex-col h-full p-3",children:[e.jsx("div",{children:e.jsxs(b,{className:"max-w-full",children:[e.jsx(Ce,{className:"justify-between",children:e.jsx(ye,{})}),e.jsx(Ie,{className:"justify-between",children:e.jsxs("div",{className:"flex gap-4",children:[e.jsx("div",{className:"w-[70%] bg-slate-200 rounded-lg shadow-sm relative",children:e.jsx(pe,{position:"top-right"})}),e.jsx(Ne,{}),e.jsx(je,{})]})})]})}),e.jsx(De,{y:3}),e.jsx("div",{className:"flex-grow",children:e.jsx(ge,{deliveryData:m,setSelectedRow:O,subtotal:h,inputValue:p,change:q})}),e.jsxs(b,{className:"w-full gap-2 p-2",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx(x,{variant:"bordered",label:e.jsx("p",{className:"font-bold text-xl",children:"SUBTOTAL"}),size:"lg",value:`₱${h}`,labelPlacement:"outside-left",className:"w-[40%]",classNames:{input:["text-black text-xl font-bold text-right"]},isReadOnly:!0}),e.jsx(x,{variant:"bordered",className:"w-[60%]",classNames:{input:["text-black text-2xl font-bold text-right"]},value:p,isReadOnly:!0,size:"lg"})]}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-1",children:e.jsx(xe,{handleButtonClick:ne,buttons:Se,buttonClickHandlers:ie,setInputValue:c})})]})]}),e.jsx(b,{className:"dark:bg-gray-800  flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10",children:e.jsx("div",{className:"flex w-full flex-col",children:e.jsxs(fe,{"aria-label":"Options",fullWidth:!0,children:[e.jsx(P,{title:"PUMPS",children:S.length===0?e.jsxs("div",{className:"flex flex-col items-center mt-6",children:[e.jsx(ue,{className:"w-12 h-12 text-danger"}),e.jsx("span",{className:"mt-4",children:"No pumps found"})]}):e.jsx("div",{className:"overflow-y-auto max-h-[calc(100vh-200px)] p-2",children:e.jsx("div",{className:"grid grid-cols-4 gap-2",children:S.map(t=>e.jsx(ve,{pump:t,handleAppendDeliveryData:te},t.Id))})})},"pumps"),e.jsx(P,{title:"MOP",children:e.jsx(he,{mopList:y,onSelectMOP:ce})},"mop"),e.jsx(P,{title:"Config",children:e.jsx(we,{})},"config")]})})})]})})}),e.jsx(be,{isOpen:K,onClose:U,onCustomerDataChange:(t,a)=>{switch(t){case"name":M(a);break;case"address":B(a);break;case"tin":k(a);break;case"businessStyle":J(a);break}},customerName:F,customerAddress:R,customerTIN:X,customerBusinessStyle:z,onSave:ee,setCustomerName:M,setCustomerAddress:B,setCustomerTIN:k,setCustomerBusinessStyle:J}),e.jsx(Ae,{isOpen:w,onOpenChange:g})]})}const Ae=({isOpen:p,onOpenChange:c})=>{const[S,N]=s.useState(""),[y,j]=s.useState(""),[w,g]=s.useState("");return e.jsx(Pe,{size:"lg",isOpen:p,onOpenChange:c,children:e.jsx(Oe,{children:m=>e.jsxs(e.Fragment,{children:[e.jsx(_e,{className:"flex flex-col gap-1",children:"DEBIT/CREDIT CARD INFORMATION"}),e.jsxs(Ee,{children:[e.jsx(x,{autoFocus:!0,label:"Card #",placeholder:"XXX-XXX-XXX-XXX-XXX",variant:"bordered",value:S,onChange:d=>N(d.target.value)}),e.jsx(x,{label:"Approval Code",placeholder:"1234",type:"password",variant:"bordered",value:y,onChange:d=>j(d.target.value)}),e.jsx(x,{label:"Card Holder Name",placeholder:"John Doe",variant:"bordered",value:w,onChange:d=>g(d.target.value)})]}),e.jsxs(Te,{children:[e.jsx($,{className:"w-full",color:"success",children:"Save"}),e.jsx($,{className:"w-full",color:"danger",onPress:m,children:"Close"})]})]})})})};export{Ae as CardDetails,Bt as default};