const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname),
      publicPath: '/',
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    port: 8081
  }
});
