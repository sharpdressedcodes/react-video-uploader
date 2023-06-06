declare module '*.svg' {
    const content: any;
    export default content;
}

// Hot reloading
declare module 'webpack-hot-middleware';

interface ImportMeta {
    webpackHot: any;
}

interface Window {
    // Used in service worker
    __WB_MANIFEST: any;
    skipWaiting: () => void;
    // Used in server/render and browser index for server side rendering
    loaded: boolean;
    boot: () => void;
    reactRoot: any;
    reactInitialData: any;
    reactPreloadedState: any;

    // Used in tests (jest mock)
    XMLHttpRequest: any;
}

declare type Nullable<T> = T | null;

declare type MaybePromiseType<T> = T | Promise<T> | PromiseLike<T>;
