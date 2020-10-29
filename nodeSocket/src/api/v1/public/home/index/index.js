/**
* 网站首页接口
*/
module.exports = function (req, res, config) {
try {
({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
} catch (error) {
res.error(500)
}
}
function get(req, res, config) {
res.send('网站首页接口 - get')
}
function post(req, res, config) {
res.send('网站首页接口 - post')
}
function del(req, res, config) {
res.send('网站首页接口 - del')
}
function put(req, res, config) {
res.send('网站首页接口 - put')
}