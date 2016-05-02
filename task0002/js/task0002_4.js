/* 
--- 需求 ---

文本框：
    focus时显示value的搜索结果，无value无反应；
    blur时显示value的搜索结果消失，无value无反应；
结果列表：
    上下键选中选项、click选项、回车键选中选项时将其innerhtml值写入value；
    esc时value的搜索结果消失；
*/

var lib = ['test1', 'test2', 'a1', 'a324', 'x1', 'tool', 'a2'];
var box = $('.search .input');
var resultList = $('.search .results');

/*
@param {string} str 要搜索的字符串
@return {array.<string>} lib中的等于此字符串或以此字符串开头的项构成的数组，无则返回空数组
*/
function searchInLib(str) {
    if (str === '') {
        return [];
    }
    return lib.filter(function(item){
        return item.indexOf(str.toLowerCase()) === 0;
    })
}
/*
通过输入值查到至少一项时，将项写入list，使list显示；否则重置list的html，使其隐藏
*/
function renderResults() {
    var r = searchInLib(box.value);
    if (Array.isArray(r)) {
        resultList.style.display = 'block';
        var html = '';
        for (var i in r) {
            html += ''
            + '<li>' 
            + r[i] 
            + '</li>';
        }
        resultList.innerHTML = html;
    } else {
        resultList.style.display = 'none';
        resultList.innerHTML = '';
    }  
}
/*
移除原高亮项（如有）的样式，给目标添加高亮样式
将目标内容写入输入框
*/
function focusItem(tarLi) {
    var currFocused = resultList.getElementsByClassName('focused')[0];
    if (currFocused !== undefined) {
        removeClass(currFocused, 'focused');        
    }
    addClass(tarLi, 'focused');
    box.value = tarLi.innerHTML;
}
/*
@param {number} keyCode 输入的键码
@param {number} pos 当前高亮li的位置
@return {number} 操作后高亮li的位置
根据键码上移/下移高亮li，内容写入输入框
*/
function navResultList(keyCode, pos) {    
    // resultList中无内容时不操作
    if (resultList.hasChildNodes()) {        
        var allLi = resultList.childNodes;        
        if (keyCode === 40) {
            pos += 1;
            if (allLi[pos] !== undefined) {
                focusItem(allLi[pos]);
            } else {
                focusItem(allLi[0]);
                pos = 0;
            }
        }
        if (keyCode === 38) {
            pos += -1;
            if (allLi[pos] !== undefined) {
                focusItem(allLi[pos]);
            } else {
                focusItem(allLi[allLi.length - 1]);
                pos = allLi.length - 1;
            }
        }
        return pos;   
    }
}
// 定义导航的起点
var pos = -1;
$.on('.search .input', 'keyup', function(e){
    var kc = e.keyCode;
    switch (kc) {
        // 上下键
        case 38:
        case 40:
            pos = navResultList(kc, pos);
            break;
        // esc键
        case 27:
            resultList.style.display = 'none';
            resultList.innerHTML = '';
            break;
        // 其它
        default:
            renderResults();
            // 起点重置为-1
            pos = -1;
            break;
    }
});
$.click('.search .input', renderResults);
$.delegate('.results', 'li', 'mouseover', function(e){
    focusItem(e.target);
});
$.delegate('.results', 'li', 'click', function(){
    box.value = this.innerHTML;
    resultList.style.display = 'none';
    resultList.innerHTML = '';
});


