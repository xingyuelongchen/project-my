
const fs = require('fs');

//路径类型查询，判断路径是文件，或者是目录
function delDir(path = '') {
    fs.stat(path, function (err, status) {
        // 当前路径如果是文件则直接删除
        if (status && status.isFile()) {
            unlink(path)
        }
        //当前路径如果是目录就往下级查找
        if (status && status.isDirectory()) {
            querydir(path);
        };
    })
}

//查找目录
function querydir(path) {
    fs.readdir(path, function (err, list) {
        //判断当前路径下是否有内容，有则交给路径类型查询处理
        if (list && list.length > 0) {
            list.forEach(e => {
                // 提交给路经查询处理
                delDir(path + '/' + e)
            });
        }
        //不管当前路径下是否有内容，都提交给删除目录函数
        rmdir(path)
    })
}
//删除目录
function rmdir(path) {
    //删除当前路径目录
    fs.rmdir(path, function (err) {
        if (!err) {
            // console.log("删除目录：", path);
        } else {
            //删除失败则重新提交给路径类型查询处理，
            delDir(path)
        }
    });
}

//删除文件
function unlink(path) {
    fs.unlink(path, function (err) {
        if (!err) {
            // console.log("删除文件：", path);
        }
    });
}
module.exports = delDir