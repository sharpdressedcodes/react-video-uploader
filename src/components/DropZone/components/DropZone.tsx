import React, { DragEvent, memo, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../common';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/drop-zone.scss';

export const defaultProps: DefaultPropsType = {
    className: '',
    onDraggingChanged: () => {},
    onDrop: () => {},
};

// Will be checked against document.body
const propertyTests = [
    'draggable',
    'ondragstart',
    'ondrop',
];

const DropZone = ({
    className = defaultProps.className,
    children,
    fallback,
    onDraggingChanged = defaultProps.onDraggingChanged,
    onDrop = defaultProps.onDrop,
}: PropsType) => {
    const ref = useRef<boolean>(false);
    const [isSupported, setIsSupported] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const stopEvents = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleOnDragEnter = (event: DragEvent<HTMLDivElement>) => {
        stopEvents(event);
        setIsDragging(true);
        onDraggingChanged(true);
    };
    const handleOnDragLeave = (event: DragEvent<HTMLDivElement>) => {
        stopEvents(event);
        setIsDragging(false);
        onDraggingChanged(false);
    };
    const handleOnDragOver = (event: DragEvent<HTMLDivElement>) => {
        stopEvents(event);
    };
    const handleOnDrop = (event: DragEvent<HTMLDivElement>) => {
        // console.log('DropZone:handleOnDrop', event.dataTransfer.files, event.dataTransfer.items, event.dataTransfer.types, event);
        stopEvents(event);
        setIsDragging(false);
        onDraggingChanged(false);
        onDrop(event);
    };
    const renderListener = () => {
        if (!isDragging) {
            return null;
        }

        return (
            <div
                className="drop-zone__listener"
                onDragEnter={ handleOnDragEnter }
                onDragLeave={ handleOnDragLeave }
                onDragOver={ handleOnDragOver }
                onDrop={ handleOnDrop }
            />
        );
    };

    useEffect(() => {
        if (!ref.current) {
            ref.current = true;

            const supported = propertyTests.every(prop => prop in document.body);

            if (supported !== isSupported) {
                setIsSupported(supported);
            }
        }
    }, []);

    return !isSupported ? fallback : (
        <div
            className={ classNames(
                'drop-zone',
                { 'drop-zone--dragging': isDragging },
                className,
            ) }
            onDragEnter={ handleOnDragEnter }
        >
            <div className="drop-zone__container">
                <div className="drop-zone__content">
                    {children}
                </div>
            </div>
            {renderListener()}
        </div>
    );
};

DropZone.displayName = 'DropZone';

export default memo<PropsType>(DropZone);
