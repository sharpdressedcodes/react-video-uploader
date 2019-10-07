import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Picture extends Component {
    static displayName = 'Picture';

    static DEFAULT_ORDER = ['image', 'text'];

    static propTypes = {
        src: PropTypes.string.isRequired,
        animatedSrc: PropTypes.string,
        alt: PropTypes.string,
        caption: PropTypes.string,
        order: PropTypes.arrayOf(PropTypes.string),
        className: PropTypes.string
    };

    static defaultProps = {
        animatedSrc: null,
        caption: null,
        alt: '',
        order: Picture.DEFAULT_ORDER,
        className: ''
    };

    constructor(props) {
        super(props);

        this.container = React.createRef();
        this.state = {
            mouseEntered: false
        };
    }

    componentDidMount() {
        this.container.current.addEventListener('mouseenter', this.onMouseEnter, false);
        this.container.current.addEventListener('mouseleave', this.onMouseLeave, false);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {
            src, animatedSrc, alt, caption, order, className
        } = this.props;
        const { mouseEntered } = this.state;
        const srcChanged = src !== nextProps.src;
        const altChanged = alt !== nextProps.alt;
        const captionChanged = caption !== nextProps.caption;
        const orderChanged = order !== nextProps.order;
        const classNameChanged = className !== nextProps.className;
        const animatedSrcChanged = animatedSrc !== nextProps.animatedSrc;
        const mouseEnteredChanged = mouseEntered !== nextState.mouseEntered;

        return srcChanged || animatedSrcChanged || altChanged || captionChanged || orderChanged || classNameChanged || mouseEnteredChanged;
    }

    componentWillUnmount() {
        this.container.current.removeEventListener('mouseenter', this.onMouseEnter);
        this.container.current.removeEventListener('mouseleave', this.onMouseLeave);
    }

    onMouseEnter = event => {
        const { animatedSrc } = this.props;

        if (animatedSrc) {
            this.setState({ mouseEntered: true });
        }
    };

    onMouseLeave = event => {
        const { animatedSrc } = this.props;

        if (animatedSrc) {
            this.setState({ mouseEntered: false });
        }
    };

    render() {
        const {
            src, animatedSrc, alt, caption, order, className
        } = this.props;
        const { mouseEntered } = this.state;
        const elements = [];

        order.forEach((item, index) => {
            const key = `picture-${(+new Date())}-${index}-${item}`;

            switch (item) {
            case 'image':
                elements.push(<img key={key} className="picture-image" src={mouseEntered && animatedSrc ? animatedSrc : src} alt={alt} />);
                break;
            case 'text':
                if (caption) {
                    elements.push(<figcaption key={key} className="picture-text">{caption}</figcaption>);
                }
                break;
            default:
            }
        });

        return <figure className={classNames('picture', className)} ref={this.container}>{elements}</figure>;
    }
}

export default Picture;
