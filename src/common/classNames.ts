import isObject from './isObject';

const parse = (expression: any): string[] => {
    const result: string[] = [];

    switch (typeof expression) {
        case 'string':
            result.push(expression.trim());
            break;

        case 'number':
            result.push(expression.toString().trim());
            break;

        default:
            if (Array.isArray(expression)) {
                expression
                    .filter(Boolean)
                    .forEach(item => {
                        result.push(typeof item === 'string' ? item.trim() : item.toString().trim());
                    })
                ;
            } else if (isObject(expression)) {
                Object
                    .entries(expression)
                    .forEach(([key, value]) => {
                        if (value) {
                            result.push(key.trim());
                        }
                    })
                ;
            }
    }

    return result;
};

const classNames = (...args: any[]): string => args
    .filter(Boolean)
    .reduce((acc, curr) => ([
        ...acc,
        ...(parse(curr).filter(Boolean)),
    ]), [])
    .join(' ')
;

export default classNames;
