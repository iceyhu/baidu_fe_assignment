var input = $('#form-h .hobby');
var container = $('#form-h .container');

function showAlert() {
    var t = $('#form-h .error');
    t.style.display = 'block';
    setTimeout(function(){
        t.style.display = 'none';
    }, 1000);
}
function dismissAlert() {
    var t = $('#form-h .error');
    t.style.display = 'none';
}
function filterInput(str) {
    if (str !== '') {
        var r = str.split(/[,\s\uFF0C\u3001\uFF1B]+/);
        // 去除内容为空字符串的项
        for (var i = 0, l = r.length; i < l; i++) {
            if (r[i] === '') {
                r.splice(i, 1);
            }
        }
        return uniqArray(r);
    } else {
        return false;
    }
};
function renderResultArray(arr) {
    var r = '<br>';
    for (var i = 0, l = arr.length; i < l; i++) {
        r += '<input type="checkbox">' + arr[i] + ' </input>';
    }
    container.innerHTML = r;
}
$.click('#form-h .submit', function(){
    var r = filterInput(input.value);
    if (r !== false) {
        dismissAlert();
        renderResultArray(r);
    } else {
        showAlert();
    }  
    
    console.log(r)
});
$.click('#form-h .reset', function() {
    input.value = '';
    container.innerHTML = '';
});