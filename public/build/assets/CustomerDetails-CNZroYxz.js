import{j as e}from"./app-CG3hSCCP.js";import{m as j,a as h,b as v,c as _,d as g}from"./chunk-P2T5LMDM-D2ibxJIr.js";import{i as a}from"./chunk-GQQM5TNQ-rAry1ocd.js";import{b as l}from"./chunk-DBLREEYE-BLo6wnq6.js";import"./chunk-N2KXC5ZE-Bb84iJeV.js";import"./chunk-RQNQ5XFG-Dn3p-Hil.js";import"./useLabels-DmjHiA4o.js";import"./chunk-XHQUSKIE-B4ClOMq7.js";import"./getScrollParent-s3uJ6ChY.js";import"./FocusScope-CpJfrh8k.js";import"./useFocusable-DuzB0xKt.js";import"./VisuallyHidden-DpkvVz1I.js";import"./chunk-6NL67ZRH-DnhZYCk-.js";import"./useControlledState-BgNZymqW.js";import"./index-DLPbFJSg.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-v1uMEGqz.js";import"./useFormReset-DTEM-02-.js";import"./useLabel-Q8XoHhOL.js";import"./chunk-M3MASYO7-DjKVYsRL.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";const P=({isOpen:o,onClose:s,onCustomerDataChange:t,customerName:i,customerAddress:m,customerTIN:n,customerBusinessStyle:d,onSave:p,setCustomerName:u,setCustomerAddress:c,setCustomerTIN:x,setCustomerBusinessStyle:f})=>{const b=()=>{u(""),c(""),x(""),f("")};return e.jsx(j,{isOpen:o,onOpenChange:s,placement:"top-center",children:e.jsx(h,{children:()=>e.jsxs(e.Fragment,{children:[e.jsx(v,{className:"dark:text-black",children:"Enter Customer Information"}),e.jsxs(_,{children:[e.jsx(a,{autoFocus:!0,label:"Customer Name",variant:"bordered",value:i,onChange:r=>t("name",r.target.value)}),e.jsx(a,{label:"Address",variant:"bordered",value:m,onChange:r=>t("address",r.target.value)}),e.jsx(a,{label:"TIN",variant:"bordered",value:n,onChange:r=>t("tin",r.target.value)}),e.jsx(a,{label:"Business Style",variant:"bordered",value:d,onChange:r=>t("businessStyle",r.target.value)})]}),e.jsxs(g,{children:[e.jsx(l,{color:"success",onClick:p,className:"w-full",children:"Continue"}),e.jsx(l,{onClick:b,className:"w-full",children:"Clear All"})]})]})})})};export{P as CustomerDetails};