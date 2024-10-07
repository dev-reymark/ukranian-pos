import{M as _,N as y,O as B,r as s}from"./app-DQR8ouMN.js";var R={},D={};function G(t,e,...a){var i;const r=`[Next UI]${e?` [${e}]`:" "}: ${t}`;if(!(typeof console>"u")&&!D[r]&&(D[r]=!0,((i=process==null?void 0:R)==null?void 0:i.NODE_ENV)!=="production"))return console.warn(r,a)}function H(t,e,a){let{validationBehavior:i,focus:v}=t;_(()=>{if(i==="native"&&(a!=null&&a.current)){let l=e.realtimeValidation.isInvalid?e.realtimeValidation.validationErrors.join(" ")||"Invalid value.":"";a.current.setCustomValidity(l),a.current.hasAttribute("title")||(a.current.title=""),e.realtimeValidation.isInvalid||e.updateValidation(j(a.current))}});let r=y(()=>{e.resetValidation()}),u=y(l=>{var n;e.displayValidation.isInvalid||e.commitValidation();let c=a==null||(n=a.current)===null||n===void 0?void 0:n.form;if(!l.defaultPrevented&&a&&c&&k(c)===a.current){var f;v?v():(f=a.current)===null||f===void 0||f.focus(),B("keyboard")}l.preventDefault()}),o=y(()=>{e.commitValidation()});s.useEffect(()=>{let l=a==null?void 0:a.current;if(!l)return;let n=l.form;return l.addEventListener("invalid",u),l.addEventListener("change",o),n==null||n.addEventListener("reset",r),()=>{l.removeEventListener("invalid",u),l.removeEventListener("change",o),n==null||n.removeEventListener("reset",r)}},[a,u,o,r,i])}function T(t){let e=t.validity;return{badInput:e.badInput,customError:e.customError,patternMismatch:e.patternMismatch,rangeOverflow:e.rangeOverflow,rangeUnderflow:e.rangeUnderflow,stepMismatch:e.stepMismatch,tooLong:e.tooLong,tooShort:e.tooShort,typeMismatch:e.typeMismatch,valueMissing:e.valueMissing,valid:e.valid}}function j(t){return{isInvalid:!t.validity.valid,validationDetails:T(t),validationErrors:t.validationMessage?[t.validationMessage]:[]}}function k(t){for(let e=0;e<t.elements.length;e++){let a=t.elements[e];if(!a.validity.valid)return a}return null}const M={badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valueMissing:!1,valid:!0},C={...M,customError:!0,valid:!1},$={isInvalid:!1,validationDetails:M,validationErrors:[]},F=s.createContext({}),w="__formValidationState"+Date.now();function J(t){if(t[w]){let{realtimeValidation:e,displayValidation:a,updateValidation:i,resetValidation:v,commitValidation:r}=t[w];return{realtimeValidation:e,displayValidation:a,updateValidation:i,resetValidation:v,commitValidation:r}}return Q(t)}function Q(t){let{isInvalid:e,validationState:a,name:i,value:v,builtinValidation:r,validate:u,validationBehavior:o="aria"}=t;a&&(e||(e=a==="invalid"));let l=e!==void 0?{isInvalid:e,validationErrors:[],validationDetails:C}:null,n=s.useMemo(()=>L(q(u,v)),[u,v]);r!=null&&r.validationDetails.valid&&(r=null);let c=s.useContext(F),f=s.useMemo(()=>i?Array.isArray(i)?i.flatMap(d=>h(c[d])):h(c[i]):[],[c,i]),[A,O]=s.useState(c),[S,V]=s.useState(!1);c!==A&&(O(c),V(!1));let b=s.useMemo(()=>L(S?[]:f),[S,f]),x=s.useRef($),[p,E]=s.useState($),m=s.useRef($),N=()=>{if(!U)return;g(!1);let d=n||r||x.current;I(d,m.current)||(m.current=d,E(d))},[U,g]=s.useState(!1);return s.useEffect(N),{realtimeValidation:l||b||n||r||$,displayValidation:o==="native"?l||b||p:l||b||n||r||p,updateValidation(d){o==="aria"&&!I(p,d)?E(d):x.current=d},resetValidation(){let d=$;I(d,m.current)||(m.current=d,E(d)),o==="native"&&g(!1),V(!0)},commitValidation(){o==="native"&&g(!0),V(!0)}}}function h(t){return t?Array.isArray(t)?t:[t]:[]}function q(t,e){if(typeof t=="function"){let a=t(e);if(a&&typeof a!="boolean")return h(a)}return[]}function L(t){return t.length?{isInvalid:!0,validationErrors:t,validationDetails:C}:null}function I(t,e){return t===e?!0:t&&e&&t.isInvalid===e.isInvalid&&t.validationErrors.length===e.validationErrors.length&&t.validationErrors.every((a,i)=>a===e.validationErrors[i])&&Object.entries(t.validationDetails).every(([a,i])=>e.validationDetails[a]===i)}function K(...t){let e=new Set,a=!1,i={...M};for(let u of t){var v,r;for(let o of u.validationErrors)e.add(o);a||(a=u.isInvalid);for(let o in i)(v=i)[r=o]||(v[r]=u.validationDetails[o])}return i.valid=!a,{isInvalid:a,validationErrors:[...e],validationDetails:i}}export{J as $,H as a,$ as b,w as c,K as d,G as w};