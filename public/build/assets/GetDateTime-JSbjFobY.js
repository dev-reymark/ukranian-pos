import{j as n}from"./app-CG3hSCCP.js";import{i as a}from"./chunk-GQQM5TNQ-rAry1ocd.js";import"./chunk-N2KXC5ZE-Bb84iJeV.js";import"./index-DLPbFJSg.js";import"./chunk-XHQUSKIE-B4ClOMq7.js";import"./chunk-RQNQ5XFG-Dn3p-Hil.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-v1uMEGqz.js";import"./useControlledState-BgNZymqW.js";import"./useFocusable-DuzB0xKt.js";import"./useFormReset-DTEM-02-.js";import"./useLabel-Q8XoHhOL.js";import"./useLabels-DmjHiA4o.js";import"./chunk-M3MASYO7-DjKVYsRL.js";const F=()=>{const e=new Date,t=Intl.DateTimeFormat().resolvedOptions().timeZone,i=((o,r)=>{const m={year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0,timeZone:r};return new Intl.DateTimeFormat("en-US",m).format(o)})(e,t);return n.jsx(a,{isReadOnly:!0,color:"default",variant:"flat",label:`Server Time (${t})`,value:i,className:"w-[25%]"})};export{F as GetDateTime};