export type DefaultPropsType = {
    animatedSrc?: string;
    alt?: string;
    caption?: string;
    order?: string[];
    className?: string;
}

export type PropsType = DefaultPropsType & {
    src: string;
}
