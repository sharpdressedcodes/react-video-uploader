const setTimeoutAsync = <T = void>(milliSeconds: number = 0) => new Promise<T>(resolve => {
    setTimeout(resolve, milliSeconds);
});

export default setTimeoutAsync;
