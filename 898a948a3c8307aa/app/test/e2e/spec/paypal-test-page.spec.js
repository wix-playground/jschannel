'use strict';

require('../lib/matchers.protractor.js');
let PaypalPage = require('../pages/paypal-page.js');
let experimentManager = require('../../../bower_components/wix-angular/test/lib/experiment-manager-test-kit.js');

let browserLogs = require('protractor-browser-logs');

describe('wixPaymentApp Paypal Page', () => {

  let paypalPage;
  let logs;

  beforeEach(() => {
    logs = browserLogs(browser);
  });

  beforeEach(() => {
    paypalPage = new PaypalPage();

    experimentManager.setExperiments({});
    browser.addMockModule('paymentAppMocks', () => {});
  });

  afterEach(() => {
    browser.clearMockModules();
    return logs.verify();
  });

  it('should load successfully', () => {
    paypalPage.navigate();
  });

  it('should show paypal logo', () => {
    expect(paypalPage.getPaypalLogo().isDisplayed()).toBeTruthy();
  });
});
