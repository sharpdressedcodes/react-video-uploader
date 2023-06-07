import isObject from './isObject';

const removeIfExists = (item: string, arr: string[]) => {
    const index = arr.indexOf(item);

    if (index > -1) {
        arr.splice(index, 1);
    }
};

const parseExpression = (expression: any) => {
    const arr: string[] = [];
    const type = typeof expression;
    const add = (item: string) => {
        const trimmed = item.trim();

        removeIfExists(trimmed, arr);
        arr.push(trimmed);
    };

    if (type === 'string') {
        add(expression);
    } else if (type === 'number') {
        add(expression.toString());
    } else if (Array.isArray(expression)) {
        expression.forEach(item => {
            if (item) {
                const parsed = parseExpression(item);

                if (parsed) {
                    add(parsed);
                }
            }
        });
    } else if (isObject(expression)) {
        Object.entries(expression).forEach(([key, value]) => {
            if (value) {
                add(key);
            }
        });
    }

    return arr.join(' ');
};

const classNames = (...args: any[]) => args.reduce((acc, curr) => {
    const parsed = parseExpression(curr);

    if (parsed) {
        const trimmed = parsed.trim();

        removeIfExists(trimmed, acc);

        return [
            ...acc,
            trimmed,
        ];
    }

    return acc;
}, []).join(' ');

export default classNames;
