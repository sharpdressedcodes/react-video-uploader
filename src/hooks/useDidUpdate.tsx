import React, { DependencyList, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

const useDidUpdate = <T,>(effect: (prevProps: T) => void, dependencies: DependencyList): void => {
    const hasMounted = useRef<boolean>(false);
    const prevProps = useRef<DependencyList>(dependencies);

    useEffect(
        (): void => {
            if (!hasMounted.current) {
                hasMounted.current = true;
                return;
            }

            if (!isEqual(prevProps.current, dependencies)) {
                effect(prevProps.current as T);
                prevProps.current = dependencies;
            }
        },
        dependencies,
    );
};

export default useDidUpdate;
