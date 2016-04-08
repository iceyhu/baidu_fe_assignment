function filterDate(input) {
    if (typeof input === 'string') {
        if (input !== '') {
            var matches = input.match(/^([12]\d\d\d)-([01][1-9])-([0123][1-9])/);
            if (matches) {
                if (matches[2] < 13 && matches[3] < 32) {
                    var result = new Date(Date.UTC(matches[1], matches[2] - 1, matches[3]));
                    return result;
                }
            }
        }
        return false;
    } else {
        return false;
    }
}

function countTimeDiff(target) {
    if (target instanceof Date) {
        var diffSec = (Date.parse(target) - Date.parse(new Date())) / 1000;
        var result,
            d,
            dLeave,
            h,
            hLeave,
            m,
            s;
        if (diffSec > 0) {
            d = Math.floor(diffSec / (60*60*24));
            dLeave = diffSec % (60*60*24);
            h = Math.floor(dLeave / (60*60));
            hLeave = dLeave % (60*60);
            m = Math.floor(hLeave / (60));
            s = hLeave % (60);            
            result = '距离' 
                + target.getFullYear() + '年' + (target.getMonth() + 1) + '月' + target.getDate() + '日还有'
                + d + '天' + h + '小时' + m + '分' + s + '秒';
            return result;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

$.on('#form-c .submit', 'click', function(){
    var target = filterDate($('#form-c .time').value);
    if (target === false) {
        $('#form-c .info').style.backgroundColor = 'red';
        setTimeout(function(){
            $('#form-c .info').style.backgroundColor = 'antiquewhite';
        }, 1000);
    } else if (target instanceof Date) {        
        $('#form-c .info').style.backgroundColor = 'antiquewhite';
        var result = countTimeDiff(target);
        if (result !== false) {
            $('#form-c .counter').innerHTML = result;
        } else {
            return false;
        }            
        var counterID = setInterval(function(){
            result = countTimeDiff(target);
            if (result !== false) {
                $('#form-c .counter').innerHTML = result;
            } else {
                clearInterval(counterID);
            }
        }, 1000);                
    }
});


