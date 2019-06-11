/* global module */

/**
 * Key/value map of promises to prevent duplicate includes.
 *
 * @private
 */
const _cacheMap = {};

/**
 * Private method to properly create either a script node or a link node depending on file extension.
 *
 * @private
 * @param {string} src - The source url to load.
 * @returns {Object}
 */
function _createElement(src) {
    if (typeof src === 'string') {
        const js = '.js';
        const isScript = src.split('?')[0].slice(js.length * -1) === js;
        let element = document.createElement(isScript ? 'script' : 'link');
        if (isScript) {
            element.async = 'true';
            element.type = 'text/javascript';
            element.src = src;
        } else {
            element.rel = 'stylesheet';
            element.href = src;
        }
        return element;
    } else {
        throw new Error(`Invalid src provided: ${src}`);
    }
}

/**
 * Loads the requested Javascript or CSS by source url.
 *
 * @private
 * @param {string} src - The source url to load.
 * @param {Array} remaining - The remaining source url(s) to load.
 * @param {function} resolve - The resolve method once all requests have completed.
 */
function _load(src, remaining, resolve) {
    const nextSrc = remaining.splice(0, 1)[0];
    let promise = _cacheMap[src];
    if (!promise) {
        promise = _cacheMap[src] = new Promise((currentResolve, currentReject) => {
            console.info(`Creating a new promise for ${src}.`);
            const element = _createElement(src);
            if (element.readyState) { // IE.
                element.onreadystatechange = () => {
                    if (element.readyState === 'loaded' || element.readyState === 'complete') {
                        element.onreadystatechange = null;
                        console.info(`Loaded: ${src}.`);
                        promise.isResolved = true;
                        currentResolve(src);
                        nextSrc ? _load(nextSrc, remaining, resolve) : resolve(src);
                    } else {
                        element.onreadystatechange = null;
                        console.error(`Failed to load: ${src}.`);
                        promise.isResolved = false;
                        currentReject(src);
                        nextSrc ? _load(nextSrc, remaining, resolve) : resolve(src);
                    }
                };
            } else { // Others.
                element.onload = () => {
                    console.info(`Loaded: ${src}.`);
                    promise.isResolved = true;
                    currentResolve(src);
                    nextSrc ? _load(nextSrc, remaining, resolve) : resolve(src);
                };
                element.onerror = () => {
                    console.error(`Failed to load: ${src}.`);
                    promise.isResolved = false;
                    currentReject(src);
                    nextSrc ? _load(nextSrc, remaining, resolve) : resolve(src);
                };
            }
            document.querySelector('head').appendChild(element);
        });
    } else {
        console.info(`Already attempted to load ${src}.`);
        promise.then(() => {
            nextSrc ? _load(nextSrc, remaining, resolve) : resolve(src);
        });
    }
}

/**
 *
 * @param {...string} sources - The source url(s) to load.
 * @returns {Promise}
 */
module.exports = function (...sources) {
    const src = sources.splice(0, 1)[0];
    return new Promise(resolve => {
        _load(src, sources, resolve);
    });
};
