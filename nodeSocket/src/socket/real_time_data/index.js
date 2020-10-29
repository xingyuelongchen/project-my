module.exports = function (req, res, config) {
    try {
        ({ 'post': post, }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error);
        res.error(500)
    }
}

function post(req, res, config) {
    if (!req.body) { res.error(401); return }
    let data = req.body.data;
    if (data) {
        Object.keys(req.socketUser).forEach(e => {
            req.socketUser[e].socketEvent.emit('real_time_data', data);
        })
        res.success('ok')
    } else {
        res.info('发送失败，请检查内容是否正确')
    }
}
