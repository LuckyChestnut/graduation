
$(function() {
    var oBtn = document.querySelector('.login_cha');
//        退出键hover 的效果
    $(oBtn).hover(function() {
        $(oBtn).css({color:'orange','fontSize' :'14px',cursor: 'pointer'});
        oBtn.innerHTML = '退出登陆';
    },function() {
        $(oBtn).css({color:'#fff','fontSize' :'45px'});
        oBtn.innerHTML = ' × ';
    });

//        点击退出键的时候
    oBtn.onclick = function() {
        location.href = '/';
    }

//    表单验证部分
    var form = document.querySelector('form');

    var username = document.querySelector('input[name=username]');
    $(username).focus(function () {
        $(this).next('b').css('color','#0f0f0f');
        $(this).next('b')[0].innerHTML = '用户名由6-16位字母数字下划线组成！';
    });
    $(username).blur(function () {
        if (username.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', 'red');
        } else if (username.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '用户名由6-16位字母数字下划线组成！';
            $(this).next('b').css('color', 'red');
        } else {
            $(this).next('b').css('color','#0f0f0f');
            $(this).next('b')[0].innerHTML = '用户名由6-16位字母数字下划线组成！';
        }
    });

    //        密码验证
    var password = document.querySelector('input[name=password]');
    $(password).focus(function () {
        console.log('获取焦点了！');
        $(this).next('b').css('color','#0f0f0f');
        $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
    });
    $(password).blur(function () {
        console.log('失去焦点了！');
        if (password.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', 'red');
        } else if (password.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
            $(this).next('b').css('color', 'red');
        } else {
            $(this).next('b').css('color','#0f0f0f');
            $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
        }
    });

    //         邮箱的验证
    var email = document.querySelector('input[name=email]');
    $(email).focus(function() {
        $(this).next('b').css('color','#0f0f0f');
        $(this).next('b')[0].innerHTML = '邮箱格式！如 ：xiaocui@qq.com';
    });
    $(email).blur(function() {
        if (email.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', '#e4393c');
        } else if (email.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '邮箱格式！如 ：xiaocui@qq.com';
            $(this).next('b').css('color', '#e4393c');
        } else {
            $(this).next('b').css('color','#0f0f0f');
            $(this).next('b')[0].innerHTML = '邮箱格式！如 ：xiaocui@qq.com';
        }
    })




});






