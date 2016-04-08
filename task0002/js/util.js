function query(selector, root) {
    if (typeof selector === 'string') {

        var root = root instanceof Node
            ? root
            : document.documentElement;        
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        var node = walker.nextNode();        
        var result = null;       
        
        var idMatch = selector.match(/(^#)([\w-]+$)/);
        if (idMatch) {
            var id = idMatch[2];
            while (node) {
                if (node.getAttribute('id') === id) {
                    result = node;
                    break;
                }
                node = walker.nextNode();
            }            
            if (result) {
                return result;
            }
        }
        var classMatch = selector.match(/(^\.)([\w\.-]*[^\.]$)/);
        if (classMatch) {
            var classes = classMatch[2].split('.');
            var targetClasses = [];
            while (node) {
                var isInTarget = true;
                if (node.hasAttribute('class')) {
                    targetClasses = node.getAttribute('class').split(' ');
                    for (var i = 0, l = classes.length; i<l; i++) {
                        if (targetClasses.indexOf(classes[i]) === -1) {
                            isInTarget = false;
                            break;
                        }
                    }
                    if (isInTarget) {
                        result = node;
                        break;
                    }
                }
                node = walker.nextNode();
            }
            if (result) {
                return result;
            }
        }
        var tagMatch = selector.match(/^[\w-]+$/);
        if (tagMatch) {
            result = root.getElementsByTagName(tagMatch);
            if (result[0]) {
                return result[0];
            }
        }
        var attrExistsMatch = selector.match(/(^\[)([\w-]+)(\]$)/);
        if (attrExistsMatch) {
            var attr = attrExistsMatch[2];
            while (node) {
                if (node.hasAttribute(attr)) {
                    result = node;
                    break;
                }
                node = walker.nextNode();
            }
            if (result) {
                return result;
            }
        }
        var attrMatch = selector.match(/(^\[)([\w-]+)=([\w-]+)(\]$)/);
        if (attrMatch) {
            var attrName = attrMatch[2];
            var attrValue = attrMatch[3];
            while (node) {
                if (node.getAttribute(attrName) === attrValue) {
                    result = node;
                    break;
                }
                node = walker.nextNode();
            }
            if (result) {
                return result;
            }           
        }              
        return null;
    } else {
        return false;
    }
}
function $(selectors) {
    if (typeof selectors === 'string') {
        var s = selectors.split(/\s+/);
        var l = s.length;
        var element = null;
        if (l > 2) {
            return false;
        } else {
            var queryResult1 = query(s[0], document.documentElement);
            if (!queryResult1) {
                return false;
            }
            if (l === 1) {
                element = queryResult1;
            } else {
                var queryResult2 = query(s[1], queryResult1);
                if (!queryResult2) {
                    return false;
                } else {
                    element = queryResult2;
                }
            }
            return element;
        }
        return null;        
    }
    return false;
}    
$.on = function(selectors, event, listener) {
    if (typeof selectors === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {
        
        // check if SELECTORS are valid
        var s = selectors.split(/\s+/);
        var l = s.length;
        var element = null;
        if (l > 2) {
            return false;
        } else {
            var queryResult1 = query(s[0], document.documentElement);
            if (!queryResult1) {
                return false;
            }
            if (l === 1) {
                element = queryResult1;
            } else {
                var queryResult2 = query(s[1], queryResult1);
                if (!queryResult2) {
                    return false;
                } else {
                    element = queryResult2;
                }
            }            
        }
        if (!element) {
            return false;
        }
        
        // add listener
        if (element.addEventListener) {
            element.addEventListener(event, listener, false);
            return true;
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
            return true;
        }
        
    }
    return false;
}
$.un = function(selectors, event, listener) {
    if (typeof selectors === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {

        // check if SELECTORS are valid
        var s = selectors.split(/\s+/);
        var l = s.length;
        var element = null;
        if (l > 2) {
            return false;
        } else {
            var queryResult1 = query(s[0]);
            if (!queryResult1) {
                return false;
            } else if (l === 1) {
                element = queryResult1;
            } else if (l === 2) {
                var queryResult2 = query(s[1], queryResult1);
                if (!queryResult2) {
                    return false;
                } else {
                    element = queryResult2;
                }
            }
        }
        if (!element) {
            return false;
        }
        
        // remove listener
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, false);
            return true;
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
            return true;
        }
        
    }
    return false;   
}
$.click = function(selectors, listner) {
    return $.on(selectors, 'click', listner);
}
$.delegate = function(selectors, tag, event, listener) {
    if (typeof selectors === 'string'
        && typeof tag === 'string'
        && typeof event === 'string'
        && typeof listener === 'function'
        ) {

        // check if SELECTORS are valid
        var s = selectors.split(/\s+/);
        var l = s.length;
        var element = null;
        if (l > 2) {
            return false;
        } else {
            var queryResult1 = query(s[0]);
            if (!queryResult1) {
                return false;
            } else if (l === 1) {
                element = queryResult1;
            } else if (l === 2) {
                var queryResult2 = query(s[1], queryResult1);
                if (!queryResult2) {
                    return false;
                } else {
                    element = queryResult2;
                }
            }
        }
        if (!element) {
            return false;
        }
        
        // delegate
        // element的标签为tag的子元素节点的event冒泡到element时，在事件目标（即该节点）上调用listener
        element.addEventListener(event, function(){
            var e = arguments[0] || window.event;
            var t = e.target || e.srcElement;
            if (t !== null 
                && t.nodeName.toLowerCase() === tag
               ) {
                listener.call(t, e);
            }
        }, false);
        return true;        
    }
    return false;
}
function isIE() {
    var ver = -1;
    if (window.ActiveXObject !== undefined) {
        ver = 11;
    }    
    var matchIE = navigator.userAgent.match(/MSIE ([\d.]+)/);
    if (matchIE) {
        ver = matchIE[1];
    }
    return ver;
}
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
        return cookieText;
    } else {
        return false;
    }
}
function getCookie(cookieName) {
    if (typeof cookieName === 'string') {
        var cookie = document.cookie;
        if (cookie !== '') {
            var target = encodeURIComponent(cookieName);
            var start = cookie.indexOf(cookieName + '=');
            if (start > -1) {
                var end = cookie.indexOf(';', start);
                if (end === -1) {
                    end = cookie.length;
                }
                return cookie.slice(start, end);
            }
            return null;
        }
        return null;
    } else {
        return false;
    }
}
function addURLQuery(url, name, value) {
    if (typeof url === 'string'
        && typeof name === 'string'
        && typeof value === 'string'
       ) {
        if (url.indexOf('?') < 0) {
            url += '?';
        } else {
            url += '&';
        }
        url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
        return url;
    } else {
        return false;
    }
}
function ajax(url, options) {
    if (typeof url === 'string'
        && typeof options === 'object'
       ) {
       
        var type = options.type ? options.type : 'post';    
        var data = typeof options.data === 'string' ? encodeURIComponent(options.data) : '';
        if (data === '') {
            var dataArr = [];
            for (var p in options.data) {
                dataArr.push(encodeURIComponent(p) + '=' + encodeURIComponent(options.data[p]));
            }
            data = dataArr.join('&');
        }

        var x = new XMLHttpRequest();
        x.open(type, url, true);
        x.send(data);
        x.onreadystatechange = function() {
            if (x.readyState === 4) {
                if (x.status === 200) {
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
function isArr(arr) {
    if (Array.isArray(arr)) {
        return true;
    } else {
        return false;
    }
}
function each(arr, fn) {
    if (arr[0] !== undefined
        && typeof fn === 'function'
       ) {
        for (var i = 0, l = arr.length; i<l; i++) {
            fn(arr[i], i);
        }
        return true;
    }
    return false;
}
function addClass(element, newClassName) {
    if (element instanceof Node
        && element.nodeType === 1 
        && typeof newClassName === 'string'
        && newClassName !== ' '
       ) {
        var curClass = element.getAttribute('class');
        if (curClass === null) {
            element.setAttribute('class', newClassName);
            return true;
        } else {
            // 如果已存在给定的类名则返回
            if (curClass.split(' ').indexOf(newClassName) !== -1) {
                return true;
            } else {
                element.setAttribute('class', curClass + ' ' + newClassName);
                return true;
            }
        }
    } else {
        return false;
    }
}
function removeClass(element, oldClassName) {
    if (element.nodeType === 1 
        && typeof oldClassName === "string" 
        && oldClassName !== " "
       ) {
        var curClass = element.getAttribute("class");
        if (curClass === null) {
            return true;
        } else {
            var oldClassStrPos = curClass.split(' ').indexOf(oldClassName);
            if (oldClassStrPos === -1) {
                return true;
            } else {
                var newClass = curClass.split(' ');
                newClass.splice(oldClassStrPos, 1);
                element.setAttribute('class', newClass);
                return newClass;
            }
        }        
    } else {
        return false;
    }
}
function isSiblingNode(element, targetElement) {
    if (element.nodeName === 1 
        && targetElement.nodeName === 1
       ) {
        if (element.parentNode === targetElement.parentNode) {
            return true;
        } else {
            return false;            
        }
    } else {
        console.log("Invalid parameters.");
        return false;
    }
}
function getPosition(element) {
    if (element.nodeType === 1) {
        var x = element.offsetLeft,
            y = element.offsetTop,
            posParent = element.offsetParent,
            result = {};
        while (posParent !== null) {
            x += posParent.offsetLeft;
            y += posParent.offsetTop;
            posParent = posParent.offsetParent;
        }
        result.x = x;
        result.y = y;
        return result;
    } else {
        return false;
    }
}
function isCnMobilePhone(phone) {
    if (typeof phone === "string") {
        var pattern = /^(1\d{10})$/;
        if (pattern.test(phone)) {
            return true;
        }
    }
    return false;
}
function isEmail(emailStr) {
    if (typeof emailStr === "string") {
        var pattern = /^([a-zA-Z\d]+\w*)@(\w+\.)([a-zA-Z]{2,})(\.[a-zA-Z]{2,})?$/i;
        if (pattern.test(emailStr)) {
            return true;
        }
    }
    return false;
}
function getObjectLength(obj) {
    if (obj instanceof Object 
        && obj !== null
       ) {
        var count = 0;
        for (var property in obj) {
            count += 1;
        }
        return count;
    }
    return false;
}
function trim(str) {
    if (typeof str === "string" 
        && str !== ""
       ) {
        // 取得第一个非空格字符（包含）和最后一个非空格字符（包含）之间的str
        var r = /[\S].*[\S]/.exec(str);
        // 如果失败则说明目标的非空格字符只有一个。
        if (r === null) {
            r = /[\s]*(.)[\s]*/.exec(str);
            return r[1];
        }
        return r[0];
    }
    return false;
}
function simpleTrim(str) {
    if (typeof str === "string") {
        var i,
            lt,
            rt;
            result = "";
        for (i = 0; i < str.length; i++) {
            if ((str[i] !== " ")) {
                lt = i;
                break;
            }
        }
        for (i = str.length - 1; i > -1; i--) {
            if ((str[i] !== " ")) {
                rt = i;
                break;
            }
        }        
        return str.slice(lt, rt+1);
    }
    return false;
}
// 返回了去重的新数组，优点是简单，缺点是原数组未被清理
function uniqArrayHASH(arr) {
    if (Array.isArray(arr)) {
        var result = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            if (result.indexOf(arr[i]) === -1) {
                result.push(arr[i]);
            }
        }
        return result;
    }
    return false;
}
// 若给定数组的第一项与之后任一项相同，则移除第一项，返回true；
// 未重复或数组长度为1，返回false；
function removeFisrtItemIfDuplicate(arr) {
    var t = arr[0];
    for (var i = 1, l = arr.length; i < l; i++) {
        if (arr[i] === t) {
            arr.shift();
            break;
            return true;
        } else {
            return false;
        }
    }
}
function uniqArray(arr) {
    if (Array.isArray(arr)) {
        if (removeFisrtItemIfDuplicate(arr)) {
            console.log('ff')
        }
    } else {
        return false;
    }
}
var a = [1, 'f', 'c', 3, 'f', 1];
console.log(removeFisrtItemIfDuplicate(a))

function cloneObject(src) {
    var result = null;
    switch (typeof src) {
        case "boolean":
        case "number":
        case "string":
            result = src;
            break;
        case "object": 
            if (src instanceof Date) {
                result = new Date(src.getTime());
            }
            else if (Array.isArray(src)) {
                result = [];
                for (var key in src) {
                    result[key] = cloneObject(src[key]);
                }
            }
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

