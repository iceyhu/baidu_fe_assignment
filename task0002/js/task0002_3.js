/*
@param {object} element 要移动的元素
@param {string} tarX 目标水平坐标
@param {string} tarX 目标垂直坐标
目标元素样式中如已设置left和top则将其作为当前的x和y，当前坐标与目标坐标相等时返回
差值大于5px时，每段时间移动差值的五分之一取整
否则，每段时间移动1px
*/
function moveOnce(element, tarX, tarY) {
    var s = document.defaultView.getComputedStyle(element);
    var curX = 
        s.left !== 'auto'
        ? parseInt(s.left)
        : 0;
    var curY = 
        s.top !== 'auto'
        ? parseInt(s.top)
        : 0;
    focusSpot(tarX / -500);
    setInterval(function(){
        if (curX === tarX && curY === tarY) {
           return;
        }
        if (curX < tarX) {
            curX += (tarX - curX < 5) ? 1 : Math.floor((tarX - curX) / 5);
        }
        if (curY < tarY) {
            curY += (tarY - curY < 5) ? 1 : Math.floor((tarY - curY) / 5);
        }
        if (curX > tarX) {
            curX -= (curX - tarX < 5) ? 1 : Math.floor((curX - tarX) / 5);
        }
        if (curY > curY) {
            curY -= (curY - tarY < 5) ? 1 : Math.floor((curY - tarY) / 5);
        }                
        element.style.left = curX + 'px';
        element.style.top = curY + 'px';        
    }, 20);
}
/*
@param {number} i 要点亮的spot序号
重置btn列表的html后改变目标项的样式
*/
function focusSpot(i) {
    if (i === 6) {
        i = 1;
    }
    if (i === 0) {
        i = 5;
    }
    $('#main-3 .nav').innerHTML = ''
        + '<img class="spot spot1" src="img/spot_white.png">'
        + '<img class="spot spot2" src="img/spot_white.png">'
        + '<img class="spot spot3" src="img/spot_white.png">'
        + '<img class="spot spot4" src="img/spot_white.png">'
        + '<img class="spot spot5" src="img/spot_white.png">';
    $('.spot' + i).setAttribute('src', 'img/spot_black.png');
}
/*
取得轮盘元素的引用
*/
var carousal = $('.carousal .container');
/*
@param {number} interval 毫秒单位的动作间隔
正序单次
*/
function naturalOnce(interval) {
    focusSpot(1);
    // 从2开始
    carousal.style.left = '-500px';
    var curX = -500;
    // 移动至6时返回
    setInterval(function(){
        if (curX === -2500) {
            return;
        }
        curX += -500;
        moveOnce(carousal, curX, 0);
    }, interval);
}
/*
@param {number} interval 毫秒单位的动作间隔
正序循环
*/
function naturalRepeat(interval) {
    focusSpot(1);
    // 从2开始
    carousal.style.left = '-500px';
    var curX = -500;
    setInterval(function(){
        // 移动至6（与1内容相同）时，重置轮盘至原始位置
        if (curX === -3000) {
            curX = -500;
            carousal.style.left = '-500px';
        }
        curX += -500;
        moveOnce(carousal, curX, 0);
    }, interval);            
}
/*
@param {number} interval 毫秒单位的动作间隔
逆序单次
*/
function reverseOnce(interval) {
    focusSpot(5);
    // 从6开始
    carousal.style.left = '-2500px';
    var curX = -2500;
    setInterval(function(){
        // 移动至2时返回
        if (curX === -500) {
            return;
        } 
        curX += 500;
        moveOnce(carousal, curX, 0);
    }, interval);
}
/*
@param {number} interval 毫秒单位的动作间隔
逆序循环
*/
function reverseRepeat(interval) {
    focusSpot(5);
    // 从6开始
    carousal.style.left = '-2500px';
    var curX = -2500;
    setInterval(function(){
        // 移动至1（与6内容相同）时，重置轮盘至原始位置
        if (curX === 0) {
            carousal.style.left = '-2500px';
            curX = -2500;
        } 
        curX += 500;
        moveOnce(carousal, curX, 0);
    }, interval);
}
$.delegateByClassName('#main-3 .nav', 'spot', 'click', function(e){
   var et = e.target;
    var i = et.getAttribute('class').match(/(\d)/)[0];
    focusSpot(i);
    moveOnce(carousal, i * -500, 0);
})
$.delegateByClassName('#main-3 .config', 'style', 'click', function(e){
    var et = e.target;
    var radios = $('#main-3 .config').getElementsByClassName('interval');
    for (var i in radios) {
        if (radios[i].checked === true) {
            var interval = radios[i].value * 1000;
            break;
        }
    }
    switch (et.value) {
        case ('正序单次'):
            naturalOnce(interval);
            break;
        case ('正序循环'):
            naturalRepeat(interval);
            break;
        case ('逆序单次'):
            reverseOnce(interval);
            break;
        case ('逆序循环'):
            reverseRepeat(interval);
            break;            
    }        
})