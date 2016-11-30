import React, {PropTypes} from 'react';
import Base, {Button, Input, File} from './lib/Main';
import {translate} from 'react-i18next';
import store, {actions} from '../data/store';
import css from './Main.scss';
import cssButton from './lib/Button.scss';

class Step2 extends Base {
  static i18nNS = 'step2'
  static propTypes = {
    onUpload: PropTypes.func,
    onBack: PropTypes.func
  }

  constructor(props) {
    super(props);
    const state = store.getState();
    if (state) {
      this.state = {
        description: state.meta.description || '',
        file: state.file || null
      };
    } else {
      this.state = {
        description: null,
        file: null
      };
    }
    this.state.error = null;
  }

  render() {
    const {_, state} = this;
    return (<div className={css.stepWrapper2}>
      <div className={css.subtext}>{_('title')}</div>
      <main>
        <File
          ref={0}
          label={_('imageText')}
          accept="image/x-png, image/gif, image/jpeg"
          maxSize={25 * 1024 * 1024}
          value={this.state.file}
          onChange={file => this.setState({file})}
          />
        <Input
          data-multiline
          data-label={_('descriptionText')}
          onChange={e => this.setState({description: e.target.value})}
          value={this.state.description}
          placeholder={_('descriptionPlaceholder')}
          maxLength="300"
          />
      </main>
      <footer className={css.footer}>
        <div className={css.footerButtons}>
          <Button
            type="submit"
            data-disabled={state.file ? null : true}
            onClick={this.handleSubmit}
            >{_('submit')}</Button>
          <Button
            className={cssButton.linklikeButton}
            onClick={e => {
              e.preventDefault();
              this.trigger('back');
            }}
            type="submit"
            >{_('back')}</Button>
        </div>
        {state.file ?
          <p className={css.footerPostWithSpace}>
            {_('agreement')} <a href="//assets/rules.pdf">{_('agreement.link')}</a>.
          </p> :
          state.error ? <p className={css.footerPostError}>{_('validation')}</p> : null }
      </footer>
    </div>);
  }

  componentDidUpdate() {
    store.dispatch(actions.setDescription(this.state.description));
    store.dispatch(actions.setFile(this.state.file));
  }

  get handleSubmit() {
    return event => {
      event.preventDefault();
      if (this.state.file) {
        this.setState({error: false});
        this.trigger('upload', this.state.file);
      } else {
        this.setState({error: true});
      }
    };
  }
}

export default translate(null, {wait: true})(Step2);
