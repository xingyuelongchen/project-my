

module.exports = function (req, res, config) {
    try {
        ({ 'post': post, 'get': get, 'delete': del }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error)
        res.info('请求错误，')
    }
}


const userExp = {
    name: { required: true, type: /^([\d\w][\d\w@\.\-\_]{6,32}|admin)/, message: '用户名只能是电话号码、邮箱地址！' },
    password: { required: true, type: /^[\d\w\.\-]{6,32}/, message: '密码只能由数字、英文字母，长度6-32位的字符组成！' }
}


// 获取登录状态
async function get(req, res, config) {

    try {
        let { result, is } = await res.ApiDb.find('token', { find: { token: req.cookies.user_token } });
        if (is) {
            if (result[0].maxAge > Date.now() && result[0].domain == req.ip) res.success(result[0].token)
        } else {
            res.error(400)
        }

    } catch (error) {
        res.error(505)
    }
}
// 请求登陆
async function post(req, res, config) {
    try {
        let info = {
            name: req.body.name,
            password: req.body.password
        }
        let expinfo = res.ApiExp(info, userExp);
        if (expinfo.error) {
            res.info(expinfo.message)
            return
        }
        // 查询用表
        let { result } = await res.ApiDb.find('user', { find: { $or: [{ name: info.name }, { phone: info.name }, { email: info.name }] } });
        let userinfo = result.filter(e => (e.password == res.ApiMD5(info.password)));
        if (userinfo.length && userinfo[0]._id) {
            // 生成token
            let token = res.getToken(userinfo[0].uid_id);
            delete userinfo[0].password;
            let user = userinfo[0];
            // 存储登录状态到token表
            let data = {
                domain: req.ip,
                token,
                maxAge: Date.now() + config.maxAge,
                user,
            }
            // 追加用户信息到res；保存日志时使用
            res.userInfo = user;
            // 设置客户端token
            res.cookie('token', token, { maxAge: config.maxAge, httpOnly: true, path: '/' });
            let { result } = await res.ApiDb.update('token', { find: { token }, value: data });
            if (result.n) {
                res.success({ message: '登陆成功', content: user, log: { type: 'login', message: '账户登陆', } })
                return;
            }
            throw ('服务错误，登录失败!');
        } else {
            res.info('用户名或密码错误！')
        }
    } catch (error) {
        res.info(error)
    }
}
// 退出登录
async function del(req, res, config) {
    try {
        if (!req.cookies.user_token) {
            res.info('user_token参数错误');
            return;
        }
        await res.ApiDb.remove('token', { find: { token: req.cookies.user_token } })
        res.clearCookie("token");
        res.success('退出成功')
    } catch (error) {
        res.error(500)
    }
}