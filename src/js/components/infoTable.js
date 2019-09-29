import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InfoTable extends Component {
    static displayName = 'InfoTable';

    static propTypes = {
        items: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })).isRequired,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const itemsChanged = this.items !== nextProps.items;

        return itemsChanged;
    }

    renderItems() {
        return this.props.items.map((item, index) => {
            const key = `${InfoTable.displayName}-${index}-${(+new Date())}`;

            return (
                <tr key={key}>
                    <td>{item.title}</td>
                    <td>{item.text}</td>
                </tr>
            );
        });
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
