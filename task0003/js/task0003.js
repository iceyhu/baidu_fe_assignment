// @class Category构造器
function Category(name) {
    this.name = name;
    this.tasks = [];
	//@param {object} newTask Task实例
	//@return {boolean} 本实例tasks数组每一项的title都与newTask不同则将newTask推入数组，并返回true；否则直接返回false
    this.addTask = function(newTask) {
        var newTitle = newTask.title;
        for (var i in this.tasks) {
            if (this.tasks[i].title === newTitle) {
                return false;
            }
        }
        this.tasks.push(newTask);
        return true;
    };
	// @param {string} option undefined或'undone'或'done'
	// @return {number} 返回本实例tasks数组中［所有］或［done属性为假］或［done属性为真］的项数
    this.count = function(option){
        var c = 0;
        switch (option) {
            case undefined:
                c = this.tasks.length;               
                break;
            case 'undone':
                for (var i in this.tasks) {
                    if (this.tasks[i].done === false) {
                        c++;
                    }
                }
                break;
           case 'done':
                for (var i in this.tasks) {
                    if (this.tasks[i].done === true) {
                        c++;
                    }
                }
                break;
        }
        return c;
    };
	// @param {string} option undefined、'undone'或'done'
	// @return {array.<string>} 取得本实例tasks数组中［所有］或［done属性为假］或［done属性为真］的项，按date属性降序排列，返回各项title属性构成的数组
    this.getTaskNamesAccordingToStatus = function(option) {
        var r = [];
        var curTask;
        var condition =
            option === 'undone'
            ? false
            : true;
        for (var i in this.tasks) {
            curTask = this.tasks[i];
            if (curTask.done === condition) {
                r.push(curTask);
            }
        }
        // 按结果中每项的date属性（去掉-）重排序并返回。
        r.sort(function(d1, d2){
            var v1 = d1.date.replace('-', '');
            var v2 = d2.date.replace('-', '');
            if (v1 > v2) {
                return -1;
            } else {
                return 1;
            }
        });
        return r.map(function(item, index, array){
            return item.title;
        });
    };
	// @param {string} date 'xxxx-xx-xx'格式的字符串
	// @return {array.<string>} 取得本实例tasks数组中date属性等于参数的项，返回各项title属性构成的数组
	this.getTaskNamesAccordingToDate = function(date) {
        var r = [];
        var curTask;
        for (var i in this.tasks) {
            curTask = this.tasks[i];
            if (curTask.date === date) {
                r.push(curTask);
            }
        }
        return r.map(function(item, index, array){
            return item.title;
        });
    } 
}
// 声明存储Category对象的容器
var cateLib;
// @param {array.<object>} localLib undefined或由Category实例构成的数组
// @return {array.<object>} 无参数时将cateLib设为含一个Category对象的默认数组；否则设为参数的引用
function initCategory(localLib) {
	cateLib = 
        localLib === undefined
        ? [new Category('默认分类')]
        : localLib;
}

