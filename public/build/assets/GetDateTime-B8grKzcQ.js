import{j as n}from"./app-BUG5qQgz.js";import{i as a}from"./chunk-GQQM5TNQ-CSi5uS9T.js";import"./chunk-N2KXC5ZE-CQEZCh9j.js";import"./index-6nIXNlBn.js";import"./chunk-XHQUSKIE-Bem5Pt0d.js";import"./chunk-RQNQ5XFG-CCe9qDU2.js";import"./chunk-RJKRL3AU-CjtrMR1U.js";import"./chunk-CAFRINWI-BTDo8zfp.js";import"./useFormValidationState-DMygRl9h.js";import"./useControlledState-B_gnQ3BU.js";import"./useFocusable-DwsmypTm.js";import"./useFormReset-0VtgFqak.js";import"./useLabel-BKx4Tw7f.js";import"./useLabels-RZusGEFa.js";import"./chunk-M3MASYO7-h0Kl7epv.js";const F=()=>{const e=new Date,t=Intl.DateTimeFormat().resolvedOptions().timeZone,i=((o,r)=>{const m={year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0,timeZone:r};return new Intl.DateTimeFormat("en-US",m).format(o)})(e,t);return n.jsx(a,{isReadOnly:!0,color:"default",variant:"flat",label:`Server Time (${t})`,value:i,className:"w-[25%]"})};export{F as GetDateTime};