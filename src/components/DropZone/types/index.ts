import { DragEvent, ReactElement, ReactNode } from 'react';

export type DefaultPropsType = {
    className: string;
    onDraggingChanged: (isDragging: boolean) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
};

export type PropsType = Partial<DefaultPropsType> & {
    children: ReactNode;
    fallback: ReactElement;
};
