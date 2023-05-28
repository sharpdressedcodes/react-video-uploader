import React, { memo } from 'react';
import { PropsType } from '../types';

const InfoTableItem = ({ title, text }: PropsType) => (
    <tr>
        <td>{title}</td>
        <td>{text}</td>
    </tr>
);

export default memo<PropsType>(InfoTableItem);
