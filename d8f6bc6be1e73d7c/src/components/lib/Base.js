import React from 'react';

// Base component class
export default class Base extends React.Component {
  static propTypes = {
    t: React.PropTypes.func
  }

  // bind all handle* function props and _ to instance
  autobind() {
    ['_', 'linkToState', 'toggleBooleanState'].forEach(k => {
      this[k] = this[k].bind(this);
    });
    for (const k in this) {
      if (k.startsWith('handle') || k.startsWith('render')) {
        this[k] = this[k].bind(this);
      }
    }
    return this;
  }

  // shortcut to bind boolean state key toggler
  // no more this.setState({foo: !this.state.foo}) routines
  toggleBooleanState(name) {
    return () => {
      const aug = {};
      aug[name] = !this.state[name];
      this.setState(aug);
    };
  }

  // set initial state
  initState(state = this.constructor.initialState || {}) {
    this.state = Object.assign({}, state);
    return this;
  }

  // i18n, state, props shortcuts
  _(s) {
    let ns = this.constructor.i18nNS;
    if (ns) {
      ns += '.';
    }
    return this.props.t(`${ns}${s}`);
  }

  // replacement good 'ol LinkedStateMixin
  linkToState(key, element) {
    const props = {
      value: this.state[key],
      onChange: e => {
        const s = {};
        s[key] = e.target.value;
        this.setState(s);
      }
    };
    return React.cloneElement(element, props);
  }

  constructor() {
    super();
    this.initState().autobind();
  }

  // call on- property if given ("trigger an event")
  trigger(name, ...rest) {
    const f = this.props[`on${name[0].toUpperCase() + name.substring(1)}`];
    if (typeof f !== 'function') {
      console.warn('Trying to trigger unused event');
      return;
    }
    f(...rest);
  }
}
