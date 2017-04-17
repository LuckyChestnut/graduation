
var express = require('express');
var router = express.Router();
var fs = require("fs");
//移入文章的集合
var articleModel = require('../mongodb/db').articleModel;
//引入 markdown 模块
var markdown = require('markdown').markdown;
console.log(markdown);
//引入自定义模块判断用户是否登陆
var auth = require('../middleware/auth');
//引入处理图片模块
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


//添加文章的静态资源处理
router.get('/add',auth.ok,function(req,res) {
    //console.log("我是添加页");
    res.render('article/add',{title:"添加文章",content:"添加页的内容！",value:'添加文章'});
});

//添加文章的post请求
router.post('/add',auth.ok,upload.single('poster'),function(req,res) {
    //console.log(req.body);
    var articleInfo = req.body;
    articleInfo.createAt = new Date().toDateString();
    articleInfo.user = req.session.userInfo;
    if(req.file) {
        articleInfo.poster = '/uploads/' + req.file.filename;
    }

    //序号的重新排列
    articleModel.find({},function(err,docs) {
        if(!err) {
            console.log(docs.length);
            if(docs.length>0) {
                docs.forEach(function(article,index) {
                    articleModel.update({_id:article._id},{$set: {id : index}},function(err,doc) {
                    });
                })
                articleInfo.id = docs.length;
            } else {
                articleInfo.id = 1;
            }
        } else {
            console.log("获取所有文章失败！");
            res.redirect('back');
        }
    });
    articleModel.create(articleInfo,function (err,doc) {
        if(!err) {
            req.flash('发表文章成功，跳转到首页');
            res.redirect('/');
        } else {
            req.flash("添加出现错误！");
            res.redirect('back');
        }
    })
});

//详情页的静态资源请求
router.get('/detail',function(req,res) {
    var id = req.query.id;
    articleModel.findById({_id : id})
        .populate('user')
        .exec(function(err,article) {
            if(!err) {
                console.log("en");
                console.log(req.session.userInfo.username);
                console.log(article.user.username);
                if(req.session.userInfo.username == article.user.username) {
                    console.log("一样的!");
                    req.session.flag = req.session.userInfo;
                } else {
                    req.session.flag = '';
                }
                res.render('article/detail',{title:'详情页',article :article,flag:req.session.flag});
            } else {
                req.flash('error','获取详情页失败，请重新操作!');
                res.redirect('back');
            }
        })

});

//详情页的上一篇下一篇
router.get('/detailup',function(req,res) {
   var id = req.query.id;
   if(id == 0) {
       req.flash('error','已经是第一篇文章！');
       res.redirect('back');
   } else {
       articleModel.findOne({id : id-1})
           .populate('user')
           .exec(function(err,article) {
               if(!err) {
                   res.render('article/detail',{title:'详情页',article :article});
               } else {
                   req.flash('error','获取详情页失败，请重新操作!');
                   res.redirect('back');
               }
           })
   }

})

router.get('/detailnext',function(req,res) {
    var id = req.query.id;
    console.log(id);
    articleModel.count({},function(err,doc) {
        console.log('adsf');
        if(!err) {
            if(id == doc) {
                req.flash('error','已经是最后一篇文章！');
                res.redirect('back');
            } else {
                console.log(id+1);
                articleModel.findOne({id : parseInt(id)+1})
                    .populate('user')
                    .exec(function(err,article) {
                        if(!err) {
                            console.log(article);
                            res.render('article/detail',{title:'详情页',article :article});
                        } else {
                            req.flash('error','获取详情页失败，请重新操作!');
                            res.redirect('back');
                        }
                    })
            }
        } else {
            req.flash('error','获取详情页失败！');
            res.redirect('back');
        }
    })
   /* if(id == 0) {
        req.flash('error','已经是第一篇文章！');
        res.redirect('back');
    } else {
    articleModel.findOne({id : id+1})
        .populate('user')
        .exec(function(err,article) {
            if(!err) {
                res.render('article/detail',{title:'详情页',article :article});
            } else {
                req.flash('error','获取详情页失败，请重新操作!');
                res.redirect('back');
            }
        })*/
})

//编辑页的静态资源请求
router.get('/update',auth.ok,function (req,res) {
    var id = req.query._id;
    articleModel.findById({_id:id})
        .populate('user')
        .exec(function(err,article) {
            if(!err) {
                console.log("en");
                console.log(req.session.userInfo.username);
                console.log(article.user.username);
                if(req.session.userInfo.username == article.user.username) {
                    console.log("一样的!");
                    req.session.flag = req.session.userInfo;
                } else {
                    req.session.flag = '';
                }
                res.render('article/update',{title:'编辑页',article:article});
            } else {
                req.flash('error','编辑页加载失败！');
                res.redirect('back');
            }
    })
})

//编辑页面的post请求
router.post('/update',auth.ok,upload.single('poster'),function(req,res) {
    var newArticle = req.body;
    var id = req.query._id;
    if(req.file) {
        newArticle.poster ='/uploads/' + req.file.filename;
    }
    console.log(newArticle);
    articleModel.update({_id:id},{$set:newArticle},function(err,doc) {
        if(!err) {
            console.log(doc) ;
            res.redirect('/');
        } else {
            req.flash("提交文章失败，请重新操作！");
            res.redirect('back');
        }
    })
});

//删除文章的请求
router.get('/remove',auth.ok,function(req,res) {
    var _id = req.query._id;
    articleModel.remove({_id:_id},function(err,doc) {
        if(!err) {
            req.flash('success','删除成功自动跳转到首页！');
            res.redirect('/');
        } else {
            req.flash('error','删除出现错误，请重试');
            res.redirect('back');
        }
    })
});

//个人中心的删除请求
router.get('/removeTo',auth.ok,function (req,res) {
    var _id = req.query.id;
    console.log("asdhasdksajdkasjkda");
    console.log(_id);
    articleModel.remove({_id:_id},function(err,doc) {
        if(!err) {
            req.flash('success','删除成功!');
            res.redirect('back');
        } else {
            req.flash('error','删除出现错误，请重试');
            res.redirect('back');
        }
    })
});

module.exports = router;




