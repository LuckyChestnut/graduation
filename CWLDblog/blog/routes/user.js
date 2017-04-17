var express = require('express');
var router = express.Router();

//引入自定义数据哭模块
var userModel = require('../mongodb/db').userModel;
//引入自定义文章模块
var articleModel = require('../mongodb/db').articleModel;
//引入自定义加密模块
var md5 = require('../md5/md5');

//引入用户是否登陆判断自定义模块
var auth = require('../middleware/auth');

//引入处理图片模块  处理头像
var multer = require('multer');
//图片的设置
var storage = multer.diskStorage({
    //图片储存的位置
    destination:function(req,file,cb) {
        cb(null,'../public/uploads');
    },filename : function(req,file,cb) {
        //图片的名字
        cb(null,file.originalname);
    }
});
var upload = multer({storage:storage});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册的静态页面
router.get('/reg',function(req,res,next) {
    console.log("我进来了！");
    res.render('user/reg',{title:'用户注册页面标题',content:'用户注册内容'});
});

//注册的post请求
router.post('/reg',upload.single('poster'),function(req,res) {
    //获取请求体信息
    var userInfo = req.body;
    console.log(userInfo);
    userInfo.password = md5(userInfo.password);
    if(req.file) { //如果上传了图片
        userInfo.poster ='/uploads/' + req.file.filename;
    }
    //查找所有信息，看用户是否注册过
    var obj = {
        username : userInfo.username,
        email : userInfo.email
    };
    userModel.find(obj,function(err,doc) {
        if(!err) {
            if(doc.length) { //有值，重新注册
                res.redirect('back');
            } else{
                //将信息保存才 用户信息的集合当中
                userModel.create(userInfo,function(err,doc) {
                    if(!err) {
                        console.log(doc);
                        res.redirect('/user/login');
                    } else {
                        res.redirect('back');
                    }
                })
            }
        } else {
            console.log('注册失败，请重新注册！');
            res.redirect('back');
        }
    })

// 图片没有存到文件夹中


});


//登陆的静态资源请求
router.get('/login',auth.no,function(req,res,next) {
    console.log('我是用户登陆页！');
    res.render('user/login',{title:'用户登陆页面标题',content:'用户登陆内容'});
});

//用户登陆的post请求 -->   用户名和密码登陆
router.post('/login',auth.no,function(req,res) {
    var userInfo = req.body;
    userInfo.password = md5(userInfo.password);
    var obj = {
        username : userInfo.name,
        password : userInfo.password
    };
//    查找此用户是否注册
    userModel.findOne({username : userInfo.username},function(err,doc) {
        if(!err) {
            console.log(doc);
            if(doc) {
                userModel.findById(doc._id,function(err,doc) {
                    if(!err) {
                        console.log(doc);
                        if(doc) {
                            req.session.userInfo = doc;
                            req.flash('success','登陆成功自动跳转到首页');
                            res.redirect('/');
                        } else {
                            req.flash('error','密码输入错误');
                            res.redirect('back');
                        }
                    } else {
                        req.flash('error','登陆出错，请重新操作！');
                        res.redirect('back');
                    }
                })
            } else {
                req.flash('error','请先注册再登陆！');
                res.redirect('/user/reg');
            }
        } else {
            req.flash('error','登陆出错，请重新操作！');
            res.redirect('back');
        }
    })
});

//邮箱登陆
router.get('/email',auth.no,function(req,res) {
    res.render('user/email',{title:'登陆页面',content:'email登陆页面！'});
});

//邮箱登陆的post请求
router.post('/email',auth.no,function(req,res) {
    console.log("我进来了e");
    var userInfo = req.body;
    userInfo.password = md5(userInfo.password);
    var obj = {
        email : userInfo.email,
        password : userInfo.password
    };
    console.log(userInfo.email);
//    查找此用户是否注册
    userModel.findOne({email : userInfo.email},function(err,doc) {
        if(!err) {
            console.log(doc);
            if(doc) {
                userModel.findById(doc._id,function(err,doc) {
                    if(!err) {
                        console.log(doc);
                        if(doc) {
                            req.session.userInfo = doc;
                            req.flash('success','登陆成功自动跳转到首页');
                            res.redirect('/');
                        } else {
                            req.flash('error','密码输入错误');
                            res.redirect('back');
                        }
                    } else {
                        req.flash('error','登陆出错，请重新操作！');
                        res.redirect('back');
                    }
                })
            } else {
                req.flash('error','请先注册再登陆！');
                res.redirect('/user/reg');
            }
        } else {
            req.flash('error','登陆出错，请重新操作！');
            res.redirect('back');
        }
    })
});

//个人中心的静态请求
router.get("/body",function(req,res) {
    var id = req.session.userInfo._id;
    //获取所有文章
    articleModel.find({})
        .populate('user')
        .exec(function(err,docs) {
            if(!err) {
                var arr = [];
               docs.forEach(function(doc,index){
                   //console.log(doc.user.username);
                   if(doc.user.username == req.session.userInfo.username) {
                       //console.log("找到了！");
                       //console.log(doc);
                       arr.push(doc);
                   }
                })
                console.log(arr);
                res.render('user/body',{title:'个人中心页',articles:arr,value:'个人中心'});
            } else {
                console.log(err);
            }
        })

});


//个人中心 修改个人信息的 post 请求
router.post('/bodyUserInfo',upload.single('poster'),function(req,res) {
    console.log("我是修改个人信息 的请求");
    var updateUserInfo = req.body;

    //头像发生改变的情况下
    if(req.file) {
        updateUserInfo.poster = '/uploads/' + req.file.filename;
    }
//    找到用户并进行修改
    var id = req.session.userInfo._id;
    userModel.update({_id:id},{$set :updateUserInfo},function(err,doc) {
        if(!err) {
            userModel.findById({_id:id},function(err,doc) {
                if(!err) {
                    req.flash('success','修改信息成功！');
                    req.session.userInfo = doc;
                    console.log(doc);
                    res.redirect('/user/body');
                } else {
                    req.flash('error','修改信息失败，请重新操作');
                    res.redirect('back');
                }
            })
        } else {
            req.flash('error','修改信息失败，请重新操作');
            res.redirect('back');
        }
    })
})

//设置个人中心的背景图片
router.post('/backGround',upload.single('pi'),function(req,res) {
    var userInfo = req.session.userInfo;
    if(req.body.pict) {
        userInfo.pic = req.body.pict;
    }
    if(req.file) {
        userInfo.pic = '/uploads/' + req.file.filename;
    }
    req.session.userInfo = userInfo;
    console.log(req.session.userInfo);
    res.redirect('/user/body');
});

//退出登陆
router.get('/exit',function(req,res) {
    //console.log("退出登陆！");
    req.session.userInfo = '';
    res.redirect('/');
});
module.exports = router;
