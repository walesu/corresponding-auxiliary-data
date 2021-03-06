/*
 * Copyright 2021-2022 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.wangEditor = factory());
}(this, (function () { 'use strict';

    /*
     poly-fill
     */

    var polyfill = function () {

        // Object.assign
        if (typeof Object.assign != 'function') {
            Object.assign = function (target, varArgs) {
                // .length of function is 2
                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            };
        }

        // IE ????????? Element.prototype.matches
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }
    };

    /*
     DOM ?????? API
     */

// ?????? html ?????????????????? dom ??????
    function createElemByHTML(html) {
        var div = void 0;
        div = document.createElement('div');
        div.innerHTML = html;
        return div.children;
    }

// ????????? DOM List
    function isDOMList(selector) {
        if (!selector) {
            return false;
        }
        if (selector instanceof HTMLCollection || selector instanceof NodeList) {
            return true;
        }
        return false;
    }

// ?????? document.querySelectorAll
    function querySelectorAll(selector) {
        var result = document.querySelectorAll(selector);
        if (isDOMList(result)) {
            return result;
        } else {
            return [result];
        }
    }

// ??????????????????
    function DomElement(selector) {
        if (!selector) {
            return;
        }

        // selector ???????????? DomElement ?????????????????????
        if (selector instanceof DomElement) {
            return selector;
        }

        this.selector = selector;

        // ?????? selector ????????????????????? DOM???DOM List???
        var selectorResult = [];
        if (selector.nodeType === 1) {
            // ?????? DOM ??????
            selectorResult = [selector];
        } else if (isDOMList(selector)) {
            // DOM List
            selectorResult = selector;
        } else if (typeof selector === 'string') {
            // ?????????
            selector = selector.replace('/\n/mg', '').trim();
            if (selector.indexOf('<') === 0) {
                // ??? <div>
                selectorResult = createElemByHTML(selector);
            } else {
                // ??? #id .class
                selectorResult = querySelectorAll(selector);
            }
        }

        var length = selectorResult.length;
        if (!length) {
            // ?????????
            return this;
        }

        // ?????? DOM ??????
        var i = void 0;
        for (i = 0; i < length; i++) {
            this[i] = selectorResult[i];
        }
        this.length = length;
    }

// ????????????
    DomElement.prototype = {
        constructor: DomElement,

        // ????????????forEach
        forEach: function forEach(fn) {
            var i = void 0;
            for (i = 0; i < this.length; i++) {
                var elem = this[i];
                var result = fn.call(elem, elem, i);
                if (result === false) {
                    break;
                }
            }
            return this;
        },

        // ?????????????????????
        get: function get(index) {
            var length = this.length;
            if (index >= length) {
                index = index % length;
            }
            return $(this[index]);
        },

        // ?????????
        first: function first() {
            return this.get(0);
        },

        // ????????????
        last: function last() {
            var length = this.length;
            return this.get(length - 1);
        },

        // ????????????
        on: function on(type, selector, fn) {
            // selector ??????????????????????????????????????????
            if (!fn) {
                fn = selector;
                selector = null;
            }

            // type ???????????????
            var types = [];
            types = type.split(/\s+/);

            return this.forEach(function (elem) {
                types.forEach(function (type) {
                    if (!type) {
                        return;
                    }

                    if (!selector) {
                        // ?????????
                        elem.addEventListener(type, fn, false);
                        return;
                    }

                    // ?????????
                    elem.addEventListener(type, function (e) {
                        var target = e.target;
                        if (target.matches(selector)) {
                            fn.call(target, e);
                        }
                    }, false);
                });
            });
        },

        // ??????????????????
        off: function off(type, fn) {
            return this.forEach(function (elem) {
                elem.removeEventListener(type, fn, false);
            });
        },

        // ??????/?????? ??????
        attr: function attr(key, val) {
            if (val == null) {
                // ?????????
                return this[0].getAttribute(key);
            } else {
                // ?????????
                return this.forEach(function (elem) {
                    elem.setAttribute(key, val);
                });
            }
        },

        // ?????? class
        addClass: function addClass(className) {
            if (!className) {
                return this;
            }
            return this.forEach(function (elem) {
                var arr = void 0;
                if (elem.className) {
                    // ???????????? className ???????????????
                    arr = elem.className.split(/\s/);
                    arr = arr.filter(function (item) {
                        return !!item.trim();
                    });
                    // ?????? class
                    if (arr.indexOf(className) < 0) {
                        arr.push(className);
                    }
                    // ?????? elem.class
                    elem.className = arr.join(' ');
                } else {
                    elem.className = className;
                }
            });
        },

        // ?????? class
        removeClass: function removeClass(className) {
            if (!className) {
                return this;
            }
            return this.forEach(function (elem) {
                var arr = void 0;
                if (elem.className) {
                    // ???????????? className ???????????????
                    arr = elem.className.split(/\s/);
                    arr = arr.filter(function (item) {
                        item = item.trim();
                        // ?????? class
                        if (!item || item === className) {
                            return false;
                        }
                        return true;
                    });
                    // ?????? elem.class
                    elem.className = arr.join(' ');
                }
            });
        },

        // ?????? css
        css: function css(key, val) {
            var currentStyle = key + ':' + val + ';';
            return this.forEach(function (elem) {
                var style = (elem.getAttribute('style') || '').trim();
                var styleArr = void 0,
                    resultArr = [];
                if (style) {
                    // ??? style ?????? ; ???????????????
                    styleArr = style.split(';');
                    styleArr.forEach(function (item) {
                        // ???????????????????????? : ????????? key ??? value
                        var arr = item.split(':').map(function (i) {
                            return i.trim();
                        });
                        if (arr.length === 2) {
                            resultArr.push(arr[0] + ':' + arr[1]);
                        }
                    });
                    // ??????????????????
                    resultArr = resultArr.map(function (item) {
                        if (item.indexOf(key) === 0) {
                            return currentStyle;
                        } else {
                            return item;
                        }
                    });
                    if (resultArr.indexOf(currentStyle) < 0) {
                        resultArr.push(currentStyle);
                    }
                    // ??????
                    elem.setAttribute('style', resultArr.join('; '));
                } else {
                    // style ??????
                    elem.setAttribute('style', currentStyle);
                }
            });
        },

        // ??????
        show: function show() {
            return this.css('display', 'block');
        },

        // ??????
        hide: function hide() {
            return this.css('display', 'none');
        },

        // ???????????????
        children: function children() {
            var elem = this[0];
            if (!elem) {
                return null;
            }

            return $(elem.children);
        },

        // ???????????????
        append: function append($children) {
            return this.forEach(function (elem) {
                $children.forEach(function (child) {
                    elem.appendChild(child);
                });
            });
        },

        // ??????????????????
        remove: function remove() {
            return this.forEach(function (elem) {
                if (elem.remove) {
                    elem.remove();
                } else {
                    var parent = elem.parentElement;
                    parent && parent.removeChild(elem);
                }
            });
        },

        // ???????????????????????????
        isContain: function isContain($child) {
            var elem = this[0];
            var child = $child[0];
            return elem.contains(child);
        },

        // ????????????
        getSizeData: function getSizeData() {
            var elem = this[0];
            return elem.getBoundingClientRect(); // ????????? bottom height left right top width ?????????
        },

        // ?????? nodeName
        getNodeName: function getNodeName() {
            var elem = this[0];
            return elem.nodeName;
        },

        // ?????????????????????
        find: function find(selector) {
            var elem = this[0];
            return $(elem.querySelectorAll(selector));
        },

        // ????????????????????? text
        text: function text(val) {
            if (!val) {
                // ?????? text
                var elem = this[0];
                return elem.innerHTML.replace(/<.*?>/g, function () {
                    return '';
                });
            } else {
                // ?????? text
                return this.forEach(function (elem) {
                    elem.innerHTML = val;
                });
            }
        },

        // ?????? html
        html: function html(value) {
            var elem = this[0];
            if (value == null) {
                return elem.innerHTML;
            } else {
                elem.innerHTML = value;
                return this;
            }
        },

        // ?????? value
        val: function val() {
            var elem = this[0];
            return elem.value.trim();
        },

        // focus
        focus: function focus() {
            return this.forEach(function (elem) {
                elem.focus();
            });
        },

        // parent
        parent: function parent() {
            var elem = this[0];
            return $(elem.parentElement);
        },

        // parentUntil ???????????? selector ????????????
        parentUntil: function parentUntil(selector, _currentElem) {
            var results = document.querySelectorAll(selector);
            var length = results.length;
            if (!length) {
                // ????????? selector ??????
                return null;
            }

            var elem = _currentElem || this[0];
            if (elem.nodeName === 'BODY') {
                return null;
            }

            var parent = elem.parentElement;
            var i = void 0;
            for (i = 0; i < length; i++) {
                if (parent === results[i]) {
                    // ??????????????????
                    return $(parent);
                }
            }

            // ????????????
            return this.parentUntil(selector, parent);
        },

        // ???????????? elem ????????????
        equal: function equal($elem) {
            if ($elem.nodeType === 1) {
                return this[0] === $elem;
            } else {
                return this[0] === $elem[0];
            }
        },

        // ???????????????????????????????????????
        insertBefore: function insertBefore(selector) {
            var $referenceNode = $(selector);
            var referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function (elem) {
                var parent = referenceNode.parentNode;
                parent.insertBefore(elem, referenceNode);
            });
        },

        // ???????????????????????????????????????
        insertAfter: function insertAfter(selector) {
            var $referenceNode = $(selector);
            var referenceNode = $referenceNode[0];
            if (!referenceNode) {
                return this;
            }
            return this.forEach(function (elem) {
                var parent = referenceNode.parentNode;
                if (parent.lastChild === referenceNode) {
                    // ??????????????????
                    parent.appendChild(elem);
                } else {
                    // ????????????????????????
                    parent.insertBefore(elem, referenceNode.nextSibling);
                }
            });
        }
    };

// new ????????????
    function $(selector) {
        return new DomElement(selector);
    }

    /*
     ????????????
     */

    var config = {

        // ??????????????????
        menus: ['head', 'bold', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor', 'link', 'list', 'justify', 'quote', 'emoticon', 'image', 'table', 'video', 'code', 'undo', 'redo'],

        // ??????????????? z-index
        zIndex: 10000,

        // ???????????? debug ?????????debug ?????????????????? throw error ???????????????
        debug: false,

        // onchange ??????
        // onchange: function (html) {
        //     // html ????????????????????????
        //     console.log(html)
        // },

        // ????????????????????????????????? tab
        showLinkImg: true,

        // ?????????????????? max size: 5M
        uploadImgMaxSize: 5 * 1024 * 1024,

        // ????????????????????????????????????
        // uploadImgMaxLength: 5,

        // ??????????????????????????? base64 ??????
        uploadImgShowBase64: false,

        // ???????????????server ??????????????????????????? base64 ???????????????????????????
        // uploadImgServer: '/upload',

        // ??????????????? filename
        uploadFileName: '',

        // ??????????????????????????????
        uploadImgParams: {
            token: 'abcdef12345'
        },

        // ????????????????????????header
        uploadImgHeaders: {
            // 'Accept': 'text/x-json'
        },

        // ?????? XHR withCredentials
        withCredentials: false,

        // ????????????????????????????????? ms
        uploadImgTimeout: 5000,

        // ???????????? hook
        uploadImgHooks: {
            // customInsert: function (insertLinkImg, result, editor) {
            //     console.log('customInsert')
            //     // ???????????????????????????????????????????????????????????????????????????????????????????????????
            //     const data = result.data1 || []
            //     data.forEach(link => {
            //         insertLinkImg(link)
            //     })
            // },
            before: function before(xhr, editor, files) {
                // ????????????????????????
            },
            success: function success(xhr, editor, result) {
                // ????????????????????????????????????????????????????????????
            },
            fail: function fail(xhr, editor, result) {
                // ????????????????????????????????????????????????????????????
            },
            error: function error(xhr, editor) {
                // ???????????????????????????
            },
            timeout: function timeout(xhr, editor) {
                // ???????????????????????????
            }
        }
    };

    /*
     ??????
     */

// ??? UA ???????????????
    var UA = {
        _ua: navigator.userAgent,

        // ?????? webkit
        isWebkit: function isWebkit() {
            var reg = /webkit/i;
            return reg.test(this._ua);
        },

        // ?????? IE
        isIE: function isIE() {
            return 'ActiveXObject' in window;
        }
    };

// ????????????
    function objForEach(obj, fn) {
        var key = void 0,
            result = void 0;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                result = fn.call(obj, key, obj[key]);
                if (result === false) {
                    break;
                }
            }
        }
    }

