import{j as r}from"./app-BYi9tuF7.js";import{m as X,a as f,b as x,c as h,d as j}from"./chunk-P2T5LMDM-CWhZwe9K.js";import{i as a}from"./chunk-GQQM5TNQ-DVzymyfw.js";import{b as s}from"./chunk-DBLREEYE-DcM24RjU.js";import"./chunk-N2KXC5ZE-DcgP4m1g.js";import"./chunk-RQNQ5XFG-B478yn5k.js";import"./useLabels-DH8MqdYW.js";import"./chunk-XHQUSKIE-C0RpEu3F.js";import"./FocusScope-BDx0lyY5.js";import"./useFocusable-CLUzAn8J.js";import"./VisuallyHidden-DhxpZ2h2.js";import"./chunk-6NL67ZRH-CBRxC36I.js";import"./useControlledState--ZzFRhQU.js";import"./index-Du5ZOa_8.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-CAFRINWI-CcU5yOMx.js";import"./useFormValidationState-BtddyxEJ.js";import"./useFormReset-BrJWIjys.js";import"./useLabel-D9HjlwO3.js";import"./chunk-M3MASYO7-BYPWylsw.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";const S=({isOpen:i,onOpenChange:d,cardNumber:m,setCardNumber:o,approvalCode:n,setApprovalCode:l,cardHolderName:p,setCardHolderName:t,onSave:c})=>r.jsx(X,{size:"lg",isOpen:i,onOpenChange:d,children:r.jsx(f,{children:u=>r.jsxs(r.Fragment,{children:[r.jsx(x,{className:"flex flex-col gap-1",children:"DEBIT/CREDIT CARD INFORMATION"}),r.jsxs(h,{children:[r.jsx(a,{autoFocus:!0,label:"Card #",placeholder:"XXX-XXX-XXX-XXX-XXX",variant:"bordered",value:m,onChange:e=>o(e.target.value)}),r.jsx(a,{label:"Approval Code",placeholder:"XXXXXX",variant:"bordered",value:n,onChange:e=>l(e.target.value)}),r.jsx(a,{label:"Card Holder Name",placeholder:"Card Holder Name",variant:"bordered",value:p,onChange:e=>t(e.target.value)})]}),r.jsxs(j,{children:[r.jsx(s,{className:"w-full",color:"success",onPress:c,children:"Save"}),r.jsx(s,{className:"w-full",color:"danger",onPress:()=>{o(""),l(""),t(""),u()},children:"Close"})]})]})})});export{S as CardDetails};
