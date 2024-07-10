// https://stackoverflow.com/questions/67849097/typescript-type-narrowing-not-working-when-looping
export const hasProp = (obj, prop) => {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};
export const objectPathHandler = {
    get(target, property) {
        let res = target;
        for (const prop of property.split('.')) {
            if (hasProp(res, prop)) {
                res = res[prop];
            }
            else {
                return undefined;
            }
        }
        return res;
    },
};
