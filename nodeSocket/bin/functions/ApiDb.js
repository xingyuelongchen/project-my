const DATABASE = require("../database");
const { table: TABLE } = require('../config').db;
const getUuid = require('./ApiUuid');
/**
 * 数据插入参数
 * @param {String} table 数据集合（表）名称
 * @param {Array|Object} data 需要存入数据库的数据，可以是一条，或者多条
 * @param {Function} callback 可以传入回调函数来获取存储结果，默认返回promise
 * @return {Promise} 默认返回promise数据
 */


async function insert(table, data = null, callback) {
    try {
        if (!table) throw ('请传入集合名称');
        if (!TABLE[table]) throw ('请定义集合名称');
        if (!data || typeof data != 'object') throw ('请传入需要写入的数据');
        let { DB } = await DATABASE();
        if (data.constructor === Array) {
            data = data.map(e => {
                e.id = getUuid();
                e.create_time = Date.now()
                return e
            })
            var { result } = await DB.collection(TABLE[table]).insertMany(data);
        }
        if (data.constructor === Object) {
            var { result } = await DB.collection(TABLE[table]).insertOne({ id: getUuid(), ...data, create_time: Date.now() });
        }
        if (callback instanceof Function) callback(null, { result, is: result.n });
        return { result, is: result.n };
    } catch (error) {
        if (callback instanceof Function) callback(error);
        return Promise.reject(error);
    }
}

/**
 * 数据库查询参数
 * @param {String} table 数据集合（表）名称
 * @param {Object} options {find:查询条件,limit:每页数量,page:当前分页,sort:排序条件}
 * @param {Function} callback 结果接受回调，不传入默认返回promise对象
 * @return {Promise} 默认返回promise对象
 */
async function find(table, options = {}, callback) {
    try {
        if (!table) throw ('请传入集合名称');
        let option = options.find || {};
        // 每页条数
        let limit = options.limit * 1 || 10;
        // 当前分页
        let page = options.page * 1 || 1;
        // 排序
        let sort = options.sort || {};
        // 下页起始位置
        let skip = (page - 1) * limit;
        let { DB } = await DATABASE();
        // 查询总数
        let count = await DB.collection(TABLE[table]).find(option).count();
        // 返回结果
        let result = await DB.collection(TABLE[table]).find(option).sort(sort).skip(skip).limit(limit).toArray();
        if (callback instanceof Function) callback(null, { result, count, page, limit, is: !!result.length });
        return { result, count, page, limit, is: !!result.length }
    } catch (error) {
        if (callback instanceof Function) callback(error);
        return Promise.reject(error);
    }
}

/**
 * 
 * @param {String} table 数据集合（表）名称
 * @param {Object} options {find:更新条件,value:更新的数据,all:更新所有条件匹配的数据}
 * @param {Function} callback 结果接受回调，不传入默认返回promise对象
 * @return {Promise} 默认返回promise对象
 */
async function update(table, options = {}, callback) {
    try {
        if (!table) throw ('请传入集合名称');
        if (!options.find) throw ('请传入更新条件：find');
        if (!options.value) throw ('请传入新数据：value');
        let find = options.find || {};
        let value = options.value || {};
        let all = options.all || false;
        let { DB } = await DATABASE();
        let { result } = await DB.collection(TABLE[table]).updateMany(find, { $set: value }, { upsert: true, multi: all });
        if (callback instanceof Function) callback(null, { result, is: result.n });
        return { result, is: result.n }
    } catch (error) {
        if (callback instanceof Function) callback(error);
        return Promise.reject(error);
    }
}


async function remove(table, options = {}, callback) {
    try {
        if (!table) throw ('请传入集合名称');
        if (!options.find) throw ('请传入删除条件：find');
        let find = options.find || {};
        let { DB } = await DATABASE();
        let { result } = await DB.collection(TABLE[table]).deleteMany(find, false);

        if (callback instanceof Function) callback(null, { result, is: result.n });
        return { result, is: result.n }
    } catch (error) {
        if (callback instanceof Function) callback(error);
        return Promise.reject(error);
    }
}

module.exports = { insert, find, update, remove }




/**
* 
 * @param {Object} option -包含
 *  {
 *  table - 表名 String
 *  find  - 更新条件 Object
 *  value - 新数据 Object
 * }
 * @param {Function} fn -回调函数
 */

function del(option, fn) {
    if (option && (option.constructor == Object) && fn && fn.constructor == Function) {
        const table = option.table || '';
        const find = option.find || {};
        database((db) => {
            db.collection(table).deleteMany(find, false, function (err, result) {
                fn(err, result.result)
            })
        })
    }
}

// module.exports = { insert, update, del, find, database }