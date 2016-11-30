'use strict';

require('../lib/matchers.protractor.js');
let YandexPage = require('../pages/yandex-page.js');
let experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');

let browserLogs = require('protractor-browser-logs');

describe('wixPaymentApp yandex Page', () => {

  let yandex;
  let logs;

  beforeEach(() => {
    logs = browserLogs(browser);
  });

  beforeEach(() => {
    yandex = new YandexPage();

    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', () => {});
  });

  afterEach(() => {
    browser.clearMockModules();
    return logs.verify();
  });

  it('should load successfully', () => {
    yandex.navigate();
  });

  it('should show yandex logo', () => {
    expect(yandex.getYandexLogo().isDisplayed()).toBeTruthy();
  });
});
