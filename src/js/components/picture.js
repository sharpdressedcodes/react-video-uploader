import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Picture extends Component {
    static displayName = 'Picture';

    static DEFAULT_ORDER = ['image', 'text'];

    static propTypes = {
        src: PropTypes.string.isRequired,
        alt: PropTypes.string,
        caption: PropTypes.string,
        order: PropTypes.arrayOf(PropTypes.string),
        className: PropTypes.string
    };

    static defaultProps = {
        caption: null,
        alt: '',
        order: Picture.DEFAULT_ORDER,
        className: ''
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const { src, alt, caption, order, className } = this.props;
        const srcChanged = src !== nextProps.src;
        const altChanged = alt !== nextProps.alt;
        const captionChanged = caption !== nextProps.caption;
        const orderChanged = order !== nextProps.order;
        const classNameChanged = className !== nextProps.className;

        return srcChanged || altChanged || captionChanged || orderChanged || classNameChanged;
    }

    render() {
        const { src, alt, caption, order, className } = this.props;
        const elements = [];

        order.forEach((item, index) => {
            const key = `picture-${(+new Date())}-${index}-${item}`;
            switch (item) {
                case 'image':
                    elements.push(<img key={key} className="picture-image" src={src} alt={alt} />);
                    break;
                case 'text':
                    caption && elements.push(<figcaption key={key} className="picture-text">{caption}</figcaption>);
                    break;
            }
        });

        return <figure className={classNames('picture', className)}>{elements}</figure>;
    }
}

export default Picture;
