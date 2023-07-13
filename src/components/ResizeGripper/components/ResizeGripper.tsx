import React, { useEffect, useRef, memo, MouseEvent as ReactMouseEvent, MutableRefObject } from 'react';
import { classNames, setTimeoutAsync } from '../../../common';
import useSetState from '../../../hooks/useSetState';
import { ReactComponent as GripperIcon } from '../assets/gripper.svg';
import { DefaultPropsType, PropsType, StateType } from '../types';
import '../styles/resize-gripper.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    type: 'vertical',
};

const DEFAULT_STATE: StateType = {
    isMouseDown: false,
    origin: 0,
};

const ResizeGripper = ({
    className = defaultProps.className,
    type = defaultProps.type,
    onMove,
}: PropsType) => {
    const ref: MutableRefObject<Nullable<Document>> = useRef(null);
    const wrapperRef: MutableRefObject<Nullable<HTMLDivElement>> = useRef(null);
    const [state, setState] = useSetState(ResizeGripper.DEFAULT_STATE);

    const onMouseDown = async (event: ReactMouseEvent<HTMLButtonElement>) => {
        if (event.buttons === 1) {
            setState({
                isMouseDown: true,
                origin: type === 'horizontal' ? event.clientX : event.clientY,
            });

            await setTimeoutAsync();

            wrapperRef.current!.style.cursor = type === 'horizontal' ? 'ew-resize' : 'ns-resize';
        }
    };
    const onDocumentMouseMove = (event: MouseEvent) => {
        if (state.isMouseDown) {
            const newOrigin = type === 'horizontal' ? event.clientX : event.clientY;
            const distanceMoved = newOrigin - state.origin;

            if (distanceMoved) {
                setState({ origin: newOrigin });
                onMove(distanceMoved);
            }
        }
    };
    const onDocumentMouseUp = () => {
        if (state.isMouseDown) {
            setState({ isMouseDown: false });
            wrapperRef.current!.style.cursor = 'auto';
        }
    };
    const renderHandle = () => (
        <button
            className="gripper__handle"
            tabIndex={ -1 }
            title="Resize"
            type="button"
            onMouseDown={ onMouseDown }
        >
            <GripperIcon />
        </button>
    );
    const renderWrapper = () => (
        !state.isMouseDown ? null : <div className="gripper__wrapper" ref={ wrapperRef } />
    );
    const render = () => {
        switch (type) {
            case 'horizontal':
                return (
                    <div className={ classNames('resize-gripper gripper-horizontal', className) }>
                        {renderHandle()}
                        {renderWrapper()}
                    </div>
                );
            case 'vertical':
                return (
                    <div className={ classNames('resize-gripper gripper-vertical', className) }>
                        {renderHandle()}
                        {renderWrapper()}
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!ref.current) {
            ref.current = document;

            document.addEventListener('mousemove', onDocumentMouseMove);
            document.addEventListener('mouseup', onDocumentMouseUp);
        }

        return () => {
            if (ref.current) {
                ref.current = null;

                document.removeEventListener('mousemove', onDocumentMouseMove);
                document.removeEventListener('mouseup', onDocumentMouseUp);
            }
        };
    }, [state]);

    return render();
};

ResizeGripper.displayName = 'ResizeGripper';

ResizeGripper.DEFAULT_STATE = DEFAULT_STATE;

export default memo<PropsType>(ResizeGripper);
