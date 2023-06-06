const maybePromiseResolver = async <T>(promise: MaybePromiseType<T>): Promise<T> => (
    promise instanceof Promise ? await promise : promise
) as T;

export default maybePromiseResolver;
