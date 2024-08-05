import{r as i,j as a,Y as X,a as p}from"./app-B4BG-zsf.js";import{F as ee}from"./PumpDelivery-DIyMvjHg.js";import{I as te,_ as s}from"./index-CTtetcYR.js";import{S as ae,t as re,a as T}from"./SaleWindowTabs-B0HiIsOn.js";import se from"./MOPCard-DjXVUPoE.js";import oe from"./POSKeyboard-C_7q9RfO.js";import ie from"./PumpCard-SjIomj3f.js";import{c as S}from"./chunk-H4VOEXHF-KXDKSMRY.js";import{i as A}from"./chunk-GQQM5TNQ-MgHbtYIT.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-N2KXC5ZE-BW_RAGKI.js";import"./chunk-YRZGWF2W-Ipl9dw3b.js";import"./useHover-BpzbR3dc.js";import"./chunk-XHQUSKIE-DypDiBrP.js";import"./index-D74cUTvv.js";import"./index-pdR8Wy-p.js";import"./useControlledState-8q6f39f1.js";import"./chunk-IXXDDLGU-YwwyhbHd.js";import"./chunk-DBLREEYE-BMCo4_kI.js";import"./index-Bz6CY5HX.js";import"./chunk-6NL67ZRH-C8eIUKNI.js";import"./useLabels-QLp2ZEbS.js";import"./Icon-DJHGUTBe.js";import"./PumpStatus-5SYFXcQO.js";import"./index-BCtTUkCw.js";import"./chunk-P2T5LMDM-D_p1vvn2.js";const le=[{label:"CLEAR",color:"primary",onClick:"handleClear"},{label:"VOID",color:"danger",onClick:"handleVoid"},{label:"VOID ALL",color:"primary",onClick:"handleVoidAll"},{label:"REFRESH",color:"primary",onClick:()=>window.location.reload()},{label:"OPEN DRAWER",color:"primary",className:"md:text-sm"},{label:"SUB-TOTAL",color:"primary"},{label:"PRINT RECEIPT",color:"primary",className:"md:text-sm",onClick:"handlePrintReceipt"},{label:"ZERO RATED",color:"primary"},{label:"PG DISC",color:"primary"},{label:"ENTER",color:"primary"},{label:"ALL STOP",color:"primary",onClick:"handleStopAllPumps"},{label:"ALL AUTH",color:"primary",onClick:"authorizeAllPumps"}];function ze(){const[v,n]=i.useState(""),[w,F]=i.useState([]),[L,O]=i.useState([]),[z,P]=i.useState([]),[d,h]=i.useState(()=>{const t=localStorage.getItem("deliveryData");return t?JSON.parse(t):[]}),[g,D]=i.useState(null),[y,N]=i.useState(!1),[_,C]=i.useState(!1),c=i.useRef(null),[I,j]=i.useState([]),[f,m]=i.useState(0),[ne,$]=i.useState(!1),[ce,k]=i.useState(0),M=t=>{h(e=>{const r=[...e,t];return localStorage.setItem("deliveryData",JSON.stringify(r)),r})},U=()=>{n(""),m(0)},H=()=>{if(d.length===0){s.error("No transactions to void");return}h([]),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),s.success("All transactions voided successfully"),m(0),window.dispatchEvent(new Event("disabledIdsUpdated"))},V=()=>{if(console.log("Selected Row:",g),g!==null){const t=d.filter(l=>l.Delivery_ID!==g);h(t),localStorage.setItem("deliveryData",JSON.stringify(t)),s.success("Transaction voided successfully"),D(null);const e=t.reduce((l,x)=>l+parseFloat(x.Amount||0),0).toFixed(2),r=Math.max(0,f-e).toFixed(2);m(f),n(r);const o=localStorage.getItem("disabledIds");if(o){const l=new Set(JSON.parse(o));l.delete(g),localStorage.setItem("disabledIds",JSON.stringify(Array.from(l))),window.dispatchEvent(new Event("disabledIdsUpdated"))}}else s.error("No transaction selected")},R=()=>{C(!0),window.removeEventListener("click",R)};i.useEffect(()=>{window.addEventListener("click",R);const t=()=>{p.get("/get-pump-status").then(o=>{const l=o.data;F(l);const x=l.some(b=>b.Data.NozzleUp);_&&(x&&!y?(c.current&&(c.current.loop=!0,c.current.play().catch(b=>{console.error("Error playing sound:",b)})),N(!0)):!x&&y&&(c.current&&(c.current.pause(),c.current.currentTime=0),N(!1)))}).catch(o=>{console.error("Error fetching pump status:",o)})},e=()=>{p.get("/get-mop").then(o=>{O(o.data.data)}).catch(o=>{console.error("Error fetching MOP list:",o)})};t(),e();const r=setInterval(t,500);return()=>clearInterval(r)},[y,_]);const B=t=>{n(e=>e+t),m(e=>e+t)},J=async t=>{try{const e=await p.post("/authorize-pump",t);return s.success("Pump authorized successfully"),console.log("Authorization successful:",e.data),!0}catch(e){return s.error("Error authorizing pump"),console.error("Error authorizing pump:",e),!1}},W=async t=>{const e={Pump:t.Id,Nozzle:t.Data.NozzleUp,Type:"FullTank",Dose:t.Data.Dose,Price:t.Data.Price};await J(e)&&P(o=>({...o,[t.Id]:!0}))},G=t=>{p.post("/stop-pump",{Pump:t}).then(e=>{s.success("Pump stopped successfully"),console.log("Pump stopped successfully:",e.data),P(r=>({...r,[t]:!1}))}).catch(e=>{s.error("Error stopping pump"),console.error("Error stopping pump:",e)})},K=async t=>{try{return(await p.get(`/receipt/${t}`)).data}catch(e){return s.error("Error fetching receipt data"),console.error("Error fetching receipt data:",e),null}},E=async t=>{if(!t){s.error("Transaction ID is undefined");return}const e=await K(t);if(e){const r=window.open("","_blank");if(r){const o=`
                <html>
                <head>
                    <title>Receipt</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 20px;
                        }
                        h1, h2, h3, h4, h5, h6 {
                            margin: 0;
                            padding: 0;
                        }
                        .receipt-header, .receipt-footer {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .receipt-details, .receipt-items {
                            margin-bottom: 20px;
                        }
                        .receipt-items table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        .receipt-items th, .receipt-items td {
                            border: 1px solid #ddd;
                            padding: 8px;
                        }
                        .receipt-items th {
                            background-color: #f2f2f2;
                            text-align: left;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-header">
                        <h1>${e.receipt.Receipt_Header_L1}</h1>
                        <p>${e.receipt.Receipt_Header_L2}</p>
                        <p>${e.receipt.Receipt_Header_L3}</p>
                        <p>${e.receipt.Receipt_Header_L4}</p>
                        <p>${e.receipt.Receipt_Header_L5}</p>
                    </div>
                    <div class="receipt-details">
                        <p><strong>Transaction Date:</strong> ${new Date(e.transaction.Transaction_Date).toLocaleString()}</p>
                        <p><strong>Cashier:</strong> ${e.transaction.Cashier_ID}</p>
                        <p><strong>Subtotal:</strong> ₱${parseFloat(e.transaction.Sale_Total).toFixed(2)}</p>
                        <p><strong>Tax Total:</strong> ₱${parseFloat(e.transaction.Tax_Total).toFixed(2)}</p>
                    </div>
                    <div class="receipt-items">
                        <h3>Items</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${e.items.map(l=>`
                                    <tr>
                                        <td>${l.Item_Description}</td>
                                        <td>₱${parseFloat(l.Amount||0).toFixed(2)}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                    <div class="receipt-footer">
                        <p>${e.receipt.Receipt_Footer_L1}</p>
                        <p>${e.receipt.Receipt_Footer_L2}</p>
                        <p>${e.receipt.Receipt_Footer_L3}</p>
                        <p>${e.receipt.Receipt_Footer_L4}</p>
                        <p>${e.receipt.Receipt_Footer_L5}</p>
                    </div>
                </body>
                </html>
            `;r.document.write(o),r.document.close(),r.print(),r.close()}}},Y={handleVoid:V,handleVoidAll:H,setInputValue:n,handleClear:U,handlePrintReceipt:E},Z=async t=>{if(console.log("MOP selected:",t),v===""||parseFloat(v.replace("₱","").replace(",",""))<=0){s.error("Please enter an amount before selecting a method of payment.");return}j(t),await Q()},u=d.reduce((t,e)=>t+parseFloat(e.Amount||0),0).toFixed(2),q=u*.12;Math.max(0,f-u).toFixed(2);const Q=async()=>{if(!I){s.error("Please select a method of payment");return}if(d.length===0){s.error("No transactions to save");return}try{const e=(await p.post("/store-transactions",{subtotal:u,taxTotal:q,mopName:I.MOP_Name.trim(),deliveryIds:d.map(r=>r.Delivery_ID)})).data.transaction;if(e){s.success("Transaction saved successfully"),$(!0);const r=u-f;k(r),r>0?n(`Amount Due: ₱${r.toFixed(2)}`):n(`Change: ₱${Math.abs(r).toFixed(2)}`),h([]),j(null),m(0),localStorage.removeItem("deliveryData"),localStorage.removeItem("disabledIds"),await E(e)}else s.error("Error retrieving transaction ID")}catch(t){s.error("Error saving transaction"),console.error("Error saving transaction:",t)}};return a.jsxs(a.Fragment,{children:[a.jsx(X,{title:"Home"}),a.jsx("audio",{ref:c,src:"assets/audio/nozzle-status-sound.wav"}),a.jsx(te,{position:"top-right"}),a.jsx("div",{className:"min-h-screen p-3",children:a.jsx("main",{className:"w-full h-full mx-auto",children:a.jsxs("div",{className:"grid gap-6 lg:grid-cols-2 lg:gap-4",children:[a.jsxs(S,{className:"flex flex-col h-full p-3",children:[a.jsx("div",{className:"flex-grow",children:a.jsx(ae,{deliveryData:d,setSelectedRow:D})}),a.jsxs(S,{className:"w-full gap-2 p-2",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx(A,{variant:"bordered",label:a.jsx("p",{className:"font-bold",children:"SUBTOTAL"}),size:"lg",value:`₱${u}`,labelPlacement:"outside-left",className:"w-[35%]",classNames:{input:["text-black text-xl font-bold text-right"]},isReadOnly:!0}),a.jsx(A,{variant:"bordered",className:"w-[70%]",classNames:{input:["text-black text-2xl font-bold text-right"]},value:v,isReadOnly:!0,size:"lg"})]}),a.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-1",children:a.jsx(oe,{handleButtonClick:B,buttons:le,buttonClickHandlers:Y,setInputValue:n})})]})]}),a.jsx(S,{className:"flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10",children:a.jsx("div",{className:"flex w-full flex-col",children:a.jsxs(re,{"aria-label":"Options",fullWidth:!0,children:[a.jsx(T,{title:"PUMPS",children:w.length===0?a.jsxs("div",{className:"flex flex-col items-center mt-6",children:[a.jsx(ee,{className:"w-12 h-12 text-danger"}),a.jsx("span",{className:"mt-4",children:"No pumps found"})]}):a.jsx("div",{className:"overflow-y-auto max-h-[calc(100vh-200px)] p-2",children:a.jsx("div",{className:"grid grid-cols-4 gap-4",children:w.map(t=>a.jsx(ie,{pump:t,handleAppendDeliveryData:M,handleAuthorize:W,stopPump:G,authorizedPumps:z},t.Id))})})},"pumps"),a.jsx(T,{title:"MOP",children:a.jsx("div",{className:"grid grid-cols-4 gap-4",children:a.jsx(se,{mopList:L,onSelectMOP:Z})})},"mop")]})})})]})})})]})}export{le as buttons,ze as default};
