function strToDate(input) {
    if (isValidDate(input)) {
        var matches = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return new Date(Date.UTC(matches[1], matches[2] - 1, matches[3]));
    }
    return null;
}

function calculateDiff(tarDate) {
    var diffSec = (Date.parse(tarDate) - Date.parse(new Date())) / 1000;
    if (diffSec > 0) {
        var d = Math.floor(diffSec / (60*60*24));
        var dLeave = diffSec % (60*60*24);
        var h = Math.floor(dLeave / (60*60));
        var hLeave = dLeave % (60*60);
        var m = Math.floor(hLeave / (60));
        var s = hLeave % (60);            
        var result = '距离' 
            + tarDate.getFullYear() 
            + '年'
            + (tarDate.getMonth() + 1) 
            + '月' 
            + tarDate.getDate() 
            + '日还有'
            + d 
            + '天'
            + h 
            + '小时' 
            + m 
            + '分' 
            + s 
            + '秒';
        return result;
    } else {
        return '';
    }
}

$.on('.form-c .submit', 'click', function(){
    var tarDate = strToDate($('#form-c .time').value);
    if (tarDate === null) {
        $('.form-c .info').style.backgroundColor = 'red';
        setTimeout(function(){
            $('.form-c .info').style.backgroundColor = 'antiquewhite';
        }, 3000);
    } else if (target instanceof Date) {        
        $('.form-c .info').style.backgroundColor = 'antiquewhite';
        var result = countTimeDiff(target);
        if (result !== false) {
            $('.form-c .counter').innerHTML = result;
        } else {
            return false;
        }            
        var counterID = setInterval(function(){
            result = countTimeDiff(target);
            if (result !== false) {
                $('.form-c .counter').innerHTML = result;
            } else {
                clearInterval(counterID);
            }
        }, 1000);                
    }
});


