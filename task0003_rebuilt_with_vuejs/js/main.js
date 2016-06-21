function Task(title, date, main) {
    this.title = title;
    this.date = date;
    this.main = main;
    this.done = false;
}
function Category(name) {
    this.name = name;
    this.tasks = [];
    this.getTaskByName = function(tarTaskName){
        var r = taskLib.filter(function(item){
            return (item.title === tarTaskName);
        })[0];
        return r === undefined
            ? null
            : r;
    };
    this.addTask = function(newTask){
        if (this.getTaskByName(newTask.title) === null) {
            taskLib.push(newTask);
            taskLib.sort(dateDescending);
            this.tasks.push(newTask);
            this.tasks.sort(dateDescending);
            return true;
        }
        return false;
    };
    this.getTasksBy = function(condition){
        switch (condition) {
            case 'done':
                return this.tasks.filter(function(item){
                    return item.done === true;
                });
            case 'undone':
                return this.tasks.filter(function(item){
                    return item.done === false;
                });           
            case 'all': 
                return this.tasks;
            default:
                return this.tasks.filter(function(item){
                    return item.data === condition;
                });
        }
    }
}
var cateLib = [];
cateLib.addCategory = function(newCateName){
    var r = this.some(function(item){
        return item.name === newCateName;
    });
    if (r === false) {
        this.push(new Category(newCateName));
        return true;
    }
    return false;
}
var taskLib = [];
taskLib.filterBy = function(condition){
    switch (condition) {
        case 'done':
            return this.filter(function(item){
                return item.done === true;
            });
        case 'undone':
            return this.filter(function(item){
                return item.done === false;
            });           
        case 'all': 
            return this;
        default:
            return this.filter(function(item){
                return item.data === condition;
            });
        }
}
function dateDescending(task1, task2){
    if (task1.date.value > task2.date.value) {
        return -1;
    } else {
        return 1;
    }
}
var init = (function(){
    responseToResize();
    loadFromCache(cateLib, taskLib);
    renderLeft();
})();
function responseToResize(){    
    var wt = 
        window.innerWidth <= 900
        ? 900
        : window.innerWidth;
    var ht = 
        window.innerHeight <= 600
        ? 600
        : window.innerHeight;
    $('#wrapper').style.width = wt + 'px';  
    $('#wrapper').style.height = ht + 'px';    
    $('#category').style.height =
        $('#tasks').style.height = (ht - 60) + 'px'; 
    $('.tasklist').style.height = (ht - 140) + 'px';
    $('#content').style.width = (wt - 480) + 'px';
    $('#content .main').style.height = (ht - 200) + 'px';   
}
function showInfo(option, info){
    var tar = $('.notif.' + option);
    tar.innerHTML = info;
    setTimeout(function() {
        tar.innerHTML = '';
    }, 3000);
}
function renderLeft(){
    new Vue({
        el: '#category',
        data: {
            cates: cateLib,
            tasks: taskLib,
        },
        methods: {
            clickAddListener: function(){
                var name = prompt('请输入1至8个字符的分类名称。');
                if (name === null) {
                    return;
                }
                if (name.length > 8 || name === '') {
                    showInfo('bad', '分类名应在1至8个字符之间。')
                    return;
                }
                if (!this.cates.addCategory(name)) {
                    showInfo('bad', '已存在该分类。');
                    return;
                }            
           },
           hoverCateListener: function(e){
               var et = e.target;
               while (!hasClass(et, 'cate')) {
                   et = et.parentElement;
               }
               switch (e.type) {
                    case 'mouseover':
                       addClass(et, 'active');
                       return;
                    case 'mouseout':
                       removeClass(et, 'active');
                       return;
               }
           },
           clickCateListener: function(e){
           }
       }
    });
}
function renderMiddle(){

}
function loadFromCache(cLib, tLib) {
    var cateLibRaw = JSON.parse(localStorage.getItem('cateCache'));
    var taskLibRaw = JSON.parse(localStorage.getItem('taskCache'));
    if (cateLibRaw === null) {
        cLib.addCategory('默认分类');
        cLib.addCategory('Work');
        cLib.addCategory('Social');
        cLib.addCategory('Trifle');
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
        tLib = [];
        for (var i in taskLibRaw) {
            var curTaskRaw = taskLibRaw[i];
            var curTask = new Task(curTaskRaw.title, curTaskRaw.date, curTaskRaw.main);
            curTask.done = curTaskRaw.done;
            tLib.push(curTask);
        }
        cLib = [];
        for (var i in cateLibRaw) {
            var curCateRaw = cateLibRaw[i];
            var curCate = new Category(curCateRaw.name);
            for (var i in curCateRaw.tasks) {
                var curTaskName = curCateRaw.tasks[i].title;
                curCate.tasks.push(taskLib.filter(function(item){
                    return item.title === curTaskName;
                })[0]);
            }
            cLib.push(curCate);
        }
    }
}
function saveToCache(){
    localStorage.setItem('cateCache', JSON.stringify(cateLib));
    localStorage.setItem('taskCache', JSON.stringify(taskLib));
}