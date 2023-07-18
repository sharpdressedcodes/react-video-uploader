import { useEffect, useRef } from 'react';
import { SimpleWebSocket } from '../common';

export type DefaultPropsType = {
    onOpen: (event: Event) => void;
    onError: (event: Event) => void;
    onClose: (event: Event) => void;
    onMessage: (event: MessageEvent) => void;
    protocols: string | string[];
    url: Nullable<string>;
};

export type PropsType = Partial<DefaultPropsType>;

export const defaultProps: DefaultPropsType = {
    onOpen: () => {},
    onError: () => {},
    onClose: () => {},
    onMessage: () => {},
    protocols: [],
    url: null,
};

const useWebSocket = ({
    onClose = defaultProps.onClose,
    onError = defaultProps.onError,
    onMessage = defaultProps.onMessage,
    onOpen = defaultProps.onOpen,
    protocols = defaultProps.protocols,
    url = defaultProps.url,
}: PropsType): Nullable<SimpleWebSocket> => {
    const ref = useRef<Nullable<SimpleWebSocket>>(null);

    useEffect(() => {
        if (!ref.current) {
            ref.current = new SimpleWebSocket(url, protocols);

            ref.current.addEventListeners({
                onOpen,
                onMessage,
                onError,
                onClose,
            });
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListeners({
                    onOpen,
                    onMessage,
                    onError,
                    onClose,
                });

                ref.current = null;
            }
        };
    }, [
        onOpen,
        onMessage,
        onError,
        onClose,
        url,
        protocols,
    ]);

    return ref.current;
};

export default useWebSocket;
