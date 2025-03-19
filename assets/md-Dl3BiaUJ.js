import{b as r,o as i,w as l,g as e,ac as t,v as c,x as u,C as n}from"./modules/vue-DZveH3c9.js";import{I as h}from"./slidev/default-Bu4cU-eN.js";import{u as d,f as m}from"./slidev/context-Bk4cSnxM.js";import"./index-DHhLvl0H.js";import"./modules/shiki-BNvmXfxE.js";const x={__name:"slides.md__slidev_33",setup(p){const{$clicksContext:o,$frontmatter:s}=d();return o.setup(),(f,a)=>(i(),r(h,c(u(n(m)(n(s),32))),{default:l(()=>a[0]||(a[0]=[e("h1",null,"Lift data fetching higher up",-1),e("blockquote",null,[e("p",null,[t('Today, often Angular components are "in charge" of data fetching operations. Requests are frequently made as late as possible, only initiated when the UI (via the async pipe) requests data via a subscription to an Observable or other source. '),e("br"),t(" (…) "),e("br"),t(" With resources, we intend to explore architectural "),e("strong",null,"solutions where data fetching can be lifted outside of components"),t(" and managed by the framework itself, whether at the level of routes or through some other mechanism. We see this as having some attractive benefits:")]),e("ul",null,[e("li",null,"A higher-level mechanism can understand data needs from an entire component tree and fetch all the data at once / in parallel, avoiding waterfalls."),e("li",null,"Reasoning about the state in an application becomes easier when UI components do not concern themselves with data fetching and focus on data derivation instead."),e("li",null,"Testing gets easier as UI component tests can focus on the display logic.")])],-1),e("p",null,[e("small",null,[t("Source: "),e("a",{href:"https://github.com/angular/angular/discussions/60120",target:"_blank"},"Angular Resource RFC 1: Architecture")])],-1)])),_:1},16))}};export{x as default};
