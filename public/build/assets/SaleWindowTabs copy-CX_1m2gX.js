import{r as c,j as s}from"./app-C7tOZ9mb.js";import{t as T,a as b}from"./chunk-FXLYF44B-CjfuvLIp.js";import{c as N}from"./chunk-H4VOEXHF-DsCNIOMn.js";import{t,a as x,b as r,c as d,d as a,e}from"./chunk-YRZGWF2W-DrQDyyYd.js";import"./chunk-N2KXC5ZE-D_CJACt4.js";import"./chunk-RQNQ5XFG-EKoFrFia.js";import"./chunk-XHQUSKIE-DH6WFa3x.js";import"./useLabels-RMseU24M.js";import"./useHasTabbableChild-BtGCddz_.js";import"./FocusScope-BYVYjJmQ.js";import"./useFocusable-BwCCJFar.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./index-X92CTFGl.js";import"./SelectionManager-BZLHT_u-.js";import"./scrollIntoView-DvDgV4U_.js";import"./useControlledState-Cpz1NFEK.js";import"./chunk-6NL67ZRH-BrjaCyLg.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./useListState-DOzEYPYb.js";import"./getScrollParent-CdIc2hyL.js";import"./useToggleState-DEYoigRv.js";import"./useFormReset-DJWxeQmG.js";import"./index-B43NX_O7.js";import"./index-cynRN4w3.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-LykJjBsk.js";import"./VisuallyHidden-DbICzycp.js";import"./LiveAnnouncer-Cf5l3hCh.js";import"./useCollator-CbQycZuf.js";import"./chunk-IXXDDLGU-DQyhayGs.js";const Z=({deliveryData:j,setSelectedRow:_,subtotal:m,transactionSaved:h,transactionSummary:o})=>{const[p,u]=c.useState(!1);c.useEffect(()=>{h&&u(!0)},[h]),c.useEffect(()=>{u(!1)},[j]);const i=Object.values(j).flat(),f=l=>{console.log("Row clicked:",l),_(l.Delivery_ID)};return s.jsx(s.Fragment,{children:s.jsxs(T,{"aria-label":"Sale Window",children:[s.jsx(b,{title:"WINDOW 1",children:s.jsxs(N,{className:"p-2",children:[s.jsxs(t,{removeWrapper:!0,isHeaderSticky:!0,"aria-label":"Transactions",selectionMode:"single",className:"max-h-[330px] overflow-y-auto scrollbar-hide",children:[s.jsxs(x,{children:[s.jsx(r,{children:"ITEM(S)"}),s.jsx(r,{children:"PRICE"}),s.jsx(r,{children:"VOLUME(L)"}),s.jsx(r,{children:"AMOUNT(₱)"})]}),s.jsx(d,{items:i,emptyContent:s.jsx("h1",{className:"text-xl font-extrabold",children:"No Transactions!"}),children:i.map(l=>s.jsxs(a,{onClick:()=>f(l),children:[s.jsxs(e,{children:[l.Pump," - ",l.FuelGradeName]}),s.jsx(e,{children:l.Price}),s.jsx(e,{children:l.Volume.toFixed(2)}),s.jsx(e,{children:l.Amount})]},l.Delivery_ID))})]}),p&&s.jsx("div",{children:s.jsxs(t,{"aria-label":"Transaction Summary",hideHeader:!0,removeWrapper:!0,children:[s.jsxs(x,{children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),s.jsxs(d,{children:[s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"SUBTOTAL"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",m]})]},"subtotal"),o.mopPayments.map((l,n)=>s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:l.mopName}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",l.amount.toFixed(2)]})]},n)),s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"Change"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",o.change.toFixed(2)]})]},"change")]})]})})]})},"window1"),s.jsx(b,{title:"WINDOW 2",children:s.jsxs(N,{className:"p-2 h-[340px]",children:[s.jsxs(t,{removeWrapper:!0,isHeaderSticky:!0,"aria-label":"Transactions",selectionMode:"single",className:"max-h-[330px] overflow-y-auto scrollbar-hide",children:[s.jsxs(x,{children:[s.jsx(r,{children:"ITEM(S)"}),s.jsx(r,{children:"PRICE"}),s.jsx(r,{children:"VOLUME(L)"}),s.jsx(r,{children:"AMOUNT(₱)"})]}),s.jsx(d,{items:i,emptyContent:s.jsx("h1",{className:"text-xl font-extrabold mt-20",children:"No transactions yet."}),children:i.map(l=>s.jsxs(a,{onClick:()=>f(l),children:[s.jsxs(e,{children:[l.Pump," - ",l.FuelGradeName]}),s.jsx(e,{children:l.Price}),s.jsx(e,{children:l.Volume.toFixed(2)}),s.jsx(e,{children:l.Amount})]},l.Delivery_ID))})]}),p&&s.jsx("div",{children:s.jsxs(t,{"aria-label":"Transaction Summary",hideHeader:!0,removeWrapper:!0,children:[s.jsxs(x,{children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),s.jsxs(d,{children:[s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"SUBTOTAL"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",m]})]},"subtotal"),o.mopPayments.map((l,n)=>s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:l.mopName}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",l.amount.toFixed(2)]})]},n)),s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"Change"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",o.change.toFixed(2)]})]},"change")]})]})})]})},"window2")]})})};export{Z as default};