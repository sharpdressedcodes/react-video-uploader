export type DefaultPropsType = {
    className?: string;
}

export type PropsType = DefaultPropsType & {
    title: string;
    routePath: string;
}

export type NavLinkType = {
    [key: string]: string;
}
