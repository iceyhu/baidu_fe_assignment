var dragged;
var draggedParent;
var cloned;

function focusLi(li) {
    li.style.backgroundColor = '#0666c6';
    li.style.borderColor = '#0666c6';
}
function resetLi(li) {
    li.style.backgroundColor = '';
    li.style.borderColor = '';
}
function focusContainer(ul) {
    ul.style.borderColor = '#0666c6';
}
function resetContainer(ul) {
    ul.style.borderColor = '';
}
function cloneLi(li) {
    var r = li.cloneNode();
    r.innerHTML = li.innerHTML;
    focusLi(r);
    return r;
}
// start时复制目标li，保存目标父对象和复制对象的引用
$.delegate('#main-5', 'li', 'dragstart', function(e){
    dragged = e.target;
    draggedParent = dragged.parentElement;
    cloned = cloneLi(dragged);
});
// over其它容器时改变容器样式、目标暂时消失，over自身容器时目标正常显示
// leave其它容器时恢复容器样式、目标正常显示，leave自身容器时目标暂时消失
$.delegate('#main-5', 'ul', 'dragover', function(e){
    e.preventDefault();
    var et = e.target;
    if (et !== draggedParent) {
        dragged.style.display = 'none';
        focusContainer(et);
    } else {
        dragged.style.display = 'block';
    }
});
$.delegate('#main-5', 'ul', 'dragleave', function(e){
    var et = e.target;
    if (et !== draggedParent) {
        dragged.style.display = 'block';
        resetContainer(et);
   } else {
        dragged.style.display = 'none';
    }
});
$.delegate('#main-5', 'li', 'dragover', function(e){
    e.preventDefault();
    var etp = e.target.parentElement;
    if (etp !== draggedParent) {
        focusContainer(etp);
        dragged.style.display = 'none';
    } else {
        dragged.style.display = 'block';
    }
});
$.delegate('#main-5', 'li', 'dragleave', function(e){
    var etp = e.target.parentElement;
    if (etp !== draggedParent) {
        resetContainer(etp);
        dragged.style.display = 'block';
    } else {
        dragged.style.display = 'none';
    }
});
// 如drop目标非自身所在容器，高亮新li和容器片刻
$.delegate('#main-5', 'ul', 'drop', function(e){
    var et = e.target;
    if (et !== draggedParent) {
        var r = et.appendChild(cloned);
        setTimeout(function(){
            resetLi(r);
            resetContainer(et);
        }, 1000);
    } else {
        dragged.style.display = 'block';
    }    
});
// 如drop目标非自身所在容器，根据drop位置放置新li
$.delegate('#main-5', 'li', 'drop', function(e){
    var et = e.target;
    var etp = e.target.parentElement;
    if (etp !== draggedParent) {
        var posY = e.offsetY;
        var r;
        if (posY < 16) {
            r = etp.insertBefore(cloned, et);
        } else {
            r = etp.insertBefore(cloned, et.nextElementSibling);
        }
        setTimeout(function(){
            resetLi(r);
            resetContainer(etp);
        }, 1000);
    }
});
// end在非容器区域时无效
$.on('#main-5', 'dragend', function(e){
    e.target.style.display = 'block';
});