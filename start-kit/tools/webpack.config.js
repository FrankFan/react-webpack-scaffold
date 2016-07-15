import path from 'path';
import webpack from 'webpack';
import yargs from 'yargs';
import {
  SRC_PATH,
}
from './base.config';
import lufs from './lib/lufs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import postcssImport from 'postcss-import';
import postcssMixins from 'postcss-mixins';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import cssnext from 'postcss-cssnext';
import WebpackStrip from 'strip-loader';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = true;

const entry = {};
// entry['public/libs/vendors'] = ['react', 'react-dom', 'react-router', 'fastclick'];
const bundleRoot = `modules${path.sep}`;
const SRC_BUZ_PATH = SRC_PATH + path.sep + bundleRoot;

function makeEntry() {
  const argv = yargs.usage('Usage: $0 <command> [options]')
    .example('npm start -- --module=Samples', 'LU HTML5 module build')
    .alias('m', 'module')
    .help('h')
    .epilog('copyleft LU Galaxy Team 2016')
    .argv;

  const SRC_BUZ_MODULE_KEY = `${bundleRoot}${argv.module}${path.sep}public/module`;
  const SRC_BUZ_MODULE_PATH = `${SRC_BUZ_PATH}${argv.module}${path.sep}app.js`;
  const srcFolderNames = lufs.readFolderNamesSync(SRC_BUZ_PATH);
  if (DEBUG) {
    console.log('---为Debug构造Entry---');
  } else {
    console.log('---为Release构造Entry---');
  }
  if (argv.module && srcFolderNames.includes(argv.module)) {
    if (DEBUG) {
      entry[SRC_BUZ_MODULE_KEY] = ['webpack/hot/dev-server', 'webpack-hot-middleware/client', SRC_BUZ_MODULE_PATH];
    } else {
      entry[SRC_BUZ_MODULE_KEY] = [SRC_BUZ_MODULE_PATH];
    }
    return true;
  }
  const EXCLUDE_FOLDER = DEBUG ? ['public'] : ['public', 'Samples'];
  for (const folderName of srcFolderNames) {
    if (EXCLUDE_FOLDER.includes(folderName)) {
      continue;
    }
    const ENTRY_KEY = `${bundleRoot}${folderName}${path.sep}public/module`;
    const ENTRY_VALUE = `${SRC_BUZ_PATH}${folderName}${path.sep}app.js`;
    if (DEBUG) {
      entry[ENTRY_KEY] = ['webpack/hot/dev-server', 'webpack-hot-middleware/client', ENTRY_VALUE];
    } else {
      entry[ENTRY_KEY] = [ENTRY_VALUE];
    }
  }
  return false;
}

makeEntry();

console.log(entry, '=====');

const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 7.1',
];

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG,
};

const PLUGINS = [
  // new webpack.optimize.CommonsChunkPlugin(
  //   'public/libs/vendors',
  //   'public/libs/vendors.js'
  // ),
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: "commons",
  //   filename: "commons.bundle.js",
  //   minChunks: 3,
  //   chunks: Object.keys(entry).filter(key => key !== "modules/ProductList/public/module")
  // }),
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: "public/libs/vendors",
  //   filename: "public/libs/vendors.js",
  //   chunks: entry
  // }),
  new webpack.optimize.CommonsChunkPlugin(
    `${bundleRoot}public/libs/common.js`
  ),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.DefinePlugin(GLOBALS),
  ...(DEBUG ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: VERBOSE,
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ]),
  ...(DEBUG ? [
    new webpack.HotModuleReplacementPlugin(),
  ] : []),
  // new ExtractTextPlugin('../../public/styles/bu.css'),
  new ExtractTextPlugin('[name].css'),
];

const loaders = DEBUG ? ['react-hot', 'babel-loader'] : ['react-hot', 'babel-loader', WebpackStrip.loader('console.log', 'console.error')];


const moduleConfig = {
  loaders: [{
    test: /\.jsx?$/,
    include: [
      path.resolve(__dirname, '../src'),
    ],
    loaders,
    exclude: '/node_modules/',
  }, {
    test: /\.json$/,
    loader: 'json-loader',
  }, {
    test: /\.txt$/,
    loader: 'raw-loader',
  }, {
    test: /\.(png|jpg|jpeg|gif)$/,
    include: [
      path.resolve(__dirname, '../src'),
      path.resolve(__dirname, '../../lubase/lib'),
    ],
    loader: 'url-relative-loader',
    query: {
      name: `${bundleRoot}public/images/lu.[hash].[ext]`,
      limit: 10000,
      relativePath: DEBUG ? '' : 'public/images/lu.[hash].[ext]',
    },
  }, {
    test: /\.(eot|ttf|wav|mp3|svg|woff|woff2)$/,
    loader: 'file-relative-loader',
    query: {
      name: 'public/fonts/lu.[hash].[ext]',
    },
  }, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
  }],
};

const stats = {
  colors: true,
  reasons: DEBUG,
  hash: VERBOSE,
  version: VERBOSE,
  timings: true,
  chunks: VERBOSE,
  chunkModules: VERBOSE,
  cached: VERBOSE,
  cachedAssets: VERBOSE,
};

const externals = [{
  react: 'React',
}, {
  'react-dom': 'ReactDOM',
}];

const config = {
  // context: DEBUG ? path.join(__`dirname, '../src/pages') : path.join(__dirname, '../build/hybrid'),
  entry,
  stats,
  plugins: PLUGINS,
  output: {
    // path: BUILD_PATH,
    path: DEBUG ? path.join(__dirname, '../src') : path.join(__dirname, '../build'),
    publicPath: DEBUG ? '/' : '../',
    sourcePrefix: '',
    filename: '[name].js',
    chunkFilename: '[id].js',
  },

  cache: DEBUG,
  debug: DEBUG,

  externals,

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx'],
  },

  module: moduleConfig,
  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,

  postcss: function plugins(bundler) {
    return [
      postcssImport({
        addDependencyTo: bundler,
      }),
      postcssMixins(),
      postcssNested(),
      autoprefixer({
        browsers: AUTOPREFIXER_BROWSERS,
      }),
      // require('autoprefixer')({ browsers: ['last 2 versions'] }),
      cssnext(),
    ];
  },
};

export default config;
