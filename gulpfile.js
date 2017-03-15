/**
 * Created by xuanjiu on 17/1/19.
 */
var gulp = require('gulp');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var config = require("./webpack.config.js");
var buildConfig = require("./webpack.config.build");
var path = require('path');
del = require('del');


gulp.task('dev', ['cleanImage', 'copyImage'], function() {
  config.entry.app.unshift('webpack-dev-server/client?http://10.41.3.223:8085/', 'webpack/hot/only-dev-server');

  var compiler = webpack(config);
  var server = new webpackDevServer(compiler, {
    hot: true,
    // enable HMR on the server

    contentBase: path.resolve(__dirname, './'),
    // match the output path

    publicPath: '/build/',
    // match the output `publicPath`

    stats: { colors: true }
  });
  server.listen(8085);
});

gulp.task('build', ['cleanImage', 'copyImage'], function() {
  webpack(buildConfig, function(err, stats) { console.log(err) });
});


gulp.task('cleanImage', function(){
  del([
      './build/img/*', 
    ]);
  console.log('clean /build/img folder.');
});

// 缩小PNG，JPEG，GIF和SVG图像
gulp.task('copyImage', function(){
  return gulp.src([
    './src/img/*',
  ])
    .pipe(gulp.dest('./build/img/'));
});
// gulp.task('copyImage', ['clean'], function(){
//   return gulp.src(['./src/images/**/*'])
//     .pipe(gulp.dest('./build/images/'));
// });
