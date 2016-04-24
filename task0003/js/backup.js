function Category(name) {
    this.name = name;
}
function Task(title, date, main) {
    this.title = title;
    this.date = date;
    this.main = main;
    this.finished = false;
}


var lib = [new Category('默认分类')];

function renderLibToCategoryView() {
    var fllbInnerHtml =  '<h1 class="main-title"><span class="name">分类列表</span><span class="undone">' + 0 + '</span></h1>';
    for (var i in lib) {
         fllbInnerHtml += '<li class="outer"><h1 class="title"><span class="name">' + lib[i].title + '</span><span class="undone">' + lib[i].undone + '</span><img class="remove" src="img/icon-delete.png"></h1></li>';
    }
    $('.fllb').innerHTML = fllbInnerHtml;
}


///////////////////////////////////左///////////////////////////////////
// 显示/隐藏outerLi的content（如有）
function switchInnerLiDisplay(outerLi, option) {
    var c = outerLi.getElementsByClassName('content')[0];
    if (c !== undefined) {
        if (option === 'on') {
            c.style.display = 'block';
        } else if (option === 'off') {
            c.style.display = 'none';
        } else if (option === undefined) {
            c.style.display = 
                c.style.display === 'none'
                ? 'block'
                : 'none';            
        }
    }
}
// 添加/删除outerLi的active类
function switchActiveStatus(outerLi, option) {
    if (option === 'on') {
        addClass(outerLi, 'active');
    } else if (option === 'off') {
        removeClass(outerLi, 'active');
    } else if (option === undefined) {
        if (hasClass(outerLi, 'active')) {
            removeClass(outerLi, 'active');
        } else {
            addClass(outerLi, 'active');
        }
    }
}
// 关闭其它。传入true则高亮并展开列表的第一个outerLi
function refreshOuterLi(activeFisrtItemOrNot) {
    var allOuterLi = $('.fllb').getElementsByClassName('outer');
    for (var i = 0, l = allOuterLi.length; i < l; i++) {
        switchInnerLiDisplay(allOuterLi[i], 'off');
        switchActiveStatus(allOuterLi[i], 'off');
    }
    if (activeFisrtItemOrNot === true) {
        switchInnerLiDisplay(allOuterLi[0], 'on');
        switchActiveStatus(allOuterLi[0], 'on');
    }        
}
// click监听：用fllb代理，目标为outer li上的title和span
function outerLiClickListener(e) {
    refreshOuterLi();
    // 根据不同目标确定父outerLi的位置
    var et = e.target;
    var targetOuterLi = null;
    if (hasClass(et, 'title')) {
        targetOuterLi = et.parentElement;
    }
    if (et.nodeName === 'SPAN') {
        targetOuterLi = et.parentElement.parentElement;
    }
    switchActiveStatus(targetOuterLi);
    switchInnerLiDisplay(targetOuterLi);    
}    
// click监听：add category按钮
function addingCategoryListener(e) {
    var r = window.prompt('请输入新的分类名称。');
    if (r === null) {
        return false;
    }
    while (r.match(/^\s*$/)) {
        r = window.prompt('分类名称不能为空。');
    }    
    var activeOuterLi = $('.fllb').getElementsByClassName('active')[0];
    // 将trim后的输入写入新outer，置于当前active的outer之后
    var newOuterLi = document.createElement('li');
    newOuterLi.className = 'outer';
    newOuterLi.innerHTML = '<h1 class="title"><span class="name">' + trim2(r) + '</span><span class="undone">0</span><img class="remove" src="img/icon-delete.png"></h1><ul class="content"></ul>'
    insertAfter(newOuterLi, activeOuterLi);
    // deactive旧outer，active新outer
    switchInnerLiDisplay(activeOuterLi, 'off');
    switchActiveStatus(activeOuterLi, 'off');
    switchActiveStatus(newOuterLi, 'on');    
}
// mouseover监听：outer li的title
function outerLiTitleRemoveBtnListener(e) {
    var title = e.target;
    var outerLi = title.parentElement;
   // 若目标为第一个outer（默认分类）则返回
    if (outerLi.previousElementSibling.previousElementSibling === null) {
        return false;
    }
    // 根据目标不同确定处理其自身还是父元素
    switch (e.type) {
        case 'mousemove':
            title.getElementsByClassName('remove')[0].style.display = 'block';   
            break;
        case 'mouseout':
            title.getElementsByClassName('remove')[0].style.display = 'none';
            break;
    }
}
// 从outer的nodelist中取得分类名称
function getCategoryNameFromOuterLi(outer) {
    return outer.getElementsByClassName('name')[0].innerHTML;
}
// 监听：outer li的remove按钮
function removeBtnListemer(e) {
    var removeBtn = e.target;
    var outerLi = removeBtn.parentElement.parentElement;
    switch (e.type) {
        case 'mousemove':
            removeBtn.style.display = 'block';
            break;
        case 'mouseout':
            removeBtn.style.display = 'none';
            break;
        case 'click':
            var categoryName = getCategoryNameFromOuterLi(outerLi);
            console.log(outerLi)
            var r = confirm('确定删除分类「' + categoryName + '」吗？此操作不可撤销。');
            if (r) {
                // 删除此outer
                outerLi.parentElement.removeChild(outerLi);
                // 刷新新列表
                refreshOuterLi(true);
            }
            break;
    }
}
//初始化左侧
function initCategoryDiv() {
    renderLibToCategoryView();
//    refreshOuterLi(true);    
//    
//    $.delegateByClassName('.fllb', 'title', 'click', outerLiClickListener);    
//    $.delegate('.fllb', 'span', 'click', outerLiClickListener);    
//    
//    $.click('#category .add', addingCategoryListener);
//    
//    $.delegateByClassName('.fllb', 'title', 'mousemove', outerLiTitleRemoveBtnListener);
//    $.delegateByClassName('.fllb', 'title', 'mouseout', outerLiTitleRemoveBtnListener);
//    
//    $.delegateByClassName('.fllb', 'remove', 'mousemove', removeBtnListemer);
//    $.delegateByClassName('.fllb', 'remove', 'mouseout', removeBtnListemer);
//    $.delegateByClassName('.fllb', 'remove', 'click', removeBtnListemer);
}

