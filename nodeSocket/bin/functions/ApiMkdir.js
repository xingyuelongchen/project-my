const FS = require('fs');
const PATH = require('path');

/**
 * 
 * 根据给出的 path 路径，创建目录
 * @param {*} path 目录地址的绝对路径
 */
module.exports = function a(path) {
    if (!path) return false;
    let pathArr = PATH.normalize(path).split('\\');
    let a = '';
    pathArr.forEach(e => {
        a += e;
        if (!FS.existsSync(a)) {
            FS.mkdirSync(a)
        }
        a += '\\';
    })
    return true
}
