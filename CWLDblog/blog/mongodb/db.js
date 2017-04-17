
//引入 mongoose 模块
var mongoose = require('mongoose');
//连接数据库
mongoose.connect(require('../dbUrl').dbUrl);

//创建 用户信息的骨架
var userSchema = mongoose.Schema( {
    username : String,      //用户名
    password : String,      //密码
    email : String,         //邮箱
    sex : String,           //性别
    poster : String ,       //头像
    pic : String            //个人中心的背景图片
});

//构建模型
var userModel = mongoose.model('user',userSchema);

//创建文章的骨架
var articleSchema = mongoose.Schema( {
    title : String,
    poster : String,
    biaoqian : String,
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    content : String,
    createAt : String,
    id : String
} );

//构建模型
var articleModel = mongoose.model('article',articleSchema);

module.exports.userModel = userModel;
module.exports.articleModel = articleModel;




