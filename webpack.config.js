/**
 * Created by xuanjiu on 17/2/20.
 */
const path = require('path');
const webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

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
    app: ['whatwg-fetch', './applib.js'],
    // vendor: ['whatwg-fetch', './lib/hammer.min.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/assets/fonts/',
    chunkFilename: '[name].min.js?[hash:8]'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
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
          name: '[name].[ext]'
        }
      }
    ],

  },
  devtool: '#eval-source-map',
  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: path.resolve( __dirname ,'./'),
    // match the output path

    publicPath: '/assets/fonts/'
    // match the output `publicPath`
  },
  // watch: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "vendor",
    //   filename: "vendor.js",
    //   // minChunks: 2,
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "commons",
    //   filename: "commons.js",
    //   minChunks: 2,
    // }),
    // new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    // new webpack.LoaderOptionsPlugin({
    //    debug: true
    //  })
    // 压缩js文件
    // new webpack.optimize.UglifyJsPlugin({
    //   mangle: true,
    //   compress: {
    //     warnings: false // 禁止生成warning
    //   }
    // }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
