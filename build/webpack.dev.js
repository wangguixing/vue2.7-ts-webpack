/*
 * @Author: wangguixing
 * @Date: 2023-05-25 21:00:23
 * @LastEditors: wangguixing
 * @LastEditTime: 2023-07-02 15:46:06
 * @FilePath: \build\webpack.dev.js
 */
const { merge } = require('webpack-merge');
const { readEnv, resolve } = require('./utils');
const config = readEnv('./.env.development');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');
const webpackCommonConfig = require('./webpack.common.js');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const portfinder = require('portfinder'); //自动查找可用端口
//读取环境变量
const webpackDevConfig = merge(webpackCommonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve('src'),
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      BASE_URL: JSON.stringify('/'),
      'process.env': config,
    }),
    new ESLintPlugin({
      fix: true /* 自动帮助修复 */,
      lintDirtyModulesOnly: true,
      extensions: ['js', 'vue', 'ts', 'd.ts'],
      files: 'src',
    }),
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
    }),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
  devServer: {
    port: '8080',
    hot: true,
    open: true,
    host: '0.0.0.0',
    historyApiFallback: true, //history路由错误问题
    client: {
      progress: false,
      reconnect: 3,
      overlay: false,
      logging: 'error',
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
      // 线上线下图片类的proxy
      '/static': {
        target: process.env.VUE_APP_STATIC_API,
        changeOrigin: true,
        pathRewrite: { '^/static': '' },
      },
      '/file': {
        target: process.env.VUE_APP_FILE_ACCESS_PATH,
        changeOrigin: true,
        pathRewrite: { '^/file': '' },
      },
    },
  },
  stats: 'errors-only',
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = webpackDevConfig.devServer.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      process.env.PORT = port;
      webpackDevConfig.devServer.port = port;
      resolve(webpackDevConfig);
    }
  });
});
