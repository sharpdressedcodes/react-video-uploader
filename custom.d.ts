declare module '*.svg' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content: any;
    export default content;
}

// Used in service worker
interface Window {
    __WB_MANIFEST: any;
    skipWaiting: () => void;
}

declare type Nullable<T> = T | null;

declare type MaybePromiseType<T> = T | Promise<T> | PromiseLike<T>;
