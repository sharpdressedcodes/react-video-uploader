import React, { Fragment, memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../styles/picture.scss';

const Picture = ({ alt, animatedSrc, caption, className, order, src }) => {
    const [mouseEntered, setMouseEntered] = useState(false);

    const onMouseEnter = event => {
        if (animatedSrc) {
            setMouseEntered(true);
        }
    };
    const onMouseLeave = event => {
        if (animatedSrc) {
            setMouseEntered(false);
        }
    };
    const elements = order.map(item => {
        switch (item) {
            case 'image':
                return (
                    <Fragment key={ item }>
                        <img key={ src } className="picture-image" src={ src } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'none' : 'initial' } } />
                        <img key={ animatedSrc } className="picture-image" src={ animatedSrc } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'initial' : 'none' } } />
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

Picture.DEFAULT_ORDER = ['image', 'text'];

Picture.propTypes = {
    src: PropTypes.string.isRequired,
    animatedSrc: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
};

Picture.defaultProps = {
    animatedSrc: null,
    caption: null,
    alt: '',
    order: Picture.DEFAULT_ORDER,
    className: '',
};

export default memo(Picture);
