import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Picture from './picture';

class Teaser extends Component {
    static displayName = 'Teaser';

    static DEFAULT_ORDER = [ 'title', 'image', 'text'];

    static propTypes = {
        title: PropTypes.string,
        imageSrc: PropTypes.string,
        imageAlt: PropTypes.string,
        text: PropTypes.string,
        order: PropTypes.arrayOf(PropTypes.string),
        className: PropTypes.string
    };

    static defaultProps = {
        title: null,
        imageSrc: null,
        imageAlt: '',
        text: null,
        order: Teaser.DEFAULT_ORDER,
        className: ''
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { title, imageSrc, imageAlt, text, order, className } = this.props;
        const titleChanged = title !== nextProps.title;
        const imageSrcChanged = imageSrc !== nextProps.imageSrc;
        const imageAltChanged = imageAlt !== nextProps.imageAlt;
        const textChanged = text !== nextProps.text;
        const orderChanged = order !== nextProps.order;
        const classNameChanged = className !== nextProps.className;

        return titleChanged || imageSrcChanged || imageAltChanged || textChanged || orderChanged || classNameChanged;
    }

    render() {
        const { title, imageSrc, imageAlt, text, order, className } = this.props;
        const elements = [];

        order.forEach((item, index) => {
            const key = `teaser-${index}-${item}`;
            switch (item) {
                case 'title':
                    title && elements.push(<div key={key} className="teaser-title">{title}</div>);
                    break;
                case 'image':
                    imageSrc && elements.push(
                        <div key={key} className="teaser-image">
                            <Picture src={imageSrc} alt={imageAlt}/>
                        </div>
                    );
                    break;
                case 'text':
                    text && elements.push(<div key={key} className="teaser-text">{text}</div>);
                    break;
            }
        });

        return (
            <section className={classNames('teaser', className)}>
                {elements}
            </section>
        );
    }
}

export default Teaser;
