import isObject from './isObject';

export type GetObjectValueParametersType = (config: any, key: string, defaultValue: any) => any;

const getObjectValue: GetObjectValueParametersType = (config: any, key: string, defaultValue: any = null): any => {
    const a = key
        // Convert indexes to properties
        .replace(/\[(\w+)]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
    ;
    let o = config;

    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];

        if (isObject(o) && k in o) {
            o = o[k];
        } else {
            return defaultValue;
        }
    }

    return o;
};

export default getObjectValue;
