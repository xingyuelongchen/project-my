/* eslint-disable */
import { validatenull } from './Validate'
import config from './Config'

const keyName = config.store.storeKey + '-'
/**
 * 
 * @param {String or Object} name 可以是所有参数的对象集合 {name:...,content:...,type:...}
 * @param {any} content 存储的数据
 * @param {Boolean} type 布尔值，true表示存储到 sessionStorage，反之存储到 localStoreage
 */
export function setStore(params) {
    // let name, content, type;
    if (params.constructor === Object) var { name = null, content = null, type = false } = params;
    else var [name, content, type = null] = [...arguments]
    name = keyName + name
    let obj = {
        dataType: typeof (content),
        content: content,
        type: type,
        datetime: new Date().getTime()
    }
    if (type) window.sessionStorage.setItem(name, JSON.stringify(obj))
    else window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */

export function getStore(params) {

    if (params.constructor === Object) var { name = null, debug = null, type = false } = params;
    else var [name, debug = null] = [...arguments]
    name = keyName + name;
    let obj = {}, content = null;
    obj = window.sessionStorage.getItem(name)
    if (validatenull(obj)) obj = window.localStorage.getItem(name)
    if (validatenull(obj)) return
    try {
        obj = JSON.parse(obj)
    } catch (obj) {
        return obj
    }
    if (debug) {
        return obj
    }
    if (obj.dataType == 'string') {
        content = obj.content
    } else if (obj.dataType == 'number') {
        content = Number(obj.content)
    } else if (obj.dataType == 'boolean') {
        content = eval(obj.content)
    } else if (obj.dataType == 'object') {
        content = obj.content
    }

    return content
}
/**
 * 删除localStorage
 */
export function removeStore(params) {

    if (params.constructor === Object) var { name = null, type = null } = params;
    else var [name, type = null] = [...arguments];
    name = keyName + name;
    if (type == null) {
        window.sessionStorage.removeItem(name)
        window.localStorage.removeItem(name)
    } else if (type) {
        window.sessionStorage.removeItem(name)
    } else {
        window.localStorage.removeItem(name)
    }
}

/**
 * 获取全部localStorage
 */
export function getAllStore(params = {}) {
    let list = []
    let {
        type
    } = params
    if (type) {
        for (let i = 0; i <= window.sessionStorage.length; i++) {
            list.push({
                name: window.sessionStorage.key(i),
                content: getStore({
                    name: window.sessionStorage.key(i),
                    type: 'session'
                })
            })
        }
    } else {
        for (let i = 0; i <= window.localStorage.length; i++) {
            list.push({
                name: window.localStorage.key(i),
                content: getStore({
                    name: window.localStorage.key(i),
                })
            })

        }
    }
    return list

}

/**
 * 清空全部localStorage
 */
export function clearStore(params = {}) {
    let { type } = params
    if (type) {
        window.sessionStorage.clear()
    } else {
        window.localStorage.clear()
    }

}

/**
 * 设置cookie
 * @param {Object} params 包含name和data
 */
export function setCookie(params = {}) {
    try {
        if (params.constructor === Object) var { name = null, data = null } = params;
        else var [name, data = null] = [...arguments];
        name = keyName + name;
        data = JSON.stringify({ content: data })
        document.cookie = `${name}=${escape(data)}; Max-Age=${config.store.maxage}; domain=${config.store.doamin};path=/`
        return true
    } catch (error) {
        return false
    }
}
/**
 * 获取cookie
 */
export function getCookie(name) {
    name = keyName + name;
    let cookie = document.cookie;
    let cookies = {};
    cookie.split('; ').map(e => e.split('=')).forEach(e => {
        cookies[e[0]] = e[1]
    })
    cookie = cookies[name] ? unescape(cookies[name]) : false;
    if (cookie) { 
        return JSON.parse(cookie).content
    } else {
        return false
    }
}
/**
 * 删除cookie
 */
export function removeCookie(name) {
    name = keyName + name; 
    document.cookie = `${name}=0; Max-Age=0; domain=${config.store.doamin};path=/`
}
export default { removeStore, getAllStore, getStore, clearStore, setStore, setCookie, getCookie, removeCookie }