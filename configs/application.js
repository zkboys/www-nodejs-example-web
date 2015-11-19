/*
 * 项目启动文件
 * */
var express = require('express')
    , urlHelper = require("./routes.js")
    , ejs = require('ejs')
    , http = require('http');
var app = express();
app.engine('html', ejs.renderFile);
app.configure(function () {
    app.set('port', 8084);
    app.set('view engine', 'ejs');
    app.set('views', '../app/views');
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static('../public'));
});
urlHelper.setRequestUrl(app);
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
