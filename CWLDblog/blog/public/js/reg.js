
$(function() {
    var oClose = document.getElementById('close'); //关闭按钮

//    退出啊按钮hover 的效果
    $(oClose).hover(function () {
        $(oClose).css({'fontSize': '14px', "color": 'orange'});
        oClose.innerHTML = '退出注册';
    }, function () {
        $(oClose).css({'fontSize': '45px', "color": '#999'});
        oClose.innerHTML = ' × ';
    });
//  退出按钮 点击 退回到主页
    oClose.onclick = function () {
//  问题 1  ： 退出的时候有一个边框闪烁的问题
        location.href = '/';
    };

//    表单验证
    var oForm = document.getElementById('form');
    var oB = document.getElementsByTagName('b');
//    用户名 ：
    var username = document.querySelector('input[name=username]');
    $(username).focus(function () {
        $(this).next('b').css('display', 'inline-block').css('color','#999');
        $(this).next('b')[0].innerHTML = '用户名由6-16位字母数字下划线组成！';
    })
    var user = false;
    $(username).blur(function () {
        if (username.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', 'red');
        } else if (username.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '用户名由6-16位字母数字下划线组成！';
            $(this).next('b').css('color', 'red');
        } else {
            $(this).next('b')[0].innerHTML = '√';
            $(this).next('b').css({'color': 'green', fontWeight: 'blod'});
            user = true;
        }
    })

//        密码验证
    var password = document.querySelector('input[name=password]');
    $(password).focus(function () {
        console.log('获取焦点了！');
        $(this).next('b').css('display', 'inline-block').css('color',"#999");
        $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
    })
    var pass = false;
    var passOne = '';
    $(password).blur(function () {
        console.log('失去焦点了！');
        if (password.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', 'red');
        } else if (password.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
            $(this).next('b').css('color', 'red');
        } else {
            $(this).next('b')[0].innerHTML = '√';
            $(this).next('b').css({'color': 'green', fontWeight: 'blod'});
            pass = true;
        }
        passOne = password.value;
        console.log(passOne);
    });


//        确认密码的验证
    var passwordTwo = document.querySelector('#passwordTwo');
    console.log(passwordTwo);
    $(passwordTwo).focus(function() {
        console.log("我获取焦点了！");
        $(this).next('b').css('display','inline-block');
        $(passwordTwo).next().css("color",'#999');
        password.innerHTML = '两次密码需一致！';
    });
    var passTwo = false ;
    $(passwordTwo).blur(function(){
        if(passwordTwo.value == passOne) {
            console.log("密码一致了！");
            if($(this)[0].value =='') {
                $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
                $(this).next('b').css('color','red');
            }  else if($(this)[0].validity.patternMismatch) {
                $(this).next('b')[0].innerHTML = '密码由6-16位字母数字下划线组成！';
                $(this).next('b').css('color','red');
            } else {
                $(this).next('b')[0].innerHTML = '√';
                $(this).next('b').css({'color':'green',fontWeight:'blod'});
                passTwo = true;
            }
        }
        else {
            $(this).next('b')[0].innerHTML = '亲！两次密码不一致！';
            $(this).next('b').css({'color':'red'});
        }
    })

//         邮箱的验证
    var email = document.querySelector('input[name=email]');
    var emailFlag = false;
    $(email).focus(function() {
        $(this).next('b').css('display', 'inline-block').css('color',"#999");
        $(this).next('b')[0].innerHTML = '邮箱格式！如 ：xiaocui@qq.com';
    });
    $(email).blur(function() {
        if (email.validity.valueMissing) {
            $(this).next('b')[0].innerHTML = '亲！这是必填项哟！';
            $(this).next('b').css('color', 'red');
        } else if (email.validity.patternMismatch) {
            $(this).next('b')[0].innerHTML = '邮箱格式！如 ：xiaocui@qq.com';
            $(this).next('b').css('color', 'red');
        } else {
            $(this).next('b')[0].innerHTML = '√';
            $(this).next('b').css({'color': 'green', fontWeight: 'blod'});
            emailFlag = true;
        }
    })
})







