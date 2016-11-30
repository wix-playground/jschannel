import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import contains from '../../helpers/contains';
import styleMap from '../../styleMap';

export default class FlipCard extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            hasFocus: false,
            isFlipped: this.props.flipped
        };
        this.props = {
            type: 'horizontal',
            flipped: false,
            disabled: false
        };
    }

    componentDidMount() {
        this._hideFlippedSide();
    }

    componentWillReceiveProps(newProps) {
        // Make sure both sides are displayed for animation
        this._showBothSides();

        // Wait for display above to take effect
        setTimeout(() => {
            this.setState({
                isFlipped: newProps.flipped
            });
        }, 0);
    }

    componentWillUpdate(nextProps, nextState) {
        // If card is flipping to back via props, track element for focus
        if (!this.props.flipped && nextProps.flipped) {
            // The element that focus will return to when flipped back to front
            this.focusElement = document.activeElement;
            // Indicates that the back of card needs focus
            this.focusBack = true;
        }

        // If isFlipped has changed need to notify
        if (this.state.isFlipped !== nextState.isFlipped) {
            this.notifyFlip = true;
        }
    }

    componentDidUpdate() {
        // If card has flipped to front, and focus is still within the card
        // return focus to the element that triggered flipping to the back.
        if (!this.props.flipped &&
            this.focusElement &&
            contains(findDOMNode(this), document.activeElement)
        ) {
            this.focusElement.focus();
            this.focusElement = null;
        }
        // Direct focus to the back if needed
        /* eslint brace-style:0 */
        else if (this.focusBack) {
            this.refs.back.focus();
            this.focusBack = false;
        }

        // Notify card being flipped
        if (this.notifyFlip && typeof this.props.onFlip === 'function') {
            this.props.onFlip(this.state.isFlipped);
            this.notifyFlip = false;
        }

        // Hide whichever side of the card is down
        setTimeout(this._hideFlippedSide.bind(this), 600);
    }

    handleFocus() {
        if (this.props.disabled) return;

        this.setState({
            isFlipped: true
        });
    }

    handleBlur() {
        if (this.props.disabled) return;

        this.setState({
            isFlipped: false
        });
    }

    handleKeyDown(e) {
        if (typeof this.props.onKeyDown === 'function') {
            this.props.onKeyDown(e);
        }
    }

    render() {
        return (
            <div style={styleMap.inline.flipCard}
                 className={cx(styleMap.classes.flipCard.call(this))}
                 tabIndex={0}
                 onFocus={this.handleFocus.bind(this)}
                 onBlur={this.handleBlur.bind(this)}
                 onKeyDown={this.handleKeyDown}
            >
                <div className="ReactFlipCard__Flipper">
                    <div className="ReactFlipCard__Front"
                         ref="front"
                         style={styleMap.bgImage(this.props.bgImage)}
                         tabIndex={-1}
                         aria-hidden={this.state.isFlipped}
                    >
                        {this.props.children[0]}
                    </div>
                    <div className="ReactFlipCard__Back"
                         ref="back"
                         tabIndex={-1}
                         aria-hidden={!this.state.isFlipped}
                    >
                        {this.props.children[1]}
                    </div>
                </div>
            </div>
        );
    }

    _showBothSides() {
        this.refs.front.style.display = '';
        this.refs.back.style.display = '';
    }

    _hideFlippedSide() {
        // This prevents the flipped side from being tabbable
        if (this.props.disabled) {
            if (this.state.isFlipped) {
                this.refs.front.style.display = 'none';
            } else {
                this.refs.back.style.display = 'none';
            }
        }
    }
};