/*
@param {string} input 
@return {object} 输入若为有效日期则转换为Date对象返回之，否则返回null
*/
function strToDate(input) {
    if (isValidDate(input)) {
        var matches = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        return new Date(Date.UTC(matches[1], matches[2] - 1, matches[3]));
    }
    return null;
}
/*
@param {object} tarDate 
@return {string} 目标日期与此刻时间之差，字符串形式
*/
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
    var tarDate = strToDate($('.form-c .input').value);
    if (tarDate === null) {
        $('.form-c .info').style.backgroundColor = '#f36c60';
        setTimeout(function(){
            $('.form-c .info').style.backgroundColor = '#ffe082';
        }, 2000);
    }         
    var result = calculateDiff(tarDate);
    if (result !== '') {
        $('.form-c .counter').innerHTML = result;
    } else {
        return false;
    }            
    var counterID = setInterval(function(){
        result = calculateDiff(tarDate);
        if (result !== '') {
            $('.form-c .counter').innerHTML = result;
        } else {
            clearInterval(counterID);
        }
    }, 1000);                
});