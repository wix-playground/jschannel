import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Main from 'components/Main';
import {I18nextProvider} from 'react-i18next';
import {clientFetchUtils} from 'wix-fetch-utils';
import i18n from './i18n';

const basename = window.__BASENAME__;
const locale = window.__LOCALE__;
const baseUrl = window.__STATICS_BASE_URL__;
clientFetchUtils(basename);

function isLoggedIn() {
  return !!document.cookie.split('; ').filter(x => x.startsWith('wixClient')).length;
}

render(
  <I18nextProvider i18n={i18n({locale, baseUrl})}>
    <Main loggedIn={isLoggedIn()} redirectUrl={`//${window.locale || 'www'}.wix.com/share-your-talent/contest/success`}/>
  </I18nextProvider>,
  document.getElementById('root'));
