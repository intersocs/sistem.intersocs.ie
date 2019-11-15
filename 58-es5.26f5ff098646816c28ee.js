var __awaiter=this&&this.__awaiter||function(t,i,e,n){return new(e||(e=Promise))((function(o,a){function r(t){try{d(n.next(t))}catch(i){a(i)}}function s(t){try{d(n.throw(t))}catch(i){a(i)}}function d(t){t.done?o(t.value):new e((function(i){i(t.value)})).then(r,s)}d((n=n.apply(t,i||[])).next())}))},__generator=this&&this.__generator||function(t,i){var e,n,o,a,r={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;r;)try{if(e=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return r.label++,{value:a[1],done:!1};case 5:r.label++,n=a[1],a=[0];continue;case 7:a=r.ops.pop(),r.trys.pop();continue;default:if(!(o=(o=r.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){r=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){r.label=a[1];break}if(6===a[0]&&r.label<o[1]){r.label=o[1],o=a;break}if(o&&r.label<o[2]){r.label=o[2],r.ops.push(a);break}o[2]&&r.ops.pop(),r.trys.pop();continue}a=i.call(t,r)}catch(s){a=[6,s],n=0}finally{e=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}};(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{N3W9:function(t,i,e){"use strict";e.r(i),e.d(i,"ion_loading",(function(){return h}));var n=e("sWJ8"),o=e("AfW+"),a=(e("HWnG"),e("Elhb")),r=e("hiP7"),s=e("Dl6n"),d=e("YtD4"),c=function(t){var i=Object(a.a)(),e=Object(a.a)(),n=Object(a.a)();return e.addElement(t.querySelector("ion-backdrop")).fromTo("opacity",.01,.3),n.addElement(t.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),i.addElement(t).easing("ease-in-out").duration(200).addAnimation([e,n])},l=function(t){var i=Object(a.a)(),e=Object(a.a)(),n=Object(a.a)();return e.addElement(t.querySelector("ion-backdrop")).fromTo("opacity",.3,0),n.addElement(t.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),i.addElement(t).easing("ease-in-out").duration(200).addAnimation([e,n])},p=function(t){var i=Object(a.a)(),e=Object(a.a)(),n=Object(a.a)();return e.addElement(t.querySelector("ion-backdrop")).fromTo("opacity",.01,.32),n.addElement(t.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.01,transform:"scale(1.1)"},{offset:1,opacity:1,transform:"scale(1)"}]),i.addElement(t).easing("ease-in-out").duration(200).addAnimation([e,n])},u=function(t){var i=Object(a.a)(),e=Object(a.a)(),n=Object(a.a)();return e.addElement(t.querySelector("ion-backdrop")).fromTo("opacity",.32,0),n.addElement(t.querySelector(".loading-wrapper")).keyframes([{offset:0,opacity:.99,transform:"scale(1)"},{offset:1,opacity:0,transform:"scale(0.9)"}]),i.addElement(t).easing("ease-in-out").duration(200).addAnimation([e,n])},h=function(){function t(t){var i=this;Object(n.l)(this,t),this.presented=!1,this.mode=Object(n.e)(this),this.keyboardClose=!0,this.duration=0,this.backdropDismiss=!1,this.showBackdrop=!0,this.translucent=!1,this.animated=!0,this.onBackdropTap=function(){i.dismiss(void 0,r.a)},Object(r.e)(this.el),this.didPresent=Object(n.d)(this,"ionLoadingDidPresent",7),this.willPresent=Object(n.d)(this,"ionLoadingWillPresent",7),this.willDismiss=Object(n.d)(this,"ionLoadingWillDismiss",7),this.didDismiss=Object(n.d)(this,"ionLoadingDidDismiss",7)}return t.prototype.componentWillLoad=function(){if(void 0===this.spinner){var t=Object(n.e)(this);this.spinner=o.b.get("loadingSpinner",o.b.get("spinner","ios"===t?"lines":"crescent"))}},t.prototype.present=function(){return __awaiter(this,void 0,void 0,(function(){var t=this;return __generator(this,(function(i){switch(i.label){case 0:return[4,Object(r.f)(this,"loadingEnter",c,p,void 0)];case 1:return i.sent(),this.duration>0&&(this.durationTimeout=setTimeout((function(){return t.dismiss()}),this.duration+10)),[2]}}))}))},t.prototype.dismiss=function(t,i){return this.durationTimeout&&clearTimeout(this.durationTimeout),Object(r.g)(this,t,i,"loadingLeave",l,u)},t.prototype.onDidDismiss=function(){return Object(r.h)(this.el,"ionLoadingDidDismiss")},t.prototype.onWillDismiss=function(){return Object(r.h)(this.el,"ionLoadingWillDismiss")},t.prototype.render=function(){var t,i=this.message,e=this.spinner,o=Object(n.e)(this);return Object(n.i)(n.a,{onIonBackdropTap:this.onBackdropTap,style:{zIndex:""+(4e4+this.overlayIndex)},class:Object.assign(Object.assign({},Object(s.b)(this.cssClass)),(t={},t[o]=!0,t["loading-translucent"]=this.translucent,t))},Object(n.i)("ion-backdrop",{visible:this.showBackdrop,tappable:this.backdropDismiss}),Object(n.i)("div",{class:"loading-wrapper",role:"dialog"},e&&Object(n.i)("div",{class:"loading-spinner"},Object(n.i)("ion-spinner",{name:e})),i&&Object(n.i)("div",{class:"loading-content",innerHTML:Object(d.a)(i)})))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(n.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".sc-ion-loading-md-h{--min-width:auto;--width:auto;--min-height:auto;--height:auto;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-family:var(--ion-font-family,inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-ion-loading-md-h{display:none}.loading-wrapper.sc-ion-loading-md{display:-ms-flexbox;display:flex;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);opacity:0;z-index:10}.spinner-bubbles.sc-ion-loading-md, .spinner-circles.sc-ion-loading-md, .spinner-crescent.sc-ion-loading-md, .spinner-dots.sc-ion-loading-md, .spinner-lines.sc-ion-loading-md, .spinner-lines-small.sc-ion-loading-md{color:var(--spinner-color)}.sc-ion-loading-md-h{--background:var(--ion-color-step-50,#f2f2f2);--max-width:280px;--max-height:90%;--spinner-color:var(--ion-color-primary,#3880ff);color:var(--ion-color-step-850,#262626);font-size:14px}.loading-wrapper.sc-ion-loading-md{border-radius:2px;padding-left:24px;padding-right:24px;padding-top:24px;padding-bottom:24px;-webkit-box-shadow:0 16px 20px rgba(0,0,0,.4);box-shadow:0 16px 20px rgba(0,0,0,.4)}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.loading-wrapper.sc-ion-loading-md{padding-left:unset;padding-right:unset;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:24px;padding-inline-end:24px}}.loading-spinner.sc-ion-loading-md + .loading-content.sc-ion-loading-md{margin-left:16px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.loading-spinner.sc-ion-loading-md + .loading-content.sc-ion-loading-md{margin-left:unset;-webkit-margin-start:16px;margin-inline-start:16px}}"},enumerable:!0,configurable:!0}),t}()}}]);