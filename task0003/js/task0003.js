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
var contentHtmlUtil = (function(){
    return {
        // 处于编辑状态为真，处于新建状态为假
        isEditing : false,
        // 正在编辑的task之引用
        taskUnderEditing : null,
        // 存档（用于编辑）
        archiveToEdit : '',
        // 存档（用于显示）
        archiveToDisplay : '',        
        // 以如上两种格式存储当前#content
        save : function(){
            var taskName = $('#content .title').innerHTML;
            this.archiveToDisplay = $('#content').innerHTML;
            // 以当前的三处innerHtml填充编辑时的目标
            this.archiveToEdit = ''
                + '<input type="input" class="title editable" placeholder="标题（22个字以内）" maxlength=22 value="'
                + taskName
                + '">'
                + '<input type="input" class="date editable" placeholder="日期（yyyy-mm-dd格式）" maxlength=10 value="'
                + $('#content .date').innerHTML
                + '">'
                + '<textarea class="main editable" placeholder="正文（500个字以内）" maxlength=500>'
                + $('#content .main').innerHTML
                + '</textarea>'
                + '<img class="save" src="img/icon-tick.png">'
                + '<img class="cancel" src="img/icon-times.png">';
            // 保存task引用
            this.taskUnderEditing = taskLib.filter(function(item){
                return item.title === taskName;
            })[0];
        },
        // 新建任务时的内容
        contentWhenAddingNew : ''
            + '<input type="input" class="title editable" placeholder="标题（22个字以内）" maxlength=22>'
            + '<input type="input" class="date editable" placeholder="日期（yyyy-mm-dd格式）" maxlength=10>'
            + '<textarea class="main e
        ditable" placeholder="正文（500个字以内）" maxlength=500>'
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
            + '.'
            + '</p>'
            + '<img class="mark" src="img/icon-done.png">' 
            + '<img class="edit" src="img/icon-pencil.png">',
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
/*
@param {boolean} alsoCheckDuplicate 查询同名task是否已存在
@return {boolean} 标题、日期和正文均符合输入要求时返回true；否则显示错误信息并返回false
*/
function validateInput(alsoCheckDuplicate){
    var t = trim2($('#content .title').value);
    var d = $('#content .date').value;
    var m = trim2($('#content .main').value);
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
        var isDuplicated = taskLib.some(function(item){
            return item.title === t;
        });
        if (isDuplicated) {
            showInfo('bad', '已存在相同名称的任务。')
            return false;
        }
    }        
    return true;
}

/////////////////////////////
////// 定义cate和task ///////
/////////////////////////////

/*
建立cate和task的容器
*/
var cateLib = [];
var taskLib = [];
/*
@class Task构造器
*/
function Task(title, date, main) {
    this.title = title;
    this.date = date;
    this.main = main;
    this.done = false;
}
/*
@class Category构造器
*/
function Category(name) {
    this.name = name;
    this.tasks = [];
	/*
    @param {object} newTask Task实例
	@return {boolean} taskLib数组每一项的title都与newTask不同则将newTask推入本task数组和allTask数组并返回true；否则返回false
    */
    this.addTask = function(newTask) {
        var newTitle = newTask.title;
        var r = taskLib.some(function(item){
            return item.title === newTitle;
        });
        if (r === false) {
            this.tasks.push(newTask);
            this.tasks.sort(dateDescending);
            taskLib.push(newTask);
            taskLib.sort(dateDescending);
            return true;
        }
        return false;
    };
    /*
    @param {string} taskName 要查询的task的title
	@return {object} 找到本实例tasks数组中title属性与参数相同的项并返回；否则返回null
    */
    this.getTask = function(taskName) {
        var r = this.tasks.filter(function(item){
            return item.title === taskName;
        })[0];
        return r !== undefined
            ? r
            : null;
    }
    /*
    @param {string=} status undefined或'undone'或'done'
    @return {array.<object>} 取得本实例tasks数组中［所有］或［done属性为假］或［done属性为真］的项构成的数组，按照date属性降序排列后返回
    */
    this.getTasksByStatus = function(status) {
        var r = [];
        switch (status) {
            case undefined:
                r = this.tasks;               
                break;
            case 'undone':
                r = this.tasks.filter(function(item){
                    return item.done === false;
                })
                break;
           case 'done':
                r = this.tasks.filter(function(item){
                    return item.done === true;
                })
                break;
        }
        return r.sort(dateDescending);
    };
	/*
    @param {string} date 'yyyy-mm-dd'格式的字符串
    @return {array.<object>} 返回本实例tasks中date属性与参数相同的项构成的数组
    */
	this.getTasksByDate = function(date) {
        return this.tasks.filter(function(item){
            return item.date === date;
        });
	};
}
/*
@param {object} newCate Category实例
@return {boolean} cateLib每一项的name属性都与参数的name属性不同，则将分类推入，并返回true；否则返回false
*/
function addCategory(newCate) {
    var newName = newCate.name;
    var r = cateLib.some(function(item){
        return item.name === newName;
    });
    if (r === false) {
        cateLib.push(newCate);
        return true;
    }
    return false;
}
/*
@param {string} cateName 要查询的类别的name
@return {object} 遍历cateLib，发现第一个name与参数相同的项则返回其引用；否则返回null
*/
function getCategoryByCateName(cateName) {
    var r = cateLib.filter(function(item){
        return item.name === cateName;
    })[0];
    return r !== undefined
        ? r
        : null;
}

/////////////////////////////
/////// 渲染对象至页面 ///////
/////////////////////////////

/*
@return {array.<object>} 返回高亮的task数组
*/
function getTargetTasksArray(){
    var cateName = $('#category .active').getElementsByClassName('name')[0].innerHTML;
    return cateName === '所有任务'
        ? taskLib
        : getCategoryByCateName(cateName).tasks;
}
/*
@return {object} 返回高亮的tasklist子元素所对应的task对象，无高亮返回undefined
*/
function getActiveTask(){
    var t = $('.tasklist .active');
    if (t === null) {
        return undefined;
    }
    var taskName = t.innerHTML;
    return taskLib.filter(function(item){
        return item.title === taskName;
    })[0];
}
/*
将cateLib每一项的name和其中tasks数组中undone的项数写入类为catelist的ul，统计全部任务的未完成数量
高亮cateLib第一项所在的元素
*/
function renderCategoryList() {
    var tarInnerHtml = '<li class="cate all">'
		+ '<span class="name cate">'
		+ '所有任务'
		+ '</span>'
		+ '<span class="undone cate">'
		+ '0'
		+ '</span>'
		+ '</li>';
    var undoneCount = 0;    
    for (var i in cateLib) {
        var currCate = cateLib[i];
        var currUndoneCount = currCate.getTasksByStatus('undone').length;
        tarInnerHtml += '<li class="cate">'
            + '<span class="name cate">' 
            + currCate.name
            + '</span>'
            + '<span class="undone cate">' 
            + currUndoneCount
            + '</span>'
            + '<img class="remove" src="img/icon-minus.png">'
            + '</li>';
        undoneCount += currUndoneCount;
    }
    var cateList = $('.catelist');
    cateList.innerHTML = tarInnerHtml;
    addClass(cateList.childNodes[1], 'active');
	addClass(cateList.childNodes[1], 'default');
    // 渲染全部undone数量
    $('.all .undone').innerHTML = undoneCount;
}
/* 
@param {string=} status undefined或'done'或'undone'
*/
function renderTasksList(status) {
	var taskArrInGivenStatus = getTargetTasksArray().filter(function(item){
        switch (status) {
            case undefined:
                return true;
                break;
            case 'undone':
                return item.done === false;
                break;
            case 'done':
                return item.done === true;
                break;
        }
    });
    if (taskArrInGivenStatus[0] === undefined) {
        $('.tasklist').innerHTML = '';
    } else {
        // 获取符合参数条件的task的date属性，返回去重后的数组
        var dateArray = uniqArrayHASH(taskArrInGivenStatus.map(function(item){
            return item.date; 
        }));
        var html = '';
        // 添加若干ul，每个包含这些日期标题之一
        for (var i in dateArray) {
            var currDate = dateArray[i];
            html += '<ul class="day">'
                + '<h1 class="date">'
                + currDate
                + '</h1>';
            // 获取的目标task中date属性为该日期的项的［名称］构成的数组
            var tasksOnThisDate = taskArrInGivenStatus.filter(function(item){
                return (item.date === currDate);
            });
            // 将每一task的属性写入当前date所在的ul内
            for (var j in tasksOnThisDate) {
                var currTask = tasksOnThisDate[j];
                html += ''
                    + '<li class="'
                    + (currTask.done ? 'done ' : '')
                    + 'task">'
                    + currTask.title
                    + '</li>';
            }
            html += '</ul>';
        }        
        $('.tasklist').innerHTML = html;     
        // 高亮.tasklist中第一个ul.day的第一个li.task
        addClass($('.tasklist').childNodes[0].childNodes[1], 'active');        
    }
}
/* 
将高亮的li.task的title、date、main和done属性写入右侧框
*/
function renderTask() {
    var activedTaskLi = $('.tasklist .active');  
    if (!activedTaskLi) {
        replaceContentHtml(contentHtmlUtil.contentOriginal, false);
        return;
    }
    var tarTaskName = activedTaskLi.innerHTML;
    var tarTask = taskLib.filter(function(item){
        return item.title === tarTaskName;
    })[0];
    if (tarTask === undefined) {
        replaceContentHtml(contentHtmlUtil.contentOriginal, false);
    } else {
        $('#content .title').innerHTML = tarTask.title;
        $('#content .date').innerHTML = tarTask.date;
        $('#content .main').innerHTML = tarTask.main;
        if (tarTask.done) {
            addClass($('#content .title'), 'done');
        } else {
            removeClass($('#content .title'), 'done');
        }
    }    
}
/*
移除参数所对应列表中高亮之项的active类后，为参数添加active类
@param {object} element li.cate或li.task或li.status
*/
function activateTargetLi(targetLi) {
    var tarList;
    switch (true) {
        case (hasClass(targetLi, 'cate')):
            tarList = $('.catelist');
            break;
        case (hasClass(targetLi, 'task')):
            tarList = $('.tasklist');
            break;
        case (hasClass(targetLi, 'status')):
            tarList = $('.status-nav');
            break;
    }
	removeClass(tarList.getElementsByClassName('active')[0], 'active');        
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
        if (list[i].innerHTML === cateName) {
            activateTargetLi(list[i].parentElement);
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
        if (list[i].innerHTML === taskName) {
            activateTargetLi(list[i]);
            return true;
        }
    }
    return false;
}

/////////////////////////////
////////// 事件响应 //////////
/////////////////////////////

///// 左 /////

/*
hover在无default和all类的li.cate上时显示移除按钮，离开时隐藏
*/
$.delegateByClassName('.catelist', 'cate', 'mouseover', function(e){
    var et = e.target;
    var targetLi = 
        et.nodeName === 'LI'
        ? et
        : et.parentElement;
	if (hasClass(targetLi, 'all')
	   	|| hasClass(targetLi, 'default')
	   ) {
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
	if (hasClass(targetLi, 'all')
	   	|| hasClass(targetLi, 'default')
	   ) {
		return;
	}
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
click .remove按钮上时confirm是否删除此cate，确认后删除该cate下的task，从catelib中移除该cate，刷新列表
*/
$.delegateByClassName('.catelist', 'remove', 'click', function(e){
    var et = e.target;
    var tarCateName = et.previousElementSibling.previousElementSibling.innerHTML;
    var c = confirm('将同时删除分类「' + tarCateName + '」下的所有任务。继续吗？');
    if (c === true) {
        var tarCate = getCategoryByCateName(tarCateName);
        var tasksToDelete = tarCate.getTasksByStatus();
        for (var i in tasksToDelete) {
            taskLib.splice(taskLib.indexOf(tasksToDelete[i]), 1);
        }
        cateLib.splice(cateLib.indexOf(tarCate), 1);
		renderCategoryList();
		renderTasksList();
		renderTask();
		saveToCache();
    }
});
/*
click #category .add按钮时prompt新分类名（8个字以内），尝试写入catelib
提示添加是否成功，高亮新cate所在li
*/
$.click('#category .add', function(e){
    var newCateName = prompt('请输入新分类的名字(8个字以内）。')
    if (newCateName === null) {
		return;	
	}
	while (newCateName === '' 
			|| newCateName.length > 8
		  ) {
	newCateName = prompt('分类名称长度应在1至8个字之间。');
	}
	if (newCateName === '所有任务') {
		showInfo('bad', '不能给分类起这个名字。_(:зゝ∠)_')
		return;
	}
	if (addCategory(new Category(newCateName)) === true) {
		showInfo('good', '添加分类成功。')
		renderCategoryList();
		activateTargetLi($('.catelist').lastChild);
		renderTasksList();
		renderTask();
		saveToCache();
	} else {
		showInfo('bad', '已存在相同名称的分类。');
		return;
	}    
});

///// 中 /////

/*
click .status-nav时，按相应条件查找当前cate下的task，渲染中部和右侧
*/
$.delegateByClassName('.status-nav', 'status', 'click', function(e){
    var et = e.target;
    activateTargetLi(et);
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
    // 左侧.all高亮时不允许新建任务
    if (hasClass($('.cate.all'), 'active')) {
        showInfo('bad', '请先选择一个分类。');
        return;
    }
    // 改写‘正在编辑’状态为false
    contentHtmlUtil.isEditing = false;
    contentHtmlUtil.save();
    replaceContentHtml(contentHtmlUtil.contentWhenAddingNew, true);
});

///// 右 /////

$.delegateByClassName('#content', 'mark', 'click', function(e){
    var currTask = getActiveTask();
    if (currTask === undefined) {
        showInfo('bad', '还没添加任务呢。');
        return;
    }
    // 若已完成则返回，不confirm
    if (currTask.done === true) {
        showInfo('bad', '这个任务已经完成啦！');
        return;
    }
    var currTaskName = currTask.title;
    var currCateName = $('#category .active').getElementsByClassName('name')[0].innerHTML;   
    var c = confirm('将「' + currTaskName + '」标记为「已完成」吗？');
    if (c === true) {        
        currTask.done = true;
        showInfo('good', '标记成功。')
		saveToCache();
        renderCategoryList();
        activateTargetCateName(currCateName);
        renderTasksList();
        activateTargetTaskName(currTaskName);
        renderTask();
    }
});
/*
click .edit按钮
备份当前的#content内容
将右侧#content内部替换为当前内容
*/
$.delegateByClassName('#content', 'edit', 'click', function(e){
	if (getActiveTask() === undefined) {
		showInfo('bad', '还没添加任务呢。')
		return;
	}
    // 改写‘正在编辑’状态为true
    contentHtmlUtil.isEditing = true;
    contentHtmlUtil.save();
    replaceContentHtml(contentHtmlUtil.archiveToEdit, true);
});
/*
click 新建或编辑任务时的.save按钮
*/
$.delegateByClassName('#content', 'save', 'click', function(){
    var taskName = trim2($('.title.editable').value);
    var taskDate = $('.date.editable').value;
    var taskMain = trim2($('.main.editable').value);
    switch (contentHtmlUtil.isEditing) {
        // 处于‘编辑’状态
        case true:
            if (validateInput(false)) {
                // 保存要修改的task的引用
                var tarTask = contentHtmlUtil.taskUnderEditing;
                tarTask.title = taskName;
                tarTask.date = taskDate;
                tarTask.main = taskMain;
                showInfo('good', '任务修改成功。');
                replaceContentHtml(contentHtmlUtil.contentOriginal, false);
                renderTasksList();
                // 获取更新了title的task，高亮之
                activateTargetTaskName(tarTask.title);
				saveToCache();
            }
            break;
        // 处于‘新建’状态，额外检查新title是否已存在于所有task中
        case false:
            if (validateInput(true)) {
                var tarCateName = $('#category .active').getElementsByClassName('name')[0].innerHTML;
                getCategoryByCateName(tarCateName).addTask(new Task(taskName, taskDate, taskMain));
                showInfo('good', '成功添加任务。');
                replaceContentHtml(contentHtmlUtil.contentOriginal, false);
                renderCategoryList();
                activateTargetCateName(tarCateName);
                renderTasksList();
                activateTargetTaskName(taskName);
				saveToCache();
            }
            break;
    }   
    renderTask();
});
/*
/*
click 新建或编辑任务时的.cancel按钮
替换#content内容为toDisplay存档
*/
$.delegateByClassName('#content', 'cancel', 'click', function(){
    var r = confirm('确定退出编辑？');
    if (r === true) {
        replaceContentHtml(contentHtmlUtil.archiveToDisplay, false);
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
            if (v.length === 22) {
                showInfo('bad', '任务标题不能超过22个字。')
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

/*
尝试获取获取本地存储以更新task和tace二容器，无则制造数据填充之
*/
function loadFromCache() {
    var cateLibRaw = JSON.parse(localStorage.getItem('cateCache'));
    var taskLibRaw = JSON.parse(localStorage.getItem('taskCache'));
	if (cateLibRaw === null) {
        addCategory(new Category('默认分类'));
        addCategory(new Category('Work'));
        addCategory(new Category('Social'));
        addCategory(new Category('Trifle'));
        var defa1 = new Task('Date with my GF', '2017-02-14', 'Wait. I ain\'t got none.');
        var defa2 = new Task('Burger King', '2017-04-01', 'Haven\'t had that for long.');
        cateLib[0].addTask(defa1);
        cateLib[0].addTask(defa2);
        defa1.done = true;
        var work1 = new Task('Finish task 0003', '2016-04-30', 'Here is some content.');
        var work2 = new Task('Write report', '2016-05-30', 'He he he.');
        cateLib[1].addTask(work1);
        cateLib[1].addTask(work2);
        var soci1 = new Task('Meet college pals', '2016-05-30', 'And have some beer.');
        var soci2 = new Task('Go to Jake\'s wedding', '2016-10-01', 'How much should it cost me again?');
        cateLib[2].addTask(soci1);
        cateLib[2].addTask(soci2);
        var trif1 = new Task('Buy new shampoo', '2017-02-14', 'That CLEAR one.');
        var trif2 = new Task('Have a haircut', '2016-06-01', 'To celebrate Children\'s day.');
        cateLib[3].addTask(trif1);
        cateLib[3].addTask(trif2);
    } else {
		var taskLibUpdated = [];
		for (var i in taskLibRaw) {
			var currTaskRaw = taskLibRaw[i];
			var currTask = new Task(currTaskRaw.title, currTaskRaw.date, currTaskRaw.main);
			currTask.done = currTaskRaw.done;
			taskLibUpdated.push(currTask);
		}
		taskLib = taskLibUpdated;
		var cateLibUpdated = [];
		for (var i in cateLibRaw) {
			// 当前raw分类
			var currCateRaw = cateLibRaw[i];
			// 当前raw分类下的任务
			var tasksInCurrCateRaw = currCateRaw.tasks;
			// 以当前raw分类name新建的分类对象
			var currCate = new Category(currCateRaw.name);
			// 遍历raw分类下的任务
			for (var i in tasksInCurrCateRaw) {
				// 取得每个当前raw分类下的任务名称
				var tarTaskName = tasksInCurrCateRaw[i].title;
				// 为新分类对象的task数组添加已更新的taskLib中name与此任务名称相同的任务
				currCate.tasks.push(taskLib.filter(function(item){
					return item.title === tarTaskName;
				})[0]);
			}
			cateLibUpdated.push(currCate);
		}
		cateLib = cateLibUpdated;
	}
}
/*
保存二容器至本地存储
*/
function saveToCache() {
	localStorage.setItem('cateCache', JSON.stringify(cateLib));
	localStorage.setItem('taskCache', JSON.stringify(taskLib));
}
window.onload = function(){
    resizeToWindowSize();
	loadFromCache();
    renderCategoryList();
    renderTasksList();
    renderTask(); 
	// 清理缓存方法的绑定
	$.click('#title .btn', function(){
		localStorage.clear();
		showInfo('bad', '缓存已清理。');
	});
};
window.onresize = function(){
    resizeToWindowSize();
};