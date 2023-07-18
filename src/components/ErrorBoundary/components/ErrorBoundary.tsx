import React, { Component, ErrorInfo } from 'react';
import isEqual from 'lodash.isequal';
import { DefaultPropsType, PropsType, StatesType } from '../types';
/**
 * Class components are now deprecated,
 * but using a class component is the only way to define
 * an ErrorBoundary as of 17 May 2023.
 */

class ErrorBoundary extends Component<PropsType, StatesType> {
    public static displayName = 'ErrorBoundary';

    public static defaultProps: DefaultPropsType = {
        onComponentDidCatch: () => {},
        errorMessage: <h1>An unexpected error has occurred</h1>,
    };

    public static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public constructor(props: PropsType, context?: any) {
        super(props, context);

        this.state = { hasError: false };
    }

    public override shouldComponentUpdate(nextProps: PropsType, nextState: StatesType, nextContext: any) {
        return !isEqual(this.props, nextProps) ||
            !isEqual(this.state, nextState) ||
            !isEqual(this.context, nextContext)
        ;
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (this.props.onComponentDidCatch) {
            this.props.onComponentDidCatch(error, errorInfo);
        }
    }

    public override render() {
        const { errorMessage, children } = this.props;

        return this.state.hasError ? errorMessage : children;
    }
}

export default ErrorBoundary;
