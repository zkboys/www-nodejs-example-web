(function () {
    'use strict';
    var gulp = require('gulp'),
    //argv = require('yargs').argv,
    //gutil = require('gulp-util'),
    //connect = require('gulp-connect'),
    //open = require('gulp-open'),
        less = require('gulp-less'),
    //jade = require('gulp-jade'),
        rename = require('gulp-rename'),
    //header = require('gulp-header'),
        path = require('path'),
        uglify = require('gulp-uglify'),
    //sourcemaps = require('gulp-sourcemaps'),
        minifyCSS = require('gulp-minify-css'),
    //tap = require('gulp-tap'),
        concat = require('gulp-concat'),
    //jshint = require('gulp-jshint'),
    //stylish = require('jshint-stylish'),
    //fs = require('fs'),
        autoprefix = require('gulp-autoprefixer'),
        replace = require('gulp-batch-replace'),
        del = require('del'),
        paths = {
            root: './',//当前路径
            source: {
                root: './',
                styles: './less/',
                scripts: './js/',
                fonts: './fonts/',
                img: './img/'
            },
            public: {
                root: '../../public',
                styles: '../../public/css/',
                scripts: '../../public/js/',
                fonts: '../../public/fonts/',
                img: '../../public/img/'
            }
        };

    //var replaceThis = [
    //    ['ws://www.j.com:8084/soc', 'ws://www.j.com:8084/soc']
    //];
    //
    //var mod = argv.m;
    //if (mod == "development") {
    //    replaceThis = [
    //        ['ws://www.j.com:8084/soc', 'ws://www.j.com:8084/soc']
    //    ];
    //} else if (mod == "test") {
    //    replaceThis = [
    //        ['ws://www.j.com:8084/soc', 'test']
    //    ];
    //} else if (mod == "production") {
    //    replaceThis = [
    //        ['ws://www.j.com:8084/soc', 'ws://pre.aiwanr.com:8084/soc']
    //    ];
    //}
    var timestamp = new Date().getTime();
    var replaceFontUrl = [
        ["iconfont.eot", "iconfont.eot?v=" + timestamp],
        ["iconfont.eot?#iefix", "iconfont.eot?v=" + timestamp + "#iefix"],
        ["iconfont.woff", "iconfont.woff?v=" + timestamp],
        ["iconfont.ttf", "iconfont.ttf?v=" + timestamp],
        ["iconfont.svg#iconfont", "iconfont.svg?v=" + timestamp + "#iconfont"]
    ];
    gulp.task('styles', function (cb) {
        gulp.src([paths.source.styles + 'app.less'])//标记要处理的文件，读文件过程
            .pipe(less({
                paths: [path.join(__dirname, 'less', 'includes')]
            }))
            .pipe(autoprefix())//last 2 versions
            .pipe(replace(replaceFontUrl))
            .pipe(gulp.dest(paths.public.styles))//处理完成的文件输出位置，写文件过程
            .pipe(minifyCSS({//css压缩
                advanced: false,
                aggressiveMerging: false
            }))
            .pipe(rename(function (path) {//压缩后重命名
                path.basename = path.basename + '.min';
            }))
            .pipe(gulp.dest(paths.public.styles))//输出压缩后的文件
            //.pipe(connect.reload())//本地服务器相关的，如果配置了本地服务器，指的是本地服务器重启
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });
    gulp.task('scripts', function (cb) {//这个一次性处理的有点多,有点慢3.66s
        gulp.src(paths.source.scripts + '*.js')
            .pipe(gulp.dest(paths.public.scripts))
            .pipe(uglify())
            .pipe(rename(function (path) {
                path.basename = path.basename + '.min';
            }))
            .pipe(gulp.dest(paths.public.scripts))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });

    gulp.task('img', function (cb) {
        gulp.src([paths.source.img + '*.*'])
            .pipe(gulp.dest(paths.public.img))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });
    gulp.task('fonts', function (cb) {
        gulp.src([paths.source.fonts + '*.*'])
            .pipe(gulp.dest(paths.public.fonts))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });
    gulp.task('simditor', function (cb) {
        gulp.src([paths.root + 'simditor-2.3.2/**'])
            .pipe(gulp.dest(paths.public.root + '/simditor/'))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });
    gulp.task('datetime-js', function (cb) {
        gulp.src([
            paths.root + 'datetime/public/js/datetime.js',
            paths.root + 'datetime/public/js/datetime.min.js'
        ])
            .pipe(gulp.dest(paths.public.scripts))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });
    gulp.task('datetime-css', function (cb) {
        gulp.src([
            paths.root + 'datetime/public/css/datetime.css',
            paths.root + 'datetime/public/css/datetime.min.css'
        ])
            .pipe(gulp.dest(paths.public.styles))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });

    gulp.task('framework', function (cb) {
        gulp.src([
            paths.root + 'framework/dist/**'
        ])
            .pipe(gulp.dest(paths.public.root))
            .on('end', function () {//完成后的回调，继续执行其他任务？
                cb();
            });
    });


    gulp.task('watch', function () {
        gulp.watch(paths.source.scripts + '*.js', ['scripts']).on('change', function (event) {
            watcherLog(event);
        });
        gulp.watch(paths.source.styles + '*.*', ['styles']).on('change', function (event) {
            watcherLog(event);
        });
        gulp.watch(paths.root + 'framework/dist/**', ['framework']).on('change', function (event) {
            watcherLog(event);
        });
    });
    function watcherLog(event) {
        var filePath = event.path;
        var fileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        console.log('File ' + fileName + ' was ' + event.type + ', running tasks...');
    }

    //由于调用顺序问题，这个任务无法加到default中，需要手动处理
    gulp.task('clean', function (cb) {
        del([
            paths.public.root + '/**/*'
        ], {force: true}, cb);
    });
    gulp.task('default', ['styles', 'img', 'fonts', 'scripts', 'simditor', 'datetime-js', 'datetime-css', 'framework']);
})();