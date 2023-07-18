export type ResizeType = 'horizontal' | 'vertical';

export type DefaultPropsType = {
    className: string;
    type: ResizeType;
};

export type PropsType = Partial<DefaultPropsType> & {
    onMove: (distanceMoved: number) => void;
};

export type StateType = {
    isMouseDown: boolean;
    origin: number;
};
