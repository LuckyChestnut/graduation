
// 登陆以后才能进行的操作
function ok(req,res,next) {
// 判断用户是否登陆了
    if(req.session.userInfo) { //用户登陆 可以添加文章
        next();
    } else{ //用户没有登陆
        req.flash('error','次操作只有在用户登陆之后才能进行！请先进行登陆！');
        res.redirect('/user/login');
    }
}
//没登陆时才能进行的操作
function no(req,res,next) {
    if(req.session.userInfo) { //用户登陆了
        req.flash('error','次操作只在用户没有登陆的时候才能进行！');
        res.redirect('/');
    } else { //用户没有登陆
        next();
    }
}
//到处函数
module.exports = {
    ok : ok,
    no : no
};




