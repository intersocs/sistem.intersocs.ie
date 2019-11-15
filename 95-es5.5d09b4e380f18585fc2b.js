var __awaiter=this&&this.__awaiter||function(t,e,o,r){return new(o||(o=Promise))((function(n,i){function a(t){try{c(r.next(t))}catch(e){i(e)}}function s(t){try{c(r.throw(t))}catch(e){i(e)}}function c(t){t.done?n(t.value):new o((function(e){e(t.value)})).then(a,s)}c((r=r.apply(t,e||[])).next())}))},__generator=this&&this.__generator||function(t,e){var o,r,n,i,a={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(o)throw new TypeError("Generator is already executing.");for(;a;)try{if(o=1,r&&(n=2&i[0]?r.return:i[0]?r.throw||((n=r.return)&&n.call(r),0):r.next)&&!(n=n.call(r,i[1])).done)return n;switch(r=0,n&&(i=[2&i[0],n.value]),i[0]){case 0:case 1:n=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(n=(n=a.trys).length>0&&n[n.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!n||i[1]>n[0]&&i[1]<n[3])){a.label=i[1];break}if(6===i[0]&&a.label<n[1]){a.label=n[1],n=i;break}if(n&&a.label<n[2]){a.label=n[2],a.ops.push(i);break}n[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(s){i=[6,s],r=0}finally{o=n=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{XGfm:function(t,e,o){"use strict";o.r(e),o.d(e,"ion_toast",(function(){return p}));var r=o("sWJ8"),n=(o("AfW+"),o("HWnG"),o("Elhb")),i=o("hiP7"),a=o("Dl6n"),s=o("YtD4"),c=function(t,e){var o=Object(n.a)(),r=Object(n.a)(),i=t.host||t,a=t.querySelector(".toast-wrapper");switch(r.addElement(a),e){case"top":r.fromTo("transform","translateY(-100%)","translateY(calc(10px + var(--ion-safe-area-top, 0px)))");break;case"middle":var s=Math.floor(i.clientHeight/2-a.clientHeight/2);a.style.top=s+"px",r.fromTo("opacity",.01,1);break;default:r.fromTo("transform","translateY(100%)","translateY(calc(-10px - var(--ion-safe-area-bottom, 0px)))")}return o.addElement(i).easing("cubic-bezier(.155,1.105,.295,1.12)").duration(400).addAnimation(r)},l=function(t,e){var o=Object(n.a)(),r=Object(n.a)(),i=t.host||t,a=t.querySelector(".toast-wrapper");switch(r.addElement(a),e){case"top":r.fromTo("transform","translateY(calc(10px + var(--ion-safe-area-top, 0px)))","translateY(-100%)");break;case"middle":r.fromTo("opacity",.99,0);break;default:r.fromTo("transform","translateY(calc(-10px - var(--ion-safe-area-bottom, 0px)))","translateY(100%)")}return o.addElement(i).easing("cubic-bezier(.36,.66,.04,1)").duration(300).addAnimation(r)},d=function(t,e){var o=Object(n.a)(),r=Object(n.a)(),i=t.host||t,a=t.querySelector(".toast-wrapper");switch(r.addElement(a),e){case"top":a.style.top="calc(8px + var(--ion-safe-area-top, 0px))",r.fromTo("opacity",.01,1);break;case"middle":var s=Math.floor(i.clientHeight/2-a.clientHeight/2);a.style.top=s+"px",r.fromTo("opacity",.01,1);break;default:a.style.bottom="calc(8px + var(--ion-safe-area-bottom, 0px))",r.fromTo("opacity",.01,1)}return o.addElement(i).easing("cubic-bezier(.36,.66,.04,1)").duration(400).addAnimation(r)},u=function(t){var e=Object(n.a)(),o=Object(n.a)(),r=t.host||t,i=t.querySelector(".toast-wrapper");return o.addElement(i).fromTo("opacity",.99,0),e.addElement(r).easing("cubic-bezier(.36,.66,.04,1)").duration(300).addAnimation(o)},p=function(){function t(t){Object(r.l)(this,t),this.presented=!1,this.mode=Object(r.e)(this),this.duration=0,this.keyboardClose=!1,this.position="bottom",this.showCloseButton=!1,this.translucent=!1,this.animated=!0,Object(i.e)(this.el),this.didPresent=Object(r.d)(this,"ionToastDidPresent",7),this.willPresent=Object(r.d)(this,"ionToastWillPresent",7),this.willDismiss=Object(r.d)(this,"ionToastWillDismiss",7),this.didDismiss=Object(r.d)(this,"ionToastDidDismiss",7)}return t.prototype.present=function(){return __awaiter(this,void 0,void 0,(function(){var t=this;return __generator(this,(function(e){switch(e.label){case 0:return[4,Object(i.f)(this,"toastEnter",c,d,this.position)];case 1:return e.sent(),this.duration>0&&(this.durationTimeout=setTimeout((function(){return t.dismiss(void 0,"timeout")}),this.duration)),[2]}}))}))},t.prototype.dismiss=function(t,e){return this.durationTimeout&&clearTimeout(this.durationTimeout),Object(i.g)(this,t,e,"toastLeave",l,u,this.position)},t.prototype.onDidDismiss=function(){return Object(i.h)(this.el,"ionToastDidDismiss")},t.prototype.onWillDismiss=function(){return Object(i.h)(this.el,"ionToastWillDismiss")},t.prototype.getButtons=function(){var t=this,e=this.buttons?this.buttons.map((function(t){return"string"==typeof t?{text:t}:t})):[];return this.showCloseButton&&e.push({text:this.closeButtonText||"Close",handler:function(){return t.dismiss(void 0,"cancel")}}),e},t.prototype.buttonClick=function(t){return __awaiter(this,void 0,void 0,(function(){var e,o;return __generator(this,(function(r){switch(r.label){case 0:return e=t.role,Object(i.j)(e)?(o=this.dismiss(void 0,e),[3,3]):[3,1];case 1:return[4,this.callButtonHandler(t)];case 2:o=r.sent()?this.dismiss(void 0,t.role):Promise.resolve(),r.label=3;case 3:return[2,o]}}))}))},t.prototype.callButtonHandler=function(t){return __awaiter(this,void 0,void 0,(function(){var e,o;return __generator(this,(function(r){switch(r.label){case 0:if(!t||!t.handler)return[3,4];r.label=1;case 1:return r.trys.push([1,3,,4]),e=!1,[4,Object(i.p)(t.handler)];case 2:return e===r.sent()?[2,!1]:[3,4];case 3:return o=r.sent(),console.error(o),[3,4];case 4:return[2,!0]}}))}))},t.prototype.renderButtons=function(t,e){var o,n=this;if(0!==t.length){var i=Object(r.e)(this),a=((o={"toast-button-group":!0})["toast-button-group-"+e]=!0,o);return Object(r.i)("div",{class:a},t.map((function(t){return Object(r.i)("button",{type:"button",class:b(t),tabIndex:0,onClick:function(){return n.buttonClick(t)}},Object(r.i)("div",{class:"toast-button-inner"},t.icon&&Object(r.i)("ion-icon",{icon:t.icon,slot:void 0===t.text?"icon-only":void 0,class:"toast-icon"}),t.text),"md"===i&&Object(r.i)("ion-ripple-effect",{type:void 0!==t.icon&&void 0===t.text?"unbounded":"bounded"}))})))}},t.prototype.render=function(){var t,e,o=this.getButtons(),n=o.filter((function(t){return"start"===t.side})),i=o.filter((function(t){return"start"!==t.side})),c=Object(r.e)(this),l=((t={"toast-wrapper":!0})["toast-"+this.position]=!0,t);return Object(r.i)(r.a,{style:{zIndex:""+(6e4+this.overlayIndex)},class:Object.assign(Object.assign(Object.assign((e={},e[c]=!0,e),Object(a.a)(this.color)),Object(a.b)(this.cssClass)),{"toast-translucent":this.translucent})},Object(r.i)("div",{class:l},Object(r.i)("div",{class:"toast-container"},this.renderButtons(n,"start"),Object(r.i)("div",{class:"toast-content"},void 0!==this.header&&Object(r.i)("div",{class:"toast-header"},this.header),void 0!==this.message&&Object(r.i)("div",{class:"toast-message",innerHTML:Object(s.a)(this.message)})),this.renderButtons(i,"end"))))},Object.defineProperty(t.prototype,"el",{get:function(){return Object(r.f)(this)},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return":host{--border-width:0;--border-style:none;--border-color:initial;--box-shadow:none;--min-width:auto;--width:auto;--min-height:auto;--height:auto;--max-height:auto;left:0;top:0;display:block;position:absolute;width:100%;height:100%;color:var(--color);font-family:var(--ion-font-family,inherit);contain:strict;z-index:1001;pointer-events:none}:host-context([dir=rtl]){left:unset;right:unset;right:0}:host(.overlay-hidden){display:none}:host(.ion-color){--button-color:inherit;color:var(--ion-color-contrast)}:host(.ion-color) .toast-wrapper{background:var(--ion-color-base)}.toast-wrapper{border-radius:var(--border-radius);left:var(--start);right:var(--end);width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);background:var(--background);-webkit-box-shadow:var(--box-shadow);box-shadow:var(--box-shadow)}:host-context([dir=rtl]) .toast-wrapper,[dir=rtl] .toast-wrapper{left:unset;right:unset;left:var(--end);right:var(--start)}.toast-container{-ms-flex-align:center;align-items:center;pointer-events:auto;contain:content}.toast-container,.toast-content{display:-ms-flexbox;display:flex}.toast-content{-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.toast-message{-ms-flex:1;flex:1;white-space:pre-wrap}.toast-button-group{display:-ms-flexbox;display:flex}.toast-button{outline:none;color:var(--button-color);z-index:0}.toast-icon{font-size:1.4em}.toast-button-inner{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}@media (any-hover:hover){.toast-button:hover{cursor:pointer}}:host{--background:var(--ion-color-step-50,#f2f2f2);--border-radius:14px;--button-color:var(--ion-color-primary,#3880ff);--color:var(--ion-color-step-850,#262626);--max-width:700px;--start:10px;--end:10px;font-size:14px}.toast-wrapper{margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;display:block;position:absolute;z-index:10}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-wrapper{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}@supports ((-webkit-backdrop-filter:blur(0)) or (backdrop-filter:blur(0))){:host(.toast-translucent) .toast-wrapper{background:rgba(var(--ion-background-color-rgb,255,255,255),.8);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}}.toast-wrapper.toast-top{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);top:0}.toast-wrapper.toast-middle{opacity:.01}.toast-wrapper.toast-bottom{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);bottom:0}.toast-content{padding-left:15px;padding-right:15px;padding-top:15px;padding-bottom:15px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-content{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-header{margin-bottom:2px;font-weight:500}.toast-button{padding-left:15px;padding-right:15px;padding-top:10px;padding-bottom:10px;height:44px;-webkit-transition:background-color,opacity .1s linear;transition:background-color,opacity .1s linear;border:0;background-color:transparent;font-family:var(--ion-font-family);font-size:17px;font-weight:500;overflow:hidden}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.toast-button{padding-left:unset;padding-right:unset;-webkit-padding-start:15px;padding-inline-start:15px;-webkit-padding-end:15px;padding-inline-end:15px}}.toast-button.activated{opacity:.4}@media (any-hover:hover){.toast-button:hover{opacity:.6}}"},enumerable:!0,configurable:!0}),t}(),b=function(t){var e;return Object.assign(((e={"toast-button":!0,"toast-button-icon-only":void 0!==t.icon&&void 0===t.text})["toast-button-"+t.role]=void 0!==t.role,e["ion-focusable"]=!0,e["ion-activatable"]=!0,e),Object(a.b)(t.cssClass))}}}]);