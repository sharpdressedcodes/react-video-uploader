import isObject from './isObject';

// Choose the most recent value in array
const dedupe = (arr: string[]): string[] => arr
    .reverse()
    .reduce((acc, curr) => {
        if (acc.includes(curr)) {
            return acc;
        }

        return [
            ...acc,
            curr,
        ];
    }, [] as string[])
    .reverse()
;
const parseExpression = (expression: any) => {
    const arr: string[] = [];
    const type = typeof expression;
    const add = (item: string) => {
        arr.push(item.trim());
    };

    if (type === 'string') {
        add(expression);
    } else if (type === 'number') {
        add(expression.toString());
    } else if (Array.isArray(expression)) {
        expression
            .filter(Boolean)
            .forEach(item => {
                const parsed = parseExpression(item);

                if (parsed) {
                    add(parsed);
                }
            })
        ;
    } else if (isObject(expression)) {
        Object
            .entries(expression)
            .filter(([, value]) => Boolean(value))
            .forEach(([key]) => {
                add(key);
            })
        ;
    }

    return dedupe(arr).join(' ');
};
const classNames = (...args: any[]) => dedupe(args.reduce((acc, curr) => {
    const parsed = parseExpression(curr);

    if (parsed) {
        return [
            ...acc,
            parsed.trim(),
        ];
    }

    return acc;
}, [])).join(' ');

export default classNames;
