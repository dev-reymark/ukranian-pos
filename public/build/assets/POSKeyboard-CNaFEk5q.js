import{j as l}from"./app-DES__7Rh.js";import{b as i}from"./chunk-DBLREEYE-DzWOEzsw.js";import"./chunk-N2KXC5ZE-C6Y5_qAY.js";import"./chunk-XHQUSKIE-CdgHa3t2.js";import"./useHover-hBRi7EPs.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./index-BOxUIzwV.js";import"./chunk-6NL67ZRH-CGxmtYsH.js";const x=[{label:"CLEAR",color:"primary",onClick:"handleClear"},{label:"VOID",color:"danger",onClick:"handleVoid"},{label:"VOID ALL",color:"primary",onClick:"handleVoidAll"},{label:"REFRESH",color:"primary",onClick:()=>window.location.reload()},{label:"OPEN DRAWER",color:"primary",className:"md:text-sm"},{label:"SUB-TOTAL",color:"primary",onClick:"handleSubTotal"},{label:"PRINT RECEIPT",color:"primary",className:"md:text-sm",onClick:"handlePrintReceipt"},{label:"ZERO RATED",color:"primary"},{label:"PG DISC",color:"primary"},{label:"ENTER",color:"primary"},{label:"ALL STOP",color:"primary",onClick:"handleStopAllPumps"},{label:"ALL AUTH",color:"primary",onClick:"handleAuthorizeAllPumps"}],n=({handleButtonClick:e,buttons:t,buttonClickHandlers:a,setInputValue:c})=>l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"grid grid-cols-3 gap-1",children:[1,2,3,4,5,6,7,8,9,0,"00","."].map(r=>l.jsx(i,{color:"primary",size:"lg",onClick:()=>e(r.toString()),children:r},r))}),l.jsx("div",{className:"grid grid-cols-3 gap-1",children:t.map(({label:r,color:m,onClick:o,className:s},p)=>l.jsx(i,{size:"lg",color:m,onClick:()=>{typeof o=="string"&&a[o]?a[o]():typeof o=="function"&&o(c)},className:s,children:r},p))})]}),P=n;export{x as buttons,P as default};