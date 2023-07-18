import { ForwardedRef, useEffect, useRef } from 'react';

const useForwardRef = <T>(ref: ForwardedRef<T>, initialValue: any = null) => {
    const targetRef = useRef<T>(initialValue);

    useEffect(() => {
        if (!ref) {
            return;
        }

        if (typeof ref === 'function') {
            ref(targetRef.current);
            return;
        }

        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current;
    }, [ref]);

    return targetRef;
};

export default useForwardRef;
