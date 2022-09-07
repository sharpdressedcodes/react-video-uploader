import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

// TODO: convert to function
class InfoTable extends Component {
    static displayName = 'InfoTable';

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
        })).isRequired
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
    }

    renderItems() {
        return this.props.items.map(item => (
            <tr key={ item.title }>
                <td>{item.title}</td>
                <td>{item.text}</td>
            </tr>
        ));
    }

    render() {
        return (
            <div className="info-table">
                <table>
                    <tbody>{this.renderItems()}</tbody>
                </table>
            </div>
        );
    }
}

export default InfoTable;
