// --- 需求 ---
//
//文本框：
//    focus时显示value的搜索结果，无value无反应；
//    blur时显示value的搜索结果消失，无value无反应；
//结果列表：
//    上下键选中选项、click选项、回车键选中选项时将其innerhtml值写入value；
//    esc时value的搜索结果消失；

var lib = ['test1', 'test2', 'a1', 'a324', 'x1', 'tool', 'a2'];
var box = $('.box');
var resultList = $('.results');

//方法：返回在库中的搜索结果
function searchInLib(str) {
    if (str === '') {
        return false;
    }
    var results = [];
    for (var i = 0, l = lib.length; i < l; i++) {
        if (lib[i].indexOf(str.toLowerCase()) === 0) {
            results.push(lib[i]);
        }
    }
    return results ? results : false;
}
//方法：将输入框的value写入resltList
function renderResults() {
    var r = searchInLib(box.value);
    if (!!r) {
        resultList.style.display = 'block';
        var html = '';
        for (var i = 0, l = r.length; i < l; i++) {
            html += '<li>' + r[i] + '</li>';
        }
        resultList.innerHTML = html;
    } else {
        resultList.style.display = 'none';
        resultList.innerHTML = '';
    }  
}
//方法：定义resultList中被选中的项的变化
function focusItem(item) {
    var all = resultList.childNodes;
    for (var i = 0, l = all.length; i < l; i++) {
        removeClass(all[i], 'focused');
    }
    addClass(item, 'focused');
    box.value = item.innerHTML;
}


//方法：控制resultList的选中项，返回新项位置的index
function navigateInResultList(kc, pos) {    
    // resultList中无内容时不操作
    if (resultList.hasChildNodes()) {
        
        var items = resultList.childNodes;
        
        if (kc === 40) {
            pos += 1;
            if (items[pos] !== undefined) {
                focusItem(items[pos]);
            } else {
                focusItem(items[0]);
                pos = 0;
            }
        }
        if (kc === 38) {
            pos += -1;
            if (items[pos] !== undefined) {
                focusItem(items[pos]);
            } else {
                focusItem(items[items.length - 1]);
                pos = items.length - 1;
            }
        }        
        
        return pos;   
    }
}

//为box的keyup和click定义响应处理：
var pos = -1;
$.on('.box', 'keyup', function(e){
    var keyCode = e.keyCode;
    switch (keyCode) {
        case 38:
        case 40:
            pos = navigateInResultList(keyCode, pos);
            break;
        case 27:
            resultList.style.display = 'none';
            resultList.innerHTML = '';
            break;
        default:
            renderResults();
            // 输入字符时把项之间的导航起点重置为-1
            pos = -1;
            break;
    }
});
$.click('.box', renderResults);

//为resultList的mouseover和click定义响应处理：
$.delegate('.results', 'li', 'mouseover', function(e){
    focusItem((e.target));
});
$.delegate('.results', 'li', 'click', function(){
    box.value = this.innerHTML;
    resultList.style.display = 'none';
    resultList.innerHTML = '';
});


