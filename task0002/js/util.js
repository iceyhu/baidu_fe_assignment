/*
@param {array=} tar 要判断类型的目标
@return {boolean} 为数组则返回真，否则返回假
Array的prototype常有可能被重写，使用isArray可确保判断正确
*/
function isArr(tar) {
    return Array.isArray(tar)
        ? true
        : false;
}
/*
@param {function=} tar 要判断类型的目标
@return {boolean} 为函数则返回真，否则返回假
*/
function isFunction(tar) {
    return typeof tar === 'function'
        ? true
        : false;
}
/*
@param {array|object|boolean|number|string} 目标值或引用
@return {array|object|boolean|number|string} 深度复制的目标
*/
function cloneObject(src) {
    var result = null;
    switch (typeof src) {
        // 目标为基本类型则直接复制
        case "boolean":
        case "number":
        case "string":
            result = src;
            break;
        case "object": 
            // 目标为日期类型则读取其时间，写入新Date对象
            if (src instanceof Date) {
                result = new Date(src.getTime());
            }
            // 目标为数组则遍历其，递归调用直至项值为基本类型
            else if (Array.isArray(src)) {
                result = [];
                for (var key in src) {
                    result[key] = cloneObject(src[key]);
                }
            }
            // 目标为对象则遍历其，递归调用直至属性值为基本类型
            else if (src instanceof Object) {
                result = {};
                for (var property in src) {
                    result[property] = cloneObject(src[property]);
                }
            }
            break;
        }
    return result;
};
/*
@param {array.<number|string>} 目标数组
@return {array.<number|string>} 去重的数组
*/
// 构建并返回去重的新数组。算是hack，旧数组没有被清理，但想不出来其它的了。
function uniqArrayHASH(arr) {
    if (Array.isArray(arr)) {
        var r = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (r.indexOf(arr[i]) === -1) {
                r.push(arr[i]);
            }
        }
        return r;
    }
    return false;
}
/*
@param {string} str 目标字符串
@return {string} 去除两端空格的字符串
三种方式
*/
// 最low的一种，找到正数和倒数的第一个分空格字符，返回它们之间的字符串（包含后者）
function simpleTrim(str) {
    if (typeof str === "string") {
        var i;
        var result = "";
        for (i = 0; i < str.length; i++) {
            if ((str[i] !== " ")) {
                var lt = i;
                break;
            }
        }
        for (i = str.length - 1; i > -1; i--) {
            if ((str[i] !== " ")) {
                var rt = i;
                break;
            }
        }        
        return str.slice(lt, rt + 1);
    }
    return false;
}
// 好一点的，用了正则
function trim(str) {
    // 取得第一个非空格字符（包含）和最后一个非空格字符（包含）之间的str
    var r = /[\S].*[\S]/.exec(str);
    // 如果失败则说明目标的非空格字符只有一个，取得此字符
    if (r === null) {
        r = /[\s]*(.)[\s]*/.exec(str);
        return r[1];
    }
    return r[0];
}
// 更好的，一行正则解决
function trim2(str) {
    // 直接将开头和结尾的空格换成空字符
    return str.replace(/(^\s+)|(\s+$)/, '');
}
/*
@param {array} arr 要遍历的数组
@param {function(index, item)）} fn 要在每项上执行的函数，接收每项的索引和值作为参数
@return {boolean} 遍历成功返回真，失败或参数类型错误返回假
*/
function each(arr, fn) {
    if (Array.isArray(arr)
        && typeof fn === 'function'
       ) {
        for (var i in arr) {
            fn(i, arr[i]);
        }
        return true;
    }
    return false;
}
/*
@param {object} obj 目标对象
@return {number} 目标对象中非继承而来的属性数量
*/
function getObjectLength(obj) {
    var count = 0;
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            count += 1;
        }
    }
    return count;
}
/*
@param {string} str 要测试的字符串
@return {boolean} 符合邮箱格式返回真，否则返回假
姑且认为邮箱格式如下： 
（非下划线开头的若干数字或字母或下划线）@（若干个数字或字母或下划线）【（点）（2个以上字母）】
【】的内容允许重复一次
*/
function isEmail(str) {
    return /^[a-zA-Z\d]+\w*@\w+(\.[a-zA-Z]{2,}){1,2}$/.test(str);
}
/*
@param {string} str 要测试的字符串
@return {boolean} 符合中国手机号格式返回真，否则返回假
*/
function isCnMobileNumber(str) {
    return /^(1\d{10})$/.test(str);
}
/*
@param {object} element 要查询的元素节点
@param {string} className 要查询的类名
@return {boolean} 目标含此类返回真，不含或参数类型错误返回假
*/
function hasClass(element, className) {
    if (element.nodeType === 1 
        && typeof className === 'string'
       ) {
        var curClass = element.getAttribute('class');
        if (curClass !== null) {
            // 目标有类属性且包含目标类时返回真
            if (curClass.split(' ').indexOf(className) !== -1) {
                return true;
            }
            return false;
        }
        return false;
    }
}
/*
@param {object} element 目标元素节点
@param {string} className 要添加的类名
@return {boolean} 操作完成之后目标含此类则返回真，参数类型错误返回假
*/
function addClass(element, newClassName) {
    if (element.nodeType === 1 
        && typeof newClassName === 'string'
       ) {
        var curClass = element.getAttribute('class');
        if (curClass === null) {
            // 目标无类属性则直接设参数2为类
            element.setAttribute('class', newClassName);
        } else {
            // 否则若已含有目标类则不操作
            if (curClass.split(' ').indexOf(newClassName) === -1) {
                // 不含有目标类在当前类字符串后追加空格和目标类，重写类属性
                element.setAttribute('class', curClass + ' ' + newClassName);
            }
        }
        return true;
    } else {
        return false;
    }
}
/*
@param {object} element 目标元素节点
@param {string} className 要移除的类名
@return {boolean} 操作完成之后目标不含此类则返回真，参数类型错误返回假
*/
function removeClass(element, tarClass) {
    if (element.nodeType === 1 
        && typeof tarClass === "string" 
       ) {
        var curClass = element.getAttribute("class");
        // 目标有类属性时
        if (curClass !== null) {            
            var classArr = curClass.split(' ');
            var tarClassPos = classArr.indexOf(tarClass);
            if (tarClassPos !== -1) {
                // 包含目标类时，从原类名数组中移除此项，用空格联接为字符串，重设类属性为此字符串
                classArr.splice(tarClassPos, 1);
                element.setAttribute('class', classArr.join(' '));
            }
        }
        return true;
    } else {
        return false;
    }
}
/*
@param {object} element 目标节点
@param {object} targetElement 要对比的节点
@return {boolean} 二参数为兄弟节点则返回真，否则返回假
*/
function isSiblingNode(element, targetElement) {
    return (element.parentNode === targetElement.parentNode)
        ? true
        : false;            
}
/*
@param {object} element 目标元素节点
@return {object} 返回目标相当于浏览器的坐标对象，目标非元素节点返回null
*/
function getPosition(element) {
    if (element.nodeType === 1) {
        var x = element.offsetLeft;
        var y = element.offsetTop;
        var posParent = element.offsetParent;
        while (posParent !== null) {
            x += posParent.offsetLeft;
            y += posParent.offsetTop;
            posParent = posParent.offsetParent;
        }
        return {x, y};
    } else {
        return null;
    }
}
/*
@param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@param {object=} root 提供此参数时以其为遍历起点，否则以document为起点 
@return {object|boolean} 返回范围中第一个符合条件的元素，无则返回false（没搞懂为什么不是返回null）
*/
function query(selector, root) {
    var root = root instanceof Node
        ? root
        : document.documentElement;        
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
    var node = walker.nextNode(); 
    switch (true) {
        case (/^#([\w-]+$)/).test(selector):
            var tarId = RegExp.$1;
            while (node) {
                // 返回值
                if (node.id === tarId) {
                    return node;
                }
                node = walker.nextNode();
            }
            break;
        case (/^\.([\w-]*[\w-\.]+$)/).test(selector):
            var tarClasses = RegExp.$1.split('.');
            while (node) {
                if (node.hasAttribute('class')) {
                    // 遍历到每一个含class的元素时声明一真值
                    var matches = true;
                    // 遍历从参数中解析的class数组
                    for (var i in tarClasses) {
                        // 若此数组中有任何类名不存在于目标元素中
                        if (!hasClass(node, tarClasses[i])) {
                            // 则将真值改为假，退出循环
                            matches = false;
                            break;
                        }
                    }
                    // 循环结束后若真值仍为真，则返回此元素
                    if (matches) {
                        return node;    
                        break;
                    }
                }
                node = walker.nextNode();
            }
            break;
        case (/^(\w+)$/).test(selector):
            var tarTag = RegExp.$1;
            while (node) {
                if (node.nodeName === tarTag.toUpperCase()) {
                    return node;
                }
                node = walker.nextNode();
            }            
            break;
        case (/^\[([\w]+)\]$/).test(selector):
            var tarAttr = RegExp.$1;
            while (node) {
                if (node[tarAttr] !== undefined) {
                    return node;
                }
                node = walker.nextNode();
            }
            break;
        case (/^\[(.+)=(.+)\]$/).test(selector):
            var tarAttr = RegExp.$1;
            var tarValue = RegExp.$2;
            while (node) {
                if (node.getAttribute(tarAttr) === tarValue) {
                    return node;
                }
                node = walker.nextNode();
            }
            break;
    }
    return null;
}
/*
@param {string} selectors 1至3个以空格分隔的"#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@return {object|boolean} 返回层叠参数1中的选择器查询到的第一个结果，无则返回false
*/
function $(selectors) {
    var selectorArr = selectors.split(/\s+/);
    switch (selectorArr.length) {
        case 1:
            return query(selectorArr[0]);
        case 2:
            var queryResult1 = query(selectorArr[0]);
            return queryResult1 === false
                ? false
                : query(selectorArr[1], queryResult1);
        case 3:
            var queryResult1 = query(selectorArr[0]);
            if (queryResult1 === false) {
                return false;
            }
            var queryResult2 = query(selectorArr[1], queryResult1);
            return queryResult2 === false
                ? false
                : query(selectorArr[2], queryResult2);
        default:
            return false;
    }           
}    
/*
@param {string} selectors 1至3个以空格分隔的"#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@param {string} event 目标事件名
@param {function} listener 要绑定之响应函数
@return {boolean} 绑定成功返回true，否则false
*/
function addListenerOnEvent(selectors, event, listener) {
    if (typeof selectors === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {
        var tarElement = $(selectors);
        if (tarElement === false) {
            return false;
        }
        if (tarElement.addEventListener) {
            tarElement.addEventListener(event, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
        }
        return true;
    }
    return false;
}
/*
@param {string} selectors 1至3个以空格分隔的"#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@param {string} event 目标事件名
@param {function} listener 要移除之响应函数
@return {boolean} 移除成功返回true，否则false
*/
function removeListenerOnEvent(selectors, event, listener) {
    if (typeof selectors === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {
        var tarElement = $(selectors);
        if (tarElement === false) {
            return false;
        }
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
        }
        return true;
    }
    return false;   
}
/*
@param {string} selectors 1至3个以空格分隔的"#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@param {string} tag 被代理的参数1查询结果下的元素的标签名
@param {string} event 目标事件名
@param {function} listener 要绑定之响应函数
@return {boolean} 绑定成功返回true，否则false
*/
function delegateByTagName(selectors, tag, event, listener) {
    if (typeof selectors === 'string'
        && typeof tag === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {
        // tarElement的标签为tag的子元素节点的event冒泡到tarElement时，在事件目标（即该节点）上调用listener
        addListenerOnEvent(selectors, event, function(e){
            var e = arguments[0] || window.event;
            var et = e.target || e.srcElement;
            if (et !== null
                && et.nodeName === tag.toUpperCase()
               ) {
                listener.call(et, e);
                return true;        
            }
        });
    }
    return false;
}
/*
@param {string} selectors 1至3个以空格分隔的"#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的查询字符串
@param {string} className 被代理的参数1查询结果下的元素的类名
@param {string} event 目标事件名
@param {function} listener 要绑定之响应函数
@return {boolean} 绑定成功返回true，否则false
*/
function delegateByClassName(selectors, className, event, listener) {
    if (typeof selectors === 'string'
        && typeof className === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
       ) {
        // 含className类的子元素节点的event冒泡到tarElement时，在事件目标（即该节点）上调用listener
        addListenerOnEvent(selectors, event, function(e){
            var e = arguments[0] || window.event;
            var et = e.target || e.srcElement;
            if (et !== null
                && hasClass(et, className)
               ) {
                listener.call(et, e);
                return true;        
            }
        });
    }
    return false;
}
/*
将以上几个函数写入$作为其方法
*/
$.on = addListenerOnEvent;
$.un = removeListenerOnEvent;
$.delegateByTagName = delegateByTagName;
$.delegateByClassName = delegateByClassName;
$.click = function(s, fn) {
    addListenerOnEvent(s, 'click', fn)
}
/*
@return {number} 浏览器为IE时返回其版本，否则返回-1
*/
function isIE() {
    // 11版本的window有ActiveXObject属性
    if (window.ActiveXObject !== undefined) {
        return 11;
    }    
    // 否则取得userAgent属性字符串对应IE的部分
    return (/MSIE ([\d.]+)/).test(navigator.userAgent)
        ? RegExp.$1
        : -1
}
/*
@param {string} cookieName 要设置的cookie名
@param {string} cookieValue 要设置的cookie值
@param {number=} expiredays 经过这些天后过期
@return {boolean} 成功则返回真，参数错误或失败返回假
*/
function setCookie(cookieName, cookieValue, expiredays) {
    if (typeof cookieName === 'string'
        && typeof cookieValue === 'string'
       ) {
        var cookieText = encodeURIComponent(cookieName) + '=' + encodeURIComponent(cookieValue);        
        if (typeof expiredays === 'number') {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + expiredays);
            cookieText = cookieText.concat('; expires=' + expireDate.toUTCString());
        }
        document.cookie = cookieText;
        return true;
    } else {
        return false;
    }
}
/*
@param {string} cookieName 要获取的cookie名
@return {string} 成功则返回cookie值，参数错误或失败返回空字符串
*/
function getCookie(cookieName) {
    if (typeof cookieName === 'string') {
        var cookieString = document.cookie;
        var start = cookieString.indexOf(encodeURIComponent(cookieName) + '=');
       if (start !== -1) {
            // 获取start位置之后第一个';'的位置
            var semicolonPos = cookieString.indexOf(';', start);
            // 无则获取cookie长度值（可以看成最后一个字符后面的位置）
            var end = (semicolonPos !== -1)
                ? semicolonPos
                : cookieString.length;
            // 获取目标cookie键值对
            var tarPair = cookieString.slice(start, end);
            var rawCookieValue = tarPair.match(/=(.*)/)[1];
            // 返回解码后的值
            return decodeURIComponent(rawCookieValue);
        }
        return '';
    } else {
        return '';
    }
}
/*
@param {string} url 接收请求的url
@param {object} options 选项对象，必须包含'&'联结的赋值字符串或键值对象形式的data属性、分别在请求接收成功和失败时执行的2个方法；请求方式为可选，默认为post
@return {boolean} 成功返回真，参数错误返回假
*/
function ajax(url, options) {
    if (typeof url === 'string'
        && options.data !== undefined
        && typeof options.onfail === 'function'
        && typeof options.onsuccess === 'function'
       ) {       
        // option中未定义type则使用post
        var type = 
            (options.type !== undefined)
            ? options.type
            : 'post';    
        // 若option中data值为字符串则取得其值并编码
        var dataStr = 
            (typeof options.data === 'string')
            ? encodeURIComponent(options.data) 
            : '';
        // 否则说明data值为对象。那么取得其中每个属性值对儿，编码，用'='联结，用'&'联结整个数组，赋给data
        if (dataStr === '') {
            var dataArr = [];
            for (var p in options.data) {
                dataArr.push(encodeURIComponent(p) + '=' + encodeURIComponent(options.data[p]));
            }
            var data = dataArr.join('&');
        }
        // 生成请求并发送
        var r = new XMLHttpRequest();
        r.open(type, url, true);
        r.send(data);
        // 为此请求的状态变化设置响应函数
        r.onreadystatechange = function() {
            // 状态为接收完成时，根据状态码执行相应方法。
            if (r.readyState === 4) {
                if (r.status === 200) {
                    options.onsuccess();
                } else {
                    options.onfail();
                }   
            }
        }        
        return true;
    } else {
        return false;
    }    
}

/////////////////////////////////////////
/////////////////////////////////////////
// 以上为ife作业内要求的，以下的是自己要用的 //
/////////////////////////////////////////
/////////////////////////////////////////

/*
@param {object} newNode 要插入的新节点
@param {object} tarNode 目标位置的节点
在目标节点前插入新节点
*/
function insertAfter(newNode, tarNode) {
    var parNode = tarNode.parentNode;
    if (parNode.lastChild === tarNode) {
        parNode.appendChild(newNode);
    } else {
        parNode.insertBefore(newNode, tarNode.nextSibling);
    }
}
/*
@param {string} str 要判断的字符串
@return {boolean} 参数是yyyy-mm-dd的有效日期返回真，否则返回假。不判断闰年
*/
function isValidDate(str) {
    if (typeof str === 'string') {
        if (/^([012]\d\d\d)-(([01]\d)-([0123]\d))$/.test(str)) {
            var y = parseInt(RegExp.$1);
            var m = parseInt(RegExp.$3);
            var d = parseInt(RegExp.$4);
            var md = (RegExp.$2);
            if (y !== 0 
                && m !== 0
                && d !== 0
                ) {
                if (y < 2100
                    && m < 13
                    && d < 32
                   ) {
                    if (['02-30', '02-31', '04-31', '06-31', '09-31', '11-31'].indexOf(md) === -1 ) {
                        return true;
                    }
                }                    
            }       
        }
    }
    return false;
}