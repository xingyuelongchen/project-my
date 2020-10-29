const config = require('../../../../../bin/config');
// 验证规则
const rule = {
    url: { type: /^[\w\d]+(\.[\w]+)+/ },
    status: { type: Boolean, required: false }
}

module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error);
        res.error(500)
    }
}
async function get(req, res, config) {
    try {
        let result = await res.ApiDb.find('auth', req.query);
        if (!result.is) throw ('查询失败');
        res.success(result)
    } catch (error) {
        res.info(error)
    }
}
async function post(req, res, config) {
    try {
        let { url, status } = req.body;
        let { error, message } = res.ApiExp(req.body, rule);
        if (error) throw (message);
        var { is } = await res.ApiDb.find('auth', { find: { url } });
        if (is) throw ('数据已存在!');
        var { is } = await res.ApiDb.insert('auth', { url, status });
        if (is) res.success()

    } catch (error) {
        res.info(error)
    }
}
async function del(req, res, config) {
    try {
        let { id } = req.body;
        var { is } = await res.ApiDb.remove('auth', { find: { id } });
        if (!is) throw ('数据不存在!');
        res.success('删除完成')

    } catch (error) {
        res.info(error)
    }
}
async function put(req, res, config) {
    try {
        let { id } = req.body;
        let value = {};
        Object.keys(rule).forEach(e => {
            if (req.body[e]) value[e] = req.body[e];
        })
        let { error, message } = res.ApiExp(req.body, { ...rule, id: { required: true } });
        if (error) throw (message);
        let { is } = await res.ApiDb.update('auth', { find: { id }, value });
        if (!is) throw ('更新失败');
        res.success('更新完成')
    } catch (error) {
        res.info(error)
    }
}