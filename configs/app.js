var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , swig = require('swig')

    , routes = require('./routes')
    , configs = require('./configs');

var app = express();
var run_mod = app.get('env');
var config = configs[run_mod] || configs['development'];
var siteRootPath = __dirname.substring(0, __dirname.length - 8);
// view engine setup
app.set('views', path.join(siteRootPath, 'app', 'views'));
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
//扩展 swig的全局方法。在这里扩展就没法使用res了。。。
/*

 swig.setDefaults({
 locals: {
 static_url: function (path) {// TODO 模板本身有没有提供一个这样的方法？
 //TODO 计算文件的MD5,拼接查询字符串。
 /!*
 * 实现方案：
 * 读取本地服务器文件，计算md5,拼接查询字符串:v=xxxxxxxxxxxxx
 * 设置一个缓存，要来缓存文件的md5,不要每次都计算，服务器重启时会清空缓存。
 * nginx配置静态文件缓存为永久有效。
 * 如果使用cdn怎么办？每次版本发布清空cdn？还是cdn本身会处理查询字符串？
 *
 * *!/
 return config.static_url_prefix + path;
 }
 }
 });
 */

if (run_mod !== 'production') {//非生产环境下，不是用缓存
    // Swig will cache templates for you, but you can disable that and use Express's caching instead, if you like:
    app.set('view cache', false);
    // To disable Swig's cache, do the following:
    swig.setDefaults({cache: false});
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//TODO cookie怎么跟域名绑定，比如，我如果通过ip直接访问项目，cookie是无效的，必须使用域名访问。
//TODO cookie的加密算法？底层实现了？
app.use(cookieParser(config.cookie_secret));
// 对应的连接写成：/css/common.css
//app.use(express.static(path.join(siteRootPath, 'public')));
// 创建一个虚拟目录，对应的连接要写成/s/css/common.css
app.use(config.static_url_prefix, express.static(path.join(siteRootPath, 'public')));

app.use(function (req, res, next) {
    //所有的请求都会先经过这里，可以在这里做一些操作
    var headers = req.headers;
    var isAjax = false;
    if ('x-requested-with' in headers && headers["x-requested-with"].toLowerCase() == "xmlhttprequest") {
        isAjax = true;
    }
    swig.setDefaults({
        locals: {
            isAjax: isAjax,
            static_url: function (path) {// TODO 模板本身有没有提供一个这样的方法？
                //TODO 计算文件的MD5,拼接查询字符串。
                /*
                 * 实现方案：
                 * 读取本地服务器文件，计算md5,拼接查询字符串:v=xxxxxxxxxxxxx
                 * 设置一个缓存，要来缓存文件的md5,不要每次都计算，服务器重启时会清空缓存。
                 * nginx配置静态文件缓存为永久有效。
                 * 如果使用cdn怎么办？每次版本发布清空cdn？还是cdn本身会处理查询字符串？
                 *
                 * */
                return config.static_url_prefix + path;
            }
        }
    });
    next();
});
app.use('/',routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
