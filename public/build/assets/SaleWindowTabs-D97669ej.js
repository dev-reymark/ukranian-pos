import{r as s,j as e,e as j}from"./app-C7tOZ9mb.js";import{t as y,a as f}from"./chunk-FXLYF44B-CjfuvLIp.js";import{c as N}from"./chunk-H4VOEXHF-DsCNIOMn.js";import"./chunk-N2KXC5ZE-D_CJACt4.js";import"./chunk-RQNQ5XFG-EKoFrFia.js";import"./chunk-XHQUSKIE-DH6WFa3x.js";import"./useLabels-RMseU24M.js";import"./useHasTabbableChild-BtGCddz_.js";import"./FocusScope-BYVYjJmQ.js";import"./useFocusable-BwCCJFar.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./index-X92CTFGl.js";import"./SelectionManager-BZLHT_u-.js";import"./scrollIntoView-DvDgV4U_.js";import"./useControlledState-Cpz1NFEK.js";import"./chunk-6NL67ZRH-BrjaCyLg.js";import"./chunk-2PIR7DFM-CbcDDgM_.js";import"./useListState-DOzEYPYb.js";const g=({deliveryData:l,setSelectedRow:p,subtotal:o,transactionSaved:c,transactionSummary:i})=>{const[n,x]=s.useState(!1),[h,m]=s.useState(null);s.useEffect(()=>{c&&x(!0)},[c]),s.useEffect(()=>{x(!1)},[l]);const a=Object.values(l).flat(),u=t=>{console.log("Row clicked:",t),p(t.Delivery_ID),m(t.Delivery_ID)},d=a.reduce((t,r)=>{const w=parseFloat(r.DiscountedAmount)||0;return t+w},0);return e.jsx(e.Fragment,{children:e.jsx(y,{"aria-label":"Sale Window",children:e.jsx(f,{title:"WINDOW 1",children:e.jsxs(N,{className:"p-2",children:[e.jsx("div",{className:"overflow-x-auto",children:e.jsx("div",{className:"h-[250px] xl:h-[300px] overflow-y-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"bg-gray-50 sticky top-0",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider",children:"ITEM(S)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider",children:"PRICE"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider",children:"VOLUME(L)"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-extrabold uppercase tracking-wider",children:"AMOUNT(₱)"})]})}),e.jsx("tbody",{className:"bg-white divide-y divide-gray-200",children:a.length===0?e.jsx("tr",{className:"h-[200px] xl:h-[300px]",children:e.jsx("td",{colSpan:"6",className:"px-6 py-3 text-center text-xl font-extrabold text-gray-400",children:"Nothing to show"})}):a.map(t=>e.jsxs(j.Fragment,{children:[e.jsxs("tr",{onClick:()=>u(t),className:`cursor-pointer ${h===t.Delivery_ID?"bg-blue-100":"hover:bg-gray-100"}`,children:[e.jsxs("td",{className:"uppercase px-6 py-4 whitespace-nowrap",children:[t.Pump," -"," ",t.FuelGradeName]}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:t.Price}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:t.Volume.toFixed(2)}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:t.OriginalAmount||t.Amount})]}),t.DiscountedAmount&&e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap",children:t.PresetName}),e.jsx("td",{}),e.jsx("td",{}),e.jsxs("td",{children:["(",t.DiscountedAmount,")"]})]})]},t.Delivery_ID))})]})})}),n&&e.jsx("div",{className:"mt-4",children:e.jsxs("table",{className:"min-w-full divide-y divide-gray-200",children:[e.jsx("thead",{className:"sr-only",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"})]})}),e.jsxs("tbody",{className:"bg-white divide-y divide-gray-200",children:[e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap font-bold",children:"SUBTOTAL"}),e.jsxs("td",{colSpan:"5",className:"px-6 py-4 whitespace-nowrap text-right font-bold",children:["₱",o]})]}),d>0&&e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap font-bold",children:"TOTAL DISCOUNT"}),e.jsxs("td",{colSpan:"5",className:"px-6 py-4 whitespace-nowrap text-right font-bold",children:["₱",d.toFixed(2)]})]}),i.mopPayments.map((t,r)=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap font-bold",children:t.mopName}),e.jsxs("td",{colSpan:"5",className:"px-6 py-4 whitespace-nowrap text-right font-bold",children:["₱",t.amount.toFixed(2)]})]},r)),e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap font-bold",children:"Change"}),e.jsxs("td",{colSpan:"5",className:"px-6 py-4 whitespace-nowrap text-right font-bold",children:["₱",i.change.toFixed(2)]})]})]})]})})]})},"window1")})})},M=g;export{M as default};