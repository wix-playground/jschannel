import React, {PropTypes} from 'react';
import Base from './Base';
import Button from './Button';
import css from './File.scss';
import cssButton from './Button.scss';
import {translate} from 'react-i18next';

class File extends Base {
  static i18nNS = 'file'
  static propTypes = {
    accept: PropTypes.string,
    maxSize: PropTypes.number,
    onChange: PropTypes.func,
    label: PropTypes.string
  }

  constructor(props) {
    super(props);
    if (props.value) {
      this.state.value = props.value;
    }
  }

  render() {
    const {_, props, state, isTooLarge} = this;
    return (<div className={css.main} data-error={isTooLarge ? true : null}>
      {props.label ? <label>{props.label}</label> : null}
      <div>
        <Button className={cssButton.outlinedButton} onClick={this.handleClick}>{_('choose')}</Button>
        <var onClick={this.handleClick}>{state.value ? this.fileName : _('notChosen')}</var>
        {isTooLarge ? <div><div>{_('tooLarge')}</div></div> : null}
      </div>
      <footer className={css.footer}>
        <span>
          <span>{_('requirement1')}</span> <strong>{_('requirement1.only')}</strong>
        </span>
        <span>{_('requirement2')}</span>
      </footer>
      <input
        type="file"
        ref={0}
        accept={props.accept}
        onChange={this.handleChange}
        />
    </div>);
  }

  componentWillReceiveProps(props) {
    this.setState({value: props.value});
  }

  get fileName() {
    if (this.state.value === null) {
      return null;
    }
    return this.state.value.name;
  }

  get handleClick() {
    return () => this.refs[0].click();
  }

  get handleChange() {
    return e => {
      this.setState({value: e.target.files[0]}, () => {
        if (!this.isTooLarge) {
          this.trigger('change', this.state.value);
        }
      });
    };
  }

  get isTooLarge() {
    if (!this.state || !this.state.value) {
      return false;
    }
    return this.state.value.size >= (25 * 1024 * 1024);
  }
}

export default translate(null, {wait: true})(File);
