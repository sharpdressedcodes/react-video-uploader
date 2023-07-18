import useStateWithCallback, { SetStateUpdaterCallback } from './useStateWithCallback';

export type SetStateAction<T> = (newState: T | SetStateUpdaterCallback<T>) => Promise<T>;

export default function useStateAsync<T>(init: T): [T, SetStateAction<T>];
export default function useStateAsync<T = undefined>(init?: T): [T | undefined, SetStateAction<T | undefined>];
export default function useStateAsync<T>(init: T): [T, SetStateAction<T>] {
    const [state, setState] = useStateWithCallback<T>(init);
    const set: SetStateAction<T> = (newState): Promise<T> => new Promise(resolve => {
        setState(newState, resolve);
    });

    return [state, set];
}
