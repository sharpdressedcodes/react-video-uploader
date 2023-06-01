export type DefaultPropsType = {
    autoPlay?: boolean;
    className?: string;
    controls?: boolean;
    poster?: string;
};

export type PropsType = DefaultPropsType & {
    src: string;
};
