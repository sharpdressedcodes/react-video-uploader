import { useCallback } from 'react';
import useStateWithCallback, { OnUpdateCallback } from './useStateWithCallback';

export type StateUpdateType<T> = Partial<T> | ((prevState: T) => Partial<T>);
export type SetStateType<T> = [T, (update: StateUpdateType<T>, callback?: OnUpdateCallback<T>) => void];

const useSetState = <T extends Record<string, any>>(initialState: T = {} as T): SetStateType<T> => {
    const [state, setState] = useStateWithCallback<T>(initialState);
    const set = useCallback((update: StateUpdateType<T>, callback?: OnUpdateCallback<T>) => {
        setState(prevState => ({
            ...prevState,
            ...(typeof update === 'function' ? update(prevState) : update),
        }), callback);
    }, []);

    return [state, set];
};

export default useSetState;
