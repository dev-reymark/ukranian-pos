import{r as l,j as a,Y as be,a as u}from"./app-C7tOZ9mb.js";import{S as we}from"./sweetalert2.all-CLN92Vw4.js";import{Q as je,X as Pe,G as Oe,B as r}from"./index-27VEgFZg.js";import De from"./MOPCard-CP-W233_.js";import Ce,{buttons as Ie}from"./POSKeyboard-C91ffrK6.js";import{PumpCard as Ae}from"./PumpCard-scsB4Bal.js";import{CustomerDetails as _e}from"./CustomerDetails-FkzJV07V.js";import{PrinterStatus as Te}from"./PrinterStatus-N41wPtE0.js";import{GetCashier as Fe}from"./GetCashier-CZkp3rFz.js";import{GetDateTime as Ee}from"./GetDateTime-BqX6iX_V.js";import{ThemeSwitcher as Me}from"./ThemeSwitcher-B1K7iwOt.js";import Re from"./Index-DaW2o-ml.js";import{CardDetails as ke}from"./CardDetails-B5tD-QDR.js";import ze from"./SaleWindowTabs-D97669ej.js";import Be from"./ReportsIndex-DfjbZ4u3.js";import{c as v}from"./chunk-H4VOEXHF-DsCNIOMn.js";import{c as Ve}from"./chunk-J333S7JQ-D84yUmgV.js";import{c as Je}from"./chunk-5ALFRFZW-cshJDlcv.js";import{s as Le}from"./chunk-IXXDDLGU-DQyhayGs.js";import{i as X}from"./chunk-GQQM5TNQ-CP88fx72.js";import{t as Ge,a as N}from"./chunk-FXLYF44B-CjfuvLIp.js";import"./iconBase-DhBb1r-v.js";import"./index-ZaNz1KS8.js";import"./chunk-N2KXC5ZE-D_CJACt4.js";import"./chunk-XHQUSKIE-DH6WFa3x.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./useFocusable-BwCCJFar.js";import"./SelectionManager-BZLHT_u-.js";import"./FocusScope-BYVYjJmQ.js";import"./scrollIntoView-DvDgV4U_.js";import"./useControlledState-Cpz1NFEK.js";import"./chunk-44JHHBS2-CNILBaGe.js";import"./useLabel-DyLhekMM.js";import"./useLabels-RMseU24M.js";import"./useCollator-CbQycZuf.js";import"./useListState-DOzEYPYb.js";import"./chunk-RQNQ5XFG-EKoFrFia.js";import"./index-zZ1N3Ar2.js";import"./index-B43NX_O7.js";import"./index-cynRN4w3.js";import"./chunk-P2T5LMDM-TL1Zznnc.js";import"./getScrollParent-CdIc2hyL.js";import"./VisuallyHidden-DbICzycp.js";import"./chunk-6NL67ZRH-BrjaCyLg.js";import"./chunk-DBLREEYE-DuqTpBYd.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./PumpDelivery-Rm4kVc6Y.js";import"./chunk-YRZGWF2W-DrQDyyYd.js";import"./useToggleState-DEYoigRv.js";import"./useFormReset-DJWxeQmG.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-LykJjBsk.js";import"./LiveAnnouncer-Cf5l3hCh.js";import"./useHasTabbableChild-BtGCddz_.js";import"./Icon-DvTB1VgC.js";import"./PumpStatus-5SYFXcQO.js";import"./chunk-4WFLSIHH-Dt3WACuW.js";import"./index-BxRxcv5E.js";import"./chunk-M3MASYO7-olErIOym.js";import"./chunk-JHUBASYZ-D67Yp5pA.js";import"./ElectricJournal-CAQs53gB.js";import"./index-tNT0p-5g.js";import"./index-X92CTFGl.js";import"./AboutSoftware-lIGGjpD9.js";import"./ApplicationLogo-RCe_AFiD.js";import"./chunk-NK4BRF7C-BlXi8Zly.js";import"./PriceChange-DAwZjMyF.js";function la(){const[q,Ue]=l.useState([]),[b,c]=l.useState(""),[D,Z]=l.useState([]),[ee,te]=l.useState([]),[ae,f]=l.useState(!1),[m,h]=l.useState(()=>{const e=localStorage.getItem("deliveryData");return e?JSON.parse(e):[]}),[d,C]=l.useState(null),[w,I]=l.useState(!1),[A,oe]=l.useState(!1),p=l.useRef(null),[_,$e]=l.useState([]),[T,j]=l.useState(0),[se,F]=l.useState(!1),[He,re]=l.useState(0),[ne,E]=l.useState(!1),[M,R]=l.useState(""),[k,z]=l.useState(""),[B,V]=l.useState(""),[J,L]=l.useState(""),[x,G]=l.useState(""),[y,U]=l.useState(""),[S,$]=l.useState(""),le=async()=>{if((await we.fire({title:"Are you sure?",text:"You are about to log out and you won't be able to recover this session!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, log out!"})).isConfirmed)try{await u.post("/logout"),window.location.href="/"}catch(t){console.error("Error logging out:",t)}},ie=()=>{E(!0)},H=()=>{E(!1)},ce=()=>{H()},me=e=>{h(t=>{const i=[...t,e];return localStorage.setItem("deliveryData",JSON.stringify(i)),i})},de=()=>{c("")},Y=(e,t)=>{t==="success"?r.success(e):t==="error"&&r.error(e)},ue=()=>{c(`Subtotal: ₱${g}`)},pe=()=>{if(m.length===0){r.error("No items to void");return}h([]),setTimeout(()=>{console.log("DeliveryData after reset:",m)},0),localStorage.removeItem("transaction"),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),r.success("All items voided"),F(!1),Q({mopPayments:[],change:0}),j(0),c(""),window.dispatchEvent(new Event("disabledIdsUpdated"))},fe=()=>{if(console.log("Selected Row:",d),d!==null){const e=m.filter(s=>s.Delivery_ID!==d);h(e),localStorage.setItem("deliveryData",JSON.stringify(e)),r.success("Item voided"),C(null);const t=e.reduce((s,n)=>s+parseFloat(n.Amount||0),0).toFixed(2),i=Math.max(0,T-t).toFixed(2);j(T),c(i);const o=localStorage.getItem("disabledIds");if(o){const s=new Set(JSON.parse(o));s.delete(d),localStorage.setItem("disabledIds",JSON.stringify(Array.from(s))),window.dispatchEvent(new Event("disabledIdsUpdated"))}}else r.error("No item to void")},W=()=>{oe(!0),window.removeEventListener("click",W)};l.useEffect(()=>{window.addEventListener("click",W);const e=()=>{u.get("/get-pump-status").then(o=>{const s=o.data;Z(s);const n=s.some(O=>O.Data.NozzleUp);A&&(n&&!w?(p.current&&(p.current.loop=!0,p.current.play().catch(O=>{console.error("Error playing sound:",O)})),I(!0)):!n&&w&&(p.current&&(p.current.pause(),p.current.currentTime=0),I(!1)))}).catch(o=>{console.error("Error fetching pump status:",o)})},t=()=>{u.get("/get-mop").then(o=>{te(o.data.data);const s=q.some(n=>n.MOP_Ref==="3");f(s)}).catch(o=>{console.error("Error fetching MOP list:",o)})};e(),t();const i=setInterval(e,500);return()=>clearInterval(i)},[w,A]);const ge=e=>{c(t=>t+e),j(t=>t+e)},he=async()=>{try{const e=await u.post("/stop-all-pumps");r.success("All pumps stopped"),console.log("All pumps stopped:",e.data)}catch(e){r.error("Error stopping all pumps"),console.error("Error stopping all pumps:",e)}},xe=async()=>{try{const e={Type:"FullTank"},t=await u.post("/authorize-all-pumps",e);r.success("All pumps authorized"),console.log("All pumps authorized:",t.data)}catch(e){r.error("Error authorizing all pumps"),console.error("Error authorizing all pumps:",e)}},K=async e=>{if(!e){r.error("Transaction ID is undefined");return}try{const i=(await u.get(`/print-receipt/${e}`)).data}catch(t){r.error("Error fetching receipt data"),console.error("Error fetching receipt data:",t)}},ye={handleLogout:le,handleVoid:fe,handleVoidAll:pe,setInputValue:c,handleClear:de,handleSubTotal:ue,handlePrintReceipt:K,handleStopAllPumps:he,handleAuthorizeAllPumps:xe,handleOpenCustomerDetails:ie,handleOpenDrawer:async()=>{try{const e=await u.get("/open-cash-drawer");r.success("Drawer opened"),console.log("Drawer opened:",e.data)}catch(e){r.error("Error opening drawer"),console.error("Error opening drawer:",e.response?e.response.data:e.message)}}},Se=async e=>{console.log("MOP selected:",e);const t=parseFloat(b.replace("₱","").replace(",",""));if(b===""||t<=0){r.error("Please enter an amount before selecting a method of payment.");return}const i=JSON.parse(localStorage.getItem("transaction"))||{subtotal:parseFloat(g),payments:[],remainingBalance:parseFloat(g)},o=i.remainingBalance-t;if(o>=0)i.payments.push({mopName:e.MOP_Name,amount:t}),i.remainingBalance=o,localStorage.setItem("transaction",JSON.stringify(i)),e.MOP_Ref==="3"?f(!0):o===0?await P():c(`Amount Due: ₱${o.toFixed(2)}`);else{const s=Math.abs(o).toFixed(2);r.success(`Change: ₱${s}`),i.payments.push({mopName:e.MOP_Name,amount:t}),i.remainingBalance=0,localStorage.setItem("transaction",JSON.stringify(i)),c(`Change: ₱${s}`),c(`Change: ₱${s}`),e.MOP_Ref==="3"?f(!0):await P()}},g=m.reduce((e,t)=>e+parseFloat(t.Amount||0),0).toFixed(2),[ve,Q]=l.useState({change:0,mopNames:[],mopPayments:[],deliveryData:[]}),Ne=(e,t)=>{if(d==null){r.error("Please select an item to apply discount");return}if(e.discount_id>=1&&e.discount_id<=4){r.info("Discount not applicable");return}console.log("Selected Row:",d),console.log("Selected Discount:",e),console.log("Selected Preset:",t);const i=m.map(o=>{if(o.Delivery_ID===d){if(o.DiscountedAmount)return r.info("Discount already applied to this item."),o;let s=0;switch(console.log("Selected Discount Type:",e==null?void 0:e.discount_type),console.log("Preset Value:",t==null?void 0:t.preset_value),e==null?void 0:e.discount_type){case"1":s=parseFloat(o.Amount)*parseFloat(t==null?void 0:t.preset_value)/100;break;case"2":s=parseFloat(o.Volume)*parseFloat(t==null?void 0:t.preset_value);break;case"3":s=parseFloat(t==null?void 0:t.preset_value);break}console.log("Calculated Discount Amount:",s);const n=parseFloat(o.Amount)-s;return{...o,OriginalAmount:o.Amount,Amount:n.toFixed(2),DiscountedAmount:s.toFixed(2),PresetName:t==null?void 0:t.preset_name,DiscountType:e==null?void 0:e.discount_type,PresetValue:t==null?void 0:t.preset_value}}return o});h(i),r.success("Discount applied.")},P=async()=>{const e=JSON.parse(localStorage.getItem("transaction"));if(!e){r.error("No transaction found");return}if(_&&_.MOP_Ref==="3"&&(!x||!y||!S)){r.error("Please provide complete card details."),f(!0);return}const t=e.payments.reduce((o,s)=>o+s.amount,0),i=Math.max(0,t-e.subtotal).toFixed(2);try{const s=(await u.post("/store-transactions",{subtotal:e.subtotal,taxTotal:e.subtotal/1.12*.12,change:parseFloat(i),mopNames:e.payments.map(n=>n.mopName.trim()),mopPayments:e.payments,deliveryIds:m.map(n=>({Delivery_ID:n.Delivery_ID,Pump:n.Pump,Nozzle:n.Nozzle,Volume:n.Volume,Price:n.Price,Amount:n.Amount,OriginalAmount:n.OriginalAmount,DiscountedAmount:n.DiscountedAmount,DiscountType:n.DiscountType,PresetName:n.PresetName,PresetValue:n.PresetValue,FuelGradeName:n.FuelGradeName})),customer:{name:M,address:k,tin:B,businessStyle:J},cardDetails:{name:S,code:y,number:x}})).data.transaction;s?(localStorage.setItem("transactionId",s),r.success("Transaction saved"),F(!0),re(0),c("Transaction Complete"),Q({change:parseFloat(i),mopNames:e.payments.map(n=>n.mopName),mopPayments:e.payments,deliveryData:m}),localStorage.removeItem("transaction"),G(""),U(""),$(""),K(s)):r.error("Error retrieving transaction ID")}catch(o){r.error("Error saving transaction"),console.error("Error saving transaction:",o)}};return a.jsxs(a.Fragment,{children:[a.jsx(be,{title:"Home"}),a.jsx("audio",{ref:p,src:"assets/audio/nozzle-status-sound.wav"}),a.jsxs("main",{className:"grid grid-cols-1 md:grid-cols-2 gap-2 p-2 h-[100vh]",children:[a.jsxs(v,{className:"dark:bg-gray-900 p-2",children:[a.jsx("div",{className:"flex-none",children:a.jsxs(v,{className:"max-w-full h-full",children:[a.jsxs(Ve,{className:"justify-between",children:[a.jsx(Fe,{}),a.jsx(Ee,{})]}),a.jsx(Je,{className:"justify-between",children:a.jsxs("div",{className:"flex gap-4",children:[a.jsx("div",{className:"w-[70%] h-[70px] bg-slate-200 rounded-lg shadow-sm relative",children:a.jsx(je,{position:"top-right",autoClose:2e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!1,theme:"light",transition:Pe,style:{position:"absolute",top:0,right:0,bottom:0,left:0,width:"100%",height:"50%"}})}),a.jsx(Te,{}),a.jsx(Me,{})]})})]})}),a.jsx(Le,{y:3}),a.jsx("div",{className:"flex-grow",children:a.jsx(ze,{deliveryData:m,setSelectedRow:C,subtotal:g,transactionSaved:se,transactionSummary:ve})}),a.jsx("div",{className:"flex-none",children:a.jsxs(v,{className:"w-full gap-2 p-2",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx(X,{variant:"bordered",label:a.jsx("p",{className:"font-bold text-xl",children:"SUBTOTAL"}),size:"lg",value:`₱${g}`,labelPlacement:"outside-left",className:"w-[40%]",classNames:{input:["text-black text-xl font-bold text-right"]},isReadOnly:!0}),a.jsx(X,{variant:"bordered",className:"w-[60%]",classNames:{input:["text-black text-2xl font-bold text-right"]},value:b,isReadOnly:!0,size:"lg"})]}),a.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-1",children:a.jsx(Ce,{handleButtonClick:ge,buttons:Ie,buttonClickHandlers:ye,setInputValue:c})})]})})]}),a.jsx(v,{className:"dark:bg-gray-900 p-2",children:a.jsx("div",{className:"flex w-full flex-col",children:a.jsxs(Ge,{"aria-label":"Pumps",fullWidth:!0,children:[a.jsx(N,{title:a.jsx("p",{className:"font-extrabold",children:"PUMPS"}),children:a.jsx(l.Suspense,{fallback:a.jsx("div",{children:"Loading..."}),children:D.length===0?a.jsxs("div",{className:"col-span-4 flex flex-col items-center justify-center py-12 text-xl font-extrabold text-center text-red-500",children:[a.jsx(Oe,{className:"text-7xl"}),a.jsx("p",{children:"No pumps connected!"})]}):a.jsx("div",{className:"overflow-y-auto scrollbar-hide max-h-screen p-1",children:a.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2",children:D.map(e=>a.jsx(Ae,{pump:e,handleAppendDeliveryData:me,onToast:Y},e.Id))})})})},"pumps"),a.jsx(N,{title:a.jsx("p",{className:"font-extrabold",children:"MOP"}),children:a.jsx(De,{mopList:ee,onSelectMOP:Se,onApplyDiscount:Ne})},"mop"),a.jsx(N,{title:a.jsx("p",{className:"font-extrabold",children:"REPORTS"}),children:a.jsx(Be,{})},"reports"),a.jsx(N,{title:a.jsx("p",{className:"font-extrabold",children:"CONFIG"}),children:a.jsx(Re,{onToast:Y})},"config")]})})})]}),a.jsx(_e,{isOpen:ne,onClose:H,onCustomerDataChange:(e,t)=>{switch(e){case"name":R(t);break;case"address":z(t);break;case"tin":V(t);break;case"businessStyle":L(t);break}},customerName:M,customerAddress:k,customerTIN:B,customerBusinessStyle:J,onSave:ce,setCustomerName:R,setCustomerAddress:z,setCustomerTIN:V,setCustomerBusinessStyle:L}),a.jsx(ke,{isOpen:ae,onOpenChange:f,cardNumber:x,setCardNumber:G,approvalCode:y,setApprovalCode:U,cardHolderName:S,setCardHolderName:$,onSave:async()=>{if(!x||!y||!S){r.error("Please fill in all card details.");return}f(!1),await P()}})]})}export{la as default};
