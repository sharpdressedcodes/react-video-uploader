const reducer = (acc: any[], curr: any): any[] => {
    if (acc.includes(curr)) {
        return acc;
    }

    return [
        ...acc,
        curr,
    ];
};

// Set preserveFirst to `false` to keep last item instead of first.
const dedupe = (arr: any[], preserveFirst: boolean = true): any[] => {
    if (preserveFirst) {
        return arr.reduce(reducer, [] as any[]);
    }

    return arr
        .reverse()
        .reduce(reducer, [] as any[])
        .reverse()
    ;
};

export default dedupe;
