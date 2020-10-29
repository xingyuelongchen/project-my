// const db = require('./ApiDb.js/index.js');

// 写入日志
module.exports = { setlog, getlog }

async function setlog(req, data) {
    try {
        data = {
            user_id: this.userInfo._id,
            name: this.userInfo.name,
            message: data.message,
            type: data.type,
            ip: req.connection.remoteAddress,
            content: { ...data, ...this.userInfo },
            createTime: Date.now(),
        }
        let { result } = await this.ApiDb.insert('log', data);
        return { result }
    } catch (error) {
        return error
    }
}
function getlog() {

}