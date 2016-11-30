import React from 'react';
import Base from './Base';
import css from './Input.scss';

export default class Input extends Base {
  render() {
    const {props, isGiven, isValid, isEmpty} = this;
    return (<div data-error={(isGiven && !isValid) || null} className={css.main} data-empty={isEmpty ? true : null}>
      {props['data-multiline'] ? <textarea ref={0} {...props}/> : <input ref={0} {...props}/>}
      {props['data-label'] ? <label className={css.label} onClick={this.handleLabelClick}>{props['data-label']}</label> : null}
      {isGiven && !isValid ?
        <div><div>{props['data-constraintMessage']}</div></div> : null}
    </div>);
  }

  get isValid() {
    if (!this.props['data-constraint']) {
      return true;
    }
    return this.props['data-constraint'].test(this.props.value);
  }

  get isGiven() {
    return !!this.props.value;
  }

  get isReady() {
    return this.isGiven && this.isValid;
  }

  get isEmpty() {
    return this.props.value === '';
  }

  get handleLabelClick() {
    return () => {
      this.refs[0].focus();
    };
  }
}
