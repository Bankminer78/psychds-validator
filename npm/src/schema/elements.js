import { memoize } from '../utils/memoize.js';
//split filename into constituent parts
export function _readElements(filename) {
    let extension = '';
    let suffix = '';
    const keywords = {};
    const parts = filename.split('_');
    for (let i = 0; i < parts.length - 1; i++) {
        const [key, value] = parts[i].split('-');
        keywords[key] = value || 'NOKEYWORD';
    }
    const lastPart = parts[parts.length - 1];
    const extStart = lastPart.indexOf('.');
    if (extStart === -1) {
        suffix = lastPart;
    }
    else {
        suffix = lastPart.slice(0, extStart);
        extension = lastPart.slice(extStart);
    }
    return { keywords, suffix, extension };
}
export const readElements = memoize(_readElements);
