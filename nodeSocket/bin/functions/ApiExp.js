
module.exports = exp;

/**
 * 批量验证数据类型
 * 
 * @param {Object} a 元数据
 * @param {Object} b 规则数据
 */
function exp(a, b) {
    // 初始化用到的变量
    let data = {}, type = {}, err = {}, rule = '', ErrorInfo = 'null';
    if (typeof a !== 'object' || typeof b !== 'object') {
        // 只传入被验证的值和规则
        data[a] = a;
        type[a] = { type: b }
    } else {
        // 传入多个验证对象时
        data = a;
        type = b
    }
    // 遍历规则列表
    for (let k in type) { 
        // 判断当前规则是否为多重验证。
        if (type[k] && (typeof type[k] == 'object')) {

            // 嵌套验证对象
            if ((!type[k].type) && (!type[k].required) && (!type[k].default) && (!type[k].message)) {
                for (let v in type[k]) {
                    // 嵌套属性值为对象，则继续执行
                    if (typeof type[k][v] === 'object') {
                        let isFn = exp(data[k], type[k]);
                        if (isFn.error) {
                            err[k] = isFn.message
                        }
                    } else {
                        // 嵌套不是对象，则返回错误信息
                        err[k] = `"${v}" validation rules in "${k}" are not expected`
                    }
                }

            }
            // 写入默认值
            if (type[k].default) {
                if ((typeof type[k].default == 'object' && typeof type[k].default != 'function')) {
                    err[k] = 'Set ' + k + ' default value. Use function return values for reference types, such as：()=>[]'
                } else if (!data[k]) {
                    data[k] = type[k].default;
                }

            }
            // 验证必填
            if (type[k].required && (data[k] == null || data[k] == undefined)) {
                err[k] = type[k].message || k + ' is not null'
                continue;
            }
            // 验证非必填字段是否填写
            if (!type[k].required && !data[k]) {
                continue;
            }

            // 不检测类型
            if (!type[k].type) {
                continue
            }

        } else {
            // 忽略为空验证
            if (!type[k] || !data[k]) {
                continue;
            }
        }
        // 转换验证规则
        type[k].type ? rule = type[k].type : rule = type[k];
        typeof rule == 'string' ? rule = rule.toLowerCase() : rule;
        // 错误类型信息
        ErrorInfo = (data[k] ? typeof data[k] : data[k]);


        // 自定义正则验证
        if (rule.constructor == RegExp && !rule.test(data[k])) {
            err[k] = type[k].message || '自定义规则验证失败'
            continue;
        }
        if ((rule == Function || rule == 'function') && (typeof data[k] !== 'function')) {
            err[k] = type[k].message || 'Expect to get the "Function" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        if ((rule == Object || rule == 'object') && (typeof data[k] !== 'object')) {
            err[k] = type[k].message || 'Expect to get the "Object" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        if ((rule == Array || rule == 'array') && (typeof data[k] !== 'array')) {
            err[k] = type[k].message || 'Expect to get the "Array" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        if ((rule == String || rule == 'string') && (typeof data[k] !== 'string')) {
            err[k] = type[k].message || 'Expect to get the "String" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }

        if ((rule == Number || rule == 'number') && (typeof data[k] !== 'number')) {
            err[k] = type[k].message || 'Expect to get the "Number" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        if ((rule == Boolean || rule == 'boolean') && (typeof data[k] !== 'boolean')) {
            err[k] = type[k].message || 'Expect to get the "Boolean" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        if ((rule == Date || rule == 'date') && (!data[k] || new Date(data[k]) == 'Invalid Date')) {
            err[k] = type[k].message || 'Expect to get the "Date" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        // 验证邮箱
        if (rule == 'email' && (!(/^[\w\d\.\-]+@[\w\d]+(\.[\w\d\-]+)*(\.[a-zA-Z]{2,6}$)/.test(data[k])))) {
            err[k] = type[k].message || 'Expect to get the "Email" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        // 验证中国手机号码
        if (rule == 'phone' && (!(/^1(3[\d]|4[57]|5[\d]|6[6]|7[1235678]|8[\d]|9[189])[\d]{9}$/.test(data[k])))) {
            err[k] = type[k].message || 'Expect to get the "Phone Number" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        // 验证中国电话号码
        if (rule == 'tel' && (!(/^(0[\d]{2,3}\-)?[\d]{6,8}(\-\d{1,6}){0,1}$/.test(data[k])))) {
            err[k] = type[k].message || 'Expect to get the "Tel Number" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
        // 验证中国身份证号码
        if (rule == 'uid' && (!(/^([1-9][\d]{14}|[1-9]\d{16}[\dXx])$/.test(data[k])))) {
            err[k] = type[k].message || 'Expect to get the "Uid Card Number" type, but actually get the "' + ErrorInfo + '"'
            continue;
        }
    };
    return { data, error: JSON.stringify(err) == '{}' ? false : true, message: err }
}

// // 使用方法
// var objA = {
//     a: 123,
//     b: 'bbb',
//     c: Date.now(),
//     e() { },
//     f: true,
//     d: null,
//     g: {
//         name: 'name',
//         age: 18
//     }


// }
// // required：是否必填
// // type:数据验证类型
// // message:自定义返回错误提示信息

// var objB = {
//     a: Number,
//     b: String,
//     c: Date,
//     e: Function,
//     f: Boolean,
//     d: { type: 'string', message: '验证失败' },
//     g: {
//         name: {
//             type: String,
//             required: true,
//             default: 'a'
//         },
//         age: {
//             type: /(^1[89]$|^[2-9][\d]$|^1[\d][\d]$)/,
//             required: true,
//             default: 18
//         }
//     }
// }

// // 第一个参数为要被验证的数据对象
// // 第二个参数为验证数据的规则
// exp(objA, objB)