import{b as q,u as G,r as m,j as k}from"./app-gd-uqgpx.js";import{t as J,m as L,c as Q,o as X,d as o,f as Y}from"./chunk-N2KXC5ZE-Bj2M6wFk.js";import{h as Z,$ as ee,j as se,i as ae,c as te}from"./chunk-XHQUSKIE-Bnfx5sT7.js";import{u as re,a as oe,r as le}from"./chunk-6NL67ZRH-BQd8oPEx.js";import{u as de}from"./chunk-RQNQ5XFG-DzTSHNFR.js";import{f as B}from"./chunk-RJKRL3AU-CjtrMR1U.js";var M=J({slots:{base:["flex","flex-col","relative","overflow-hidden","h-auto","outline-none","text-foreground","box-border","bg-content1",...Z],header:["flex","p-3","z-10","w-full","justify-start","items-center","shrink-0","overflow-inherit","color-inherit","subpixel-antialiased"],body:["relative","flex","flex-1","w-full","p-3","flex-auto","flex-col","place-content-inherit","align-items-inherit","h-auto","break-words","text-left","overflow-y-auto","subpixel-antialiased"],footer:["p-3","h-auto","flex","w-full","items-center","overflow-hidden","color-inherit","subpixel-antialiased"]},variants:{shadow:{none:{base:"shadow-none"},sm:{base:"shadow-small"},md:{base:"shadow-medium"},lg:{base:"shadow-large"}},radius:{none:{base:"rounded-none",header:"rounded-none",footer:"rounded-none"},sm:{base:"rounded-small",header:"rounded-t-small",footer:"rounded-b-small"},md:{base:"rounded-medium",header:"rounded-t-medium",footer:"rounded-b-medium"},lg:{base:"rounded-large",header:"rounded-t-large",footer:"rounded-b-large"}},fullWidth:{true:{base:"w-full"}},isHoverable:{true:{base:"data-[hover=true]:bg-content2 dark:data-[hover=true]:bg-content2"}},isPressable:{true:{base:"cursor-pointer"}},isBlurred:{true:{base:["bg-background/80","dark:bg-background/20","backdrop-blur-md","backdrop-saturate-150"]}},isFooterBlurred:{true:{footer:["bg-background/10","backdrop-blur","backdrop-saturate-150"]}},isDisabled:{true:{base:"opacity-disabled cursor-not-allowed"}},disableAnimation:{true:"",false:{base:"transition-transform-background motion-reduce:transition-none"}}},compoundVariants:[{isPressable:!0,class:"data-[pressed=true]:scale-[0.97] tap-highlight-transparent"}],defaultVariants:{radius:"lg",shadow:"md",fullWidth:!1,isHoverable:!1,isPressable:!1,isDisabled:!1,isFooterBlurred:!1}}),[ne,he]=q({name:"CardContext",strict:!0,errorMessage:"useCardContext: `context` is undefined. Seems you forgot to wrap component within <Card />"});function ie(e){var l,d,n,i;const s=G(),[p,u]=L(e,M.variantKeys),{ref:h,as:b,children:N,onClick:V,onPress:W,autoFocus:O,className:S,classNames:t,allowTextSelectionOnPress:T=!0,...c}=p,r=de(h),D=b||(e.isPressable?"button":"div"),R=typeof D=="string",a=(d=(l=e.disableAnimation)!=null?l:s==null?void 0:s.disableAnimation)!=null?d:!1,$=(i=(n=e.disableRipple)!=null?n:s==null?void 0:s.disableRipple)!=null?i:!1,y=Q(t==null?void 0:t.base,S),{onClick:E,onClear:F,ripples:g}=re(),H=w=>{!a&&!$&&r.current&&E(w)},{buttonProps:j,isPressed:x}=oe({onPress:W,elementType:b,isDisabled:!e.isPressable,onClick:ee(V,H),allowTextSelectionOnPress:T,...c},r),{hoverProps:P,isHovered:v}=se({isDisabled:!e.isHoverable,...c}),{isFocusVisible:C,isFocused:I,focusProps:A}=ae({autoFocus:O}),f=m.useMemo(()=>M({...u,disableAnimation:a}),[X(u),a]),z=m.useMemo(()=>({slots:f,classNames:t,disableAnimation:a,isDisabled:e.isDisabled,isFooterBlurred:e.isFooterBlurred,fullWidth:e.fullWidth}),[f,t,e.isDisabled,e.isFooterBlurred,a,e.fullWidth]),K=m.useCallback((w={})=>({ref:r,className:f.base({class:y}),tabIndex:e.isPressable?0:-1,"data-hover":o(v),"data-pressed":o(x),"data-focus":o(I),"data-focus-visible":o(C),"data-disabled":o(e.isDisabled),...te(e.isPressable?{...j,...A,role:"button"}:{},e.isHoverable?P:{},B(c,{enabled:R}),B(w))}),[r,f,y,R,e.isPressable,e.isHoverable,e.isDisabled,v,x,C,j,A,P,c]),U=m.useCallback(()=>({ripples:g,onClear:F}),[g,F]);return{context:z,domRef:r,Component:D,classNames:t,children:N,isHovered:v,isPressed:x,disableAnimation:a,isPressable:e.isPressable,isHoverable:e.isHoverable,disableRipple:$,handleClick:H,isFocusVisible:C,getCardProps:K,getRippleProps:U}}var _=Y((e,l)=>{const{children:d,context:n,Component:i,isPressable:s,disableAnimation:p,disableRipple:u,getCardProps:h,getRippleProps:b}=ie({...e,ref:l});return k.jsxs(i,{...h(),children:[k.jsx(ne,{value:n,children:d}),s&&!p&&!u&&k.jsx(le,{...b()})]})});_.displayName="NextUI.Card";var xe=_;export{xe as c,he as u};
