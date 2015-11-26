/*
 * 路由映射文件,配置越靠前，优先级越高
 * */

var express = require('express');
var router = express.Router();
var authenticate = require('../app/controllers/authenticate_controller')
    , example = require('../app/controllers/example_controller');
var authenticated = authenticate.authenticate;
router.get('/login', function (req, res, next) {
    res.render('session/login.html');
});
router.get('/', function (req, res, next) {
    //req.csrfToken()
    //req.session.csrfSecret 老用法
    res.render('home/index', {title: 'Express', csrf: req.csrfToken()});
});
router.post('/', function (req, res, next) {
    res.send({title: 'Express'});
});
router.get('/index',authenticated, example.index);//需要登录才能访问的方法前面添加authenticated
router.all('/book', authenticated);// 所有的/book请求都需要登录
router.route('/book')
    .get(function (req, res) {
        res.send('Get a random book');
    })
    .post(function (req, res) {
        res.send('Add a book');
    })
    .put(function (req, res) {
        res.send('Update the book');
    })
    .delete(function (req, res) {
        res.send('Delete the book');
    });


module.exports = router;