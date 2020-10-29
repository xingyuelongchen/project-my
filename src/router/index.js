import Vue from "vue";
import VueRouter from "vue-router";
import backend from './backend';
import { getCookie } from '../api/Storage';
import { getAxiosRequest } from '../api/Axios';
Vue.use(VueRouter);
const routes = [
  { path: '/', component: () => import('@/views/backend'), children: backend, meta: { isTab: true, isAuth: false, title: '首页', icon: '' } },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    ...routes,
    {
      path: '/user', component: () => import('@/views/user'), children: [
        { path: '(login)?', component: () => import('@/views/user/login') },
      ]
    },
    { path: '/common', component: () => import('@/views') },
    { path: '*', component: () => import('@/views/error/404.vue') }]
});
router.beforeEach((to, from, next) => { 
  console.log(getAxiosRequest);
  let userinfo = getCookie('userInfo');
  if (to.matched.some(e => e.meta.isAuth) && !userinfo) {
    next('/user')
    return;
  }
  // 无权限就停止跳转
  // if (!userinfo.roles.includes(to.meta.role)) {
  //   next(false)
  //   return
  // }
  // 添加当前路由到tab选项卡
  // if (to.meta.isTab) this.setTab(to)
  next()
});
export default router;
function setTab(route) {
  // 添加选项卡
  console.log(route);
}

function setRouter() {
  // 根据权限动态加载路由
  let userinfo = getCookie('userInfo');
  if (!userinfo) router.replace('/user');
  let routes = matchRouter()
  router.addRoutes()
}
function matchRouter(routes, roles) {
  let arr = [];
  routes.forEach(route => {
    if (route.children instanceof Array && roles.includes(route.meta.role)) {
      arr.push({
        ...route,
        component: () => import('@/views'),
        children: matchRouter(route.children, roles)
      })
    } else if (role.includes(route.meta.role)) {
      route = { ...route }
      arr.push(route)
    }
  });
  return arr
}
