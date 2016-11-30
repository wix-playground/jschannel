import React, {PropTypes} from 'react';
import {translate} from 'react-i18next';
import Base, {Input, Combo, Checkbox, Button} from './lib/Main';
import store, {initial, actions} from '../data/store';
import css from './Main.scss';

const constraintEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const constraintFullName = /(.*[a-z]){2}/i;
const constraintPhoneNumber = /(\D*\d){7,}\D*/i;

class Step1 extends Base {
  static i18nNS = 'step1'
  static countries = ['ARG', 'AUS', 'BRA', 'CAN', 'CHL', 'COL', 'FRA', 'ISR', 'MEX', 'NZL', 'ESP', 'USA', 'GBR', '_']
  static propTypes = {
    onDone: PropTypes.func,
    loggedIn: PropTypes.bool
  }

  constructor(props) {
    super(props);
    const state = store.getState();
    this.state = state ? state.meta : Object.assign({}, initial);
    this.state.error = false;
    if (props.loggedIn) {
      this.state.typeWixUser = true;
    }
  }

  render() {
    const {_, linkToState, state, props, toggleBooleanState} = this;
    const countriesOptions = this.constructor.countries.map(value => {
      return {value, label: _(`country.${value}`)};
    });
    return (<div className={css.stepWrapper}>
      <div className={css.subtext}>{_('title')}</div>
      <main>
        {linkToState('fullName',
          <Input
            ref={1}
            data-label={_('fullName')}
            data-constraint={constraintFullName}
            data-constraintMessage={_('fullNameConstraint')}
            />)}
        {linkToState('email',
          <Input
            ref={0}
            data-label={_('email')}
            data-constraint={constraintEmail}
            data-constraintMessage={_('emailConstraint')}
            />)}
        {linkToState('phoneNumber',
          <Input
            ref={2}
            data-label={_('phoneNumber')}
            data-constraint={constraintPhoneNumber}
            data-constraintMessage={_('phoneNumberConstraint')}
            />)}
        {linkToState('country',
          <Combo
            data-label={_('country')}
            options={countriesOptions}
            onEnter={() => this.submit()}
            />
        )}
        {!props.loggedIn ? <div className={css.checkboxes}>
          <label>{_('type')}</label>
          <Checkbox label={_('type.1')} value={state.typeWixUser} onChange={toggleBooleanState('typeWixUser')}/>
          <Checkbox label={_('type.2')} value={state.typeCCMember} onChange={toggleBooleanState('typeCCMember')}/>
        </div> : null}
      </main>
      <footer className={css.footer}>
        <div className={css.footerButtons}>
          <Button
            ref={0}
            data-disabled={this.isReady ? null : true}
            onClick={this.handleNext}
            type="submit"
            >{_('next')}</Button>
        </div>
        {state.error ? <p className={css.footerPostError}>{_('validation')}</p> : null }
      </footer>
    </div>);
  }

  get handleNext() {
    return e => {
      e.preventDefault();
      this.submit();
    };
  }

  get isReady() {
    const {state} = this;
    return true &&
      state.country &&
      constraintEmail.test(state.email) &&
      constraintFullName.test(state.fullName) &&
      constraintPhoneNumber.test(state.phoneNumber);
  }

  componentDidUpdate() {
    if (this.state.error && this.isReady) {
      // VERY DANGEROUS!
      // eslint-disable-next-line
      this.setState({error: null});
    }
  }

  submit() {
    if (!this.isReady) {
      this.setState({error: true});
      return;
    }
    this.setState({error: false});
    store.dispatch(actions.setUserdata(this.state));
    this.trigger('done');
  }
}

export default translate(['step1'], {wait: true})(Step1);
