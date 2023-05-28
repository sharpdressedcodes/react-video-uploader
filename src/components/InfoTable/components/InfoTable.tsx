import React, { memo } from 'react';
import classNames from 'classnames';
import InfoTableItem, { PropsType as InfoTableItemPropsType } from './InfoTableItem';
import { PropsType } from '../types';

const InfoTable = ({ className, items }: PropsType) => {
    const renderItems = () => items.map(({ title, text }: InfoTableItemPropsType) => (
        <InfoTableItem key={ title } title={ title } text={ text } />
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

export default memo<PropsType>(InfoTable);
