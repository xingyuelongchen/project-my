const router = require('express').Router();
const config = require('../config');
const fs = require('fs');
const md5 = require('md5');
const api = require('../functions');

// 请求头操作
router.use((req, res, next) => {
    // console.log(req.headers.origin);

    // 跨域设置
    res.header({
        "Access-Control-Allow-Origin": req.headers.origin, // 允许跨域请求的地址
        "Access-Control-Allow-Method": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept,token",
        "Access-Control-Max-Age": '10000'
    });
    // 预检请求返回
    if (req.method.toLowerCase() == 'options') {
        res.sendStatus(200);
        return;
    }
    for (let k in api) {
        res[k] = api[k];
    }
    // 注入api接口
    // res = Object.assign(api)
    res.ApiMD5 = md5;
    // 设置操作日志
    res.setlog = async function (data) {
        return this.ApiLog.setlog.bind(this)(req, data)
    }
    res.error = function (code) {
        let text = config.error[code]
        this.status(code).send({ code, message: text })
    }
    res.info = function (data = {}) {
        if (data.log) {
            this.setlog(data.log).then(e => {
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(400).send({ code: 400, message: data })
            }).catch(e => {
                console.log(err);
                console.log('Error: ', __dirname);
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(400).send({ code: 400, message: data, log: '日志记录写入失败' })
            });
        } else {
            this.status(400).send({ code: 400, message: data })
        }
    }
    res.success = function (data = {}) {
        if (!!data.log) {
            this.setlog(data.log).then(e => {
                typeof data == 'object' ? data = { ...data } : '';
                delete data.log;
                this.status(200).send({ code: 200, message: 'ok', data })
            }).catch(err => {
                console.log(err);
                console.error('Error: ', __dirname);
                delete data.log;
                typeof data == 'object' ? data = { ...data } : '';
                this.status(200).send({ code: 200, message: '请求处理完成，日志记录写入失败', data })
            })
        } else {
            typeof data == 'object' ? data = { ...data } : '';
            this.status(200).send({ code: 200, message: 'ok', data })
        }
    }
    res.getToken = function (userinfo) {
        return md5(req.headers.host + userinfo);
    }
    next();
})

// 验证请求Token
router.use(token);
// 挂载 模块 路由
router.all('/*', (req, res, next) => {
    // 解析携带的cookie;
    let cookie = req.headers.cookie || req.cookies || '';
    let cookies = {};
    if (cookie) {
        cookie.split('; ').forEach(e => {
            cookies[e.split('=')[0]] = e.split('=')[1];
        })
    }
    req.cookies = cookies;
    req.body = req.fields;
    if (fs.existsSync(config.rootSrc + req._parsedUrl.pathname) && fs.existsSync(config.rootSrc + req._parsedUrl.pathname + '/index.js')) {
        let path = (config.rootSrc + req._parsedUrl.pathname).replace(/\\/, "\\");
        require(path)(req, res, config)
    } else {
        next()
    }
});

// 路由不存在
router.use('*', (req, res) => {
    res.error(503)
})

module.exports = router;
async function token(req, res, next) {
    // 验证公共请求token 
    if (req.headers.token !== 'token') {
        res.error(501);
        return;
    }
    // 验证私密请求token
    if (!/(\/user|\/manage)/.test(req.url)) { next(); return }
    try {
        // 获取cookie 
        let token = req.headers.cookie || '';
        let cookies = {};
        if (!token) throw ('无访问权限！');
        token.split('; ').forEach(e => {
            cookies[e.split('=')[0]] = e.split('=')[1];
        })
        let { result = [] } = await res.ApiDb.find('token', { find: { token: cookies.token } });
        if (result.length) {
            let token = result[0];
            if (token.maxAge > Date.now() && token.maxAge < res.ApiMaxAge(4)) {
                res.ApiDb.update('token', { find: { token: cookies.user_token }, value: { maxAge: res.ApiMaxAge() } });
            }
            res.userInfo = result.user;
            next();
            return;
        }
        throw ('用户登录信息失效，请重新登陆！')
    } catch (error) {
        res.info(' 验证失败：' + error)
    }


}