import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

/**
 * Class components are now deprecated,
 * but using a class component is the only way to define
 * an ErrorBoundary as of 17 May 2023.
 */
class ErrorBoundary extends Component {
    static displayName = 'ErrorBoundary';

    static propTypes = {
        children: PropTypes.node.isRequired,
        onComponentDidCatch: PropTypes.func,
        errorMessage: PropTypes.node,
    };

    static defaultProps = {
        onComponentDidCatch: Function.prototype,
        errorMessage: <h1>An unexpected error has occurred</h1>,
    };

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    constructor(...args) {
        super(...args);

        this.state = { hasError: false };
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    componentDidCatch(error, errorInfo) {
        this.props.onComponentDidCatch(error, errorInfo);
    }

    render() {
        const { errorMessage, children } = this.props;

        return this.state.hasError ? errorMessage : children;
    }
}

export default ErrorBoundary;
