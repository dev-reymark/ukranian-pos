import{r as s,j as t,Y as Se,a as p}from"./app-CU-WO1ha.js";import{S as ye}from"./sweetalert2.all-C7lRlOJf.js";import{F as Ne}from"./PumpDelivery-X4cQwOrO.js";import{I as ve,_ as i}from"./index-CRnhcW6K.js";import be from"./MOPCard-CgfxLRgi.js";import we,{buttons as je}from"./POSKeyboard-Dq6EM5Tn.js";import{PumpCard as Pe}from"./PumpCard-6TUqlF3R.js";import{CustomerDetails as Ie}from"./CustomerDetails-CdSLVyKf.js";import{PrinterStatus as Ce}from"./PrinterStatus-CjgYBhcY.js";import{GetCashier as De}from"./GetCashier-D_2VvrL8.js";import{GetDateTime as Oe}from"./GetDateTime-wq3HQDNm.js";import{ThemeSwitcher as _e}from"./ThemeSwitcher-DA_7s0vq.js";import Me from"./Index-yPn9wmME.js";import{CardDetails as Ee}from"./CardDetails-k-0tQPgC.js";import{S as Te,t as Fe,a as I}from"./SaleWindowTabs-C-bGdET4.js";import{c as y}from"./chunk-H4VOEXHF-BWJCRE_t.js";import{c as Ae}from"./chunk-J333S7JQ-CxZvlNFF.js";import{c as Re}from"./chunk-5ALFRFZW-BeY_uHae.js";import{s as Be}from"./chunk-IXXDDLGU-DPLgLgt2.js";import{i as W}from"./chunk-GQQM5TNQ-D0eR7hlP.js";import"./iconBase-ChouL2UD.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-B6GiQUqI.js";import"./chunk-YRZGWF2W-BfrLYRe5.js";import"./chunk-RQNQ5XFG-B4M0tKT3.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-XHQUSKIE-DXaFXxBl.js";import"./useFocusable-CwbNjnte.js";import"./FocusScope-5gH3nO3Z.js";import"./useToggleState-BRXcg629.js";import"./useFormReset-kB5BFIA6.js";import"./useControlledState-CYT4S43w.js";import"./index-BldL4JtZ.js";import"./index-BIQJOCN_.js";import"./useHover-0cX7ZD-_.js";import"./chunk-CAFRINWI-CcU5yOMx.js";import"./useFormValidationState-hFBE8GQT.js";import"./VisuallyHidden-PwrLX68e.js";import"./chunk-DBLREEYE-CM8jspvc.js";import"./index-B0H9SEvE.js";import"./chunk-6NL67ZRH-BGQLi1Av.js";import"./chunk-NK4BRF7C-Be8Zb8l7.js";import"./index-047NrGZK.js";import"./chunk-JHUBASYZ-D3WeJlyp.js";import"./Icon-BSx81m0u.js";import"./PumpStatus-5SYFXcQO.js";import"./chunk-4WFLSIHH-z6G9cx4w.js";import"./chunk-M3MASYO7-6BdpfVw9.js";import"./chunk-P2T5LMDM-BQTIUMsB.js";import"./useLabels-BY_Pl7HM.js";import"./chunk-QY5NICTW-C2ClPSnE.js";import"./ElectricJournal-CAG0lnai.js";import"./index-X92CTFGl.js";import"./useField-CKlBpT84.js";import"./chunk-44JHHBS2-CaabWiaQ.js";import"./AboutSoftware-DwsouuBl.js";import"./ApplicationLogo-8mePolSm.js";import"./index-DybeFXgA.js";function Vt(){const[N,c]=s.useState(""),[C,K]=s.useState([]),[q,Q]=s.useState([]),[X,d]=s.useState(!1),[u,v]=s.useState(()=>{const e=localStorage.getItem("deliveryData");return e?JSON.parse(e):[]}),[g,D]=s.useState(null),[b,O]=s.useState(!1),[_,Z]=s.useState(!1),m=s.useRef(null),[M,ke]=s.useState([]),[E,w]=s.useState(0),[ee,te]=s.useState(!1),[ze,ae]=s.useState(0),[se,T]=s.useState(!1),[F,A]=s.useState(""),[R,B]=s.useState(""),[k,z]=s.useState(""),[J,U]=s.useState(""),[h,L]=s.useState(""),[x,$]=s.useState(""),[S,V]=s.useState(""),re=async()=>{if((await ye.fire({title:"Are you sure?",text:"You are about to log out and you won't be able to recover this session!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, log out!"})).isConfirmed)try{await p.post("/logout"),window.location.href="/"}catch(a){console.error("Error logging out:",a)}},oe=()=>{T(!0)},G=()=>{T(!1)},ne=()=>{G()},le=e=>{v(a=>{const n=[...a,e];return localStorage.setItem("deliveryData",JSON.stringify(n)),n})},ie=()=>{c("")},ce=()=>{c(`Subtotal: ₱${f}`)},me=()=>{if(u.length===0){i.error("No transactions to void");return}v([]),localStorage.removeItem("transaction"),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),i.success("All transactions voided."),w(0),c(""),window.dispatchEvent(new Event("disabledIdsUpdated"))},de=()=>{if(console.log("Selected Row:",g),g!==null){const e=u.filter(o=>o.Delivery_ID!==g);v(e),localStorage.setItem("deliveryData",JSON.stringify(e)),i.success("Transaction voided"),D(null);const a=e.reduce((o,l)=>o+parseFloat(l.Amount||0),0).toFixed(2),n=Math.max(0,E-a).toFixed(2);w(E),c(n);const r=localStorage.getItem("disabledIds");if(r){const o=new Set(JSON.parse(r));o.delete(g),localStorage.setItem("disabledIds",JSON.stringify(Array.from(o))),window.dispatchEvent(new Event("disabledIdsUpdated"))}}else i.error("No transaction selected")},H=()=>{Z(!0),window.removeEventListener("click",H)};s.useEffect(()=>{window.addEventListener("click",H);const e=()=>{p.get("/get-pump-status").then(r=>{const o=r.data;K(o);const l=o.some(P=>P.Data.NozzleUp);_&&(l&&!b?(m.current&&(m.current.loop=!0,m.current.play().catch(P=>{console.error("Error playing sound:",P)})),O(!0)):!l&&b&&(m.current&&(m.current.pause(),m.current.currentTime=0),O(!1)))}).catch(r=>{console.error("Error fetching pump status:",r)})},a=()=>{p.get("/get-mop").then(r=>{Q(r.data.data);const o=data.some(l=>l.MOP_Ref==="3");d(o)}).catch(r=>{console.error("Error fetching MOP list:",r)})};e(),a();const n=setInterval(e,500);return()=>clearInterval(n)},[b,_]);const pe=e=>{c(a=>a+e),w(a=>a+e)},ue=async()=>{try{const e=await p.post("/stop-all-pumps");i.success("All pumps stopped successfully"),console.log("All pumps stopped:",e.data)}catch(e){i.error("Error stopping all pumps"),console.error("Error stopping all pumps:",e)}},Y=async e=>{if(!e){i.error("Transaction ID is undefined");return}try{const n=(await p.get(`/print-receipt/${e}`)).data}catch(a){i.error("Error fetching receipt data"),console.error("Error fetching receipt data:",a)}},fe={handleLogout:re,handleVoid:de,handleVoidAll:me,setInputValue:c,handleClear:ie,handleSubTotal:ce,handlePrintReceipt:Y,handleStopAllPumps:ue,handleOpenCustomerDetails:oe},ge=async e=>{console.log("MOP selected:",e);const a=parseFloat(N.replace("₱","").replace(",",""));if(N===""||a<=0){i.error("Please enter an amount before selecting a method of payment.");return}const n=JSON.parse(localStorage.getItem("transaction"))||{subtotal:parseFloat(f),payments:[],remainingBalance:parseFloat(f)},r=n.remainingBalance-a;if(r>=0)n.payments.push({mopName:e.MOP_Name,amount:a}),n.remainingBalance=r,localStorage.setItem("transaction",JSON.stringify(n)),e.MOP_Ref==="3"?d(!0):r===0?await j():c(`Amount Due: ₱${r.toFixed(2)}`);else{const o=Math.abs(r).toFixed(2);i.success(`Payment exceeds the remaining balance. Change: ₱${o}`),n.payments.push({mopName:e.MOP_Name,amount:a}),n.remainingBalance=0,localStorage.setItem("transaction",JSON.stringify(n)),c(`Change: ₱${o}`),c(`Change: ₱${o}`),e.MOP_Ref==="3"?d(!0):await j()}},f=u.reduce((e,a)=>e+parseFloat(a.Amount||0),0).toFixed(2),[he,xe]=s.useState({change:0,mopNames:[],mopPayments:[]}),j=async()=>{const e=JSON.parse(localStorage.getItem("transaction"));if(!e){i.error("No transaction data found");return}if(M&&M.MOP_Ref==="3"&&(!h||!x||!S)){i.error("Please provide complete card details."),d(!0);return}const a=e.payments.reduce((r,o)=>r+o.amount,0),n=Math.max(0,a-e.subtotal).toFixed(2);try{const o=(await p.post("/store-transactions",{subtotal:e.subtotal,taxTotal:e.subtotal/1.12*.12,change:parseFloat(n),mopNames:e.payments.map(l=>l.mopName.trim()),mopPayments:e.payments,deliveryIds:u.map(l=>({Delivery_ID:l.Delivery_ID,Pump:l.Pump,Nozzle:l.Nozzle,Volume:l.Volume,Price:l.Price,Amount:l.Amount,FuelGradeName:l.FuelGradeName})),customer:{name:F,address:R,tin:k,businessStyle:J},cardDetails:{name:S,code:x,number:h}})).data.transaction;o?(localStorage.setItem("transactionId",o),i.success("Transaction saved successfully"),te(!0),ae(0),c("Transaction Complete"),xe({change:parseFloat(n),mopNames:e.payments.map(l=>l.mopName),mopPayments:e.payments}),localStorage.removeItem("transaction"),L(""),$(""),V(""),Y(o)):i.error("Error retrieving transaction ID")}catch(r){i.error("Error saving transaction"),console.error("Error saving transaction:",r)}};return t.jsxs(t.Fragment,{children:[t.jsx(Se,{title:"Home"}),t.jsx("audio",{ref:m,src:"assets/audio/nozzle-status-sound.wav"}),t.jsx("div",{className:"min-h-screen dark:bg-gray-900 p-3",children:t.jsx("main",{className:"w-full h-full mx-auto",children:t.jsxs("div",{className:"grid gap-6 lg:grid-cols-2 lg:gap-4",children:[t.jsxs(y,{className:"dark:bg-gray-800 flex flex-col h-full p-3",children:[t.jsx("div",{children:t.jsxs(y,{className:"max-w-full",children:[t.jsxs(Ae,{className:"justify-between",children:[t.jsx(De,{}),t.jsx(Oe,{})]}),t.jsx(Re,{className:"justify-between",children:t.jsxs("div",{className:"flex gap-4",children:[t.jsx("div",{className:"w-[70%] bg-slate-200 rounded-lg shadow-sm relative",children:t.jsx(ve,{position:"top-right"})}),t.jsx(Ce,{}),t.jsx(_e,{})]})})]})}),t.jsx(Be,{y:3}),t.jsx("div",{className:"flex-grow",children:t.jsx(Te,{deliveryData:u,setSelectedRow:D,subtotal:f,transactionSaved:ee,transactionSummary:he})}),t.jsxs(y,{className:"w-full gap-2 p-2",children:[t.jsxs("div",{className:"flex gap-2",children:[t.jsx(W,{variant:"bordered",label:t.jsx("p",{className:"font-bold text-xl",children:"SUBTOTAL"}),size:"lg",value:`₱${f}`,labelPlacement:"outside-left",className:"w-[40%]",classNames:{input:["text-black text-xl font-bold text-right"]},isReadOnly:!0}),t.jsx(W,{variant:"bordered",className:"w-[60%]",classNames:{input:["text-black text-2xl font-bold text-right"]},value:N,isReadOnly:!0,size:"lg"})]}),t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-1",children:t.jsx(we,{handleButtonClick:pe,buttons:je,buttonClickHandlers:fe,setInputValue:c})})]})]}),t.jsx(y,{className:"dark:bg-gray-800  flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10",children:t.jsx("div",{className:"flex w-full flex-col",children:t.jsxs(Fe,{"aria-label":"Options",fullWidth:!0,children:[t.jsx(I,{title:"PUMPS",children:C.length===0?t.jsxs("div",{className:"flex flex-col items-center mt-6",children:[t.jsx(Ne,{className:"w-12 h-12 text-danger"}),t.jsx("span",{className:"mt-4",children:"No pumps found"})]}):t.jsx("div",{className:"overflow-y-auto max-h-[calc(100vh-200px)] p-2",children:t.jsx("div",{className:"grid grid-cols-4 gap-2",children:C.map(e=>t.jsx(Pe,{pump:e,handleAppendDeliveryData:le},e.Id))})})},"pumps"),t.jsx(I,{title:"MOP",children:t.jsx(be,{mopList:q,onSelectMOP:ge})},"mop"),t.jsx(I,{title:"Config",children:t.jsx(Me,{})},"config")]})})})]})})}),t.jsx(Ie,{isOpen:se,onClose:G,onCustomerDataChange:(e,a)=>{switch(e){case"name":A(a);break;case"address":B(a);break;case"tin":z(a);break;case"businessStyle":U(a);break}},customerName:F,customerAddress:R,customerTIN:k,customerBusinessStyle:J,onSave:ne,setCustomerName:A,setCustomerAddress:B,setCustomerTIN:z,setCustomerBusinessStyle:U}),t.jsx(Ee,{isOpen:X,onOpenChange:d,cardNumber:h,setCardNumber:L,approvalCode:x,setApprovalCode:$,cardHolderName:S,setCardHolderName:V,onSave:async()=>{if(!h||!x||!S){i.error("Please fill in all card details.");return}d(!1),await j()}})]})}export{Vt as default};