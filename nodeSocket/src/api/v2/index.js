module.exports = function (req, res, config) {
    try {
        ({ 'get': get, 'post': post, 'delete': del, 'put': put }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}
function get(req, res, config) {
    
    res.send('v2-index - get')
}
function post(req, res, config) {
    res.send('v2-index - post')
}
function del(req, res, config) {
    res.send('v2-index - del')

}
function put(req, res, config) {
    res.send('v2-index - put')
}