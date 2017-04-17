module.exports = function(input) {
    //引入加密模块  ( 加密模块还有 sha1 等等 )
    var crypto = require('crypto');

    //创建一个 MD5 加密
    var md5 = crypto.createHash('md5');
    //向 MD5 加密输入数据
    md5.update(input);
    return md5.digest('hex');
}









