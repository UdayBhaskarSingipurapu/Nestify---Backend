
function wrapAsync(fn) {
    if (typeof fn !== 'function') {
        throw new TypeError('wrapAsync expects a function');
    }
    
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = wrapAsync;
