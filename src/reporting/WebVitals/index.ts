const reportWebVitals = (onPerfEntry: Nullable<(...args: any[]) => void> = null): void => {
    (async () => {
        if (onPerfEntry) {
            const { onCLS, onFCP, onINP, onLCP, onTTFB } = await import(/* webpackChunkName: "web-vitals" */ 'web-vitals');

            onCLS(onPerfEntry);
            onFCP(onPerfEntry);
            onINP(onPerfEntry);
            onLCP(onPerfEntry);
            onTTFB(onPerfEntry);
        }
    })();
};

export default reportWebVitals;
