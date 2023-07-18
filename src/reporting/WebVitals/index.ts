const reportWebVitals = (onPerfEntry: Nullable<(...args: any[]) => void> = null): void => {
    (async () => {
        if (onPerfEntry) {
            const { onCLS, onFID, onFCP, onLCP, onTTFB } = await import(/* webpackChunkName: "web-vitals" */ 'web-vitals');

            onCLS(onPerfEntry);
            onFID(onPerfEntry);
            onFCP(onPerfEntry);
            onLCP(onPerfEntry);
            onTTFB(onPerfEntry);
        }
    })();
};

export default reportWebVitals;
