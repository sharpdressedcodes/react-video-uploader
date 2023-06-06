import { useCallback, useState } from 'react';

export type StateUpdateType<T> = Partial<T> | ((prevState: T) => Partial<T>);
export type SetStateType<T> = [T, (update: StateUpdateType<T>) => void];

const useSetState = <T extends Record<string, any>>(initialState: T = {} as T): SetStateType<T> => {
    const [state, setState] = useState<T>(initialState);
    const set = useCallback((update: StateUpdateType<T>) => {
        setState(prevState => ({
            ...prevState,
            ...(typeof update === 'function' ? update(prevState) : update),
        }));
    }, []);

    return [state, set];
};

export default useSetState;
