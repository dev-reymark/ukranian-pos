import{j as e}from"./app-BUG5qQgz.js";import{m as j,a as h,b as v,c as _,d as g}from"./chunk-P2T5LMDM-BEPxiFxU.js";import{i as a}from"./chunk-GQQM5TNQ-CSi5uS9T.js";import{b as l}from"./chunk-DBLREEYE-B5NiI8dN.js";import"./chunk-N2KXC5ZE-CQEZCh9j.js";import"./chunk-RQNQ5XFG-CCe9qDU2.js";import"./useLabels-RZusGEFa.js";import"./chunk-XHQUSKIE-Bem5Pt0d.js";import"./getScrollParent-etvEhCeC.js";import"./FocusScope-C6FvHQAC.js";import"./useFocusable-DwsmypTm.js";import"./VisuallyHidden-VblXzB80.js";import"./chunk-6NL67ZRH-jV9lOtVq.js";import"./useControlledState-B_gnQ3BU.js";import"./index-6nIXNlBn.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-DMygRl9h.js";import"./useFormReset-0VtgFqak.js";import"./useLabel-BKx4Tw7f.js";import"./chunk-M3MASYO7-h0Kl7epv.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";const P=({isOpen:o,onClose:s,onCustomerDataChange:t,customerName:i,customerAddress:m,customerTIN:n,customerBusinessStyle:d,onSave:p,setCustomerName:u,setCustomerAddress:c,setCustomerTIN:x,setCustomerBusinessStyle:f})=>{const b=()=>{u(""),c(""),x(""),f("")};return e.jsx(j,{isOpen:o,onOpenChange:s,placement:"top-center",children:e.jsx(h,{children:()=>e.jsxs(e.Fragment,{children:[e.jsx(v,{className:"dark:text-black",children:"Enter Customer Information"}),e.jsxs(_,{children:[e.jsx(a,{autoFocus:!0,label:"Customer Name",variant:"bordered",value:i,onChange:r=>t("name",r.target.value)}),e.jsx(a,{label:"Address",variant:"bordered",value:m,onChange:r=>t("address",r.target.value)}),e.jsx(a,{label:"TIN",variant:"bordered",value:n,onChange:r=>t("tin",r.target.value)}),e.jsx(a,{label:"Business Style",variant:"bordered",value:d,onChange:r=>t("businessStyle",r.target.value)})]}),e.jsxs(g,{children:[e.jsx(l,{color:"success",onClick:p,className:"w-full",children:"Continue"}),e.jsx(l,{onClick:b,className:"w-full",children:"Clear All"})]})]})})})};export{P as CustomerDetails};