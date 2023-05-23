import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Picture from '../../Picture';

const Teaser = ({ animatedImageSrc, className, imageAlt, imageSrc, order, text, title }) => {
    const orderedElements = order.reduce((acc, curr) => {
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

Teaser.DEFAULT_ORDER = ['title', 'image', 'text'];

Teaser.propTypes = {
    title: PropTypes.string,
    imageSrc: PropTypes.string,
    animatedImageSrc: PropTypes.string,
    imageAlt: PropTypes.string,
    text: PropTypes.string,
    order: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
};

Teaser.defaultProps = {
    title: null,
    imageSrc: null,
    animatedImageSrc: null,
    imageAlt: '',
    text: null,
    order: Teaser.DEFAULT_ORDER,
    className: '',
};

export default memo(Teaser);
