// 引入模块
var express = require('express');
//path.resolve绝对路径  path.join拼接路径  __dirname当前目录的绝对路劲
var path = require('path');
// 处理ico 文件的  处理logo图标的
var favicon = require('serve-favicon');
// 输出日志的
var logger = require('morgan');
//获取设置cookie的 req.cookie
var cookieParser = require('cookie-parser');
//处理请求体信息   req.body
var bodyParser = require('body-parser');

var session = require('express-session');
// 引入connect-mongo模块
var MongoStore = require('connect-mongo')(session);

// 引入flash模块，引入以后可以使用 req.flash(属性名，属性值)   获取 ： req.flash(属性名)
var flash = require('connect-flash');

//自定义模块 路由容器
var index = require('./routes/index');  //首页
var user = require('./routes/user');  //用户
var article = require('./routes/article'); //文章

var app = express();

// view engine setup
//设置模板引擎的根路径
app.set('views', path.join(__dirname, 'views'));
//模板引擎文件类型
app.set('view engine', 'html');
// 使用ejs语法解析html文件
app.engine('html',require('ejs').__express);



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 使用日志模块
app.use(logger('dev'));
// 使用bodyParser模块
app.use(bodyParser.json());
//处理表单请求的       extended: false 不用queryString模块解析
app.use(bodyParser.urlencoded({ extended: false }));
//使用cookie 模块
app.use(cookieParser());
//静态资源文件处理
app.use(express.static(path.join(__dirname, 'public')));

//使用session
app.use(session({
    secret : 'xiaoxiaohei',
    resave : true,
    saveUninitialized : true,
    //把session 存储到数据库中
    store : new MongoStore({
        url: require('./dbUrl').dbUrl
    })
}));
//使用falsh
app.use(flash());

//公共中间件
app.use(function(req,res,next) {
    //将session保存的user 登陆信息渲染到每个模板引擎中 这种渲染一般用在公共中
    res.locals.userInfo = req.session.userInfo;
    //判断登陆的用户是否是文章作者
    res.locals.flag = req.session.flag;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');//失败信息
    res.locals.keyword = req.session.keyword;
    res.locals.value=req.query.value;
    console.log(req.query.value)
    //搜索框中的内容
    //渲染个人中心背景图片
    res.locals.pic = req.session.pic;
    next();
});

//当请求的路径是/开头交给index来处理
app.use('/', index);
// 当请求的路径是users 开头都交给users处理
app.use('/user', user);
// 当请求的路径是./article开头交给article处理
app.use('/article',article);

// catch 404 and forward to error handler
//如果都不匹配的时候，执行下面的中间件
app.use(function(req, res, next) {
  var err = new Error('Not Found'); //处理错误的
  next(err);
});

// error handler
// 错误处理中间件
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //  可以给模板引擎文件传递数据 render的渲染效果是一样的
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
