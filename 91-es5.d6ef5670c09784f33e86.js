var __awaiter=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))((function(r,o){function a(t){try{c(i.next(t))}catch(e){o(e)}}function s(t){try{c(i.throw(t))}catch(e){o(e)}}function c(t){t.done?r(t.value):new n((function(e){e(t.value)})).then(a,s)}c((i=i.apply(t,e||[])).next())}))},__generator=this&&this.__generator||function(t,e){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(r=(r=a.trys).length>0&&r[r.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=e.call(t,a)}catch(s){o=[6,s],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}};(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{TpdJ:function(t,e,n){"use strict";n.r(e),n.d(e,"ion_tab",(function(){return o})),n.d(e,"ion_tabs",(function(){return a}));var i=n("sWJ8"),r=(n("AfW+"),n("m9yc")),o=function(){function t(t){Object(i.l)(this,t),this.loaded=!1,this.active=!1}return t.prototype.componentWillLoad=function(){},t.prototype.setActive=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){switch(t.label){case 0:return[4,this.prepareLazyLoaded()];case 1:return t.sent(),this.active=!0,[2]}}))}))},t.prototype.prepareLazyLoaded=function(){if(!this.loaded&&null!=this.component){this.loaded=!0;try{return Object(r.a)(this.delegate,this.el,this.component,["ion-page"])}catch(t){console.error(t)}}return Promise.resolve(void 0)},t.prototype.render=function(){var t=this.tab,e=this.active,n=this.component;return Object(i.i)(i.a,{role:"tabpanel","aria-hidden":e?null:"true","aria-labelledby":"tab-button-"+t,class:{"ion-page":void 0===n,"tab-hidden":!e}},Object(i.i)("slot",null))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(i.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return":host(.tab-hidden){display:none!important}"},enumerable:!0,configurable:!0}),t}(),a=function(){function t(t){var e=this;Object(i.l)(this,t),this.transitioning=!1,this.useRouter=!1,this.onTabClicked=function(t){var n=t.detail,i=n.href,r=n.tab;if(e.useRouter&&void 0!==i){var o=document.querySelector("ion-router");o&&o.push(i)}else e.select(r)},this.ionNavWillLoad=Object(i.d)(this,"ionNavWillLoad",7),this.ionTabsWillChange=Object(i.d)(this,"ionTabsWillChange",3),this.ionTabsDidChange=Object(i.d)(this,"ionTabsDidChange",3)}return t.prototype.componentWillLoad=function(){return __awaiter(this,void 0,void 0,(function(){var t;return __generator(this,(function(e){switch(e.label){case 0:return this.useRouter||(this.useRouter=!!document.querySelector("ion-router")&&!this.el.closest("[no-router]")),this.useRouter?[3,2]:(t=this.tabs,[4,this.select(t[0])]);case 1:e.sent(),e.label=2;case 2:return this.ionNavWillLoad.emit(),[2]}}))}))},t.prototype.componentWillRender=function(){var t=this.el.querySelector("ion-tab-bar");t&&(t.selectedTab=this.selectedTab?this.selectedTab.tab:void 0)},t.prototype.select=function(t){return __awaiter(this,void 0,void 0,(function(){var e,n;return __generator(this,(function(i){switch(i.label){case 0:return e=s(this.tabs,t),(n=!!this.shouldSwitch(e))?[4,this.setActive(e)]:[3,3];case 1:return i.sent(),[4,this.notifyRouter()];case 2:i.sent(),this.tabSwitch(),n=!0,i.label=3;case 3:return[2,n]}}))}))},t.prototype.getTab=function(t){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(e){return[2,s(this.tabs,t)]}))}))},t.prototype.getSelected=function(){return Promise.resolve(this.selectedTab?this.selectedTab.tab:void 0)},t.prototype.setRouteId=function(t){return __awaiter(this,void 0,void 0,(function(){var e,n,i=this;return __generator(this,(function(r){switch(r.label){case 0:return e=s(this.tabs,t),this.shouldSwitch(e)?[4,this.setActive(e)]:[3,2];case 1:return r.sent(),n={changed:!0,element:this.selectedTab,markVisible:function(){return i.tabSwitch()}},[3,3];case 2:n={changed:!1,element:this.selectedTab},r.label=3;case 3:return[2,n]}}))}))},t.prototype.getRouteId=function(){return __awaiter(this,void 0,void 0,(function(){var t;return __generator(this,(function(e){return[2,void 0!==(t=this.selectedTab&&this.selectedTab.tab)?{id:t,element:this.selectedTab}:void 0]}))}))},t.prototype.setActive=function(t){return this.transitioning?Promise.reject("transitioning already happening"):(this.transitioning=!0,this.leavingTab=this.selectedTab,this.selectedTab=t,this.ionTabsWillChange.emit({tab:t.tab}),t.setActive())},t.prototype.tabSwitch=function(){var t=this.selectedTab,e=this.leavingTab;this.leavingTab=void 0,this.transitioning=!1,t&&e!==t&&(e&&(e.active=!1),this.ionTabsDidChange.emit({tab:t.tab}))},t.prototype.notifyRouter=function(){if(this.useRouter){var t=document.querySelector("ion-router");if(t)return t.navChanged("forward")}return Promise.resolve(!1)},t.prototype.shouldSwitch=function(t){return void 0!==t&&t!==this.selectedTab&&!this.transitioning},Object.defineProperty(t.prototype,"tabs",{get:function(){return Array.from(this.el.querySelectorAll("ion-tab"))},enumerable:!0,configurable:!0}),t.prototype.render=function(){return Object(i.i)(i.a,{onIonTabButtonClick:this.onTabClicked},Object(i.i)("slot",{name:"top"}),Object(i.i)("div",{class:"tabs-inner"},Object(i.i)("slot",null)),Object(i.i)("slot",{name:"bottom"}))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(i.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return":host{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;z-index:0}.tabs-inner,:host{contain:layout size style}.tabs-inner{position:relative;-ms-flex:1;flex:1}"},enumerable:!0,configurable:!0}),t}(),s=function(t,e){var n="string"==typeof e?t.find((function(t){return t.tab===e})):e;return n||console.error('tab with id: "'+n+'" does not exist'),n}}}]);