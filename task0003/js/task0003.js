/////////////////////////////
////////// 工具函数 //////////
/////////////////////////////

/*
@param {string} howItSounds 好消息还是坏消息？传入'good'或'bad'
@param {string} str 要显示的消息字符串
*/
function showInfo(howItSounds, str) {
    var targetArea = 
        howItSounds === 'good'
        ? $('.info-area.good')
        : $('.info-area.bad');
    targetArea.innerHTML = str;
    setTimeout(function(){
        targetArea.innerHTML = '';
    }, 3000);
}
/*
部分内容宽度自适应
*/
function resizeToWindowSize() {    
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
    var d2in = $('.tasklist');    
    var d3 = $('#content');
    var d3in = $('#content .main');   
    
    wrap.style.width = wdWt + 'px';
    d3.style.width = (wdWt - 460) + 'px';

    wrap.style.height = wdHt + 'px';        
    d2.style.height = d1.style.height = (wdHt - 60) + 'px'; 
    d2in.style.height = (wdHt - 140) + 'px';
    d3in.style.height = (wdHt - 200) + 'px';
}
/*
将#content内容相关的html及方法储存在闭包对象中
*/
var contentHtmlBackup = (function(){
    return {
        // 存档（用于编辑）
        archiveToEdit : '',
        // 存档（用于显示）
        archiveToDisplay : '',        
        // 以如上两种格式存储当前#content
        save : function(){
            this.archiveToDisplay = $('#content').innerHTML;
            // 以当前的三处innerHtml填充编辑时的目标
            this.archiveToEdit = ''
                + '<input type="input" class="title editable" placeholder="标题（18个字以内）" maxlength=18 value="'
                + $('#content .title').innerHTML
                + '">'
                + '<input type="input" class="date editable" placeholder="日期（yyyy-mm-dd格式）" maxlength=10 value="'
                + $('#content .date').innerHTML
                + '">'
                + '<textarea class="main editable" placeholder="正文（500个字以内）" maxlength=500>'
                + $('#content .main').innerHTML
                + '</textarea>'
                + '<img class="save" src="img/icon-tick.png">'
                + '<img class="cancel" src="img/icon-times.png">';
        },
        // 新建任务时的内容
        contentWhenAddingNew : ''
            + '<input type="input" class="title editable" placeholder="标题（18个字以内）" maxlength=18>'
            + '<input type="input" class="date editable" placeholder="日期（yyyy-mm-dd格式）" maxlength=10>'
            + '<textarea class="main editable" placeholder="正文（500个字以内）" maxlength=500>'
            + '</textarea>'
            + '<img class="save" src="img/icon-tick.png">'
            + '<img class="cancel" src="img/icon-times.png">',
        // 分类下无task时的内容
        contentOriginal : ''
            + '<h1 class="title">'
            + '.'
            + '</h1>'
            + '<h1 class="date">'
            + '.'
            + '</h1>'
            + '<p class="main">'
//            + '点击「新增任务」以创建新任务。'
            + '.'
            + '</p>'
            + '<img class="mark" src="img/icon-done.png">'
            + '<img class="edit" src="img/icon-pencil.png">'
            + '',
    };    
})();   
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
@param {checkDuplicate} todo
@return {boolean} 标题、日期和正文均符合输入要求时返回true；否则显示错误信息并返回false
*/
function checkTaskInput(checkDuplicate){
    var t = $('#content .title').value;
    var d = $('#content .date').value;
    var m = $('#content .main').value;
    if (!t.match(/^.{1,18}$/)) {
        showInfo('bad', '任务标题长度应在1至18字之间。')
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
    if (checkDuplicate === true) {
        // 若输入的title与当前高亮的cate的tasks中任意一项的title相同则报错
        if (getActiveCate().getTask(t) !== null) {
            showInfo('bad', '该任务已在本类别下存在。')
            return false;
        }
    }       
    return true;
}

/////////////////////////////
////// 定义cate和task ///////
/////////////////////////////

/*
@class Task构造器
*/
function Task(title, date, main) {
    this.title = title;
    this.date = date;
    this.main = main;
    this.done = false;
    this.markAsDone = function(){
        this.done = true;
    }
}
/*
@class Category构造器
*/
function Category(name) {
    this.name = name;
    this.tasks = [];
	/*
    @param {object} newTask Task实例
	@return {boolean} 本实例tasks数组每一项的title都与newTask不同则将newTask推入数组并返回true；否则直接返回false
    */
    this.addTask = function(newTask) {
        var newTitle = newTask.title;
		var allTasksInThisCate = this.tasks;
        for (var i in allTasksInThisCate) {
            if (allTasksInThisCate[i].title === newTitle) {
                return false;
            }
        }
        allTasksInThisCate.push(newTask);
        return true;
    };
    /*
    @param {string} taskName 要查询的task的title
	@return {object} 找到本实例tasks数组中title属性与参数相同的项并返回；否则返回null
    */
    this.getTask = function(taskName) {
        var allTasksInThisCate = this.tasks;
        for (var i in allTasksInThisCate) {
            if (allTasksInThisCate[i].title === taskName) {
                return allTasksInThisCate[i];
            }
        }
        return null;
    }
    /*
    @param {string=} option undefined或'undone'或'done'
    @return {array.<object>} 取得本实例tasks数组中［所有］或［done属性为假］或［done属性为真］的项构成的数组，按照date属性降序排列后返回
    */
    this.getTasksByStatus = function(option) {
        var r = [];
		var allTasksInThisCate = this.tasks;
        switch (option) {
            case undefined:
                r = allTasksInThisCate;               
                break;
            case 'undone':
                for (var i in allTasksInThisCate) {
					var currTask = allTasksInThisCate[i];
                    if (currTask.done === false) {
                        r.push(currTask);
                    }
                }
                break;
           case 'done':
                  for (var i in allTasksInThisCate) {
					var currTask = allTasksInThisCate[i];
                    if (currTask.done === true) {
                        r.push(currTask);
                    }
                }
                break;
        }
        return r.sort(function(t1, t2){
			var d1 = t1.date.replace('-', '');
			var d2 = t2.date.replace('-', '');
			if (d1 > d2) {
				return -1;
			} else {
				return 1;
			}
		});
    };
	/*
    @param {string} date 'yyyy-mm-dd'格式的字符串
    @return {array.<object>} 返回本实例tasks数组中date属性与参数相同的项构成的数组
    */
	this.getTasksByDate = function(date) {
		var r = [];
		var allTasksInThisCate = this.tasks;
		for (var i in allTasksInThisCate) {
			var currTask = allTasksInThisCate[i];
			if (currTask.date === date) {
				r.push(currTask);
			}
		}
		return r;
	}
}
/*
@param {array.<object>} taskArr 由Task实例构成的数组
@param {string} property 要查询的Task属性名
@return {array} taskArr 由taskArr的每一项的property的值构成的数组
*/
function getPropertyOfEachInTaskArray(taskArr, property){
	return taskArr.map(function(item, array, index){
		return item[property];
	})
}
/*
@param {object} newCate Category实例
@return {boolean} cateLib每一项的name属性都与参数的name属性不同，则将参数推入，并返回true；否则返回false
*/
function addCategory(newCate) {
    var newName = trim2(newCate.name);
    for (var i in cateLib) {
        if (cateLib[i].name === newName) {
            return false;
        }
    }
    cateLib.push(newCate);
	return true;
}
/*
@param {string} cateName 要查询的类别的name
@return {object} 遍历cateLib，发现第一个name与参数相同的项则返回其引用；否则返回null
*/
function getCategoryByCateName(cateName) {
    for (var i in cateLib) {
        if (cateLib[i].name === cateName) {
            return cateLib[i];
        }
    }
    return null;
}
/*
声明存储Category对象的容器
*/
var cateLib;
/*
@param {array.<object>=} localLib undefined或由Category实例构成的数组
@return {array.<object>} 无参数时将cateLib设为含一个Category对象的默认数组；否则设为参数的引用
*/
function initCategory(localLib) {
	cateLib = 
        localLib === undefined
        ? [new Category('默认分类')]
        : localLib;
}
/*
添加若干Category和Task的实例
*/
function forgeData() {
    addCategory(new Category('工作'));
    addCategory(new Category('社交'));
    addCategory(new Category('生活'));
    var defa1 = new Task('Dinner with my chick', '2017-02-14', 'wait i ain\'t got none.');
	var defa2 = new Task('Burger King', '2017-04-01', 'haven\'t had that for long.');
    cateLib[0].addTask(defa1);
    cateLib[0].addTask(defa2);
    defa1.markAsDone();
    var work1 = new Task('Finish task 5147', '2016-04-30', 'here is some content');
    var work2 = new Task('Write report', '2016-04-28', 'He he he.');
    cateLib[1].addTask(work1);
    cateLib[1].addTask(work2);
    var soci1 = new Task('Meet college pals', '2016-05-30', 'and have some beer.');
    var soci2 = new Task('Go to Jake\'s wedding', '2016-10-01', 'how much should it cost me?');
    cateLib[2].addTask(soci1);
    cateLib[2].addTask(soci2);
    var dail1 = new Task('Buy new shampoo', '2016-06-02', 'that CLEAR one.');
    var dail2 = new Task('Have a haircut', '2016-06-01', 'to celebrate Children\'s day.');
    cateLib[3].addTask(dail1);
    cateLib[3].addTask(dail2);
}

/////////////////////////////
/////// 渲染对象至页面 ///////
/////////////////////////////

/*
@return {object} 返回高亮的catelist子元素所对应的cate对象
*/
function getActiveCate(){
    var cateName = $('.catelist .active').getElementsByClassName('name')[0].innerHTML;    
    return getCategoryByCateName(cateName);
}
/*
@return {object} 返回高亮的tasklist子元素所对应的task对象
*/
function getActiveTask(){
    var taskName = $('.tasklist .active').innerHTML;
    return getActiveCate().getTask(taskName);
}
/*
将cateLib每一项的name和其中tasks数组中undone的项数写入类为catelist的ul
高亮cateLib第一项所在的元素
*/
function renderCategoryList() {
    var tarInnerHtml = '';
    for (var i in cateLib) {
        var currCate = cateLib[i];
        tarInnerHtml += '<li class="cate">'
            + ''
            + '<span class="name cate">' 
            + currCate.name 
            + '</span>'
            + ''
            + '<span class="undone cate">' 
            + currCate.getTasksByStatus('undone').length
            + '</span>'
            + ''
            + '<img class="remove" src="img/icon-times.png">'
            + ''
            + '</li>';
    }
    var cateList = $('.catelist');
    cateList.innerHTML = tarInnerHtml;
    addClass(cateList.childNodes[0], 'active');
}
/* 
@param {string=} option undefined或'done'或'undone'
高亮的cate下有task时，根据每个task的属性拼接html，替换tasklist，高亮第一个li.task
高亮的cate下没有task时，使中部空白，返回
*/
function renderTasksList(option) {
    var tarCate = getActiveCate();
    var tarTaskArr = tarCate.getTasksByStatus(option);
    // 此cate有至少1个task时
    if (tarTaskArr[0] !== undefined) {
        // 找到该cate下符合参数条件的task的date属性，返回去重后的数组
        var dateArray = uniqArrayHASH(getPropertyOfEachInTaskArray(tarTaskArr, 'date'));
        // 添加日期标题
        var tarInnerHtml = '';
        for (var i in dateArray) {
            var currDate = dateArray[i];
            tarInnerHtml += '<ul class="day">'
                + '<h1 class="date">'
                + currDate
                + '</h1>';
            // 取得该cate下date属性为该日期的项的［名称］构成的数组
            var tasksOnThisDate = tarCate.getTasksByDate(currDate);
            // 遍历数组，将每一项的title属性写入当前date所在的ul内
            for (var j in tasksOnThisDate) {
                var currTask = tasksOnThisDate[j];
                tarInnerHtml += ''
                    + '<li class="'
                    + (currTask.done ? 'done ' : '')
                    + 'task">'
                    + currTask.title
                    + '</li>';
            }
            tarInnerHtml += '</ul>';
        }
        // 替换.tasklist的innerHtml
        $('.tasklist').innerHTML = tarInnerHtml;     
        // 高亮.tasklist中第一个ul.day的第一个li.task
        addClass($('.tasklist').childNodes[0].childNodes[1], 'active');
    } else {
        // 没有task时，使中部空白
        $('.tasklist').innerHTML = '';
    }    
}
/* 
将高亮的li.task的title、date、main属性写入右侧框
无高亮task时替换右侧内容
*/
function renderTask() {
    var taskName = $('.tasklist .active').innerHTML;
    // 获取高亮的li.task对应的task
    var tarTask = getActiveCate().getTask(taskName);
    if (tarTask !== null) {
        $('#content .title').innerHTML = taskName;
        $('#content .date').innerHTML = tarTask.date;
        $('#content .main').innerHTML = tarTask.main;
    } else {
        // 无高亮task时
        replaceContentHtml(contentHtmlBackup.contentOriginal, false);
    }    
}
/*
移除参数所在列表中高亮之项的active类后，为参数添加active类
@param {object} element li.cate或li.task或li.status
*/
function activateTargetLi(targetLi) {
    var t;
    switch (true) {
        case (hasClass(targetLi, 'cate')):
            t = $('.catelist');
            break;
        case (hasClass(targetLi, 'task')):
            t = $('.tasklist');
            break;
        case (hasClass(targetLi, 'status')):
            t = $('.status-nav');
            break;
    }
    removeClass(t.getElementsByClassName('active')[0], 'active');
    addClass(targetLi, 'active');
}
/*
高亮目标cate所在之li
@param {string} cateName
@return {boolean} 无此cate时返回false，否则true
*/
function activateTargetCateName(cateName) {
    var list = $('.catelist').getElementsByClassName('name');
    for (var i in list) {
        var curLi = list[i];
        if (curLi.innerHTML === cateName) {
            activateTargetLi(curLi.parentElement);
            return true;
        }
    }
    return false;
}
/*
高亮目标task所在之li
@param {string} taskName
@return {boolean} 无此task时返回false，否则true
*/
function activateTargetTaskName(taskName) {
    var list = $('.tasklist').getElementsByClassName('task');
    for (var i in list) {
        var curLi = list[i];
        if (curLi.innerHTML === taskName) {
            activateTargetLi(curLi);
            return true;
        }
    }
    return false;
}
/*
刷新三个div
*/
function refreshAll() {
    renderCategoryList();
    renderTasksList();
    renderTask();
}

/////////////////////////////
////////// 事件响应 //////////
/////////////////////////////

///// 左 /////

/*
hover在【非第一个子元素】li.cate上时显示移除按钮，离开时隐藏
*/
$.delegateByClassName('.catelist', 'cate', 'mouseover', function(e){
    var et = e.target;
    var targetLi = 
        et.nodeName === 'LI'
        ? et
        : et.parentElement;
    if (targetLi.previousElementSibling === null) {
        return;
    }
    targetLi.getElementsByClassName('remove')[0].style.display = 'block';
});
$.delegateByClassName('.catelist', 'cate', 'mouseout', function(e){
    var et = e.target;
    var targetLi = 
        et.nodeName === 'LI'
        ? et
        : et.parentElement;
    targetLi.getElementsByClassName('remove')[0].style.display = 'none';
});
/*
高亮click的目标li.cate，渲染该cate
*/
$.delegateByClassName('.catelist', 'cate', 'click', function(e){
    var et = e.target;
    var targetLi = 
        et.nodeName === 'LI'
        ? et
        : et.parentElement;
    activateTargetLi(targetLi);
    // 高亮中部“所有”
    activateTargetLi($('.status.all'));
    renderTasksList();
    renderTask();
});
/*
hover在.remove按钮上时显示其，离开时隐藏
*/
$.delegateByClassName('.catelist', 'remove', 'mouseover', function(e){
    var et = e.target;
    et.style.display = 'block';
});
$.delegateByClassName('.catelist', 'remove', 'mouseout', function(e){
    var et = e.target;
    et.style.display = 'none';
});
/*
click .remove按钮上时confirm是否删除此cate，确认后从catelib中移除该项并刷新列表
*/
$.delegateByClassName('.catelist', 'remove', 'click', function(e){
    var et = e.target;
    var tarCateName = et.parentElement.getElementsByClassName('name')[0].innerHTML;
    var c = confirm('确定删除分类「' + tarCateName + '」吗？此操作不可撤销。');
    if (c === true) {
        cateLib.splice(cateLib.indexOf(getCategoryByCateName(tarCateName)), 1);
    }
    refreshAll();
});
/*
click #category .add按钮时prompt新分类名（8个字以内），尝试写入catelib
提示添加是否成功，高亮新cate所在li
*/
$.click('#category .add', function(e){
    var newCateName = prompt('请输入新分类的名字(8个字以内）。')
    if (newCateName !== null) {
        while (newCateName === '' 
                || newCateName.length > 8
              ) {
        newCateName = prompt('分类名称长度应在1至8个字之间。');
        }
        if (addCategory(new Category(newCateName)) === true) {
            showInfo('good', '添加分类成功。')
            renderCategoryList();
            activateTargetLi($('.catelist').lastChild);
            renderTasksList();
            renderTask();
        } else {
            showInfo('bad', '已存在相同名称的分类。')
        }
    }    
});

///// 中 /////

/*
click .status-nav时，按相应条件查找当前cate下的task，渲染中部和右侧
*/
$.delegateByClassName('.status-nav', 'status', 'click', function(e){
    var et = e.target;
    switch (true) {
        case hasClass(et, 'all'):
            renderTasksList();
            break;
        case hasClass(et, 'undone'):
            renderTasksList('undone');
            break;
        case hasClass(et, 'done'):
            renderTasksList('done');        
            break;
    }
    activateTargetLi(et);
    renderTask();
});
/*
高亮click的li.task，刷新右侧
*/
$.delegateByClassName('.tasklist', 'task', 'click', function(e){
    var et = e.target;
    activateTargetLi(et); 
    renderTask();
});
/*
click .add按钮后
备份当前的#content html
将右侧#content内部替换为输入框
*/
$.click('#tasks .add', function(e){
    contentHtmlBackup.save();
    replaceContentHtml(contentHtmlBackup.contentWhenAddingNew, true);
});

///// 右 /////

$.delegateByClassName('#content', 'mark', 'click', function(e){
    var currTask = getActiveTask();
    // 若已完成则返回，不confirm
    if (currTask.done === true) {
        showInfo('bad', '这个任务已经完成啦！');
        return;
    }
    var currTaskName = currTask.title;
    var currCateName = getActiveCate().name;   
    var c = confirm('将「' + currTaskName + '」标记为「已完成」吗？');
    if (c === true) {        
        currTask.markAsDone();
        showInfo('good', '标记成功。')
        renderCategoryList();
        activateTargetCateName(currCateName);
        renderTasksList();
        activateTargetTaskName(currTaskName);
        renderTask();
        console.log($('.tasklist').innerHTML)
    }
});
/*
click .edit按钮
备份当前的#content内容
将右侧#content内部替换为当前内容
*/
$.delegateByClassName('#content', 'edit', 'click', function(e){
    contentHtmlBackup.save();
    replaceContentHtml(contentHtmlBackup.archiveToEdit, true);
});
/*
click 新建或编辑任务时的.save按钮
*/
$.delegateByClassName('#content', 'save', 'click', function(){
    // 输入非法时显示错误消息
    if (checkTaskInput()) {
        // 保存高亮的左侧li对应的cate的引用和其name属性
        var tarCate = getActiveCate();
        var cateName = tarCate.name;
        // 保存新task的名称
        var taskName = $('.title.editable').value;
        // 按三个输入框的值，在本cate下添加新task
        tarCate.addTask(new Task(taskName,
                                 $('.date.editable').value,
                                 $('.main.editable').value));
        // 显示成功消息
        showInfo('good', '成功添加任务。');
        // 移除遮罩层
        replaceContentHtml(contentHtmlBackup.archiveToDisplay, false);
        // 因添加了新任务，刷新左侧
        renderCategoryList();
        // 高亮保存的cate名称
        activateTargetCateName(cateName);
        // 根据高亮的cate渲染中部
        renderTasksList();
        // 高亮保存的task名称
        activateTargetTaskName(taskName);
        // 根据高亮的task渲染右侧。
        renderTask();
    }
});
/*
/*
click 新建或编辑任务时的.cancel按钮
替换#content内容为toDisplay存档
*/
$.delegateByClassName('#content', 'cancel', 'click', function(){
    var r = confirm('确定退出编辑？');
    if (r === true) {
        replaceContentHtml(contentHtmlBackup.archiveToDisplay, false);
    }
});
/*
#content的三个输入框内容长度达到maxlength时给出提示
*/
$.delegateByClassName('#content', 'editable', 'keyup', function(e){
    var et = e.target;
    var v = et.value;
    switch (true) {
        case hasClass(et, 'title'):
            if (v.length === 18) {
                showInfo('bad', '任务标题不能超过18个字。')
            }
            break;
        case hasClass(et, 'date'):
            if (v.length === 10
                && !isValidDate(v)) {
                showInfo('bad', '任务日期不符合yyyy-mm-dd格式。')
            }
            break;
        case hasClass(et, 'main'):
            if (v.length === 500) {
                showInfo('bad', '任务正文不能超过500个字。')
            }
            break;
    }
});

/////////////////////////////
//////////// 部署 ///////////
/////////////////////////////

window.onload = function(){
    resizeToWindowSize();
    initCategory();
    forgeData();
    refreshAll();
}
window.onresize = function(){
    resizeToWindowSize();
}