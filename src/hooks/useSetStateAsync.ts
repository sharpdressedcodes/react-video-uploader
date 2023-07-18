import { useCallback } from 'react';
import useSetState, { StateUpdateType } from './useSetState';

export type SetStateType<T> = [T, (update: StateUpdateType<T>) => Promise<T>];

const useSetStateAsync = <T extends Record<string, any>>(initialState: T = {} as T): SetStateType<T> => {
// const useSetStateAsync = <T>(initialState: T): SetStateType<T> => {
    const [state, setState] = useSetState<T>(initialState);
    const set = useCallback((update: StateUpdateType<T>) => new Promise<T>(resolve => {
        setState(update, resolve);
    }), []);

    return [state, set];
};

export default useSetStateAsync;
