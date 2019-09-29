import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class TeaserList extends Component {
    static displayName = 'TeaserList';

    static propTypes = {
        className: PropTypes.string,
        children: PropTypes.array,
    };

    static defaultProps = {
        className: '',
        children: [],
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // return this.props.children !== nextProps.children;
        return false;
    }

    render() {
        const { className } = this.props;

        return (
            <ul className={classNames('teaserlist', className)}>
                {this.props.children}
            </ul>
        );
    }
}

export default TeaserList;
