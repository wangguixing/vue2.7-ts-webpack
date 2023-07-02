/*
 * @Author: MingWei.Wu <wu_mingwei@yeah.net>
 * @Copyright: 2021-present, ZhongCheng, Inc. All rights reserved.
 * @Date: 2021-11-29 09:22:38
 * @LastEditTime: 2023-07-02 16:44:49
 * @LastEditors: wangguixing
 */

import Vue from 'vue'

import type { CreateElement } from 'vue'

import Cookies from 'js-cookie'
import VueClipboard from 'vue-clipboard2'
import Element from 'element-ui'
import VueMeta from 'vue-meta'
import axios from 'axios'
import zcUI from 'zc-framework-ui/lib/index/index'
import App from '@/App.vue'

import 'element-ui/lib/theme-chalk/icon.css'

import 'animate.css'

import iconFileList from './svgFileName'
import store from '@/store'
import router from '@/router'
import '@/router/permission'

import Plugins from '@/plugins'
import Directive from '@/directive'
import Components from '@/components'
import svgPlugin from './assets/icons'
import '@/assets/styles/index.scss'

// //标准框架
// ZCUI npm 方式引入
import 'zc-framework-ui/lib/index/style.css'

// //本地联调
// // 吴明伟
// import zcUI from '../../标准框架与组件库/zc-standar-fontend/zc-framework-ui/packages/index';
// import '../../标准框架与组件库/zc-standar-fontend/zc-framework-ui/packages/index.scss';
// //王贵星;
// import zcUI from '../../../标准框架/zc-standar-fontend/zc-framework-ui/packages/index';
// import '../../../标准框架/zc-standar-fontend/zc-framework-ui/packages/index.scss';
// //本地联调lx
// import zcUI from '../../zc-standar-fontend/zc-framework-ui/packages/index';
// import '../../zc-standar-fontend/zc-framework-ui/packages/index.scss';
// 本地调试-流程组件库
// import zcWorkflow from '/packages';

import '@/utils/message'

Vue.use(VueClipboard)
Vue.use(VueMeta)
Vue.use(Plugins)
Vue.use(Directive)
Vue.use(Element, { size: Cookies.get('size') || 'small' })
Vue.use(Components)
Vue.use(zcUI)
// 实现svg按需加载与全量加载的控制
Vue.use(svgPlugin, { imports: iconFileList })

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.config.devtools = process.env.NODE_ENV === 'development'

new Vue({
  router,
  store,
  render: (h: CreateElement) => h(App),
}).$mount('#App')
