export type DefaultPropsType = {
    rel?: string;
    sizes?: Nullable<string>;
};

export type PropsType = DefaultPropsType & {
    src: string;
    type: string;
};
