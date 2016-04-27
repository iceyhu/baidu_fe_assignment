// @class Category构造器
function Category(name) {
    this.name = name;
    this.tasks = [];
	//@param {object} newTask Task实例
	//@return {boolean} 本实例tasks数组每一项的title都与newTask不同则将newTask推入数组，并返回true；否则直接返回false
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
	// @param {string} option undefined或'undone'或'done'
	// @return {array.<object>} 返回本实例tasks数组中［所有］或［done属性为假］或［done属性为真］的项构成的数组，按照date属性降序排列后返回
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
	//
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
// @param {array.<object>} taskArr 由Task实例构成的数组
// @param {string} property 要查询的Task属性名
// @return {array} taskArr 由taskArr的每一项的property的值构成的数组
function getTaskProperty(taskArr, property){
	return taskArr.map(function(item, array, index){
		return item[property];
	})
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
            + curCate.getTasksByStatus('undone').length;
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
    var tarTaskArr = tarCate.getTasksByStatus(option);
    // 找到该cate下符合参数条件的task的date属性，返回去重后的数组
    var dateArray = uniqArrayHASH(getTaskProperty(tarTaskArr, 'date'));
	console.log(tarTaskArr)
	// 添加日期标题
	var tarInnerHtml = '';
    for (var i in dateArray) {
		var curDate = dateArray[i];
		// 取得该cate下date属性为该日期的项的［名称］构成的数组
		var tasksOnThisDate = getTaskProperty(tarCate.getTasksByDate(curDate), 'title');
		// 遍历数组，将每一项的title属性写入当前date所在的ul内
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
renderTasksList()
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