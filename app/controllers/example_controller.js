"use strict";
exports.index = function (req, res, next) {
    console.log('index');
    res.render('home/index.html');
};