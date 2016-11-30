import React, {PropTypes} from 'react';
import Base from './Base';
import css from './Checkbox.scss';

export default class Checkbox extends Base {
  static initialState = {
    checked: false
  }
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state.checked = props.value;
  }

  render() {
    const {state, props} = this;
    return (<div data-checked={state.checked ? true : null} className={css.main}>
      <input type="checkbox" checked={state.checked} onChange={this.handleChange}/>
      <span onClick={this.handleChange}/>
      <label onClick={this.handleChange}>{props.label}</label>
    </div>);
  }

  componentWillReceiveProps(props) {
    this.setState({checked: props.value});
  }

  get handleChange() {
    return () => {
      this.setState({checked: !this.state.checked}, () => {
        this.trigger('change', this.state.checked);
      });
    };
  }
}
