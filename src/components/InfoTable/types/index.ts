import { PropsType as InfoTableItemPropsType } from '../components/InfoTableItem';

export type DefaultPropsType = {
    className?: string;
};

export type PropsType = DefaultPropsType & {
     items: InfoTableItemPropsType[]
};
