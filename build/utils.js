/*
 * @Author: wangguixing
 * @Date: 2023-05-25 21:00:23
 * @LastEditors: wangguixing
 * @LastEditTime: 2023-06-05 16:27:42
 * @FilePath: \build\utils.js
 */
const path = require('path');
let cdn = require('./dependencies.cdn');

module.exports = {
  resolve: function (dir) {
    return path.join(__dirname, '..', dir);
  },
  readEnv: file => {
    let { parsed } = require('dotenv').config({ path: file });
    Object.keys(parsed).forEach(key => (parsed[key] = JSON.stringify(parsed[key])));
    return parsed;
  },
  getExternals: () => {
    if (JSON.stringify(cdn.externals) !== '{}') {
      return cdn.externals;
    }
  },
  getCdnConfig: () => {
    let cdnConfig = {
      js: cdn.js,
      css: cdn.css,
      ttf: cdn.ttf,
    };
    return cdnConfig;
  },
};
