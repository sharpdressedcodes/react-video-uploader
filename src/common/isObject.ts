const { toString } = Object.prototype;
const isObject = (obj: any, type?: string): boolean => toString.call(obj) === `[object ${type || 'Object'}]`;

export default isObject;
