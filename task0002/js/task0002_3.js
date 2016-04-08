function moveOnce(element, tarX, tarY) {
    var s = document.defaultView.getComputedStyle(element);
    var curX = 0;
    var curY = 0;
    if (s.left !== 'auto') {
        curX = parseInt(s.left);
    }    
    if (s.top !== 'auto') {
        curY = parseInt(s.top);
    }
    syncBtn(tarX);
    var id = setInterval(function(){
        if (curX === tarX && curY === tarY) {
           clearInterval(id);
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
function syncBtn(posX) {
    highlightCurBtn(posX / -500);
}
// ---
function naturalOnce(element, interval) {
    highlightCurBtn(1);
    element.style.left = '-500px';
    var curX = -500;
    var id = setInterval(function(){
        if (curX === -3000) {
            clearInterval(id);
        }
        curX += -500;
        moveOnce(element, curX, 0);
    }, interval);
}
function naturalRepeat(element, interval) {
    highlightCurBtn(1);
    element.style.left = '-500px';
    var curX = -500;
    var id = setInterval(function(){
        if (curX === -3500) {
            curX = -500;
            element.style.left = '-500px';
        }
        curX += -500;
        moveOnce(element, curX, 0);
    }, interval);            
}
function reverseOnce(element, interval) {
    highlightCurBtn(6);
    element.style.left = '-3000px';
    var curX = -3000;
    var id = setInterval(function(){
        curX += 500;
        moveOnce(element, curX, 0);
        if (curX === -500) {
            clearInterval(id);
        } 
    }, interval);
}
function reverseRepeat(element, interval) {
    highlightCurBtn(6);
    element.style.left = '-3000px';
    var curX = -3000;
    var id = setInterval(function(){
        if (curX === -500) {
            element.style.left = '-3500px';
            curX = -3500;
        } 
        curX += 500;
        moveOnce(element, curX, 0);
    }, interval);
}
// ---
function highlightCurBtn(num) {
    $('.carousal-nav').innerHTML = '<img class="btn 1" src="img/spot_white.png"><img class="btn 2" src="img/spot_white.png"><img class="btn 3" src="img/spot_white.png"><img class="btn 4" src="img/spot_white.png"><img class="btn 5" src="img/spot_white.png"><img class="btn 6" src="img/spot_white.png">';
    if (num === 7) {
        num = 1;
    }
    if (num === 0) {
        num = 6;
    } 
    var tar = $('.carousal-nav .' + num);
    tar.setAttribute('src', 'img/spot_black.png');
}
function clBtnListener(e) {    
    var btnNum = e.target.getAttribute('class').match(/\s(\d)/)[1];
    highlightCurBtn(btnNum);
    var tarX = btnNum * -500;
    moveOnce($('#carousal .container'), tarX, 0);    
}
$.delegate('.carousal-nav', 'img', 'click', clBtnListener);
// ---
var target = $('#carousal .container');
var interval = 3000;
window.onload = function(){
    naturalRepeat(target, interval);
}



