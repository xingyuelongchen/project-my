module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}
function get(req, res, config) {
    res.send('index - get')
}
function post(req, res, config) {
    res.send('index - post')
}
function del(req, res, config) {
    res.send('index - del')

}
function put(req, res, config) {
    res.send('index - put')
}