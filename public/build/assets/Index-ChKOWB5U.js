import{j as e,c as C,d}from"./app-DJ0OCxwK.js";import f from"./ElectricJournal-Cu1TpWAi.js";import P from"./AboutSoftware-CVR7ZnrI.js";import b from"./PriceChange-B4fw-xZt.js";import{u as n}from"./index-2TX6XvHX.js";import"./index-EUbz-fhy.js";import"./iconBase-BN3XEKHS.js";import"./index-D834aa3t.js";import"./index-X92CTFGl.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./chunk-P2T5LMDM-BSwoEP5i.js";import"./useLabels-C7uuHIf4.js";import"./getScrollParent-CTiUb1E9.js";import"./FocusScope-C3BCnoq3.js";import"./VisuallyHidden-D0N98OxW.js";import"./useControlledState-DF6__fTM.js";import"./chunk-YRZGWF2W-AeXPm49x.js";import"./scrollIntoView-D_ErU28Z.js";import"./SelectionManager-CiNkBuTg.js";import"./chunk-KBN3H6OQ-CWXvv_JV.js";import"./useToggleState-BTeDqN7Y.js";import"./useFormReset-Dic5pjzl.js";import"./index-3GMhIGNj.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-cOo1klYh.js";import"./LiveAnnouncer-q_S9a73M.js";import"./useCollator-BqR0K-ta.js";import"./useHasTabbableChild-Daxskigl.js";import"./chunk-IXXDDLGU-C927SSi6.js";import"./chunk-DBLREEYE-C6Vwu_wX.js";import"./chunk-44JHHBS2-CWPKxyw1.js";import"./ApplicationLogo-ynUf4uBI.js";import"./chunk-RUXXUVWM-Dvg1qZRs.js";import"./chunk-GQQM5TNQ-P53s9ApC.js";import"./useLabel-BEN_EtuV.js";import"./chunk-M3MASYO7-CeYIKs2S.js";import"./NumberFormatter-DgUnyrzU.js";const t={restartPTS:{label:"Restart PTS Controller",onPress:"restartPumpServer"},aboutSoftware:{label:"About Software",onPress:"onOpenAbout"},electricJournal:{label:"Electronic Journal",onPress:"onOpenElectricJournal"},priceChange:{label:"Price Change",onPress:"onOpenPriceChange"},managerView:{label:"Manager's View"},posConfig:{label:"POS Config"}};function se({onToast:i}){const{isOpen:s,onOpen:p,onOpenChange:a}=n(),{isOpen:l,onOpen:m,onOpenChange:c}=n(),{isOpen:u,onOpen:O,onOpenChange:h}=n(),g={restartPumpServer:()=>{d.post("/restart-pts").then(()=>{i("PTS server restarted","success")}).catch(r=>{i("Error",r.message)})},onOpenAbout:m,onOpenElectricJournal:p,onOpenPriceChange:O},x=({label:r,onPress:o})=>e.jsx(C,{isPressable:!!o,onPress:o?g[o]:null,className:"p-2 h-[150px]",children:e.jsx("div",{className:"flex justify-center items-center h-full",children:e.jsx("h1",{className:"text-xl font-extrabold",children:r})})});return e.jsxs(e.Fragment,{children:[e.jsx("section",{children:e.jsx("div",{className:"w-full h-full mx-auto gap-2 grid grid-cols-3",children:Object.keys(t).map(r=>e.jsx(x,{label:t[r].label,onPress:t[r].onPress},r))})}),e.jsx(f,{isOpen:s,onOpenChange:a}),e.jsx(P,{isOpen:l,onOpenChange:c}),e.jsx(b,{isOpen:u,onOpenChange:h})]})}export{se as default};