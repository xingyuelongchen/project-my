
const { maxAge } = require('../config');
module.exports = function name(day) {
    if (day && typeof day == 'number') return (Date.now() + day * 60 * 60 * 1000 * 24);
    else return (Date.now() + maxAge);
}