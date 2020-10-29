import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from './api';
import template from './components';
import Elementui from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(api);
Vue.use(template);
Vue.use(Elementui);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
