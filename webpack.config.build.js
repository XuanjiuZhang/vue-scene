/**
 * Created by xuanjiu on 17/2/20.
 */
const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ],
    extensions: ['.js', '.jsx', '.css', '.less', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  context: __dirname + "/src",
  entry: {
    app: ['whatwg-fetch', './applib.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    // filename: '[name].js',
    filename: 'previewLib.min.js',
    publicPath: '/build/',
    chunkFilename: '[name].min.js?[hash:8]'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'autoprefixer-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "appvender",
    //   filename: "appvender.js",
    //   minChunks: 2,
    // }),
    // 压缩js文件
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     warnings: false // 禁止生成warning
    //   }
    // })
  ]
};
