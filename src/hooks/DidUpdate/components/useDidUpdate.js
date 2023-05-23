import React, { useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';

const useDidUpdate = (effect, dependencies) => {
    const hasMounted = useRef(false);
    const prevProps = useRef(dependencies);

    useEffect(
        () => {
            if (!hasMounted.current) {
                hasMounted.current = true;
                return;
            }

            if (!isEqual(prevProps.current, dependencies)) {
                effect(prevProps.current);
                prevProps.current = dependencies;
            }
        },
        Array.isArray(dependencies) ? dependencies : [dependencies],
    );
};

useDidUpdate.displayName = 'useDidUpdate';

export default useDidUpdate;
