import { ReactNode } from 'react';
import { StoreType } from '../../../state/stores/app';

export type PropsType = {
    children: ReactNode;
    store: StoreType;
};
