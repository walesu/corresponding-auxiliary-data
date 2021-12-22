/*! nice Validator 0.6.3
 * (c) 2012-2013 Jony Zhang <zj86@live.cn>, MIT Licensed
 * http://niceue.com/validator/
 */
!function(e,t){"use strict";function i(s,a){var l,u,o=this;return!o instanceof i?new i(s,a):(q(a)&&(a={valid:a}),a=a||{},u=P(s,"data-"+p+"-option"),u=u&&"{"===u.charAt(0)?Function("return "+u)():{},l=B[a.theme||u.theme||H.theme],o.options=e.extend({},H,l,u,a),o.$el=e(s),o.rules=new r(o.options.rules,!0),o.messages=new n(o.options.messages,!0),o.elements={},o.fields={},o.deferred={},o.errors={},o._init(),t)}function r(e,t){var i=t?t===!0?this:t:r.prototype;if(L(e))for(var n in e)i[n]=s(e[n])}function n(e,t){var i=t?t===!0?this:t:n.prototype;if(L(e))for(var r in e){if(!e[r])return;i[r]=e[r]}}function s(t){switch(e.type(t)){case"function":return t;case"array":return function(e){return t[0].test(e.value)||t[1]||!1};case"regexp":return function(e){return t.test(e.value)}}}function a(t){var i="";return e.map(t.split(" "),function(e){i+=","+("#"===e.charAt(0)?e:'[name="'+e+'"]')}),i.substring(1)}function l(t){var i;if(t&&t.tagName){switch(t.tagName){case"INPUT":case"SELECT":case"TEXTAREA":case"BUTTON":case"FIELDSET":i=t.form||e(t).closest(".n-"+p);break;case"FORM":i=t;break;default:i=e(t).closest(".n-"+p)}return e(i).data(p)||e(i)[p]().data(p)}}function u(t,i){if(t.form&&null===P(t.form,A)){var r=l(t);r?(r._parse(t),e(t).trigger(i)):P(t,M,null)}}function o(i,r){var n=e.trim(P(i,M+"-"+r));if(n)return n=Function("return "+n)(),n?s(n):t}function c(e,t,i){var r=t.msg;return L(r)&&i&&(r=r[i]),I(r)||(r=P(e,"data-msg-"+i)||P(e,"data-msg")||""),r}function d(e){var t;return e&&(t=F.exec(e)),t?t[1]:""}function f(e){return"INPUT"===e.tagName&&"checkbox"===e.type||"radio"===e.type}function g(e){return Date.parse(e.replace(/\.|\-/g,"/"))}var p="validator",h="n-ok",m="n-error",v="n-tip",y="n-loading",b="n-valid",k="n-invalid",_="msg-box",w="aria-invalid",M="data-rule",O="data-target",x="data-tip",$="data-inputstatus",A="novalidate",T=":verifiable",V=/(\w+)(?:\[(.*)\]$|\((.*)\)$)?/,S=/(?:([^:;\(\[]*):)?(.*)/,C=/[^\x00-\xff]/g,F=/^.*(top|right|bottom|left).*$/,R=/(?:(post|get):)?(.+)/i,N=/<|>/g,E=e.noop,j=e.proxy,q=e.isFunction,D=e.isArray,I=function(e){return"string"==typeof e},L=function(e){return e&&"[object Object]"===Object.prototype.toString.call(e)},W=!window.XMLHttpRequest,P=function(e,i,r){return r===t?e.getAttribute(i):(null===r?e.removeAttribute(i):e.setAttribute(i,""+r),t)},U=window.console||{log:E},H={debug:0,timely:1,theme:"default",stopOnError:!1,ignore:"",msgWrapper:"span",msgMaker:function(e){var t,i={error:m,ok:h,tip:v,loading:y}[e.type];return t='<span class="msg-wrap '+i+'" role="alert">',t+=(e.arrow||"")+(e.icon||"")+'<span class="n-msg">'+e.msg+"</span>",t+="</span>"},msgIcon:'<span class="n-icon"></span>',msgArrow:"",msgClass:"",defaultMsg:"{0} is not valid.",loadingMsg:"Validating..."},B={"default":{formClass:"n-default",msgClass:"n-right",showOk:""}};e.fn[p]=function(t){var r=this,n=arguments;return r.is(":input")?r:(!r.is("form")&&(r=this.find("form")),!r.length&&(r=this),r.each(function(){if(I(t)){if("_"===t.charAt(0))return;var r=e(this).data(p);r&&r[t].apply(r,Array.prototype.slice.call(n,1))}else new i(this,t)}),this)},e.fn.isValid=function(e,i){var r,n,s=l(this[0]);return s?(i===t&&(i=!0),s.checkOnly=i,r=this.is(":input")?this:this.find(T),n=s._multiValidate(r,function(t){q(e)&&e.call(null,t),s.checkOnly=!1},!0),q(e)?this:n):!0},e.expr[":"].verifiable=function(e){var t=e.nodeName.toLowerCase();return("input"===t&&"submit"!==e.type&&"button"!==e.type&&"reset"!==e.type||"select"===t||"textarea"===t)&&e.disabled===!1&&null===P(e,A)},i.prototype={_init:function(){var t=this,i=t.options,r=t.fields,n=t.$el[0];if(D(i.groups)&&e.map(i.groups,function(i){if(!I(i.fields)||!q(i.callback))return null;var n=t.$el.find(a(i.fields)),s=function(){return i.callback.call(t,n)};e.extend(s,i),e.map(i.fields.split(" "),function(e){r[e]=r[e]||{},r[e].group=s})}),L(i.fields)&&e.each(i.fields,function(e,t){t&&(r[e]=I(t)?{rule:t}:t)}),t.$el.find(T).each(function(){t._parse(this)}),t.msgOpt={type:"error",pos:d(i.msgClass),wrapper:i.msgWrapper,cls:i.msgClass,style:i.msgStyle,icon:i.msgIcon,arrow:i.msgArrow,show:i.msgShow,hide:i.msgHide},i.valid||null===P(n,"action"))t.isAjaxSubmit=!0;else{var s=e[e._data?"_data":"data"](n,"events");t.isAjaxSubmit=s&&s.valid&&e.map(s.valid,function(e){return-1!==e.namespace.indexOf("form")?1:null}).length?!0:!1}t.$el.data(p)||(t.$el.on("submit."+p+" validate."+p,j(t,"_submit")).on("reset."+p,j(t,"_reset")).on("showtip."+p,j(t,"_showTip")).on("validated.field."+p,T,j(t,"_validatedField")).on("validated.rule."+p,T,j(t,"_validatedRule")).on("focusin."+p+" click."+p+" showtip."+p,T,j(t,"_focus")).on("focusout."+p+" validate."+p,T,j(t,"_blur")).on("click."+p,"input:radio,input:checkbox",j(t,"_click")),i.timely>=2&&t.$el.on("keyup."+p+" paste."+p,T,j(t,"_blur")).on("change."+p,"select",j(t,"_click")),t.$el.data(p,t).addClass("n-"+p+" "+i.formClass),t.NOVALIDATE=P(n,A),P(n,A,A))},_multiValidate:function(i,r,n){var s=this,a=s.options;return s.isValid=!0,s.deferred={},a.ignore&&(i=i.not(a.ignore)),i.each(function(e,i){var r=s.getField(i);if(r)return s._validate(i,r,n),!s.isValid&&a.stopOnError?!1:t}),e.when.apply(null,e.map(s.deferred,function(e){return e})).done(function(){r.call(s,s.isValid)}),e.isEmptyObject(s.deferred)?s.isValid:t},_submit:function(i,r){var n,s=this,a=s.options,l=i.target;if(P(l,"novalidateonce"))return P(l,"novalidateonce",null),t;if("only"!==r&&("validate"!==i.type||s.$el[0]===l)){if(s.submiting)return q(s.submiting)&&s.submiting.call(s),i.preventDefault(),t;if(q(a.beforeSubmit)&&a.beforeSubmit.call(s,l)===!1)return s.isAjaxSubmit&&i.preventDefault(),t;s._reset(),s.submiting=!0,a.debug&&U.log("\n%c########## "+i.type+" form ##########","color:blue"),n=s._multiValidate(s.$el.find(T),function(t){var i,r="focus.field",n=t||2===a.debug?"valid":"invalid";if(!t){var u=s.$el.find(":input."+k+":first");u.trigger(r),W&&u.trigger(r),i=e.map(s.errors,function(e){return e})}s.submiting=!1,q(a[n])&&a[n].call(s,l,i),s.$el.trigger(n+".form",[l,i]),t&&!s.isAjaxSubmit&&e(l).trigger("submit",["only"])}),(!n||s.isAjaxSubmit)&&i.preventDefault()}},_reset:function(t){var i=this;i.errors={},t&&i.$el.find(":verifiable").each(function(t,r){i.hideMsg(r),P(r,$,null),P(r,w,null),e(r).removeClass(b+" "+k)})},_focus:function(e){var t,i=e.target;if("showtip"!==e.type){if(e.isTrigger||this.submiting)return;if(""!==i.value&&("false"===P(i,w)||"tip"===P(i,$)))return}t=P(i,x),t&&this.showMsg(i,{msg:t,type:"tip"})},_blur:function(t,i){var r,n,s=this,a=s.options,l=t.target,u=t.type,o=150;if(!i&&"paste"!==u){if("validate"===u)n=!0,o=0;else{if(P(l,"notimely"))return;if(a.timely>=2&&"keyup"!==u)return}if(a.ignore&&e(l).is(a.ignore))return;if("keyup"===u){var c=t.keyCode,d={8:1,9:1,16:1,32:1,46:1};if(9===c&&!l.value)return;if(48>c&&!d[c])return;o=a.timely>=100?a.timely:500}}r=s.getField(l),r&&(o?(r.timeout&&clearTimeout(r.timeout),r.timeout=setTimeout(function(){s.submiting||s._validate(l,r,n)},o)):s._validate(l,r,n))},_click:function(e){this._blur(e,!0)},_showTip:function(e){var t=this;t.$el[0]===e.target&&t.$el.find(":verifiable["+x+"]").each(function(){t.showMsg(this,{msg:P(this,x),type:"tip"})})},_parse:function(e){var t,i=this,r=e.name,n=P(e,M);n&&P(e,M,null),(e.id&&"#"+e.id in i.fields||!e.name)&&(r="#"+e.id),r&&(t=i.fields[r]||{},t.rule=t.rule||n||"",t.rule&&(t.key=r,t.required=-1!==t.rule.indexOf("required"),t.must=t.must||!!t.rule.match(/match|checked/),t.required&&P(e,"aria-required",!0),("timely"in t&&!t.timely||!i.options.timely)&&P(e,"notimely",!0),I(t.target)&&P(e,O,t.target),I(t.tip)&&P(e,x,t.tip),i.fields[r]=i._parseRule(t)))},_parseRule:function(i){var r,n=S.exec(i.rule);if(n)return i.display=n[1],i.rules=[],r=(n[2]||"").split(";"),e.map(r,function(r){var n=V.exec(r);return n?(n[3]&&(n[2]=n[3]),i.rules.push({method:n[1],params:n[2]?e.trim(n[2]).split(", "):t}),t):null}),i.vid=0,i.rid=i.rules[0].method,i},_validatedField:function(t,i,r){var n=this,s=n.options,a=t.target,l=r.isValid=i.isValid=!!r.isValid,u=l?"valid":"invalid";r.key=i.key,r.rule=i.rid,l?r.type="ok":(n.submiting&&(n.errors[i.key]=r.msg),n.isValid=!1),i.old.ret=r,i.old.value=a.value,n.elements[i.key]=a,n.checkOnly||(q(i[u])&&i[u].call(n,a,r),e(a).attr(w,!l).addClass(l?b:k).removeClass(l?k:b).trigger(u+".field",[r,n]),(i.msgMaker||s.msgMaker)&&(!r.showOk&&r.msg||r.showOk&&s.showOk!==!1?n.showMsg(a,r,i):n.hideMsg(a,r,i)))},_validatedRule:function(i,r,n,s){var a,l=this,u=l.options,o=i.target,d="",f=!1,g=!1;if(s=s||{},r=r||l.getField(o),a=r.rid,n===!0||n===t?f=!0:(d=c(o,r,a),d||(I(n)?(d=n,n={error:d}):L(n)&&(n.error?d=n.error:(f=!0,n.ok&&I(n.ok)&&(g=!0),d=n.ok))),s.msg=(f?d:d||l.messages[a]||H.defaultMsg).replace("{0}",r.display||"")),f){if(s.isValid=!0,!g){var p=r.ok||P(o,"data-ok");p?(g=!0,s.msg=p):I(u.showOk)&&(g=!0,s.msg=u.showOk)}s.showOk=g,e(o).trigger("valid.rule",[a,s.msg])}else e(o).trigger("invalid.rule",[a,s.msg]);u.debug&&U.log("   %c"+r.vid+": "+a+" => "+(s.msg||!0),f?"color:green":"color:red"),f&&r.vid<r.rules.length-1?(r.vid++,l._checkRule(o,r)):(r.vid=0,e(o).trigger("validated.field",[r,s]))},_checkRule:function(i,r){var n,s=this,a=r.key,l=r.rules[r.vid],u=l.method,c=l.params;if(!s.submiting||!s.deferred[a])if(r.rid=u,n=(o(i,u)||s.rules[u]||function(){return!0}).call(s,i,c,r),L(n)&&q(n.then)){var d=function(e){return I(e)||L(e)&&("error"in e||"ok"in e)?e:t};s.deferred[a]=n,!s.checkOnly&&s.showMsg(i,{type:"loading",msg:s.options.loadingMsg},r),n.then(function(n,a,l){var u,o=l.responseText,c=r.dataFilter||s.options.dataFilter;"json"===this.dataType?o=n:"{"===o.charAt(0)&&(o=e.parseJSON(o)||{}),q(c)?o=c(o):""===o?o=!0:(u=d(o),u===t&&(u=d(o.data)),o=u||!0),e(i).trigger("validated.rule",[r,o])},function(t,n){e(i).trigger("validated.rule",[r,n])}),r.isValid=t}else null===n?e(i).trigger("validated.field",[r,{isValid:!0}]):e(i).trigger("validated.rule",[r,n])},_validate:function(i,r,n){if(!i.disabled&&null===P(i,A)){r.rules||this._parse(i);var s,a,l=this,u=l.options,o=e(i),c={},d=r.group,g=r.isValid=!0;if(s=r.old=r.old||{},n=n||r.must,d&&(e.extend(c,d),a=d.call(l),a!==!0?(I(a)&&(a={error:a}),r.vid=0,r.rid="group",g=!1):(a=t,l.hideMsg(i,c,r))),!g||r.required||r.must||""!==i.value){if(!n&&s&&s.ret!==t&&s.value===i.value&&""!==i.value)return o.trigger("validated.field",[r,s.ret]),t}else{if("tip"===P(i,$))return;if(l._focus({target:i}),!f(i))return o.trigger("validated.field",[r,{isValid:!0}]),t}u.debug&&U.log("%c"+r.key,"background:#eee"),a!==t?o.trigger("validated.rule",[r,a,c]):r.rule&&l._checkRule(i,r)}},_getMsgOpt:function(t){return e.extend({},this.msgOpt,I(t)?{msg:t}:t)},getField:function(e){var t,i=this;return t=e.id&&"#"+e.id in i.fields||!e.name?"#"+e.id:e.name,P(e,M)&&i._parse(e),i.fields[t]},test:function(i,r){var n,s,a,l=this,u=V.exec(r);return u?(u[3]&&(u[2]=u[3]),s=u[1],a=u[2]?e.trim(u[2]).split(", "):t,s in l.rules&&(n=l.rules[s].call(l,i,a)),n===!0||n===t||!1):!0},getRangeMsg:function(e,t,i,r){if(t){var n=this,s=n.messages[i]||"",a=t[0].split("~"),l=a[0],u=a[1],o="rg",c=[""],d=+e===+e;if(2===a.length){if(l&&u){if(d&&e>=+l&&+u>=e)return!0;c=c.concat(a)}else if(l&&!u){if(d&&e>=+l)return!0;c.push(l),o="gt"}else if(!l&&u){if(d&&+u>=e)return!0;c.push(u),o="lt"}}else{if(e===+l)return!0;c.push(l),o="eq"}return s&&(r&&s[o+r]&&(o+=r),c[0]=s[o]),n.renderMsg.apply(null,c)}},renderMsg:function(){var e=arguments,t=e[0],i=e.length;if(t){for(;--i;)t=t.replace("{"+i+"}",e[i]);return t}},_getMsgDOM:function(t,i){var r,n,s,a=e(t);if(a.is(":input")?(s=i.target||P(t,O),s&&(s=this.$el.find(s),s.length&&(s.is(":input")?t=s.get(0):r=s)),r||(n=!f(t)&&t.id?t.id:t.name,r=this.$el.find(i.wrapper+"."+_+'[for="'+n+'"]'))):r=a,!r.length)if(a=this.$el.find(s||t),r=e("<"+i.wrapper+">").attr({"class":_+(i.cls?" "+i.cls:""),style:i.style||"","for":n}),f(t)){var l=a.parent();r.appendTo(l.is("label")?l.parent():l)}else r[i.pos&&"right"!==i.pos?"insertBefore":"insertAfter"](a);return r},showMsg:function(t,i,r){if(i=this._getMsgOpt(i),i.msg||i.showOk){t=e(t).get(0),e(t).is(":verifiable")&&(P(t,$,i.type),r=r||this.getField(t),r&&(r.msgStyle&&(i.style=r.msgStyle),r.msgClass&&(i.cls=r.msgClass),r.msgWrapper&&(i.wrapper=r.msgWrapper)));var n=this._getMsgDOM(t,i),s=n[0].className;!F.test(s)&&n.addClass(i.cls),W&&"bottom"===i.pos&&(n[0].style.marginTop=e(t).outerHeight()+"px"),n.html(((r||{}).msgMaker||this.options.msgMaker).call(this,i)),n[0].style.display="",q(i.show)&&i.show.call(this,n,i.type)}},hideMsg:function(t,i,r){t=e(t).get(0),i=this._getMsgOpt(i),e(t).is(":verifiable")&&(r=r||this.getField(t),r&&r.msgWrapper&&(i.wrapper=r.msgWrapper));var n=this._getMsgDOM(t,i);n.length&&(q(i.hide)?i.hide.call(this,n,i.type):n[0].style.display="none")},mapMsg:function(t){var i=this;e.each(t,function(e,t){var r=i.elements[e]||i.$el.find(':input[name="'+e+'"]')[0];i.showMsg(r,t)})},setMsg:function(e){new n(e,this.messages)},setRule:function(t){new r(t,this.rules),e.map(this.fields,function(e){e.old={}})},setField:function(i,r){var n=this,s={};if(I(i)){if(null===r)return e.map(i.split(" "),function(e){e&&n.fields[e]&&(n.fields[e]=null)}),t;r&&(s[i]=r)}else L(i)&&(s=i);n.options.fields?e.extend(n.options.fields,s):n.options.fields=s,n._init()},holdSubmit:function(e){e===t&&(e=!0),this.submiting=e},destroy:function(){this._reset(!0),this.$el.off("."+p).removeData(p),P(this.$el[0],A,this.NOVALIDATE)}},e(document).on("focusin",":input["+M+"]",function(){u(this,"focusin")}).on("click","input,button",function(){if(this.form)if("submit"===this.type&&null!==P(this,"formnovalidate")||null!==P(this,A))P(this.form,"novalidateonce",!0);else if(this.name&&f(this)){var e=this.form.elements[this.name];e.length&&(e=e[0]),P(e,M)&&u(e,"validate")}}).on("submit","form",function(t){if(null===P(this,A)){var i,r=e(this);r.data(p)||(i=r[p]().data(p),e.isEmptyObject(i.fields)?(P(this,A,A),r.removeData(p)):"submit"===t.type&&i._submit(t))}}),new r({required:function(t,i){var r=e.trim(t.value),n=!0;if(i)if(1===i.length){if(!r&&!this.test(t,i[0]))return null}else"not"===i[0]&&e.map(i.slice(1),function(t){r===e.trim(t)&&(n=!1)});return n&&!!r},integer:function(e,t){var i,r="0|",n="[1-9]\\d*",s=t?t[0]:"*";switch(s){case"+":i=n;break;case"-":i="-"+n;break;case"+0":i=r+n;break;case"-0":i=r+"-"+n;break;default:i=r+"-?"+n}return i="^(?:"+i+")$",RegExp(i).test(e.value)||this.messages.integer[s]},match:function(t,i,r){var n,s,a,l,u,o,c,d="eq";if(i&&(1===i.length?a=i[0]:(d=i[0],a=i[1]),u="#"===a.charAt(0)?a:':input[name="'+a+'"]',o=this.$el.find(u)[0])){if(c=this.getField(o),n=t.value,s=o.value,r.init_match||(this.$el.on("valid.field."+p,u,function(){e(t).trigger("validate")}),r.init_match=c.init_match=1),!r.required&&""===n&&""===s)return null;if(i[2]&&("date"===i[2]?(n=g(n),s=g(s)):"time"===i[2]&&(n=+n.replace(":",""),s=+s.replace(":",""))),"eq"!==d&&!isNaN(+n)&&isNaN(+s))return!0;switch(l=this.messages.match[d].replace("{1}",c.display||a),d){case"lt":return+s>+n||l;case"lte":return+s>=+n||l;case"gte":return+n>=+s||l;case"gt":return+n>+s||l;case"neq":return n!==s||l;default:return n===s||l}}},range:function(e,t){return this.getRangeMsg(+e.value,t,"range")},checked:function(t,i,r){if(!f(t))return!0;var n,s;return s=this.$el.find('input[name="'+t.name+'"]').filter(function(){return!n&&f(this)&&(n=this),!this.disabled&&this.checked&&e(this).is(":visible")}).length,i?this.getRangeMsg(s,i,"checked"):!!s||c(n,r,"checked")||this.messages.required},length:function(e,t){var i=e.value,r=(t[1]?i.replace(C,"xx"):i).length;return t&&"~"===t[0].charAt(0)&&(t[0]="0"+t[0]),this.getRangeMsg(r,t,"length",t[1]?"_2":"")},remote:function(t,i){var r,n,s,a,l=this,u={};return i?(r=R.exec(i[0]),s=r[2],a=(r[1]||"POST").toUpperCase(),u[t.name]=t.value,i[1]&&e.map(i.slice(1),function(t){u[e.trim(t)]=l.$el.find(':input[name="'+t+'"]').val()}),u=e.param(u),"POST"===a&&(n=s.indexOf("?"),-1!==n&&(u+="&"+s.substring(n+1,s.length),s=s.substring(0,n))),e.ajax({url:s,type:a,data:u,async:!0,cache:!1})):!0},filter:function(e,t){return e.value=e.value.replace(t?RegExp("["+t[0]+"]","g"):N,""),!0}}),i.config=function(t){e.each(t,function(e,t){"rules"===e?new r(t):"messages"===e?new n(t):H[e]=t})},i.setTheme=function(t,i){L(t)?e.each(t,function(e,t){B[e]=t}):I(t)&&L(i)&&(B[t]=i)},e[p]=i}(jQuery);
