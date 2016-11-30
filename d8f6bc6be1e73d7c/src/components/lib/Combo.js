import React from 'react';
import Base from './Base';
import Select from 'react-select';
import css from './Combo.scss';

export default class Combo extends Base {
  render() {
    const {props} = this;
    return (<div className={css.main}>
      <Select
        name="country"
        value={props.value}
        options={props.options}
        searchable={false}
        onChange={this.handleChange}
        onInputKeyDown={this.handleInputKeyDown}
        />
      {props['data-label'] ? <label>{props['data-label']}</label> : null}
    </div>);
  }

  get handleChange() {
    return v => {
      this.trigger('change', {target: {value: v ? v.value : null}});
    };
  }

  get handleInputKeyDown() {
    return e => {
      if (e.keyCode === 13) {
        this.trigger('enter');
      }
    };
  }
}
