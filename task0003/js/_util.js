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
将以上几个函数作为$的方法
*/
$.on = addListenerOnEvent;
$.un = removeListenerOnEvent;
$.delegateByTagName = delegateByTagName;
$.delegateByClassName = delegateByClassName;
$.click = function(s, fn) {
    addListenerOnEvent(s, 'click', fn)
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
@param {array.<number|string>} 目标数组
@return {array.<number|string>} 去重的数组
构建并返回去重的新数组。算是hack，旧数组没有被清理，但想不出来其它的了。
*/
function uniqArray(arr) {
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
直接将开头和结尾的空格换成空字符
*/
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/, '');
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
            var md = (RegExp.$2);0
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
/*
@param {string} howItSounds 好消息还是坏消息？传入'good'或'bad'
@param {string} str 要显示的消息字符串
*/
function showInfo(howItSounds, str) {
    var targetArea = 
        howItSounds === 'good'
        ? $('.notif.good')
        : $('.notif.bad');
    targetArea.innerHTML = str;
    setTimeout(function(){
        targetArea.innerHTML = '';
    }, 3000);
}
/*
部分内容宽度自适应
*/
function resizeToWindowSize() {    
    var wdWt = 
        window.innerWidth <= 900
        ? 900
        : window.innerWidth;
    var wdHt = 
        window.innerHeight <= 600
        ? 600
        : window.innerHeight;
    $('#wrapper').style.width = wdWt + 'px';  
    $('#wrapper').style.height = wdHt + 'px';    
    $('#category').style.height =
        $('#tasks').style.height = (wdHt - 60) + 'px'; 
    $('.tasklist').style.height = (wdHt - 140) + 'px';
    $('#content').style.width = (wdWt - 480) + 'px';
    $('#content .main').style.height = (wdHt - 200) + 'px';   
}
/*
@param {string} targetHtml 替换content内容为给定字符串
@param {boolean} coverOption 使#cover显示或隐藏
适应窗口宽度
*/ 
function replaceContentHtml(targetHtml, coverOption) {
    $('#content').innerHTML = targetHtml;
    switch (coverOption) {
        case true:
            $('#cover').style.display = 'block';
            break;
        case false:
            $('#cover').style.display = 'none';
            break;
    }
    resizeToWindowSize();
}
/*
@param {array.<object>} tLib Task实例数组
@param {boolean} alsoCheckDuplicate 查询同名task是否已存在
@return {boolean} 标题、日期和正文均符合输入要求时返回true；否则显示错误信息并返回false
*/
function validateInput(tLib, alsoCheckDuplicate){
    var t = trim($('#content .title').value);
    var d = $('#content .date').value;
    var m = trim($('#content .main').value);
    if (!t.match(/^.{1,22}$/)) {
        showInfo('bad', '任务标题长度应在1至22字之间。')
        return false;
    }
    if (!isValidDate(d)) {
        showInfo('bad', '任务日期应为yyyy-mm-dd格式。')
        return false;
    }
    if (!m.match(/^.{1,500}$/)) {
        showInfo('bad', '任务正文长度应在1至500字之间。')
        return false;
    }
    if (alsoCheckDuplicate === true) {
        // 若输入的title与当前高亮的cate的tasks中任意一项的title相同则报错
        var isDuplicated = tLib.some(function(item){
            return item.title === t;
        });
        if (isDuplicated) {
            showInfo('bad', '已存在相同名称的任务。')
            return false;
        }
    }        
    return true;
}
/*
@param {object} task1 Task实例
@param {object} task2 Task实例
@return {number} date属性去掉'-'后值较大的参数排在前面
*/
function dateDescending(task1, task2){
    if (task1.date.replace('-', '') > task2.date.replace('-', '')) {
        return -1;
    } else {
        return 1;
    }
}
