var input = $('.form-h .input');
var container = $('.form-h .container');
/*
@param {string} str
@return {array.<string>} 用空格类字符或中文逗号或英文逗号或顿号将参数字符串分隔，去掉空字符串项，返回去重的数组
*/
function filterInput(str) {
    var r = str.split(/[,\s\uFF0C\u3001\uFF1B]+/);
    r.filter(function(item){
        return item !== '';
    });
    return uniqArrayHASH(r);
};
/*
@param {array.<string>} arr 
生成内容分别为参数中每一项的checkbox，写入容器
*/
function renderResultArray(arr) {
    var r = '';
    for (var i in arr) {
        r += '<input type="checkbox">' + arr[i] + ' </input>';
    };
    container.innerHTML = r;
}
$.click('.form-h .submit', function(){
    var r = filterInput(input.value);
    if (r !== false) {
        $('.form-h .error').style.display = 'none';
        renderResultArray(r);
    } else {
        $('.form-h .error').style.display = 'block';
        setTimeout(function(){
            $('.form-h .error').style.display = 'none';
        }, 3000);
    }  
});
$.click('.form-h .reset', function() {
    input.value = '';
    container.innerHTML = '';
});