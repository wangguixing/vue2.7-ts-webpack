/*
 * @Author: wangguixing
 * @Date: 2023-05-25 21:00:23
 * @LastEditors: wangguixing
 * @LastEditTime: 2023-07-02 16:52:53
 * @FilePath: \build\webpack.common.js
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const nodePolyfill = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { getExternals, getCdnConfig, resolve } = require('./utils')

const isProduction = process.env.ENV !== 'development'

module.exports = {
  entry: {
    index: './src/main.js',
  },
  output: {
    uniqueName: 'zcLowCodeUI',
    filename: 'static/js/[name].[fullhash:8].js',
    path: resolve('dist'),
    publicPath: isProduction ? '/lowcodeui/' : '/',
  },
  // cache: {
  //   type: 'memory',
  //   cacheUnaffected: true,
  // },
  externals: getExternals(),
  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve('src'),
        use: [
          {
            loader: 'thread-loader',
            options: { workers: 3 },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true, // 自动babel缓存
            },
          },
        ],
      },
      {
        test: /bootstrap\.ts$/,
        loader: 'bundle-loader',
        options: {
          lazy: true,
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 多线程
            options: { workers: 3 },
          },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsxSuffixTo: ['\\.vue$'], // tsx
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(png|gif|webp|jpe?g)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: 'static/img/[name].[ext]',
        },
        type: 'javascript/auto',
      },
      {
        test: /\.svg$/,
        include: resolve('src/assets/icons'),
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]',
            },
          },
        ],
        generator: {
          filename: 'static/icons/[name].[ext]',
        },
        type: 'javascript/auto',
      },
      {
        test: /\.(ttf|woff2?|eot)$/,
        type: 'asset/resource', // 指定静态资源类复制
        generator: {
          filename: 'static/fontAssets/[name][ext]', // 放入font目录下
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new nodePolyfill(),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      inject: 'body',
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空符与换符
        minifyCSS: true, // 压缩内联css
      },
      cdnConfig: getCdnConfig(),
      output: {
        path: resolve('dist'),
      },
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('public'),
          to: resolve('dist'),
          globOptions: {
            dot: true,
            gitignore: false,
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
  ],
  resolve: {
    symlinks: false,
    extensions: ['.vue', '.js', '.json', '.ts', '.tsx'],
    alias: {
      vue$: 'vue/dist/vue.common.js',
      '@': resolve('src'),
      static: resolve('static'),
    },
  },
}
