/*
 * 路由映射文件
 * */
exports.setRequestUrl = function (app) {
    var example = require('../app/controllers/example_controller');
    app.get('/', example.index);
};