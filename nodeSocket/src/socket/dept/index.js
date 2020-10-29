module.exports = function (req, res, config) {
    try {
        ({ 'post': post, }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}

function post(req, res, config) {
    if (!req.body) { res.error(401); return }
    let id = req.body.department;
    let data = req.body.data;
    if (id && data) {
        Object.keys(req.socketUser).forEach(e => {
            if (req.socketUser[e].department == id) {
                req.socketUser[e].socketEvent.emit('message', data);
            }
        })
        res.success('ok')
    } else {
        res.info('发送失败，请检查内容是否正确')
    }
}
