import{j as e}from"./app-DJ0OCxwK.js";import{m as X,a as f,b as x,c as h,d as j}from"./chunk-P2T5LMDM-BSwoEP5i.js";import{i as r}from"./chunk-GQQM5TNQ-P53s9ApC.js";import{b as s}from"./chunk-DBLREEYE-C6Vwu_wX.js";import"./useLabels-C7uuHIf4.js";import"./getScrollParent-CTiUb1E9.js";import"./FocusScope-C3BCnoq3.js";import"./VisuallyHidden-D0N98OxW.js";import"./useControlledState-DF6__fTM.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-cOo1klYh.js";import"./useFormReset-Dic5pjzl.js";import"./useLabel-BEN_EtuV.js";import"./chunk-M3MASYO7-CeYIKs2S.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";const P=({isOpen:d,onOpenChange:i,cardNumber:m,setCardNumber:l,approvalCode:n,setApprovalCode:o,cardHolderName:c,setCardHolderName:t,onSave:p})=>e.jsx(X,{size:"lg",isOpen:d,onOpenChange:i,children:e.jsx(f,{children:u=>e.jsxs(e.Fragment,{children:[e.jsx(x,{className:"flex flex-col gap-1",children:"DEBIT/CREDIT CARD INFORMATION"}),e.jsxs(h,{children:[e.jsx(r,{autoFocus:!0,label:"Card #",placeholder:"XXX-XXX-XXX-XXX-XXX",variant:"bordered",value:m,onChange:a=>l(a.target.value)}),e.jsx(r,{label:"Approval Code",placeholder:"XXXXXX",variant:"bordered",value:n,onChange:a=>o(a.target.value)}),e.jsx(r,{label:"Card Holder Name",placeholder:"Card Holder Name",variant:"bordered",value:c,onChange:a=>t(a.target.value)})]}),e.jsxs(j,{children:[e.jsx(s,{className:"w-full",color:"success",onPress:p,children:"Save"}),e.jsx(s,{className:"w-full",color:"danger",onPress:()=>{l(""),o(""),t(""),u()},children:"Close"})]})]})})});export{P as CardDetails};
