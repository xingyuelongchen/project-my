module.exports = function (req, res, config) {
    try {
        ({ 'post': post, }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        console.log(error);
        res.error(500)
    }
}

function post(req, res) {
    if (!req.body) { res.send(401); return }
    let uid = req.body.uid;
    let data = req.body.data;
    if (uid && data) {
        Object.keys(req.socketUser).forEach(e => {
            if (req.socketUser[e].uid == uid) {
                req.socketUser[e].socketEvent.emit('message', data);
            }
        })
        res.success('ok')
    } else {
        res.info('发送失败，可能是用户不在线')
    }
}
