import{j as r}from"./app-CU-WO1ha.js";import{c as a}from"./chunk-H4VOEXHF-BWJCRE_t.js";import{c as i}from"./chunk-5ALFRFZW-BeY_uHae.js";import{i as o}from"./chunk-NK4BRF7C-Be8Zb8l7.js";import{c as m}from"./chunk-JHUBASYZ-D3WeJlyp.js";import"./chunk-N2KXC5ZE-B6GiQUqI.js";import"./chunk-XHQUSKIE-DXaFXxBl.js";import"./useHover-0cX7ZD-_.js";import"./index-B0H9SEvE.js";import"./useFocusable-CwbNjnte.js";import"./chunk-RQNQ5XFG-B4M0tKT3.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-6NL67ZRH-BGQLi1Av.js";import"./index-047NrGZK.js";import"./index-BIQJOCN_.js";const d=({mopList:e,onSelectMOP:s})=>e.length>0?r.jsx("div",{className:"grid grid-cols-4 gap-4",children:e.map(t=>r.jsxs(a,{shadow:"sm",isPressable:!0,onPress:()=>s(t),children:[r.jsx(i,{className:"overflow-visible p-0",children:r.jsx(o,{shadow:"sm",radius:"lg",width:"100%",alt:t.MOP_Name.trim(),className:"w-full object-cover h-[200px]"})}),r.jsx(m,{className:"text-small justify-between",children:r.jsx("b",{children:t.MOP_Name.trim()})})]},t.MOP_ID))}):r.jsx("div",{className:"col-span-4 text-center text-red-500",children:"Payment method not found"}),v=d;export{v as default};