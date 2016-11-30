'use strict';

require('../lib/matchers.protractor.js');
import {MainPage} from '../pages/main-page.js';

describe('siteGeneratorStaticsMetadataApp Main Page', () => {
  let mainPage;

  beforeEach(() => {
    mainPage = new MainPage();
    browser.addMockModule('siteGeneratorStaticsMetadataAppMocks', () => {});
  });

  afterEach(() => {
    browser.clearMockModules();
  });
});
