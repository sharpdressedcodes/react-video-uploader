const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === '[object Object]';

export default isObject;
