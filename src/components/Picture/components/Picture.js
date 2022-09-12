import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import classNames from 'classnames';
import '../styles/picture.scss';

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

    constructor(...args) {
        super(...args);

        this.container = createRef();
        this.state = {
            mouseEntered: false
        };
    }

    componentDidMount() {
        this.container.current.addEventListener('mouseenter', this.onMouseEnter, false);
        this.container.current.addEventListener('mouseleave', this.onMouseLeave, false);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState) || !isEqual(this.context, nextContext);
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
        const { src, animatedSrc, alt, caption, order, className } = this.props;
        const { mouseEntered } = this.state;
        // const elements = [];
        //
        // order.forEach((item, index) => {
        //     // const key = `picture-${(+new Date())}-${index}-${item}`;
        //
        //     switch (item) {
        //         case 'image':
        //             // elements.push(<img key={ mouseEntered && animatedSrc ? animatedSrc : src } className="picture-image" src={ mouseEntered && animatedSrc ? animatedSrc : src } alt={ alt } />);
        //             elements.push(<img key={ src } className="picture-image" src={ src } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'none' : 'initial' } } />);
        //             elements.push(<img key={ animatedSrc } className="picture-image" src={ animatedSrc } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'initial' : 'none' } } />);
        //             break;
        //
        //         case 'text':
        //             if (caption) {
        //                 // elements.push(<figcaption key={ key } className="picture-text">{caption}</figcaption>);
        //                 elements.push(<figcaption key={ item } className="picture-text">{caption}</figcaption>);
        //             }
        //             break;
        //         default:
        //     }
        // });

        const elements = order.map(item => {
            switch (item) {
                case 'image':
                    // elements.push(<img key={ mouseEntered && animatedSrc ? animatedSrc : src } className="picture-image" src={ mouseEntered && animatedSrc ? animatedSrc : src } alt={ alt } />);
                    // elements.push(<img key={ src } className="picture-image" src={ src } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'none' : 'initial' } } />);
                    // elements.push(<img key={ animatedSrc } className="picture-image" src={ animatedSrc } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'initial' : 'none' } } />);
                    return (
                        <Fragment key={ item }>
                            <img key={ src } className="picture-image" src={ src } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'none' : 'initial' } } />
                            <img key={ animatedSrc } className="picture-image" src={ animatedSrc } alt={ alt } style={ { display: mouseEntered && animatedSrc ? 'initial' : 'none' } } />
                        </Fragment>
                    );
                    // break;

                case 'text':
                    if (caption) {
                        // elements.push(<figcaption key={ key } className="picture-text">{caption}</figcaption>);
                        return <figcaption key={ item } className="picture-text">{caption}</figcaption>;
                    }
                    break;
                default:
            }

            return null;
        });

        return <figure className={ classNames('picture', className) } ref={ this.container }>{elements}</figure>;
    }
}

export default Picture;
