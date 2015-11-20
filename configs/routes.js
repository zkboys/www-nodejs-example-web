/*
 * 路由映射文件
 * */

var express = require('express');
var router = express.Router();
var example = require('../app/controllers/example_controller');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home/index', {title: 'Express'});
});
router.get('/index', example.index);
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