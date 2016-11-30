import React from 'react';
import Base from './Base';
import css from './Button.scss';

export default class Button extends Base {
  render() {
    const props = Object.assign({}, this.props);
    props.type = props.type || 'button';
    props.className = `${props['data-disabled'] ? css.disabled : ''} ${props.className || css.button}`;
    return <button {...props}/>;
  }
}
