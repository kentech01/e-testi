import{c as a,j as e,e as x,B as r}from"./index-666wo7S9.js";import{U as m,F as b,C as u,L as y}from"./user-Cc7eX9XR.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],f=a("layout-dashboard",g);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],j=a("log-out",p);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],N=a("moon",v);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],w=a("settings",k);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],M=a("sun",_),z=[{id:"dashboard",label:"Dashboard",icon:f},{id:"tests",label:"Testet",icon:b},{id:"results",label:"Rezultatet",icon:u},{id:"tips",label:"Këshilla",icon:y},{id:"settings",label:"Settings",icon:w}];function $({currentView:c,onViewChange:o,user:t,darkMode:i,onToggleDarkMode:l,onLogout:n}){return e.jsxs("div",{className:"w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col",children:[e.jsx("div",{className:"p-4 border-b border-sidebar-border",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold",children:"E"}),e.jsxs("div",{children:[e.jsx("h2",{className:"font-medium text-sidebar-foreground",children:"E-testi"}),e.jsx("p",{className:"text-xs text-sidebar-foreground/70",children:"Përgatitja për maturë"})]})]})}),e.jsx("div",{className:"p-4 border-b border-sidebar-border",children:e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center text-sidebar-primary-foreground text-sm",children:e.jsx(m,{className:"w-4 h-4"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("p",{className:"text-sm font-medium text-sidebar-foreground truncate",children:t.name}),e.jsx("div",{className:"flex items-center space-x-2",children:e.jsxs(x,{variant:"secondary",className:"text-xs",children:["Klasa ",t.grade]})})]})]})}),e.jsx("nav",{className:"flex-1 p-4 space-y-2",children:z.map(s=>{const h=s.icon,d=c===s.id;return e.jsxs(r,{variant:d?"default":"ghost",className:`w-full justify-start h-10 ${d?"bg-sidebar-primary text-sidebar-primary-foreground":"text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`,onClick:()=>o(s.id),children:[e.jsx(h,{className:"w-4 h-4 mr-3"}),s.label]},s.id)})}),e.jsxs("div",{className:"p-4 border-t border-sidebar-border space-y-2",children:[e.jsxs(r,{variant:"ghost",size:"sm",onClick:l,className:"w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",children:[i?e.jsx(M,{className:"w-4 h-4 mr-3"}):e.jsx(N,{className:"w-4 h-4 mr-3"}),i?"Light Mode":"Dark Mode"]}),e.jsxs(r,{variant:"ghost",size:"sm",onClick:n,className:"w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",children:[e.jsx(j,{className:"w-4 h-4 mr-3"}),"Dil"]})]})]})}export{$ as Navigation};