// @param {object} newCate Category实例
// @return {boolean} cateLib每一项的name属性都与参数的name属性不同，则将参数推入，并返回true；否则返回false
function addCategory(newCate) {
    var newName = newCate.name;
    for (var i in cateLib) {
        if (cateLib[i].name === newName) {
            return false;
        }
    }
    cateLib.push(newCate);
	return true;
}
// @param {string} cateName 要查询的类别的name
// @return {object} 遍历cateLib，发现第一个name与参数相同的项则返回其引用；否则返回null
function getCategory(cateName) {
    for (var i in cateLib) {
        if (cateLib[i].name === cateName) {
            return cateLib[i];
        }
    }
    return null;
}
// 添加若干Category和Task的实例
function forgeData() {
    addCategory(new Category('工作'));
    addCategory(new Category('社交'));
    addCategory(new Category('生活'));
    var defa1 = new Task('Dinner with my chick', '2017-02-14', 'wait i aint got none.');
	var defa2 = new Task('Burger King', '2017-04-01', 'havent had that for long.');
    cateLib[0].addTask(defa1);
    cateLib[0].addTask(defa2);
    var work1 = new Task('Finish task 5147', '2016-04-30', 'here is some content');
    var work2 = new Task('Write report', '2016-04-28', 'He he he.');
    cateLib[1].addTask(work1);
    cateLib[1].addTask(work2);
    var soci1 = new Task('Meet college pals', '2016-05-30', 'and have some beer.');
    cateLib[2].addTask(work1);
    cateLib[2].addTask(work2);
    var dail1 = new Task('Buy new shampoo', '2016-06-02', 'that CLEAR one.');
    var dail2 = new Task('Have a haircut', '2016-06-01', "to celebrate Children's day.");
    cateLib[3].addTask(work1);
    cateLib[3].addTask(work2);
}
// @class Task构造器
function Task(title, date, main) {
    this.title = title;
    this.date = date;
    this.main = main;
    this.done = false;
    this.markAsDone = function(){
        this.done = true;
    }
}
// @param {array.<object>} taskArr 由Task实例构成的数组
// @param {string} property 要查询的Task属性名
// @return {array} taskArr 由taskArr的每一项的property的值构成的数组
function getPropertyOfEach(taskArr, property) {
    return taskArr.map(function(item, index, array){
        return item[property];
    });
}
// 将cateLib每一项的name和其中tasks数组中undone的项数写入类为catelist的ul
// 为cateLib第一项（即默认分类）所在的元素添加active类
function renderCategoryList() {
    var cateList = $('.catelist');
    var tarInnerHtml = '';
    for (var i in cateLib) {
        var curCate = cateLib[i];
        tarInnerHtml += '<li class="cate">'
            + ''
            + '<span class="name">' 
            + curCate.name 
            + '</span>'
            + ''
            + '<span class="undone">' 
            + curCate.count('undone')
            + '</span>'
            + ''
            + '<img class="remove" src="img/icon-minus.png">'
            + ''
            + '</li>';
    }
    cateList.innerHTML = tarInnerHtml;
    addClass(cateList.childNodes[0], 'active');
}
// @param {string} option undefined或'done'或'undone'
// 根据catelist下有active类的li找到目标cate
// 获取该cate中的tasks数组内符合参数给定条件的项，得到这些项的date属性构成的数组并去重
// 为该数组中每一项建立ul，其中h1.date为每项的值
// 
function renderTasksList(option) {
    var cateName = $('.catelist .active').getElementsByClassName('name')[0].innerHTML;
    var tarCate = getCategory(cateName);
    var tarTaskArr;
    switch (option) {
        case undefined: 
            tarTaskArr = tarCate.tasks;
            break;
        default:
            tarTaskArr = tarCate.getTaskNamesAccordingToStatus(option);
            break;
    }
    // 找到该cate下符合参数条件的task的date属性，返回去重后的数组
    var dateArray = uniqArrayHASH(getPropertyOfEach(tarTaskArr, 'date'));
	console.log(tarTaskArr)
	// 添加日期标题
	var tarInnerHtml = '';
    for (var i in dateArray) {
		var curDate = dateArray[i];
		// 取得该cate下date属性为该日期的项的名称数组
		var tasksOnThisDate = tarCate.getTaskNamesAccordingToDate(curDate);
		// 遍历数组，将每一项写入当前date所在的ul内
        tarInnerHtml += '<ul class="day">'
			+ ''
			+ '<h1 class="date">'
			+ curDate
			+ '<h1>';
		for (var j in tasksOnThisDate) {
			tarInnerHtml += '<li class="task">'
				+ tasksOnThisDate[j]
				+ '</li>';
		}
		tarInnerHtml += '</ul>';
    }
	// 替换div.calender的innerHtml
	$('#tasks .calender').innerHTML = tarInnerHtml;
	
}
initCategory();
forgeData()
renderCategoryList()
renderTasksList('undone')
///////////////////////////////////总///////////////////////////////////
// 响应式布局：
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
}
window.onresize = function(){
    initResizingResponsive();
}