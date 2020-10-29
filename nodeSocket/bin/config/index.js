const path = require("path");
const config = {
    root: path.resolve(__dirname, '../../'),
    rootSrc: path.resolve(__dirname, '../../src'),
    maxAge: 1 * 24 * 60 * 60 * 1000,
    server: {
        domain: '0.0.0.0',
        port: 3003,
        image: ''
    },
    db: {
        domain: '127.0.0.1',
        port: '27017',
        username: '',
        password: '',
        dbName: 'test',
        table: {
            user: 'W_user',
            token: 'W_token',
            uid_id: 'W_uid_id',
            token: 'W_token',
            log: 'W_log',
            auth: 'W_auth',
            setting: 'W_setting',
        }
    },
    error: {
        400: `400 - 请求无效，未登录或未授权. Client error`,
        401: `401 - 数据有误，请检查请求的数据是否正确. Client error`,
        403: `403 - 无访问权限，请联系管理员获取相关权限后在尝试访问. Client error`,
        404: `404 - 资源未找到，请检查网址输入是否正确. Client error`,
        500: `500 - 服务器错误，处理程序未定义. Server Error`,
        501: `501 - 请求错误，Token 验证失败，非法请求. Server Error`,
        502: '502 - 服务器错误，日志记录写入失败. Server Error',
        503: `503 - 请求错误，没有找到对应的处理程序. Server Error`,
        505: `505 - 服务器错误，数据库处理出错，请联系管理员. Server Error`,
    }
}


module.exports = config;