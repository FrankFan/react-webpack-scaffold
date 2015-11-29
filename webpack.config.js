// 'use strict';

// var path = require('path');
// var args = require('minimist')(process.argv.slice(2));

// // List of allowed environments
// var allowedEnvs = ['dev', 'dist', 'test'];

// // Set the correct environment
// var env;
// if(args._.length > 0 && args._.indexOf('start') !== -1) {
//   env = 'test';
// } else if (args.env) {
//   env = args.env;
// } else {
//   env = 'dev';
// }
// process.env.REACT_WEBPACK_ENV = env;

// // Get available configurations
// var configs = {
//   base: require(path.join(__dirname, 'cfg/base')),
//   dev:  require(path.join(__dirname, 'cfg/dev')),
//   dist: require(path.join(__dirname, 'cfg/dist')),
//   test: require(path.join(__dirname, 'cfg/test'))
// };

// /**
//  * Get an allowed environment
//  * @param  {String}  env
//  * @return {String}
//  */
// function getValidEnv(env) {
//   var isValid = env && env.length > 0 && allowedEnvs.indexOf(env) !== -1;
//   return isValid ? env : 'dev';
// }

// /**
//  * Build the webpack configuration
//  * @param  {String} env Environment to use
//  * @return {Object} Webpack config
//  */
// function buildConfig(env) {
//   var usedEnv = getValidEnv(env);
//   return configs[usedEnv];
// }

// module.exports = buildConfig(env);




var webpack = require('webpack');
var path = require('path');

var port = 8000;
var srcPath = path.join(__dirname, './src');
var publicPath = '/assets/';

var BowerWebpackPlugin = require('bower-webpack-plugin');

var config = {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:8000',
    'webpack/hot/only-dev-server',
    './src/components/run'
  ],
  cache: true,
  devtool: 'eval',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],

  port: port,
  debug: true,
  output: {
    path: path.join(__dirname, './dist/assets'),
    filename: 'app.js',
    publicPath: publicPath
  },
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: port,
    publicPath: publicPath,
    noInfo: false
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
    }
  },
  module: {
    preLoaders: [
      // {
      //   test: /\.(js|jsx)$/,
      //   include: path.join(__dirname, 'src'),
      //   loader: 'eslint-loader'
      // },
      {
        test: /\.(js|jsx)$/,
        loader: 'react-hot!babel-loader',
        include: path.join(__dirname, 'src')
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'react-hot!babel-loader',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};

console.log(config);


module.exports = config;