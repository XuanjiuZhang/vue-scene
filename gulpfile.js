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


gulp.task('dev', function() {
  config.entry.app.unshift('webpack-dev-server/client?http://192.168.1.100:8080/', 'webpack/hot/only-dev-server');

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
  server.listen(8080);
});

gulp.task('build', function() {
  webpack(buildConfig, function(err, stats) { console.log(err) });
});


// gulp.task('clean', function(){
//   del([
//       './build/**/*', 
//     ]);
//   console.log('clean build folder.');
// });

// gulp.task('copyImage', ['clean'], function(){
//   return gulp.src(['./src/images/**/*'])
//     .pipe(gulp.dest('./build/images/'));
// });