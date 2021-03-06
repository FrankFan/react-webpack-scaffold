import webpack from 'webpack';
import webpackConfig from './webpack.config';

function bundle() {
  return new Promise((resolve, reject) => {
    const bundler = webpack(webpackConfig);
    let bundlerRunCount = 0;

    function onComplete(err, stats) {
      if (err) {
        return reject(err);
      }

      if (++bundlerRunCount === (global.WATCH ? webpackConfig.length : 1)) {
        return resolve();
      }
      console.log(stats);
      return false;
    }

    if (global.WATCH) {
      bundler.watch(200, onComplete);
    } else {
      bundler.run(onComplete);
    }
  });
}

export default bundle;
