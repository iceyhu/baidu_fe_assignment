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
@param {object} task1 Task实例
@param {object} task2 Task实例
@return {number} 比较函数，date属性去掉'-'后值较大的参数排在前面
*/
function dateDescending(task1, task2){
    if (task1.date.replace('-', '') > task2.date.replace('-', '')) {
        return -1;
    } else {
        return 1;
    }
}
/*
@param {string} taskName 要取得的任务对象名称
@return {object} 含此任务的cate对象
*/
function getCateByTaskName(taskName) {
    return cateLib.filter(function(eachCate){
        var curTaskArray = eachCate.tasks;
        for (var i in curTaskArray) {
            if (curTaskArray[i].title === taskName) {
                return true;
            }
        }
    })[0];    
}

/////////////////////////////
////////// 渲染对象 //////////
/////////////////////////////

/*
将每个cate对象的name和其下undone的任务数量写入.content的html
隐藏back按钮
*/
function renderCateList() {
    $('.header .back').style.display = 'none';
    var html = '<ul class="catelist">';
    for (var i in cateLib) {
        var currCate = cateLib[i];
        html += ''
            + '<li class="tab cate">'
            + '<span class="cate name">'
            + currCate.name
            + '</span>'
            + '<span class="cate undone">'
            + currCate.getTasksByStatus('undone').length
            + '</span>'
            + '</li>';
    }
    html += '</ul>';
    $('.content').innerHTML = html;
}
/*
将目标cate下的所有任务的title和done属性写入.content的html
显示back按钮
*/
function renderTaskList(cateName) {
    $('.header .back').style.display = 'block';
    var tarCate = cateLib.filter(function(item){
        return item.name === cateName;
    })[0];
    var tarTaskArr = tarCate.getTasksByStatus();
    var html = '<ul class="tasklist">';
    for (var i in tarTaskArr) {
        var currTask = tarTaskArr[i];
        html += ''
            + '<li class="tab task'
            + (currTask.done ? ' done' : '')
            + '">'
            + currTask.title
            + '</li>';
    }
    html += '</ul>';
    $('.content').innerHTML = html;
}
/*
将目标task的title，date和main属性写入.content的html
显示back按钮
*/
function renderTask(taskName) {
    $('.header .back').style.display = 'block';
    var tarTask = taskLib.filter(function(item){
        return item.title === taskName;
    })[0];
    var html = ''
        + '<p class="tab title'
        + (tarTask.done ? ' done' : '')
        + '">'
        + tarTask.title
        + '</p>'
        + '<p class="tab date">'
        + tarTask.date
        + '</p>'
        + '<p class="tab main">'
        + tarTask.main
        + '</p>';
    $('.content').innerHTML = html;
}

/////////////////////////////
////////// 事件响应 //////////
/////////////////////////////

$.delegateByClassName('.content', 'tab', 'touchstart', function(e){
    var et = e.target;
    addClass(et, 'hover');
});
$.delegateByClassName('.content', 'tab', 'touchend', function(e){
    var et = e.target;
    removeClass(et, 'hover');
});


$.delegateByClassName('.content', 'cate', 'touchend', function(e){
    var et = e.target;
    var t = 
        et.nodeName === 'LI'
        ? et
        : et.parentElement;
    renderTaskList(et.firstChild.innerHTML);
});
$.delegateByClassName('.content', 'task', 'touchend', function(e){
    var et = e.target;
    renderTask(et.innerHTML);
});
$.click('.header .back', function(){
    var currContent = $('.content').firstChild;
    switch (true) {
        case hasClass(currContent, 'tasklist'):
            renderCateList();
            break;
        case hasClass(currContent, 'title'):
            renderTaskList(getCateByTaskName(currContent.innerHTML).name);
            break;
    }
});

/////////////////////////////
//////////// 部署 ///////////
/////////////////////////////

/*
制造数据填充二容器
*/
function forgeData() {
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
}
window.onload = function(){
	forgeData();
    renderCateList();
};