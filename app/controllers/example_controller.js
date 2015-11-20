"use strict";
exports.index = function (req, res, next) {
    console.log('index11111');
    res.render('home/index.html');
};