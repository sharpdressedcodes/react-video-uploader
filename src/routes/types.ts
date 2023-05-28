import { JSX, LazyExoticComponent, ReactElement } from 'react';

export type RouteType = JSX.IntrinsicAttributes & {
    name: string
    element: LazyExoticComponent<() => ReactElement>,
    navLinkText?: string
    path?: string
}