// ???????????????
    function arrForEach(fakeArr, fn) {
        var i = void 0,
            item = void 0,
            result = void 0;
        var length = fakeArr.length || 0;
        for (i = 0; i < length; i++) {
            item = fakeArr[i];
            result = fn.call(fakeArr, item, i);
            if (result === false) {
                break;
            }
        }
    }

// ???????????????
    function getRandom(prefix) {
        return prefix + Math.random().toString().slice(2);
    }

// ?????? html ????????????
    function replaceHtmlSymbol(html) {
        if (html == null) {
            return '';
        }
        return html.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/"/gm, '&quot;');
    }

// ????????????????????????

    /*
     bold-menu
     */
// ????????????
    function Bold(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-bold"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Bold.prototype = {
        constructor: Bold,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;
            var isSeleEmpty = editor.selection.isSelectionEmpty();

            if (isSeleEmpty) {
                // ???????????????????????????????????????????????????
                editor.selection.createEmptyRange();
            }

            // ?????? bold ??????
            editor.cmd.do('bold');

            if (isSeleEmpty) {
                // ???????????????????????????
                editor.selection.collapseRange();
                editor.selection.restoreSelection();
            }
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor.cmd.queryCommandState('bold')) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     droplist
     */
    var _emptyFn = function _emptyFn() {};

// ????????????
    function DropList(menu, opt) {
        var _this = this;

        // droplist ??????????????????
        this.menu = menu;
        this.opt = opt;
        // ??????
        var $container = $('<div class="w-e-droplist"></div>');

        // ??????
        var $title = opt.$title;
        if ($title) {
            $title.addClass('w-e-dp-title');
            $container.append($title);
        }

        var list = opt.list || [];
        var type = opt.type || 'list'; // 'list' ??????????????????????????????????????? / 'inline-block' ???????????????????????????????????????
        var onClick = opt.onClick || _emptyFn;

        // ?????? DOM ???????????????
        var $list = $('<ul class="' + (type === 'list' ? 'w-e-list' : 'w-e-block') + '"></ul>');
        $container.append($list);
        list.forEach(function (item) {
            var $elem = item.$elem;
            var value = item.value;
            var $li = $('<li class="w-e-item"></li>');
            if ($elem) {
                $li.append($elem);
                $list.append($li);
                $elem.on('click', function (e) {
                    onClick(value);

                    // ??????
                    _this.hideTimeoutId = setTimeout(function () {
                        _this.hide();
                    }, 0);
                });
            }
        });

        // ??????????????????
        $container.on('mouseleave', function (e) {
            _this.hideTimeoutId = setTimeout(function () {
                _this.hide();
            }, 0);
        });

        // ????????????
        this.$container = $container;

        // ????????????
        this._rendered = false;
        this._show = false;
    }

// ??????
    DropList.prototype = {
        constructor: DropList,

        // ???????????????DOM???
        show: function show() {
            if (this.hideTimeoutId) {
                // ???????????????????????????
                clearTimeout(this.hideTimeoutId);
            }

            var menu = this.menu;
            var $menuELem = menu.$elem;
            var $container = this.$container;
            if (this._show) {
                return;
            }
            if (this._rendered) {
                // ??????
                $container.show();
            } else {
                // ?????? DOM ?????????????????????
                var menuHeight = $menuELem.getSizeData().height || 0;
                var width = this.opt.width || 100; // ????????? 100
                $container.css('margin-top', menuHeight + 'px').css('width', width + 'px');

                // ????????? DOM
                $menuELem.append($container);
                this._rendered = true;
            }

            // ????????????
            this._show = true;
        },

        // ???????????????DOM???
        hide: function hide() {
            if (this.showTimeoutId) {
                // ???????????????????????????
                clearTimeout(this.showTimeoutId);
            }

            var $container = this.$container;
            if (!this._show) {
                return;
            }
            // ?????????????????????
            $container.hide();
            this._show = false;
        }
    };

    /*
     menu - header
     */
// ????????????
    function Head(editor) {
        var _this = this;

        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-header"><i/></div>');
        this.type = 'droplist';

        // ???????????? active ??????
        this._active = false;

        // ????????? droplist
        this.droplist = new DropList(this, {
            width: 100,
            $title: $('<p>????????????</p>'),
            type: 'list', // droplist ?????????????????????
            list: [{ $elem: $('<h1>H1</h1>'), value: '<h1>' }, { $elem: $('<h2>H2</h2>'), value: '<h2>' }, { $elem: $('<h3>H3</h3>'), value: '<h3>' }, { $elem: $('<h4>H4</h4>'), value: '<h4>' }, { $elem: $('<h5>H5</h5>'), value: '<h5>' }, { $elem: $('<p>??????</p>'), value: '<p>' }],
            onClick: function onClick(value) {
                // ?????? this ?????????????????? Head ??????
                _this._command(value);
            }
        });
    }

