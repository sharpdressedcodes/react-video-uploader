import React, { memo, ReactNode } from 'react';
import classNames from 'classnames';
import Picture from '../../Picture';
import { DefaultPropsType, PropsType } from '../types';

const DEFAULT_ORDER = ['title', 'image', 'text'];

export const defaultProps: DefaultPropsType = {
    imageAlt: '',
    order: DEFAULT_ORDER,
};

const Teaser = ({
    animatedImageSrc,
    className,
    imageAlt = defaultProps.imageAlt,
    imageSrc,
    order = defaultProps.order,
    text,
    title,
}: PropsType) => {
    const orderedElements = order?.reduce((acc: ReactNode[], curr: string) => {
        switch (curr) {
            case 'title':
                if (title) {
                    return [
                        ...acc,
                        <div key={ curr } className="teaser-title">{title}</div>,
                    ];
                }

                break;

            case 'image':
                if (imageSrc) {
                    return [
                        ...acc,
                        (
                            <div key={ curr } className="teaser-image">
                                <Picture src={ imageSrc } animatedSrc={ animatedImageSrc } alt={ imageAlt } />
                            </div>
                        ),
                    ];
                }

                break;

            case 'text':
                if (text) {
                    return [
                        ...acc,
                        <div key={ curr } className="teaser-text">{text}</div>,
                    ];
                }

                break;

            default:
                return acc;
        }

        return acc;
    }, []);

    return (
        <section className={ classNames('teaser', className) }>
            {orderedElements}
        </section>
    );
};

Teaser.displayName = 'Teaser';

Teaser.DEFAULT_ORDER = DEFAULT_ORDER;

export default memo<PropsType>(Teaser);
