import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const InfoTable = ({ className, items }) => {
    const renderItems = () => items.map(item => (
        <tr key={ item.title }>
            <td>{item.title}</td>
            <td>{item.text}</td>
        </tr>
    ));

    return (
        <div className={ classNames('info-table', className) }>
            <table>
                <tbody>{renderItems()}</tbody>
            </table>
        </div>
    );
};

InfoTable.displayName = 'InfoTable';

InfoTable.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })).isRequired,
    className: PropTypes.string,
};

InfoTable.defaultProps = {
    className: null,
};

export default memo(InfoTable);