// ??????
    Head.prototype = {
        constructor: Head,

        // ????????????
        _command: function _command(value) {
            var editor = this.editor;
            editor.cmd.do('formatBlock', value);
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            var reg = /^h/i;
            var cmdValue = editor.cmd.queryCommandValue('formatBlock');
            if (reg.test(cmdValue)) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     panel
     */

    var emptyFn = function emptyFn() {};

// ?????????????????? panel ?????????
    var _isCreatedPanelMenus = [];

// ????????????
    function Panel(menu, opt) {
        this.menu = menu;
        this.opt = opt;
    }

// ??????
    Panel.prototype = {
        constructor: Panel,

        // ???????????????DOM???
        show: function show() {
            var _this = this;

            var menu = this.menu;
            if (_isCreatedPanelMenus.indexOf(menu) >= 0) {
                // ???????????????????????? panel ???????????????
                return;
            }

            var editor = menu.editor;
            var $body = $('body');
            var $textContainerElem = editor.$textContainerElem;
            var opt = this.opt;

            // panel ?????????
            var $container = $('<div class="w-e-panel-container"></div>');
            var width = opt.width || 300; // ?????? 300px
            $container.css('width', width + 'px').css('margin-left', (0 - width) / 2 + 'px');

            // ??????????????????
            var $closeBtn = $('<i class="w-e-icon-close w-e-panel-close"></i>');
            $container.append($closeBtn);
            $closeBtn.on('click', function () {
                _this.hide();
            });

            // ?????? tabs ??????
            var $tabTitleContainer = $('<ul class="w-e-panel-tab-title"></ul>');
            var $tabContentContainer = $('<div class="w-e-panel-tab-content"></div>');
            $container.append($tabTitleContainer).append($tabContentContainer);

            // ????????????
            var height = opt.height;
            if (height) {
                $tabContentContainer.css('height', height + 'px').css('overflow-y', 'auto');
            }

            // tabs
            var tabs = opt.tabs || [];
            var tabTitleArr = [];
            var tabContentArr = [];
            tabs.forEach(function (tab, tabIndex) {
                if (!tab) {
                    return;
                }
                var title = tab.title || '';
                var tpl = tab.tpl || '';

                // ????????? DOM
                var $title = $('<li class="w-e-item">' + title + '</li>');
                $tabTitleContainer.append($title);
                var $content = $(tpl);
                $tabContentContainer.append($content);

                // ???????????????
                $title._index = tabIndex;
                tabTitleArr.push($title);
                tabContentArr.push($content);

                // ?????? active ???
                if (tabIndex === 0) {
                    $title._active = true;
                    $title.addClass('w-e-active');
                } else {
                    $content.hide();
                }

                // ?????? tab ?????????
                $title.on('click', function (e) {
                    if ($title._active) {
                        return;
                    }
                    // ??????????????? tab
                    tabTitleArr.forEach(function ($title) {
                        $title._active = false;
                        $title.removeClass('w-e-active');
                    });
                    tabContentArr.forEach(function ($content) {
                        $content.hide();
                    });

                    // ??????????????? tab
                    $title._active = true;
                    $title.addClass('w-e-active');
                    $content.show();
                });
            });

            // ??????????????????
            $container.on('click', function (e) {
                // ?????????????????????
                e.stopPropagation();
            });
            $body.on('click', function (e) {
                _this.hide();
            });

            // ????????? DOM
            $textContainerElem.append($container);

            // ?????? opt ??????????????????????????? DOM ????????????????????????
            tabs.forEach(function (tab, index) {
                if (!tab) {
                    return;
                }
                var events = tab.events || [];
                events.forEach(function (event) {
                    var selector = event.selector;
                    var type = event.type;
                    var fn = event.fn || emptyFn;
                    var $content = tabContentArr[index];
                    $content.find(selector).on(type, function (e) {
                        e.stopPropagation();
                        var needToHide = fn(e);
                        // ??????????????????????????????????????? panel
                        if (needToHide) {
                            _this.hide();
                        }
                    });
                });
            });

            // focus ????????? elem
            var $inputs = $container.find('input[type=text],textarea');
            if ($inputs.length) {
                $inputs.get(0).focus();
            }

            // ???????????????
            this.$container = $container;

            // ???????????? panel
            this._hideOtherPanels();
            // ????????? menu ??????????????? panel
            _isCreatedPanelMenus.push(menu);
        },

        // ???????????????DOM???
        hide: function hide() {
            var menu = this.menu;
            var $container = this.$container;
            if ($container) {
                $container.remove();
            }

            // ?????? menu ???????????????
            _isCreatedPanelMenus = _isCreatedPanelMenus.filter(function (item) {
                if (item === menu) {
                    return false;
                } else {
                    return true;
                }
            });
        },

        // ?????? panel ???????????????????????? panel
        _hideOtherPanels: function _hideOtherPanels() {
            if (!_isCreatedPanelMenus.length) {
                return;
            }
            _isCreatedPanelMenus.forEach(function (menu) {
                var panel = menu.panel || {};
                if (panel.hide) {
                    panel.hide();
                }
            });
        }
    };

    /*
     menu - link
     */
// ????????????
    function Link(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-link"><i/></div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Link.prototype = {
        constructor: Link,

        // ????????????
        onClick: function onClick(e) {
            var editor = this.editor;
            var $linkelem = void 0;

            if (this._active) {
                // ???????????????????????????
                $linkelem = editor.selection.getSelectionContainerElem();
                if (!$linkelem) {
                    return;
                }
                // ???????????????????????????????????????????????????????????????
                editor.selection.createRangeByElem($linkelem);
                editor.selection.restoreSelection();
                // ?????? panel
                this._createPanel($linkelem.text(), $linkelem.attr('href'));
            } else {
                // ??????????????????????????????
                if (editor.selection.isSelectionEmpty()) {
                    // ?????????????????????????????????
                    this._createPanel('', '');
                } else {
                    // ???????????????
                    this._createPanel(editor.selection.getSelectionText(), '');
                }
            }
        },

        // ?????? panel
        _createPanel: function _createPanel(text, link) {
            var _this = this;

            // panel ??????????????????id
            var inputLinkId = getRandom('input-link');
            var inputTextId = getRandom('input-text');
            var btnOkId = getRandom('btn-ok');
            var btnDelId = getRandom('btn-del');

            // ??????????????????????????????
            var delBtnDisplay = this._active ? 'inline-block' : 'none';

            // ?????????????????? panel
            var panel = new Panel(this, {
                width: 300,
                // panel ?????????????????? tab
                tabs: [{
                    // tab ?????????
                    title: '??????',
                    // ??????
                    tpl: '<div>\n                            <input id="' + inputTextId + '" type="text" class="block" value="' + text + '" placeholder="\u94FE\u63A5\u6587\u5B57"/></td>\n                            <input id="' + inputLinkId + '" type="text" class="block" value="' + link + '" placeholder="http://..."/></td>\n                            <div class="w-e-button-container">\n                                <button id="' + btnOkId + '" class="right">\u63D2\u5165</button>\n                                <button id="' + btnDelId + '" class="gray right" style="display:' + delBtnDisplay + '">\u5220\u9664\u94FE\u63A5</button>\n                            </div>\n                        </div>',
                    // ????????????
                    events: [
                        // ????????????
                        {
                            selector: '#' + btnOkId,
                            type: 'click',
                            fn: function fn() {
                                // ??????????????????
                                var $link = $('#' + inputLinkId);
                                var $text = $('#' + inputTextId);
                                var link = $link.val();
                                var text = $text.val();
                                _this._insertLink(text, link);

                                // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                                return true;
                            }
                        },
                        // ????????????
                        {
                            selector: '#' + btnDelId,
                            type: 'click',
                            fn: function fn() {
                                // ??????????????????
                                _this._delLink();

                                // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                                return true;
                            }
                        }]
                } // tab end
                ] // tabs end
            });

            // ?????? panel
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ??????????????????
        _delLink: function _delLink() {
            if (!this._active) {
                return;
            }
            var editor = this.editor;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            var selectionText = editor.selection.getSelectionText();
            editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>');
        },

        // ????????????
        _insertLink: function _insertLink(text, link) {
            if (!text || !link) {
                return;
            }
            var editor = this.editor;
            editor.cmd.do('insertHTML', '<a href="' + link + '" target="_blank">' + text + '</a>');
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            if ($selectionELem.getNodeName() === 'A') {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     italic-menu
     */
// ????????????
    function Italic(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-italic"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Italic.prototype = {
        constructor: Italic,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;
            var isSeleEmpty = editor.selection.isSelectionEmpty();

            if (isSeleEmpty) {
                // ???????????????????????????????????????????????????
                editor.selection.createEmptyRange();
            }

            // ?????? italic ??????
            editor.cmd.do('italic');

            if (isSeleEmpty) {
                // ???????????????????????????
                editor.selection.collapseRange();
                editor.selection.restoreSelection();
            }
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor.cmd.queryCommandState('italic')) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     redo-menu
     */
// ????????????
    function Redo(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-redo"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Redo.prototype = {
        constructor: Redo,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;

            // ?????? redo ??????
            editor.cmd.do('redo');
        }
    };

    /*
     strikeThrough-menu
     */
// ????????????
    function StrikeThrough(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-strikethrough"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    StrikeThrough.prototype = {
        constructor: StrikeThrough,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;
            var isSeleEmpty = editor.selection.isSelectionEmpty();

            if (isSeleEmpty) {
                // ???????????????????????????????????????????????????
                editor.selection.createEmptyRange();
            }

            // ?????? strikeThrough ??????
            editor.cmd.do('strikeThrough');

            if (isSeleEmpty) {
                // ???????????????????????????
                editor.selection.collapseRange();
                editor.selection.restoreSelection();
            }
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor.cmd.queryCommandState('strikeThrough')) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     underline-menu
     */
// ????????????
    function Underline(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-underline"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Underline.prototype = {
        constructor: Underline,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;
            var isSeleEmpty = editor.selection.isSelectionEmpty();

            if (isSeleEmpty) {
                // ???????????????????????????????????????????????????
                editor.selection.createEmptyRange();
            }

            // ?????? underline ??????
            editor.cmd.do('underline');

            if (isSeleEmpty) {
                // ???????????????????????????
                editor.selection.collapseRange();
                editor.selection.restoreSelection();
            }
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor.cmd.queryCommandState('underline')) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     undo-menu
     */
// ????????????
    function Undo(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-undo"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Undo.prototype = {
        constructor: Undo,

        // ????????????
        onClick: function onClick(e) {
            // ???????????????????????????

            var editor = this.editor;

            // ?????? undo ??????
            editor.cmd.do('undo');
        }
    };

    /*
     menu - list
     */
// ????????????
    function List(editor) {
        var _this = this;

        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-list2"><i/></div>');
        this.type = 'droplist';

        // ???????????? active ??????
        this._active = false;

        // ????????? droplist
        this.droplist = new DropList(this, {
            width: 120,
            $title: $('<p>????????????</p>'),
            type: 'list', // droplist ?????????????????????
            list: [{ $elem: $('<span><i class="w-e-icon-list-numbered"></i> ????????????</span>'), value: 'insertOrderedList' }, { $elem: $('<span><i class="w-e-icon-list2"></i> ????????????</span>'), value: 'insertUnorderedList' }],
            onClick: function onClick(value) {
                // ?????? this ?????????????????? List ??????
                _this._command(value);
            }
        });
    }

// ??????
    List.prototype = {
        constructor: List,

        // ????????????
        _command: function _command(value) {
            var editor = this.editor;
            var $textElem = editor.$textElem;
            editor.selection.restoreSelection();
            if (editor.cmd.queryCommandState(value)) {
                return;
            }
            editor.cmd.do(value);

            // ?????????????????????????????? <p> ??????
            var $selectionElem = editor.selection.getSelectionContainerElem();
            if ($selectionElem.getNodeName() === 'LI') {
                $selectionElem = $selectionElem.parent();
            }
            if (/^ol|ul$/i.test($selectionElem.getNodeName()) === false) {
                return;
            }
            if ($selectionElem.equal($textElem)) {
                // ????????????????????????????????? <p> ??????
                return;
            }
            var $parent = $selectionElem.parent();
            if ($parent.equal($textElem)) {
                // $parent ??????????????????????????????
                return;
            }

            $selectionElem.insertAfter($parent);
            $parent.remove();
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor.cmd.queryCommandState('insertUnOrderedList') || editor.cmd.queryCommandState('insertOrderedList')) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     menu - justify
     */
// ????????????
    function Justify(editor) {
        var _this = this;

        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paragraph-left"><i/></div>');
        this.type = 'droplist';

        // ???????????? active ??????
        this._active = false;

        // ????????? droplist
        this.droplist = new DropList(this, {
            width: 100,
            $title: $('<p>????????????</p>'),
            type: 'list', // droplist ?????????????????????
            list: [{ $elem: $('<span><i class="w-e-icon-paragraph-left"></i> ??????</span>'), value: 'justifyLeft' }, { $elem: $('<span><i class="w-e-icon-paragraph-center"></i> ??????</span>'), value: 'justifyCenter' }, { $elem: $('<span><i class="w-e-icon-paragraph-right"></i> ??????</span>'), value: 'justifyRight' }],
            onClick: function onClick(value) {
                // ?????? this ?????????????????? List ??????
                _this._command(value);
            }
        });
    }

// ??????
    Justify.prototype = {
        constructor: Justify,

        // ????????????
        _command: function _command(value) {
            var editor = this.editor;
            editor.cmd.do(value);
        }
    };

    /*
     menu - backcolor
     */
// ????????????
    function BackColor(editor) {
        var _this = this;

        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-pencil2"><i/></div>');
        this.type = 'droplist';

        // ???????????? active ??????
        this._active = false;

        // ????????? droplist
        this.droplist = new DropList(this, {
            width: 120,
            $title: $('<p>????????????</p>'),
            type: 'inline-block', // droplist ????????? block ????????????
            list: [{ $elem: $('<i style="color:#000000;" class="w-e-icon-pencil2"></i>'), value: '#000000' }, { $elem: $('<i style="color:#eeece0;" class="w-e-icon-pencil2"></i>'), value: '#eeece0' }, { $elem: $('<i style="color:#1c487f;" class="w-e-icon-pencil2"></i>'), value: '#1c487f' }, { $elem: $('<i style="color:#4d80bf;" class="w-e-icon-pencil2"></i>'), value: '#4d80bf' }, { $elem: $('<i style="color:#c24f4a;" class="w-e-icon-pencil2"></i>'), value: '#c24f4a' }, { $elem: $('<i style="color:#8baa4a;" class="w-e-icon-pencil2"></i>'), value: '#8baa4a' }, { $elem: $('<i style="color:#7b5ba1;" class="w-e-icon-pencil2"></i>'), value: '#7b5ba1' }, { $elem: $('<i style="color:#46acc8;" class="w-e-icon-pencil2"></i>'), value: '#46acc8' }, { $elem: $('<i style="color:#f9963b;" class="w-e-icon-pencil2"></i>'), value: '#f9963b' }, { $elem: $('<i style="color:#ffffff;" class="w-e-icon-pencil2"></i>'), value: '#ffffff' }],
            onClick: function onClick(value) {
                // ?????? this ?????????????????? BackColor ??????
                _this._command(value);
            }
        });
    }

// ??????
    BackColor.prototype = {
        constructor: BackColor,

        // ????????????
        _command: function _command(value) {
            var editor = this.editor;
            editor.cmd.do('foreColor', value);
        }
    };

    /*
     menu - forecolor
     */
// ????????????
    function ForeColor$1(editor) {
        var _this = this;

        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-paint-brush"><i/></div>');
        this.type = 'droplist';

        // ???????????? active ??????
        this._active = false;

        // ????????? droplist
        this.droplist = new DropList(this, {
            width: 120,
            $title: $('<p>?????????</p>'),
            type: 'inline-block', // droplist ????????? block ????????????
            list: [{ $elem: $('<i style="color:#000000;" class="w-e-icon-paint-brush"></i>'), value: '#000000' }, { $elem: $('<i style="color:#eeece0;" class="w-e-icon-paint-brush"></i>'), value: '#eeece0' }, { $elem: $('<i style="color:#1c487f;" class="w-e-icon-paint-brush"></i>'), value: '#1c487f' }, { $elem: $('<i style="color:#4d80bf;" class="w-e-icon-paint-brush"></i>'), value: '#4d80bf' }, { $elem: $('<i style="color:#c24f4a;" class="w-e-icon-paint-brush"></i>'), value: '#c24f4a' }, { $elem: $('<i style="color:#8baa4a;" class="w-e-icon-paint-brush"></i>'), value: '#8baa4a' }, { $elem: $('<i style="color:#7b5ba1;" class="w-e-icon-paint-brush"></i>'), value: '#7b5ba1' }, { $elem: $('<i style="color:#46acc8;" class="w-e-icon-paint-brush"></i>'), value: '#46acc8' }, { $elem: $('<i style="color:#f9963b;" class="w-e-icon-paint-brush"></i>'), value: '#f9963b' }, { $elem: $('<i style="color:#ffffff;" class="w-e-icon-paint-brush"></i>'), value: '#ffffff' }],
            onClick: function onClick(value) {
                // ?????? this ?????????????????? ForeColor ??????
                _this._command(value);
            }
        });
    }

// ??????
    ForeColor$1.prototype = {
        constructor: ForeColor$1,

        // ????????????
        _command: function _command(value) {
            var editor = this.editor;
            editor.cmd.do('backColor', value);
        }
    };

    /*
     menu - quote
     */
// ????????????
    function Quote(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-quotes-left"><i/>\n        </div>');
        this.type = 'click';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Quote.prototype = {
        constructor: Quote,

        onClick: function onClick(e) {
            var editor = this.editor;
            editor.cmd.do('formatBlock', '<BLOCKQUOTE>');
        },

        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            var reg = /^BLOCKQUOTE$/i;
            var cmdValue = editor.cmd.queryCommandValue('formatBlock');
            if (reg.test(cmdValue)) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     menu - code
     */
// ????????????
    function Code(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-terminal"><i/>\n        </div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Code.prototype = {
        constructor: Code,

        onClick: function onClick(e) {
            var editor = this.editor;
            var $startElem = editor.selection.getSelectionStartElem();
            var $endElem = editor.selection.getSelectionEndElem();
            var isSeleEmpty = editor.selection.isSelectionEmpty();
            var selectionText = editor.selection.getSelectionText();
            var $code = void 0;

            if (!$startElem.equal($endElem)) {
                // ??????????????????????????????
                editor.selection.restoreSelection();
                return;
            }
            if (!isSeleEmpty) {
                // ????????????????????? <code> ????????????
                $code = $('<code>' + selectionText + '</code>');
                editor.cmd.do('insertElem', $code);
                editor.selection.createRangeByElem($code, false);
                editor.selection.restoreSelection();
                return;
            }

            // ??????????????????????????????????????????????????? <pre><code></code></prev>
            if (this._active) {
                // ??????????????????????????????
                this._createPanel($startElem.html());
            } else {
                // ?????????????????????????????????
                this._createPanel();
            }
        },

        _createPanel: function _createPanel(value) {
            var _this = this;

            // value - ??????????????????
            value = value || '';
            var type = !value ? 'new' : 'edit';
            var textId = getRandom('texxt');
            var btnId = getRandom('btn');

            var panel = new Panel(this, {
                width: 500,
                // ?????? Panel ???????????? tab
                tabs: [{
                    // ??????
                    title: '????????????',
                    // ??????
                    tpl: '<div>\n                        <textarea id="' + textId + '" style="height:145px;;">' + value + '</textarea>\n                        <div class="w-e-button-container">\n                            <button id="' + btnId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    <div>',
                    // ????????????
                    events: [
                        // ????????????
                        {
                            selector: '#' + btnId,
                            type: 'click',
                            fn: function fn() {
                                var $text = $('#' + textId);
                                var text = $text.val() || $text.html();
                                text = replaceHtmlSymbol(text);
                                if (type === 'new') {
                                    // ?????????
                                    _this._insertCode(text);
                                } else {
                                    // ????????????
                                    _this._updateCode(text);
                                }

                                // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                                return true;
                            }
                        }]
                } // first tab end
                ] // tabs end
            }); // new Panel end

            // ?????? panel
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ????????????
        _insertCode: function _insertCode(value) {
            var editor = this.editor;
            editor.cmd.do('insertHTML', '<pre><code>' + value + '</code></pre><p><br></p>');
        },

        // ????????????
        _updateCode: function _updateCode(value) {
            var editor = this.editor;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            $selectionELem.html(value);
            editor.selection.restoreSelection();
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            var $parentElem = $selectionELem.parent();
            if ($selectionELem.getNodeName() === 'CODE' && $parentElem.getNodeName() === 'PRE') {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     menu - emoticon
     */
// ????????????
    function Emoticon(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu">\n            <i class="w-e-icon-happy"><i/>\n        </div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Emoticon.prototype = {
        constructor: Emoticon,

        onClick: function onClick() {
            this._createPanel();
        },

        _createPanel: function _createPanel() {
            var _this = this;

            // ?????????????????????
            var faceHtml = '';
            var faceStr = '???? ???? ???? ???? ???? ???? ????  ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ????  ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ???? ????';
            faceStr.split(/\s/).forEach(function (item) {
                if (item) {
                    faceHtml += '<span class="w-e-item">' + item + '</span>';
                }
            });

            var handHtml = '';
            var handStr = '???? ???? ???? ???? ???? ???? ??? ??????? ??? ???? ???? ???? ??????? ???? ???? ???? ???? ???? ???? ????';
            handStr.split(/\s/).forEach(function (item) {
                if (item) {
                    handHtml += '<span class="w-e-item">' + item + '</span>';
                }
            });

            var panel = new Panel(this, {
                width: 300,
                height: 200,
                // ?????? Panel ???????????? tab
                tabs: [{
                    // ??????
                    title: '??????',
                    // ??????
                    tpl: '<div class="w-e-emoticon-container">' + faceHtml + '</div>',
                    // ????????????
                    events: [{
                        selector: 'span.w-e-item',
                        type: 'click',
                        fn: function fn(e) {
                            var target = e.target;
                            _this._insert(target.innerHTML);
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }]
                }, // first tab end
                    {
                        // ??????
                        title: '??????',
                        // ??????
                        tpl: '<div class="w-e-emoticon-container">' + handHtml + '</div>',
                        // ????????????
                        events: [{
                            selector: 'span.w-e-item',
                            type: 'click',
                            fn: function fn(e) {
                                var target = e.target;
                                _this._insert(target.innerHTML);
                                // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                                return true;
                            }
                        }]
                    } // second tab end
                ] // tabs end
            });

            // ?????? panel
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ????????????
        _insert: function _insert(emoji) {
            var editor = this.editor;
            editor.cmd.do('insertHTML', '<span>' + emoji + '</span>');
        }
    };

    /*
     menu - table
     */
// ????????????
    function Table(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-table2"><i/></div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Table.prototype = {
        constructor: Table,

        onClick: function onClick() {
            if (this._active) {
                // ??????????????????
                this._createEditPanel();
            } else {
                // ???????????????
                this._createInsertPanel();
            }
        },

        // ???????????????????????? panel
        _createInsertPanel: function _createInsertPanel() {
            var _this = this;

            // ????????? id
            var btnInsertId = getRandom('btn');
            var textRowNum = getRandom('row');
            var textColNum = getRandom('col');

            var panel = new Panel(this, {
                width: 250,
                // panel ???????????? tab
                tabs: [{
                    // ??????
                    title: '????????????',
                    // ??????
                    tpl: '<div>\n                        <p style="text-align:left; padding:5px 0;">\n                            \u521B\u5EFA\n                            <input id="' + textRowNum + '" type="text" value="5" style="width:40px;text-align:center;"/>\n                            \u884C\n                            <input id="' + textColNum + '" type="text" value="5" style="width:40px;text-align:center;"/>\n                            \u5217\u7684\u8868\u683C\n                        </p>\n                        <div class="w-e-button-container">\n                            <button id="' + btnInsertId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    </div>',
                    // ????????????
                    events: [{
                        // ???????????????????????????
                        selector: '#' + btnInsertId,
                        type: 'click',
                        fn: function fn() {
                            var rowNum = parseInt($('#' + textRowNum).val());
                            var colNum = parseInt($('#' + textColNum).val());

                            if (rowNum && colNum && rowNum > 0 && colNum > 0) {
                                // form ????????????
                                _this._insert(rowNum, colNum);
                            }

                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }]
                } // first tab end
                ] // tabs end
            }); // panel end

            // ?????? panel
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ????????????
        _insert: function _insert(rowNum, colNum) {
            // ?????? table ??????
            var r = void 0,
                c = void 0;
            var html = '<table border="0" width="100%" cellpadding="0" cellspacing="0">';
            for (r = 0; r < rowNum; r++) {
                html += '<tr>';
                if (r === 0) {
                    for (c = 0; c < colNum; c++) {
                        html += '<th>&nbsp;</th>';
                    }
                } else {
                    for (c = 0; c < colNum; c++) {
                        html += '<td>&nbsp;</td>';
                    }
                }
                html += '</tr>';
            }
            html += '</table><p><br></p>';

            // ????????????
            var editor = this.editor;
            editor.cmd.do('insertHTML', html);

            // ?????? firefox ????????? resize ????????????
            editor.cmd.do('enableObjectResizing', false);
            editor.cmd.do('enableInlineTableEditing', false);
        },

        // ????????????????????? panel
        _createEditPanel: function _createEditPanel() {
            var _this2 = this;

            // ????????? id
            var addRowBtnId = getRandom('add-row');
            var addColBtnId = getRandom('add-col');
            var delRowBtnId = getRandom('del-row');
            var delColBtnId = getRandom('del-col');
            var delTableBtnId = getRandom('del-table');

            // ?????? panel ??????
            var panel = new Panel(this, {
                width: 320,
                // panel ???????????? tab
                tabs: [{
                    // ??????
                    title: '????????????',
                    // ??????
                    tpl: '<div>\n                        <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">\n                            <button id="' + addRowBtnId + '" class="left">\u589E\u52A0\u884C</button>\n                            <button id="' + delRowBtnId + '" class="red left">\u5220\u9664\u884C</button>\n                            <button id="' + addColBtnId + '" class="left">\u589E\u52A0\u5217</button>\n                            <button id="' + delColBtnId + '" class="red left">\u5220\u9664\u5217</button>\n                        </div>\n                        <div class="w-e-button-container">\n                            <button id="' + delTableBtnId + '" class="gray left">\u5220\u9664\u8868\u683C</button>\n                        </dv>\n                    </div>',
                    // ????????????
                    events: [{
                        // ?????????
                        selector: '#' + addRowBtnId,
                        type: 'click',
                        fn: function fn() {
                            _this2._addRow();
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }, {
                        // ?????????
                        selector: '#' + addColBtnId,
                        type: 'click',
                        fn: function fn() {
                            _this2._addCol();
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }, {
                        // ?????????
                        selector: '#' + delRowBtnId,
                        type: 'click',
                        fn: function fn() {
                            _this2._delRow();
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }, {
                        // ?????????
                        selector: '#' + delColBtnId,
                        type: 'click',
                        fn: function fn() {
                            _this2._delCol();
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }, {
                        // ????????????
                        selector: '#' + delTableBtnId,
                        type: 'click',
                        fn: function fn() {
                            _this2._delTable();
                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }]
                }]
            });
            // ?????? panel
            panel.show();
        },

        // ???????????????????????????????????????
        _getLocationData: function _getLocationData() {
            var result = {};
            var editor = this.editor;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            var nodeName = $selectionELem.getNodeName();
            if (nodeName !== 'TD' && nodeName !== 'TH') {
                return;
            }

            // ?????? td index
            var $tr = $selectionELem.parent();
            var $tds = $tr.children();
            var tdLength = $tds.length;
            $tds.forEach(function (td, index) {
                if (td === $selectionELem[0]) {
                    // ?????????????????????
                    result.td = {
                        index: index,
                        elem: td,
                        length: tdLength
                    };
                    return false;
                }
            });

            // ?????? tr index
            var $tbody = $tr.parent();
            var $trs = $tbody.children();
            var trLength = $trs.length;
            $trs.forEach(function (tr, index) {
                if (tr === $tr[0]) {
                    // ?????????????????????
                    result.tr = {
                        index: index,
                        elem: tr,
                        length: trLength
                    };
                    return false;
                }
            });

            // ????????????
            return result;
        },

        // ?????????
        _addRow: function _addRow() {
            // ????????????????????????????????????
            var locationData = this._getLocationData();
            if (!locationData) {
                return;
            }
            var trData = locationData.tr;
            var $currentTr = $(trData.elem);
            var tdData = locationData.td;
            var tdLength = tdData.length;

            // ??????????????????????????????
            var newTr = document.createElement('tr');
            var tpl = '',
                i = void 0;
            for (i = 0; i < tdLength; i++) {
                tpl += '<td>&nbsp;</td>';
            }
            newTr.innerHTML = tpl;
            // ??????
            $(newTr).insertAfter($currentTr);
        },

        // ?????????
        _addCol: function _addCol() {
            // ????????????????????????????????????
            var locationData = this._getLocationData();
            if (!locationData) {
                return;
            }
            var trData = locationData.tr;
            var tdData = locationData.td;
            var tdIndex = tdData.index;
            var $currentTr = $(trData.elem);
            var $trParent = $currentTr.parent();
            var $trs = $trParent.children();

            // ???????????????
            $trs.forEach(function (tr) {
                var $tr = $(tr);
                var $tds = $tr.children();
                var $currentTd = $tds.get(tdIndex);
                var name = $currentTd.getNodeName().toLowerCase();

                // new ?????? td????????????
                var newTd = document.createElement(name);
                $(newTd).insertAfter($currentTd);
            });
        },

        // ?????????
        _delRow: function _delRow() {
            // ????????????????????????????????????
            var locationData = this._getLocationData();
            if (!locationData) {
                return;
            }
            var trData = locationData.tr;
            var $currentTr = $(trData.elem);
            $currentTr.remove();
        },

        // ?????????
        _delCol: function _delCol() {
            // ????????????????????????????????????
            var locationData = this._getLocationData();
            if (!locationData) {
                return;
            }
            var trData = locationData.tr;
            var tdData = locationData.td;
            var tdIndex = tdData.index;
            var $currentTr = $(trData.elem);
            var $trParent = $currentTr.parent();
            var $trs = $trParent.children();

            // ???????????????
            $trs.forEach(function (tr) {
                var $tr = $(tr);
                var $tds = $tr.children();
                var $currentTd = $tds.get(tdIndex);
                // ??????
                $currentTd.remove();
            });
        },

        // ????????????
        _delTable: function _delTable() {
            var editor = this.editor;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            var $table = $selectionELem.parentUntil('table');
            if (!$table) {
                return;
            }
            $table.remove();
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            var $selectionELem = editor.selection.getSelectionContainerElem();
            if (!$selectionELem) {
                return;
            }
            var nodeName = $selectionELem.getNodeName();
            if (nodeName === 'TD' || nodeName === 'TH') {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     menu - video
     */
// ????????????
    function Video(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-play"><i/></div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Video.prototype = {
        constructor: Video,

        onClick: function onClick() {
            this._createPanel();
        },

        _createPanel: function _createPanel() {
            var _this = this;

            // ?????? id
            var textValId = getRandom('text-val');
            var btnId = getRandom('btn');

            // ?????? panel
            var panel = new Panel(this, {
                width: 350,
                // ?????? panel ?????? tab
                tabs: [{
                    // ??????
                    title: '????????????',
                    // ??????
                    tpl: '<div>\n                        <input id="' + textValId + '" type="text" class="block" placeholder="\u683C\u5F0F\u5982\uFF1A<iframe src=... ></iframe>"/>\n                        <div class="w-e-button-container">\n                            <button id="' + btnId + '" class="right">\u63D2\u5165</button>\n                        </div>\n                    </div>',
                    // ????????????
                    events: [{
                        selector: '#' + btnId,
                        type: 'click',
                        fn: function fn() {
                            var $text = $('#' + textValId);
                            var val = $text.val().trim();

                            // ?????????????????????
                            // <iframe height=498 width=510 src='http://player.youku.com/embed/XMjcwMzc3MzM3Mg==' frameborder=0 'allowfullscreen'></iframe>

                            if (val) {
                                // ????????????
                                _this._insert(val);
                            }

                            // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                            return true;
                        }
                    }]
                } // first tab end
                ] // tabs end
            }); // panel end

            // ?????? panel
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ????????????
        _insert: function _insert(val) {
            var editor = this.editor;
            editor.cmd.do('insertHTML', val + '<p><br></p>');
        }
    };

    /*
     menu - img
     */
// ????????????
    function Image(editor) {
        this.editor = editor;
        this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-image"><i/></div>');
        this.type = 'panel';

        // ???????????? active ??????
        this._active = false;
    }

// ??????
    Image.prototype = {
        constructor: Image,

        onClick: function onClick() {
            if (this._active) {
                this._createEditPanel();
            } else {
                this._createInsertPanel();
            }
        },

        _createEditPanel: function _createEditPanel() {
            var editor = this.editor;

            // id
            var width30 = getRandom('width-30');
            var width50 = getRandom('width-50');
            var width100 = getRandom('width-100');
            var delBtn = getRandom('del-btn');

            // tab ??????
            var tabsConfig = [{
                title: '????????????',
                tpl: '<div>\n                    <div class="w-e-button-container" style="border-bottom:1px solid #f1f1f1;padding-bottom:5px;margin-bottom:5px;">\n                        <span style="float:left;font-size:14px;margin:4px 5px 0 5px;color:#333;">\u6700\u5927\u5BBD\u5EA6\uFF1A</span>\n                        <button id="' + width30 + '" class="left">30%</button>\n                        <button id="' + width50 + '" class="left">50%</button>\n                        <button id="' + width100 + '" class="left">100%</button>\n                    </div>\n                    <div class="w-e-button-container">\n                        <button id="' + delBtn + '" class="gray left">\u5220\u9664\u56FE\u7247</button>\n                    </dv>\n                </div>',
                events: [{
                    selector: '#' + width30,
                    type: 'click',
                    fn: function fn() {
                        var $img = editor._selectedImg;
                        if ($img) {
                            $img.css('max-width', '30%');
                        }
                        // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                        return true;
                    }
                }, {
                    selector: '#' + width50,
                    type: 'click',
                    fn: function fn() {
                        var $img = editor._selectedImg;
                        if ($img) {
                            $img.css('max-width', '50%');
                        }
                        // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                        return true;
                    }
                }, {
                    selector: '#' + width100,
                    type: 'click',
                    fn: function fn() {
                        var $img = editor._selectedImg;
                        if ($img) {
                            $img.css('max-width', '100%');
                        }
                        // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                        return true;
                    }
                }, {
                    selector: '#' + delBtn,
                    type: 'click',
                    fn: function fn() {
                        var $img = editor._selectedImg;
                        if ($img) {
                            $img.remove();
                        }
                        // ?????? true????????????????????????????????????panel ?????????????????? panel ????????????
                        return true;
                    }
                }]
            }];

            // ?????? panel ?????????
            var panel = new Panel(this, {
                width: 300,
                tabs: tabsConfig
            });
            panel.show();

            // ????????????
            this.panel = panel;
        },

        _createInsertPanel: function _createInsertPanel() {
            var editor = this.editor;
            var uploadImg = editor.uploadImg;
            var config = editor.config;

            // id
            var upTriggerId = getRandom('up-trigger');
            var upFileId = getRandom('up-file');
            var linkUrlId = getRandom('link-url');
            var linkBtnId = getRandom('link-btn');

            // tabs ?????????
            var tabsConfig = [{
                title: '????????????',
                tpl: '<div class="w-e-up-img-container">\n                    <div id="' + upTriggerId + '" class="w-e-up-btn">\n                        <i class="w-e-icon-upload2"></i>\n                    </div>\n                    <div style="display:none;">\n                        <input id="' + upFileId + '" type="file" multiple="multiple" accept="image/jpg,image/jpeg,image/png,image/gif,image/bmp"/>\n                    </div>\n                </div>',
                events: [{
                    // ??????????????????
                    selector: '#' + upTriggerId,
                    type: 'click',
                    fn: function fn() {
                        var $file = $('#' + upFileId);
                        var fileElem = $file[0];
                        if (fileElem) {
                            fileElem.click();
                        } else {
                            // ?????? true ????????? panel
                            return true;
                        }
                    }
                }, {
                    // ??????????????????
                    selector: '#' + upFileId,
                    type: 'change',
                    fn: function fn() {
                        var $file = $('#' + upFileId);
                        var fileElem = $file[0];
                        if (!fileElem) {
                            // ?????? true ????????? panel
                            return true;
                        }

                        // ??????????????? file ????????????
                        var fileList = fileElem.files;
                        if (fileList.length) {
                            uploadImg.uploadImg(fileList);
                        }

                        // ?????? true ????????? panel
                        return true;
                    }
                }]
            }, // first tab end
                {
                    title: '????????????',
                    tpl: '<div>\n                    <input id="' + linkUrlId + '" type="text" class="block" placeholder="\u56FE\u7247\u94FE\u63A5"/></td>\n                    <div class="w-e-button-container">\n                        <button id="' + linkBtnId + '" class="right">\u63D2\u5165</button>\n                    </div>\n                </div>',
                    events: [{
                        selector: '#' + linkBtnId,
                        type: 'click',
                        fn: function fn() {
                            var $linkUrl = $('#' + linkUrlId);
                            var url = $linkUrl.val().trim();

                            if (url) {
                                uploadImg.insertLinkImg(url);
                            }

                            // ?????? true ???????????????????????????????????? panel
                            return true;
                        }
                    }]
                } // second tab end
            ]; // tabs end

            // ?????? tabs ?????????
            var tabsConfigResult = [];
            if ((config.uploadImgShowBase64 || config.uploadImgServer) && window.FileReader) {
                // ????????????????????????
                tabsConfigResult.push(tabsConfig[0]);
            }
            if (config.showLinkImg) {
                // ????????????????????????
                tabsConfigResult.push(tabsConfig[1]);
            }

            // ?????? panel ?????????
            var panel = new Panel(this, {
                width: 300,
                tabs: tabsConfigResult
            });
            panel.show();

            // ????????????
            this.panel = panel;
        },

        // ???????????? active ??????
        tryChangeActive: function tryChangeActive(e) {
            var editor = this.editor;
            var $elem = this.$elem;
            if (editor._selectedImg) {
                this._active = true;
                $elem.addClass('w-e-active');
            } else {
                this._active = false;
                $elem.removeClass('w-e-active');
            }
        }
    };

    /*
     ?????????????????????
     */

// ???????????????????????????
    var MenuConstructors = {};

    MenuConstructors.bold = Bold;

    MenuConstructors.head = Head;

    MenuConstructors.link = Link;

    MenuConstructors.italic = Italic;

    MenuConstructors.redo = Redo;

    MenuConstructors.strikeThrough = StrikeThrough;

    MenuConstructors.underline = Underline;

    MenuConstructors.undo = Undo;

    MenuConstructors.list = List;

    MenuConstructors.justify = Justify;

    MenuConstructors.foreColor = BackColor;

    MenuConstructors.backColor = ForeColor$1;

    MenuConstructors.quote = Quote;

    MenuConstructors.code = Code;

    MenuConstructors.emoticon = Emoticon;

    MenuConstructors.table = Table;

    MenuConstructors.video = Video;

    MenuConstructors.image = Image;

    /*
     ????????????
     */
// ????????????
    function Menus(editor) {
        this.editor = editor;
        this.menus = {};
    }

// ????????????
    Menus.prototype = {
        constructor: Menus,

        // ???????????????
        init: function init() {
            var _this = this;

            var editor = this.editor;
            var config = editor.config || {};
            var configMenus = config.menus || []; // ????????????????????????

            // ?????????????????????????????????
            configMenus.forEach(function (menuKey) {
                var MenuConstructor = MenuConstructors[menuKey];
                if (MenuConstructor && typeof MenuConstructor === 'function') {
                    // ??????????????????
                    _this.menus[menuKey] = new MenuConstructor(editor);
                }
            });

            // ??????????????????
            this._addToToolbar();

            // ????????????
            this._bindEvent();
        },

        // ??????????????????
        _addToToolbar: function _addToToolbar() {
            var editor = this.editor;
            var $toolbarElem = editor.$toolbarElem;
            var menus = this.menus;
            objForEach(menus, function (key, menu) {
                var $elem = menu.$elem;
                if ($elem) {
                    $toolbarElem.append($elem);
                }
            });
        },

        // ???????????? click mouseenter ??????
        _bindEvent: function _bindEvent() {
            var menus = this.menus;
            var editor = this.editor;
            objForEach(menus, function (key, menu) {
                var type = menu.type;
                if (!type) {
                    return;
                }
                var $elem = menu.$elem;
                var droplist = menu.droplist;
                var panel = menu.panel;

                // ????????????????????? bold
                if (type === 'click' && menu.onClick) {
                    $elem.on('click', function (e) {
                        if (editor.selection.getRange() == null) {
                            return;
                        }
                        menu.onClick(e);
                    });
                }

                // ?????????????????? head
                if (type === 'droplist' && droplist) {
                    $elem.on('mouseenter', function (e) {
                        if (editor.selection.getRange() == null) {
                            return;
                        }
                        // ??????
                        droplist.showTimeoutId = setTimeout(function () {
                            droplist.show();
                        }, 200);
                    }).on('mouseleave', function (e) {
                        // ??????
                        droplist.hideTimeoutId = setTimeout(function () {
                            droplist.hide();
                        }, 0);
                    });
                }

                // ????????????????????? link
                if (type === 'panel' && menu.onClick) {
                    $elem.on('click', function (e) {
                        e.stopPropagation();
                        if (editor.selection.getRange() == null) {
                            return;
                        }
                        // ??????????????????????????? panel
                        menu.onClick(e);
                    });
                }
            });
        },

        // ????????????????????????
        changeActive: function changeActive() {
            var menus = this.menus;
            objForEach(menus, function (key, menu) {
                if (menu.tryChangeActive) {
                    setTimeout(function () {
                        menu.tryChangeActive();
                    }, 100);
                }
            });
        }
    };

    /*
     ?????????????????????
     */

// ????????????????????????
    function getPasteText(e) {
        var clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData;
        var pasteText = void 0;
        if (clipboardData == null) {
            pasteText = window.clipboardData && window.clipboardData.getData('text');
        } else {
            pasteText = clipboardData.getData('text/plain');
        }

        return replaceHtmlSymbol(pasteText);
    }

// ???????????????html
    function getPasteHtml(e) {
        var clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData;
        var pasteText = void 0,
            pasteHtml = void 0;
        if (clipboardData == null) {
            pasteText = window.clipboardData && window.clipboardData.getData('text');
        } else {
            pasteText = clipboardData.getData('text/plain');
            pasteHtml = clipboardData.getData('text/html');
        }
        if (!pasteHtml && pasteText) {
            pasteHtml = '<p>' + replaceHtmlSymbol(pasteText) + '</p>';
        }
        if (!pasteHtml) {
            return;
        }

        // ??????word??????????????????????????????
        var docSplitHtml = pasteHtml.split('</html>');
        if (docSplitHtml.length === 2) {
            pasteHtml = docSplitHtml[0];
        }

        // ??????????????????
        pasteHtml = pasteHtml.replace(/<(meta|script|link).+?>/igm, '');

        // ????????????
        pasteHtml = pasteHtml.replace(/\s?(class|style)=('|").+?('|")/igm, '');

        return pasteHtml;
    }

// ???????????????????????????
    function getPasteImgs(e) {
        var result = [];
        var txt = getPasteText(e);
        if (txt) {
            // ???????????????????????????
            return result;
        }

        var clipboardData = e.clipboardData || e.originalEvent && e.originalEvent.clipboardData || {};
        var items = clipboardData.items;
        if (!items) {
            return result;
        }

        objForEach(items, function (key, value) {
            var type = value.type;
            if (/image/i.test(type)) {
                result.push(value.getAsFile());
            }
        });

        return result;
    }

    /*
     ????????????
     */

// ????????????
    function Text(editor) {
        this.editor = editor;
    }

// ????????????
    Text.prototype = {
        constructor: Text,

        // ?????????
        init: function init() {
            // ????????????
            this._bindEvent();
        },

        // ????????????
        clear: function clear() {
            this.html('<p><br></p>');
        },

        // ?????? ?????? html
        html: function html(val) {
            var editor = this.editor;
            var $textElem = editor.$textElem;
            if (val == null) {
                return $textElem.html();
            } else {
                $textElem.html(val);

                // ????????????????????????????????????????????????
                editor.initSelection();
            }
        },

        // ?????? ?????? text
        text: function text(val) {
            var editor = this.editor;
            var $textElem = editor.$textElem;
            if (val == null) {
                return $textElem.text();
            } else {
                $textElem.text('<p>' + val + '</p>');

                // ????????????????????????????????????????????????
                editor.initSelection();
            }
        },

        // ????????????
        append: function append(html) {
            var editor = this.editor;
            var $textElem = editor.$textElem;
            $textElem.append($(html));

            // ????????????????????????????????????????????????
            editor.initSelection();
        },

        // ????????????
        _bindEvent: function _bindEvent() {
            // ??????????????????
            this._saveRangeRealTime();

            // ??????????????????????????????
            this._enterKeyHandle();

            // ??????????????? <p><br></p>
            this._clearHandle();

            // ?????????????????????????????????????????????
            this._pasteHandle();

            // tab ????????????
            this._tabHandle();

            // img ??????
            this._imgHandle();
        },

        // ??????????????????
        _saveRangeRealTime: function _saveRangeRealTime() {
            var editor = this.editor;
            var $textElem = editor.$textElem;

            // ?????????????????????
            function saveRange(e) {
                // ??????????????????
                editor.selection.saveRange();
                // ???????????? ative ??????
                editor.menus.changeActive();
            }
            // ???????????????
            $textElem.on('keyup', saveRange);
            $textElem.on('mousedown', function (e) {
                // mousedown ?????????????????????????????????????????????????????????????????????
                $textElem.on('mouseleave', saveRange);
            });
            $textElem.on('mouseup', function (e) {
                saveRange();
                // ????????????????????????????????????????????????????????????????????????????????????
                $textElem.off('mouseleave', saveRange);
            });
        },

        // ??????????????????????????????
        _enterKeyHandle: function _enterKeyHandle() {
            var editor = this.editor;
            var $textElem = editor.$textElem;

            // ??????????????????????????? <p> ???????????????????????? <p>
            function pHandle(e) {
                var $selectionElem = editor.selection.getSelectionContainerElem();
                var $parentElem = $selectionElem.parent();
                if (!$parentElem.equal($textElem)) {
                    // ??????????????????
                    return;
                }
                var nodeName = $selectionElem.getNodeName();
                if (nodeName === 'P') {
                    // ?????????????????? P ??????????????????
                    return;
                }

                if ($selectionElem.text()) {
                    // ????????????????????????
                    return;
                }

                // ?????? <p> ???????????????????????? <p>?????????????????????
                var $p = $('<p><br></p>');
                $p.insertBefore($selectionElem);
                editor.selection.createRangeByElem($p, true);
                editor.selection.restoreSelection();
                $selectionElem.remove();
            }

            $textElem.on('keyup', function (e) {
                if (e.keyCode !== 13) {
                    // ???????????????
                    return;
                }
                // ??????????????????????????? <p> ???????????????????????? <p>
                pHandle(e);
            });

            // <pre><code></code></pre> ????????? ????????????
            function codeHandle(e) {
                var $selectionElem = editor.selection.getSelectionContainerElem();
                if (!$selectionElem) {
                    return;
                }
                var $parentElem = $selectionElem.parent();
                var selectionNodeName = $selectionElem.getNodeName();
                var parentNodeName = $parentElem.getNodeName();

                if (selectionNodeName !== 'CODE' || parentNodeName !== 'PRE') {
                    // ??????????????? ??????
                    return;
                }

                if (!editor.cmd.queryCommandSupported('insertHTML')) {
                    // ?????????????????? insertHTML ??????
                    return;
                }

                var _startOffset = editor.selection.getRange().startOffset;
                editor.cmd.do('insertHTML', '\n');
                editor.selection.saveRange();
                if (editor.selection.getRange().startOffset === _startOffset) {
                    // ???????????????????????????
                    editor.cmd.do('insertHTML', '\n');
                }

                // ??????????????????
                e.preventDefault();
            }

            $textElem.on('keydown', function (e) {
                if (e.keyCode !== 13) {
                    // ???????????????
                    return;
                }
                // <pre><code></code></pre> ????????? ????????????
                codeHandle(e);
            });
        },

        // ??????????????? <p><br></p>
        _clearHandle: function _clearHandle() {
            var editor = this.editor;
            var $textElem = editor.$textElem;

            $textElem.on('keydown', function (e) {
                if (e.keyCode !== 8) {
                    return;
                }
                var txtHtml = $textElem.html().toLowerCase().trim();
                if (txtHtml === '<p><br></p>') {
                    // ?????????????????????????????????????????????
                    e.preventDefault();
                    return;
                }
            });

            $textElem.on('keyup', function (e) {
                if (e.keyCode !== 8) {
                    return;
                }
                var $p = void 0;
                var txtHtml = $textElem.html().toLowerCase().trim();

                // firefox ?????? txtHtml === '<br>' ?????????????????? !txtHtml ??????
                if (!txtHtml || txtHtml === '<br>') {
                    // ????????????
                    $p = $('<p><br/></p>');
                    $textElem.html(''); // ?????????????????????????????? firefox ????????????
                    $textElem.append($p);
                    editor.selection.createRangeByElem($p, false, true);
                    editor.selection.restoreSelection();
                }
            });
        },

        // ??????????????????????????? ???????????????
        _pasteHandle: function _pasteHandle() {
            var editor = this.editor;
            var $textElem = editor.$textElem;

            // ????????????
            $textElem.on('paste', function (e) {
                if (UA.isIE()) {
                    // IE ????????????????????????
                    return;
                }

                // ??????????????????????????? execCommand ???????????????
                e.preventDefault();

                // ?????????????????????
                var pasteHtml = getPasteHtml(e);
                var pasteText = getPasteText(e);
                pasteText = pasteText.replace(/\n/gm, '<br>');

                var $selectionElem = editor.selection.getSelectionContainerElem();
                if (!$selectionElem) {
                    return;
                }
                var nodeName = $selectionElem.getNodeName();

                // code ???????????????
                if (nodeName === 'CODE' || nodeName === 'PRE') {
                    return;
                }

                // ?????????????????????????????????????????????
                if (nodeName === 'TD' || nodeName === 'TH') {
                    return;
                }

                if (nodeName === 'DIV' || $textElem.html() === '<p><br></p>') {
                    // ??? div??????????????????????????????????????????
                    if (!pasteHtml) {
                        return;
                    }
                    try {
                        // firefox ??????????????? pasteHtml ??????????????? <ul> ????????? <li>
                        // ???????????? insertHTML ?????????
                        editor.cmd.do('insertHTML', pasteHtml);
                    } catch (ex) {
                        // ???????????? pasteText ???????????????
                        editor.cmd.do('insertHTML', '<p>' + pasteText + '</p>');
                    }
                } else {
                    // ?????? div???????????????????????????????????????????????????????????????
                    if (!pasteText) {
                        return;
                    }
                    editor.cmd.do('insertHTML', '<p>' + pasteText + '</p>');
                }
            });

            // ????????????
            $textElem.on('paste', function (e) {
                e.preventDefault();

                // ?????????????????????
                var pasteFiles = getPasteImgs(e);
                if (!pasteFiles || !pasteFiles.length) {
                    return;
                }

                // ?????????????????????
                var $selectionElem = editor.selection.getSelectionContainerElem();
                if (!$selectionElem) {
                    return;
                }
                var nodeName = $selectionElem.getNodeName();

                // code ???????????????
                if (nodeName === 'CODE' || nodeName === 'PRE') {
                    return;
                }

                // ????????????
                var uploadImg = editor.uploadImg;
                uploadImg.uploadImg(pasteFiles);
            });
        },

        // tab ????????????
        _tabHandle: function _tabHandle() {
            var editor = this.editor;
            var $textElem = editor.$textElem;

            $textElem.on('keydown', function (e) {
                if (e.keyCode !== 9) {
                    return;
                }
                if (!editor.cmd.queryCommandSupported('insertHTML')) {
                    // ?????????????????? insertHTML ??????
                    return;
                }
                var $selectionElem = editor.selection.getSelectionContainerElem();
                if (!$selectionElem) {
                    return;
                }
                var $parentElem = $selectionElem.parent();
                var selectionNodeName = $selectionElem.getNodeName();
                var parentNodeName = $parentElem.getNodeName();

                if (selectionNodeName === 'CODE' && parentNodeName === 'PRE') {
                    // <pre><code> ??????
                    editor.cmd.do('insertHTML', '    ');
                } else {
                    // ????????????
                    editor.cmd.do('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
                }

                e.preventDefault();
            });
        },

        // img ??????
        _imgHandle: function _imgHandle() {
            var editor = this.editor;
            var $textElem = editor.$textElem;
            var selectedClass = 'w-e-selected';

            // ??????????????? selected ??????
            $textElem.on('click', 'img', function (e) {
                var img = this;
                var $img = $(img);

                // ????????????????????? selected ??????
                $textElem.find('img').removeClass(selectedClass);

                // ??????????????????????????????????????????????????????
                $img.addClass(selectedClass);
                editor._selectedImg = $img;

                // ????????????
                editor.selection.createRangeByElem($img);
            });

            // ??????????????? selected ??????
            $textElem.on('click  keyup', function (e) {
                if (e.target.matches('img')) {
                    // ???????????????????????????
                    return;
                }
                // ????????? selected ????????????????????????
                $textElem.find('img').removeClass(selectedClass);
                editor._selectedImg = null;
            });
        }
    };

    /*
     ??????????????? document.execCommand
     */

// ????????????
    function Command(editor) {
        this.editor = editor;
    }

// ????????????
    Command.prototype = {
        constructor: Command,

        // ????????????
        do: function _do(name, value) {
            var editor = this.editor;

            // ????????????????????????
            if (!editor.selection.getRange()) {
                return;
            }

            // ????????????
            editor.selection.restoreSelection();

            // ??????
            var _name = '_' + name;
            if (this[_name]) {
                // ??????????????????
                this[_name](value);
            } else {
                // ?????? command
                this._execCommand(name, value);
            }

            // ??????????????????
            editor.menus.changeActive();

            // ?????????????????????????????????????????????????????????
            editor.selection.saveRange();
            editor.selection.restoreSelection();

            // ?????? onchange
            editor.change && editor.change();
        },

        // ????????? insertHTML ??????
        _insertHTML: function _insertHTML(html) {
            var editor = this.editor;
            var range = editor.selection.getRange();

            // ???????????????????????? html ??????
            var test = /^<.+>$/.test(html);
            if (!test && !UA.isWebkit()) {
                // webkit ??????????????? html ???????????????
                throw new Error('?????? insertHTML ????????????????????????????????? html ??????');
            }

            if (this.queryCommandSupported('insertHTML')) {
                // W3C
                this._execCommand('insertHTML', html);
            } else if (range.insertNode) {
                // IE
                range.deleteContents();
                range.insertNode($(html)[0]);
            } else if (range.pasteHTML) {
                // IE <= 10
                range.pasteHTML(html);
            }
        },

        // ?????? elem
        _insertElem: function _insertElem($elem) {
            var editor = this.editor;
            var range = editor.selection.getRange();

            if (range.insertNode) {
                range.deleteContents();
                range.insertNode($elem[0]);
            }
        },

        // ?????? execCommand
        _execCommand: function _execCommand(name, value) {
            document.execCommand(name, false, value);
        },

        // ?????? document.queryCommandValue
        queryCommandValue: function queryCommandValue(name) {
            return document.queryCommandValue(name);
        },

        // ?????? document.queryCommandState
        queryCommandState: function queryCommandState(name) {
            return document.queryCommandState(name);
        },

        // ?????? document.queryCommandSupported
        queryCommandSupported: function queryCommandSupported(name) {
            return document.queryCommandSupported(name);
        }
    };

    /*
     selection range API
     */

// ????????????
    function API(editor) {
        this.editor = editor;
        this._currentRange = null;
    }

// ????????????
    API.prototype = {
        constructor: API,

        // ?????? range ??????
        getRange: function getRange() {
            return this._currentRange;
        },

        // ????????????
        saveRange: function saveRange(_range) {
            if (_range) {
                // ??????????????????
                this._currentRange = _range;
                return;
            }

            // ?????????????????????
            var selection = window.getSelection();
            if (selection.rangeCount === 0) {
                return;
            }
            var range = selection.getRangeAt(0);

            // ?????????????????????????????????????????????
            var $containerElem = this.getSelectionContainerElem(range);
            if (!$containerElem) {
                return;
            }
            var editor = this.editor;
            var $textElem = editor.$textElem;
            if ($textElem.isContain($containerElem)) {
                // ????????????????????????
                this._currentRange = range;
            }
        },

        // ????????????
        collapseRange: function collapseRange(toStart) {
            if (toStart == null) {
                // ????????? false
                toStart = false;
            }
            var range = this._currentRange;
            if (range) {
                range.collapse(toStart);
            }
        },

        // ?????????????????????
        getSelectionText: function getSelectionText() {
            var range = this._currentRange;
            if (range) {
                return this._currentRange.toString();
            } else {
                return '';
            }
        },

        // ????????? $Elem
        getSelectionContainerElem: function getSelectionContainerElem(range) {
            range = range || this._currentRange;
            var elem = void 0;
            if (range) {
                elem = range.commonAncestorContainer;
                return $(elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },
        getSelectionStartElem: function getSelectionStartElem(range) {
            range = range || this._currentRange;
            var elem = void 0;
            if (range) {
                elem = range.startContainer;
                return $(elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },
        getSelectionEndElem: function getSelectionEndElem(range) {
            range = range || this._currentRange;
            var elem = void 0;
            if (range) {
                elem = range.endContainer;
                return $(elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },

        // ??????????????????
        isSelectionEmpty: function isSelectionEmpty() {
            var range = this._currentRange;
            if (range && range.startContainer) {
                if (range.startContainer === range.endContainer) {
                    if (range.startOffset === range.endOffset) {
                        return true;
                    }
                }
            }
            return false;
        },

        // ????????????
        restoreSelection: function restoreSelection() {
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this._currentRange);
        },

        // ???????????????????????? &#8203 ???????????????
        createEmptyRange: function createEmptyRange() {
            var editor = this.editor;
            var range = this.getRange();
            var $elem = void 0;

            if (!range) {
                // ????????? range
                return;
            }
            if (!this.isSelectionEmpty()) {
                // ???????????????????????????????????????
                return;
            }

            // ??????????????? webkit ??????
            if (UA.isWebkit()) {
                // ?????? &#8203
                editor.cmd.do('insertHTML', '&#8203;');
                // ?????? offset ??????
                range.setEnd(range.endContainer, range.endOffset + 1);
                // ??????
                this.saveRange(range);
            } else {
                $elem = $('<strong>&#8203;</strong>');
                editor.cmd.do('insertElem', $elem);
                this.createRangeByElem($elem, true);
            }
        },

        // ?????? $Elem ????????????
        createRangeByElem: function createRangeByElem($elem, toStart, isContent) {
            // $elem - ??????????????? elem
            // toStart - true ???????????????false ????????????
            // isContent - ????????????Elem?????????
            if (!$elem.length) {
                return;
            }

            var elem = $elem[0];
            var range = document.createRange();

            if (isContent) {
                range.selectNodeContents(elem);
            } else {
                range.selectNode(elem);
            }

            if (typeof toStart === 'boolean') {
                range.collapse(toStart);
            }

            // ?????? range
            this.saveRange(range);
        }
    };

    /*
     ???????????????
     */

    function Progress(editor) {
        this.editor = editor;
        this._time = 0;
        this._isShow = false;
        this._isRender = false;
        this._timeoutId = 0;
        this.$textContainer = editor.$textContainerElem;
        this.$bar = $('<div class="w-e-progress"></div>');
    }

    Progress.prototype = {
        constructor: Progress,

        show: function show(progress) {
            var _this = this;

            // ????????????
            if (this._isShow) {
                return;
            }
            this._isShow = true;

            // ??????
            var $bar = this.$bar;
            if (!this._isRender) {
                var $textContainer = this.$textContainer;
                $textContainer.append($bar);
            } else {
                this._isRender = true;
            }

            // ????????????????????????100ms ???????????????
            if (Date.now() - this._time > 100) {
                if (progress <= 1) {
                    $bar.css('width', progress * 100 + '%');
                    this._time = Date.now();
                }
            }

            // ??????
            var timeoutId = this._timeoutId;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                _this._hide();
            }, 500);
        },

        _hide: function _hide() {
            var $bar = this.$bar;
            $bar.remove();

            // ????????????
            this._time = 0;
            this._isShow = false;
            this._isRender = false;
        }
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    /*
     ????????????
     */

// ????????????
    function UploadImg(editor) {
        this.editor = editor;
    }

// ??????
    UploadImg.prototype = {
        constructor: UploadImg,

        // ?????? debug ?????????????????????
        _alert: function _alert(alertInfo, debugInfo) {
            var editor = this.editor;
            var debug = editor.config.debug;

            if (debug) {
                throw new Error('wangEditor: ' + (debugInfo || alertInfo));
            } else {
                alert(alertInfo);
            }
        },

        // ????????????????????????
        insertLinkImg: function insertLinkImg(link) {
            var _this2 = this;

            if (!link) {
                return;
            }
            var editor = this.editor;

            var img = document.createElement('img');
            img.onload = function () {
                img = null;
                editor.cmd.do('insertHTML', '<img src="' + link + '" style="max-width:100%;"/>');
            };
            img.onerror = function () {
                img = null;
                // ????????????????????????
                _this2._alert('??????????????????', 'wangEditor: \u63D2\u5165\u56FE\u7247\u51FA\u9519\uFF0C\u56FE\u7247\u94FE\u63A5\u662F "' + link + '"\uFF0C\u4E0B\u8F7D\u8BE5\u94FE\u63A5\u5931\u8D25');
                return;
            };
            img.onabort = function () {
                img = null;
            };
            img.src = link;
        },

        // ????????????
        uploadImg: function uploadImg(files) {
            var _this3 = this;

            if (!files || !files.length) {
                return;
            }

            // ------------------------------ ?????????????????? ------------------------------
            var editor = this.editor;
            var config = editor.config;
            var maxSize = config.uploadImgMaxSize;
            var maxSizeM = maxSize / 1000 / 1000;
            var maxLength = config.uploadImgMaxLength || 10000;
            var uploadImgServer = config.uploadImgServer;
            var uploadImgShowBase64 = config.uploadImgShowBase64;
            var uploadFileName = config.uploadFileName || '';
            var uploadImgParams = config.uploadImgParams || {};
            var uploadImgHeaders = config.uploadImgHeaders || {};
            var hooks = config.uploadImgHooks || {};
            var timeout = config.uploadImgTimeout || 3000;
            var withCredentials = config.withCredentials;
            if (withCredentials == null) {
                withCredentials = false;
            }

            // ------------------------------ ?????????????????? ------------------------------
            var resultFiles = [];
            var errInfo = [];
            arrForEach(files, function (file) {
                var name = file.name;
                var size = file.size;
                if (/\.(jpg|jpeg|png|bmp|gif)$/i.test(name) === false) {
                    // ?????????????????????????????????
                    errInfo.push('\u3010' + name + '\u3011\u4E0D\u662F\u56FE\u7247');
                    return;
                }
                if (maxSize < size) {
                    // ??????????????????
                    errInfo.push('\u3010' + name + '\u3011\u5927\u4E8E ' + maxSizeM + 'M');
                    return;
                }

                // ?????????????????????????????????
                resultFiles.push(file);
            });
            // ??????????????????
            if (errInfo.length) {
                this._alert('?????????????????????: \n' + errInfo.join('\n'));
                return;
            }
            if (resultFiles.length > maxLength) {
                this._alert('??????????????????' + maxLength + '?????????');
                return;
            }

            // ??????????????????
            var formdata = new FormData();
            arrForEach(resultFiles, function (file) {
                var name = uploadFileName || file.name;
                formdata.append(name, file);
            });

            // ------------------------------ ???????????? ------------------------------
            if (uploadImgServer && typeof uploadImgServer === 'string') {
                // ????????????
                var uploadImgServerArr = uploadImgServer.split('#');
                uploadImgServer = uploadImgServerArr[0];
                var uploadImgServerHash = uploadImgServerArr[1] || '';
                objForEach(uploadImgParams, function (key, val) {
                    val = encodeURIComponent(val);

                    // ??????????????????????????? url ???
                    if (uploadImgServer.indexOf('?') > 0) {
                        uploadImgServer += '&';
                    } else {
                        uploadImgServer += '?';
                    }
                    uploadImgServer = uploadImgServer + key + '=' + val;

                    // ??????????????????????????? formdata ???
                    formdata.append(key, val);
                });
                if (uploadImgServerHash) {
                    uploadImgServer += '#' + uploadImgServerHash;
                }

                // ?????? xhr
                var xhr = new XMLHttpRequest();
                xhr.open('POST', uploadImgServer);

                // ????????????
                xhr.timeout = timeout;
                xhr.ontimeout = function () {
                    // hook - timeout
                    if (hooks.timeout && typeof hooks.timeout === 'function') {
                        hooks.timeout(xhr, editor);
                    }

                    _this3._alert('??????????????????');
                };

                // ?????? progress
                if (xhr.upload) {
                    xhr.upload.onprogress = function (e) {
                        var percent = void 0;
                        // ?????????
                        var progressBar = new Progress(editor);
                        if (e.lengthComputable) {
                            percent = e.loaded / e.total;
                            progressBar.show(percent);
                        }
                    };
                }

                // ????????????
                xhr.onreadystatechange = function () {
                    var result = void 0;
                    if (xhr.readyState === 4) {
                        if (xhr.status < 200 || xhr.status >= 300) {
                            // hook - error
                            if (hooks.error && typeof hooks.error === 'function') {
                                hooks.error(xhr, editor);
                            }

                            // xhr ??????????????????
                            _this3._alert('????????????????????????', '\u4E0A\u4F20\u56FE\u7247\u53D1\u751F\u9519\u8BEF\uFF0C\u670D\u52A1\u5668\u8FD4\u56DE\u72B6\u6001\u662F ' + xhr.status);
                            return;
                        }

                        result = xhr.responseText;
                        if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) !== 'object') {
                            try {
                                result = JSON.parse(result);
                            } catch (ex) {
                                // hook - fail
                                if (hooks.fail && typeof hooks.fail === 'function') {
                                    hooks.fail(xhr, editor, result);
                                }

                                _this3._alert('??????????????????', '????????????????????????????????????????????????: ' + result);
                                return;
                            }
                        }
                        if (!hooks.customInsert && result.errno != '0') {
                            // hook - fail
                            if (hooks.fail && typeof hooks.fail === 'function') {
                                hooks.fail(xhr, editor, result);
                            }

                            // ????????????
                            _this3._alert('??????????????????', '????????????????????????????????????????????? errno=' + result.errno);
                        } else {
                            if (hooks.customInsert && typeof hooks.customInsert === 'function') {
                                // ??????????????????????????????
                                hooks.customInsert(_this3.insertLinkImg.bind(_this3), result, editor);
                            } else {
                                // ????????????????????????
                                var data = result.data || [];
                                data.forEach(function (link) {
                                    _this3.insertLinkImg(link);
                                });
                            }

                            // hook - success
                            if (hooks.success && typeof hooks.success === 'function') {
                                hooks.success(xhr, editor, result);
                            }
                        }
                    }
                };

                // hook - before
                if (hooks.before && typeof hooks.before === 'function') {
                    hooks.before(xhr, editor, resultFiles);
                }

                // ????????? headers
                objForEach(uploadImgHeaders, function (key, val) {
                    xhr.setRequestHeader(key, val);
                });

                // ????????? cookie
                xhr.withCredentials = withCredentials;

                // ????????????
                xhr.send(formdata);

                // ???????????? return ??????????????????????????? base64 ????????????
                return;
            }

            // ?????? base64 ??????
            if (uploadImgShowBase64) {
                arrForEach(files, function (file) {
                    var _this = _this3;
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function () {
                        _this.insertLinkImg(this.result);
                    };
                });
            }
        }
    };

    /*
     ?????????????????????
     */

// id?????????
    var editorId = 1;

// ????????????
    function Editor(toolbarSelector, textSelector) {
        if (toolbarSelector == null) {
            // ?????????????????????????????????
            throw new Error('????????????????????????????????????????????????????????????????????????');
        }
        // id???????????????????????????????????????????????????
        this.id = 'wangEditor-' + editorId++;

        this.toolbarSelector = toolbarSelector;
        this.textSelector = textSelector;

        // ???????????????
        this.customConfig = {};
    }

// ????????????
    Editor.prototype = {
        constructor: Editor,

        // ???????????????
        _initConfig: function _initConfig() {
            // _config ??????????????????this.customConfig ???????????????????????????????????? merge ???????????????
            var target = {};
            this.config = Object.assign(target, config, this.customConfig);
        },

        // ????????? DOM
        _initDom: function _initDom() {
            var _this = this;

            var toolbarSelector = this.toolbarSelector;
            var $toolbarSelector = $(toolbarSelector);
            var textSelector = this.textSelector;

            var config$$1 = this.config;
            var zIndex = config$$1.zIndex || '10000';

            // ????????????
            var $toolbarElem = void 0,
                $textContainerElem = void 0,
                $textElem = void 0,
                $children = void 0;

            if (textSelector == null) {
                // ????????????????????????????????????????????????????????????toolbar ??? text ?????????????????????
                $toolbarElem = $('<div></div>');
                $textContainerElem = $('<div></div>');

                // ????????????????????????????????????????????????
                $children = $toolbarSelector.children();

                // ????????? DOM ?????????
                $toolbarSelector.append($toolbarElem).append($textContainerElem);

                // ?????????????????????????????????????????????
                $toolbarElem.css('background-color', '#f1f1f1').css('border', '1px solid #ccc');
                $textContainerElem.css('border', '1px solid #ccc').css('border-top', 'none').css('height', '150px');
            } else {
                // toolbar ??? text ????????????????????????????????????
                $toolbarElem = $toolbarSelector;
                $textContainerElem = $(textSelector);
                // ????????????????????????????????????????????????
                $children = $textContainerElem.children();
            }

            // ????????????
            $textElem = $('<div></div>');
            $textElem.attr('contenteditable', 'true').css('width', '100%').css('height', '100%');

            // ???????????????????????????
            if ($children && $children.length) {
                $textElem.append($children);
            } else {
                $textElem.append($('<p><br></p>'));
            }

            // ??????????????????DOM
            $textContainerElem.append($textElem);

            // ??????????????? class
            $toolbarElem.addClass('w-e-toolbar');
            $textContainerElem.addClass('w-e-text-container');
            $textContainerElem.css('z-index', zIndex);
            $textElem.addClass('w-e-text');

            // ????????????
            this.$toolbarElem = $toolbarElem;
            this.$textContainerElem = $textContainerElem;
            this.$textElem = $textElem;

            // ?????? onchange
            $textContainerElem.on('click keyup', function () {
                _this.change && _this.change();
            });
            $toolbarElem.on('click', function () {
                this.change && this.change();
            });
        },

        // ?????? command
        _initCommand: function _initCommand() {
            this.cmd = new Command(this);
        },

        // ?????? selection range API
        _initSelectionAPI: function _initSelectionAPI() {
            this.selection = new API(this);
        },

        // ??????????????????
        _initUploadImg: function _initUploadImg() {
            this.uploadImg = new UploadImg(this);
        },

        // ???????????????
        _initMenus: function _initMenus() {
            this.menus = new Menus(this);
            this.menus.init();
        },

        // ?????? text ??????
        _initText: function _initText() {
            this.txt = new Text(this);
            this.txt.init();
        },

        // ????????????????????????????????????????????????
        initSelection: function initSelection() {
            var $textElem = this.$textElem;
            var $children = $textElem.children();
            if (!$children.length) {
                // ????????????????????????????????????????????????????????????????????????
                $textElem.append($('<p><br></p>'));
                this.initSelection();
                return;
            }

            var $last = $children.last();
            var html = $last.html().toLowerCase();
            var nodeName = $last.getNodeName();
            if (html !== '<br>' && html !== '<br\/>' || nodeName !== 'P') {
                // ???????????????????????? <p><br></p>??????????????????????????????????????????
                $textElem.append($('<p><br></p>'));
                this.initSelection();
                return;
            }

            this.selection.createRangeByElem($last, true);
            this.selection.restoreSelection();
        },

        // ????????????
        _bindEvent: function _bindEvent() {
            // -------- ?????? onchange ?????? --------
            var onChangeTimeoutId = 0;
            var beforeChangeHtml = this.txt.html();
            var config$$1 = this.config;
            var onchange = config$$1.onchange;
            if (onchange && typeof onchange === 'function') {
                // ?????? change ?????????????????????
                // 1. $textContainerElem.on('click keyup')
                // 2. $toolbarElem.on('click')
                // 3. editor.cmd.do()
                this.change = function () {
                    // ?????????????????????
                    var currentHtml = this.txt.html();
                    if (currentHtml.length === beforeChangeHtml.length) {
                        return;
                    }

                    // ?????????????????????
                    if (onChangeTimeoutId) {
                        clearTimeout(onChangeTimeoutId);
                    }
                    onChangeTimeoutId = setTimeout(function () {
                        // ??????????????? onchange ??????
                        onchange(currentHtml);
                        beforeChangeHtml = currentHtml;
                    }, 200);
                };
            }
        },

        // ???????????????
        create: function create() {
            // ?????????????????????
            this._initConfig();

            // ????????? DOM
            this._initDom();

            // ?????? command API
            this._initCommand();

            // ?????? selection range API
            this._initSelectionAPI();

            // ?????? text
            this._initText();

            // ???????????????
            this._initMenus();

            // ?????? ????????????
            this._initUploadImg();

            // ????????????????????????????????????????????????
            this.initSelection();

            // ????????????
            this._bindEvent();
        }
    };

// ???????????????????????????
    try {
        document;
    } catch (ex) {
        throw new Error('??????????????????????????????');
    }

// polyfill
    polyfill();

// ????????? `inlinecss` ??????????????? css ?????????????????????????????? ./gulpfile.js ????????? `inlinecss` ?????????
    var inlinecss = '.w-e-toolbar,.w-e-text-container,.w-e-menu-panel {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-toolbar *,.w-e-text-container *,.w-e-menu-panel * {  padding: 0;  margin: 0;  box-sizing: border-box;}.w-e-clear-fix:after {  content: "";  display: table;  clear: both;}.w-e-toolbar .w-e-droplist {  position: absolute;  left: 0;  top: 0;  background-color: #fff;  border: 1px solid #f1f1f1;  border-right-color: #ccc;  border-bottom-color: #ccc;}.w-e-toolbar .w-e-droplist .w-e-dp-title {  text-align: center;  color: #999;  line-height: 2;  border-bottom: 1px solid #f1f1f1;  font-size: 13px;}.w-e-toolbar .w-e-droplist ul.w-e-list {  list-style: none;  line-height: 1;}.w-e-toolbar .w-e-droplist ul.w-e-list li.w-e-item {  color: #333;  padding: 5px 0;}.w-e-toolbar .w-e-droplist ul.w-e-list li.w-e-item:hover {  background-color: #f1f1f1;}.w-e-toolbar .w-e-droplist ul.w-e-block {  list-style: none;  text-align: left;  padding: 5px;}.w-e-toolbar .w-e-droplist ul.w-e-block li.w-e-item {  display: inline-block;  *display: inline;  *zoom: 1;  padding: 3px 5px;}.w-e-toolbar .w-e-droplist ul.w-e-block li.w-e-item:hover {  background-color: #f1f1f1;}@font-face {  font-family: \'icomoon\';  src: url(data:application/x-font-woff;charset=utf-8;base64,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) format(\'truetype\');  font-weight: normal;  font-style: normal;}[class^="w-e-icon-"],[class*=" w-e-icon-"] {  /* use !important to prevent issues with browser extensions that change fonts */  font-family: \'icomoon\' !important;  speak: none;  font-style: normal;  font-weight: normal;  font-variant: normal;  text-transform: none;  line-height: 1;  /* Better Font Rendering =========== */  -webkit-font-smoothing: antialiased;  -moz-osx-font-smoothing: grayscale;}.w-e-icon-close:before {  content: "\\f00d";}.w-e-icon-upload2:before {  content: "\\e9c6";}.w-e-icon-trash-o:before {  content: "\\f014";}.w-e-icon-header:before {  content: "\\f1dc";}.w-e-icon-pencil2:before {  content: "\\e906";}.w-e-icon-paint-brush:before {  content: "\\f1fc";}.w-e-icon-image:before {  content: "\\e90d";}.w-e-icon-play:before {  content: "\\e912";}.w-e-icon-location:before {  content: "\\e947";}.w-e-icon-undo:before {  content: "\\e965";}.w-e-icon-redo:before {  content: "\\e966";}.w-e-icon-quotes-left:before {  content: "\\e977";}.w-e-icon-list-numbered:before {  content: "\\e9b9";}.w-e-icon-list2:before {  content: "\\e9bb";}.w-e-icon-link:before {  content: "\\e9cb";}.w-e-icon-happy:before {  content: "\\e9df";}.w-e-icon-bold:before {  content: "\\ea62";}.w-e-icon-underline:before {  content: "\\ea63";}.w-e-icon-italic:before {  content: "\\ea64";}.w-e-icon-strikethrough:before {  content: "\\ea65";}.w-e-icon-table2:before {  content: "\\ea71";}.w-e-icon-paragraph-left:before {  content: "\\ea77";}.w-e-icon-paragraph-center:before {  content: "\\ea78";}.w-e-icon-paragraph-right:before {  content: "\\ea79";}.w-e-icon-terminal:before {  content: "\\f120";}.w-e-icon-page-break:before {  content: "\\ea68";}.w-e-icon-cancel-circle:before {  content: "\\ea0d";}.w-e-toolbar {  display: -webkit-box;  display: -ms-flexbox;  display: flex;  padding: 0 5px;  /* ???????????? */}.w-e-toolbar .w-e-menu {  position: relative;  z-index: 10001;  text-align: center;  padding: 5px 10px;  cursor: pointer;}.w-e-toolbar .w-e-menu i {  color: #999;}.w-e-toolbar .w-e-menu:hover i {  color: #333;}.w-e-toolbar .w-e-active i {  color: #1e88e5;}.w-e-toolbar .w-e-active:hover i {  color: #1e88e5;}.w-e-text-container .w-e-panel-container {  position: absolute;  top: 0;  left: 50%;  border: 1px solid #ccc;  border-top: 0;  box-shadow: 1px 1px 2px #ccc;  color: #333;  background-color: #fff;  /* ??? emotion panel ??????????????? */  /* ??????????????? panel ???????????? */}.w-e-text-container .w-e-panel-container .w-e-panel-close {  position: absolute;  right: 0;  top: 0;  padding: 5px;  margin: 2px 5px 0 0;  cursor: pointer;  color: #999;}.w-e-text-container .w-e-panel-container .w-e-panel-close:hover {  color: #333;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title {  list-style: none;  display: -webkit-box;  display: -ms-flexbox;  display: flex;  font-size: 14px;  margin: 2px 10px 0 10px;  border-bottom: 1px solid #f1f1f1;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-item {  padding: 3px 5px;  color: #999;  cursor: pointer;  margin: 0 3px;  position: relative;  top: 1px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-title .w-e-active {  color: #333;  border-bottom: 1px solid #333;  cursor: default;  font-weight: 700;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content {  padding: 10px 15px 10px 15px;  font-size: 16px;  /* ?????????????????? */  /* ??????????????? */}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input:focus,.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea:focus,.w-e-text-container .w-e-panel-container .w-e-panel-tab-content button:focus {  outline: none;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea {  width: 100%;  border: 1px solid #ccc;  padding: 5px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content textarea:focus {  border-color: #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text] {  border: none;  border-bottom: 1px solid #ccc;  font-size: 14px;  height: 20px;  color: #333;  text-align: left;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text].small {  width: 30px;  text-align: center;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text].block {  display: block;  width: 100%;  margin: 10px 0;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content input[type=text]:focus {  border-bottom: 2px solid #1e88e5;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button {  font-size: 14px;  color: #1e88e5;  border: none;  padding: 5px 10px;  background-color: #fff;  cursor: pointer;  border-radius: 3px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.left {  float: left;  margin-right: 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.right {  float: right;  margin-left: 10px;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.gray {  color: #999;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button.red {  color: #c24f4a;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container button:hover {  background-color: #f1f1f1;}.w-e-text-container .w-e-panel-container .w-e-panel-tab-content .w-e-button-container:after {  content: "";  display: table;  clear: both;}.w-e-text-container .w-e-panel-container .w-e-emoticon-container .w-e-item {  cursor: pointer;  font-size: 18px;  padding: 0 3px;  display: inline-block;  *display: inline;  *zoom: 1;}.w-e-text-container .w-e-panel-container .w-e-up-img-container {  text-align: center;}.w-e-text-container .w-e-panel-container .w-e-up-img-container .w-e-up-btn {  display: inline-block;  *display: inline;  *zoom: 1;  color: #999;  cursor: pointer;  font-size: 60px;  line-height: 1;}.w-e-text-container .w-e-panel-container .w-e-up-img-container .w-e-up-btn:hover {  color: #333;}.w-e-text-container {  position: relative;}.w-e-text-container .w-e-progress {  position: absolute;  background-color: #1e88e5;  bottom: 0;  left: 0;  height: 1px;}.w-e-text {  padding: 0 10px;  overflow-y: scroll;}.w-e-text p,.w-e-text h1,.w-e-text h2,.w-e-text h3,.w-e-text h4,.w-e-text h5,.w-e-text table,.w-e-text pre {  margin: 10px 0;  line-height: 1.5;}.w-e-text ul,.w-e-text ol {  margin: 10px 0 10px 20px;}.w-e-text blockquote {  display: block;  border-left: 8px solid #d0e5f2;  padding: 5px 10px;  margin: 10px 0;  line-height: 1.4;  font-size: 100%;  background-color: #f1f1f1;}.w-e-text code {  display: inline-block;  *display: inline;  *zoom: 1;  background-color: #f1f1f1;  border-radius: 3px;  padding: 3px 5px;  margin: 0 3px;}.w-e-text pre code {  display: block;}.w-e-text table {  border-top: 1px solid #ccc;  border-left: 1px solid #ccc;}.w-e-text table td,.w-e-text table th {  border-bottom: 1px solid #ccc;  border-right: 1px solid #ccc;  padding: 3px 5px;}.w-e-text table th {  border-bottom: 2px solid #ccc;  text-align: center;}.w-e-text:focus {  outline: none;}.w-e-text img {  cursor: pointer;}.w-e-text img:hover {  box-shadow: 0 0 5px #333;}.w-e-text img.w-e-selected {  border: 2px solid #1e88e5;}.w-e-text img.w-e-selected:hover {  box-shadow: none;}';

// ??? css ??????????????? <style> ???
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = inlinecss;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

// ??????
    var index = window.wangEditor || Editor;

    return index;

})));
