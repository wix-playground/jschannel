'use strict';

require('../lib/matchers.protractor.js');
let experimentManager = require('../../../app/bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');
let biLoggerTestKit = require('../../../app/bower_components/wix-bi-logger/test/lib/driver.js');
import {MainPage} from '../pages/main-page.js';

describe('wix4allApp Main Page', () => {
  let mainPage;

  beforeEach(() => {
    mainPage = new MainPage();
    experimentManager.setExperiments({});
    browser.addMockModule('wix4allAppMocks', () => {});
  });

  afterEach(() => {
    browser.clearMockModules();
    biLoggerTestKit.assertEmpty();
  });

  it('should load successfully', () => {
    mainPage.navigate();
    expect(mainPage.getTitle().getText()).toEqual('Enjoy coding! - Yeoman');
  });

});
