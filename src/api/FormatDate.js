/**
 * 时间格式化
 * @param {String} time 可以被 Date 对象解析的任何字符串，默认当前本地时间。
 * @param {String} format 默认时间格式 "YYYY-MM-DD hh:mm:ss"
 * @param {Boolean} utc  true 从0时区转为本地时间， false 从本地时间转为 0 时区，默认为 null 不做任何转换。
 * @return 返回 Format 参数指定格式的时间字符串
 */
export default function formatDate(time = new Date(), format = 'YYYY-MM-DD hh:mm:ss', utc = null) {

    try {
        time = new Date(time)
    } catch (error) {
        console.error('Wrong time type：', error);
        time = new Date();
    }
    // utc 0点时间转为本地时间
    if (utc === false) time = new Date(time.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    // utc 本地时间转为0点时间
    if (utc === true) time = new Date(time.getTime() + new Date().getTimezoneOffset() * 60 * 1000);
    [
        { test: /YYYY/g, text: time.getFullYear() },
        { test: /MM/g, text: time.getMonth() + 1 },
        { test: /DD/g, text: time.getDate() },
        { test: /hh/g, text: time.getHours() },
        { test: /mm/g, text: time.getMinutes() },
        { test: /ss/g, text: time.getSeconds() },
        { test: /ms/g, text: time.getMilliseconds() }
    ].forEach(e => {
        format = format.replace(e['test'], (e.text < 10 ? '0' + e.text : e.text))
    });
    return format;
}
