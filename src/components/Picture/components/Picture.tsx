import React, { Fragment, memo, useState } from 'react';
import classNames from 'classnames';
import { DefaultPropsType, PropsType } from '../types';
import '../styles/picture.scss';

const DEFAULT_ORDER = ['image', 'text'];

export const defaultProps: DefaultPropsType = {
    alt: '',
    order: DEFAULT_ORDER,
};

const Picture = ({
    alt = defaultProps.alt,
    animatedSrc,
    caption,
    className,
    order = defaultProps.order,
    src,
}: PropsType) => {
    const [mouseEntered, setMouseEntered] = useState(false);

    const onMouseEnter = () => {
        if (animatedSrc) {
            setMouseEntered(true);
        }
    };
    const onMouseLeave = () => {
        if (animatedSrc) {
            setMouseEntered(false);
        }
    };
    const elements = order?.map(item => {
        switch (item) {
            case 'image':
                return (
                    <Fragment key={ item }>
                        <img
                            alt={ alt }
                            className="picture-image picture-image--still"
                            height="100%"
                            key={ src }
                            loading="lazy"
                            src={ src }
                            style={ { display: mouseEntered && animatedSrc ? 'none' : 'initial' } }
                            width="auto"
                        />
                        <img
                            alt={ alt }
                            className="picture-image picture-image--animated"
                            height="100%"
                            key={ animatedSrc }
                            loading="lazy"
                            src={ animatedSrc }
                            style={ { display: mouseEntered && animatedSrc ? 'initial' : 'none' } }
                            width="auto"
                        />
                    </Fragment>
                );

            case 'text':
                if (caption) {
                    return <figcaption key={ item } className="picture-text">{caption}</figcaption>;
                }
                break;

            default:
        }

        return null;
    });

    return (
        <figure
            className={ classNames('picture', className) }
            onMouseEnter={ onMouseEnter }
            onMouseLeave={ onMouseLeave }
        >
            {elements}
        </figure>
    );
};

Picture.displayName = 'Picture';

Picture.DEFAULT_ORDER = DEFAULT_ORDER;

export default memo<PropsType>(Picture);
