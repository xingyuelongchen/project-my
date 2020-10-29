const config = require('../config');
const fs = require('fs');
const path = require('path');

/**
 * 返回方法对象，包含所有公共接口
 */
module.exports = api();
function api() {
    let root = config.root + '/bin/functions'
    let arr = {}
    // 查询接口目录文件
    fs.readdirSync(root).forEach(e => {
        if (e !== 'index.js') {
            let files = path.resolve(root, e);
            if (fs.statSync(files).isFile()) {
                arr[e.match(/\w+(?=\.)/img)[0]] = require(files)
            }
        }
    });
    return arr;
}




