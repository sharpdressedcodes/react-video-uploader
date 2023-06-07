import isObject from './isObject';

const removeItem = (item: string, arr: string[]): string[] => {
    const index = arr.indexOf(item.trim());

    if (index > -1) {
        arr.splice(index, 1);
    }

    return [...arr];
};

const parseExpression = (expression: any, currentList: string[]): string[] => {
    let list = currentList;
    let s: string;

    switch (typeof expression) {
        case 'string':
            s = expression.trim();
            list = removeItem(s, list);

            if (s) {
                list.push(s);
            }
            break;

        case 'number':
            s = expression.toString().trim();
            list = removeItem(s, list);

            if (s) {
                list.push(s);
            }
            break;

        default:
            if (Array.isArray(expression)) {
                expression.forEach(item => {
                    parseExpression(item, list).forEach(newItem => {
                        list = removeItem(newItem, list);

                        if (newItem) {
                            list.push(newItem);
                        }
                    });
                });
            } else if (isObject(expression)) {
                Object
                    .entries(expression)
                    .forEach(([key, value]) => {
                        s = key.trim();
                        list = removeItem(s, list);

                        if (value) {
                            list.push(s);
                        }
                    })
                ;
            }
    }

    return list;
};

const classNames = (...args: any[]): string => {
    let arr: string[] = [];

    args.filter(Boolean).forEach(arg => {
        parseExpression(arg, arr).forEach(item => {
            arr = removeItem(item, arr);

            if (item) {
                arr.push(item);
            }
        });
    });

    return arr.join(' ');
};

export default classNames;
