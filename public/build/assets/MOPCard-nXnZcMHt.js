import{j as s}from"./app-CZL9chFl.js";import{c as r,a as m,b as i}from"./chunk-H4VOEXHF-Di3Z_Bs5.js";import{i as o}from"./chunk-NK4BRF7C-dghsNpkO.js";import"./chunk-N2KXC5ZE-DfxA9TNT.js";import"./chunk-XHQUSKIE-CRTs_YlA.js";import"./useHover-Cn_Qs2ce.js";import"./index-C4dpBN_I.js";import"./chunk-6NL67ZRH-CDLHZ7fz.js";import"./index-DJhsGy01.js";import"./index-DlIxkoSw.js";const d={CASH:"/assets/img/MOP/cash.webp","METROBANK C CARD":"/assets/img/MOP/metrobank.webp","QR GCASH":"/assets/img/MOP/gcashQr.webp","QR PAYMAYA":"/assets/img/MOP/paymayaQr.webp","PAYMAYA CREDIT CARD":"/assets/img/MOP/paymayaCreditCard.webp"},l=({mopList:a,onSelectMOP:t})=>a.length>0?s.jsx("div",{className:"grid grid-cols-4 gap-4",children:a.map(e=>s.jsxs(r,{shadow:"sm",isPressable:!0,onPress:()=>t(e),children:[s.jsx(m,{className:"overflow-visible p-0",children:s.jsx(o,{shadow:"sm",radius:"lg",width:"100%",alt:e.MOP_Name.trim(),className:"w-full object-cover h-[200px]",src:d[e.MOP_Name.trim()]||"/assets/img/MOP/mop.webp"})}),s.jsx(i,{className:"text-small justify-between",children:s.jsx("b",{children:e.MOP_Name.trim()})})]},e.MOP_ID))}):s.jsx("div",{className:"col-span-4 text-center text-red-500",children:"Payment method not found"}),O=l;export{O as default};
