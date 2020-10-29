const md5 = require('md5');
/**
 * 用户注册验证表
 */
const userInfo = {
    name: {
        required: true,
        type: /^[\w\d@\.\u4e00-\u9fa5]{3,32}$/,
        message: '账号只能是字母、数字、中文、手机号、邮箱'
    },
    password: {
        required: true,
        type: /^[\w\d]{6,32}$/,
        message: '密码不符合规则'
    },
    createTime: {
        required: true,
        type: Date,
        default: Date.now()
    },
    imgurl: null,
    phone: {
        required: false,
        type: 'phone',
        message: '请输入正确的手机号'
    },
    email: {
        type: 'email',
        message: '请输入正确的Email地址'
    },
    qq: Number,
    wechat: null,
    age: Number,
    city: null,
    country: null,
    address: null,
    uid: 'uid',
    sex: {
        type: /[123]/,
        message: '请输入合法性别',
        default: 0
    },
    role: null
}





// 更新用户信息
function put(req, res, config) {
    let db = {
        // 获取数据表名称
        table: config.db.table.user,
    }
    res.send('register - put')
}

// 用户注册
function post(req, res, config) {
    let { name, password } = req.body;
    let isError = res.ApiExp({ name, password }, userInfo);
    if (isError.error) {
        res.info(isError.message);
        return;
    }
    let user = isError.data;
    if (!res.ApiExp(name, 'email').error) {
        user.name = name;
        user.email = name;
    } else if (!res.ApiExp(name, 'phone').error) {
        user.name = name;
        user.phone = name;
    } else if (name === password) {
        res.info('密码不能与用户名相似或相同');
        return;
    }
    res.ApiDb.find('user', {
        find: { name },
    }, (err, data, count) => {
        if (data.length > 0) {
            res.info('该账号已存在，请重新输入')
        } else {
            // 验证密码
            if (res.ApiExp(password, /^[\w\d]{6,32}$/).error) {
                res.info('密码格式不正确，只能是6-32位字母和数字')
                return;
            }
            user.password = md5(password);
            user.uid_id = md5(new Date() + "" + user.name + '' + user.password);
            res.ApiDb.insert('user', user, (err, data) => {
                if (err) { res.error(500); return };
                res.success('注册成功')
            })
        }
    })

}



module.exports = function (req, res, config) {
    try {
        ({ 'put': put, 'post': post }[req.method.toLowerCase()])(req, res, config)
    } catch (error) {
        res.error(500)
    }
}