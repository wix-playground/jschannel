import React, {PropTypes} from 'react';
import {translate} from 'react-i18next';
import store from '../data/store';
import Base from './lib/Main';
import Step1 from './Step1';
import Step2 from './Step2';
import bi from '../utils/bi';
import css from './Main.scss';


class Main extends Base {
  static i18nNS = 'main'
  static propTypes = {
    loggedIn: PropTypes.bool,
    redirectUrl: PropTypes.string
  }
  static initialState = {
    stepTwo: false,
    isLoading: false,
    output: null
  }

  componentDidMount() {
    bi.log({evtId: 704});
  }

  render() {
    const {_, state, props} = this;
    return (<form
      action={window.__BASENAME__}
      method="POST"
      ref={0}
      >
      <header className={css.header}>
        <span className={css.headline}>{_('title')}</span>
      </header>
      <main className={css.body}>
        {state.stepTwo ?
          <Step2 onBack={() => this.setState({stepTwo: false})} onUpload={this.handleUpload}/> :
          <Step1 onDone={() => this.setState({stepTwo: true})} loggedIn={props.loggedIn}/>
        }
        {state.output ? <output className={css.output}>{state.output}</output> : null}
        {state.isLoading ?
          <div className={css.loading}>{_('loading')}</div> : null}
      </main>
      <footer className={css.footerLinks}>
        <a href="http://www.wix.com/about/privacy" target="_blank" rel="noopener noreferrer">{_('privacyPolicy')}</a>
        <span/>
        <a href={`${window.__STATICS_BASE_URL__}assets/rules.pdf`} target="_blank" rel="noopener noreferrer">{_('contestRules')}</a>
        <span/>
        <a href="http://www.wix.com/share-your-talent/contest/faq" target="_blank" rel="noopener noreferrer">{_('faq')}</a>
      </footer>
    </form>);
  }

  get handleUpload() {
    const {_, props} = this;
    return file => {
      const
        xhr = new XMLHttpRequest(),
        data = new FormData(),
        meta = store.getState().meta;
      data.append('meta', JSON.stringify(meta));
      data.append('file', file);
      xhr.open('POST', window.__BASENAME__, true);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const
            ok = xhr.status === 200,
            {step, meta} = JSON.parse(xhr.responseText);
          const biObj = {
            evtId: 705,
            country: meta.country,
            email: meta.email,
            // eslint-disable-next-line
            full_name: meta.fullName,
            // eslint-disable-next-line
            phone_number: meta.phoneNumber,
            story: meta.description,
            // eslint-disable-next-line
            user_type: 0 + (meta.typeWixUser ? 1 : 0) + (meta.typeCCMember ? 2 : 0),
            // eslint-disable-next-line
            media_file_url: meta.mediaUrl,
            // eslint-disable-next-line
            is_successful_upload: ok ? (step >= 1) : false,
            // eslint-disable-next-line
            is_successful_pro_gallery: ok ? (step >= 2) : false,
            // eslint-disable-next-line
            is_successful_spreadsheet: ok ? (step >= 3) : false,
            result: JSON.stringify(meta)
          };
          bi.log(biObj).then(() => {
            switch (xhr.status) {
              case 200:
                document.location.href = props.redirectUrl;
                break;
              case 413:
                this.setState({output: _('error413')});
                break;
              default:
                this.setState({output: _('error')});
                break;
            }
            setTimeout(() => this.setState({isLoading: false}), 1000);
          });
        }
      };
      this.setState({isLoading: true, output: null});
      xhr.send(data);
    };
  }
}

export default translate(null, {wait: true})(Main);
