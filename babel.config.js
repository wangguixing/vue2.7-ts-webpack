/*
 * @Author: wangguixing
 * @Date: 2023-07-02 16:56:25
 * @LastEditors: wangguixing
 * @LastEditTime: 2023-07-02 17:00:21
 * @FilePath: \babel.config.js
 */

module.exports = {
  presets: [
    [
      '@vue/babel-preset-jsx', // 和@vue/babel-helper-vue-jsx-merge-props支持vue的jsx
      {
        compositionAPI: true,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [],
}
