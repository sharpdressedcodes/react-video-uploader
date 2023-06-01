import { RouteType } from '../../../routes';

export type DefaultPropsType = {
    className?: string;
};

export type PropsType = DefaultPropsType & {
    routes: RouteType[];
};
