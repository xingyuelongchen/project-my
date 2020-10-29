module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error)
        res.status(400).send(req.url + ' 请求错误')
    }
}
function get(req, res, config) {
    res.send('manage - get')
}
function post(req, res, config) {
    res.send('manage - post')
}
function del(req, res, config) {
    res.send('manage - del')

}
function put(req, res, config) {
    res.send('manage - put')
}