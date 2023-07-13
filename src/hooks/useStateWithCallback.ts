import { useEffect, useRef, useState } from 'react';

export type OnUpdateCallback<T> = (s: T) => void;
export type SetStateUpdaterCallback<T> = (s: T) => T;
export type SetStateAction<T> = (newState: T | SetStateUpdaterCallback<T>, callback?: OnUpdateCallback<T>) => void;

export default function useStateWithCallback<T>(init: T): [T, SetStateAction<T>];
export default function useStateWithCallback<T = undefined>(init?: T): [T | undefined, SetStateAction<T | undefined>];
export default function useStateWithCallback<T>(init: T): [T, SetStateAction<T>] {
    const [state, setState] = useState<T>(init);
    const ref = useRef<OnUpdateCallback<T>>();

    const set: SetStateAction<T> = (newState, callback?): void => {
        ref.current = callback;
        setState(newState);
    };

    useEffect(() => {
        if (ref.current) {
            ref.current(state);
        }

        ref.current = undefined;
    }, [state]);

    return [state, set];
}