///////////////////////////////////中///////////////////////////////////

function initTasksDiv() {
    $.click('#tasks .add', addingTaskListener);
}

///////////////////////////////////右///////////////////////////////////
// 重写右侧content
function activeContentDiv(option) {
    // 打开遮罩层
    $('#cover').style.display = 'block';
    // 根据参数决定新建还是编辑
    var tar = $('#content');
    var tarTitle = $('#content .title');
    var tarDate = $('#content .date');
    var tarMain = $('#content .main');
    addClass(tarTitle, 'editable');
    addClass(tarDate, 'editable');
    addClass(tarMain, 'editable');
    switch (option) {
        case 'new':
            tar.innerHTML = '<form><input class="title editable" type="text" placeholder="标题（18字以内）" maxlength=18><input class="date editable" type="text" placeholder="日期（yyyy-mm-dd）" maxlength=10><textarea class="main editable" placeholder="正文（500字以内）" maxlength=500></textarea></form><img class="save save-or-cancel" src="img/icon-save.png"><img class="cancel save-or-cancel" src="img/icon-cancel.png">'
            $('.main.editable').style.height = (window.innerHeight - 200) + 'px';
            break;
        case 'edit':
            break;
    }    
}
// click监听：add task按钮
function addingTaskListener(e) {
    activeContentDiv('new');
}
function showAlert(str) {
    $('.edit-alert').innerHTML = str;
}
// keyup监听：右侧title，date，main。事件发生时判断目标value是否有效。将其作为alert块的属性
function editTaskListener(e) {
    var focusedArea = e.target;
    var tarValue = focusedArea.value;
    $('.edit-alert').innerHTML = '';
    switch (true) {
        case hasClass(focusedArea, 'title'):
            if (tarValue.length === 18) {
                showAlert('任务标题不能超过18个字。');
            }
            break;
        case hasClass(focusedArea, 'date'):
            if (tarValue.length === 10
                && !/^\d{4}-\d{2}-\d{2}$/.test(tarValue)
            ) {
                showAlert('请输入yyyy-mm-dd格式的日期。');
            }
            break;
        case hasClass(focusedArea, 'main'):
            if (tarValue.length === 500) {
                showAlert('任务正文不能超过500个字。');
            }
            break;
    }
}
// click监听：save和cancel按钮
function newTaskCtrlListener(e) {
    var et = e.target;
    if (hasClass(et, 'save')) {
        var titleText = $('.title.editable').value;
        var dateText = $('.date.editable').value;
        var mainText = $('.main.editable').value;
        if (!/^.{1,18}$/.test(titleText)) {
            showAlert('标题应在1-18字之间。');
            return false;
        }
        if (!isValidDate(dateText)) {
            showAlert('未输入yyyy-mm-dd格式的有效日期。');
            return false;
        }
        if (!/^.{1,500}$/.test(mainText)) {
            showAlert('正文应在1-500字之间。');
            return false;
        }            
        var task = new Task(titleText, dateText, mainText);
        console.log(task);         
        
    } else if (hasClass(et, 'cancel')) {
        var cancel = confirm('确定放弃此次编辑吗？');
        // todo
    }
}
// 初始化右侧
function initContentDiv() {
    $.delegateByClassName('#content', 'title', 'keyup', editTaskListener);
    $.delegateByClassName('#content', 'date', 'keyup', editTaskListener);
    $.delegateByClassName('#content', 'main', 'keyup', editTaskListener);
    $.delegateByClassName('#content', 'save-or-cancel', 'click', newTaskCtrlListener);
}
///////////////////////////////////总///////////////////////////////////
// 响应式
function initResizingResponsive() {    
    var wdWt = window.innerWidth;
    var wdHt = window.innerHeight;
    if (wdWt <= 900) {
        wdWt = 900;
    }
    if (wdHt <= 600) {
        wdHt = 600;
    }
    
    var wrap = $('#wrapper');    
    var d1 = $('#category');    
    var d2 = $('#tasks');     
    var d2in = $('#tasks .calender');    
    var d3 = $('#content');
    var d3in = $('#content .main');   
    
    wrap.style.width = wdWt + 'px';
    d3.style.width = (wdWt - 460) + 'px';

    wrap.style.height = wdHt + 'px';        
    d2.style.height = d1.style.height = (wdHt - 60) + 'px'; 
    d2in.style.height = (wdHt - 140) + 'px';
    d3in.style.height = (wdHt - 200) + 'px';
}

window.onload = function(){
    initResizingResponsive();
    initCategoryDiv();
    initTasksDiv();
    initContentDiv();
}
window.onresize = function(){
    initResizingResponsive();
}