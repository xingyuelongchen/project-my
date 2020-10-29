
module.exports = {
    location: {
        routeMode: "history",                   // 路由模式 (history | hash ) 
        routePath: '/',                         // 项目编译地址
        port: 80,                               // 本地启动端口 
        https: false,                           // 是否开启HTTPS
        publicPath: '/'
    },
    axios: {                                    // axios 请求配置
        timeout: 60 * 10,                       // 默认6分钟超时, 单位（秒）
        baseUrl: 'http://admin.guangyizhou.cn:8083',
        baseUrlDev: 'http://192.168.32.194'
    },
    store: {                                    // 本地储存配置 （localstorage,sessionstorage,cookie）
        storeKey: 'my',                         // 本地缓存前缀信息
        namespaced: false,                      // 是否开启命名空间， vuex 配置
        maxage: 1 * 24 * 60 * 60,               // 缓存有效期, 单位（秒）
        doamin: '.guangyizhou.cn',               // 设置有效域名
    }
}

