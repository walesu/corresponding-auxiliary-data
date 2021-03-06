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

/*
 @name: Material.js
 @description: 素材部分工具函数
 @require: 
 @date: 2015/7/20
 @author: Nero(Nero@Nero-zou.com)
 */
'use strict';
var Material = _material();
function _material() {

    var Material = {};//素材模块所有工具方法

    Material.transforImgUrl = transforImgUrl;//转换微信图片地址

    /**
     * 转换 微信图片地址
     * @param url
     * @returns {XML|string|*}
     */
    function transforImgUrl(url){
        url = url.replace(/^https?:\/\/mmbiz\.q(logo|pic)\.cn\/mmbiz/i, 'https://mmbiz.qlogo.cn/mmbiz');
        url = url.replace(/&wxfrom=\d+/g, '');
        url = url.replace(/wxfrom=\d+/g, '');
        url = url.replace(/&tp=[a-z]+/g, '');
        url = url.replace(/tp=[a-z]+/g, '');
        url = url.replace(/\?&/g, '?');
        url = url.replace(/&$/g, '');
        return url;
    }

    return Material;

};