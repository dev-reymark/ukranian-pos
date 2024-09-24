import{r as c,j as s,c as b}from"./app-DJ0OCxwK.js";import{t as T,a as N}from"./chunk-FXLYF44B-CXo7bLYM.js";import{t as x,a as t,b as r,c as d,d as a,e}from"./chunk-YRZGWF2W-AeXPm49x.js";import"./useLabels-C7uuHIf4.js";import"./useHasTabbableChild-Daxskigl.js";import"./FocusScope-C3BCnoq3.js";import"./index-X92CTFGl.js";import"./SelectionManager-CiNkBuTg.js";import"./scrollIntoView-D_ErU28Z.js";import"./useControlledState-DF6__fTM.js";import"./index-B3MhTQ63.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./useListState-BnYXW82J.js";import"./getScrollParent-CTiUb1E9.js";import"./chunk-KBN3H6OQ-CWXvv_JV.js";import"./useToggleState-BTeDqN7Y.js";import"./useFormReset-Dic5pjzl.js";import"./index-3GMhIGNj.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-cOo1klYh.js";import"./VisuallyHidden-D0N98OxW.js";import"./LiveAnnouncer-q_S9a73M.js";import"./useCollator-BqR0K-ta.js";import"./chunk-IXXDDLGU-C927SSi6.js";const z=({deliveryData:j,setSelectedRow:_,subtotal:h,transactionSaved:m,transactionSummary:o})=>{const[p,u]=c.useState(!1);c.useEffect(()=>{m&&u(!0)},[m]),c.useEffect(()=>{u(!1)},[j]);const i=Object.values(j).flat(),f=l=>{console.log("Row clicked:",l),_(l.Delivery_ID)};return s.jsx(s.Fragment,{children:s.jsxs(T,{"aria-label":"Sale Window",children:[s.jsx(N,{title:"WINDOW 1",children:s.jsxs(b,{className:"p-2",children:[s.jsxs(x,{removeWrapper:!0,isHeaderSticky:!0,"aria-label":"Transactions",selectionMode:"single",className:"max-h-[330px] overflow-y-auto scrollbar-hide",children:[s.jsxs(t,{children:[s.jsx(r,{children:"ITEM(S)"}),s.jsx(r,{children:"PRICE"}),s.jsx(r,{children:"VOLUME(L)"}),s.jsx(r,{children:"AMOUNT(₱)"})]}),s.jsx(d,{items:i,emptyContent:s.jsx("h1",{className:"text-xl font-extrabold",children:"No Transactions!"}),children:i.map(l=>s.jsxs(a,{onClick:()=>f(l),children:[s.jsxs(e,{children:[l.Pump," - ",l.FuelGradeName]}),s.jsx(e,{children:l.Price}),s.jsx(e,{children:l.Volume.toFixed(2)}),s.jsx(e,{children:l.Amount})]},l.Delivery_ID))})]}),p&&s.jsx("div",{children:s.jsxs(x,{"aria-label":"Transaction Summary",hideHeader:!0,removeWrapper:!0,children:[s.jsxs(t,{children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),s.jsxs(d,{children:[s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"SUBTOTAL"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",h]})]},"subtotal"),o.mopPayments.map((l,n)=>s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:l.mopName}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",l.amount.toFixed(2)]})]},n)),s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"Change"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",o.change.toFixed(2)]})]},"change")]})]})})]})},"window1"),s.jsx(N,{title:"WINDOW 2",children:s.jsxs(b,{className:"p-2 h-[340px]",children:[s.jsxs(x,{removeWrapper:!0,isHeaderSticky:!0,"aria-label":"Transactions",selectionMode:"single",className:"max-h-[330px] overflow-y-auto scrollbar-hide",children:[s.jsxs(t,{children:[s.jsx(r,{children:"ITEM(S)"}),s.jsx(r,{children:"PRICE"}),s.jsx(r,{children:"VOLUME(L)"}),s.jsx(r,{children:"AMOUNT(₱)"})]}),s.jsx(d,{items:i,emptyContent:s.jsx("h1",{className:"text-xl font-extrabold mt-20",children:"No transactions yet."}),children:i.map(l=>s.jsxs(a,{onClick:()=>f(l),children:[s.jsxs(e,{children:[l.Pump," - ",l.FuelGradeName]}),s.jsx(e,{children:l.Price}),s.jsx(e,{children:l.Volume.toFixed(2)}),s.jsx(e,{children:l.Amount})]},l.Delivery_ID))})]}),p&&s.jsx("div",{children:s.jsxs(x,{"aria-label":"Transaction Summary",hideHeader:!0,removeWrapper:!0,children:[s.jsxs(t,{children:[s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{}),s.jsx(r,{})]}),s.jsxs(d,{children:[s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"SUBTOTAL"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",h]})]},"subtotal"),o.mopPayments.map((l,n)=>s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:l.mopName}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",l.amount.toFixed(2)]})]},n)),s.jsxs(a,{children:[s.jsx(e,{className:"font-bold",children:"Change"}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsx(e,{}),s.jsxs(e,{className:"font-bold",children:["₱",o.change.toFixed(2)]})]},"change")]})]})})]})},"window2")]})})};export{z as default};
