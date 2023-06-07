const reducer = (acc: string[], curr: string): string[] => {
    if (acc.includes(curr)) {
        return acc;
    }

    return [
        ...acc,
        curr,
    ];
};

// Set preserveFirst to `false` to keep last item instead of first.
const dedupe = (arr: string[], preserveFirst: boolean = true): string[] => {
    if (preserveFirst) {
        return arr.reduce(reducer, [] as string[]);
    }

    return arr
        .reverse()
        .reduce(reducer, [] as string[])
        .reverse()
    ;
};

export default dedupe;
