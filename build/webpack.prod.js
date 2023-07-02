const { merge } = require('webpack-merge')
const { readEnv } = require('./utils')
const config = readEnv('./.env.production')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const WebpackBar = require('webpackbar')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { DefinePlugin } = require('webpack')
const webpackCommonConfig = require('./webpack.common.js')
const { resolve } = require('./utils')

//读取环境变量
module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'thread-loader',
            options: { workers: 2 },
          },
          'vue-loader',
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      BASE_URL: JSON.stringify('/'),
      'process.env': config,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash:8].css',
      ignoreOrder: true,
    }),
    // 进度条
    new WebpackBar({
      reporters: ['fancy', 'profile'],
      profile: true,
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  optimization: {
    moduleIds: 'natural',
    nodeEnv: 'production',
    runtimeChunk: false,
    minimize: true,
    mergeDuplicateChunks: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
      // swcMinify后微服务调用异常，恢复旧的TerserPlugin
      new TerserPlugin({
        parallel: true,
        minify: TerserPlugin.esbuildMinify,
        terserOptions: {
          minify: true,
          minifyWhitespace: true,
          minifyIdentifiers: true,
          minifySyntax: true,
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
})
