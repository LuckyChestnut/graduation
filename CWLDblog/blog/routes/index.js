var express = require('express');
var router = express.Router();

var userModel = require('../mongodb/db').userModel;
var articleModel= require('../mongodb/db').articleModel;
//引入markdown 模块
var markdown = require('markdown').markdown;

/* GET home page. */

router.get('/', function(req, res, next) {
    var keyword = req.query.keyword;
    var queryObj = {};
    req.session.keyword = '';
    if(keyword) {
        //查找keyword 的有关的内容
        var reg = new RegExp(keyword,'i');
        //无论是标题还是内容，只要有一个满足就可以
        queryObj = {$or: [{title : reg},{content : reg},{biaoqian : reg}]};
        req.session.keyword = keyword;
        //console.log("index" + req.session.keyword);
    }

    //获取当前显示的页数
    var pageNum = parseInt(req.query.pageNum)?req.query.pageNum:1;
    //设置每页显示的条数
    var pageSize = 9;

    //获取文章集合的所有数据
    articleModel.find(queryObj)
        .populate('user')
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .exec(function(err,articles) {
            if(!err) {
                req.flash('success','获取所有数据成功，列表加载完成！');
                //把每个文章的内容中的markdown语法都转换成html代码
                articles.forEach(function(article,index) {
                    if(!article.poster) {
                        article.poster = '/uploads/0.jpg';
                    };
                    if(!article.biaoqian) {
                        article.biaoqian = '这个人很赖！没任何标签'
                    }
                    article.content = markdown.toHTML(article.content);
                });

                //获取总页数
                articleModel.count(queryObj,function(err,count) {
                    if(!err) {
                        //获取推荐部分的5个文章
                        articleModel.find()
                            .populate('user')
                            .limit(5)
                            .exec(function(err,article) {
                                if(!err) {
                                    res.render('index', {
                                        title: '首页',
                                        article : article,
                                        articles:articles,
                                        keyword : keyword,
                                        pageNum : pageNum,
                                        pageSize : pageSize,
                                        totalPage : Math.ceil(count/pageSize),
                                        value:'首页'
                                    });
                                } else {
                                    //console.log("查找推荐文章时出错！");
                                    res.redirect('back');
                                }
                            })

                    } else {
                        req.flash('error',"获取分页失败，请重新加载！");
                        res.redirect('back');
                    }
                });
            } else { //获取所有数据失败
                res.redirect('back');
            }
        })
});

//分类请求部分
router.get('/list',function(req,res) {
    //console.log("我是分类！");
    var type = req.query.type;
        var queryObj = {};
            //查找keyword 的有关的内容
            var reg = new RegExp(type,'i');
            //无论是标题还是内容，只要有一个满足就可以
            queryObj = {$or: [{title : reg},{content : reg},{biaoqian : reg}]};
            //console.log(queryObj);
        //获取当前显示的页数
        var pageNum = parseInt(req.query.pageNum)?req.query.pageNum:1;
        //设置每页显示的条数
        var pageSize = 6;

        //获取文章集合的所有数据
        articleModel.find(queryObj)
            .populate('user')
            .skip((pageNum-1)*pageSize)
            .limit(pageSize)
            .exec(function(err,articles) {
                if(!err) {
                    req.flash('success','获取所有数据成功，列表加载完成！');
                    //把每个文章的内容中的markdown语法都转换成html代码
                    articles.forEach(function(article,index) {
                        if(!article.poster) {
                            article.poster = '/uploads/0.jpg';
                        };
                        if(!article.biaoqian) {
                            article.biaoqian = '这个人很赖！没任何标签'
                        }
                        article.content = markdown.toHTML(article.content);
                    });

                    //获取总页数
                    articleModel.count(queryObj,function(err,count) {
                        if(!err) {
                            //获取推荐部分的5个文章
                            articleModel.find()
                                .populate('user')
                                .limit(5)
                                .exec(function(err,article) {
                                    if(!err) {
                                        res.render('index', {
                                            title: '首页',
                                            article : article,
                                            articles:articles,
                                            pageNum : pageNum,
                                            pageSize : pageSize,
                                            totalPage : Math.ceil(count/pageSize),
                                            flag:type
                                        });
                                    } else {
                                        console.log("查找推荐文章时出错！");
                                        res.redirect('back');
                                    }
                                })

                        } else {
                            req.flash('error',"获取分页失败，请重新加载！");
                            res.redirect('back');
                        }
                    });
                } else { //获取所有数据失败
                    res.redirect('back');
                }
            })
})

module.exports = router;
