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
    // 'whatwg-fetch'
    app: ['./app.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build/',
    chunkFilename: '[name].min.js?[hash:8]'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: {
        //   loaders: {
        //     less: 'style-loader!css-loader!autoprefixer-loader!less-loader'
        //   }
        // }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'autoprefixer-loader', 'postcss-loader']
      },
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'autoprefixer-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      // {
      //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //   loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      // },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ],

    // loaders: [
    //   {test: /\.js$/, include: path.join(__dirname, 'src'), loader: 'babel-loader'},
    //   {test: /\.vue$/, loader: 'vue-loader'},
    //   {test: /\.css$/, loader: "style!css-loader?sourceMap!postcss-loader"},
    //   {test: /\.less/, loaders: ['style', 'css-loader', 'autoprefixer-loader', 'less-loader']},
    //   {test: /\.scss$/, loader: "style-loader!css-loader!sass-loader|postcss-loader"}],
  },
  devtool: '#eval-source-map',
  // watch: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
      minChunks: 2,
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
    new webpack.LoaderOptionsPlugin({
       debug: true
     })
  ]
};
