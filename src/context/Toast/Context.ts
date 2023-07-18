import { createContext, ReactNode } from 'react';

export type ToastContextType = {
    error: (msg: ReactNode) => void;
    success: (msg: ReactNode) => void;
    warning: (msg: ReactNode) => void;
    info: (msg: ReactNode) => void;
    plain: (msg: ReactNode) => void;
    dismiss: () => Promise<void>;
};

const ToastContext = createContext<ToastContextType>({
    error: () => void 0,
    success: () => void 0,
    warning: () => void 0,
    info: () => void 0,
    plain: () => void 0,
    dismiss: async () => void 0,
});

ToastContext.displayName = 'ToastContext';

export default ToastContext;
