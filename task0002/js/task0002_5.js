var dragged;
var draggedParent;
var cloned;

function highlightItem(li) {
    li.style.backgroundColor = 'lightgreen';
    li.style.borderColor = 'lightgreen';
}
function resetItem(li) {
    li.style.backgroundColor = '';
    li.style.borderColor = '';
}
function highlightContainer(ul) {
    ul.style.borderColor = 'lightgreen';
}
function resetContainer(ul) {
    ul.style.borderColor = '';
}
function cloneItem(li) {
    var r = li.cloneNode();
    r.innerHTML = li.innerHTML;
    highlightItem(r);
    return r;
}
// ---
$.delegate('#main-5', 'li', 'dragstart', function(e){
    dragged = e.target;
    draggedParent = dragged.parentElement;
    cloned = cloneItem(dragged);
});
// dragover其它容器时改变容器样式、目标暂时消失，dragover自身容器时目标正常显示；
// 离开其它容器时恢复容器样式、目标正常显示，离开本身容器时目标暂时消失
$.delegate('#main-5', 'ul', 'dragover', function(e){
    e.preventDefault();
    var t = e.target;
    if (t !== draggedParent) {
        dragged.style.display = 'none';
        highlightContainer(t);
    } else {
        dragged.style.display = 'block';
    }
});
$.delegate('#main-5', 'ul', 'dragleave', function(e){
    var t = e.target;
    if (t !== draggedParent) {
        dragged.style.display = 'block';
        resetContainer(t);
   } else {
        dragged.style.display = 'none';
    }
});
$.delegate('#main-5', 'li', 'dragover', function(e){
    e.preventDefault();
    var tp = e.target.parentElement;
    if (tp !== draggedParent) {
        highlightContainer(e.target.parentElement);
        dragged.style.display = 'none';
    } else {
        dragged.style.display = 'block';
    }
});
$.delegate('#main-5', 'li', 'dragleave', function(e){
    var tp = e.target.parentElement;
    if (tp !== draggedParent) {
        resetContainer(tp);
        dragged.style.display = 'block';
    } else {
        dragged.style.display = 'none';
    }
});
// enter自身
$.delegate('#main-5', 'li', 'dragenter', function(e){
    e.preventDefault();
    var t = e.target;
    if (t.parentElement !== draggedParent) {
        highlightContainer(e.target.parentElement);
        dragged.style.display = 'none';    
    } else {
        dragged.style.display = 'block';
    }
});
// 根据drop位置放置新li，短时间内新li和容器边框高亮
$.delegate('#main-5', 'ul', 'drop', function(e){
    var t = e.target;
    if (t !== draggedParent) {
        var r = t.appendChild(cloned);
        setTimeout(function(){
            resetItem(r);
            resetContainer(t);
        }, 500);
    } else {
        dragged.style.display = 'block';
    }    
});
$.delegate('#main-5', 'li', 'drop', function(e){
    var t = e.target;
    if (t.parentElement !== draggedParent) {
        var r;
        var posY = e.offsetY;
        if (posY < 16) {
            r = t.parentElement.insertBefore(cloned, t);
        } else {
            r = t.parentElement.insertBefore(cloned, t.nextElementSibling);
        }
        setTimeout(function(){
            resetItem(r);
            resetContainer(t.parentElement);
        }, 500);
    }
});
// 非容器区域放置无效
$.on('#main-5', 'dragend', function(e){
    e.target.style.display = 'block';
});