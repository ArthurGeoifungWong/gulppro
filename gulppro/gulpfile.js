const gulp = require("gulp"); // 引进gulp主模块
const htmlmin= require("gulp-htmlmin"); // html压缩
// const cssmin = require("gulp-minify-css");
const cssmin = require("gulp-clean-css"); // css压缩
const babel = require("gulp-babel"); // 编译es6
const jsmin = require("gulp-uglify"); // js压缩
const less = require("gulp-less"); // less编译
const sass = require("gulp-sass"); // less编译
const rename = require("gulp-rename"); // 重命名
const watch = require("gulp-watch"); // 监听器
const pump = require("pump");
// 泵模块将这些问题规范化，并在回调中传递错误。
const connect = require("gulp-connect"); // 实时刷新
const imagemin = require("gulp-imagemin"); // 图片压缩

// 定义相关路径
const paths = {
    html: 'src/html/*.html',
    thtml: 'build',
    sass: 'src/sass/*.scss',
    tsass: 'src/css',
    css: 'src/css/*.css',
    tcss: 'build/css',
    js: 'src/js/*.js',
    tjs: 'build/js',
    // 新增图片压缩
    imgs: 'src/imgs/*.{png, jpg, gif, ico}',
    timgs: 'build/imgs'
}
// 压缩html
gulp.task('htmlmin', function () {
    let options = {
        removeComments:true, // 清除HTML注释
        collapseWhitespace:true, // 压缩HTML
        collapseBooleanAttributes:true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked/>
        removeEmptyAttributes:true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes:true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes:true, // 删除<style>和<link>的type="text/css"
        minifyJS:true, // 压缩页面JS
        minifyCSS:true // 压缩页面CSS
    }

    return gulp.src(paths.html)
               .pipe(htmlmin(options))
               .pipe(gulp.dest(paths.thtml))
               .pipe(connect.reload()) // 刷新
});

// 将sass编译成css
gulp.task('sass2css', function () {
    return gulp.src(paths.sass)
               .pipe(sass())
               .pipe(gulp.dest(paths.tsass))
});
// 压缩css
gulp.task('cssmin', ['sass2css'], function () {
    return gulp.src(paths.css)
               .pipe(cssmin())
               .pipe(rename({
                   suffix: '.min'
               }))
               .pipe(gulp.dest(paths.tcss))
               .pipe(connect.reload())
});

// 压缩js   任务名：jsmin
gulp.task('jsmin', function () {
    return gulp.src(paths.js)
               .pipe(babel({presets: ['es2015']})) // es6编译
               .pipe(jsmin())
               .pipe(rename({
                   suffix: '.min'
               }))
               .pipe(gulp.dest(paths.tjs))
               .pipe(connect.reload())
});
// pump的使用
// gulp.task('jsmin', function (cb) {
//     pump([
//         gulp.src(paths.js),
//         babel({presets: ['es2015']}),
//         jsmin(),
//         rename({suffix: '.min'}),
//         gulp.dest(paths.tjs)
//     ], cb)
// });

// 新增，压缩图片
gulp.task('imagemin', function () {
    let options = {
        optimizationLevel: 5, // 类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, // 类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, // 类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true // 类型：Boolean 默认：false 多次优化svg直到完全优化
    }
    return gulp.src(paths.imgs)
               .pipe(imagemin(options))
               .pipe(gulp.dest(paths.timgs))
               .pipe(connect.reload())
});

// gulp watch 单个启动watch任务
gulp.task('watch', function () {
    gulp.watch(paths.html, ['htmlmin'])
    gulp.watch(paths.sass,["cssmin"]);
    gulp.watch(paths.js,["jsmin"]);
});

// 定义刷新任务， 搭建本地服务器websocket
gulp.task('connect', function () {
    connect.server({
        root: 'build',
        port: 8000,
        livereload: true
    })
});

// gulp
gulp.task('default', ['htmlmin', 'cssmin', 'jsmin', 'imagemin', 'watch', 'connect'], function () {
    // gulp.watch
});