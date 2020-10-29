module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}
async function get(req, res, config) {
    try {
        let result = await res.ApiDb.find('setting')
        res.success(result)
    } catch (error) { res.info(error) }
}
async function post(req, res, config) {
    try {
        let { result, is } = await res.ApiDb.insert('setting', { website: '网站名称', logo: '' });
        if (is) res.success('添加成功');
        else throw ('创建失败！')
    } catch (error) { res.info(error) }
}
async function del(req, res, config) {
    try {
        res.success('v2- - del')
    } catch (error) { res.info(error) }
}
async function put(req, res, config) {
    try {
        res.success('v2- - put')
    } catch (error) { res.info(error) }
}