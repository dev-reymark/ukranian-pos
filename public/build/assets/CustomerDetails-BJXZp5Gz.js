import{j as e}from"./app-DJ0OCxwK.js";import{m as p,a as x,b,c as f,d as j}from"./chunk-P2T5LMDM-BSwoEP5i.js";import{i as t}from"./chunk-GQQM5TNQ-P53s9ApC.js";import{b as a}from"./chunk-DBLREEYE-C6Vwu_wX.js";import"./useLabels-C7uuHIf4.js";import"./getScrollParent-CTiUb1E9.js";import"./FocusScope-C3BCnoq3.js";import"./VisuallyHidden-D0N98OxW.js";import"./useControlledState-DF6__fTM.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-cOo1klYh.js";import"./useFormReset-Dic5pjzl.js";import"./useLabel-BEN_EtuV.js";import"./chunk-M3MASYO7-CeYIKs2S.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";const R=({isOpen:s,onClose:o,onCustomerDataChange:l,customerName:i,customerAddress:d,customerTIN:n,customerBusinessStyle:m,onSave:u})=>{const c=()=>{l("name",""),l("address",""),l("tin",""),l("businessStyle","")};return e.jsx(p,{isOpen:s,onOpenChange:o,placement:"top-center",children:e.jsx(x,{children:()=>e.jsxs(e.Fragment,{children:[e.jsx(b,{className:"dark:text-black",children:"Enter Customer Information"}),e.jsxs(f,{children:[e.jsx(t,{autoFocus:!0,label:"Customer Name",variant:"bordered",value:i,onChange:r=>l("name",r.target.value)}),e.jsx(t,{label:"Address",variant:"bordered",value:d,onChange:r=>l("address",r.target.value)}),e.jsx(t,{label:"TIN",variant:"bordered",value:n,onChange:r=>l("tin",r.target.value)}),e.jsx(t,{label:"Business Style",variant:"bordered",value:m,onChange:r=>l("businessStyle",r.target.value)})]}),e.jsxs(j,{children:[e.jsx(a,{color:"success",onClick:u,className:"w-full",children:"Continue"}),e.jsx(a,{onClick:c,className:"w-full",children:"Clear All"})]})]})})})};export{R as CustomerDetails};